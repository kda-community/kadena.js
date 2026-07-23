(module kadena-names GOVERNANCE

  ; --------------------------------------------------------------------------
  ; Schemas and Tables

  ; subdomain-schema
  (defschema subdomain
    name:string
    address:string
  )

  ;define names schema
  (defschema names
    owner:string
    lastPrice:decimal
    expiryDate:time
    subdomains:list
  )

  ;define name map schema
  (defschema name-map
    address:string
    top-level-name:string
  )

  ;define address map schema
  (defschema address-map
    name:string
    top-level-name:string
  )

  ;define sales schema
  (defschema sales
    price:decimal
    sellable:bool
  )

  ;define offers schema
  (defschema offers
    id:string
    lastPrice:decimal
    newOwner:string
    newAddress:string
    name:string
    offerDate:time
  )

  ;define affiliates schema
  (defschema affiliates
    name:string
    feeAddress:string
    fee:decimal
    active:bool
  )

  (deftable names-table:{names})
  (deftable name-map-table:{name-map})
  (deftable address-map-table:{address-map})
  (deftable sales-table:{sales})
  (deftable affiliates-table:{affiliates})
  (deftable offers-table:{offers})


  ; --------------------------------------------------------------------------
  ; Constants

  (defconst BASE_ONEYEAR_PRICE 10.0)
  (defconst BASE_TWOYEAR_PRICE (* (* BASE_ONEYEAR_PRICE 2) 0.95))
  (defconst SUBDOMAIN_PRICE 3.0)
  (defconst UPDATE_PRICE 0.5)
  (defconst SELL_FEE_PERCENTAGE 5.0)
  (defconst EXPIRATION_GRACE_PERIOD 31)
  (defconst VAULT_ACCOUNT "k:2cf3e52a1e9e961257599a5155cc5ef3e836fc8f70b7edf867cfbf45a07d612d")

  (defconst ALLOWED_CHARS:list ["-", "_", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])

  (defconst OFFER_IS_REJECTED "rejected")
  (defconst OFFER_IS_CANCELLED "cancelled")
  (defconst OFFER_IS_SUPERSEDED "superseded")

  ; --------------------------------------------------------------------------
  ; Utils

  (defun curr-time:time ()
    @doc "Returns current chain's block-time in time type"
    (at 'block-time (chain-data)))


  ; --------------------------------------------------------------------------
  ; Capabilities

  (defcap GOVERNANCE ()
    @doc " Give the admin full access to call and upgrade the module. "

    (enforce-keyset "n_32faa22a75da53789d48dcbcb124a11c8f8651a8.kns-admin")
  )

  (defcap ACCOUNT_GUARD (account)
    (enforce-guard (at 'guard (coin.details account)))
  )

  (defcap NAME_AVAILABLE (name:string)
    @doc "Validate if the name is available "

    (with-default-read names-table name
      { "expiryDate": (add-time (curr-time) (days (* -1 EXPIRATION_GRACE_PERIOD))) }
      { "expiryDate":= expiryDate }

      (enforce (>= (curr-time) (add-time expiryDate (days EXPIRATION_GRACE_PERIOD))) "Name not available")
    )
  )

  (defcap NAME_UPSERT (name:string)
    "New name has been added or updated"
    @event
    true
  )

  (defcap ITEM_SOLD (name:string prevOwner:string newOwner:string price:decimal)
    "An item has been sold"
    @event
    true
  )

  (defcap SALE_STATUS_UPDATED (name:string)
    "An item has been put up for and removed from sale"
    @event
    true
  )

  (defcap MAPPING () true)
  (defcap TRANSFER_OWNERSHIP () true)
  (defcap ACCEPT_OFFER () true)
  (defcap OFFER () true)

  (defcap OFFER_MADE (name:string newOwner:string price:decimal offerId:string offerDate:time)
    "An offer has been made"
    @event
    true
  )

  (defcap OFFER_ACCEPTED (offerId:string)
    "An offer has been accepted"
    @event
    true
  )

  (defcap OFFER_REMOVED (offerId:string reason:string)
    "An offer has been rejected"
    @event
    true
  )

  ; --------------------------------------------------------------------------
  ; Offer functions

  (defcap OFFER_PRIVATE:bool (offer-vault-id:string) true)

  (defun offer-escrow-account:string (offer-vault-id:string)
    (create-principal (create-capability-guard (OFFER_PRIVATE offer-vault-id)))
  )

  (defun get-offer-vault-id:string (name:string owner:string)
    (format "{}-{}" [name owner])
  )

  (defun get-offer-id:string (name:string owner:string offerer:string)
   (hash (format "{}-{}-{}-{}" [name owner offerer (curr-time)]))
  )

  ; --------------------------------------------------------------------------
  ; Functions

  (defun enforce-domain (name:string)
    (enforce (= ".kda" (take -4 name)) "Domain should be .kda")
  )

  (defun strip-domain (name:string)
    (drop -4 name)
  )

  (defun enforce-name-is-valid (name:string)
    (enforce (<= (length name) 35) "Maximum 35 characters allowed in name")
    (enforce (!= name "") "Name should not be empty")
    (let*
      (
        (validate-character (lambda (character)
          (enforce (= true (contains character ALLOWED_CHARS)) "No forbidden chars allowed")
        ))
      )
      (map (validate-character) (str-to-list name))
    )
  )

  (defun enforce-active-registration (expiryDate:time)
   (enforce (<= (curr-time) expiryDate) "Registration expired")
  )

  (defun enforce-24h-offer (offerDate:time)
    (enforce (< (add-time offerDate (days 1)) (curr-time)) "Cannot cancel offer within 24 hours")
  )

  (defun enforce-address-is-valid (address:string)
    (enforce-one "Only k: and w: accounts are supported" [
      (enforce (= (take 2 address) "k:") "k:account")
      (enforce (= (take 2 address) "w:") "w:account")
    ])
  )

  (defun enforce-days-is-valid (nrDays:integer)
   (enforce-one "Invalid days" [
     (enforce (= nrDays 365) "One year")
     (enforce (= nrDays 730) "Two years")
   ])
  )

  (defun enforce-address-not-in-use (address:string)
    (with-default-read address-map-table address
      {
        "name" : "",
        "top-level-name" : ""
      }
      {
        "name" := name,
        "top-level-name" := toplevelname
      }

      (with-default-read names-table toplevelname
        { "expiryDate": (add-time (curr-time) (days (* -1 EXPIRATION_GRACE_PERIOD))) }
        { "expiryDate":= expiryDate }

        (enforce-one "Address already in use" [
          (enforce (= name "") "Name is an empty string, so mapping doesn't exist")
          (enforce (>= (curr-time) (add-time expiryDate (days EXPIRATION_GRACE_PERIOD))) "Address map exists but domain has expired")
        ])
      )
    )
  )

  (defun get-price (days:integer)
   (if (= days 365) BASE_ONEYEAR_PRICE BASE_TWOYEAR_PRICE)
  )

  (defun set-mappings (fqn:string toplevelname:string address:string)
    (require-capability (MAPPING))
    (write name-map-table fqn {
      "address": address,
      "top-level-name": toplevelname
    })
    (write address-map-table address {
      "name": fqn,
      "top-level-name": toplevelname
    })
  )

  (defun remove-mappings (fqn:string)
    (require-capability (MAPPING))
    (with-read name-map-table fqn
      {
        "address":= address
      }

      (write name-map-table fqn {
        "address": "",
        "top-level-name": ""
      })

      (write address-map-table address {
        "name": "",
        "top-level-name": ""
      })
    )
  )

  (defun register (owner:string address:string name:string nrDays:integer affiliateId:string)
    (enforce-domain name)
    (enforce-name-is-valid (strip-domain name))
    (enforce-days-is-valid nrDays)
    (enforce-address-is-valid address)
    (enforce-address-not-in-use address)

    (with-capability (NAME_AVAILABLE name)
    (with-capability (ACCOUNT_GUARD owner)
    (with-capability (NAME_UPSERT name)
    (with-capability (MAPPING)

      (if (= "" affiliateId)
        [
          (coin.transfer owner VAULT_ACCOUNT (get-price nrDays))
        ]
        [
          (let* (
            (price (get-price nrDays))
            (affiliateData (get-affiliate-info affiliateId))
            (affiliateAddress (at "feeAddress" affiliateData))
            (affiliateFee (floor (* (/ price 100) (at "fee" affiliateData)) (coin.precision)))
            (priceAfterFees (- price affiliateFee))
          )
            (coin.transfer owner (at "feeAddress" affiliateData) affiliateFee)
            (coin.transfer owner VAULT_ACCOUNT priceAfterFees)
          )
        ]
      )

      ; Clear existing subdomain mapping if available
      (with-default-read names-table name
        { "subdomains": [] }
        { "subdomains":= subdomains }


        (map (remove-mappings) subdomains)
      )

      ; write name information
      (write names-table name {
        "owner": owner,
        "lastPrice": (get-price nrDays),
        "expiryDate": (add-time (curr-time) (days nrDays)),
        "subdomains": []
      })

      ; Set mappings
      (set-mappings name name address)

      ;  Clear open sell order if available
      (with-default-read sales-table name
        { "sellable": false }
        { "sellable":= sellable }

        (if sellable (update sales-table name { "sellable": false }) true)
      )
    ))))
  )

  (defun register-subdomain (address:string name:string subdomain:string)
    (enforce-name-is-valid subdomain)
    (enforce-address-is-valid address)
    (enforce-address-not-in-use address)

    (with-read names-table name
      {
        "owner":= owner,
        "expiryDate":= expiryDate,
        "subdomains":= subdomains
      }
      (enforce-active-registration expiryDate)
      (enforce (= false (contains subdomain subdomains)) "Subdomain already exists")

      (let
        (
          (subfqn (format "{}.{}" [subdomain name]))
        )

        (with-capability (ACCOUNT_GUARD owner)
        (with-capability (NAME_UPSERT subfqn)
        (with-capability (MAPPING)

          (coin.transfer owner VAULT_ACCOUNT SUBDOMAIN_PRICE)

          (update names-table name {
            "subdomains": (+ [subfqn] subdomains)
          })

          ; Set mappings
          (set-mappings subfqn name address)
      ))))
    )
  )

  (defun remove-subdomain (name:string subdomain:string)
    (with-read names-table name
      {
        "owner":= owner,
        "expiryDate":= expiryDate,
        "subdomains":= subdomains
      }
      (enforce-active-registration expiryDate)
      (enforce (contains subdomain subdomains) "Subdomain doesn't exist")

      (with-capability (ACCOUNT_GUARD owner)
      (with-capability (NAME_UPSERT subdomain)
      (with-capability (MAPPING)

        (update names-table name {
          "subdomains": (filter (!= subdomain) subdomains)
        })

        ; Clear mappings
        (remove-mappings subdomain)
      )))
    )
  )

  (defun update-address (address:string name:string)
    (with-read name-map-table name
      {
        "top-level-name":= toplevelname
      }

      (with-read names-table toplevelname
        {
          "owner":= owner,
          "expiryDate":= expiryDate
        }

        (with-capability (ACCOUNT_GUARD owner)
        (with-capability (MAPPING)
          (enforce-active-registration expiryDate)
          (enforce-address-is-valid address)
          (enforce-address-not-in-use address)

          (coin.transfer owner VAULT_ACCOUNT UPDATE_PRICE)

          ; Remove existing mappings and set new mappings
          (remove-mappings name)
          (set-mappings name toplevelname address)
        ))
      ))
  )

  (defun renew (name:string nrDays:integer)
    (enforce-name-is-valid (strip-domain name))
    (enforce-days-is-valid nrDays)
    (with-read names-table name
      {
        "owner":= owner,
        "expiryDate":= expiryDate
      }

      (enforce (<= (curr-time) (add-time expiryDate (days EXPIRATION_GRACE_PERIOD))) "Grace period expired, unable to renew")

      (with-capability (ACCOUNT_GUARD owner)
      (with-capability (NAME_UPSERT name)
        (coin.transfer owner VAULT_ACCOUNT (get-price nrDays))

        (update names-table name {
          "expiryDate": (add-time expiryDate (days nrDays))
        })
      )))
  )

  (defun put-up-for-sale(name:string price:decimal)
    (with-read names-table name
      {
        "owner":= owner,
        "expiryDate":= expiryDate
      }

      (with-capability (ACCOUNT_GUARD owner)
      (with-capability (SALE_STATUS_UPDATED name)
        (enforce-active-registration expiryDate)
        (enforce (> price 0.0) "Price must be greather than 0")

        (write sales-table name {
          "price": price,
          "sellable": true
        })
      ))
    )
  )

  (defun remove-from-sale(name:string)
    (with-read names-table name
      {
        "owner":= owner,
        "expiryDate":= expiryDate
      }

      (with-capability (ACCOUNT_GUARD owner)
      (with-capability (SALE_STATUS_UPDATED name)
        (enforce-active-registration expiryDate)

        (update sales-table name {
          "sellable": false
        })
      ))
    )
  )

  (defun remove-offer (name:string)
   (require-capability (OFFER))
   (update offers-table name {
     "id": "",
     "lastPrice": 0.0,
     "newOwner": "",
     "newAddress": "",
     "name": "",
     "offerDate": (time "1970-01-01T00:00:00Z")
   })
  )

  (defun make-offer(name:string newOwner:string newAddress:string price:decimal)
    (with-read names-table name
      {
        "owner":= owner,
        "expiryDate":= expiryDate
      }
      (enforce-active-registration expiryDate)
      (enforce (> price 0.0) "Offer can not be negative")


        (let ((offer-vault-id:string (get-offer-vault-id name owner)))
        (let ((offer-id:string (get-offer-id name owner newOwner)))
          (with-default-read offers-table name
            {
              "id": "",
              "lastPrice": 0.0,
              "newOwner": ""
            }
            {
              "id":= previous-offer-id,
              "lastPrice":= refundAmount,
              "newOwner":= refundAddress
            }

            (enforce (> price refundAmount) "Offer should be higher than current offer")

            (if (!= "" refundAddress)
              [
                (with-capability (OFFER_PRIVATE offer-vault-id)
                  (install-capability (coin.TRANSFER (offer-escrow-account offer-vault-id) refundAddress refundAmount))
                  (coin.transfer (offer-escrow-account offer-vault-id) refundAddress refundAmount)
                  (with-capability (OFFER)
                    (remove-offer name)
                  )
                  (emit-event (OFFER_REMOVED previous-offer-id OFFER_IS_SUPERSEDED))
                )
              ]
              []
            )
          )

          (coin.transfer-create newOwner (offer-escrow-account offer-vault-id) (create-capability-guard (OFFER_PRIVATE offer-vault-id)) price)


          (write offers-table name {
            "id": offer-id,
            "lastPrice": price,
            "newOwner": newOwner,
            "newAddress": newAddress,
            "name": name,
            "offerDate": (curr-time)
          })
          (emit-event (OFFER_MADE name newOwner price offer-id (curr-time)))
        )

      )
    )
  )


  (defun reject-offer(name:string)
    (with-read offers-table name
      {
        "id":= offer-id,
        "lastPrice":= refundAmount,
        "newOwner":= refundAddress
      }

      (with-read names-table name
        {
          "owner":= owner,
          "expiryDate":= expiryDate
        }

        (with-capability (ACCOUNT_GUARD owner)
          (let ((offer-vault-id:string (get-offer-vault-id name owner)))
            (with-capability (OFFER_PRIVATE offer-vault-id)
              (install-capability (coin.TRANSFER (offer-escrow-account offer-vault-id) refundAddress refundAmount))
              (coin.transfer (offer-escrow-account offer-vault-id) refundAddress refundAmount)
              (with-capability (OFFER)
                (remove-offer name)
              )
              (emit-event (OFFER_REMOVED offer-id OFFER_IS_REJECTED))
            )
          )
        )
      )
    )
  )

  (defun cancel-offer(name:string)
    (with-read offers-table name
      {
        "id":= offer-id,
        "lastPrice":= refundAmount,
        "newOwner":= refundAddress,
        "offerDate":= offerDate
      }

      (with-read names-table name
        {
          "owner":= owner,
          "expiryDate":= expiryDate
        }

        (enforce-24h-offer offerDate)
        (with-capability (ACCOUNT_GUARD refundAddress)
          (let ((offer-vault-id:string (get-offer-vault-id name owner)))
            (with-capability (OFFER_PRIVATE offer-vault-id)
              (install-capability (coin.TRANSFER (offer-escrow-account offer-vault-id) refundAddress refundAmount))
              (coin.transfer (offer-escrow-account offer-vault-id) refundAddress refundAmount)
              (with-capability (OFFER)
                (remove-offer name)
              )
              (emit-event (OFFER_REMOVED offer-id OFFER_IS_CANCELLED))
            )
          )
        )
      )
    )
  )

  (defun buy-name(name:string newOwner:string newAddress:string)
    (with-read sales-table name
      {
        "price":= price,
        "sellable":= sellable
      }
      (enforce sellable "Name not for sale")
      (enforce-address-is-valid newAddress)
      (enforce-address-not-in-use newAddress)

      (with-capability (ACCOUNT_GUARD newOwner)
      (with-read names-table name
        {
          "owner":= owner,
          "expiryDate":= expiryDate,
          "subdomains":= subdomains
        }
        (enforce-active-registration expiryDate)

          (with-capability (ITEM_SOLD name owner newOwner price)
            (let*
              (
                (feeAmount (floor (* (/ price 100) SELL_FEE_PERCENTAGE) (coin.precision)))
              )
              (coin.transfer newOwner owner (- price feeAmount))
              (coin.transfer newOwner VAULT_ACCOUNT feeAmount)
            )
            (with-capability (TRANSFER_OWNERSHIP)
              (transfer-ownership name newOwner newAddress price)
            )
        )))
    )
  )

  (defun accept-offer(name:string)
    (with-read offers-table name
      {
        "id":= offer-id,
        "lastPrice":= price,
        "newOwner":= newOwner,
        "newAddress":= newAddress
      }

      (enforce-address-is-valid newAddress)
      (enforce-address-not-in-use newAddress)

      (with-read names-table name
        {
          "owner":= owner,
          "expiryDate":= expiryDate,
          "subdomains":= subdomains
        }

        (enforce-active-registration expiryDate)
        (with-capability (ACCOUNT_GUARD owner)
          (with-capability (ITEM_SOLD name owner newOwner price)
            (let*
              (
                (feeAmount (floor (* (/ price 100) SELL_FEE_PERCENTAGE) (coin.precision)))
              )
              (let ((offer-vault-id:string (get-offer-vault-id name owner)))
                (with-capability (OFFER_PRIVATE offer-vault-id)
                  (install-capability (coin.TRANSFER (offer-escrow-account offer-vault-id) owner (- price feeAmount)))
                  (coin.transfer (offer-escrow-account offer-vault-id) owner (- price feeAmount))

                  (install-capability (coin.TRANSFER (offer-escrow-account offer-vault-id) VAULT_ACCOUNT feeAmount))
                  (coin.transfer (offer-escrow-account offer-vault-id) VAULT_ACCOUNT feeAmount)

                  (with-capability (OFFER)
                    (remove-offer name)
                  )
                  (emit-event (OFFER_ACCEPTED offer-id))
                )
              )
            )
            (with-capability (TRANSFER_OWNERSHIP)
              (transfer-ownership name newOwner newAddress price)
            )
          )
      )))
  )


  (defun transfer-ownership(name:string newOwner:string newAddress:string price:decimal)
    (require-capability (TRANSFER_OWNERSHIP))

    (with-default-read sales-table name
      { "sellable": false }
      { "sellable":= sellable }

      (if sellable (update sales-table name { "sellable": false }) true)
    )

    (with-read names-table name
      {
        "subdomains":= subdomains
      }

      (with-capability (MAPPING)
        ; Remove mappings for existing subdomains
        (map (remove-mappings) subdomains)

        ; Add mapping for new address
        (set-mappings name name newAddress)
      )

      (update names-table name {
        "owner": newOwner,
        "lastPrice": price,
        "subdomains": []
      })
    )
  )

  (defun get-name-info (name:string)
    (with-default-read names-table name {
      "owner": "",
      "lastPrice": 0.0,
      "expiryDate": 0,
      "subdomains": []
    }
    {
      "owner":= owner,
      "lastPrice":= lastPrice,
      "expiryDate":= expiryDate,
      "subdomains":= subdomains
    }

    (if (= owner "") false { "expiryDate": expiryDate, "lastPrice": lastPrice, "owner": owner, "subdomains": subdomains })
    )
  )

  (defun get-offer-info (name:string)
    (with-default-read offers-table name {
      "id": "",
      "lastPrice": 0.0,
      "newOwner": "",
      "newAddress": "",
      "name": "",
      "offerDate": 0
    }
    {
      "id":= id,
      "lastPrice":= lastPrice,
      "newOwner":= newOwner,
      "newAddress":= newAddress,
      "name":= name,
      "offerDate":= offerDate
    }

    (if (= newOwner "") false { "lastPrice": lastPrice, "newOwner": newOwner, "newAddress": newAddress, "name": name, "offerDate": offerDate })
    )
  )

  (defun get-sale-state (name:string)
    (with-default-read sales-table name
      {
        "sellable": false,
        "price": 0.0
      }
      {
        "sellable":= sellable,
        "price":= price
      }
      { "sellable": sellable, "price": price }
    )
  )

  (defun get-base-info ()
    {
      "oneYearPrice": BASE_ONEYEAR_PRICE,
      "twoYearPrice": BASE_TWOYEAR_PRICE,
      "subdomainPrice": SUBDOMAIN_PRICE,
      "updatePrice": UPDATE_PRICE,
      "sellFeePercentage": SELL_FEE_PERCENTAGE,
      "expirationGracePeriod": EXPIRATION_GRACE_PERIOD,
      "vaultAccount": VAULT_ACCOUNT
    }
  )

  ; --------------------------------------------------------------------------
  ; Resolver Functions

  (defun get-address (name: string)
    (with-read name-map-table name
      {
        "address":= address,
        "top-level-name":= toplevelname
      }
      (with-read names-table toplevelname
      {
        "expiryDate":= expiryDate
      }
      (enforce-active-registration expiryDate)
      address
    )
    )
  )

  (defun get-name (address: string)
    (with-read address-map-table address
      {
      "name":= name,
      "top-level-name":= toplevelname
      }
      (with-read names-table toplevelname
        {
          "expiryDate":= expiryDate
        }
        (enforce-active-registration expiryDate)
        name
      )
    )
  )

  ; --------------------------------------------------------------------------
  ; Reserved names

  (defun reserve-name (name:string)
    (with-capability (GOVERNANCE)
    (with-capability (NAME_AVAILABLE name)
      (enforce-domain name)
      (enforce-name-is-valid (strip-domain name))

      (write names-table name {
        "owner": VAULT_ACCOUNT,
        "lastPrice": 0.0,
        "expiryDate": (add-time (curr-time) (days 365)),
        "subdomains": []
      })
    ))
  )

  (defun transfer-reserved-name (name:string recipient:string)
    (with-capability (GOVERNANCE)
    (with-capability (NAME_UPSERT name)
    (with-capability (MAPPING)
      (enforce-address-is-valid recipient)
      (enforce-address-not-in-use recipient)
      (update names-table name {
        "owner": recipient,
        "lastPrice": BASE_ONEYEAR_PRICE
      })

      (set-mappings name name recipient)
    )))
  )

  (defun trigger-events (name:string)
    (with-capability (GOVERNANCE)
    (with-capability (NAME_UPSERT name)
    (with-capability (SALE_STATUS_UPDATED name)
    true
    )))
  )

  ; --------------------------------------------------------------------------
  ; Afilliate Functions

  (defun create-affiliate-id (affiliateName:string)
    (hash (format "{}{}" [affiliateName (at 'block-time (chain-data))]))
  )

  (defun add-affiliate (affiliateName:string feeAddress:string fee:decimal)
    (with-capability (GOVERNANCE)
      (enforce (> fee 0.0) "Fee must be greater than 0")
      (enforce-address-is-valid feeAddress)

      (let ((affiliateId (create-affiliate-id affiliateName)))
        (insert affiliates-table affiliateId {
          "name": affiliateName,
          "feeAddress": feeAddress,
          "fee": fee,
          "active": true
        })
        affiliateId
      )
    )
  )

  (defun disable-affiliate (affiliateId:string)
    (with-capability (GOVERNANCE)
      (update affiliates-table affiliateId {
        "active": false
      })
    )
  )

  (defun get-affiliate-info (affiliateId:string)
    (with-read affiliates-table affiliateId
      {
        "fee":= fee,
        "feeAddress":= feeAddress,
        "active":= active
      }
      (enforce active "Affiliate is not active")
      { "fee": fee, "feeAddress": feeAddress }
    )
  )
)

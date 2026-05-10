export interface ISignature {
  sig: string | undefined;
}

export interface ISignedSignatureWithHash extends ISignature {
  hash: string;
  sig: string | undefined;
  pubKey: string;
}

export interface IUnsignedSignatureWithHash extends ISignature {
  hash: string;
  sig: string | undefined;
  pubKey?: string;
}

export type SignatureWithHash =
  | ISignedSignatureWithHash
  | IUnsignedSignatureWithHash;

export type SignCommand = SignatureWithHash;

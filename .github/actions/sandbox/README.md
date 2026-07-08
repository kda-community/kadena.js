# Start Devnet Node

Build and start a Devnet Node

After the tests, node should be killed.

**Common parameters:**
- ``ghc_version``: GHC version used to build

- ``node_git_ref``: Git reference of chainweb (branch tag or commit Hash)

- ``node_gitmining_client_git_ref_ref``: Git reference of the Mining client (branch tag or commit Hash)

## Examples

#### Typical Use Case

```yaml
  - name: Start devnet
    uses: ./.github/actions/sandbox
    with:
      node_git_ref: master
      mining_client_git_ref: master
```

#### Cleaning

```yaml
  - name: Kill Kadena Sandbox
    run: kill $(cat "$SANDBOX_RUN/pids")
```
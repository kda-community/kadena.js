# Start Devnet Node

Build and start a Data node, with an associated PostgreSQL Database,
listenning on Port 1849.

A normal devnet node should be started first

**Common parameters:**
- ``ghc_version``: GHC version used to build

- ``git_ref``: Git reference of chainweb-data (branch tag or commit Hash)

- ``extra_migration_dir``: Directory containing some migrations SQL scripts.


## Examples

#### Typical Use Case

```yaml
  - name: Start Data node
    uses: ./.github/actions/sandbox_data_node
    with:
      git_ref: master
```

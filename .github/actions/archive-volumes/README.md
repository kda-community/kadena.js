# Archive Devnet Volume

Archive the node data for a Sandbox devnet node.

- logs
- databases (RocksDB + Pact state)

The action automatically shutdowns the node if necessary

## Examples

#### Typical Use Case

```yaml
  - name: Start devnet
    uses: ./.github/actions/archive-volumes
    if: always()
      with:
        test-object: "my_test"
```
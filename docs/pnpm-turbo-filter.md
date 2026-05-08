# Filters

Both pnpm and Turborepo have a `--filter` argument.

**tl/dr;** Start commands with `pnpm run [cmd]` or `pnpm turbo [cmd]` to use
Turborepo and its filtering options. See their docs for all options and syntax:

- pnpm docs: [Filtering][1]
- Turborepo docs: [Filtering Workspaces][2]

## pnpm

To run the test script of a specific package(s), bypassing Turborepo entirely:

```sh
pnpm --filter <package_selector> <command>
```

These commands all do the same, the `--filter` argument is provided to `pnpm`:

```sh
pnpm --filter @kda-community/client test
pnpm --filter @kda-community/client run test
pnpm test --filter @kda-community/client
pnpm run --filter @kda-community/client test
```

There are also ways to include dependencies, select up to and/or including a
certain package, packages changed since the `main` branch, etc. You can use
multiple filters. Refer to the pnpm docs for all the goodies.

## Turborepo

To use Turborepo, automatically include dependencies of the target package and
enjoy caching:

```sh
pnpm run test --filter @kda-community/client
```

The `pnpm run test` makes sure the `test` script from the root `package.json`
are used. You can also execute the `turbo` executable directly to do the same:

```sh
pnpm turbo test --filter @kda-community/client
pnpm turbo --filter @kda-community/client test
```

The filter syntax is inspired by pnpm's, but it's not the same thing. See the
Turborepo docs for details.

## Bypass Turborepo cache

To force Turborepo to bypass the cache:

```sh
pnpm turbo build --force
```

[1]: https://pnpm.io/filtering
[2]: https://turbo.build/repo/docs/core-concepts/monorepos/filtering

import type { CodegenConfig } from '@graphql-codegen/cli';
import * as fs from 'node:fs';

const config: CodegenConfig = {
  // @todo: update uri to community edition one
  schema: 'https://graph.testnet.kadena.network/graphql',
  documents: ['src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      config: { useTypeImports: true },
    },
  },
  config: {
    scalars: {
      BigInt: 'number',
      DateTime: 'string',
    },
  },
  hooks: {
    afterAllFileWrite(...files: string[]) {
      for (const filePath of files) {
        const content: string = fs.readFileSync(filePath, 'utf-8');
        const replaced = content
          .replace(
            "import * as types from './graphql';",
            "import * as types from './graphql.js';",
          )
          .replace(
            "import type { Incremental } from './graphql';",
            "import type { Incremental } from './graphql.js';",
          )
          .replace(
            'export * from "./fragment-masking";',
            'export * from "./fragment-masking.js";',
          )
          .replace('export * from "./gql";', 'export * from "./gql.js";');
        fs.writeFileSync(filePath, replaced);
      }
    },
  },
};
export default config;

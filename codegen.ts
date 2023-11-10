import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://docs.github.com/public/schema.docs.graphql',
  documents: ['src/**/*.graphql', 'src/**/*.tsx', '!src/gql/**/*'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {

      },
      plugins: [
      // 'typescript',
      //'typescript-operations',
      //'typescript-urql'
      ],
    },

  },
  //hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
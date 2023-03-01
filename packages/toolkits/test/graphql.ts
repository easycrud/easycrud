import {makeExecutableSchema} from '@graphql-tools/schema';
import {expect, test} from '@jest/globals';
import {schemaToGraphQL} from '../src/converter';
import {getUserDef} from './helper';

const schema = makeExecutableSchema({
  typeDefs: `
    type Users {
      id: ID!
      username: String
      email: String
      password: String
      updateTime: String
    }
  `,
});

test('schemaToGraphQL', async () => {
  expect(schemaToGraphQL(await getUserDef())).toEqual(schema);
});

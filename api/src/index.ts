import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/type-defs';
import { resolvers } from './schema/resolvers';
import { context } from './schema/context';

const server = new ApolloServer({ typeDefs, resolvers, context });
const { PORT } = process.env;

server.listen(PORT).then(({ url }) => {
  console.log(`GraphQL Server is running on ${url}graphql`);
});

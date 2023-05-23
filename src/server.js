import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

import fetch from "node-fetch";

// marvel(id: Int!): character
const typeDefs = `#graphql
  type Query {
    allMarvels: [character!]!
    hello: String
  }

  type items {
    name: String!
  }

  type comic {
    available: Int!
    items: [items!]!
  }

  type thumb {
    path: String!
  }

  type character {
    id: String!
    name: String!
    description: String!
    thumbnail: thumb
    comics: comic
  }
`;

const resolvers = {
  Query: {
    allMarvels() {
      return fetch(
        "https://marvel-proxy.nomadcoders.workers.dev/v1/public/characters?limit=100&orderBy=modified&series=24229,1058,2023"
      )
        .then((response) => response.json())
        .then((json) => json.data.results);
    },
    hello: () => "world",
    // marvel(_, { id }) {
    //   return fetch(
    //     `https://marvel-proxy.nomadcoders.workers.dev/v1/public/characters/${id}`
    //   )
    //     .then((response) => response.json())
    //     .then((json) => json.data.results);
    // },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler()
);

// server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
//   console.log(`Running on ${url}`);
// });

// "{\"operationName\": null, \"variables\": null, \"query\": \"{ allMarvels }\"}"

import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

const typeDefs = gql`
  type Query {
    allMarvels: [character!]!
    marvel(id: Int!): character
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
    marvel(_, { id }) {
      return fetch(
        `https://marvel-proxy.nomadcoders.workers.dev/v1/public/characters/${id}`
      )
        .then((response) => response.json())
        .then((json) => json.data.results);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

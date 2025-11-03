const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const http = require("http");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws"); // graphql-ws v5
const { resolvers } = require("./resolvers/chats");
const { execute, subscribe } = require("graphql");

const typeDefs = gql`
  type Chat {
    id: Int!
    name: String!
    message: String!
  }
  type Query {
    getChats: [Chat!]!
  }
  type Mutation {
    createChat(name: String!, message: String!): Chat!
  }
  type Subscription {
    messageSent: Chat!
  }
`;

async function startServer() {
  const app = express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  const httpServer = http.createServer(app);

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, cors: false });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  useServer({ schema: server.schema, execute, subscribe }, wsServer);

  const PORT = process.env.PORT || 9000;
  httpServer.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startServer();

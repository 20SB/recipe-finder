// src\index.ts
import * as dotenv from "dotenv";
dotenv.config();
import { ApolloError, ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolver";
import jwt from "jsonwebtoken";

const SECRET_KEY = "mysecretkey";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    if (req.body && req.body.query && req.body.query.includes('__schema')) {
      return {};
    }
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return { user: null };
    }
    try {
      const user = jwt.verify(token, SECRET_KEY);
      return { user };
    } catch (error) {
      throw new ApolloError("Unauthorized", "UNAUTHORIZED");
    }
  },
  introspection: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

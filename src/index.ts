import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core/dist/plugin/drainHttpServer";
import express from "express";
import http from "http";
import typeDefs from "./schema";
import resolvers from "./resolvers/index";
import cors from "cors";
import { DocumentNode } from "graphql";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const startApolloServer = async (typeDefs: DocumentNode, resolvers: any) => {
  const app = express();

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    next();
  });

  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://bubble.pistolalex.com"]
          : ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use(express.json({ limit: "650kb" }));
  app.use(express.urlencoded({ limit: "650kb", extended: true }));

  app.use(cookieParser());

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://bubble.pistolalex.com"]
          : ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    },
  });

  const port = process.env.PORT || 5001;

  await mongoose.connect(
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI!
      : "mongodb://localhost:27017/instagramDB",
    async () => {
      console.log(
        process.env.NODE_ENV === "production"
          ? "🚀 Database connected"
          : "🚀 Development Database connected"
      );
      await new Promise<void>((resolve) =>
        httpServer.listen({ port }, resolve)
      );
      console.log(`🚀 Server running at http://localhost:${port}/graphql`);
    }
  );
};

startApolloServer(typeDefs, resolvers);

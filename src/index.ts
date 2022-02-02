import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import typeDefs from './schema';
import resolvers from './resolvers/index';
import cors from 'cors';
import { DocumentNode } from 'graphql';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const startApolloServer = async (typeDefs: DocumentNode, resolvers: any) => {
  const app = express();
  app.use(
    cors({
      origin: ['http://localhost:8080', 'https://studio.apollographql.com'],
      credentials: true,
    })
  );

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
      origin: ['http://localhost:8080', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  const port = process.env.PORT || 5000;

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server running at http://localhost:${port}/graphql`);

  await mongoose.connect(process.env.MONGO_URI!, () => {
    console.log('🚀 Database connected');
  });
};

startApolloServer(typeDefs, resolvers);

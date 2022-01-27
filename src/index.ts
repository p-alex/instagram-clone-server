import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import typeDefs from './schema';
import resolvers from './resolvers/index';
import { DocumentNode } from 'graphql';
import mongoose from 'mongoose';
dotenv.config();

const startApolloServer = async (typeDefs: DocumentNode, resolvers: any) => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  const port = process.env.PORT || 5000;

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server running at http://localhost:${port}`);

  await mongoose.connect(process.env.MONGO_URI!, () => {
    console.log('🚀 Database connected');
  });
};

startApolloServer(typeDefs, resolvers);

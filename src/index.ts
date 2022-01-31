import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import typeDefs from './schema';
import resolvers from './resolvers/index';
import cors from 'cors';
import { DocumentNode } from 'graphql';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import refreshToken from './routes/refreshToken';
dotenv.config();

const startApolloServer = async (typeDefs: DocumentNode, resolvers: any) => {
  const app = express();

  app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
  app.use(cookieParser());

  const httpServer = http.createServer(app);

  app.use('/', refreshToken);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
    cors: {
      origin: 'http://localhost:8080',
      credentials: true,
    },
  });

  const port = process.env.PORT || 5000;

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server running at http://localhost:${port}`);

  await mongoose.connect(process.env.MONGO_URI!, () => {
    console.log('🚀 Database connected');
  });
};

startApolloServer(typeDefs, resolvers);

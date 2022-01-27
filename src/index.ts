import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import typeDefs from './schema';
import resolvers from './resolvers/index';
import { DocumentNode } from 'graphql';

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
  console.log(`🚀 Server started at http://localhost:${port}`);
};

startApolloServer(typeDefs, resolvers);

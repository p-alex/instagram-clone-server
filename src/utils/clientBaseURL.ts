export const clientBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://bubble.pistolalex.com'
    : 'http://localhost:3000';

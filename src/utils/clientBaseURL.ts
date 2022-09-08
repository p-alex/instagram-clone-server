export const clientBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://bubble-social-media-app.vercel.app'
    : 'http://localhost:3000';

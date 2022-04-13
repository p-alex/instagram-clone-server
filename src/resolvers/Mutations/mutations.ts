import auth from './auth';
import comment from './comment';
import post from './post';
import user from './user';
const Mutation = {
  ...auth,
  ...post,
  ...comment,
  ...user,
};
export default Mutation;

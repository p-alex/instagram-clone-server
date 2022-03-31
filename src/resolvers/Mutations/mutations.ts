import auth from './auth';
import comment from './comment';
import post from './post';
const Mutation = {
  ...auth,
  ...post,
  ...comment,
};
export default Mutation;

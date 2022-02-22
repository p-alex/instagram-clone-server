import auth from './auth';
import post from './post';
const Mutation = {
  ...auth,
  ...post,
};
export default Mutation;

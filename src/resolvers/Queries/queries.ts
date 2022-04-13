import comments from './comments';
import posts from './posts';
import users from './users';
import suggestions from './suggestions';
const Query = {
  ...posts,
  ...users,
  ...comments,
  ...suggestions,
};

export default Query;

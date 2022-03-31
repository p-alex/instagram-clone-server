import comments from './comments';
import posts from './posts';
import users from './users';

const Query = {
  ...posts,
  ...users,
  ...comments,
};

export default Query;

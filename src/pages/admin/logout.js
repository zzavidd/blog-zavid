import { useDispatch } from 'react-redux';

import { clearUser } from 'lib/reducers';

export default () => {
  const dispatch = useDispatch();
  dispatch(clearUser());
  setTimeout(() => {
    location.href = '/';
  }, 2000);
  return '';
};
import { useSelector } from 'react-redux';
import Login from '../pages/Login';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.value);

  if (!user?.username) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;

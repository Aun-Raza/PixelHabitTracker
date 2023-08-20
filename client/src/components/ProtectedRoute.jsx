import { useSelector } from 'react-redux';
import Login from '../components/Login';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.value);

  if (!user?.username) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;

import NavBar from './components/NavBar';
import PixelTracker from './pages/PixelTracker';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { setUser } from './utils/feature';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from './utils/graphql';

function App() {
  const dispatch = useDispatch();
  const { data: userData } = useQuery(QUERY_USER);

  if (userData) {
    const { username, points } = userData.user;
    dispatch(setUser({ username, points }));
  }

  return (
    <div className='App mx-auto'>
      <NavBar />
      <ProtectedRoute>
        <PixelTracker />
      </ProtectedRoute>
    </div>
  );
}

export default App;

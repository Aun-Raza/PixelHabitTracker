import NavBar from './components/NavBar';
import PixelTracker from './components/PixelTracker';
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { login } from './features/user';

function App() {
  const [points, setPoints] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (!token) return;

    const decoded = jwt_decode(token);
    if (!decoded) return;

    dispatch(login({ username: decoded.username, points: 0 }));
  }, []);

  function handlePointChange(newPoints) {
    const totalPoints = points + newPoints;
    setPoints(totalPoints);
  }

  return (
    <div className='App container mx-auto'>
      <NavBar points={points} />
      <ProtectedRoute>
        <PixelTracker onPointChange={handlePointChange} />
      </ProtectedRoute>
    </div>
  );
}

export default App;

import NavBar from './components/NavBar';
import PixelTracker from './components/PixelTracker';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [points, setPoints] = useState(0);

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

import './App.css';
import NavBar from './components/NavBar';
import PixelTracker from './components/PixelTracker';
import { useState } from 'react';

function App() {
  const [points, setPoints] = useState(0);

  function handlePointChange(newPoints) {
    const totalPoints = points + newPoints;
    console.log(totalPoints);
    setPoints(totalPoints);
  }

  return (
    <div className='App container mx-auto'>
      <NavBar points={points} />
      <PixelTracker onPointChange={handlePointChange} />
    </div>
  );
}

export default App;

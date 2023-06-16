import TrophyIcon from '../images/TrophyIcon';
import ProfileIcon from '../images/ProfileIcon';
import ArrowIcon from '../images/ArrowIcon';
import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const NavBar = ({ points }) => {
  const [pointsValue, setPointsValue] = useState(points);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0);
    const timeoutId = setTimeout(() => {
      setPointsValue(points);
      setOpacity(1);
    }, 500); // duration of the transition

    return () => clearTimeout(timeoutId);
  }, [points]);

  return (
    <div className='flex justify-between px-3'>
      {/* Left Side */}
      <div className='flex gap-2 items-center mt-2'>
        <div className='w-12 h-12 bg-blueBlock' />
        <div>
          <h1 className='font-bold text-2xl'>Pixel</h1>
          <p className='hidden md:block'>Habit Tracker App</p>
        </div>
      </div>
      {/* Right Size  */}
      <div className='flex gap-5'>
        <div className='flex items-center gap-2'>
          <TrophyIcon />
          <p
            className='text-xl font-bold'
            style={{ transition: 'opacity 0.5s', opacity: opacity }}
          >
            {pointsValue}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <ProfileIcon />
          <p className='text-xl font-bold'>User</p>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
};

export default NavBar;

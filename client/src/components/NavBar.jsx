import TrophyIcon from '../images/TrophyIcon';
import ProfileIcon from '../images/ProfileIcon';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user';

// eslint-disable-next-line react/prop-types
const NavBar = ({ points }) => {
  const [pointsValue, setPointsValue] = useState(points);
  const [opacity, setOpacity] = useState(1);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpacity(0);
    const timeoutId = setTimeout(() => {
      setPointsValue(points);
      setOpacity(1);
    }, 500); // duration of the transition

    return () => clearTimeout(timeoutId);
  }, [points]);

  const onLogout = () => {
    localStorage.setItem('Authorization', '');
    dispatch(logout({}));
  };

  return (
    <div className='flex justify-between shadow-md px-5 pt-1 pb-2'>
      {/* Left Side */}
      <div className='flex gap-2 items-center mt-2'>
        <div className='w-12 h-12 bg-blueBlock' />
        <div>
          <h1 className='font-bold text-2xl'>Pixel</h1>
          <p className='hidden md:block'>Habit Tracker App</p>
        </div>
      </div>
      {/* Right Size  */}
      {user?.username && (
        <div className='flex gap-5 py-2'>
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
            <p className='font-bold text-sm'>{user.username}</p>
          </div>
          <button
            type='button'
            onClick={onLogout}
            className='bg-blue-400 px-3 text-white font-mono rounded-md'
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;

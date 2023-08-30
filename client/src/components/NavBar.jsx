import TrophyIcon from '/public/TrophyIcon';
import ProfileIcon from '/public/ProfileIcon';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../utils/feature';
import { useApolloClient } from '@apollo/client';

// eslint-disable-next-line react/prop-types
const NavBar = () => {
  const [opacity, setOpacity] = useState(1);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const client = useApolloClient();

  useEffect(() => {
    setOpacity(0);
    const timeoutId = setTimeout(() => {
      setOpacity(1);
    }, 500); // duration of the transition

    return () => clearTimeout(timeoutId);
  }, [user.points]);

  const logout = async () => {
    await client.resetStore();
    localStorage.setItem('Authorization', '');
    dispatch(clearUser());
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
              {user.points}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <ProfileIcon />
            <p className='font-bold text-sm'>{user.username}</p>
          </div>
          <button
            type='button'
            onClick={logout}
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

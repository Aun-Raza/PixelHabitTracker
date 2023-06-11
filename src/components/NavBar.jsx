import TrophyIcon from '../images/TrophyIcon';
import ProfileIcon from '../images/ProfileIcon';
import ArrowIcon from '../images/ArrowIcon';

const NavBar = () => {
  return (
    <div className='flex justify-between px-3'>
      {/* Left Side */}
      <div className='flex gap-2 items-center mt-2'>
        <div className='w-12 h-12 bg-primary' />
        <div>
          <h1 className='font-bold text-2xl'>Pixel</h1>
          <p className='hidden md:block'>Habit Tracker App</p>
        </div>
      </div>
      {/* Right Size  */}
      <div className='flex gap-5'>
        <div className='flex items-center gap-2'>
          <TrophyIcon />
          <p className='text-xl font-bold'>232</p>
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

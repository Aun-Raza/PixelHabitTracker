/* eslint-disable react/prop-types */
import { useState, Fragment, useEffect } from 'react';
import BlurScreen from './BlurScreen';

// eslint-disable-next-line react/prop-types
const EditHabitForm = ({
  toggle,
  setToggle,
  habit,
  EditHabit,
  DeleteHabit,
}) => {
  const [updatedHabit, setUpdatedHabit] = useState({
    _id: '',
    name: '',
    color: '',
  });

  useEffect(() => {
    if (habit) {
      setUpdatedHabit({
        _id: habit._id,
        name: habit.name,
        color: habit.color,
      });
    }
  }, [habit]);

  const handleHabitChange = (e) => {
    setUpdatedHabit({
      ...updatedHabit,
      [e.target.name]: e.target.value,
    });
  };

  return (
    toggle == 'editHabitForm' && (
      <Fragment>
        <BlurScreen />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setToggle('none');
            EditHabit(updatedHabit);
          }}
          id='editHabitForm'
          className='absolute top-32 w-3/6 mx-auto inset-x-0 bg-white border shadow-md rounded-lg p-4'
        >
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-md font-bold mb-2 px-1'
              htmlFor='habit'
            >
              Habit
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='habit'
              name='name'
              type='text'
              placeholder='ex. Run outside'
              minLength={5}
              maxLength={30}
              required
              value={updatedHabit.name}
              onChange={handleHabitChange}
            />
          </div>
          <div className='border w-fit mx-auto p-6 rounded-lg'>
            <label className='block text-gray-700 text-md text-center font-bold mb-2 px-1 pb-2'>
              Select Habit Color
            </label>
            <div className='mb-4 flex justify-center gap-7'>
              <div className='flex'>
                <input
                  type='radio'
                  id='red'
                  name='color'
                  value='#F87171'
                  className='w-10 accent-red-500'
                  checked={updatedHabit.color === '#F87171'}
                  onChange={handleHabitChange}
                />
                <label htmlFor='red' className='text-lg text-red-400 font-bold'>
                  Red
                </label>
              </div>
              <div className='flex'>
                <input
                  type='radio'
                  id='blue'
                  name='color'
                  value='#4290d8'
                  className='w-10 accent-blue-500'
                  checked={updatedHabit.color === '#4290d8'}
                  onChange={handleHabitChange}
                />
                <label
                  htmlFor='blue'
                  className='text-lg text-blue-400 font-bold'
                >
                  Blue
                </label>
              </div>
              <div className='flex'>
                <input
                  type='radio'
                  id='green'
                  name='color'
                  value='#4ADE80'
                  className='w-10 accent-green-500 '
                  checked={updatedHabit.color === '#4ADE80'}
                  onChange={handleHabitChange}
                />
                <label
                  htmlFor='green'
                  className='text-lg text-green-400 font-bold'
                >
                  Green
                </label>
              </div>
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              className='mt-5 bg-blue-400 text-white font-semibold p-2 rounded-lg'
              type='submit'
            >
              Edit Habit
            </button>
            <button
              className='mt-5 bg-red-500 text-white font-semibold p-2 rounded-lg'
              onClick={() => setToggle('none')}
              type='button'
            >
              Cancel
            </button>
            <button
              className='mt-5 bg-red-500 text-white font-semibold p-2 rounded-lg'
              onClick={() => {
                setToggle('none');
                DeleteHabit(updatedHabit);
              }}
              type='button'
            >
              DELETE
            </button>
          </div>
        </form>
      </Fragment>
    )
  );
};

export default EditHabitForm;

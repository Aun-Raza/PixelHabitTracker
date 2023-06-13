import { useState, Fragment } from 'react';
import ArrowIcon from '../images/ArrowIcon';
import AddHabitForm from './AddHabitForm';
import habitsJSON from '../data/habits.json';
import datesJSON from '../data/dates.json';
import BlurScreen from '../Utils/BlurScreen';

const PixelTracker = () => {
  const [habits, setHabits] = useState(habitsJSON);
  const [dates, setDates] = useState(datesJSON);

  function ActivateHabitBlock(dateId, habitId) {
    const datesClone = [...dates];
    const dateClone = datesClone.find((date) => dateId == date.id);
    dateClone.habits[habitId] = !dateClone.habits[habitId];
    setDates(datesClone);
  }

  function RenderHabitDateRow(habit, selected_dates) {
    return (
      <Fragment>
        <h2 className='col-span-2 pt-1 ps-2 border h-14 break-words'>
          {habit.name}
        </h2>
        {selected_dates.map((date) => {
          const bgColor = date.habits[habit.id] ? habit.color : '';
          return (
            <div
              key={date.id}
              className={'cursor-pointer hover:border hover:brightness-50'}
              style={{ backgroundColor: bgColor }}
              onClick={() => ActivateHabitBlock(date.id, habit.id)}
            ></div>
          );
        })}
        <div className='flex items-center s-2 gap-2 col-span-2 p-2 border'>
          <div className='h-8 w-8 rounded-full bg-redBlock' />
          <p className='font-bold text-xl'>47%</p>
        </div>
      </Fragment>
    );
  }

  function ToggleForm() {
    const blurScreen = document.getElementById('blurScreen');
    const addHabitForm = document.getElementById('addHabitForm');
    blurScreen.classList.toggle('hidden');
    addHabitForm.classList.toggle('hidden');
  }

  function AddHabit(habit) {
    const habitId = habits.length + 1;

    const habitObj = {
      id: habitId,
      name: habit.title,
      color: habit.color,
      dates: habits[0].dates,
    };

    const habitsClone = [...habits];
    habitsClone.push(habitObj);
    setHabits(habitsClone);

    const datesClone = [...dates];
    datesClone.forEach((date) => {
      date.habits[habitId] = false;
    });
    setDates(datesClone);
    ToggleForm();
  }

  return (
    <Fragment>
      <div className='grid grid-cols-11 mt-11'>
        {/* HEADER: */}

        {/* Left Panel */}
        <div className='flex flex-col items-center gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100 cursor-pointer'>
          <ArrowIcon angle={90} />
          <p className='text-md font-bold'>HABITS</p>
        </div>

        {/* Date Columns */}
        {dates.map(({ month, day, weekday }) => (
          <div
            key={month + day}
            className='flex flex-col justify-center items-center'
          >
            <p className='font-bold'>{month}</p>
            <p className='font-bold text-lg text-blueBlock'>{day}</p>
            <p className='font-bold'>{weekday}</p>
          </div>
        ))}

        {/* Right Panel */}
        <div className='flex flex-col items-center gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100 cursor-pointer'>
          <ArrowIcon angle={-90} />
          <p className='text-md font-bold'>Rate</p>
        </div>

        {/* BODY: */}
        {habits.map((habit) => RenderHabitDateRow(habit, dates))}
      </div>

      {/* MISC: */}

      <button
        className='mt-5 bg-blueBlock text-white p-3 rounded-full'
        onClick={() => ToggleForm()}
      >
        Add Habit
      </button>
      {/* Absolute Components */}
      <BlurScreen />
      <AddHabitForm ToggleForm={ToggleForm} AddHabit={AddHabit} />
    </Fragment>
  );
};

export default PixelTracker;

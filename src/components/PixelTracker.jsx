import { useState } from 'react';
import ArrowIcon from '../images/ArrowIcon';

const PixelTracker = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Eat fruits',
      color: 'rgb(248 113 113)',
      dates: [100, 101, 102, 103, 104, 105, 106],
    },
    {
      id: 2,
      name: 'Run outside and sleep',
      color: 'rgb(74 222 128)',
      dates: [100, 101, 102, 103, 104, 105, 106],
    },
  ]);

  const [dates, setDates] = useState([
    {
      id: 100,
      month: 'MAY',
      day: 8,
      weekday: 'SAT',
      habits: { 1: true, 2: false },
    },
    {
      id: 101,
      month: 'MAY',
      day: 9,
      weekday: 'SUN',
      habits: { 1: false, 2: false },
    },
    {
      id: 102,
      month: 'MAY',
      day: 10,
      weekday: 'MON',
      habits: { 1: true, 2: true },
    },
    {
      id: 103,
      month: 'MAY',
      day: 11,
      weekday: 'TUE',
      habits: { 1: true, 2: false },
    },
    {
      id: 104,
      month: 'MAY',
      day: 12,
      weekday: 'WED',
      habits: { 1: false, 2: true },
    },
    {
      id: 105,
      month: 'MAY',
      day: 13,
      weekday: 'THU',
      habits: { 1: true, 2: false },
    },
    {
      id: 106,
      month: 'MAY',
      day: 14,
      weekday: 'FRI',
      habits: { 1: true, 2: false },
    },
  ]);

  function ActivateHabitBlock(dateId, habitId) {
    const datesClone = [...dates];
    const dateClone = datesClone.find((date) => dateId == date.id);
    dateClone.habits[habitId] = !dateClone.habits[habitId];
    setDates(datesClone);
  }

  function HabitDateRow(habit, selected_dates) {
    return (
      <>
        <h2 className='col-span-2 pt-1 ps-2 border h-14'>{habit.name}</h2>
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
          <div className='h-8 w-8 rounded-full bg-red-600' />
          <p className='font-bold text-xl'>47%</p>
        </div>
      </>
    );
  }

  return (
    <div className='grid grid-cols-11 mt-4'>
      {/* Left Panel */}
      <div className='flex flex-col items-center gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100 cursor-pointer'>
        <ArrowIcon angle={90} />
        <p className='text-md font-bold'>HABITS</p>
      </div>

      {dates.map(({ month, day, weekday }) => (
        <div
          key={month + day}
          className='flex flex-col justify-center items-center'
        >
          <p className='font-bold'>{month}</p>
          <p className='font-bold text-lg text-primary'>{day}</p>
          <p className='font-bold'>{weekday}</p>
        </div>
      ))}

      {/* Right Panel */}
      <div className='flex flex-col items-center gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100 cursor-pointer'>
        <ArrowIcon angle={-90} />
        <p className='text-md font-bold'>Rate</p>
      </div>

      {/* Habits */}
      {habits.map((habit) => HabitDateRow(habit, dates))}
    </div>
  );
};

export default PixelTracker;

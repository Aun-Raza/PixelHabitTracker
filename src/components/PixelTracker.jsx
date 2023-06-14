import { useState, Fragment } from 'react';
import ArrowIcon from '../images/ArrowIcon';
import AddHabitForm from './AddHabitForm';
import EditHabitForm from './EditHabitForm';
import habitsJSON from '../data/habits.json';
import datesJSON from '../data/dates.json';

const PixelTracker = () => {
  const [habits, setHabits] = useState(habitsJSON);
  const [selectedHabit, setSelectedHabit] = useState(habits[0]);
  const [dates, setDates] = useState(datesJSON);
  const [dateStartEnd, setDateStartEnd] = useState([
    dates.length - 7,
    dates.length,
  ]);
  const [selectedDates, setSelectedDates] = useState(
    dates.slice(dateStartEnd[0], dateStartEnd[1])
  );
  const [toggle, setToggle] = useState('none');

  function ActivateHabitBlock(dateId, habitId) {
    const datesClone = [...dates];
    const dateClone = datesClone.find((date) => dateId == date.id);
    dateClone.habits[habitId] = !dateClone.habits[habitId];
    setDates(datesClone);
  }

  function RenderHabitDateRow(habit) {
    return (
      <Fragment key={habit.id}>
        <h2
          className='col-span-2 pt-1 ps-2 border h-14 break-words cursor-pointer hover:underline'
          onMouseOver={() => {
            document
              .getElementById(`${habit.id}-icon`)
              .classList.remove('hidden');
          }}
          onMouseOut={() => {
            document.getElementById(`${habit.id}-icon`).classList.add('hidden');
          }}
          onClick={() => {
            setSelectedHabit(habit);
            setToggle('editHabitForm');
          }}
        >
          {habit.name}
          <span id={`${habit.id}-icon`} className='hidden'>
            🔧
          </span>
        </h2>
        {selectedDates.map((date) => {
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
        {RenderRateColumn(habit.id)}
      </Fragment>
    );
  }

  function RenderRateColumn(habitId) {
    let activeBlockCount = 0;
    selectedDates.forEach((date) => {
      if (date.habits[habitId]) {
        activeBlockCount++;
      }
    });

    const rate = Math.round((activeBlockCount / selectedDates.length) * 100);
    let bgColor = '';
    switch (true) {
      case rate >= 80:
        bgColor = '#4290d8';
        break;
      case rate >= 50:
        bgColor = '#e2c45a';
        break;
      default:
        bgColor = '#F87171';
        break;
    }

    return (
      <div className='flex items-center s-2 gap-2 col-span-2 p-2 ps-4 border'>
        <div
          className={'h-8 w-8 rounded-full'}
          style={{ backgroundColor: bgColor }}
        />
        <p className='font-bold text-xl'>
          {Math.round((activeBlockCount / selectedDates.length) * 100)}%
        </p>
      </div>
    );
  }

  function AddHabit(habit) {
    const habitId = habits.length == 0 ? 1 : habits[habits.length - 1].id + 1;
    const habitDates = dates.map((date) => date.id);

    const habitObj = {
      id: habitId,
      name: habit.title,
      color: habit.color,
      dates: habitDates,
    };

    const habitsClone = [...habits];
    habitsClone.push(habitObj);
    setHabits(habitsClone);

    const datesClone = [...dates];
    datesClone.forEach((date) => {
      date.habits[habitId] = false;
    });
    setDates(datesClone);
  }

  function EditHabit(habit) {
    const habitsClone = [...habits];
    const index = habitsClone.findIndex((habitObj) => habitObj.id == habit.id);
    habitsClone[index] = habit;
    setHabits(habitsClone);
  }

  function DeleteHabit(habit) {
    const habitsClone = habits.filter((habitObj) => habitObj.id !== habit.id);
    setHabits(habitsClone);
    const datesClone = [...dates];
    datesClone.forEach((date) => {
      delete date.habits[habit.id];
    });
    setDates(datesClone);
  }

  function WeekChangeHandler(direction) {
    const [dateStart, dateEnd] = dateStartEnd;

    if (direction == 'left') {
      if (dateStart == 0) {
        return;
      }

      const newDates = [dateStart - 7, dateEnd - 7];
      setDateStartEnd(newDates);
      setSelectedDates(dates.slice(newDates[0], newDates[1]));
    } else {
      if (dateEnd == dates.length) {
        return;
      }

      const newDates = [dateStart + 7, dateEnd + 7];
      setDateStartEnd(newDates);
      setSelectedDates(dates.slice(newDates[0], newDates[1]));
    }
  }

  return (
    <Fragment>
      <div className='grid grid-cols-11 mt-11'>
        {/* HEADER: */}

        {/* Left Panel */}
        <div
          onClick={() => WeekChangeHandler('left')}
          style={{
            backgroundColor: dateStartEnd[0] == 0 ? 'rgb(241 245 249)' : '',
            cursor: dateStartEnd[0] == 0 ? '' : 'pointer',
          }}
          className='flex flex-col gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100'
        >
          <div className='flex items-center gap-2 text-sm font-bold'>
            <ArrowIcon angle={90} />
            <p className='w-min'>Previous Week</p>
          </div>
          <p className='text-md font-bold self-center'>Habits</p>
        </div>

        {/* Date Columns */}
        {selectedDates.map(({ month, day, weekday }) => (
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
        <div
          onClick={() => WeekChangeHandler('right')}
          style={{
            backgroundColor:
              dateStartEnd[1] == dates.length ? 'rgb(241 245 249)' : '',
            cursor: dateStartEnd[1] == dates.length ? '' : 'pointer',
          }}
          className='flex flex-col gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100'
        >
          <div className='flex items-center justify-end gap-2 text-sm font-bold'>
            <p className='w-min'>Next Week</p>
            <ArrowIcon angle={-90} />
          </div>
          <p className='text-md font-bold self-center'>Rates</p>
        </div>

        {/* BODY: */}
        {habits.map((habit) => RenderHabitDateRow(habit, selectedDates))}
      </div>

      {/* MISC: */}

      <button
        className='mt-5 bg-blueBlock text-white p-3 rounded-full'
        onClick={() => setToggle('addHabitForm')}
      >
        Add Habit
      </button>
      {/* Absolute Components */}
      <AddHabitForm toggle={toggle} setToggle={setToggle} AddHabit={AddHabit} />
      <EditHabitForm
        toggle={toggle}
        setToggle={setToggle}
        habit={selectedHabit}
        EditHabit={EditHabit}
        DeleteHabit={DeleteHabit}
      />
    </Fragment>
  );
};

export default PixelTracker;

import { useState, Fragment, useEffect } from 'react';
import ArrowIcon from '../images/ArrowIcon';
import AddHabitForm from './AddHabitForm';
import EditHabitForm from './EditHabitForm';
import datesJSON from '../data/dates.json';
import habitsJSON from '../data/habits.json';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_USERS } from '../graphql/query';

// eslint-disable-next-line react/prop-types
const PixelTracker = ({ onPointChange }) => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(habitsJSON);
  const [dates, setDates] = useState(datesJSON);
  const [dateStartEnd, setDateStartEnd] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [toggle, setToggle] = useState('none');
  const { data, error } = useQuery(QUERY_ALL_USERS);

  if (data) {
    console.log(data);
  }

  if (error) {
    console.log(error.message);
  }

  useEffect(() => {
    initializeDates();
  }, []);

  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  function initializeDates() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let updatedDates = [...dates];
    if (updatedDates.length == 0) {
      currentDate.setDate(currentDate.getDate() - 6);
      updatedDates = createDatesForWeek(currentDate);
    } else {
      updatedDates = addNewDates(updatedDates, currentDate);
    }

    setDates(updatedDates);
    updateSelectedDates(updatedDates);
  }

  function createDatesForWeek(startDate) {
    const datesForWeek = [];
    for (let i = 1; i <= 7; i++) {
      datesForWeek.push(createDateObject(i, startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return datesForWeek;
  }

  function createDateObject(id, date) {
    return {
      id,
      date: {
        year: date.getFullYear(),
        month: monthNames[date.getMonth()],
        day: date.getDate(),
        weekday: dayNames[date.getDay()],
      },
      habits: {},
    };
  }

  function addNewDates(existingDates, currentDate) {
    const lastDateInfo = existingDates[existingDates.length - 1].date;
    let datePointer = new Date(
      lastDateInfo.year,
      monthNames.indexOf(lastDateInfo.month),
      lastDateInfo.day + 1
    );
    let count = existingDates[existingDates.length - 1].id + 1;

    while (datePointer.getTime() <= currentDate.getTime()) {
      existingDates.push(createDateObject(count++, datePointer));
      datePointer.setDate(datePointer.getDate() + 1);
    }
    return existingDates;
  }

  function updateSelectedDates(updatedDates) {
    const dateRange =
      updatedDates.length === 7
        ? [0, 7]
        : [updatedDates.length - 7, updatedDates.length];
    setDateStartEnd(dateRange);
    const updatedSelectedDates = updatedDates.slice(...dateRange);
    setSelectedDates(updatedSelectedDates);
  }

  function ActivateHabitBlock(dateId, habitId) {
    const datesClone = [...dates];
    const dateClone = datesClone.find((date) => dateId == date.id);

    dateClone.habits[habitId] = !dateClone.habits[habitId];
    setDates(datesClone);
    const points = dateClone.habits[habitId] ? 1 : -1;
    onPointChange(points);
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
      case rate == 100:
        bgColor = '#e2c45a';
        break;
      case rate >= 80:
        bgColor = '#4ade80';
        break;
      case rate >= 50:
        bgColor = '#4290d8';

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

  function handleWeekChange(direction) {
    const [startDate, endDate] = dateStartEnd;
    let newStart, newEnd, newDates;

    if (direction === 'left') {
      if (startDate == 0) return;

      newStart = Math.max(0, startDate - 7);
      newEnd = endDate - 7;
    } else {
      if (endDate == dates.length) return;
      newStart = endDate < 7 ? selectedDates.length : startDate + 7;
      newEnd = endDate + 7;
    }

    newDates = dates.slice(newStart, newEnd);

    setDateStartEnd([newStart, newEnd]);
    setSelectedDates(newDates);
    wrapHabitColumns(newDates.length);
  }

  function wrapHabitColumns(columnCount) {
    const pixelGrid = document.getElementById('pixelGrid');
    const totalColumns = 4 + columnCount;
    pixelGrid.style.gridTemplateColumns = `repeat(${totalColumns}, 1fr)`;
  }

  return (
    <Fragment>
      <div
        id='pixelGrid'
        style={{ gridTemplateColumns: 'repeat(11, 1fr)' }}
        className='grid mt-11'
      >
        {/* HEADER: */}

        {/* Left Panel */}
        <div
          onClick={() => handleWeekChange('left')}
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
        {selectedDates.map(({ date: { year, month, day, weekday } }) => {
          const monthNumber = monthNames.indexOf(month);
          return (
            <div
              key={month + day}
              className='flex flex-col justify-center items-center'
              style={{
                border:
                  new Date(year, monthNumber, day).toDateString() ==
                  new Date().toDateString()
                    ? 'solid 2px black'
                    : '',
              }}
            >
              <p className='font-bold'>{month}</p>
              <p className='font-bold text-lg text-blueBlock'>{day}</p>
              <p className='font-bold'>{weekday}</p>
            </div>
          );
        })}

        {/* Right Panel */}
        <div
          onClick={() => handleWeekChange('right')}
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

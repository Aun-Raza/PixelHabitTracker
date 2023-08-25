import { useState, Fragment, useEffect } from 'react';
import dayjs from 'dayjs';
import { useQuery, useMutation } from '@apollo/client';
import {
  QUERY_ALL_HABITS,
  ADD_HABIT,
  EDIT_HABIT,
  DELETE_HABIT,
  CHECK_DAY,
} from '../graphql/query';
import _ from 'lodash';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { daysOfWeek, months } from '../Utils/enum';
import Cell from '../components/Cell';
import AddHabitForm from '../components/AddHabitForm';
import EditHabitForm from '../components/EditHabitForm';

const PixelTracker = () => {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const { data: habitData } = useQuery(QUERY_ALL_HABITS);
  const [addHabitMutation, { data: newHabit }] = useMutation(ADD_HABIT);
  const [editHabitMutation, { data: editedHabit }] = useMutation(EDIT_HABIT);
  const [checkHabitDayMutation, { data: checkHabitDayData }] =
    useMutation(CHECK_DAY);
  const [deleteHabitMutation, { data: deletedHabit }] =
    useMutation(DELETE_HABIT);
  const [toggle, setToggle] = useState('none');
  const [selectedHabit, setSelectedHabit] = useState(null);

  function handleWeekChange(direction) {
    if (direction === 'left') {
      const firstDate = selectedDates[0];
      const lastWeek = dayjs(firstDate, 'MM-DD-YYYY').subtract(1, 'day');
      if (!dates[lastWeek.format('MM-DD-YYYY')]) return;
      populateSelectedDates(lastWeek);
    } else if (direction === 'right') {
      const lastDate = selectedDates[selectedDates.length - 1];
      const nextWeek = dayjs(lastDate, 'MM-DD-YYYY').add(7, 'day');
      if (!dates[nextWeek.format('MM-DD-YYYY')]) return;
      populateSelectedDates(nextWeek);
    }
  }

  function populateSelectedDates(end) {
    const selectedDatesClone = [];
    let current = end.subtract(6, 'day');

    while (current.isBefore(end) || current.isSame(end)) {
      selectedDatesClone.push(current.format('MM-DD-YYYY'));
      current = current.add(1, 'day');
    }
    setSelectedDates(() => selectedDatesClone);
  }

  useEffect(() => populateSelectedDates(dayjs()), []);

  function populateDates(habits) {
    const dates = {};
    _.forEach(habits, (habit) => {
      _.forEach(habit.days, (day) => {
        if (day.date in dates) {
          dates[day.date].push(day);
        } else {
          dates[day.date] = [day];
        }
      });
    });

    setDates(() => dates);
  }

  useEffect(() => {
    if (habitData) {
      const { habits } = habitData;
      const newHabits = _.map(habits, (habit) =>
        _.pick(habit, ['_id', 'name', 'color', 'days'])
      );

      setHabits(() => newHabits);
      populateDates(habits);
    }
  }, [habitData]);

  async function AddHabit(habit) {
    try {
      await addHabitMutation({
        variables: { name: habit.name, color: habit.color },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (newHabit) {
      const { addHabit } = newHabit;
      const today = dayjs().format('MM-DD-YYYY');
      const datesClone = { ...dates };
      if (datesClone[today]) {
        datesClone[today].push(addHabit.days[0]);
      } else {
        datesClone[today] = [addHabit.days[0]];
      }

      setDates(() => datesClone);
      setHabits((habits) => [...habits, addHabit]);
    }
  }, [newHabit]);

  async function EditHabit(habit) {
    try {
      const { _id, name, color } = habit;
      await editHabitMutation({ variables: { habitId: _id, name, color } });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (editedHabit) {
      const {
        editHabit: { _id, name, color },
      } = editedHabit;

      const habitsClone = [...habits];
      const habit = _.find(habitsClone, (habit) => habit._id === _id);
      habit.name = name;
      habit.color = color;
      setHabits(() => habitsClone);
    }
  }, [editedHabit]);

  async function DeleteHabit(habit) {
    try {
      await deleteHabitMutation({ variables: { habitId: habit._id } });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (deletedHabit) {
      const { deleteHabit } = deletedHabit;

      const habitsClone = habits.filter(
        (habit) => habit._id !== deleteHabit._id
      );
      setHabits(() => habitsClone);
    }
  }, [deletedHabit]);

  async function handleDayCheck(day) {
    try {
      await checkHabitDayMutation({ variables: { dayId: day._id } });
    } catch (error) {
      console.log(error);
    }
  }

  function renderHabitDateRow(habit) {
    return (
      <Fragment key={habit._id}>
        {/* Left column */}
        <div
          className='col-span-2 pt-1 ps-2 border h-14 break-words cursor-pointer hover:underline'
          onMouseOver={() => {
            document
              .getElementById(`${habit._id}-icon`)
              .classList.remove('hidden');
          }}
          onMouseOut={() => {
            document
              .getElementById(`${habit._id}-icon`)
              .classList.add('hidden');
          }}
          onClick={() => {
            setSelectedHabit(habit);
            setToggle('editHabitForm');
          }}
        >
          {habit.name}
          <span id={`${habit._id}-icon`} className='hidden'>
            🔧
          </span>
        </div>
        {/* Body */}
        {selectedDates.map((selectedDate) => {
          const date = dates[selectedDate];
          if (date) {
            const day = _.find(
              date,
              (habitDate) => habitDate.habit._id === habit._id
            );

            if (day) {
              return (
                <Cell
                  key={day._id}
                  isActive={true}
                  day={day}
                  onCheck={handleDayCheck}
                  color={day.checked ? habit.color : ''}
                />
              );
            } else {
              return <Cell key={habit._id + selectedDate} />;
            }
          } else {
            return <Cell key={habit._id + selectedDate} />;
          }
        })}
        {/* Right column */}
        <div className='col-span-2 border cursor-pointer'></div>
      </Fragment>
    );
  }

  return (
    <div className='mt-11 container mx-auto'>
      <div
        id='pixelGrid'
        style={{ gridTemplateColumns: 'repeat(11, 1fr)' }}
        className='grid'
      >
        {/* -------------------------------------------------------- */}
        {/* Left Panel */}
        <div
          onClick={() => handleWeekChange('left')}
          className='flex flex-col gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100 cursor-pointer'
        >
          <div className='flex items-center gap-2 text-sm font-bold'>
            {/* <ArrowIcon angle={90} /> */}
            <p className='w-min'>Previous Week</p>
          </div>
          <p className='text-md font-bold self-center'>Habits</p>
        </div>
        {/* Date Columns */}
        {selectedDates.map((date) => {
          const jsDate = dayjs(date, 'MM-DD-YYYY');

          return (
            <div
              key={date}
              className='flex flex-col justify-center items-center'
              style={{
                border: jsDate.isSame(dayjs(), 'day') ? 'solid 2px black' : '',
              }}
            >
              <p className='font-bold'>{months[jsDate.get('month')]}</p>
              <p className='font-bold text-lg text-blueBlock'>
                {jsDate.get('date')}
              </p>
              <p className='font-bold'>{daysOfWeek[jsDate.get('day')]}</p>
            </div>
          );
        })}
        {/* Right Panel */}
        <div
          onClick={() => handleWeekChange('right')}
          className='flex flex-col gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100 cursor-pointer'
        >
          <div className='flex items-center justify-end gap-2 text-sm font-bold'>
            <p className='w-min'>Next Week</p>
          </div>
          <p className='text-md font-bold self-center'>Rates</p>
        </div>
        {/* Body */}
        {habits.map((habit) => renderHabitDateRow(habit))}
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
    </div>
  );
};

export default PixelTracker;

import { useState, Fragment, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  QUERY_ALL_HABITS,
  ADD_HABIT,
  EDIT_HABIT,
  DELETE_HABIT,
  CHECK_DAY,
} from '../utilstemp/graphql';
import _ from 'lodash';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { daysOfWeek, months } from '../utilstemp/enum';
import Cell from '../components/Cell';
import AddHabitForm from '../components/AddHabitForm';
import EditHabitForm from '../components/EditHabitForm';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import { Doughnut } from 'react-chartjs-2';
import ArrowIcon from '/public/ArrowIcon';
import { useDispatch } from 'react-redux';
import { incrementPoints, decrementPoints } from '../utilstemp/feature';

// eslint-disable-next-line react/prop-types
const PixelTracker = () => {
  const [dates, setDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const { data: query, refetch } = useQuery(QUERY_ALL_HABITS);
  const [addHabit, { data: newHabit }] = useMutation(ADD_HABIT);
  const [editHabit, { data: editedHabit }] = useMutation(EDIT_HABIT);
  const [checkHabitDay, { data: habitDay }] = useMutation(CHECK_DAY);
  const [deleteHabit, { data: deletedHabit }] = useMutation(DELETE_HABIT);
  const [toggle, setToggle] = useState('none');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const dispatch = useDispatch();

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

  function checkPossibleWeekChange(direction) {
    if (direction === 'left') {
      const lastWeek = dayjs(selectedDates[0], 'MM-DD-YYYY').subtract(1, 'day');
      if (dates[lastWeek.format('MM-DD-YYYY')]) {
        return true;
      }
    } else if (direction === 'right') {
      const nextWeek = dayjs(selectedDates[0], 'MM-DD-YYYY').add(1, 'day');
      if (dates[nextWeek.format('MM-DD-YYYY')]) {
        return true;
      }
    }

    return false;
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

  useEffect(() => {
    async function init() {
      await refetch();
      populateSelectedDates(dayjs());
    }

    init();
  }, []);

  useEffect(() => {
    if (query) {
      const dates = {};
      const { habits } = query;
      _.forEach(habits, (habit) => {
        _.forEach(habit.days, (day) => {
          if (day.date in dates) {
            dates[day.date].push(day);
          } else {
            dates[day.date] = [day];
          }
        });
      });

      setDates(dates);
    }
  }, [query]);

  useEffect(() => {
    const init = async () => {
      await refetch();
    };
    init();
  }, [newHabit, editedHabit, deletedHabit, habitDay]);

  function RenderRateColumn(habitId) {
    let blockCount = 0;
    let activeBlockCount = 0;

    _.forEach(selectedDates, (selectedDate) => {
      if (dates[selectedDate]) {
        const date = _.find(
          dates[selectedDate],
          (d) => d.habit._id === habitId
        );

        if (date) blockCount++;
        if (date && date.checked) activeBlockCount++;
      }
    });

    const rate = Math.round((activeBlockCount / blockCount) * 100);
    let bgColor =
      rate === 100
        ? '#e2c45a'
        : rate >= 80
        ? '#4ade80'
        : rate >= 50
        ? '#4290d8'
        : '#F87171';

    return (
      <div className='flex items-center s-2 gap-2 col-span-2 p-2 ps-4 border'>
        <div
          className={'h-8 w-8 rounded-full'}
          style={{ backgroundColor: bgColor }}
        />
        <p className='font-bold text-xl'>{rate}%</p>
      </div>
    );
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
                  onCheck={async (day) => {
                    await checkHabitDay({ variables: { dayId: day._id } });
                    if (!day.checked) dispatch(incrementPoints());
                    else dispatch(decrementPoints());
                  }}
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
        {RenderRateColumn(habit._id)}
      </Fragment>
    );
  }

  function calculateAllBlockCount() {
    let allBlockCount = 0;
    let allActiveBlockCount = 0;

    _.forEach(Object.values(dates), (date) => {
      allBlockCount += date.length;
      _.forEach(date, (day) => {
        if (day.checked) allActiveBlockCount++;
      });
    });

    return [allActiveBlockCount, allBlockCount - allActiveBlockCount];
  }

  function renderDoughnutChart() {
    const values = calculateAllBlockCount();
    const data = {
      labels: ['Completed number of habits', 'Incomplete number of habits'],
      datasets: [
        {
          label: 'Completed/Incomplete number of habits',
          data: values,
          backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
          hoverOffset: 4,
        },
      ],
    };

    return <Doughnut data={data} />;
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
          className='flex flex-col gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100'
          style={{
            backgroundColor: checkPossibleWeekChange('left')
              ? ''
              : 'rgb(241 245 249)',
            cursor: checkPossibleWeekChange('left') ? 'pointer' : '',
          }}
        >
          <div className='flex items-center gap-2 text-sm font-bold'>
            <ArrowIcon angle={90} />
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
          className='flex flex-col gap-3 mt-2 p-3 col-span-2 border hover:bg-slate-100'
          style={{
            backgroundColor: checkPossibleWeekChange('right')
              ? ''
              : 'rgb(241 245 249)',
            cursor: checkPossibleWeekChange('right') ? 'pointer' : '',
          }}
        >
          <div className='flex items-center justify-end gap-2 text-sm font-bold'>
            <ArrowIcon angle={-90} />
            <p className='w-min'>Next Week</p>
          </div>
          <p className='text-md font-bold self-center'>Rates</p>
        </div>
        {/* Body */}
        {dates &&
          query &&
          query.habits.map((habit) => renderHabitDateRow(habit))}
      </div>
      {/* MISC: */}

      <button
        className='mt-5 bg-blueBlock text-white p-3 rounded-full'
        onClick={() => setToggle('addHabitForm')}
      >
        Add Habit
      </button>
      {/* Absolute Components */}
      <AddHabitForm
        toggle={toggle}
        setToggle={setToggle}
        AddHabit={async (habit) => {
          await addHabit({
            variables: { name: habit.name, color: habit.color },
          });
        }}
      />
      <EditHabitForm
        toggle={toggle}
        setToggle={setToggle}
        habit={selectedHabit}
        EditHabit={async (habit) => {
          const { _id, name, color } = habit;
          await editHabit({ variables: { habitId: _id, name, color } });
        }}
        DeleteHabit={async (habit) => {
          await deleteHabit({ variables: { habitId: habit._id } });
        }}
      />
      <div className='w-1/2 mx-auto'>{dates && renderDoughnutChart()}</div>
    </div>
  );
};

export default PixelTracker;

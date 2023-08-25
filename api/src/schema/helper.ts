import dayjs from 'dayjs';
import { IHabitWithDays } from '../types';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DayModel, HabitModel } from '../models';
import { GraphQLError } from 'graphql';
dayjs.extend(customParseFormat);

export async function updateHabitDays(habit: IHabitWithDays) {
  const { name, days } = habit;
  if (!days.length) {
    const today = dayjs().format('MM-DD-YYYY');
    await addDays(habit._id!.toString(), today);
  } else {
    const lastDate = days[days.length - 1].date;
    const jsDate = dayjs(lastDate, 'MM-DD-YYYY');
    if (!jsDate.isSame(dayjs(), 'day')) {
      await addDays(habit._id!.toString(), lastDate);
    }
  }
}

async function addDays(habitId: string, date: string) {
  const habitDoc = await HabitModel.findById(habitId);

  if (!habitDoc) {
    throw new GraphQLError(`habit need to exist to add days`);
  }

  const today = dayjs();
  let current = dayjs(date, 'MM-DD-YYYY');

  const foundHabitDay = await DayModel.findOne({
    date: today.format('MM-DD-YYYY'),
    habit: habitDoc._id,
  });

  if (foundHabitDay) {
    throw new GraphQLError(`cannot duplicate habit days`);
  }

  while (current.isBefore(today) || current.isSame(today)) {
    const dayDoc = await DayModel.create({
      date: current.format('MM-DD-YYYY'),
      habit: habitId,
      checked: false,
    });

    habitDoc.days.push(dayDoc._id);
    await habitDoc.save();
    current = current.add(1, 'day');
  }

  return 'Success';
}

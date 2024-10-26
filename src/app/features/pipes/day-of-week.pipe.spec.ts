import { DayOfWeekPipe } from '../../features/pipes/day-of-week.pipe';

describe('DayOfWeekPipe', () => {

  it('create an instance', () => {
    const pipe = new DayOfWeekPipe();
    expect(pipe).toBeTruthy();
  });
});

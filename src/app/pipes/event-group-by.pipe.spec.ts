import { EventGroupByPipe } from './event-group-by.pipe';

describe('EventGroupByPipe', () => {
  it('create an instance', () => {
    const pipe = new EventGroupByPipe();
    expect(pipe).toBeTruthy();
  });
});

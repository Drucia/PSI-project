import { TruncatePipePipe } from './filter/truncate-pipe.pipe';

describe('TruncatePipePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipePipe();
    expect(pipe).toBeTruthy();
  });
});

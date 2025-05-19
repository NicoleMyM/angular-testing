import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should create an instance', () => {
    spectator = createPipe(`{{ 'Hello' | reverse }}`);
    expect(spectator.element).toHaveText('olleH');
  });
  // edge cases
  it('should return empty string when input is empty', () => {
    spectator = createPipe(`{{ '' | reverse }}`);
    expect(spectator.element).toHaveText('');
  });

  it('should reverse string with space', () => {
    spectator = createPipe(`{{ 'Hello World' | reverse }}`);
    expect(spectator.element).toHaveText('dlroW olleH');
  });

  it('should reverse string with special characters', () => {
    spectator = createPipe(`{{ 'Hello@World!' | reverse }}`);
    expect(spectator.element).toHaveText('!dlroW@olleH');
  });

  it('should reverse numbers as string', () => {
    spectator = createPipe(`{{ '12345' | reverse }}`);
    expect(spectator.element).toHaveText('54321');
  });
});

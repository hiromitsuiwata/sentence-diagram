import React from 'react';
import { render, screen } from '@testing-library/react';
import TextLine from './TextLine';

it('render svg textpath', () => {
  const wordId = 1;
  const startX = 2;
  const startY = 3;
  const endX = 4;
  const endY = 5;
  render(
    <svg>
      <TextLine
        wordId={wordId}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        text="foo"
      />
    </svg>
  );
  const textpath = screen.getByText('foo');
  screen.debug(textpath);
  expect(textpath).toHaveAttribute('href');
  expect(textpath).toHaveAttribute('startOffset');
});

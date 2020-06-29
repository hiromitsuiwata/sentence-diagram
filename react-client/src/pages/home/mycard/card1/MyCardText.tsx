import React from 'react';
import TextLine from '../../diagram/svg/TextLine';
import Coordinate from '../../diagram/Coordinate';
import Word from '../../diagram/Word';

interface Props {}

class MyCardText extends React.Component<Props> {
  private words: Word[] = [];
  private tempStarts: Coordinate[] = [];
  private tempEnds: Coordinate[] = [];

  constructor(props: Props) {
    super(props);

    this.tempStarts.push({ x: 40, y: 40 });

    // word
    this.words = [
      { id: 0, text: 'unicorn' },
      { id: 1, text: 'The', relation: 'det', direction: 'right-down', parentId: 0, childOrder: 0 },
      {
        id: 2,
        text: 'white',
        relation: 'amod',
        direction: 'right-down',
        parentId: 0,
        childOrder: 1,
      },
      { id: 3, text: 'flew', relation: 'nsubj', parentId: 0, separator: 'full' },
    ];
  }

  private fillShortage = (): void => {
    const startsShortage = this.words.length - this.tempStarts.length;
    for (let i = 0; i < startsShortage; i++) {
      this.tempStarts.push({ x: 0, y: 0 });
    }
    const startsEnds = this.words.length - this.tempEnds.length;
    for (let i = 0; i < startsEnds; i++) {
      this.tempEnds.push({ x: 0, y: 0 });
    }
  };

  private computeEnds = (): void => {
    for (let i = 0; i < this.words.length; i++) {
      const length: number = this.words[i].text.length * 9 + 20;

      if (this.words[i].direction === 'right-down') {
        this.tempEnds[i].x = Math.round(this.tempStarts[i].x + length / Math.sqrt(2));
        this.tempEnds[i].y = Math.round(this.tempStarts[i].y + length / Math.sqrt(2));
      } else {
        this.tempEnds[i].x = Math.round(this.tempStarts[i].x + length);
        this.tempEnds[i].y = Math.round(this.tempStarts[i].y);
      }
    }
  };

  private computeStarts = (): void => {
    for (let i = 0; i < this.words.length; i++) {
      this.words.forEach((word) => {
        if (i === word.parentId) {
          if ('nsubj' === word.relation) {
            // 親とnsubj関連を持つ場合、親の終点が子の始点となる
            this.tempStarts[word.id] = {
              x: this.tempEnds[i].x,
              y: this.tempStarts[i].y,
            };
          } else if ('det' === word.relation || 'amod' === word.relation) {
            if (typeof word.childOrder != 'undefined' && word.childOrder >= 0) {
              // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
              this.tempStarts[word.id] = {
                x: this.tempStarts[i].x + 20 * (word.childOrder + 1),
                y: this.tempStarts[i].y,
              };
            }
          }
        }
      });
    }
  };

  render(): JSX.Element {
    // tempStarts, tempEndsの不足部分を埋める
    this.fillShortage();
    // 始点と単語の長さから終点を決定する
    this.computeEnds();
    // 単語間の意味の関連から始点を変更する
    this.computeStarts();
    // 変更した始点に対して再度終点を決定する
    this.computeEnds();

    const list = [];
    for (let i = 0; i < this.words.length; i++) {
      list.push(
        <TextLine
          key={this.words[i].id}
          wordId={this.words[i].id}
          startX={this.tempStarts[i].x}
          startY={this.tempStarts[i].y}
          endX={this.tempEnds[i].x}
          endY={this.tempEnds[i].y}
          text={this.words[i].text}
          separator={this.words[i].separator}
          direction={this.words[i].direction}
        />
      );
    }

    return (
      <>
        <div>The white unicorn flew.</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100">
          {list}
        </svg>
      </>
    );
  }

  componentDidMount(): void {
    this.setState({ starts: this.tempStarts });
  }
}

export default MyCardText;

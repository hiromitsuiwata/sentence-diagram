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
      { id: 0, text: 'Bill \u0027s', relation: 'nmod_poss', direction: 'right-down', parentId: 1 },
      { id: 1, text: 'brother' },
      { id: 2, text: 'is sitting', relation: 'nsubj', parentId: 1, separator: true },
      { id: 3, text: 'Where', relation: 'advmod', direction: 'right-down', parentId: 2 },
    ];
  }

  private fillShortage = (): void => {
    const startsShortage = this.words.length - this.tempStarts.length;
    for (let i = 0; i < startsShortage; i++) {
      this.tempStarts.push({ x: 20, y: 20 });
    }
    const startsEnds = this.words.length - this.tempEnds.length;
    for (let i = 0; i < startsEnds; i++) {
      this.tempEnds.push({ x: 20, y: 20 });
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

  private move = (
    targetStarts: Coordinate[],
    targetEnds: Coordinate[],
    i: number,
    expectedStartX: number,
    expectedStartY: number
  ): void => {
    const actualStartX = targetStarts[i].x;
    const actualStartY = targetStarts[i].y;
    const diffX = expectedStartX - actualStartX;
    const diffY = expectedStartY - actualStartY;
    targetStarts[i].x = actualStartX + diffX;
    targetStarts[i].y = actualStartY + diffY;
    targetEnds[i].x = targetEnds[i].x + diffX;
    targetEnds[i].y = targetEnds[i].y + diffY;
  };

  private moveUsingDependencies = (): void => {
    // 文法上の依存関係から始点と終点をまとめて平行移動する
    // ツリー構造の親から順番に実行していく必要があるため、parentIdについて0から順番に実行する
    for (let parentId = 0; parentId < this.words.length; parentId++) {
      let parentWord: Word;
      this.words.forEach((word) => {
        if (word.id === parentId) {
          parentWord = word;
        }
      });
      let childWord;
      this.words.forEach((word) => {
        if (word.parentId === parentId) {
          childWord = word;
          if ('nsubj' === childWord.relation) {
            // 親とnsubj関連を持つ場合、親の終点が子の始点となる
            this.move(
              this.tempStarts,
              this.tempEnds,
              childWord.id,
              this.tempEnds[parentWord.id].x,
              this.tempStarts[parentWord.id].y
            );
          } else if (
            'det' === childWord.relation ||
            'amod' === childWord.relation ||
            'nmod_poss' === childWord.relation ||
            'advmod' === childWord.relation
          ) {
            //if (typeof childWord.childOrder != 'undefined' && childWord.childOrder >= 0) {
            // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
            let order: number;
            if (childWord.childOrder) {
              order = childWord.childOrder;
            } else {
              order = 0;
            }
            this.move(
              this.tempStarts,
              this.tempEnds,
              word.id,
              this.tempStarts[parentWord.id].x + 20 * (order + 1),
              this.tempStarts[parentWord.id].y
            );
            //}
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
    this.moveUsingDependencies();

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
        <div>Where is Bill's brother sitting?</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
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

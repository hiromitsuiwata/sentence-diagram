import React from 'react';
import TextLine from '../../diagram/svg/TextLine';

interface Props {}

interface State {
  starts: Start[];
}

class MyCardText extends React.Component<Props, State> {
  private words: Word[] = [];
  private tempStarts: Start[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      starts: [],
    };
    for (let i = 0; i < 4; i++) {
      this.state.starts.push({ x: 0, y: 0 });
    }
    // 最初のwordの始点
    this.state.starts[0].x = 40;
    this.state.starts[0].y = 40;
    // word
    this.words.push({ id: 0, text: 'unicorn' });
    this.words.push({
      id: 1,
      text: 'flew.',
      separator: true,
      parentId: 0,
      relation: 'nsubj',
    });
    this.words.push({
      id: 2,
      text: 'The',
      direction: 'right-down',
      parentId: 0,
      relation: 'det',
      childOrder: 0,
    });
    this.words.push({
      id: 3,
      text: 'white',
      direction: 'right-down',
      parentId: 0,
      relation: 'amod',
      childOrder: 1,
    });
    console.log(JSON.stringify(this.words));
  }

  /**
   * ある単語の長さの計算が終わったときに呼ばれるハンドラー
   */
  private handleCompute = (
    lengthComputedWordId: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    // 単語の長さを計算した結果を一時変数に保存してマウントされたときにstateに反映させる
    // TODO 単語間の位置関係における制約を記述する
    this.words.forEach((word) => {
      if (lengthComputedWordId === word.parentId) {
        if ('nsubj' === word.relation) {
          // 親とnsubj関連を持つ場合、親の終点が子の始点となる
          this.tempStarts[word.id] = { x: endX, y: startY };
        } else if ('det' === word.relation || 'amod' === word.relation) {
          if (typeof word.childOrder != 'undefined' && word.childOrder >= 0) {
            // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
            this.tempStarts[word.id] = {
              x: startX + 20 * (word.childOrder + 1),
              y: startY,
            };
          }
        }
      }

      if (lengthComputedWordId === word.id && word.parentId === undefined) {
        // 自分自身の始点(本来意味がないがReactの性質のためstateを丸ごと入れ替えているので記述必要)
        this.tempStarts[word.id] = { x: startX, y: startY };
      }
    });
  };

  render(): JSX.Element {
    // 固定部分(words)と可変部分(state.starts)を使ってタグを作る
    const list = [];
    for (let i = 0; i < this.words.length; i++) {
      list.push(
        <TextLine
          key={this.words[i].id}
          wordId={this.words[i].id}
          startX={10}
          startY={10}
          endX={10}
          endY={10}
          text={this.words[i].text}
          separator={this.words[i].separator}
          direction={this.words[i].direction}
        />
      );
    }

    return (
      <>
        <div>The white unicorn flew.</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
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

class Start {
  x: number = 0;
  y: number = 0;
}

class Word {
  id: number = 0;
  text: string = '';
  separator?: boolean = false;
  direction?: string = '';
  parentId?: number = 0;
  relation?: string = '';
  childOrder?: number = -1;
}

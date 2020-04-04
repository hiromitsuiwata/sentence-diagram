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
    console.log('MyCardText constructor');
    this.state = {
      starts: []
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
      relation: 'nsubj'
    });
    this.words.push({
      id: 2,
      text: 'The',
      direction: 'right-down',
      parentId: 0,
      relation: 'mod',
      childrenIndex: 1
    });
    this.words.push({
      id: 3,
      text: 'white',
      direction: 'right-down',
      parentId: 0,
      relation: 'mod',
      childrenIndex: 2
    });
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
        } else if ('mod' === word.relation) {
          if (word.childrenIndex) {
            // 親とmod関連を持つ場合、親の単語の途中の位置が子の始点となる
            this.tempStarts[word.id] = {
              x: startX + 20 * word.childrenIndex,
              y: startY
            };
          }
        }
      }

      if (lengthComputedWordId === word.id && word.parentId === undefined) {
        // 自分自身の始点(本来意味がないがReactの性質のためstateを丸ごと入れ替えているので記述必要)
        console.log(
          lengthComputedWordId + ': ' + word.id + ': ' + word.parentId + ': ' + word.text
        );
        this.tempStarts[word.id] = { x: startX, y: startY };
      }
    });
  };

  render(): JSX.Element {
    // 固定部分(words)と可変部分(state.starts)を使ってタグを作る
    let list = [];
    for (let i = 0; i < this.words.length; i++) {
      console.log(i);
      list.push(
        <TextLine
          key={this.words[i].id}
          wordId={this.words[i].id}
          x={this.state.starts[i].x}
          y={this.state.starts[i].y}
          text={this.words[i].text}
          separator={this.words[i].separator}
          direction={this.words[i].direction}
          onCompute={this.handleCompute}
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
    console.log('MyCardText componentDidMount');
    this.setState({ starts: this.tempStarts });
  }

  componentWillUnmount(): void {
    console.log('componentWillUnmount');
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
  childrenIndex?: number = 0;
}
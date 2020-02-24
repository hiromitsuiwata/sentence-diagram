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
    this.words.push({ id: '0', text: 'unicornxxxxxxxxxxxx' });
    this.words.push({ id: '1', text: 'flew.', separator: true });
    this.words.push({ id: '2', text: 'The', direction: 'right-down' });
    this.words.push({ id: '3', text: 'white', direction: 'right-down' });
  }

  /**
   * ある単語の長さの計算が終わったときに呼ばれるハンドラー
   */
  private handleCompute = (
    wordId: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    console.log('MyCardText handleCompute');
    // 単語の長さを計算した結果を一時変数に保存してマウントされたときにstateに反映させる

    // 単語間の位置関係における制約を記述する
    if (wordId === '0') {
      // 自分自身の始点(本来意味がないがReactの性質のためstateを丸ごと入れ替えているので記述必要)
      this.tempStarts[0] = { x: startX, y: startY };
      // 単語1の始点は単語0の終点とする
      this.tempStarts[1] = { x: endX, y: startY };
      // 単語2の始点はx方向に単語0の長さの1/3ずれた位置とする
      this.tempStarts[2] = { x: startX + (endX - startX) / 3, y: startY };
      // 単語3の始点はx方向に単語0の長さの2/3ずれた位置とする
      this.tempStarts[3] = { x: startX + ((endX - startX) * 2) / 3, y: startY };
    }
  };

  render(): JSX.Element {
    // 固定部分(words)と可変部分(state.starts)を使ってタグを作る
    let list = [];
    for (let i = 0; i < this.words.length; i++) {
      console.log(i);
      list.push(
        <TextLine
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
  id: string = '';
  text: string = '';
  separator?: boolean = false;
  direction?: string = '';
}

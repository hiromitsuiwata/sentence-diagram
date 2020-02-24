import React from 'react';
import TextLine from '../../diagram/svg/TextLine';

interface Props {}

interface State {
  startX: number;
}

class MyCardText extends React.Component<Props, State> {
  private tempX: number = 0;
  private handleCompute = (wordId: string, endX: number, endY: number) => {
    // 制約を指定する. 単語の長さを計算した結果をcomponentDidMountで設定し、state経由で反映させる
    if (wordId === '1') {
      this.tempX = endX;
    }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      startX: 0
    };
  }

  render(): JSX.Element {
    console.log('render: ' + this.state.startX);

    return (
      <>
        <div>The white unicorn flew.</div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
          <TextLine wordId="1" x={20} y={20} text="unicorn" onCompute={this.handleCompute} />
          <TextLine
            wordId="2"
            x={this.state.startX}
            y={20}
            text="flew."
            separator={true}
            onCompute={this.handleCompute}
          />
          <TextLine
            wordId="3"
            x={30}
            y={20}
            text="The"
            direction="right-down"
            onCompute={this.handleCompute}
          />
          <TextLine
            wordId="4"
            x={60}
            y={20}
            text="white"
            direction="right-down"
            onCompute={this.handleCompute}
          />
        </svg>
      </>
    );
  }

  componentDidMount(): void {
    console.log('componentDidMount: ' + this.state.startX);
    // stateに反映させる
    this.setState({ startX: this.tempX });
  }

  componentWillUnmount(): void {
    console.log('componentWillUnmount');
  }
}

export default MyCardText;

class Word {
  id: string = '';
  text: string = '';
  startX: number = 0;
  startY: number = 0;
  endX: number = 0;
  endY: number = 0;
  direction: string = '';
  separator: boolean = false;
}

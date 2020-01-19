import React from 'react';
import TextLine from '../../diagram/svg/TextLine';

interface Props {}

interface State {}

class MyCardText extends React.Component<Props, State> {
  private ends: any;
  private myEndX: number;
  private handleCompute = (wordId: string, endX: number, endY: number) => {
    this.ends.push({ wordId, endX, endY });
    console.log(this.ends);
    this.myEndX = this.ends.filter((end: any) => end.wordId === '1')[0].endX;
    console.log(this.myEndX);
  };

  constructor(props: Props) {
    super(props);
    this.ends = [];
    this.myEndX = 110;
  }

  render(): JSX.Element {
    return (
      <>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
          <TextLine wordId="1" x={20} y={20} text="unicorn" onCompute={this.handleCompute} />
          <TextLine
            wordId="2"
            x={this.myEndX}
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
}

export default MyCardText;

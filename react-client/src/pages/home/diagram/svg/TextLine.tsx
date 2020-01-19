import React from 'react';
import styles from './TextLine.module.css';
import { v4 as uuid } from 'uuid';

interface Props {
  wordId: string;
  x: number;
  y: number;
  text: string;
  direction?: string;
  separator?: boolean;
  onCompute: (id: string, endX: number, endY: number) => void;
}

interface State {}

class TextLine extends React.Component<Props, State> {
  private id: string;
  private href: string;
  private offset: number;
  private mainD: string;
  private separatorD: string;

  constructor(props: Props) {
    super(props);

    this.id = uuid();
    this.href = '#' + this.id;
    this.offset = 15;

    let length: number = this.props.text.length * 9 + 20;
    let endX: number;
    let endY: number;

    if (this.props.direction === 'right-down') {
      endX = Math.round(this.props.x + length / Math.sqrt(2));
      endY = Math.round(this.props.y + length / Math.sqrt(2));
    } else {
      endX = Math.round(this.props.x + length);
      endY = Math.round(this.props.y);
    }
    this.mainD = `M ${this.props.x} ${this.props.y} L ${endX} ${endY}`;

    let height = 15;
    this.separatorD = `M ${this.props.x} ${this.props.y - height} L ${this.props.x} ${this.props.y +
      height}`;

    this.props.onCompute(this.props.wordId, endX, endY);
  }

  render(): JSX.Element {
    if (this.props.separator) {
      return (
        <g>
          <path id={this.id} className={styles.redline} d={this.mainD}></path>
          <text>
            <textPath href={this.href} startOffset={this.offset}>
              {this.props.text}
            </textPath>
          </text>
          <path id={this.id} className={styles.redline} d={this.separatorD}></path>
        </g>
      );
    } else {
      return (
        <g>
          <path id={this.id} className={styles.redline} d={this.mainD}></path>
          <text>
            <textPath href={this.href} startOffset={this.offset}>
              {this.props.text}
            </textPath>
          </text>
        </g>
      );
    }
  }
}

export default TextLine;

import React from 'react';
import styles from './TextLine.module.css';
import { v4 as uuid } from 'uuid';

interface Props {
  wordId: number;
  x: number;
  y: number;
  text: string;
  direction?: string;
  separator?: boolean;
  onCompute: (id: number, startX: number, startY: number, endX: number, endY: number) => void;
}

interface State {}

class TextLine extends React.Component<Props, State> {
  render(): JSX.Element {
    const id = uuid();
    const href = '#' + id;
    const offset = 15;

    const length: number = this.props.text.length * 9 + 20;
    let endX: number;
    let endY: number;

    if (this.props.direction === 'right-down') {
      endX = Math.round(this.props.x + length / Math.sqrt(2));
      endY = Math.round(this.props.y + length / Math.sqrt(2));
    } else {
      endX = Math.round(this.props.x + length);
      endY = Math.round(this.props.y);
    }
    const mainD = `M ${this.props.x} ${this.props.y} L ${endX} ${endY}`;

    const height = 15;
    const separatorD = `M ${this.props.x} ${this.props.y - height} L ${this.props.x} ${
      this.props.y + height
    }`;

    this.props.onCompute(this.props.wordId, this.props.x, this.props.y, endX, endY);

    if (this.props.separator) {
      return (
        <g>
          <path id={id} className={styles.redline} d={mainD}></path>
          <text>
            <textPath href={href} startOffset={offset}>
              {this.props.text}
            </textPath>
          </text>
          <path id={id} className={styles.redline} d={separatorD}></path>
        </g>
      );
    } else {
      return (
        <g>
          <path id={id} className={styles.redline} d={mainD}></path>
          <text>
            <textPath href={href} startOffset={offset}>
              {this.props.text}
            </textPath>
          </text>
        </g>
      );
    }
  }
}

export default TextLine;

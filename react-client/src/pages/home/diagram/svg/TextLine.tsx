import React from 'react';
import styles from './TextLine.module.css';
import { v4 as uuid } from 'uuid';

interface Props {
  wordId: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  text: string;
  direction?: string;
  separator?: boolean;
}

interface State {}

class TextLine extends React.Component<Props, State> {
  render(): JSX.Element {
    const id = uuid();
    const href = '#' + id;
    const offset = 15;

    const mainD = `M ${this.props.startX} ${this.props.startY} L ${this.props.endX} ${this.props.endY}`;

    const height = 15;
    const separatorD = `M ${this.props.startX} ${this.props.startY - height} L ${
      this.props.startX
    } ${this.props.startY + height}`;

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

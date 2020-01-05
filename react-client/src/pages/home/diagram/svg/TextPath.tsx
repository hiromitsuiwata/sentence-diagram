import React from 'react';
import styles from './TextPath.module.css';
import { v4 as uuid } from 'uuid';

interface Props {
  x: number;
  y: number;
  text: string;
  direction: string;
}

interface State {}

class TextPath extends React.Component<Props, State> {
  id: string = uuid();
  href: string = '#' + this.id;
  length: number = this.props.text.length * 9 + 20;
  endX = Math.round(this.props.x + this.length / Math.sqrt(2));
  endY = Math.round(this.props.y + this.length / Math.sqrt(2));
  d: string = `M ${this.props.x} ${this.props.y} L ${this.endX} ${this.endY}`;
  offset: number = 15;

  render(): JSX.Element {
    return (
      <g>
        <path id={this.id} className={styles.redline} d={this.d}></path>
        <text>
          <textPath href={this.href} startOffset={this.offset}>
            {this.props.text}
          </textPath>
        </text>
      </g>
    );
  }
}

export default TextPath;

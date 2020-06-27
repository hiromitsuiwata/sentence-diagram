import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Diagram.module.css';
import TextLine from './svg/TextLine';
import Word from './Word';
import Coordinate from './Coordinate';
import axios from 'axios';

interface Props {
  id: number;
  title: string;
  text: string;
  closeModalHandler: () => void;
}

interface State {
  words: Word[];
}

class Diagram extends React.Component<Props, State> {
  private tempStarts: Coordinate[] = [];
  private tempEnds: Coordinate[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      words: [],
    };

    // 最初のwordの始点
    this.tempStarts.push({ x: 40, y: 40 });
  }

  private fillShortage = (): void => {
    const startsShortage = this.state.words.length - this.tempStarts.length;
    for (let i = 0; i < startsShortage; i++) {
      this.tempStarts.push({ x: 0, y: 0 });
    }
    const startsEnds = this.state.words.length - this.tempEnds.length;
    for (let i = 0; i < startsEnds; i++) {
      this.tempEnds.push({ x: 0, y: 0 });
    }
  };

  private computeEnds = (): void => {
    for (let i = 0; i < this.state.words.length; i++) {
      const length: number = this.state.words[i].text.length * 9 + 20;

      if (this.state.words[i].direction === 'right-down') {
        this.tempEnds[i].x = Math.round(this.tempStarts[i].x + length / Math.sqrt(2));
        this.tempEnds[i].y = Math.round(this.tempStarts[i].y + length / Math.sqrt(2));
      } else {
        this.tempEnds[i].x = Math.round(this.tempStarts[i].x + length);
        this.tempEnds[i].y = Math.round(this.tempStarts[i].y);
      }
    }
  };

  private computeStarts = (): void => {
    // TODO この計算はツリー構造の親から順番に実行していく必要がある
    // TODO 始点と終点をまとめて平行移動した方が良い

    for (let i = 0; i < this.state.words.length; i++) {
      this.state.words.forEach((word) => {
        if (i === word.parentId) {
          if ('nsubj' === word.relation) {
            // 親とnsubj関連を持つ場合、親の終点が子の始点となる
            this.tempStarts[word.id] = {
              x: this.tempEnds[i].x,
              y: this.tempStarts[i].y,
            };
          } else if ('det' === word.relation || 'amod' === word.relation) {
            if (typeof word.childOrder != 'undefined' && word.childOrder >= 0) {
              // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
              this.tempStarts[word.id] = {
                x: this.tempStarts[i].x + 20 * (word.childOrder + 1),
                y: this.tempStarts[i].y,
              };
            }
          }
        }
      });
    }
  };

  private fetchData = async () => {
    const result = await axios.put('/api/sentences/' + this.props.id + '/diagram');
    console.log(result.data);
    this.setState({ words: result.data });
  };

  render(): JSX.Element {
    console.log('render');

    // tempStarts, tempEndsの不足部分を埋める
    this.fillShortage();

    // 始点と単語の長さから終点を決定する
    this.computeEnds();

    // 単語間の意味の関連から始点を変更する
    this.computeStarts();

    // 変更した始点に対して再度終点を決定する
    this.computeEnds();

    const list: JSX.Element[] = [];
    for (let i = 0; i < this.state.words.length; i++) {
      list.push(
        <TextLine
          key={this.state.words[i].id}
          wordId={this.state.words[i].id}
          startX={this.tempStarts[i].x}
          startY={this.tempStarts[i].y}
          endX={this.tempEnds[i].x}
          endY={this.tempEnds[i].y}
          text={this.state.words[i].text}
          separator={this.state.words[i].separator}
          direction={this.state.words[i].direction}
        />
      );
    }

    return (
      <div className={styles.overlay}>
        <div className={styles.window}>
          <div className={styles.title}>{this.props.title}</div>
          <div className={styles.text}>
            <div>{this.props.text}</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500">
              {list}
            </svg>
          </div>
          <div className={styles.operation}>
            <div className={styles.operation_close}>
              <a href="#top" onClick={this.props.closeModalHandler}>
                close
                <FontAwesomeIcon icon={faWindowClose} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    console.log('componentDidMount');
    this.fetchData();
  }
}

export default Diagram;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Diagram.module.css';
import TextLine from './svg/TextLine';
import Word from './Word';
import Coordinate from './Coordinate';
import axios from 'axios';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';

interface Props {
  id: number;
  title: string;
  text: string;
  closeModalHandler: () => void;
}

interface State {
  words: Word[];
  loading: boolean;
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Diagram extends React.Component<Props, State> {
  private tempStarts: Coordinate[] = [];
  private tempEnds: Coordinate[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      words: [],
      loading: true,
    };

    // 最初のwordの始点
    // TODO ダイアグラム全体の位置から再決定した方が良い
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

  private move = (
    targetStarts: Coordinate[],
    targetEnds: Coordinate[],
    i: number,
    expectedStartX: number,
    expectedStartY: number
  ): void => {
    const actualStartX = targetStarts[i].x;
    const actualStartY = targetStarts[i].y;
    const diffX = expectedStartX - actualStartX;
    const diffY = expectedStartY - actualStartY;
    targetStarts[i].x = actualStartX + diffX;
    targetStarts[i].y = actualStartY + diffY;
    targetEnds[i].x = targetEnds[i].x + diffX;
    targetEnds[i].y = targetEnds[i].y + diffY;
  };

  private moveUsingDependencies = (): void => {
    // 文法上の依存関係から始点と終点をまとめて平行移動する
    // ツリー構造の親から順番に実行していく必要があるため、parentIdについて0から順番に実行する
    for (let i = 0; i < this.state.words.length; i++) {
      this.state.words.forEach((word) => {
        if (i === word.parentId) {
          // const actualStartX = this.tempStarts[word.id].x;
          // const actualStartY = this.tempStarts[word.id].y;
          if ('nsubj' === word.relation) {
            // 親とnsubj関連を持つ場合、親の終点が子の始点となる
            this.move(
              this.tempStarts,
              this.tempEnds,
              word.id,
              this.tempEnds[i].x,
              this.tempStarts[i].y
            );
          } else if ('det' === word.relation || 'amod' === word.relation) {
            if (typeof word.childOrder != 'undefined' && word.childOrder >= 0) {
              // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
              this.move(
                this.tempStarts,
                this.tempEnds,
                word.id,
                this.tempStarts[i].x + 20 * (word.childOrder + 1),
                this.tempStarts[i].y
              );
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
    this.setState({ loading: false });
  };

  render(): JSX.Element {
    console.log('render');

    if (this.state.loading) {
      return (
        <div className={styles.overlay}>
          <div className={styles.window}>
            <div className={styles.title}>{this.props.title}</div>
            <div className={styles.text}>
              <div>{this.props.text}</div>
              <div className="sweet-loading">
                <ClipLoader
                  css={override}
                  size={150}
                  color={'#123abc'}
                  loading={this.state.loading}
                />
              </div>
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

    // tempStarts, tempEndsの不足部分を埋める
    this.fillShortage();

    // 始点と単語の長さから終点を決定する
    this.computeEnds();

    // 単語間の意味の関連から位置を変更する
    this.moveUsingDependencies();

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

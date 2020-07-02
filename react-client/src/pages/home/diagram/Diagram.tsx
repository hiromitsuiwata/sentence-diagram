import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { css } from '@emotion/core';
import BounceLoader from 'react-spinners/BounceLoader';

import styles from './Diagram.module.css';
import Coordinate from './Coordinate';
import TextLine from './svg/TextLine';
import Word from './Word';

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
  border-color: #0bd;
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
      this.tempStarts.push({ x: 100, y: 100 });
    }
    const startsEnds = this.state.words.length - this.tempEnds.length;
    for (let i = 0; i < startsEnds; i++) {
      this.tempEnds.push({ x: 100, y: 100 });
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

  private findChildren = (words: Word[], parent: Word): Word[] => {
    const parentId = parent.id;
    const result: Word[] = [];
    words.forEach((word) => {
      if (word.parentId === parentId) {
        result.push(word);
      }
    });
    return result;
  };

  private moveUsingDependencies = (): void => {
    // 文法上の依存関係から始点と終点をまとめて平行移動する
    // ツリー構造の親から順番に実行していく必要がある

    // ルートを探す
    let root: Word = { id: 0, text: '' };
    for (let id = 0; id < this.state.words.length; id++) {
      const word = this.state.words[id];
      if (word.parentId === undefined) {
        root = word;
      }
    }

    // ルートから繋がっているwordを幅優先探索し、rootに近いところからsortedWordsに詰める
    const sortedWords: Word[] = [];
    const stack = [root];
    const dequeue = (array: Word[]): Word => {
      const word: any = array.shift();
      sortedWords.push(word);
      return word;
    };
    while (stack.length > 0) {
      const row = dequeue(stack);
      if (this.findChildren(this.state.words, row)) {
        this.findChildren(this.state.words, row).forEach((childNode) => stack.push(childNode));
      }
    }

    // rootに近いところから順番に位置を決定していく
    sortedWords.forEach((sortedWord) => {
      const parentId = sortedWord.id;

      let childWord;
      for (let wordId = 0; wordId < this.state.words.length; wordId++) {
        const word = this.state.words[wordId];
        if (word.parentId === parentId) {
          childWord = word;
          if ('nsubj' === childWord.relation || 'dobj' === childWord.relation) {
            // 親とnsubj関連を持つ場合、親の終点が子の始点となる
            this.move(
              this.tempStarts,
              this.tempEnds,
              childWord.id,
              this.tempEnds[parentId].x,
              this.tempStarts[parentId].y
            );
          } else if (
            'det' === childWord.relation ||
            'amod' === childWord.relation ||
            'nmod_poss' === childWord.relation ||
            'advmod' === childWord.relation ||
            'nmod_tmod' === childWord.relation ||
            'neg' === childWord.relation
          ) {
            // 親と修飾の関連を持つ場合、親の単語の途中の位置が子の始点となる
            let order: number;
            if (childWord.childOrder) {
              order = childWord.childOrder;
            } else {
              order = 0;
            }
            this.move(
              this.tempStarts,
              this.tempEnds,
              word.id,
              this.tempStarts[parentId].x + 20 * (order + 1),
              this.tempStarts[parentId].y
            );
          }
        }
      }
    });
  };

  private fetchData = async () => {
    const result = await axios.put('/api/sentences/' + this.props.id + '/diagram');
    console.log(result.data);
    this.setState({ words: result.data });
    this.setState({ loading: false });
  };

  private moveAllWords = () => {
    let minX = 1000;
    let maxX = -1000;
    let minY = 1000;
    let maxY = -1000;
    for (let i = 0; i < this.state.words.length; i++) {
      minX = Math.min(minX, this.tempStarts[i].x);
      maxX = Math.max(maxX, this.tempEnds[i].x);
      minY = Math.min(minY, this.tempStarts[i].y);
      maxY = Math.max(maxY, this.tempEnds[i].y);
    }
    const aveX = (minX + maxX) / 2;
    const aveY = (minY + maxY) / 2;
    const expectedX = 900 / 2;
    const expectedY = 500 / 2;
    const diffX = expectedX - aveX;
    const diffY = expectedY - aveY;

    for (let i = 0; i < this.state.words.length; i++) {
      this.move(
        this.tempStarts,
        this.tempEnds,
        i,
        this.tempStarts[i].x + diffX,
        this.tempStarts[i].y + diffY
      );
    }
  };

  render(): JSX.Element {
    console.log('render');

    // サーバーからのレスポンス待ちの間はloading spinnerを表示する
    if (this.state.loading) {
      return (
        <div className={styles.overlay}>
          <div className={styles.window}>
            <div className={styles.title}>{this.props.title}</div>
            <div className={styles.text}>
              <div>{this.props.text}</div>
              <div className={styles.loading}>
                <BounceLoader
                  css={override}
                  size={60}
                  color={'#0bd'}
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

    // 文全体の位置から全体を平行移動する
    this.moveAllWords();

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

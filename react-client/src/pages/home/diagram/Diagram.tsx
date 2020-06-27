import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Diagram.module.css';
import TextLine from './svg/TextLine';
import Word from './Word';
import Start from './Start';
import axios from 'axios';

interface Props {
  id: number;
  title: string;
  text: string;
  closeModalHandler: () => void;
}

interface State {
  starts: Start[];
  words: Word[];
}

class Diagram extends React.Component<Props, State> {
  private tempStarts: Start[] = [];
  private tempWords: Word[] = [];
  private counter: number = 0;

  constructor(props: Props) {
    super(props);

    this.state = {
      starts: [],
      words: [],
    };
    // TODO 固定値として4を設定してしまっている
    for (let i = 0; i < 4; i++) {
      this.state.starts.push({ x: 0, y: 0 });
    }
    // 最初のwordの始点
    this.state.starts[0].x = 40;
    this.state.starts[0].y = 40;

    // TODO 固定値として4を設定してしまっている
    for (let i = 0; i < 4; i++) {
      this.tempStarts.push({ x: 0, y: 0 });
    }
    // 最初のwordの始点
    this.tempStarts[0].x = 40;
    this.tempStarts[0].y = 40;

    // TODO あとで消す
    // word
    /*
    this.state.words.push({ id: 0, text: 'unicorn' });
    this.state.words.push({
      id: 1,
      text: 'flew.',
      separator: true,
      parentId: 0,
      relation: 'nsubj',
    });
    this.state.words.push({
      id: 2,
      text: 'The',
      direction: 'right-down',
      parentId: 0,
      relation: 'det',
      childOrder: 0,
    });
    this.state.words.push({
      id: 3,
      text: 'white',
      direction: 'right-down',
      parentId: 0,
      relation: 'amod',
      childOrder: 1,
    });
    */
  }

  /**
   * ある単語の長さの計算が終わったときに呼ばれるハンドラー
   */
  private handleCompute = (
    lengthComputedWordId: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void => {
    // 単語の長さを計算した結果を一時変数に保存してマウントされたときにstateに反映させる
    // TODO 単語間の位置関係における制約を記述する
    this.state.words.forEach((word) => {
      if (lengthComputedWordId === word.parentId) {
        if ('nsubj' === word.relation) {
          // 親とnsubj関連を持つ場合、親の終点が子の始点となる
          this.tempStarts[word.id] = {
            x: endX,
            y: startY,
          };
        } else if ('det' === word.relation || 'amod' === word.relation) {
          if (typeof word.childOrder != 'undefined' && word.childOrder >= 0) {
            // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
            this.tempStarts[word.id] = {
              x: startX + 20 * (word.childOrder + 1),
              y: startY,
            };
          }
        }
      }

      if (lengthComputedWordId === word.id && word.parentId === undefined) {
        // 自分自身の始点(本来意味がないがReactの性質のためstateを丸ごと入れ替えているので記述必要)
        this.tempStarts[word.id] = {
          x: startX,
          y: startY,
        };
      }
    });

    // FIXME renderから呼び出されるのにstateを変更してはいけない
    if (this.counter < 1) {
      this.setState({ starts: this.tempStarts });
      this.counter = this.counter + 1;
    }
  };

  private fetchData = async () => {
    const result = await axios.put('/api/sentences/' + this.props.id + '/diagram');
    console.log(result.data);
    console.log('fetchData');

    // TODO レスポンスを使うように変更する
    this.tempWords = [];
    this.tempWords.push({ id: 0, text: 'unicorn' });
    this.tempWords.push({
      id: 1,
      text: 'flew. ###AXIOS RESPONSE###',
      separator: true,
      parentId: 0,
      relation: 'nsubj',
    });
    this.tempWords.push({
      id: 2,
      text: 'The',
      direction: 'right-down',
      parentId: 0,
      relation: 'det',
      childOrder: 0,
    });
    this.tempWords.push({
      id: 3,
      text: 'white',
      direction: 'right-down',
      parentId: 0,
      relation: 'amod',
      childOrder: 1,
    });
    this.setState({ words: this.tempWords });
  };

  render(): JSX.Element {
    console.log('render');
    console.log('this.state.words.length: ' + this.state.words.length);
    console.log('this.state.starts.length: ' + this.state.starts.length);

    // 固定部分(words)と可変部分(state.starts)を使ってタグを作る
    const list: JSX.Element[] = [];

    for (let i = 0; i < this.state.words.length; i++) {
      console.log(i);
      list.push(
        <TextLine
          key={this.state.words[i].id}
          wordId={this.state.words[i].id}
          x={this.state.starts[i].x}
          y={this.state.starts[i].y}
          text={this.state.words[i].text}
          separator={this.state.words[i].separator}
          direction={this.state.words[i].direction}
          onCompute={this.handleCompute}
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
    this.setState({ starts: this.tempStarts });
    this.fetchData();
  }
}

export default Diagram;

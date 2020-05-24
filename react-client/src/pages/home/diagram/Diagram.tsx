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

const Diagram: React.FC<Props> = (props: Props) => {
  const [url, setUrl] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [starts, setStarts] = useState<Start[]>([]);
  const [list, setList] = useState();

  /**
   * ある単語の長さの計算が終わったときに呼ばれるハンドラー
   */
  function handleCompute(
    lengthComputedWordId: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    // 単語の長さを計算した結果を一時変数に保存してマウントされたときにstateに反映させる
    // TODO 単語間の位置関係における制約を記述する
    words.forEach((word) => {
      if (lengthComputedWordId === word.parentId) {
        if ('nsubj' === word.relation) {
          // 親とnsubj関連を持つ場合、親の終点が子の始点となる
          starts[word.id] = {
            x: endX,
            y: startY,
          };
        } else if ('det' === word.relation || 'amod' === word.relation) {
          if (typeof word.childOrder != 'undefined' && word.childOrder >= 0) {
            // 親とdetまたはamod関連を持つ場合、親の単語の途中の位置が子の始点となる
            starts[word.id] = {
              x: startX + 20 * (word.childOrder + 1),
              y: startY,
            };
          }
        }
      }

      if (lengthComputedWordId === word.id && word.parentId === undefined) {
        // 自分自身の始点(本来意味がないがReactの性質のためstateを丸ごと入れ替えているので記述必要)
        starts[word.id] = {
          x: startX,
          y: startY,
        };
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.put('/api/sentences/' + props.id + '/diagram');
      console.log(result.data);
      // 固定部分(words)と可変部分(state.starts)を使ってタグを作る
      const list = [];
      for (let i = 0; i < words.length; i++) {
        list.push(
          <TextLine
            key={words[i].id}
            wordId={words[i].id}
            x={starts[i].x}
            y={starts[i].y}
            text={words[i].text}
            separator={words[i].separator}
            direction={words[i].direction}
            onCompute={handleCompute}
          />
        );
      }
      //TODO
      //setList(list);
      setWords(result.data);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.window}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.text}>
          <div>{props.text}</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="900" height="500">
            {list}
          </svg>
        </div>
        <div className={styles.operation}>
          <div className={styles.operation_close}>
            <a href="#top" onClick={props.closeModalHandler}>
              close
              <FontAwesomeIcon icon={faWindowClose} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagram;

import React from 'react';
import axios from 'axios';

import HomeHeader from './header/HomeHeader';
import Card from './card/Card';
import MyCard from './mycard/MyCard';
import Diagram from './diagram/Diagram';
import styles from './Home.module.css';

interface Props {}

interface State {
  diagramModal: DiagramModalContent;
  showingDiagram: boolean;
  showingRegistration: boolean;
  cards: CardContent[];
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // 子コンポーネントで呼び出すこのコンポーネントのメソッドはthisをこのコンポーネントにバインドする
    this.openDiagram = this.openDiagram.bind(this);
    this.closeDiagram = this.closeDiagram.bind(this);
    this.search = this.search.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    console.log('Home constructor');

    this.state = {
      diagramModal: { id: 1, title: '', text: '', diagramData: '' },
      showingDiagram: false,
      showingRegistration: false,
      cards: [],
    };
  }

  componentDidMount(): void {
    console.log('Home componentDidMount');

    axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    axios
      .get('http://localhost:9080/sentence-diagram-web/api/sentences')
      .then((response) => {
        console.log({
          response: response,
        });
        this.setState({ cards: response.data });
      })
      .catch((error) => {
        console.log({
          error: error,
        });
      });
  }

  componentWillUnmount(): void {
    console.log('Home componentWillUnmount');
  }

  render(): JSX.Element {
    const cards = this.state.cards.map((d) => (
      <Card
        key={d.id}
        id={d.id}
        title={d.title}
        text={d.text}
        url={d.url}
        openModalHandler={this.openDiagram}
        deleteCardHandler={this.deleteCard}
      />
    ));

    if (this.state.showingDiagram) {
      return (
        <div className={styles.Home}>
          <Diagram
            id={this.state.diagramModal.id}
            title={this.state.diagramModal.title}
            text={this.state.diagramModal.text}
            closeModalHandler={this.closeDiagram}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.Home}>
          <HomeHeader searchHander={this.search} />
          <div className={styles.main}>
            <div className={styles.columns}>
              <MyCard />
              {cards}
            </div>
          </div>
        </div>
      );
    }
  }

  openDiagram(id: number, title: string, text: string): void {
    console.log('open diagram');
    const diagramModalContent = new DiagramModalContent(id, title, text);
    console.log(diagramModalContent);
    this.setState({ showingDiagram: true, diagramModal: diagramModalContent });
  }

  deleteCard(id: number): void {
    console.log('delete: ' + id);
    this.setState({ cards: this.state.cards.filter((card) => card.id !== id) });
    axios
      .delete('http://localhost:9080/sentence-diagram-web/api/sentences/' + id)
      .then((response) => {
        console.log({
          response: response,
        });
      })
      .catch((error) => {
        console.log({
          error: error,
        });
      });
  }

  closeDiagram(): void {
    console.log('closeModal');
    this.setState({ showingDiagram: false });
  }

  search(keyword: string): void {
    console.log('search: ' + keyword);
    // TODO テスト用に設定
    axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    // テスト用にドメインを指定
    axios
      .get('http://localhost:9080/sentence-diagram-web/api/sentences/search', {
        params: {
          q: keyword,
        },
      })
      .then((response) => {
        console.log({
          response: response,
        });
        this.setState({ cards: response.data });
      })
      .catch((error) => {
        console.log({
          error: error,
        });
      });
  }
}

class CardContent {
  id: number = 0;
  title: string = '';
  text: string = '';
  url: string = '';
}

class DiagramModalContent {
  id: number = 0;
  title: string = '';
  text: string = '';
  diagramData: any = '';

  constructor(id: number, title: string, text: string) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}

export default Home;

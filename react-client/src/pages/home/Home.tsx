import React from 'react';
import axios from 'axios';

import HomeHeader from './header/HomeHeader';
import Card from './card/Card';
import MyCard from './mycard/MyCard';
import Diagram from './diagram/Diagram';
import styles from './Home.module.css';

interface Props {}

interface State {
  modal: ModalContent;
  showingModal: boolean;
  cards: CardContent[];
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // 子コンポーネントで呼び出すこのコンポーネントのメソッドはthisをこのコンポーネントにバインドする
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.search = this.search.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    console.log('Home constructor');

    this.state = {
      modal: { id: 1, title: '', text: '', diagramData: '' },
      showingModal: false,
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
        openModalHandler={this.openModal}
        deleteCardHandler={this.deleteCard}
      />
    ));

    if (this.state.showingModal) {
      return (
        <div className={styles.Home}>
          <Diagram
            id={this.state.modal.id}
            title={this.state.modal.title}
            text={this.state.modal.text}
            closeModalHandler={this.closeModal}
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

  openModal(id: number, title: string, text: string): void {
    console.log('openModal');
    const modalContent = new ModalContent(id, title, text);
    console.log(modalContent);
    this.setState({ showingModal: true, modal: modalContent });
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

  closeModal(): void {
    console.log('closeModal');
    this.setState({ showingModal: false });
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

class ModalContent {
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

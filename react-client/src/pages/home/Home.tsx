import React from 'react';
import axios from 'axios';

import HomeHeader from './header/HomeHeader';
import Card from './card/Card';
import MyCard1 from './mycard/card1/MyCard';
import MyCard2 from './mycard/card2/MyCard';
import Diagram from './diagram/Diagram';
import Registration from './registration/Registration';
import styles from './Home.module.css';

interface Props {}

interface State {
  diagramModal: DiagramModalContent;
  showingDiagram: boolean;
  showingRegistration: boolean;
  cards: CardContent[];
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

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // 子コンポーネントで呼び出すこのコンポーネントのメソッドはthisをこのコンポーネントにバインドする
    this.openDiagram = this.openDiagram.bind(this);
    this.closeDiagram = this.closeDiagram.bind(this);
    this.openRegistration = this.openRegistration.bind(this);
    this.submitRegistration = this.submitRegistration.bind(this);
    this.cancelRegistration = this.cancelRegistration.bind(this);
    this.search = this.search.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    this.state = {
      diagramModal: { id: 1, title: '', text: '', diagramData: '' },
      showingDiagram: false,
      showingRegistration: false,
      cards: [],
    };
  }

  componentDidMount(): void {
    axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    axios
      .get<CardContent[]>('/api/sentences')
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
    } else if (this.state.showingRegistration) {
      return (
        <div className={styles.Home}>
          <Registration
            submitRegistrationHandler={this.submitRegistration}
            cancelRegistrationHandler={this.cancelRegistration}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.Home}>
          <HomeHeader
            searchHander={this.search}
            openRegistrationHandler={this.openRegistration}
            loginHandler={this.login}
          />
          <div className={styles.main}>
            <div className={styles.columns}>
              <MyCard1 />
              <MyCard2 />
              {cards}
            </div>
          </div>
        </div>
      );
    }
  }

  openDiagram(id: number, title: string, text: string): void {
    const diagramModalContent = new DiagramModalContent(id, title, text);
    console.log(diagramModalContent);
    this.setState({ showingDiagram: true, diagramModal: diagramModalContent });
  }

  closeDiagram(): void {
    this.setState({ showingDiagram: false });
  }

  openRegistration(): void {
    this.setState({ showingRegistration: true });
  }

  submitRegistration(title: string, text: string, url: string): void {
    this.setState({ showingRegistration: false });
    // TODO テスト用に設定
    //axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    // テスト用にドメインを指定
    axios
      .post<CardContent>('/api/sentences', {
        title,
        text,
        url,
      })
      .then((response) => {
        console.log({
          response: response,
        });
        const addedCard: CardContent = new CardContent();
        addedCard.id = response.data.id;
        addedCard.title = response.data.title;
        addedCard.text = response.data.text;
        addedCard.url = response.data.url;
        this.setState({ cards: this.state.cards.concat(addedCard) });
      })
      .catch((error) => {
        console.log({
          error: error,
        });
      });
  }

  cancelRegistration(): void {
    this.setState({ showingRegistration: false });
  }

  deleteCard(id: number): void {
    console.log('delete: ' + id);
    this.setState({ cards: this.state.cards.filter((card) => card.id !== id) });
    axios
      .delete('/api/sentences/' + id)
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

  search(keyword: string): void {
    console.log('search: ' + keyword);
    // TODO テスト用に設定
    //axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    // テスト用にドメインを指定
    axios
      .get<CardContent[]>('/api/sentences/search', {
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

  login(user: string, password: string): void {
    const params = new URLSearchParams();
    params.append('user', user);
    params.append('password', password);
    axios.post('/api/users/login', params).then((response) => {
      console.log({ response: response });
    });
  }
}

export default Home;

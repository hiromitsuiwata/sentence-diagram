import React from 'react';

import HomeHeader from './header/HomeHeader';
import Card from './card/Card';
import MyCard from './mycard/MyCard';
import Diagram from './diagram/Diagram';
import styles from './Home.module.css';

interface Props {}

interface State {
  modal: ModalContent;
  showingModal: boolean;
}

class Home extends React.Component<Props, State> {
  private cards: CardContent[];

  constructor(props: Props) {
    super(props);

    // 子コンポーネントで呼び出すこのコンポーネントのメソッドはthisをこのコンポーネントにバインドする
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.search = this.search.bind(this);

    console.log('Home constructor');

    this.cards = [
      {
        id: 1,
        title: 'Spring (device)',
        text:
          'When a conventional spring, without stiffness variability features, is compressed or stretched from its resting position, it exerts an opposing force approximately proportional to its change in length (this approximation breaks down for larger deflections).',
        url: 'https://en.wikipedia.org/wiki/Spring_(device)'
      },
      {
        id: 2,
        title: 'Hydnum repandum',
        text:
          'Hydnum repandum, commonly known as the sweet tooth, wood hedgehog or hedgehog mushroom, is a basidiomycete fungus of the family Hydnaceae.',
        url: 'https://en.wikipedia.org/wiki/Hydnum_repandum'
      },
      {
        id: 3,
        title: 'IndyCar Classic',
        text:
          'Circuit of the Americas (COTA) in Austin, Texas, was built to Formula One (F1) specifications to host the United States Grand Prix starting in 2012.',
        url: 'https://en.wikipedia.org/wiki/IndyCar_Classic'
      },
      {
        id: 4,
        title: 'Jude Akuwudike',
        text:
          'Jude Akuwudike (born 1965) is a Nigerian-born actor educated in England. He has mostly worked there, on stage and screen.',
        url: 'https://en.wikipedia.org/wiki/Jude_Akuwudike'
      },
      {
        id: 5,
        title: 'Fiery-browed starling',
        text:
          'Distinguished by a reddish-orange stripe over the eye, it is endemic to the Indonesian island of Sulawesi, mainly living in humid highland forest.',
        url: 'https://en.wikipedia.org/wiki/Fiery-browed_starling'
      },
      {
        id: 6,
        title: 'Yukio Mishima',
        text:
          'Yukio Mishima (三島 由紀夫 Mishima Yukio) is the pen name of Kimitake Hiraoka (平岡 公威 Hiraoka Kimitake, January 14, 1925 – November 25, 1970), a Japanese author, poet, playwright, actor, model, film director, nationalist, and founder of the Tatenokai. Mishima is considered one of the most important Japanese authors of the 20th century.',
        url: 'https://en.wikipedia.org/wiki/Yukio_Mishima'
      }
    ];

    this.state = {
      modal: { id: 1, title: '', text: '', diagramData: '' },
      showingModal: false
    };
  }

  componentDidMount(): void {
    console.log('Home componentDidMount');
  }

  componentWillUnmount(): void {
    console.log('Home componentWillUnmount');
  }

  render(): JSX.Element {
    const cards = this.cards.map((d) => (
      <Card
        key={d.id}
        id={d.id}
        title={d.title}
        text={d.text}
        url={d.url}
        openModalHandler={this.openModal}
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

  closeModal(): void {
    console.log('closeModal');
    this.setState({ showingModal: false });
  }

  search(keyword: string): void {
    console.log('search: ' + keyword);
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

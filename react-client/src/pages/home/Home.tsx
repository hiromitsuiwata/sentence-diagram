import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

import HomeHeader from './header/HomeHeader';
import Card from './card/Card';
import MyCard from './mycard/MyCard';
import styles from './Home.module.css';

interface Props {}

interface State {
  cards: CardContent[];
  searchKeyword: string;
  modal: ModalContent;
  showingModal: boolean;
}

class Home extends React.Component<Props, State> {
  constructor(props: object) {
    super(props);

    // 子コンポーネントで呼び出すこのコンポーネントのメソッドはthisをこのコンポーネントにバインドする
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.search = this.search.bind(this);

    console.log('constructor');
    this.state = {
      cards: [
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
      ],
      modal: { id: 1, title: '', text: '', diagramData: '' },
      showingModal: false,
      searchKeyword: ''
    };
  }

  componentDidMount(): void {
    console.log('componentDidMount');
  }

  componentWillUnmount(): void {
    console.log('componentWillUnmount');
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
      />
    ));

    if (this.state.showingModal) {
      return (
        <div className={styles.Home}>
          <div className={styles.modal_overlay}>
            <div className={styles.modal_window}>
              <div className={styles.card_title}>{this.state.modal.title}</div>
              <div className={styles.card_text}>
                <div>{this.state.modal.text}</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 900 500"
                  width="900"
                  height="500"
                ></svg>
              </div>
              <div className={styles.card_operation}>
                <div className={styles.card_operation_close}>
                  <a href="#top" onClick={this.closeModal}>
                    close
                    <FontAwesomeIcon icon={faWindowClose} />
                  </a>
                </div>
              </div>
            </div>
          </div>
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

export default Home;

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

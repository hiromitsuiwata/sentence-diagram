import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import RegisterHeader from './header/RegisterHeader';

import styles from './Register.module.css';

interface Props {}

interface State {
  title: string;
  text: string;
  url: string;
}

class Register extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(): JSX.Element {
    return (
      <div>
        <RegisterHeader></RegisterHeader>
        <div className={styles.main}>
          <div className={styles.register_fields}>
            <input
              type="text"
              className={styles.editor_title}
              placeholder="Title"
              name="title"
              onChange={this.handleChange}
            ></input>
            <textarea
              className={styles.editor_text}
              placeholder="Your text here"
              name="text"
              onChange={this.handleChange}
            ></textarea>
            <input
              type="text"
              className={styles.editor_url}
              placeholder="URL"
              name="url"
              onChange={this.handleChange}
            ></input>
            <div className={styles.button_area}>
              <Link to="/">
                <div className={styles.cancel_button}>Cancel</div>
              </Link>
              <Link to="/">
                <div className={styles.post_button} onClick={() => this.handleSubmit()}>
                  Post
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleChange(e: React.FormEvent): void {
    console.log(e.target);

    const name = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    if (name === 'title') {
      this.setState({ title: value });
    } else if (name === 'text') {
      this.setState({ text: value });
    } else if (name === 'url') {
      this.setState({ url: value });
    }
  }
  handleSubmit(): void {
    // TODO テスト用に設定
    axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
    // テスト用にドメインを指定
    axios
      .post('http://localhost:9080/sentence-diagram-web/api/sentences', {
        title: this.state.title,
        text: this.state.text,
        url: this.state.url,
      })
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
}

export default Register;

import React from 'react';
import styles from './Registration.module.css';

interface Props {
  submitRegistrationHandler: (title: string, text: string, url: string) => void;
  cancelRegistrationHandler: () => void;
}

interface State {
  title: string;
  text: string;
  url: string;
}

class Registeration extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      title: '',
      text: '',
      url: '',
    };
  }

  render(): JSX.Element {
    return (
      <div>
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
              <div className={styles.cancel_button} onClick={() => this.handleCancel()}>
                Cancel
              </div>
              <div className={styles.post_button} onClick={() => this.handleSubmit()}>
                Post
              </div>
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
    this.props.submitRegistrationHandler(this.state.title, this.state.text, this.state.url);
  }

  handleCancel(): void {
    this.props.cancelRegistrationHandler();
  }
}

export default Registeration;

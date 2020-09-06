import React, { useState } from 'react';
import styles from './Registration.module.css';

interface Props {
  submitRegistrationHandler: (title: string, text: string, url: string) => void;
  cancelRegistrationHandler: () => void;
}

const Registration: React.FC<Props> = (props) => {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [url, setUrl] = useState<string>('');

  function handleChange(e: React.FormEvent): void {
    const name = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'text') {
      setText(value);
    } else if (name === 'url') {
      setUrl(value);
    }
  }

  function handleSubmit(): void {
    props.submitRegistrationHandler(title, text, url);
  }

  function handleCancel(): void {
    props.cancelRegistrationHandler();
  }

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.register_fields}>
          <input
            type="text"
            className={styles.editor_title}
            placeholder="Title"
            name="title"
            onChange={handleChange}
          ></input>
          <textarea
            className={styles.editor_text}
            placeholder="Your text here"
            name="text"
            onChange={handleChange}
          ></textarea>
          <input
            type="text"
            className={styles.editor_url}
            placeholder="URL"
            name="url"
            onChange={handleChange}
          ></input>
          <div className={styles.button_area}>
            <div className={styles.cancel_button} onClick={() => handleCancel()}>
              Cancel
            </div>
            <div className={styles.post_button} onClick={() => handleSubmit()}>
              Post
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

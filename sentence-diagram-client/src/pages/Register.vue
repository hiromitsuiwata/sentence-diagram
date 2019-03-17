<template>
  <div>
    <register-header></register-header>
    <div class="main">
      <div class="register-fields">
        <textarea class="editor editor-text" placeholder="Your text here" v-model="text"></textarea>
        <input type="text" class="editor editor-url" placeholder="URL" v-model="url">
        <div class="button-area">
          <div class="post-button" v-on:click="submit">Post</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import RegisterHeader from '../components/RegisterHeader.vue';

Vue.component('register-header', RegisterHeader);

export default {
  data() {
    return {
      text:
        'The cathedral is dedicated to Finbarr of Cork, patron saint of the city, who may have founded a monastery on the grounds in the seventh century.',
      url: 'https://en.wikipedia.org/wiki/Saint_Fin_Barre%27s_Cathedral'
    };
  },
  methods: {
    submit: function(event) {
      console.log(this.text);
      console.log(this.url);

      axios
        .post('/sentence-diagram-web/api/sentences', {
          text: this.text,
          url: this.url
        })
        .then(function(response) {
          console.log(response);
        })
        .then(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.main {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-width: 1px;
  width: 520px;
  height: 340px;
  margin-top: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px #ccc;
  padding: 10px;
  display: inline-block;
}

.editor {
  margin: 10px 10px 10px 10px;
  border-style: none;
  resize: none;
}

.editor-text {
  font-size: 16px;
  height: 220px;
  width: 500px;
}

.editor-url {
  font-size: 16px;
  width: 500px;
}

.placeholder:empty:before {
  color: gray;
  content: attr(data-placeholder);
}

.button-area {
  border-top: 1px solid #eee;
}

.post-button {
  position: absolute;
  background-color: #4169e1;
  color: #fff;
  width: 40px;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  margin: 10px 10px 0 0;
  right: 0;
  box-shadow: 0 6px 3px -3px rgba(0, 0, 0, 0.07);
  text-align: center;
  cursor: pointer;
}
</style>

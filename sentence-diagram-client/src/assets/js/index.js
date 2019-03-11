import _ from 'lodash';
import Vue from 'vue';
import axios from 'axios';
import CardLorem from '../../components/cardlorem.vue';

import '../css/brands.css';
import '../css/fontawesome.css';
import '../css/sentence.css';
import '../css/solid.css';
import '../css/normalize.css';


function component() {
  let element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}

document.querySelector(".main").appendChild(component());

var app1 = new Vue({
  el: '#app-1',
  data: {
    message: 'Hello Vue!'
  }
});
app1.message = ' #### I have changed the data #### ';

new Vue({
  el: '#app-2',
  data: {
    message: 'You loaded this page on ' + new Date().toLocaleString()
  }
});

new Vue({
  el: "#app-3",
  data: {
    x1: 100,
    active: false
  }
});

new Vue({
  el: '#app-4',
  data: {
    message: 'Hello Vue!'
  },
  data() {
    return {
      info: null
    }
  },
  mounted() {
    axios.get('api/sentences')
      .then(response => this.info = response.data.originalSentence);
  },
  methods: {
    create: function () {
      var params = new URLSearchParams();
      params.append('text', document.getElementsByName('text')[0].value);
      axios.post('api/sentences', params).then(() => {
        document.getElementsByName('text')[0].value = '';
        axios.get('api/sentences')
          .then(response => this.info = response.data.originalSentence);
      });
    }
  }
});

Vue.component('card-lorem', CardLorem);

new Vue({
  el: '#app-5',
  components: {
		CardLorem
	},
  data: function () {
    const cards = [];
    for (let i = 1; i < 13; i++) {
      cards.push(new Card(i));
    }
    return {
      cards
    }
  }
});

function Card (id) {
  this.id = id,
  this.title = 'Lorem ipsum',
  this.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  this.url = 'http://localhost:8080/'
}
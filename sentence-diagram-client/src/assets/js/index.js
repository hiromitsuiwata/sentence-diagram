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
  el: '#app-5'
});
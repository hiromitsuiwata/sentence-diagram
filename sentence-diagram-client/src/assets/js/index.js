import _ from 'lodash';
import Vue from 'vue';
import axios from 'axios';
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

let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  data() {
    return {
      info: null
    }
  },
  mounted() {
    axios.get('http://localhost:9080/sentence-diagram-web/api/sentences')
      .then(response => this.info = response.data.originalSentence);
  },
  methods: {
    create: function () {
      var params = new URLSearchParams();
      params.append('text', document.getElementsByName('text')[0].value);
      axios.post('/sentence-diagram-web/api/sentences', params).then(() => {
        document.getElementsByName('text')[0].value = '';
        axios.get('http://localhost:9080/sentence-diagram-web/api/sentences')
          .then(response => this.info = response.data.originalSentence);
      });
    }
  }
});

var app2 = new Vue({
  el: '#app2',
  data: {
    message: 'Hello Vue!'
  }
});

app2.message = 'I have changed the data';

var app3 = new Vue({
  el: '#app3',
  data: {
    message: 'You loaded this page on ' + new Date().toLocaleString()
  }
});

var app4 = new Vue({
  el: "#app4",
  data: {
    x1: 100,
    active: false
  }
});

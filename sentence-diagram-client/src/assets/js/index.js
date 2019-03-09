import _ from 'lodash';
import Vue from 'vue';
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
  el: '#app1',
  data: {
    message: 'Hello Vue!'
  }
});
app1.message = ' #### I have changed the data #### ';

var app2 = new Vue({
  el: '#app2',
  data: {
    message: 'You loaded this page on ' + new Date().toLocaleString()
  }
});

var app3 = new Vue({
  el: "#app3",
  data: {
    x1: 100,
    active: false
  }
});
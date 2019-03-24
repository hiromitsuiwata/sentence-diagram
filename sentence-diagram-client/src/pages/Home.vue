<template>
  <div>
    <home-header></home-header>

    <div class="main">
      <div class="columns">
        <div id="app-1">
          <my-card></my-card>
        </div>
        <div id="app-5">
          <card-lorem v-for="card in cards" :key="card.id" :id="card.id" :title="card.title" :text="card.text" :url="card.url"></card-lorem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

import HomeHeader from '../components/HomeHeader.vue';
import CardLorem from '../components/CardLorem.vue';
import MyCard from '../components/MyCard.vue';

Vue.component('home-header', HomeHeader);
Vue.component('my-card', MyCard);
Vue.component('card-lorem', CardLorem);

export default {
  data() {
    const cards = [];
    /*
    for (let i = 1; i < 13; i++) {
      cards.push(new Card(i));
    }
    */
    return {
      cards
    };
  },
  created: function() {
    console.log('created');

    axios
      .get('/sentence-diagram-web/api/sentences')
      .then(response => {
        console.log({
          response: response
        });
        this.cards = response.data;
      })
      .catch(error => {
        console.log({
          error: error
        });
      });
  }
};

function Card(id, text, url) {
  this.id = id;
  if (text) {
    this.text = text;
  } else {
    this.text =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  }
  if (url) {
    this.url = url;
  } else {
    this.url = 'http://localhost:8080/';
  }
}
</script>
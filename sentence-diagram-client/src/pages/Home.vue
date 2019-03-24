<template>
  <div>
    <home-header></home-header>

    <div class="main">
      <div class="columns">
        <div id="app-1">
          <my-card></my-card>
        </div>
        <div id="app-5">
          <card v-for="card in cards" :key="card.id" :id="card.id" :title="card.title" :text="card.text" :url="card.url"></card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

import HomeHeader from '../components/HomeHeader.vue';
import Card from '../components/Card.vue';
import MyCard from '../components/MyCard.vue';

Vue.component('home-header', HomeHeader);
Vue.component('my-card', MyCard);
Vue.component('card', Card);

export default {
  data() {
    const cards = [];
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
</script>
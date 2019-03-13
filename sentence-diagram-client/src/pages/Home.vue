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
import HomeHeader from '../components/HomeHeader.vue';
import CardLorem from '../components/CardLorem.vue';
import MyCard from '../components/MyCard.vue';

Vue.component('home-header', HomeHeader);
Vue.component('my-card', MyCard);
Vue.component('card-lorem', CardLorem);

export default {
  data () {
    const cards = [];
    for (let i = 1; i < 13; i++) {
      cards.push(new Card(i));
    }
    return {
      cards
    }
  }
};

function Card(id) {
  this.id = id,
    this.title = 'Lorem ipsum',
    this.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    this.url = 'http://localhost:8080/'
}
</script>
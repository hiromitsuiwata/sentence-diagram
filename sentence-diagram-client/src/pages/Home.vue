<template>
  <div>
    <home-header></home-header>

    <div class="main">
      <div class="columns">
        <div id="app-1">
          <my-card @show-diagram="openModal"></my-card>
        </div>
        <div id="app-5">
          <card
            v-for="card in cards"
            :key="card.id"
            :id="card.id"
            :title="card.title"
            :text="card.text"
            :url="card.url"
          ></card>
        </div>
      </div>
    </div>
    <diagram @close="closeModal" v-if="showing">
      <p>Vue.js Modal Window!</p>
      <div>Hello from modal.</div>
      <template slot="footer">
        <button @click="doSend">閉じる</button>
      </template>
    </diagram>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

import HomeHeader from '../components/HomeHeader.vue';
import Card from '../components/Card.vue';
import MyCard from '../components/MyCard.vue';
import Diagram from '../components/Diagram.vue';

Vue.component('home-header', HomeHeader);
Vue.component('my-card', MyCard);
Vue.component('card', Card);
Vue.component('diagram', Diagram);

export default {
  data() {
    const cards = [];
    return {
      cards,
      showing: false,
      cardNo: 0
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
  },
  methods: {
    openModal(data) {
      console.log('openModal');
      console.dir(data);
      this.showing = true;
    },
    closeModal() {
      console.log('closeModal');
      this.showing = false;
    },
    doSend() {
      console.log('doSend');
      this.closeModal();
    }
  }
};
</script>

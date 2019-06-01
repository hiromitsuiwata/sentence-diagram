<template>
  <div class="card">
    <div class="card-id">#0</div>
    <div class="card-title">Lorem ipsum</div>
    <div class="card-text" id="app-2">
      <my-card-text></my-card-text>
    </div>
    <div class="card-operation">
      <div class="card-id">#{{id}}</div>
      <div class="card-link">
        <a :href="url">link</a>
      </div>
      <div class="card-diagram">
        <a v-on:click="showDiagram">
          diagram
          <i class="fas fa-pencil-ruler"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import MyCardText from './MyCardText.vue';

Vue.component('my-card-text', MyCardText);

export default {
  props: {
    id: Number,
    title: String,
    text: String,
    url: String
  },
  methods: {
    showDiagram: function(event) {
      let jsonStr =
        '[{"vnodes":[{"ids":"1","text":"The"},{"ids":"2","text":"white"},{"ids":"3","text":"unicorn"},{"ids":"4","text":"flew"}],"vedges":[{"fromIds":"1","toIds":"3","type":"mod"},{"fromIds":"2","toIds":"3","type":"mod"},{"fromIds":"4","toIds":"3","type":"subj"}]}]';
      let diagramData = JSON.parse(jsonStr);
      let text = 'The white unicorn flew.';
      let id = 0;
      console.dir(diagramData);
      // イベント発行
      this.$emit('show-diagram', { id, text, diagramData });
    }
  }
};
</script>

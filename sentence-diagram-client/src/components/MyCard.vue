<template>
  <div class="card">
    <div class="card-id">#0</div>
    <div class="card-title">Lorem ipsum</div>
    <div class="card-text" id="app-1">
      <my-card-text></my-card-text>
    </div>
    <div class="card-link">
      <a href="http://localhost:8080/">Link</a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import MyCardText from './MyCardText.vue';

Vue.component('my-card-text', MyCardText);

export default {};
</script>
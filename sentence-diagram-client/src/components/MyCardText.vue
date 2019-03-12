<template>
  <div>
    <hello></hello>
    <example-svg></example-svg>
  </div>
</template>

<script>
import Vue from 'vue';
import Hello from './Hello.vue';
import ExampleSvg from './ExampleSvg.vue';

Vue.component('hello', Hello);
Vue.component('example-svg', ExampleSvg);

export default {
  
}
</script>
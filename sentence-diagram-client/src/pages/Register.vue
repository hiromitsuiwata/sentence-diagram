<template>
  <div>
    <register-header></register-header>
    this is Register.vue
  </div>
</template>

<script>
import Vue from 'vue';
import RegisterHeader from '../components/RegisterHeader.vue';

Vue.component('register-header', RegisterHeader);

export default {
  
}
</script>

<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-window card">
        <div class="card-title">{{modalData.title}}</div>
        <div class="modal-content card-text">
          <div>{{modalData.text}}</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
            <nsubj v-bind:x="10" v-bind:y="30" firstText="unicorn" secondText="flew." />
            <svg-path v-bind:x="30" v-bind:y="30" text="The" direction="lower-right" />
            <svg-path v-bind:x="60" v-bind:y="30" text="white1234567890" direction="lower-right" />
          </svg>
        </div>
        <div class="modal-footer card-operation">
          <button @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import SvgPath from './SvgPath.vue';
import Nsubj from './nlp/Nsubj.vue';
//import SvgPathVue from './SvgPath.vue';

Vue.component('svg-path', SvgPath);
Vue.component('nsubj', Nsubj);

export default {
  props: {
    modalData: {
      id: Number,
      title: String,
      text: String,
      diagramData: Object
    }
  },
  data() {
    return {
      x1: 100
    };
  },
  created: function() {},
  mounted: function() {},
  methods: {}
};
</script>

<style scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  overflow: hidden;
}
</style>

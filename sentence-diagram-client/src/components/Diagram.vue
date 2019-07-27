<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-window card">
        <div class="card-title">{{modalData.title}}</div>
        <div class="modal-content card-text">
          <div>{{modalData.text}}</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
            <nsubj v-bind:x="110" v-bind:y="110" firstText="unicorn" secondText="flew." />
            <svg-path v-bind:x="130" v-bind:y="110" text="The" direction="lower-right" />
            <svg-path v-bind:x="160" v-bind:y="110" text="white1234567890" direction="lower-right" />
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
  created: function() {
    console.log(this.modalData.id);
    console.log(this.modalData.text);
    console.log(this.modalData.diagramData);
  }
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

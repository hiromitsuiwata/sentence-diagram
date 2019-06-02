<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-window card">
        <div class="card-title">{{modalData.title}}</div>
        <div class="modal-content card-text">
          <div>{{modalData.text}}</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            <line :x1="x1" y1="100" x2="100" y2="0" stroke="blue"></line>
            <path
              id="myPath"
              fill="none"
              stroke="red"
              d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50"
            ></path>
            <text>
              <textPath href="#myPath">Lorem ipsum</textPath>
            </text>
          </svg>
          <input type="range" v-model="x1">
        </div>
        <div class="modal-footer card-operation">
          <button @click="$emit('close')">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
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

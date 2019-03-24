<template>
  <div class="card">
    <div class="card-title">{{title}}</div>
    <div class="card-text">{{text}}</div>
    <div class="card-operation">
      <div class="card-id">#{{id}}</div>
      <div class="card-link"><a :href="url">link</a></div>
      <div class="card-diagram"><a v-on:click="showDiagram">diagram <i class="fas fa-pencil-ruler"></i></a></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    title: String,
    text: String,
    url: String
  },
  methods: {
    showDiagram: function(event) {
      console.log({ showDiagram: this.id });
    }
  }
};
</script>

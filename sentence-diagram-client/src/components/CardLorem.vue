<template>
  <div class="card">
    <div class="card-id">#{{id}}</div>
    <div class="card-title">{{title}}</div>
    <div class="card-text">{{text}}</div>
    <div class="card-link"><a :href="url">Link</a></div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    title: String,
    text: String,
    url: String
  }
}
</script>

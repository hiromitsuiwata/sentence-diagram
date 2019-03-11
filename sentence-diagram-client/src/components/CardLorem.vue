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
  /*
  data () {
    return {
      title: 'Lorem ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      url: 'http://localhost:8080/'
    }
  }
  */
}
</script>

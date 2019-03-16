<template>
  <div>
    <register-header></register-header>
    <div class="main">
      <div class="register-fields">
        <div class="editor editor-title" contenteditable="true">
          <div class="placeholder" data-placeholder="Title"></div>
        </div>
        <div class="editor editor-text" contenteditable="true">
          <div class="placeholder" data-placeholder="Your text here"></div>
        </div>
        <div class="editor editor-url" contenteditable="true">
          <div class="placeholder" data-placeholder="URL"></div>
        </div>
        <div class="button-area">
          <div class="post-button">Post</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import RegisterHeader from '../components/RegisterHeader.vue';

Vue.component('register-header', RegisterHeader);

export default {};
</script>

<style scoped>
.main {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-width: 1px;
  width: 520px;
  height: 350px;
  margin-top: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px #ccc;
  padding: 10px;
  display: inline-block;
}

.editor {
  margin: 10px 10px 10px 10px;
}

.editor-title {
  font-size: 36px;
  width: 500px;
}

.editor-text {
  font-size: 16px;
  height: 200px;
  width: 500px;
}

.editor-url {
  font-size: 16px;
  width: 500px;
}

.placeholder:empty:before {
  color: gray;
  content: attr(data-placeholder);
}

.button-area {
  border-top: 1px solid #eee;
}

.post-button {
  position: absolute;
  background-color: #4169e1;
  width: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  padding: 5px 5px 5px 5px;
  margin: 10px 10px 10px 10px;
  right: 0;
}
</style>

<template>
  <g>
    <path :id="id" fill="none" stroke="red" :d="d"></path>
    <text>
      <textPath :href="href" :startOffset="offset">{{text}}</textPath>
    </text>
  </g>
</template>

<script>
import uuidv4 from 'uuid/v4';

export default {
  props: {
    x: Number,
    y: Number,
    text: String
  },
  computed: {
    id: function() {
      return uuidv4();
    },
    offset: function() {
      return 15;
    },
    d: function() {
      let endX = Math.round(this.x + this.length / Math.sqrt(2));
      let endY = Math.round(this.y + this.length / Math.sqrt(2));
      let str = `M ${this.x} ${this.y} L ${endX} ${endY}`;
      return str;
    },
    href: function() {
      return '#' + this.id;
    },
    length: function() {
      return this.text.length * 9 + 20;
    }
  }
};
</script>

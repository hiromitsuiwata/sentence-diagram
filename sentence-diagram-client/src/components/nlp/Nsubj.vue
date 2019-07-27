<!-- nsubjを描く -->
<template>
  <g>
    <path :id="firstId" fill="none" stroke="green" :d="firstD" />
    <path :id="secondId" fill="none" stroke="green" :d="secondD" />
    <path fill="none" stroke="blue" :d="partitionD" />
    <text>
      <textPath :href="firstHref" :startOffset="offset">{{firstText}}</textPath>
      <textPath :href="secondHref" :startOffset="offset">{{secondText}}</textPath>
    </text>
  </g>
</template>

<script>
import uuidv4 from 'uuid/v4';

export default {
  props: {
    x: Number,
    y: Number,
    firstText: String,
    secondText: String
  },
  computed: {
    offset: function() {
      return 15;
    },
    firstId: function() {
      return uuidv4();
    },
    firstD: function() {
      let endX = this.x + this.firstLength;
      return `M ${this.x} ${this.y} L ${endX} ${this.y}`;
    },
    firstLength: function() {
      return this.secondText.length * 9 + 20;
    },
    firstHref: function() {
      return '#' + this.firstId;
    },
    secondId: function() {
      return uuidv4();
    },
    secondD: function() {
      let startX = this.x + this.firstLength;
      let endX = startX + this.secondLength;
      return `M ${startX} ${this.y} L ${endX} ${this.y}`;
    },
    secondLength: function() {
      return this.secondText.length * 9 + 20;
    },
    secondHref: function() {
      return '#' + this.secondId;
    },
    partitionD: function() {
      let x = this.x + this.firstLength;
      let startY = this.y - 15;
      let endY = this.y + 15;
      return `M ${x} ${startY} L ${x} ${endY}`;
    }
  }
};
</script>

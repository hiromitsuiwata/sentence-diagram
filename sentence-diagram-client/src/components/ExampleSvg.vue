<template>
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" width="100" height="100">
    <line :x1="x1" y1=100 x2=100 y2=0 stroke="blue"></line>
  </svg>

  <div>
    <input type="range" v-model="x1">
  </div>

  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" width="100" height="100">
    <path id="myPath" fill="none" stroke="red" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
    <text>
      <textPath href="#myPath">Lorem ipsum</textPath>
    </text>
  </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x1: 100
    };
  }
};
</script>

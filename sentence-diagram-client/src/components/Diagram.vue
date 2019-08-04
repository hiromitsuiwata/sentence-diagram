<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-window card">
        <div class="card-title">{{modalData.title}}</div>
        <div class="modal-content card-text">
          <div>{{modalData.text}}</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
            <nsubj v-bind:x="10" v-bind:y="30" firstText="unicorn" secondText="flew." />
            <svg-path v-bind:x="30" v-bind:y="30" text="The" direction="lower-right" />
            <svg-path v-bind:x="60" v-bind:y="30" text="white1234567890" direction="lower-right" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="d3svg"
            viewBox="0 0 300 300"
            width="300"
            height="300"
          />
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
import * as d3 from 'd3';
import * as cola from 'webcola';

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
  },
  mounted: function() {
    var graph = {
      nodes: [
        { name: 'a', width: 60, height: 40 },
        { name: 'b', width: 60, height: 40 },
        { name: 'c', width: 60, height: 40 },
        { name: 'd', width: 60, height: 40 },
        { name: 'e', width: 60, height: 40 }
      ],
      links: [{ source: 0, target: 1 }, { source: 1, target: 2 }, { source: 2, target: 0 }, { source: 2, target: 3 }]
    };
    var d3cola = cola
      .d3adaptor(d3)
      .linkDistance(30)
      .size([300, 300]);

    var svg = d3.select('#d3svg');
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    d3cola
      .nodes(graph.nodes)
      .links(graph.links)
      .avoidOverlaps(true)
      .start();

    var link = svg
      .selectAll('.link')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('style', 'stroke:rgb(255,0,0);stroke-width:2');

    var node = svg
      .selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .style('fill', function(d) {
        return color(d.group);
      });

    d3cola.on('tick', function() {
      console.log('tick');
      link
        .attr('x1', function(d) {
          return d.source.x;
        })
        .attr('y1', function(d) {
          return d.source.y;
        })
        .attr('x2', function(d) {
          return d.target.x;
        })
        .attr('y2', function(d) {
          return d.target.y;
        });

      node
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });
    });
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

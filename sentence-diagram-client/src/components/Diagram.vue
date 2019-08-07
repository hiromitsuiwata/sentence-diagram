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
        { name: 0 },
        { name: 1 },
        { name: 2 },
        { name: 3 },
        { name: 4 },
        { name: 5 },
        { name: 6 },
        { name: 7 },
        { name: 8 },
        { name: 9 }
      ],
      links: [
        { source: 0, target: 1, length: 100 },
        { source: 1, target: 2, length: 10 },
        { source: 2, target: 3, length: 100 },
        { source: 4, target: 5, length: 50, kind: 'support' },
        { source: 5, target: 6, length: 50, kind: 'support' },
        { source: 4, target: 6, length: 50 * Math.SQRT2 },
        { source: 7, target: 8, length: 80, kind: 'support' },
        { source: 8, target: 9, length: 80, kind: 'support' },
        { source: 7, target: 9, length: 80 * Math.SQRT2 }
      ],
      constraints: [
        {
          type: 'alignment',
          axis: 'y',
          offsets: [
            { node: 0, offset: 0 },
            { node: 1, offset: 0 },
            { node: 2, offset: 0 },
            { node: 3, offset: 0 },
            { node: 4, offset: 0 },
            { node: 7, offset: 0 }
          ]
        },
        {
          type: 'alignment',
          axis: 'x',
          offsets: [{ node: 4, offset: 0 }, { node: 5, offset: 0 }]
        },
        {
          type: 'alignment',
          axis: 'y',
          offsets: [{ node: 5, offset: 0 }, { node: 6, offset: 0 }]
        },
        {
          type: 'alignment',
          axis: 'x',
          offsets: [{ node: 7, offset: 0 }, { node: 8, offset: 0 }]
        },
        {
          type: 'alignment',
          axis: 'y',
          offsets: [{ node: 8, offset: 0 }, { node: 9, offset: 0 }]
        },
        {
          axis: 'x',
          left: 0,
          right: 1,
          gap: 1
        },
        {
          axis: 'x',
          left: 1,
          right: 2,
          gap: 1
        },
        {
          axis: 'x',
          left: 2,
          right: 3,
          gap: 1
        },
        {
          axis: 'x',
          left: 0,
          right: 4,
          gap: 20
        },
        {
          axis: 'y',
          left: 4,
          right: 5,
          gap: 20
        },
        {
          axis: 'x',
          left: 5,
          right: 6,
          gap: 20
        },
        {
          axis: 'x',
          left: 4,
          right: 7,
          gap: 20
        },
        {
          axis: 'x',
          left: 7,
          right: 1,
          gap: 20
        },
        {
          axis: 'y',
          left: 7,
          right: 8,
          gap: 20
        },
        {
          axis: 'x',
          left: 8,
          right: 9,
          gap: 20
        }
      ]
    };
    var d3cola = cola
      .d3adaptor(d3)
      .linkDistance(function(l) {
        return l.length;
      })
      .size([300, 300]);

    var svg = d3.select('#d3svg');

    d3cola
      .nodes(graph.nodes)
      .links(graph.links)
      .constraints(graph.constraints)
      .start();

    var link = svg
      .selectAll('.link')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('style', 'stroke:rgb(255,0,0); stroke-width:2')
      .attr('stroke-opacity', function(l) {
        if (l.kind === 'support') {
          return 0.2;
        } else {
          return 1;
        }
      });

    var node = svg
      .selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .style('fill', 'blue')
      .attr('id', function(d) {
        return d.name;
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

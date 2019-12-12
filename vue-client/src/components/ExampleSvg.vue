<template>
  <div>
  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" width="100" height="100">
    <line :x1="x1" y1=100 x2=100 y2=0 stroke="blue"></line>
    <path id="myPath" fill="none" stroke="red" d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
    <text>
      <textPath href="#myPath">Lorem ipsum</textPath>
    </text>
  </svg>

  <div>
    <input type="range" v-model="x1">
  </div>

  <svg id="svg-canvas" width=300 height=300></svg>
  </div>
</template>

<script>
import dagreD3 from 'dagre-d3/dist/dagre-d3';
import * as d3 from 'd3';

export default {
  data() {
    return {
      x1: 100
    };
  },
  mounted: function() {
    var g = new dagreD3.graphlib.Graph().setGraph({ rankdir: 'LR', align: 'DL' }).setDefaultEdgeLabel(function() {
      return {};
    });
    g.setNode(0, { label: 'The' });
    g.setNode(1, { label: 'while' });
    g.setNode(2, { label: 'unicorn' });
    g.setNode(3, { label: 'flew.' });

    g.setEdge(0, 2, { arrowhead: 'vee' });
    g.setEdge(1, 2, { arrowhead: 'vee' });
    g.setEdge(2, 3, { arrowhead: 'undirected' });

    var render = new dagreD3.render();
    var svg = d3.select('#svg-canvas');
    var svgGroup = svg.append('g');
    render(d3.select('svg g'), g);

    var xCenterOffset = (svg.attr('width') - g.graph().width) / 2;
    svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', g.graph().height + 50);
  }
};
</script>

<style>
#svg-canvas rect {
  fill: transparent;
  stroke: blue;
}

#svg-canvas path {
  fill: blue;
  stroke-width: 2;
  stroke: blue;
}
</style>

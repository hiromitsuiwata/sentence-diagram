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
import * as pixelWidth from 'string-pixel-width';
import SvgPathVue from './SvgPath.vue';
import uuidv4 from 'uuid/v4';

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
  created: function() {},
  mounted: function() {
    // NLPから取得したデータ
    var nlpGraph = {
      // nodes: [{ id: 0, text: 'unicorn' }, { id: 1, text: 'flew.' }],
      // nlpEdges: [{ from: 1, to: 0, type: 'subj' }]
      nodes: [{ id: 0, text: 'The' }, { id: 1, text: 'white' }, { id: 2, text: 'unicorn' }, { id: 3, text: 'flew.' }],
      nlpEdges: [{ from: 0, to: 2, type: 'mod' }, { from: 1, to: 2, type: 'mod' }, { from: 3, to: 2, type: 'subj' }]
    };

    // 文字列の横幅(ピクセル単位)を追加
    this.addTextLength(nlpGraph.nodes);

    // WebCola向けグラフ形式へ変換
    var colaGraph = this.translateToColaGraph(nlpGraph);

    // 描画
    this.drawColaGraph(colaGraph);
  },
  methods: {
    measureLength: function(text) {
      // 文字列の長さを計算
      return pixelWidth(text, { size: 14 }) + 10;
    },
    addTextLength: function(nodes) {
      // ノードに文字列長を追加する
      nodes.map(node => {
        node.pixels = this.measureLength(node.text);
      });
    },

    addHorizontalConstraint: function(colaGraph, leftIndex, rightIndex) {
      // 横並びにする
      colaGraph.constraints.push({
        type: 'alignment',
        axis: 'y',
        offsets: [{ node: leftIndex, offset: 0 }, { node: rightIndex, offset: 0 }]
      });
      // 左右に並べる
      colaGraph.constraints.push({
        axis: 'x',
        left: leftIndex,
        right: rightIndex,
        gap: 1
      });
    },

    translateToColaGraph: function(nlpGraph) {
      // NLPのグラフをWebColaのグラフへ変換する
      const colaGraph = { nodes: [], links: [], constraints: [] };
      let index = 0;

      // NLPのノードをもとに追加する
      nlpGraph.nodes.forEach(node => {
        // nodeを作る. textはノードの先頭につけておく
        colaGraph.nodes.push({ name: index, nlpName: node.id + '-0', text: node.text });
        index++;
        colaGraph.nodes.push({ name: index, nlpName: node.id + '-1' });
        index++;
        // linkを作る
        colaGraph.links.push({ source: index - 2, target: index - 1, length: node.pixels });

        // constraintを作る
        this.addHorizontalConstraint(colaGraph, index - 2, index - 1);
      });

      // NLPのエッジをもとに追加する
      nlpGraph.nlpEdges.forEach(nlpEdge => {
        if (nlpEdge.type === 'subj') {
          // NLPのnlpEdgeからWebColaのlinkを作る
          var source = colaGraph.nodes.filter(node => {
            return node.nlpName === nlpEdge.from + '-0';
          })[0].name;
          var target = colaGraph.nodes.filter(node => {
            return node.nlpName === nlpEdge.to + '-1';
          })[0].name;
          colaGraph.links.push({ source, target, length: 10, type: 'subj' });

          // NLPのnlpEdgeからWebColaのconstraintを作る
          this.addHorizontalConstraint(colaGraph, target, source);
        } else if (nlpEdge.type === 'mod') {
          var source = colaGraph.nodes.filter(colaNode => {
            return colaNode.nlpName == nlpEdge.from + '-0';
          })[0].name;
          var target = colaGraph.nodes.filter(node => {
            return node.nlpName === nlpEdge.to + '-0';
          })[0].name;
          colaGraph.links.push({ source, target, length: 10, type: 'mod' });
        }
      });

      return colaGraph;
    },
    createGraph0: function() {
      return {
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
          { source: 0, target: 4, length: 100 / 3 },
          { source: 4, target: 7, length: 100 / 3 },
          { source: 7, target: 1, length: 100 / 3 },
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
    },
    drawColaGraph: function(graph) {
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
        .attr('style', 'stroke:rgb(255,0,0); stroke-width:2');

      var node = svg
        .selectAll('.node')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 3)
        .style('fill', 'blue')
        .attr('name', function(d) {
          return d.nlpName;
        });

      d3cola.on('tick', function() {
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

      // tick完了後にpathを描いて文字列を割り当てる
      d3cola.on('end', function() {
        console.log(graph);

        // 一時的に作成していたcircleとlineを削除
        // svg.selectAll('circle').remove();
        // svg.selectAll('line').remove();

        graph.links.forEach(link => {
          let x1 = link.source.x;
          let y1 = link.source.y;
          let text = link.source.text;
          let x2 = link.target.x;
          let y2 = link.target.y;
          let type = link.type;
          let id = uuidv4();

          svg
            .append('path')
            .attr('d', `M ${x1} ${y1} L ${x2} ${y2}`)
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('id', id);

          if (type === 'subj') {
            // subjの飾り線を追加
            svg
              .append('path')
              .attr('d', `M ${(x1 + x2) / 2} ${y1 - 20} L ${(x1 + x2) / 2} ${y1 + 20}`)
              .attr('stroke', 'blue')
              .attr('stroke-width', 2)
              .attr('fill', 'none');
          } else if (type === 'mod') {
          } else {
            svg
              .append('text')
              .append('textPath')
              .attr('href', '#' + id)
              .text(text);
          }
        });
      });
    }
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

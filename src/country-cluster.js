import { nest, entries } from 'd3-collection';
import { pack, hierarchy } from 'd3-hierarchy';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';

const computePositions = function(populations, size) {
  const centers = nest()
    .key((population) => population.country)
    .entries(populations)
    .map(function(country) { return {name: country.key, value: 1} })

  var root = hierarchy({ children: centers }).sum((d) => d.value)
  const layout = pack().size(size)
  layout(root)
  var mapping = {}
  root.children.forEach(function(d){
    mapping[d.data.name] = { x: d.x, y: d.y }
  })
  return mapping
}

var svg = null
var nodes = null
var size = null
var populations = null
var cityPositions = null

var cluster = function(){}

cluster.init = function(_svg_, _nodes_, _populations_, _size_) {
  svg = _svg_
  nodes = _nodes_
  size = _size_
  populations = _populations_
  cityPositions = computePositions(populations, size)

  const labelWrapper = svg.append("g")
    .attr("class", "labelWrapper")

  labelWrapper.selectAll(".label")
    .data(entries(cityPositions))
    .enter().append("text")
    .attr("class", "label")
    .style("opacity", 0)
    .attr("transform", function (d) {
      return "translate(" + (d.value.x) + ", " + (d.value.y - 60) + ")"; })
    .text(function (d) { return d.key });

  return cluster
}

cluster.start = function() {
  // hide map
  svg.selectAll('.geo-path')
    .transition().duration(3000)
    .style('fill-opacity', 0)

  // hide map
  svg.selectAll('.label')
    .transition().duration(3000)
    .style('opacity', 1)

  function ticked() {
    nodes
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
  }

  var simulation = forceSimulation(populations)
    .velocityDecay(0.3)
    .force("x", function(alpha) {
      for (var i = 0, n = populations.length, node, k = alpha * 0.1; i < n; ++i) {
        node = populations[i];
        node.vx -= (node.x - cityPositions[node.country].x) * k;
        node.vy -= (node.y - cityPositions[node.country].y) * k;
      }
    })
    .force("collide", forceCollide().radius(function(d) {
      return d.r + 0.5; }).iterations(2))
    .on("tick", ticked)
}

module.exports = cluster

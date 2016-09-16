import { geoPath, geoMercator } from 'd3-geo';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import { max } from 'd3-array';

const populations = require('./populations')
const world = require('./world.geojson')
require('./style.css');

const bindTo = (divId) => {
  const width = 900, height = 600

  const projection = geoMercator()
    .scale(170)
    .translate([480,230])

  const path = geoPath().projection(projection)

  const svg = select(divId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const map = svg.append('g')
    .attr('class', 'map')

  map.selectAll('.geo-path')
    .data(world.features)
    .enter()
    .append('path')
    .attr("class", function(d) { return "geo-path" + " " + d.id; })
		.attr("id", function(d) { return d.properties.name; })
		.attr("d", path)
		.style("stroke-opacity", 1)
		.style("fill-opacity", 0.5)

  populations.forEach(function(population){
    const position = projection([population.longitude, population.latitude])
    population.x = position[0]
    population.y = position[1]
  })

  const rScale = scaleSqrt()
    .range([0, 10])
    .domain([0, max(populations, function(d) { return d.population })])

  const cities = svg.append('g')
    .attr('class', 'cities')

  cities.selectAll('city')
    .data(populations)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', function(d) {
      return rScale(d.population)
    })
    .attr('cx', function(d) {
      return d.x
    })
    .attr('cy', function(d) {
      return d.y
    })
}

module.exports = bindTo;

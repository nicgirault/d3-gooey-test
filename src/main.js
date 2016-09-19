import { geoPath, geoMercator } from 'd3-geo';
import { select } from 'd3-selection';
import { selectAll } from 'd3-transition';
import { scaleSqrt } from 'd3-scale';
import { max } from 'd3-array';
import { interpolateString } from 'd3-interpolate';
import { forceSimulation, forceX, forceY, forceCollide, forceManyBody } from 'd3-force';


const populations = require('./populations')
const world = require('./world.geojson')
const appendGooeyFilter = require('./svg-filter')
const countryCluster = require('./country-cluster')

require('./style.css')

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

  appendGooeyFilter(svg)

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

    const rScale = scaleSqrt()
      .range([0, 10])
      .domain([0, max(populations, function(d) { return d.population })])

  populations.forEach(function(population){
    const position = projection([population.longitude, population.latitude])
    population.x = position[0]
    population.y = position[1]
    population.r = rScale(population.population)
  })


  const cities = svg.append('g')
    .attr('class', 'cities')
		.style("filter", "url(#gooeyCodeFilter)")

  const maskCircle = cities
    .append('circle')
    .attr('class', 'mask')
    .attr('r', function(d) { return 40 })
    .attr('cx', function(d) { return projection([0, 0])[0] })
    .attr('cy', function(d) { return projection([0, 0])[1] })
    .transition().duration(4000)
    .attr('r', function(d) { return 0 })

  const city = cities.selectAll('city')
    .data(populations)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', function(d) { return rScale(d.population) })
    .attr('cx', function(d) { return projection([0, 0])[0] })
    .attr('cy', function(d) { return projection([0, 0])[1] })

    city.transition('move').duration(2000)
    .delay(function(d,i) { return i*20; })
    .attr('cx', function(d) { return d.x })
    .attr('cy', function(d) { return d.y })

    svg.selectAll(".blurValues")
			.transition().duration(4000)
			.attrTween("values", function() {
				return interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5",
											"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -5");
			})


    const cluster = countryCluster.init(svg, city, populations, [width, height])
    select("body")
      .on("keydown", cluster.start)

}

module.exports = bindTo;

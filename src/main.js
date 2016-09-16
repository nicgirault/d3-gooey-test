import { geoBaker } from 'd3-geo-projection';
import { geoPath } from 'd3-geo';
import { select } from 'd3-selection';

const populations = require('./populations')
const world = require('./world.geojson')
require('./style.css');

const bindTo = (divId) => {
  const width = 900, height = 600

  const projection = geoBaker()

  const path = geoPath().projection(projection)

  const svg = select(divId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const map = svg.append('g')
    .attr('class', 'map')
  console.log(map)

  map.selectAll('.geo-path')
    .data(world.features)
    .enter()
    .append('path')
    .attr("class", function(d) { return "geo-path" + " " + d.id; })
		.attr("id", function(d) { return d.properties.name; })
		.attr("d", path)
		.style("stroke-opacity", 1)
		.style("fill-opacity", 0.5)
}

module.exports = bindTo;

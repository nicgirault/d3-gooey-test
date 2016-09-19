module.exports = function(svg) {
  //SVG filter for the gooey effect
	//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
  const defs = svg.append("defs")

	const filter = defs.append("filter")
    .attr("id","gooeyCodeFilter")

  filter.append("feGaussianBlur")
		.attr("in","SourceGraphic")
		.attr("stdDeviation","10")
		//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
		.attr("color-interpolation-filters","sRGB")
		.attr("result","blur");
	filter.append("feColorMatrix")
		.attr("class", "blurValues")
		.attr("in","blur")
		.attr("mode","matrix")
		.attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5")
		.attr("result","gooey")
	filter.append("feBlend")
		.attr("in","SourceGraphic")
		.attr("in2","gooey")
		.attr("operator","atop")
}

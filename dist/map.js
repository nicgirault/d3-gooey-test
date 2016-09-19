var bindTo =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _d3Geo = __webpack_require__(2);

	var _d3Selection = __webpack_require__(4);

	var _d3Transition = __webpack_require__(5);

	var _d3Scale = __webpack_require__(11);

	var _d3Array = __webpack_require__(3);

	var _d3Interpolate = __webpack_require__(8);

	var _d3Force = __webpack_require__(16);

	var populations = __webpack_require__(18);
	var world = __webpack_require__(19);
	var appendGooeyFilter = __webpack_require__(20);
	var countryCluster = __webpack_require__(21);

	__webpack_require__(23);

	var bindTo = function bindTo(divId) {
	  var width = 900,
	      height = 600;

	  var projection = (0, _d3Geo.geoMercator)().scale(170).translate([480, 230]);

	  var path = (0, _d3Geo.geoPath)().projection(projection);

	  var svg = (0, _d3Selection.select)(divId).append('svg').attr('width', width).attr('height', height);

	  appendGooeyFilter(svg);

	  var map = svg.append('g').attr('class', 'map');

	  map.selectAll('.geo-path').data(world.features).enter().append('path').attr("class", function (d) {
	    return "geo-path" + " " + d.id;
	  }).attr("id", function (d) {
	    return d.properties.name;
	  }).attr("d", path).style("stroke-opacity", 1).style("fill-opacity", 0.5);

	  var rScale = (0, _d3Scale.scaleSqrt)().range([0, 10]).domain([0, (0, _d3Array.max)(populations, function (d) {
	    return d.population;
	  })]);

	  populations.forEach(function (population) {
	    var position = projection([population.longitude, population.latitude]);
	    population.x = position[0];
	    population.y = position[1];
	    population.r = rScale(population.population);
	  });

	  var cities = svg.append('g').attr('class', 'cities').style("filter", "url(#gooeyCodeFilter)");

	  var maskCircle = cities.append('circle').attr('class', 'mask').attr('r', function (d) {
	    return 40;
	  }).attr('cx', function (d) {
	    return projection([0, 0])[0];
	  }).attr('cy', function (d) {
	    return projection([0, 0])[1];
	  }).transition().duration(4000).attr('r', function (d) {
	    return 0;
	  });

	  var city = cities.selectAll('city').data(populations).enter().append('circle').attr('class', 'city').attr('r', function (d) {
	    return rScale(d.population);
	  }).attr('cx', function (d) {
	    return projection([0, 0])[0];
	  }).attr('cy', function (d) {
	    return projection([0, 0])[1];
	  });

	  city.transition('move').duration(2000).delay(function (d, i) {
	    return i * 20;
	  }).attr('cx', function (d) {
	    return d.x;
	  }).attr('cy', function (d) {
	    return d.y;
	  });

	  svg.selectAll(".blurValues").transition().duration(4000).attrTween("values", function () {
	    return (0, _d3Interpolate.interpolateString)("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -5");
	  });

	  var cluster = countryCluster.init(svg, city, populations, [width, height]);
	  (0, _d3Selection.select)("body").on("keydown", cluster.start);
	};

	module.exports = bindTo;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-geo/ Version 1.2.4. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(3)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3));
	}(this, (function (exports,d3Array) { 'use strict';

	// Adds floating point numbers with twice the normal precision.
	// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
	// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
	// 305–363 (1997).
	// Code adapted from GeographicLib by Charles F. F. Karney,
	// http://geographiclib.sourceforge.net/

	function adder() {
	  return new Adder;
	}

	function Adder() {
	  this.reset();
	}

	Adder.prototype = {
	  constructor: Adder,
	  reset: function() {
	    this.s = // rounded value
	    this.t = 0; // exact error
	  },
	  add: function(y) {
	    add(temp, y, this.t);
	    add(this, temp.s, this.s);
	    if (this.s) this.t += temp.t;
	    else this.s = temp.t;
	  },
	  valueOf: function() {
	    return this.s;
	  }
	};

	var temp = new Adder;

	function add(adder, a, b) {
	  var x = adder.s = a + b,
	      bv = x - a,
	      av = x - bv;
	  adder.t = (a - av) + (b - bv);
	}

	var epsilon = 1e-6;
	var epsilon2 = 1e-12;
	var pi = Math.PI;
	var halfPi = pi / 2;
	var quarterPi = pi / 4;
	var tau = pi * 2;

	var degrees = 180 / pi;
	var radians = pi / 180;

	var abs = Math.abs;
	var atan = Math.atan;
	var atan2 = Math.atan2;
	var cos = Math.cos;
	var ceil = Math.ceil;
	var exp = Math.exp;
	var log = Math.log;
	var pow = Math.pow;
	var sin = Math.sin;
	var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
	var sqrt = Math.sqrt;
	var tan = Math.tan;

	function acos(x) {
	  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
	}

	function asin(x) {
	  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
	}

	function haversin(x) {
	  return (x = sin(x / 2)) * x;
	}

	function noop() {}

	function streamGeometry(geometry, stream) {
	  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
	    streamGeometryType[geometry.type](geometry, stream);
	  }
	}

	var streamObjectType = {
	  Feature: function(feature, stream) {
	    streamGeometry(feature.geometry, stream);
	  },
	  FeatureCollection: function(object, stream) {
	    var features = object.features, i = -1, n = features.length;
	    while (++i < n) streamGeometry(features[i].geometry, stream);
	  }
	};

	var streamGeometryType = {
	  Sphere: function(object, stream) {
	    stream.sphere();
	  },
	  Point: function(object, stream) {
	    object = object.coordinates;
	    stream.point(object[0], object[1], object[2]);
	  },
	  MultiPoint: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
	  },
	  LineString: function(object, stream) {
	    streamLine(object.coordinates, stream, 0);
	  },
	  MultiLineString: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) streamLine(coordinates[i], stream, 0);
	  },
	  Polygon: function(object, stream) {
	    streamPolygon(object.coordinates, stream);
	  },
	  MultiPolygon: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) streamPolygon(coordinates[i], stream);
	  },
	  GeometryCollection: function(object, stream) {
	    var geometries = object.geometries, i = -1, n = geometries.length;
	    while (++i < n) streamGeometry(geometries[i], stream);
	  }
	};

	function streamLine(coordinates, stream, closed) {
	  var i = -1, n = coordinates.length - closed, coordinate;
	  stream.lineStart();
	  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
	  stream.lineEnd();
	}

	function streamPolygon(coordinates, stream) {
	  var i = -1, n = coordinates.length;
	  stream.polygonStart();
	  while (++i < n) streamLine(coordinates[i], stream, 1);
	  stream.polygonEnd();
	}

	function geoStream(object, stream) {
	  if (object && streamObjectType.hasOwnProperty(object.type)) {
	    streamObjectType[object.type](object, stream);
	  } else {
	    streamGeometry(object, stream);
	  }
	}

	var areaRingSum = adder();

	var areaSum = adder();
	var lambda00;
	var phi00;
	var lambda0;
	var cosPhi0;
	var sinPhi0;
	var areaStream = {
	  point: noop,
	  lineStart: noop,
	  lineEnd: noop,
	  polygonStart: function() {
	    areaRingSum.reset();
	    areaStream.lineStart = areaRingStart;
	    areaStream.lineEnd = areaRingEnd;
	  },
	  polygonEnd: function() {
	    var areaRing = +areaRingSum;
	    areaSum.add(areaRing < 0 ? tau + areaRing : areaRing);
	    this.lineStart = this.lineEnd = this.point = noop;
	  },
	  sphere: function() {
	    areaSum.add(tau);
	  }
	};

	function areaRingStart() {
	  areaStream.point = areaPointFirst;
	}

	function areaRingEnd() {
	  areaPoint(lambda00, phi00);
	}

	function areaPointFirst(lambda, phi) {
	  areaStream.point = areaPoint;
	  lambda00 = lambda, phi00 = phi;
	  lambda *= radians, phi *= radians;
	  lambda0 = lambda, cosPhi0 = cos(phi = phi / 2 + quarterPi), sinPhi0 = sin(phi);
	}

	function areaPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  phi = phi / 2 + quarterPi; // half the angular distance from south pole

	  // Spherical excess E for a spherical triangle with vertices: south pole,
	  // previous point, current point.  Uses a formula derived from Cagnoli’s
	  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
	  var dLambda = lambda - lambda0,
	      sdLambda = dLambda >= 0 ? 1 : -1,
	      adLambda = sdLambda * dLambda,
	      cosPhi = cos(phi),
	      sinPhi = sin(phi),
	      k = sinPhi0 * sinPhi,
	      u = cosPhi0 * cosPhi + k * cos(adLambda),
	      v = k * sdLambda * sin(adLambda);
	  areaRingSum.add(atan2(v, u));

	  // Advance the previous points.
	  lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
	}

	function area(object) {
	  areaSum.reset();
	  geoStream(object, areaStream);
	  return areaSum * 2;
	}

	function spherical(cartesian) {
	  return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
	}

	function cartesian(spherical) {
	  var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
	  return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
	}

	function cartesianDot(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	function cartesianCross(a, b) {
	  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	}

	// TODO return a
	function cartesianAddInPlace(a, b) {
	  a[0] += b[0], a[1] += b[1], a[2] += b[2];
	}

	function cartesianScale(vector, k) {
	  return [vector[0] * k, vector[1] * k, vector[2] * k];
	}

	// TODO return d
	function cartesianNormalizeInPlace(d) {
	  var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
	  d[0] /= l, d[1] /= l, d[2] /= l;
	}

	var lambda0$1;
	var phi0;
	var lambda1;
	var phi1;
	var lambda2;
	var lambda00$1;
	var phi00$1;
	var p0;
	var deltaSum = adder();
	var ranges;
	var range$1;
	var boundsStream = {
	  point: boundsPoint,
	  lineStart: boundsLineStart,
	  lineEnd: boundsLineEnd,
	  polygonStart: function() {
	    boundsStream.point = boundsRingPoint;
	    boundsStream.lineStart = boundsRingStart;
	    boundsStream.lineEnd = boundsRingEnd;
	    deltaSum.reset();
	    areaStream.polygonStart();
	  },
	  polygonEnd: function() {
	    areaStream.polygonEnd();
	    boundsStream.point = boundsPoint;
	    boundsStream.lineStart = boundsLineStart;
	    boundsStream.lineEnd = boundsLineEnd;
	    if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
	    else if (deltaSum > epsilon) phi1 = 90;
	    else if (deltaSum < -epsilon) phi0 = -90;
	    range$1[0] = lambda0$1, range$1[1] = lambda1;
	  }
	};

	function boundsPoint(lambda, phi) {
	  ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
	  if (phi < phi0) phi0 = phi;
	  if (phi > phi1) phi1 = phi;
	}

	function linePoint(lambda, phi) {
	  var p = cartesian([lambda * radians, phi * radians]);
	  if (p0) {
	    var normal = cartesianCross(p0, p),
	        equatorial = [normal[1], -normal[0], 0],
	        inflection = cartesianCross(equatorial, normal);
	    cartesianNormalizeInPlace(inflection);
	    inflection = spherical(inflection);
	    var delta = lambda - lambda2,
	        sign = delta > 0 ? 1 : -1,
	        lambdai = inflection[0] * degrees * sign,
	        phii,
	        antimeridian = abs(delta) > 180;
	    if (antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
	      phii = inflection[1] * degrees;
	      if (phii > phi1) phi1 = phii;
	    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
	      phii = -inflection[1] * degrees;
	      if (phii < phi0) phi0 = phii;
	    } else {
	      if (phi < phi0) phi0 = phi;
	      if (phi > phi1) phi1 = phi;
	    }
	    if (antimeridian) {
	      if (lambda < lambda2) {
	        if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
	      } else {
	        if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
	      }
	    } else {
	      if (lambda1 >= lambda0$1) {
	        if (lambda < lambda0$1) lambda0$1 = lambda;
	        if (lambda > lambda1) lambda1 = lambda;
	      } else {
	        if (lambda > lambda2) {
	          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
	        } else {
	          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
	        }
	      }
	    }
	  } else {
	    boundsPoint(lambda, phi);
	  }
	  p0 = p, lambda2 = lambda;
	}

	function boundsLineStart() {
	  boundsStream.point = linePoint;
	}

	function boundsLineEnd() {
	  range$1[0] = lambda0$1, range$1[1] = lambda1;
	  boundsStream.point = boundsPoint;
	  p0 = null;
	}

	function boundsRingPoint(lambda, phi) {
	  if (p0) {
	    var delta = lambda - lambda2;
	    deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
	  } else {
	    lambda00$1 = lambda, phi00$1 = phi;
	  }
	  areaStream.point(lambda, phi);
	  linePoint(lambda, phi);
	}

	function boundsRingStart() {
	  areaStream.lineStart();
	}

	function boundsRingEnd() {
	  boundsRingPoint(lambda00$1, phi00$1);
	  areaStream.lineEnd();
	  if (abs(deltaSum) > epsilon) lambda0$1 = -(lambda1 = 180);
	  range$1[0] = lambda0$1, range$1[1] = lambda1;
	  p0 = null;
	}

	// Finds the left-right distance between two longitudes.
	// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
	// the distance between ±180° to be 360°.
	function angle(lambda0, lambda1) {
	  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
	}

	function rangeCompare(a, b) {
	  return a[0] - b[0];
	}

	function rangeContains(range, x) {
	  return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
	}

	function bounds(feature) {
	  var i, n, a, b, merged, deltaMax, delta;

	  phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
	  ranges = [];
	  geoStream(feature, boundsStream);

	  // First, sort ranges by their minimum longitudes.
	  if (n = ranges.length) {
	    ranges.sort(rangeCompare);

	    // Then, merge any ranges that overlap.
	    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
	      b = ranges[i];
	      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
	        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
	        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
	      } else {
	        merged.push(a = b);
	      }
	    }

	    // Finally, find the largest gap between the merged ranges.
	    // The final bounding box will be the inverse of this gap.
	    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
	      b = merged[i];
	      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
	    }
	  }

	  ranges = range$1 = null;

	  return lambda0$1 === Infinity || phi0 === Infinity
	      ? [[NaN, NaN], [NaN, NaN]]
	      : [[lambda0$1, phi0], [lambda1, phi1]];
	}

	var W0;
	var W1;
	var X0;
	var Y0;
	var Z0;
	var X1;
	var Y1;
	var Z1;
	var X2;
	var Y2;
	var Z2;
	var lambda00$2;
	var phi00$2;
	var x0;
	var y0;
	var z0;
	// previous point

	var centroidStream = {
	  sphere: noop,
	  point: centroidPoint,
	  lineStart: centroidLineStart,
	  lineEnd: centroidLineEnd,
	  polygonStart: function() {
	    centroidStream.lineStart = centroidRingStart;
	    centroidStream.lineEnd = centroidRingEnd;
	  },
	  polygonEnd: function() {
	    centroidStream.lineStart = centroidLineStart;
	    centroidStream.lineEnd = centroidLineEnd;
	  }
	};

	// Arithmetic mean of Cartesian vectors.
	function centroidPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos(phi);
	  centroidPointCartesian(cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi));
	}

	function centroidPointCartesian(x, y, z) {
	  ++W0;
	  X0 += (x - X0) / W0;
	  Y0 += (y - Y0) / W0;
	  Z0 += (z - Z0) / W0;
	}

	function centroidLineStart() {
	  centroidStream.point = centroidLinePointFirst;
	}

	function centroidLinePointFirst(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos(phi);
	  x0 = cosPhi * cos(lambda);
	  y0 = cosPhi * sin(lambda);
	  z0 = sin(phi);
	  centroidStream.point = centroidLinePoint;
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroidLinePoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos(phi),
	      x = cosPhi * cos(lambda),
	      y = cosPhi * sin(lambda),
	      z = sin(phi),
	      w = atan2(sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
	  W1 += w;
	  X1 += w * (x0 + (x0 = x));
	  Y1 += w * (y0 + (y0 = y));
	  Z1 += w * (z0 + (z0 = z));
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroidLineEnd() {
	  centroidStream.point = centroidPoint;
	}

	// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
	// J. Applied Mechanics 42, 239 (1975).
	function centroidRingStart() {
	  centroidStream.point = centroidRingPointFirst;
	}

	function centroidRingEnd() {
	  centroidRingPoint(lambda00$2, phi00$2);
	  centroidStream.point = centroidPoint;
	}

	function centroidRingPointFirst(lambda, phi) {
	  lambda00$2 = lambda, phi00$2 = phi;
	  lambda *= radians, phi *= radians;
	  centroidStream.point = centroidRingPoint;
	  var cosPhi = cos(phi);
	  x0 = cosPhi * cos(lambda);
	  y0 = cosPhi * sin(lambda);
	  z0 = sin(phi);
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroidRingPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var cosPhi = cos(phi),
	      x = cosPhi * cos(lambda),
	      y = cosPhi * sin(lambda),
	      z = sin(phi),
	      cx = y0 * z - z0 * y,
	      cy = z0 * x - x0 * z,
	      cz = x0 * y - y0 * x,
	      m = sqrt(cx * cx + cy * cy + cz * cz),
	      u = x0 * x + y0 * y + z0 * z,
	      v = m && -acos(u) / m, // area weight
	      w = atan2(m, u); // line weight
	  X2 += v * cx;
	  Y2 += v * cy;
	  Z2 += v * cz;
	  W1 += w;
	  X1 += w * (x0 + (x0 = x));
	  Y1 += w * (y0 + (y0 = y));
	  Z1 += w * (z0 + (z0 = z));
	  centroidPointCartesian(x0, y0, z0);
	}

	function centroid(object) {
	  W0 = W1 =
	  X0 = Y0 = Z0 =
	  X1 = Y1 = Z1 =
	  X2 = Y2 = Z2 = 0;
	  geoStream(object, centroidStream);

	  var x = X2,
	      y = Y2,
	      z = Z2,
	      m = x * x + y * y + z * z;

	  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
	  if (m < epsilon2) {
	    x = X1, y = Y1, z = Z1;
	    // If the feature has zero length, fall back to arithmetic mean of point vectors.
	    if (W1 < epsilon) x = X0, y = Y0, z = Z0;
	    m = x * x + y * y + z * z;
	    // If the feature still has an undefined ccentroid, then return.
	    if (m < epsilon2) return [NaN, NaN];
	  }

	  return [atan2(y, x) * degrees, asin(z / sqrt(m)) * degrees];
	}

	function constant(x) {
	  return function() {
	    return x;
	  };
	}

	function compose(a, b) {

	  function compose(x, y) {
	    return x = a(x, y), b(x[0], x[1]);
	  }

	  if (a.invert && b.invert) compose.invert = function(x, y) {
	    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
	  };

	  return compose;
	}

	function rotationIdentity(lambda, phi) {
	  return [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
	}

	rotationIdentity.invert = rotationIdentity;

	function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
	  return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
	    : rotationLambda(deltaLambda))
	    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
	    : rotationIdentity);
	}

	function forwardRotationLambda(deltaLambda) {
	  return function(lambda, phi) {
	    return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
	  };
	}

	function rotationLambda(deltaLambda) {
	  var rotation = forwardRotationLambda(deltaLambda);
	  rotation.invert = forwardRotationLambda(-deltaLambda);
	  return rotation;
	}

	function rotationPhiGamma(deltaPhi, deltaGamma) {
	  var cosDeltaPhi = cos(deltaPhi),
	      sinDeltaPhi = sin(deltaPhi),
	      cosDeltaGamma = cos(deltaGamma),
	      sinDeltaGamma = sin(deltaGamma);

	  function rotation(lambda, phi) {
	    var cosPhi = cos(phi),
	        x = cos(lambda) * cosPhi,
	        y = sin(lambda) * cosPhi,
	        z = sin(phi),
	        k = z * cosDeltaPhi + x * sinDeltaPhi;
	    return [
	      atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
	      asin(k * cosDeltaGamma + y * sinDeltaGamma)
	    ];
	  }

	  rotation.invert = function(lambda, phi) {
	    var cosPhi = cos(phi),
	        x = cos(lambda) * cosPhi,
	        y = sin(lambda) * cosPhi,
	        z = sin(phi),
	        k = z * cosDeltaGamma - y * sinDeltaGamma;
	    return [
	      atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
	      asin(k * cosDeltaPhi - x * sinDeltaPhi)
	    ];
	  };

	  return rotation;
	}

	function rotation(rotate) {
	  rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);

	  function forward(coordinates) {
	    coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
	    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
	  }

	  forward.invert = function(coordinates) {
	    coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
	    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
	  };

	  return forward;
	}

	// Generates a circle centered at [0°, 0°], with a given radius and precision.
	function circleStream(stream, radius, delta, direction, t0, t1) {
	  if (!delta) return;
	  var cosRadius = cos(radius),
	      sinRadius = sin(radius),
	      step = direction * delta;
	  if (t0 == null) {
	    t0 = radius + direction * tau;
	    t1 = radius - step / 2;
	  } else {
	    t0 = circleRadius(cosRadius, t0);
	    t1 = circleRadius(cosRadius, t1);
	    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
	  }
	  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
	    point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
	    stream.point(point[0], point[1]);
	  }
	}

	// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
	function circleRadius(cosRadius, point) {
	  point = cartesian(point), point[0] -= cosRadius;
	  cartesianNormalizeInPlace(point);
	  var radius = acos(-point[1]);
	  return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
	}

	function circle() {
	  var center = constant([0, 0]),
	      radius = constant(90),
	      precision = constant(6),
	      ring,
	      rotate,
	      stream = {point: point};

	  function point(x, y) {
	    ring.push(x = rotate(x, y));
	    x[0] *= degrees, x[1] *= degrees;
	  }

	  function circle() {
	    var c = center.apply(this, arguments),
	        r = radius.apply(this, arguments) * radians,
	        p = precision.apply(this, arguments) * radians;
	    ring = [];
	    rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
	    circleStream(stream, r, p, 1);
	    c = {type: "Polygon", coordinates: [ring]};
	    ring = rotate = null;
	    return c;
	  }

	  circle.center = function(_) {
	    return arguments.length ? (center = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), circle) : center;
	  };

	  circle.radius = function(_) {
	    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), circle) : radius;
	  };

	  circle.precision = function(_) {
	    return arguments.length ? (precision = typeof _ === "function" ? _ : constant(+_), circle) : precision;
	  };

	  return circle;
	}

	function clipBuffer() {
	  var lines = [],
	      line;
	  return {
	    point: function(x, y) {
	      line.push([x, y]);
	    },
	    lineStart: function() {
	      lines.push(line = []);
	    },
	    lineEnd: noop,
	    rejoin: function() {
	      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
	    },
	    result: function() {
	      var result = lines;
	      lines = [];
	      line = null;
	      return result;
	    }
	  };
	}

	function clipLine(a, b, x0, y0, x1, y1) {
	  var ax = a[0],
	      ay = a[1],
	      bx = b[0],
	      by = b[1],
	      t0 = 0,
	      t1 = 1,
	      dx = bx - ax,
	      dy = by - ay,
	      r;

	  r = x0 - ax;
	  if (!dx && r > 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dx > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = x1 - ax;
	  if (!dx && r < 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dx > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  r = y0 - ay;
	  if (!dy && r > 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dy > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = y1 - ay;
	  if (!dy && r < 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dy > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
	  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
	  return true;
	}

	function pointEqual(a, b) {
	  return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
	}

	function Intersection(point, points, other, entry) {
	  this.x = point;
	  this.z = points;
	  this.o = other; // another intersection
	  this.e = entry; // is an entry?
	  this.v = false; // visited
	  this.n = this.p = null; // next & previous
	}

	// A generalized polygon clipping algorithm: given a polygon that has been cut
	// into its visible line segments, and rejoins the segments by interpolating
	// along the clip edge.
	function clipPolygon(segments, compareIntersection, startInside, interpolate, stream) {
	  var subject = [],
	      clip = [],
	      i,
	      n;

	  segments.forEach(function(segment) {
	    if ((n = segment.length - 1) <= 0) return;
	    var n, p0 = segment[0], p1 = segment[n], x;

	    // If the first and last points of a segment are coincident, then treat as a
	    // closed ring. TODO if all rings are closed, then the winding order of the
	    // exterior ring should be checked.
	    if (pointEqual(p0, p1)) {
	      stream.lineStart();
	      for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
	      stream.lineEnd();
	      return;
	    }

	    subject.push(x = new Intersection(p0, segment, null, true));
	    clip.push(x.o = new Intersection(p0, null, x, false));
	    subject.push(x = new Intersection(p1, segment, null, false));
	    clip.push(x.o = new Intersection(p1, null, x, true));
	  });

	  if (!subject.length) return;

	  clip.sort(compareIntersection);
	  link(subject);
	  link(clip);

	  for (i = 0, n = clip.length; i < n; ++i) {
	    clip[i].e = startInside = !startInside;
	  }

	  var start = subject[0],
	      points,
	      point;

	  while (1) {
	    // Find first unvisited intersection.
	    var current = start,
	        isSubject = true;
	    while (current.v) if ((current = current.n) === start) return;
	    points = current.z;
	    stream.lineStart();
	    do {
	      current.v = current.o.v = true;
	      if (current.e) {
	        if (isSubject) {
	          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
	        } else {
	          interpolate(current.x, current.n.x, 1, stream);
	        }
	        current = current.n;
	      } else {
	        if (isSubject) {
	          points = current.p.z;
	          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
	        } else {
	          interpolate(current.x, current.p.x, -1, stream);
	        }
	        current = current.p;
	      }
	      current = current.o;
	      points = current.z;
	      isSubject = !isSubject;
	    } while (!current.v);
	    stream.lineEnd();
	  }
	}

	function link(array) {
	  if (!(n = array.length)) return;
	  var n,
	      i = 0,
	      a = array[0],
	      b;
	  while (++i < n) {
	    a.n = b = array[i];
	    b.p = a;
	    a = b;
	  }
	  a.n = b = array[0];
	  b.p = a;
	}

	var clipMax = 1e9;
	var clipMin = -clipMax;
	// TODO Use d3-polygon’s polygonContains here for the ring check?
	// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

	function clipExtent(x0, y0, x1, y1) {

	  function visible(x, y) {
	    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
	  }

	  function interpolate(from, to, direction, stream) {
	    var a = 0, a1 = 0;
	    if (from == null
	        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
	        || comparePoint(from, to) < 0 ^ direction > 0) {
	      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
	      while ((a = (a + direction + 4) % 4) !== a1);
	    } else {
	      stream.point(to[0], to[1]);
	    }
	  }

	  function corner(p, direction) {
	    return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
	        : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
	        : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
	        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
	  }

	  function compareIntersection(a, b) {
	    return comparePoint(a.x, b.x);
	  }

	  function comparePoint(a, b) {
	    var ca = corner(a, 1),
	        cb = corner(b, 1);
	    return ca !== cb ? ca - cb
	        : ca === 0 ? b[1] - a[1]
	        : ca === 1 ? a[0] - b[0]
	        : ca === 2 ? a[1] - b[1]
	        : b[0] - a[0];
	  }

	  return function(stream) {
	    var activeStream = stream,
	        bufferStream = clipBuffer(),
	        segments,
	        polygon,
	        ring,
	        x__, y__, v__, // first point
	        x_, y_, v_, // previous point
	        first,
	        clean;

	    var clipStream = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: polygonStart,
	      polygonEnd: polygonEnd
	    };

	    function point(x, y) {
	      if (visible(x, y)) activeStream.point(x, y);
	    }

	    function polygonInside() {
	      var winding = 0;

	      for (var i = 0, n = polygon.length; i < n; ++i) {
	        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
	          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
	          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
	          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
	        }
	      }

	      return winding;
	    }

	    // Buffer geometry within a polygon and then clip it en masse.
	    function polygonStart() {
	      activeStream = bufferStream, segments = [], polygon = [], clean = true;
	    }

	    function polygonEnd() {
	      var startInside = polygonInside(),
	          cleanInside = clean && startInside,
	          visible = (segments = d3Array.merge(segments)).length;
	      if (cleanInside || visible) {
	        stream.polygonStart();
	        if (cleanInside) {
	          stream.lineStart();
	          interpolate(null, null, 1, stream);
	          stream.lineEnd();
	        }
	        if (visible) {
	          clipPolygon(segments, compareIntersection, startInside, interpolate, stream);
	        }
	        stream.polygonEnd();
	      }
	      activeStream = stream, segments = polygon = ring = null;
	    }

	    function lineStart() {
	      clipStream.point = linePoint;
	      if (polygon) polygon.push(ring = []);
	      first = true;
	      v_ = false;
	      x_ = y_ = NaN;
	    }

	    // TODO rather than special-case polygons, simply handle them separately.
	    // Ideally, coincident intersection points should be jittered to avoid
	    // clipping issues.
	    function lineEnd() {
	      if (segments) {
	        linePoint(x__, y__);
	        if (v__ && v_) bufferStream.rejoin();
	        segments.push(bufferStream.result());
	      }
	      clipStream.point = point;
	      if (v_) activeStream.lineEnd();
	    }

	    function linePoint(x, y) {
	      var v = visible(x, y);
	      if (polygon) ring.push([x, y]);
	      if (first) {
	        x__ = x, y__ = y, v__ = v;
	        first = false;
	        if (v) {
	          activeStream.lineStart();
	          activeStream.point(x, y);
	        }
	      } else {
	        if (v && v_) activeStream.point(x, y);
	        else {
	          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
	              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
	          if (clipLine(a, b, x0, y0, x1, y1)) {
	            if (!v_) {
	              activeStream.lineStart();
	              activeStream.point(a[0], a[1]);
	            }
	            activeStream.point(b[0], b[1]);
	            if (!v) activeStream.lineEnd();
	            clean = false;
	          } else if (v) {
	            activeStream.lineStart();
	            activeStream.point(x, y);
	            clean = false;
	          }
	        }
	      }
	      x_ = x, y_ = y, v_ = v;
	    }

	    return clipStream;
	  };
	}

	function extent() {
	  var x0 = 0,
	      y0 = 0,
	      x1 = 960,
	      y1 = 500,
	      cache,
	      cacheStream,
	      clip;

	  return clip = {
	    stream: function(stream) {
	      return cache && cacheStream === stream ? cache : cache = clipExtent(x0, y0, x1, y1)(cacheStream = stream);
	    },
	    extent: function(_) {
	      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
	    }
	  };
	}

	var lengthSum = adder();
	var lambda0$2;
	var sinPhi0$1;
	var cosPhi0$1;
	var lengthStream = {
	  sphere: noop,
	  point: noop,
	  lineStart: lengthLineStart,
	  lineEnd: noop,
	  polygonStart: noop,
	  polygonEnd: noop
	};

	function lengthLineStart() {
	  lengthStream.point = lengthPointFirst;
	  lengthStream.lineEnd = lengthLineEnd;
	}

	function lengthLineEnd() {
	  lengthStream.point = lengthStream.lineEnd = noop;
	}

	function lengthPointFirst(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  lambda0$2 = lambda, sinPhi0$1 = sin(phi), cosPhi0$1 = cos(phi);
	  lengthStream.point = lengthPoint;
	}

	function lengthPoint(lambda, phi) {
	  lambda *= radians, phi *= radians;
	  var sinPhi = sin(phi),
	      cosPhi = cos(phi),
	      delta = abs(lambda - lambda0$2),
	      cosDelta = cos(delta),
	      sinDelta = sin(delta),
	      x = cosPhi * sinDelta,
	      y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
	      z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
	  lengthSum.add(atan2(sqrt(x * x + y * y), z));
	  lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
	}

	function length(object) {
	  lengthSum.reset();
	  geoStream(object, lengthStream);
	  return +lengthSum;
	}

	var coordinates = [null, null];
	var object = {type: "LineString", coordinates: coordinates};
	function distance(a, b) {
	  coordinates[0] = a;
	  coordinates[1] = b;
	  return length(object);
	}

	function graticuleX(y0, y1, dy) {
	  var y = d3Array.range(y0, y1 - epsilon, dy).concat(y1);
	  return function(x) { return y.map(function(y) { return [x, y]; }); };
	}

	function graticuleY(x0, x1, dx) {
	  var x = d3Array.range(x0, x1 - epsilon, dx).concat(x1);
	  return function(y) { return x.map(function(x) { return [x, y]; }); };
	}

	function graticule() {
	  var x1, x0, X1, X0,
	      y1, y0, Y1, Y0,
	      dx = 10, dy = dx, DX = 90, DY = 360,
	      x, y, X, Y,
	      precision = 2.5;

	  function graticule() {
	    return {type: "MultiLineString", coordinates: lines()};
	  }

	  function lines() {
	    return d3Array.range(ceil(X0 / DX) * DX, X1, DX).map(X)
	        .concat(d3Array.range(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
	        .concat(d3Array.range(ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return abs(x % DX) > epsilon; }).map(x))
	        .concat(d3Array.range(ceil(y0 / dy) * dy, y1, dy).filter(function(y) { return abs(y % DY) > epsilon; }).map(y));
	  }

	  graticule.lines = function() {
	    return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
	  };

	  graticule.outline = function() {
	    return {
	      type: "Polygon",
	      coordinates: [
	        X(X0).concat(
	        Y(Y1).slice(1),
	        X(X1).reverse().slice(1),
	        Y(Y0).reverse().slice(1))
	      ]
	    };
	  };

	  graticule.extent = function(_) {
	    if (!arguments.length) return graticule.extentMinor();
	    return graticule.extentMajor(_).extentMinor(_);
	  };

	  graticule.extentMajor = function(_) {
	    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
	    X0 = +_[0][0], X1 = +_[1][0];
	    Y0 = +_[0][1], Y1 = +_[1][1];
	    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
	    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
	    return graticule.precision(precision);
	  };

	  graticule.extentMinor = function(_) {
	    if (!arguments.length) return [[x0, y0], [x1, y1]];
	    x0 = +_[0][0], x1 = +_[1][0];
	    y0 = +_[0][1], y1 = +_[1][1];
	    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
	    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
	    return graticule.precision(precision);
	  };

	  graticule.step = function(_) {
	    if (!arguments.length) return graticule.stepMinor();
	    return graticule.stepMajor(_).stepMinor(_);
	  };

	  graticule.stepMajor = function(_) {
	    if (!arguments.length) return [DX, DY];
	    DX = +_[0], DY = +_[1];
	    return graticule;
	  };

	  graticule.stepMinor = function(_) {
	    if (!arguments.length) return [dx, dy];
	    dx = +_[0], dy = +_[1];
	    return graticule;
	  };

	  graticule.precision = function(_) {
	    if (!arguments.length) return precision;
	    precision = +_;
	    x = graticuleX(y0, y1, 90);
	    y = graticuleY(x0, x1, precision);
	    X = graticuleX(Y0, Y1, 90);
	    Y = graticuleY(X0, X1, precision);
	    return graticule;
	  };

	  return graticule
	      .extentMajor([[-180, -90 + epsilon], [180, 90 - epsilon]])
	      .extentMinor([[-180, -80 - epsilon], [180, 80 + epsilon]]);
	}

	function interpolate(a, b) {
	  var x0 = a[0] * radians,
	      y0 = a[1] * radians,
	      x1 = b[0] * radians,
	      y1 = b[1] * radians,
	      cy0 = cos(y0),
	      sy0 = sin(y0),
	      cy1 = cos(y1),
	      sy1 = sin(y1),
	      kx0 = cy0 * cos(x0),
	      ky0 = cy0 * sin(x0),
	      kx1 = cy1 * cos(x1),
	      ky1 = cy1 * sin(x1),
	      d = 2 * asin(sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
	      k = sin(d);

	  var interpolate = d ? function(t) {
	    var B = sin(t *= d) / k,
	        A = sin(d - t) / k,
	        x = A * kx0 + B * kx1,
	        y = A * ky0 + B * ky1,
	        z = A * sy0 + B * sy1;
	    return [
	      atan2(y, x) * degrees,
	      atan2(z, sqrt(x * x + y * y)) * degrees
	    ];
	  } : function() {
	    return [x0 * degrees, y0 * degrees];
	  };

	  interpolate.distance = d;

	  return interpolate;
	}

	function identity(x) {
	  return x;
	}

	var areaSum$1 = adder();
	var areaRingSum$1 = adder();
	var x00;
	var y00;
	var x0$1;
	var y0$1;
	var areaStream$1 = {
	  point: noop,
	  lineStart: noop,
	  lineEnd: noop,
	  polygonStart: function() {
	    areaStream$1.lineStart = areaRingStart$1;
	    areaStream$1.lineEnd = areaRingEnd$1;
	  },
	  polygonEnd: function() {
	    areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop;
	    areaSum$1.add(abs(areaRingSum$1));
	    areaRingSum$1.reset();
	  },
	  result: function() {
	    var area = areaSum$1 / 2;
	    areaSum$1.reset();
	    return area;
	  }
	};

	function areaRingStart$1() {
	  areaStream$1.point = areaPointFirst$1;
	}

	function areaPointFirst$1(x, y) {
	  areaStream$1.point = areaPoint$1;
	  x00 = x0$1 = x, y00 = y0$1 = y;
	}

	function areaPoint$1(x, y) {
	  areaRingSum$1.add(y0$1 * x - x0$1 * y);
	  x0$1 = x, y0$1 = y;
	}

	function areaRingEnd$1() {
	  areaPoint$1(x00, y00);
	}

	var x0$2 = Infinity;
	var y0$2 = x0$2;
	var x1 = -x0$2;
	var y1 = x1;
	var boundsStream$1 = {
	  point: boundsPoint$1,
	  lineStart: noop,
	  lineEnd: noop,
	  polygonStart: noop,
	  polygonEnd: noop,
	  result: function() {
	    var bounds = [[x0$2, y0$2], [x1, y1]];
	    x1 = y1 = -(y0$2 = x0$2 = Infinity);
	    return bounds;
	  }
	};

	function boundsPoint$1(x, y) {
	  if (x < x0$2) x0$2 = x;
	  if (x > x1) x1 = x;
	  if (y < y0$2) y0$2 = y;
	  if (y > y1) y1 = y;
	}

	var X0$1 = 0;
	var Y0$1 = 0;
	var Z0$1 = 0;
	var X1$1 = 0;
	var Y1$1 = 0;
	var Z1$1 = 0;
	var X2$1 = 0;
	var Y2$1 = 0;
	var Z2$1 = 0;
	var x00$1;
	var y00$1;
	var x0$3;
	var y0$3;
	var centroidStream$1 = {
	  point: centroidPoint$1,
	  lineStart: centroidLineStart$1,
	  lineEnd: centroidLineEnd$1,
	  polygonStart: function() {
	    centroidStream$1.lineStart = centroidRingStart$1;
	    centroidStream$1.lineEnd = centroidRingEnd$1;
	  },
	  polygonEnd: function() {
	    centroidStream$1.point = centroidPoint$1;
	    centroidStream$1.lineStart = centroidLineStart$1;
	    centroidStream$1.lineEnd = centroidLineEnd$1;
	  },
	  result: function() {
	    var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
	        : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
	        : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
	        : [NaN, NaN];
	    X0$1 = Y0$1 = Z0$1 =
	    X1$1 = Y1$1 = Z1$1 =
	    X2$1 = Y2$1 = Z2$1 = 0;
	    return centroid;
	  }
	};

	function centroidPoint$1(x, y) {
	  X0$1 += x;
	  Y0$1 += y;
	  ++Z0$1;
	}

	function centroidLineStart$1() {
	  centroidStream$1.point = centroidPointFirstLine;
	}

	function centroidPointFirstLine(x, y) {
	  centroidStream$1.point = centroidPointLine;
	  centroidPoint$1(x0$3 = x, y0$3 = y);
	}

	function centroidPointLine(x, y) {
	  var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
	  X1$1 += z * (x0$3 + x) / 2;
	  Y1$1 += z * (y0$3 + y) / 2;
	  Z1$1 += z;
	  centroidPoint$1(x0$3 = x, y0$3 = y);
	}

	function centroidLineEnd$1() {
	  centroidStream$1.point = centroidPoint$1;
	}

	function centroidRingStart$1() {
	  centroidStream$1.point = centroidPointFirstRing;
	}

	function centroidRingEnd$1() {
	  centroidPointRing(x00$1, y00$1);
	}

	function centroidPointFirstRing(x, y) {
	  centroidStream$1.point = centroidPointRing;
	  centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
	}

	function centroidPointRing(x, y) {
	  var dx = x - x0$3,
	      dy = y - y0$3,
	      z = sqrt(dx * dx + dy * dy);

	  X1$1 += z * (x0$3 + x) / 2;
	  Y1$1 += z * (y0$3 + y) / 2;
	  Z1$1 += z;

	  z = y0$3 * x - x0$3 * y;
	  X2$1 += z * (x0$3 + x);
	  Y2$1 += z * (y0$3 + y);
	  Z2$1 += z * 3;
	  centroidPoint$1(x0$3 = x, y0$3 = y);
	}

	function PathContext(context) {
	  this._context = context;
	}

	PathContext.prototype = {
	  _radius: 4.5,
	  pointRadius: function(_) {
	    return this._radius = _, this;
	  },
	  polygonStart: function() {
	    this._line = 0;
	  },
	  polygonEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line === 0) this._context.closePath();
	    this._point = NaN;
	  },
	  point: function(x, y) {
	    switch (this._point) {
	      case 0: {
	        this._context.moveTo(x, y);
	        this._point = 1;
	        break;
	      }
	      case 1: {
	        this._context.lineTo(x, y);
	        break;
	      }
	      default: {
	        this._context.moveTo(x + this._radius, y);
	        this._context.arc(x, y, this._radius, 0, tau);
	        break;
	      }
	    }
	  },
	  result: noop
	};

	function PathString() {
	  this._string = [];
	}

	PathString.prototype = {
	  _circle: circle$1(4.5),
	  pointRadius: function(_) {
	    return this._circle = circle$1(_), this;
	  },
	  polygonStart: function() {
	    this._line = 0;
	  },
	  polygonEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line === 0) this._string.push("Z");
	    this._point = NaN;
	  },
	  point: function(x, y) {
	    switch (this._point) {
	      case 0: {
	        this._string.push("M", x, ",", y);
	        this._point = 1;
	        break;
	      }
	      case 1: {
	        this._string.push("L", x, ",", y);
	        break;
	      }
	      default: {
	        this._string.push("M", x, ",", y, this._circle);
	        break;
	      }
	    }
	  },
	  result: function() {
	    if (this._string.length) {
	      var result = this._string.join("");
	      this._string = [];
	      return result;
	    }
	  }
	};

	function circle$1(radius) {
	  return "m0," + radius
	      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
	      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
	      + "z";
	}

	function index() {
	  var pointRadius = 4.5,
	      projection,
	      projectionStream,
	      context,
	      contextStream;

	  function path(object) {
	    if (object) {
	      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
	      geoStream(object, projectionStream(contextStream));
	    }
	    return contextStream.result();
	  }

	  path.area = function(object) {
	    geoStream(object, projectionStream(areaStream$1));
	    return areaStream$1.result();
	  };

	  path.bounds = function(object) {
	    geoStream(object, projectionStream(boundsStream$1));
	    return boundsStream$1.result();
	  };

	  path.centroid = function(object) {
	    geoStream(object, projectionStream(centroidStream$1));
	    return centroidStream$1.result();
	  };

	  path.projection = function(_) {
	    return arguments.length ? (projectionStream = (projection = _) == null ? identity : _.stream, path) : projection;
	  };

	  path.context = function(_) {
	    if (!arguments.length) return context;
	    contextStream = (context = _) == null ? new PathString : new PathContext(_);
	    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
	    return path;
	  };

	  path.pointRadius = function(_) {
	    if (!arguments.length) return pointRadius;
	    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
	    return path;
	  };

	  return path.projection(null).context(null);
	}

	var sum = adder();

	function polygonContains(polygon, point) {
	  var lambda = point[0],
	      phi = point[1],
	      normal = [sin(lambda), -cos(lambda), 0],
	      angle = 0,
	      winding = 0;

	  sum.reset();

	  for (var i = 0, n = polygon.length; i < n; ++i) {
	    if (!(m = (ring = polygon[i]).length)) continue;
	    var ring,
	        m,
	        point0 = ring[m - 1],
	        lambda0 = point0[0],
	        phi0 = point0[1] / 2 + quarterPi,
	        sinPhi0 = sin(phi0),
	        cosPhi0 = cos(phi0);

	    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
	      var point1 = ring[j],
	          lambda1 = point1[0],
	          phi1 = point1[1] / 2 + quarterPi,
	          sinPhi1 = sin(phi1),
	          cosPhi1 = cos(phi1),
	          delta = lambda1 - lambda0,
	          sign = delta >= 0 ? 1 : -1,
	          absDelta = sign * delta,
	          antimeridian = absDelta > pi,
	          k = sinPhi0 * sinPhi1;

	      sum.add(atan2(k * sign * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
	      angle += antimeridian ? delta + sign * tau : delta;

	      // Are the longitudes either side of the point’s meridian (lambda),
	      // and are the latitudes smaller than the parallel (phi)?
	      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
	        var arc = cartesianCross(cartesian(point0), cartesian(point1));
	        cartesianNormalizeInPlace(arc);
	        var intersection = cartesianCross(normal, arc);
	        cartesianNormalizeInPlace(intersection);
	        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
	        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
	          winding += antimeridian ^ delta >= 0 ? 1 : -1;
	        }
	      }
	    }
	  }

	  // First, determine whether the South pole is inside or outside:
	  //
	  // It is inside if:
	  // * the polygon winds around it in a clockwise direction.
	  // * the polygon does not (cumulatively) wind around it, but has a negative
	  //   (counter-clockwise) area.
	  //
	  // Second, count the (signed) number of times a segment crosses a lambda
	  // from the point to the South pole.  If it is zero, then the point is the
	  // same side as the South pole.

	  return (angle < -epsilon || angle < epsilon && sum < -epsilon) ^ (winding & 1);
	}

	function clip(pointVisible, clipLine, interpolate, start) {
	  return function(rotate, sink) {
	    var line = clipLine(sink),
	        rotatedStart = rotate.invert(start[0], start[1]),
	        ringBuffer = clipBuffer(),
	        ringSink = clipLine(ringBuffer),
	        polygonStarted = false,
	        polygon,
	        segments,
	        ring;

	    var clip = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function() {
	        clip.point = pointRing;
	        clip.lineStart = ringStart;
	        clip.lineEnd = ringEnd;
	        segments = [];
	        polygon = [];
	      },
	      polygonEnd: function() {
	        clip.point = point;
	        clip.lineStart = lineStart;
	        clip.lineEnd = lineEnd;
	        segments = d3Array.merge(segments);
	        var startInside = polygonContains(polygon, rotatedStart);
	        if (segments.length) {
	          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
	          clipPolygon(segments, compareIntersection, startInside, interpolate, sink);
	        } else if (startInside) {
	          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
	          sink.lineStart();
	          interpolate(null, null, 1, sink);
	          sink.lineEnd();
	        }
	        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
	        segments = polygon = null;
	      },
	      sphere: function() {
	        sink.polygonStart();
	        sink.lineStart();
	        interpolate(null, null, 1, sink);
	        sink.lineEnd();
	        sink.polygonEnd();
	      }
	    };

	    function point(lambda, phi) {
	      var point = rotate(lambda, phi);
	      if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
	    }

	    function pointLine(lambda, phi) {
	      var point = rotate(lambda, phi);
	      line.point(point[0], point[1]);
	    }

	    function lineStart() {
	      clip.point = pointLine;
	      line.lineStart();
	    }

	    function lineEnd() {
	      clip.point = point;
	      line.lineEnd();
	    }

	    function pointRing(lambda, phi) {
	      ring.push([lambda, phi]);
	      var point = rotate(lambda, phi);
	      ringSink.point(point[0], point[1]);
	    }

	    function ringStart() {
	      ringSink.lineStart();
	      ring = [];
	    }

	    function ringEnd() {
	      pointRing(ring[0][0], ring[0][1]);
	      ringSink.lineEnd();

	      var clean = ringSink.clean(),
	          ringSegments = ringBuffer.result(),
	          i, n = ringSegments.length, m,
	          segment,
	          point;

	      ring.pop();
	      polygon.push(ring);
	      ring = null;

	      if (!n) return;

	      // No intersections.
	      if (clean & 1) {
	        segment = ringSegments[0];
	        if ((m = segment.length - 1) > 0) {
	          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
	          sink.lineStart();
	          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
	          sink.lineEnd();
	        }
	        return;
	      }

	      // Rejoin connected segments.
	      // TODO reuse ringBuffer.rejoin()?
	      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

	      segments.push(ringSegments.filter(validSegment));
	    }

	    return clip;
	  };
	}

	function validSegment(segment) {
	  return segment.length > 1;
	}

	// Intersections are sorted along the clip edge. For both antimeridian cutting
	// and circle clipping, the same comparison is used.
	function compareIntersection(a, b) {
	  return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
	       - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
	}

	var clipAntimeridian = clip(
	  function() { return true; },
	  clipAntimeridianLine,
	  clipAntimeridianInterpolate,
	  [-pi, -halfPi]
	);

	// Takes a line and cuts into visible segments. Return values: 0 - there were
	// intersections or the line was empty; 1 - no intersections; 2 - there were
	// intersections, and the first and last segments should be rejoined.
	function clipAntimeridianLine(stream) {
	  var lambda0 = NaN,
	      phi0 = NaN,
	      sign0 = NaN,
	      clean; // no intersections

	  return {
	    lineStart: function() {
	      stream.lineStart();
	      clean = 1;
	    },
	    point: function(lambda1, phi1) {
	      var sign1 = lambda1 > 0 ? pi : -pi,
	          delta = abs(lambda1 - lambda0);
	      if (abs(delta - pi) < epsilon) { // line crosses a pole
	        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
	        stream.point(sign0, phi0);
	        stream.lineEnd();
	        stream.lineStart();
	        stream.point(sign1, phi0);
	        stream.point(lambda1, phi0);
	        clean = 0;
	      } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
	        if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
	        if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
	        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
	        stream.point(sign0, phi0);
	        stream.lineEnd();
	        stream.lineStart();
	        stream.point(sign1, phi0);
	        clean = 0;
	      }
	      stream.point(lambda0 = lambda1, phi0 = phi1);
	      sign0 = sign1;
	    },
	    lineEnd: function() {
	      stream.lineEnd();
	      lambda0 = phi0 = NaN;
	    },
	    clean: function() {
	      return 2 - clean; // if intersections, rejoin first and last segments
	    }
	  };
	}

	function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
	  var cosPhi0,
	      cosPhi1,
	      sinLambda0Lambda1 = sin(lambda0 - lambda1);
	  return abs(sinLambda0Lambda1) > epsilon
	      ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
	          - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
	          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
	      : (phi0 + phi1) / 2;
	}

	function clipAntimeridianInterpolate(from, to, direction, stream) {
	  var phi;
	  if (from == null) {
	    phi = direction * halfPi;
	    stream.point(-pi, phi);
	    stream.point(0, phi);
	    stream.point(pi, phi);
	    stream.point(pi, 0);
	    stream.point(pi, -phi);
	    stream.point(0, -phi);
	    stream.point(-pi, -phi);
	    stream.point(-pi, 0);
	    stream.point(-pi, phi);
	  } else if (abs(from[0] - to[0]) > epsilon) {
	    var lambda = from[0] < to[0] ? pi : -pi;
	    phi = direction * lambda / 2;
	    stream.point(-lambda, phi);
	    stream.point(0, phi);
	    stream.point(lambda, phi);
	  } else {
	    stream.point(to[0], to[1]);
	  }
	}

	function clipCircle(radius, delta) {
	  var cr = cos(radius),
	      smallRadius = cr > 0,
	      notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case

	  function interpolate(from, to, direction, stream) {
	    circleStream(stream, radius, delta, direction, from, to);
	  }

	  function visible(lambda, phi) {
	    return cos(lambda) * cos(phi) > cr;
	  }

	  // Takes a line and cuts into visible segments. Return values used for polygon
	  // clipping: 0 - there were intersections or the line was empty; 1 - no
	  // intersections 2 - there were intersections, and the first and last segments
	  // should be rejoined.
	  function clipLine(stream) {
	    var point0, // previous point
	        c0, // code for previous point
	        v0, // visibility of previous point
	        v00, // visibility of first point
	        clean; // no intersections
	    return {
	      lineStart: function() {
	        v00 = v0 = false;
	        clean = 1;
	      },
	      point: function(lambda, phi) {
	        var point1 = [lambda, phi],
	            point2,
	            v = visible(lambda, phi),
	            c = smallRadius
	              ? v ? 0 : code(lambda, phi)
	              : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
	        if (!point0 && (v00 = v0 = v)) stream.lineStart();
	        // Handle degeneracies.
	        // TODO ignore if not clipping polygons.
	        if (v !== v0) {
	          point2 = intersect(point0, point1);
	          if (pointEqual(point0, point2) || pointEqual(point1, point2)) {
	            point1[0] += epsilon;
	            point1[1] += epsilon;
	            v = visible(point1[0], point1[1]);
	          }
	        }
	        if (v !== v0) {
	          clean = 0;
	          if (v) {
	            // outside going in
	            stream.lineStart();
	            point2 = intersect(point1, point0);
	            stream.point(point2[0], point2[1]);
	          } else {
	            // inside going out
	            point2 = intersect(point0, point1);
	            stream.point(point2[0], point2[1]);
	            stream.lineEnd();
	          }
	          point0 = point2;
	        } else if (notHemisphere && point0 && smallRadius ^ v) {
	          var t;
	          // If the codes for two points are different, or are both zero,
	          // and there this segment intersects with the small circle.
	          if (!(c & c0) && (t = intersect(point1, point0, true))) {
	            clean = 0;
	            if (smallRadius) {
	              stream.lineStart();
	              stream.point(t[0][0], t[0][1]);
	              stream.point(t[1][0], t[1][1]);
	              stream.lineEnd();
	            } else {
	              stream.point(t[1][0], t[1][1]);
	              stream.lineEnd();
	              stream.lineStart();
	              stream.point(t[0][0], t[0][1]);
	            }
	          }
	        }
	        if (v && (!point0 || !pointEqual(point0, point1))) {
	          stream.point(point1[0], point1[1]);
	        }
	        point0 = point1, v0 = v, c0 = c;
	      },
	      lineEnd: function() {
	        if (v0) stream.lineEnd();
	        point0 = null;
	      },
	      // Rejoin first and last segments if there were intersections and the first
	      // and last points were visible.
	      clean: function() {
	        return clean | ((v00 && v0) << 1);
	      }
	    };
	  }

	  // Intersects the great circle between a and b with the clip circle.
	  function intersect(a, b, two) {
	    var pa = cartesian(a),
	        pb = cartesian(b);

	    // We have two planes, n1.p = d1 and n2.p = d2.
	    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
	    var n1 = [1, 0, 0], // normal
	        n2 = cartesianCross(pa, pb),
	        n2n2 = cartesianDot(n2, n2),
	        n1n2 = n2[0], // cartesianDot(n1, n2),
	        determinant = n2n2 - n1n2 * n1n2;

	    // Two polar points.
	    if (!determinant) return !two && a;

	    var c1 =  cr * n2n2 / determinant,
	        c2 = -cr * n1n2 / determinant,
	        n1xn2 = cartesianCross(n1, n2),
	        A = cartesianScale(n1, c1),
	        B = cartesianScale(n2, c2);
	    cartesianAddInPlace(A, B);

	    // Solve |p(t)|^2 = 1.
	    var u = n1xn2,
	        w = cartesianDot(A, u),
	        uu = cartesianDot(u, u),
	        t2 = w * w - uu * (cartesianDot(A, A) - 1);

	    if (t2 < 0) return;

	    var t = sqrt(t2),
	        q = cartesianScale(u, (-w - t) / uu);
	    cartesianAddInPlace(q, A);
	    q = spherical(q);

	    if (!two) return q;

	    // Two intersection points.
	    var lambda0 = a[0],
	        lambda1 = b[0],
	        phi0 = a[1],
	        phi1 = b[1],
	        z;

	    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

	    var delta = lambda1 - lambda0,
	        polar = abs(delta - pi) < epsilon,
	        meridian = polar || delta < epsilon;

	    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

	    // Check that the first point is between a and b.
	    if (meridian
	        ? polar
	          ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
	          : phi0 <= q[1] && q[1] <= phi1
	        : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
	      var q1 = cartesianScale(u, (-w + t) / uu);
	      cartesianAddInPlace(q1, A);
	      return [q, spherical(q1)];
	    }
	  }

	  // Generates a 4-bit vector representing the location of a point relative to
	  // the small circle's bounding box.
	  function code(lambda, phi) {
	    var r = smallRadius ? radius : pi - radius,
	        code = 0;
	    if (lambda < -r) code |= 1; // left
	    else if (lambda > r) code |= 2; // right
	    if (phi < -r) code |= 4; // below
	    else if (phi > r) code |= 8; // above
	    return code;
	  }

	  return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
	}

	function transform(prototype) {
	  return {
	    stream: transform$1(prototype)
	  };
	}

	function transform$1(prototype) {
	  function T() {}
	  var p = T.prototype = Object.create(Transform.prototype);
	  for (var k in prototype) p[k] = prototype[k];
	  return function(stream) {
	    var t = new T;
	    t.stream = stream;
	    return t;
	  };
	}

	function Transform() {}

	Transform.prototype = {
	  point: function(x, y) { this.stream.point(x, y); },
	  sphere: function() { this.stream.sphere(); },
	  lineStart: function() { this.stream.lineStart(); },
	  lineEnd: function() { this.stream.lineEnd(); },
	  polygonStart: function() { this.stream.polygonStart(); },
	  polygonEnd: function() { this.stream.polygonEnd(); }
	};

	function fit(project, extent, object) {
	  var w = extent[1][0] - extent[0][0],
	      h = extent[1][1] - extent[0][1],
	      clip = project.clipExtent && project.clipExtent();

	  project
	      .scale(150)
	      .translate([0, 0]);

	  if (clip != null) project.clipExtent(null);

	  geoStream(object, project.stream(boundsStream$1));

	  var b = boundsStream$1.result(),
	      k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
	      x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
	      y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;

	  if (clip != null) project.clipExtent(clip);

	  return project
	      .scale(k * 150)
	      .translate([x, y]);
	}

	function fitSize(project) {
	  return function(size, object) {
	    return fit(project, [[0, 0], size], object);
	  };
	}

	function fitExtent(project) {
	  return function(extent, object) {
	    return fit(project, extent, object);
	  };
	}

	var maxDepth = 16;
	var cosMinDistance = cos(30 * radians);
	// cos(minimum angular distance)

	function resample(project, delta2) {
	  return +delta2 ? resample$1(project, delta2) : resampleNone(project);
	}

	function resampleNone(project) {
	  return transform$1({
	    point: function(x, y) {
	      x = project(x, y);
	      this.stream.point(x[0], x[1]);
	    }
	  });
	}

	function resample$1(project, delta2) {

	  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
	    var dx = x1 - x0,
	        dy = y1 - y0,
	        d2 = dx * dx + dy * dy;
	    if (d2 > 4 * delta2 && depth--) {
	      var a = a0 + a1,
	          b = b0 + b1,
	          c = c0 + c1,
	          m = sqrt(a * a + b * b + c * c),
	          phi2 = asin(c /= m),
	          lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
	          p = project(lambda2, phi2),
	          x2 = p[0],
	          y2 = p[1],
	          dx2 = x2 - x0,
	          dy2 = y2 - y0,
	          dz = dy * dx2 - dx * dy2;
	      if (dz * dz / d2 > delta2 // perpendicular projected distance
	          || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
	          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
	        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
	        stream.point(x2, y2);
	        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
	      }
	    }
	  }
	  return function(stream) {
	    var lambda00, x00, y00, a00, b00, c00, // first point
	        lambda0, x0, y0, a0, b0, c0; // previous point

	    var resampleStream = {
	      point: point,
	      lineStart: lineStart,
	      lineEnd: lineEnd,
	      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
	      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
	    };

	    function point(x, y) {
	      x = project(x, y);
	      stream.point(x[0], x[1]);
	    }

	    function lineStart() {
	      x0 = NaN;
	      resampleStream.point = linePoint;
	      stream.lineStart();
	    }

	    function linePoint(lambda, phi) {
	      var c = cartesian([lambda, phi]), p = project(lambda, phi);
	      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
	      stream.point(x0, y0);
	    }

	    function lineEnd() {
	      resampleStream.point = point;
	      stream.lineEnd();
	    }

	    function ringStart() {
	      lineStart();
	      resampleStream.point = ringPoint;
	      resampleStream.lineEnd = ringEnd;
	    }

	    function ringPoint(lambda, phi) {
	      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
	      resampleStream.point = linePoint;
	    }

	    function ringEnd() {
	      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
	      resampleStream.lineEnd = lineEnd;
	      lineEnd();
	    }

	    return resampleStream;
	  };
	}

	var transformRadians = transform$1({
	  point: function(x, y) {
	    this.stream.point(x * radians, y * radians);
	  }
	});

	function projection(project) {
	  return projectionMutator(function() { return project; })();
	}

	function projectionMutator(projectAt) {
	  var project,
	      k = 150, // scale
	      x = 480, y = 250, // translate
	      dx, dy, lambda = 0, phi = 0, // center
	      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
	      theta = null, preclip = clipAntimeridian, // clip angle
	      x0 = null, y0, x1, y1, postclip = identity, // clip extent
	      delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
	      cache,
	      cacheStream;

	  function projection(point) {
	    point = projectRotate(point[0] * radians, point[1] * radians);
	    return [point[0] * k + dx, dy - point[1] * k];
	  }

	  function invert(point) {
	    point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
	    return point && [point[0] * degrees, point[1] * degrees];
	  }

	  function projectTransform(x, y) {
	    return x = project(x, y), [x[0] * k + dx, dy - x[1] * k];
	  }

	  projection.stream = function(stream) {
	    return cache && cacheStream === stream ? cache : cache = transformRadians(preclip(rotate, projectResample(postclip(cacheStream = stream))));
	  };

	  projection.clipAngle = function(_) {
	    return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians, 6 * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
	  };

	  projection.clipExtent = function(_) {
	    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
	  };

	  projection.scale = function(_) {
	    return arguments.length ? (k = +_, recenter()) : k;
	  };

	  projection.translate = function(_) {
	    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
	  };

	  projection.center = function(_) {
	    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
	  };

	  projection.rotate = function(_) {
	    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
	  };

	  projection.precision = function(_) {
	    return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
	  };

	  projection.fitExtent = fitExtent(projection);

	  projection.fitSize = fitSize(projection);

	  function recenter() {
	    projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
	    var center = project(lambda, phi);
	    dx = x - center[0] * k;
	    dy = y + center[1] * k;
	    return reset();
	  }

	  function reset() {
	    cache = cacheStream = null;
	    return projection;
	  }

	  return function() {
	    project = projectAt.apply(this, arguments);
	    projection.invert = project.invert && invert;
	    return recenter();
	  };
	}

	function conicProjection(projectAt) {
	  var phi0 = 0,
	      phi1 = pi / 3,
	      m = projectionMutator(projectAt),
	      p = m(phi0, phi1);

	  p.parallels = function(_) {
	    return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
	  };

	  return p;
	}

	function conicEqualAreaRaw(y0, y1) {
	  var sy0 = sin(y0),
	      n = (sy0 + sin(y1)) / 2,
	      c = 1 + sy0 * (2 * n - sy0),
	      r0 = sqrt(c) / n;

	  function project(x, y) {
	    var r = sqrt(c - 2 * n * sin(y)) / n;
	    return [r * sin(x *= n), r0 - r * cos(x)];
	  }

	  project.invert = function(x, y) {
	    var r0y = r0 - y;
	    return [atan2(x, r0y) / n, asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
	  };

	  return project;
	}

	function conicEqualArea() {
	  return conicProjection(conicEqualAreaRaw)
	      .scale(155.424)
	      .center([0, 33.6442]);
	}

	function albers() {
	  return conicEqualArea()
	      .parallels([29.5, 45.5])
	      .scale(1070)
	      .translate([480, 250])
	      .rotate([96, 0])
	      .center([-0.6, 38.7]);
	}

	// The projections must have mutually exclusive clip regions on the sphere,
	// as this will avoid emitting interleaving lines and polygons.
	function multiplex(streams) {
	  var n = streams.length;
	  return {
	    point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
	    sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
	    lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
	    lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
	    polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
	    polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
	  };
	}

	// A composite projection for the United States, configured by default for
	// 960×500. The projection also works quite well at 960×600 if you change the
	// scale to 1285 and adjust the translate accordingly. The set of standard
	// parallels for each region comes from USGS, which is published here:
	// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
	function albersUsa() {
	  var cache,
	      cacheStream,
	      lower48 = albers(), lower48Point,
	      alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
	      hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
	      point, pointStream = {point: function(x, y) { point = [x, y]; }};

	  function albersUsa(coordinates) {
	    var x = coordinates[0], y = coordinates[1];
	    return point = null,
	        (lower48Point.point(x, y), point)
	        || (alaskaPoint.point(x, y), point)
	        || (hawaiiPoint.point(x, y), point);
	  }

	  albersUsa.invert = function(coordinates) {
	    var k = lower48.scale(),
	        t = lower48.translate(),
	        x = (coordinates[0] - t[0]) / k,
	        y = (coordinates[1] - t[1]) / k;
	    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
	        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
	        : lower48).invert(coordinates);
	  };

	  albersUsa.stream = function(stream) {
	    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
	  };

	  albersUsa.precision = function(_) {
	    if (!arguments.length) return lower48.precision();
	    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
	    return albersUsa;
	  };

	  albersUsa.scale = function(_) {
	    if (!arguments.length) return lower48.scale();
	    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
	    return albersUsa.translate(lower48.translate());
	  };

	  albersUsa.translate = function(_) {
	    if (!arguments.length) return lower48.translate();
	    var k = lower48.scale(), x = +_[0], y = +_[1];

	    lower48Point = lower48
	        .translate(_)
	        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
	        .stream(pointStream);

	    alaskaPoint = alaska
	        .translate([x - 0.307 * k, y + 0.201 * k])
	        .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
	        .stream(pointStream);

	    hawaiiPoint = hawaii
	        .translate([x - 0.205 * k, y + 0.212 * k])
	        .clipExtent([[x - 0.214 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
	        .stream(pointStream);

	    return albersUsa;
	  };

	  albersUsa.fitExtent = fitExtent(albersUsa);

	  albersUsa.fitSize = fitSize(albersUsa);

	  return albersUsa.scale(1070);
	}

	function azimuthalRaw(scale) {
	  return function(x, y) {
	    var cx = cos(x),
	        cy = cos(y),
	        k = scale(cx * cy);
	    return [
	      k * cy * sin(x),
	      k * sin(y)
	    ];
	  }
	}

	function azimuthalInvert(angle) {
	  return function(x, y) {
	    var z = sqrt(x * x + y * y),
	        c = angle(z),
	        sc = sin(c),
	        cc = cos(c);
	    return [
	      atan2(x * sc, z * cc),
	      asin(z && y * sc / z)
	    ];
	  }
	}

	var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
	  return sqrt(2 / (1 + cxcy));
	});

	azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
	  return 2 * asin(z / 2);
	});

	function azimuthalEqualArea() {
	  return projection(azimuthalEqualAreaRaw)
	      .scale(124.75)
	      .clipAngle(180 - 1e-3);
	}

	var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
	  return (c = acos(c)) && c / sin(c);
	});

	azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
	  return z;
	});

	function azimuthalEquidistant() {
	  return projection(azimuthalEquidistantRaw)
	      .scale(79.4188)
	      .clipAngle(180 - 1e-3);
	}

	function mercatorRaw(lambda, phi) {
	  return [lambda, log(tan((halfPi + phi) / 2))];
	}

	mercatorRaw.invert = function(x, y) {
	  return [x, 2 * atan(exp(y)) - halfPi];
	};

	function mercator() {
	  return mercatorProjection(mercatorRaw)
	      .scale(961 / tau);
	}

	function mercatorProjection(project) {
	  var m = projection(project),
	      scale = m.scale,
	      translate = m.translate,
	      clipExtent = m.clipExtent,
	      clipAuto;

	  m.scale = function(_) {
	    return arguments.length ? (scale(_), clipAuto && m.clipExtent(null), m) : scale();
	  };

	  m.translate = function(_) {
	    return arguments.length ? (translate(_), clipAuto && m.clipExtent(null), m) : translate();
	  };

	  m.clipExtent = function(_) {
	    if (!arguments.length) return clipAuto ? null : clipExtent();
	    if (clipAuto = _ == null) {
	      var k = pi * scale(),
	          t = translate();
	      _ = [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]];
	    }
	    clipExtent(_);
	    return m;
	  };

	  return m.clipExtent(null);
	}

	function tany(y) {
	  return tan((halfPi + y) / 2);
	}

	function conicConformalRaw(y0, y1) {
	  var cy0 = cos(y0),
	      n = y0 === y1 ? sin(y0) : log(cy0 / cos(y1)) / log(tany(y1) / tany(y0)),
	      f = cy0 * pow(tany(y0), n) / n;

	  if (!n) return mercatorRaw;

	  function project(x, y) {
	    if (f > 0) { if (y < -halfPi + epsilon) y = -halfPi + epsilon; }
	    else { if (y > halfPi - epsilon) y = halfPi - epsilon; }
	    var r = f / pow(tany(y), n);
	    return [r * sin(n * x), f - r * cos(n * x)];
	  }

	  project.invert = function(x, y) {
	    var fy = f - y, r = sign(n) * sqrt(x * x + fy * fy);
	    return [atan2(x, fy) / n, 2 * atan(pow(f / r, 1 / n)) - halfPi];
	  };

	  return project;
	}

	function conicConformal() {
	  return conicProjection(conicConformalRaw)
	      .scale(109.5)
	      .parallels([30, 30]);
	}

	function equirectangularRaw(lambda, phi) {
	  return [lambda, phi];
	}

	equirectangularRaw.invert = equirectangularRaw;

	function equirectangular() {
	  return projection(equirectangularRaw)
	      .scale(152.63);
	}

	function conicEquidistantRaw(y0, y1) {
	  var cy0 = cos(y0),
	      n = y0 === y1 ? sin(y0) : (cy0 - cos(y1)) / (y1 - y0),
	      g = cy0 / n + y0;

	  if (abs(n) < epsilon) return equirectangularRaw;

	  function project(x, y) {
	    var gy = g - y, nx = n * x;
	    return [gy * sin(nx), g - gy * cos(nx)];
	  }

	  project.invert = function(x, y) {
	    var gy = g - y;
	    return [atan2(x, gy) / n, g - sign(n) * sqrt(x * x + gy * gy)];
	  };

	  return project;
	}

	function conicEquidistant() {
	  return conicProjection(conicEquidistantRaw)
	      .scale(131.154)
	      .center([0, 13.9389]);
	}

	function gnomonicRaw(x, y) {
	  var cy = cos(y), k = cos(x) * cy;
	  return [cy * sin(x) / k, sin(y) / k];
	}

	gnomonicRaw.invert = azimuthalInvert(atan);

	function gnomonic() {
	  return projection(gnomonicRaw)
	      .scale(144.049)
	      .clipAngle(60);
	}

	function orthographicRaw(x, y) {
	  return [cos(y) * sin(x), sin(y)];
	}

	orthographicRaw.invert = azimuthalInvert(asin);

	function orthographic() {
	  return projection(orthographicRaw)
	      .scale(249.5)
	      .clipAngle(90 + epsilon);
	}

	function stereographicRaw(x, y) {
	  var cy = cos(y), k = 1 + cos(x) * cy;
	  return [cy * sin(x) / k, sin(y) / k];
	}

	stereographicRaw.invert = azimuthalInvert(function(z) {
	  return 2 * atan(z);
	});

	function stereographic() {
	  return projection(stereographicRaw)
	      .scale(250)
	      .clipAngle(142);
	}

	function transverseMercatorRaw(lambda, phi) {
	  return [log(tan((halfPi + phi) / 2)), -lambda];
	}

	transverseMercatorRaw.invert = function(x, y) {
	  return [-y, 2 * atan(exp(x)) - halfPi];
	};

	function transverseMercator() {
	  var m = mercatorProjection(transverseMercatorRaw),
	      center = m.center,
	      rotate = m.rotate;

	  m.center = function(_) {
	    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
	  };

	  m.rotate = function(_) {
	    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
	  };

	  return rotate([0, 0, 90])
	      .scale(159.155);
	}

	exports.geoArea = area;
	exports.geoBounds = bounds;
	exports.geoCentroid = centroid;
	exports.geoCircle = circle;
	exports.geoClipExtent = extent;
	exports.geoDistance = distance;
	exports.geoGraticule = graticule;
	exports.geoInterpolate = interpolate;
	exports.geoLength = length;
	exports.geoPath = index;
	exports.geoAlbers = albers;
	exports.geoAlbersUsa = albersUsa;
	exports.geoAzimuthalEqualArea = azimuthalEqualArea;
	exports.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
	exports.geoAzimuthalEquidistant = azimuthalEquidistant;
	exports.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw;
	exports.geoConicConformal = conicConformal;
	exports.geoConicConformalRaw = conicConformalRaw;
	exports.geoConicEqualArea = conicEqualArea;
	exports.geoConicEqualAreaRaw = conicEqualAreaRaw;
	exports.geoConicEquidistant = conicEquidistant;
	exports.geoConicEquidistantRaw = conicEquidistantRaw;
	exports.geoEquirectangular = equirectangular;
	exports.geoEquirectangularRaw = equirectangularRaw;
	exports.geoGnomonic = gnomonic;
	exports.geoGnomonicRaw = gnomonicRaw;
	exports.geoProjection = projection;
	exports.geoProjectionMutator = projectionMutator;
	exports.geoMercator = mercator;
	exports.geoMercatorRaw = mercatorRaw;
	exports.geoOrthographic = orthographic;
	exports.geoOrthographicRaw = orthographicRaw;
	exports.geoStereographic = stereographic;
	exports.geoStereographicRaw = stereographicRaw;
	exports.geoTransverseMercator = transverseMercator;
	exports.geoTransverseMercatorRaw = transverseMercatorRaw;
	exports.geoRotation = rotation;
	exports.geoStream = geoStream;
	exports.geoTransform = transform;

	Object.defineProperty(exports, '__esModule', { value: true });

	})));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-array/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }

	  function bisector(compare) {
	    if (compare.length === 1) compare = ascendingComparator(compare);
	    return {
	      left: function(a, x, lo, hi) {
	        if (lo == null) lo = 0;
	        if (hi == null) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1;
	          else hi = mid;
	        }
	        return lo;
	      },
	      right: function(a, x, lo, hi) {
	        if (lo == null) lo = 0;
	        if (hi == null) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid;
	          else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  }

	  function ascendingComparator(f) {
	    return function(d, x) {
	      return ascending(f(d), x);
	    };
	  }

	  var ascendingBisect = bisector(ascending);
	  var bisectRight = ascendingBisect.right;
	  var bisectLeft = ascendingBisect.left;

	  function descending(a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  }

	  function number(x) {
	    return x === null ? NaN : +x;
	  }

	  function variance(array, f) {
	    var n = array.length,
	        m = 0,
	        a,
	        d,
	        s = 0,
	        i = -1,
	        j = 0;

	    if (f == null) {
	      while (++i < n) {
	        if (!isNaN(a = number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    else {
	      while (++i < n) {
	        if (!isNaN(a = number(f(array[i], i, array)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    if (j > 1) return s / (j - 1);
	  }

	  function deviation(array, f) {
	    var v = variance(array, f);
	    return v ? Math.sqrt(v) : v;
	  }

	  function extent(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b,
	        c;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
	      while (++i < n) if ((b = array[i]) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }

	    return [a, c];
	  }

	  var array = Array.prototype;

	  var slice = array.slice;
	  var map = array.map;

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function identity(x) {
	    return x;
	  }

	  function range(start, stop, step) {
	    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	    var i = -1,
	        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	        range = new Array(n);

	    while (++i < n) {
	      range[i] = start + i * step;
	    }

	    return range;
	  }

	  var e10 = Math.sqrt(50);
	  var e5 = Math.sqrt(10);
	  var e2 = Math.sqrt(2);
	  function ticks(start, stop, count) {
	    var step = tickStep(start, stop, count);
	    return range(
	      Math.ceil(start / step) * step,
	      Math.floor(stop / step) * step + step / 2, // inclusive
	      step
	    );
	  }

	  function tickStep(start, stop, count) {
	    var step0 = Math.abs(stop - start) / Math.max(0, count),
	        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	        error = step0 / step1;
	    if (error >= e10) step1 *= 10;
	    else if (error >= e5) step1 *= 5;
	    else if (error >= e2) step1 *= 2;
	    return stop < start ? -step1 : step1;
	  }

	  function sturges(values) {
	    return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
	  }

	  function histogram() {
	    var value = identity,
	        domain = extent,
	        threshold = sturges;

	    function histogram(data) {
	      var i,
	          n = data.length,
	          x,
	          values = new Array(n);

	      for (i = 0; i < n; ++i) {
	        values[i] = value(data[i], i, data);
	      }

	      var xz = domain(values),
	          x0 = xz[0],
	          x1 = xz[1],
	          tz = threshold(values, x0, x1);

	      // Convert number of thresholds into uniform thresholds.
	      if (!Array.isArray(tz)) tz = ticks(x0, x1, tz);

	      // Remove any thresholds outside the domain.
	      var m = tz.length;
	      while (tz[0] <= x0) tz.shift(), --m;
	      while (tz[m - 1] >= x1) tz.pop(), --m;

	      var bins = new Array(m + 1),
	          bin;

	      // Initialize bins.
	      for (i = 0; i <= m; ++i) {
	        bin = bins[i] = [];
	        bin.x0 = i > 0 ? tz[i - 1] : x0;
	        bin.x1 = i < m ? tz[i] : x1;
	      }

	      // Assign data to bins by value, ignoring any outside the domain.
	      for (i = 0; i < n; ++i) {
	        x = values[i];
	        if (x0 <= x && x <= x1) {
	          bins[bisectRight(tz, x, 0, m)].push(data[i]);
	        }
	      }

	      return bins;
	    }

	    histogram.value = function(_) {
	      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
	    };

	    histogram.domain = function(_) {
	      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
	    };

	    histogram.thresholds = function(_) {
	      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
	    };

	    return histogram;
	  }

	  function quantile(array, p, f) {
	    if (f == null) f = number;
	    if (!(n = array.length)) return;
	    if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
	    if (p >= 1) return +f(array[n - 1], n - 1, array);
	    var n,
	        h = (n - 1) * p,
	        i = Math.floor(h),
	        a = +f(array[i], i, array),
	        b = +f(array[i + 1], i + 1, array);
	    return a + (b - a) * (h - i);
	  }

	  function freedmanDiaconis(values, min, max) {
	    values = map.call(values, number).sort(ascending);
	    return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
	  }

	  function scott(values, min, max) {
	    return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
	  }

	  function max(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
	    }

	    return a;
	  }

	  function mean(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1,
	        j = n;

	    if (f == null) {
	      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
	    }

	    else {
	      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) s += a; else --j;
	    }

	    if (j) return s / j;
	  }

	  function median(array, f) {
	    var numbers = [],
	        n = array.length,
	        a,
	        i = -1;

	    if (f == null) {
	      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
	    }

	    else {
	      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
	    }

	    return quantile(numbers.sort(ascending), 0.5);
	  }

	  function merge(arrays) {
	    var n = arrays.length,
	        m,
	        i = -1,
	        j = 0,
	        merged,
	        array;

	    while (++i < n) j += arrays[i].length;
	    merged = new Array(j);

	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }

	    return merged;
	  }

	  function min(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
	    }

	    return a;
	  }

	  function pairs(array) {
	    var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) pairs[i] = [p, p = array[++i]];
	    return pairs;
	  }

	  function permute(array, indexes) {
	    var i = indexes.length, permutes = new Array(i);
	    while (i--) permutes[i] = array[indexes[i]];
	    return permutes;
	  }

	  function scan(array, compare) {
	    if (!(n = array.length)) return;
	    var i = 0,
	        n,
	        j = 0,
	        xi,
	        xj = array[j];

	    if (!compare) compare = ascending;

	    while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

	    if (compare(xj, xj) === 0) return j;
	  }

	  function shuffle(array, i0, i1) {
	    var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
	        t,
	        i;

	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0];
	      array[m + i0] = array[i + i0];
	      array[i + i0] = t;
	    }

	    return array;
	  }

	  function sum(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1;

	    if (f == null) {
	      while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
	    }

	    else {
	      while (++i < n) if (a = +f(array[i], i, array)) s += a;
	    }

	    return s;
	  }

	  function transpose(matrix) {
	    if (!(n = matrix.length)) return [];
	    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
	      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
	        row[j] = matrix[j][i];
	      }
	    }
	    return transpose;
	  }

	  function length(d) {
	    return d.length;
	  }

	  function zip() {
	    return transpose(arguments);
	  }

	  exports.bisect = bisectRight;
	  exports.bisectRight = bisectRight;
	  exports.bisectLeft = bisectLeft;
	  exports.ascending = ascending;
	  exports.bisector = bisector;
	  exports.descending = descending;
	  exports.deviation = deviation;
	  exports.extent = extent;
	  exports.histogram = histogram;
	  exports.thresholdFreedmanDiaconis = freedmanDiaconis;
	  exports.thresholdScott = scott;
	  exports.thresholdSturges = sturges;
	  exports.max = max;
	  exports.mean = mean;
	  exports.median = median;
	  exports.merge = merge;
	  exports.min = min;
	  exports.pairs = pairs;
	  exports.permute = permute;
	  exports.quantile = quantile;
	  exports.range = range;
	  exports.scan = scan;
	  exports.shuffle = shuffle;
	  exports.sum = sum;
	  exports.ticks = ticks;
	  exports.tickStep = tickStep;
	  exports.transpose = transpose;
	  exports.variance = variance;
	  exports.zip = zip;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-selection/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var xhtml = "http://www.w3.org/1999/xhtml";

	  var namespaces = {
	    svg: "http://www.w3.org/2000/svg",
	    xhtml: xhtml,
	    xlink: "http://www.w3.org/1999/xlink",
	    xml: "http://www.w3.org/XML/1998/namespace",
	    xmlns: "http://www.w3.org/2000/xmlns/"
	  };

	  function namespace(name) {
	    var prefix = name += "", i = prefix.indexOf(":");
	    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	  }

	  function creatorInherit(name) {
	    return function() {
	      var document = this.ownerDocument,
	          uri = this.namespaceURI;
	      return uri === xhtml && document.documentElement.namespaceURI === xhtml
	          ? document.createElement(name)
	          : document.createElementNS(uri, name);
	    };
	  }

	  function creatorFixed(fullname) {
	    return function() {
	      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	    };
	  }

	  function creator(name) {
	    var fullname = namespace(name);
	    return (fullname.local
	        ? creatorFixed
	        : creatorInherit)(fullname);
	  }

	  var nextId = 0;

	  function local() {
	    return new Local;
	  }

	  function Local() {
	    this._ = "@" + (++nextId).toString(36);
	  }

	  Local.prototype = local.prototype = {
	    constructor: Local,
	    get: function(node) {
	      var id = this._;
	      while (!(id in node)) if (!(node = node.parentNode)) return;
	      return node[id];
	    },
	    set: function(node, value) {
	      return node[this._] = value;
	    },
	    remove: function(node) {
	      return this._ in node && delete node[this._];
	    },
	    toString: function() {
	      return this._;
	    }
	  };

	  var matcher = function(selector) {
	    return function() {
	      return this.matches(selector);
	    };
	  };

	  if (typeof document !== "undefined") {
	    var element = document.documentElement;
	    if (!element.matches) {
	      var vendorMatches = element.webkitMatchesSelector
	          || element.msMatchesSelector
	          || element.mozMatchesSelector
	          || element.oMatchesSelector;
	      matcher = function(selector) {
	        return function() {
	          return vendorMatches.call(this, selector);
	        };
	      };
	    }
	  }

	  var matcher$1 = matcher;

	  var filterEvents = {};

	  exports.event = null;

	  if (typeof document !== "undefined") {
	    var element$1 = document.documentElement;
	    if (!("onmouseenter" in element$1)) {
	      filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	    }
	  }

	  function filterContextListener(listener, index, group) {
	    listener = contextListener(listener, index, group);
	    return function(event) {
	      var related = event.relatedTarget;
	      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	        listener.call(this, event);
	      }
	    };
	  }

	  function contextListener(listener, index, group) {
	    return function(event1) {
	      var event0 = exports.event; // Events can be reentrant (e.g., focus).
	      exports.event = event1;
	      try {
	        listener.call(this, this.__data__, index, group);
	      } finally {
	        exports.event = event0;
	      }
	    };
	  }

	  function parseTypenames(typenames) {
	    return typenames.trim().split(/^|\s+/).map(function(t) {
	      var name = "", i = t.indexOf(".");
	      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	      return {type: t, name: name};
	    });
	  }

	  function onRemove(typename) {
	    return function() {
	      var on = this.__on;
	      if (!on) return;
	      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	          this.removeEventListener(o.type, o.listener, o.capture);
	        } else {
	          on[++i] = o;
	        }
	      }
	      if (++i) on.length = i;
	      else delete this.__on;
	    };
	  }

	  function onAdd(typename, value, capture) {
	    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	    return function(d, i, group) {
	      var on = this.__on, o, listener = wrap(value, i, group);
	      if (on) for (var j = 0, m = on.length; j < m; ++j) {
	        if ((o = on[j]).type === typename.type && o.name === typename.name) {
	          this.removeEventListener(o.type, o.listener, o.capture);
	          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	          o.value = value;
	          return;
	        }
	      }
	      this.addEventListener(typename.type, listener, capture);
	      o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	      if (!on) this.__on = [o];
	      else on.push(o);
	    };
	  }

	  function selection_on(typename, value, capture) {
	    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

	    if (arguments.length < 2) {
	      var on = this.node().__on;
	      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	        for (i = 0, o = on[j]; i < n; ++i) {
	          if ((t = typenames[i]).type === o.type && t.name === o.name) {
	            return o.value;
	          }
	        }
	      }
	      return;
	    }

	    on = value ? onAdd : onRemove;
	    if (capture == null) capture = false;
	    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	    return this;
	  }

	  function customEvent(event1, listener, that, args) {
	    var event0 = exports.event;
	    event1.sourceEvent = exports.event;
	    exports.event = event1;
	    try {
	      return listener.apply(that, args);
	    } finally {
	      exports.event = event0;
	    }
	  }

	  function sourceEvent() {
	    var current = exports.event, source;
	    while (source = current.sourceEvent) current = source;
	    return current;
	  }

	  function point(node, event) {
	    var svg = node.ownerSVGElement || node;

	    if (svg.createSVGPoint) {
	      var point = svg.createSVGPoint();
	      point.x = event.clientX, point.y = event.clientY;
	      point = point.matrixTransform(node.getScreenCTM().inverse());
	      return [point.x, point.y];
	    }

	    var rect = node.getBoundingClientRect();
	    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	  }

	  function mouse(node) {
	    var event = sourceEvent();
	    if (event.changedTouches) event = event.changedTouches[0];
	    return point(node, event);
	  }

	  function none() {}

	  function selector(selector) {
	    return selector == null ? none : function() {
	      return this.querySelector(selector);
	    };
	  }

	  function selection_select(select) {
	    if (typeof select !== "function") select = selector(select);

	    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	          if ("__data__" in node) subnode.__data__ = node.__data__;
	          subgroup[i] = subnode;
	        }
	      }
	    }

	    return new Selection(subgroups, this._parents);
	  }

	  function empty() {
	    return [];
	  }

	  function selectorAll(selector) {
	    return selector == null ? empty : function() {
	      return this.querySelectorAll(selector);
	    };
	  }

	  function selection_selectAll(select) {
	    if (typeof select !== "function") select = selectorAll(select);

	    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          subgroups.push(select.call(node, node.__data__, i, group));
	          parents.push(node);
	        }
	      }
	    }

	    return new Selection(subgroups, parents);
	  }

	  function selection_filter(match) {
	    if (typeof match !== "function") match = matcher$1(match);

	    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	          subgroup.push(node);
	        }
	      }
	    }

	    return new Selection(subgroups, this._parents);
	  }

	  function sparse(update) {
	    return new Array(update.length);
	  }

	  function selection_enter() {
	    return new Selection(this._enter || this._groups.map(sparse), this._parents);
	  }

	  function EnterNode(parent, datum) {
	    this.ownerDocument = parent.ownerDocument;
	    this.namespaceURI = parent.namespaceURI;
	    this._next = null;
	    this._parent = parent;
	    this.__data__ = datum;
	  }

	  EnterNode.prototype = {
	    constructor: EnterNode,
	    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	    querySelector: function(selector) { return this._parent.querySelector(selector); },
	    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	  };

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  var keyPrefix = "$"; // Protect against keys like “__proto__”.

	  function bindIndex(parent, group, enter, update, exit, data) {
	    var i = 0,
	        node,
	        groupLength = group.length,
	        dataLength = data.length;

	    // Put any non-null nodes that fit into update.
	    // Put any null nodes into enter.
	    // Put any remaining data into enter.
	    for (; i < dataLength; ++i) {
	      if (node = group[i]) {
	        node.__data__ = data[i];
	        update[i] = node;
	      } else {
	        enter[i] = new EnterNode(parent, data[i]);
	      }
	    }

	    // Put any non-null nodes that don’t fit into exit.
	    for (; i < groupLength; ++i) {
	      if (node = group[i]) {
	        exit[i] = node;
	      }
	    }
	  }

	  function bindKey(parent, group, enter, update, exit, data, key) {
	    var i,
	        node,
	        nodeByKeyValue = {},
	        groupLength = group.length,
	        dataLength = data.length,
	        keyValues = new Array(groupLength),
	        keyValue;

	    // Compute the key for each node.
	    // If multiple nodes have the same key, the duplicates are added to exit.
	    for (i = 0; i < groupLength; ++i) {
	      if (node = group[i]) {
	        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	        if (keyValue in nodeByKeyValue) {
	          exit[i] = node;
	        } else {
	          nodeByKeyValue[keyValue] = node;
	        }
	      }
	    }

	    // Compute the key for each datum.
	    // If there a node associated with this key, join and add it to update.
	    // If there is not (or the key is a duplicate), add it to enter.
	    for (i = 0; i < dataLength; ++i) {
	      keyValue = keyPrefix + key.call(parent, data[i], i, data);
	      if (node = nodeByKeyValue[keyValue]) {
	        update[i] = node;
	        node.__data__ = data[i];
	        nodeByKeyValue[keyValue] = null;
	      } else {
	        enter[i] = new EnterNode(parent, data[i]);
	      }
	    }

	    // Add any remaining nodes that were not bound to data to exit.
	    for (i = 0; i < groupLength; ++i) {
	      if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	        exit[i] = node;
	      }
	    }
	  }

	  function selection_data(value, key) {
	    if (!value) {
	      data = new Array(this.size()), j = -1;
	      this.each(function(d) { data[++j] = d; });
	      return data;
	    }

	    var bind = key ? bindKey : bindIndex,
	        parents = this._parents,
	        groups = this._groups;

	    if (typeof value !== "function") value = constant(value);

	    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	      var parent = parents[j],
	          group = groups[j],
	          groupLength = group.length,
	          data = value.call(parent, parent && parent.__data__, j, parents),
	          dataLength = data.length,
	          enterGroup = enter[j] = new Array(dataLength),
	          updateGroup = update[j] = new Array(dataLength),
	          exitGroup = exit[j] = new Array(groupLength);

	      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	      // Now connect the enter nodes to their following update node, such that
	      // appendChild can insert the materialized enter node before this node,
	      // rather than at the end of the parent node.
	      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	        if (previous = enterGroup[i0]) {
	          if (i0 >= i1) i1 = i0 + 1;
	          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	          previous._next = next || null;
	        }
	      }
	    }

	    update = new Selection(update, parents);
	    update._enter = enter;
	    update._exit = exit;
	    return update;
	  }

	  function selection_exit() {
	    return new Selection(this._exit || this._groups.map(sparse), this._parents);
	  }

	  function selection_merge(selection) {

	    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	        if (node = group0[i] || group1[i]) {
	          merge[i] = node;
	        }
	      }
	    }

	    for (; j < m0; ++j) {
	      merges[j] = groups0[j];
	    }

	    return new Selection(merges, this._parents);
	  }

	  function selection_order() {

	    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	        if (node = group[i]) {
	          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	          next = node;
	        }
	      }
	    }

	    return this;
	  }

	  function selection_sort(compare) {
	    if (!compare) compare = ascending;

	    function compareNode(a, b) {
	      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	    }

	    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          sortgroup[i] = node;
	        }
	      }
	      sortgroup.sort(compareNode);
	    }

	    return new Selection(sortgroups, this._parents).order();
	  }

	  function ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }

	  function selection_call() {
	    var callback = arguments[0];
	    arguments[0] = this;
	    callback.apply(null, arguments);
	    return this;
	  }

	  function selection_nodes() {
	    var nodes = new Array(this.size()), i = -1;
	    this.each(function() { nodes[++i] = this; });
	    return nodes;
	  }

	  function selection_node() {

	    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	        var node = group[i];
	        if (node) return node;
	      }
	    }

	    return null;
	  }

	  function selection_size() {
	    var size = 0;
	    this.each(function() { ++size; });
	    return size;
	  }

	  function selection_empty() {
	    return !this.node();
	  }

	  function selection_each(callback) {

	    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	        if (node = group[i]) callback.call(node, node.__data__, i, group);
	      }
	    }

	    return this;
	  }

	  function attrRemove(name) {
	    return function() {
	      this.removeAttribute(name);
	    };
	  }

	  function attrRemoveNS(fullname) {
	    return function() {
	      this.removeAttributeNS(fullname.space, fullname.local);
	    };
	  }

	  function attrConstant(name, value) {
	    return function() {
	      this.setAttribute(name, value);
	    };
	  }

	  function attrConstantNS(fullname, value) {
	    return function() {
	      this.setAttributeNS(fullname.space, fullname.local, value);
	    };
	  }

	  function attrFunction(name, value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) this.removeAttribute(name);
	      else this.setAttribute(name, v);
	    };
	  }

	  function attrFunctionNS(fullname, value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	      else this.setAttributeNS(fullname.space, fullname.local, v);
	    };
	  }

	  function selection_attr(name, value) {
	    var fullname = namespace(name);

	    if (arguments.length < 2) {
	      var node = this.node();
	      return fullname.local
	          ? node.getAttributeNS(fullname.space, fullname.local)
	          : node.getAttribute(fullname);
	    }

	    return this.each((value == null
	        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	        ? (fullname.local ? attrFunctionNS : attrFunction)
	        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	  }

	  function defaultView(node) {
	    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	        || (node.document && node) // node is a Window
	        || node.defaultView; // node is a Document
	  }

	  function styleRemove(name) {
	    return function() {
	      this.style.removeProperty(name);
	    };
	  }

	  function styleConstant(name, value, priority) {
	    return function() {
	      this.style.setProperty(name, value, priority);
	    };
	  }

	  function styleFunction(name, value, priority) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) this.style.removeProperty(name);
	      else this.style.setProperty(name, v, priority);
	    };
	  }

	  function selection_style(name, value, priority) {
	    var node;
	    return arguments.length > 1
	        ? this.each((value == null
	              ? styleRemove : typeof value === "function"
	              ? styleFunction
	              : styleConstant)(name, value, priority == null ? "" : priority))
	        : defaultView(node = this.node())
	            .getComputedStyle(node, null)
	            .getPropertyValue(name);
	  }

	  function propertyRemove(name) {
	    return function() {
	      delete this[name];
	    };
	  }

	  function propertyConstant(name, value) {
	    return function() {
	      this[name] = value;
	    };
	  }

	  function propertyFunction(name, value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      if (v == null) delete this[name];
	      else this[name] = v;
	    };
	  }

	  function selection_property(name, value) {
	    return arguments.length > 1
	        ? this.each((value == null
	            ? propertyRemove : typeof value === "function"
	            ? propertyFunction
	            : propertyConstant)(name, value))
	        : this.node()[name];
	  }

	  function classArray(string) {
	    return string.trim().split(/^|\s+/);
	  }

	  function classList(node) {
	    return node.classList || new ClassList(node);
	  }

	  function ClassList(node) {
	    this._node = node;
	    this._names = classArray(node.getAttribute("class") || "");
	  }

	  ClassList.prototype = {
	    add: function(name) {
	      var i = this._names.indexOf(name);
	      if (i < 0) {
	        this._names.push(name);
	        this._node.setAttribute("class", this._names.join(" "));
	      }
	    },
	    remove: function(name) {
	      var i = this._names.indexOf(name);
	      if (i >= 0) {
	        this._names.splice(i, 1);
	        this._node.setAttribute("class", this._names.join(" "));
	      }
	    },
	    contains: function(name) {
	      return this._names.indexOf(name) >= 0;
	    }
	  };

	  function classedAdd(node, names) {
	    var list = classList(node), i = -1, n = names.length;
	    while (++i < n) list.add(names[i]);
	  }

	  function classedRemove(node, names) {
	    var list = classList(node), i = -1, n = names.length;
	    while (++i < n) list.remove(names[i]);
	  }

	  function classedTrue(names) {
	    return function() {
	      classedAdd(this, names);
	    };
	  }

	  function classedFalse(names) {
	    return function() {
	      classedRemove(this, names);
	    };
	  }

	  function classedFunction(names, value) {
	    return function() {
	      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	    };
	  }

	  function selection_classed(name, value) {
	    var names = classArray(name + "");

	    if (arguments.length < 2) {
	      var list = classList(this.node()), i = -1, n = names.length;
	      while (++i < n) if (!list.contains(names[i])) return false;
	      return true;
	    }

	    return this.each((typeof value === "function"
	        ? classedFunction : value
	        ? classedTrue
	        : classedFalse)(names, value));
	  }

	  function textRemove() {
	    this.textContent = "";
	  }

	  function textConstant(value) {
	    return function() {
	      this.textContent = value;
	    };
	  }

	  function textFunction(value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      this.textContent = v == null ? "" : v;
	    };
	  }

	  function selection_text(value) {
	    return arguments.length
	        ? this.each(value == null
	            ? textRemove : (typeof value === "function"
	            ? textFunction
	            : textConstant)(value))
	        : this.node().textContent;
	  }

	  function htmlRemove() {
	    this.innerHTML = "";
	  }

	  function htmlConstant(value) {
	    return function() {
	      this.innerHTML = value;
	    };
	  }

	  function htmlFunction(value) {
	    return function() {
	      var v = value.apply(this, arguments);
	      this.innerHTML = v == null ? "" : v;
	    };
	  }

	  function selection_html(value) {
	    return arguments.length
	        ? this.each(value == null
	            ? htmlRemove : (typeof value === "function"
	            ? htmlFunction
	            : htmlConstant)(value))
	        : this.node().innerHTML;
	  }

	  function raise() {
	    if (this.nextSibling) this.parentNode.appendChild(this);
	  }

	  function selection_raise() {
	    return this.each(raise);
	  }

	  function lower() {
	    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	  }

	  function selection_lower() {
	    return this.each(lower);
	  }

	  function selection_append(name) {
	    var create = typeof name === "function" ? name : creator(name);
	    return this.select(function() {
	      return this.appendChild(create.apply(this, arguments));
	    });
	  }

	  function constantNull() {
	    return null;
	  }

	  function selection_insert(name, before) {
	    var create = typeof name === "function" ? name : creator(name),
	        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	    return this.select(function() {
	      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	    });
	  }

	  function remove() {
	    var parent = this.parentNode;
	    if (parent) parent.removeChild(this);
	  }

	  function selection_remove() {
	    return this.each(remove);
	  }

	  function selection_datum(value) {
	    return arguments.length
	        ? this.property("__data__", value)
	        : this.node().__data__;
	  }

	  function dispatchEvent(node, type, params) {
	    var window = defaultView(node),
	        event = window.CustomEvent;

	    if (event) {
	      event = new event(type, params);
	    } else {
	      event = window.document.createEvent("Event");
	      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	      else event.initEvent(type, false, false);
	    }

	    node.dispatchEvent(event);
	  }

	  function dispatchConstant(type, params) {
	    return function() {
	      return dispatchEvent(this, type, params);
	    };
	  }

	  function dispatchFunction(type, params) {
	    return function() {
	      return dispatchEvent(this, type, params.apply(this, arguments));
	    };
	  }

	  function selection_dispatch(type, params) {
	    return this.each((typeof params === "function"
	        ? dispatchFunction
	        : dispatchConstant)(type, params));
	  }

	  var root = [null];

	  function Selection(groups, parents) {
	    this._groups = groups;
	    this._parents = parents;
	  }

	  function selection() {
	    return new Selection([[document.documentElement]], root);
	  }

	  Selection.prototype = selection.prototype = {
	    constructor: Selection,
	    select: selection_select,
	    selectAll: selection_selectAll,
	    filter: selection_filter,
	    data: selection_data,
	    enter: selection_enter,
	    exit: selection_exit,
	    merge: selection_merge,
	    order: selection_order,
	    sort: selection_sort,
	    call: selection_call,
	    nodes: selection_nodes,
	    node: selection_node,
	    size: selection_size,
	    empty: selection_empty,
	    each: selection_each,
	    attr: selection_attr,
	    style: selection_style,
	    property: selection_property,
	    classed: selection_classed,
	    text: selection_text,
	    html: selection_html,
	    raise: selection_raise,
	    lower: selection_lower,
	    append: selection_append,
	    insert: selection_insert,
	    remove: selection_remove,
	    datum: selection_datum,
	    on: selection_on,
	    dispatch: selection_dispatch
	  };

	  function select(selector) {
	    return typeof selector === "string"
	        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	        : new Selection([[selector]], root);
	  }

	  function selectAll(selector) {
	    return typeof selector === "string"
	        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
	        : new Selection([selector == null ? [] : selector], root);
	  }

	  function touch(node, touches, identifier) {
	    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

	    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
	      if ((touch = touches[i]).identifier === identifier) {
	        return point(node, touch);
	      }
	    }

	    return null;
	  }

	  function touches(node, touches) {
	    if (touches == null) touches = sourceEvent().touches;

	    for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
	      points[i] = point(node, touches[i]);
	    }

	    return points;
	  }

	  exports.creator = creator;
	  exports.local = local;
	  exports.matcher = matcher$1;
	  exports.mouse = mouse;
	  exports.namespace = namespace;
	  exports.namespaces = namespaces;
	  exports.select = select;
	  exports.selectAll = selectAll;
	  exports.selection = selection;
	  exports.selector = selector;
	  exports.selectorAll = selectorAll;
	  exports.touch = touch;
	  exports.touches = touches;
	  exports.window = defaultView;
	  exports.customEvent = customEvent;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-transition/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(4), __webpack_require__(6), __webpack_require__(7), __webpack_require__(8), __webpack_require__(9), __webpack_require__(10)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-dispatch', 'd3-timer', 'd3-interpolate', 'd3-color', 'd3-ease'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
	}(this, function (exports,d3Selection,d3Dispatch,d3Timer,d3Interpolate,d3Color,d3Ease) { 'use strict';

	  var emptyOn = d3Dispatch.dispatch("start", "end", "interrupt");
	  var emptyTween = [];

	  var CREATED = 0;
	  var SCHEDULED = 1;
	  var STARTING = 2;
	  var STARTED = 3;
	  var ENDING = 4;
	  var ENDED = 5;

	  function schedule(node, name, id, index, group, timing) {
	    var schedules = node.__transition;
	    if (!schedules) node.__transition = {};
	    else if (id in schedules) return;
	    create(node, id, {
	      name: name,
	      index: index, // For context during callback.
	      group: group, // For context during callback.
	      on: emptyOn,
	      tween: emptyTween,
	      time: timing.time,
	      delay: timing.delay,
	      duration: timing.duration,
	      ease: timing.ease,
	      timer: null,
	      state: CREATED
	    });
	  }

	  function init(node, id) {
	    var schedule = node.__transition;
	    if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
	    return schedule;
	  }

	  function set(node, id) {
	    var schedule = node.__transition;
	    if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
	    return schedule;
	  }

	  function get(node, id) {
	    var schedule = node.__transition;
	    if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
	    return schedule;
	  }

	  function create(node, id, self) {
	    var schedules = node.__transition,
	        tween;

	    // Initialize the self timer when the transition is created.
	    // Note the actual delay is not known until the first callback!
	    schedules[id] = self;
	    self.timer = d3Timer.timer(schedule, 0, self.time);

	    // If the delay is greater than this first sleep, sleep some more;
	    // otherwise, start immediately.
	    function schedule(elapsed) {
	      self.state = SCHEDULED;
	      if (self.delay <= elapsed) start(elapsed - self.delay);
	      else self.timer.restart(start, self.delay, self.time);
	    }

	    function start(elapsed) {
	      var i, j, n, o;

	      for (i in schedules) {
	        o = schedules[i];
	        if (o.name !== self.name) continue;

	        // Interrupt the active transition, if any.
	        // Dispatch the interrupt event.
	        if (o.state === STARTED) {
	          o.state = ENDED;
	          o.timer.stop();
	          o.on.call("interrupt", node, node.__data__, o.index, o.group);
	          delete schedules[i];
	        }

	        // Cancel any pre-empted transitions. No interrupt event is dispatched
	        // because the cancelled transitions never started. Note that this also
	        // removes this transition from the pending list!
	        else if (+i < id) {
	          o.state = ENDED;
	          o.timer.stop();
	          delete schedules[i];
	        }
	      }

	      // Defer the first tick to end of the current frame; see mbostock/d3#1576.
	      // Note the transition may be canceled after start and before the first tick!
	      // Note this must be scheduled before the start event; see d3/d3-transition#16!
	      // Assuming this is successful, subsequent callbacks go straight to tick.
	      d3Timer.timeout(function() {
	        if (self.state === STARTED) {
	          self.timer.restart(tick, self.delay, self.time);
	          tick(elapsed);
	        }
	      });

	      // Dispatch the start event.
	      // Note this must be done before the tween are initialized.
	      self.state = STARTING;
	      self.on.call("start", node, node.__data__, self.index, self.group);
	      if (self.state !== STARTING) return; // interrupted
	      self.state = STARTED;

	      // Initialize the tween, deleting null tween.
	      tween = new Array(n = self.tween.length);
	      for (i = 0, j = -1; i < n; ++i) {
	        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
	          tween[++j] = o;
	        }
	      }
	      tween.length = j + 1;
	    }

	    function tick(elapsed) {
	      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.state = ENDING, 1),
	          i = -1,
	          n = tween.length;

	      while (++i < n) {
	        tween[i].call(null, t);
	      }

	      // Dispatch the end event.
	      if (self.state === ENDING) {
	        self.state = ENDED;
	        self.timer.stop();
	        self.on.call("end", node, node.__data__, self.index, self.group);
	        for (i in schedules) if (+i !== id) return void delete schedules[id];
	        delete node.__transition;
	      }
	    }
	  }

	  function interrupt(node, name) {
	    var schedules = node.__transition,
	        schedule,
	        active,
	        empty = true,
	        i;

	    if (!schedules) return;

	    name = name == null ? null : name + "";

	    for (i in schedules) {
	      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
	      active = schedule.state === STARTED;
	      schedule.state = ENDED;
	      schedule.timer.stop();
	      if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
	      delete schedules[i];
	    }

	    if (empty) delete node.__transition;
	  }

	  function selection_interrupt(name) {
	    return this.each(function() {
	      interrupt(this, name);
	    });
	  }

	  function tweenRemove(id, name) {
	    var tween0, tween1;
	    return function() {
	      var schedule = set(this, id),
	          tween = schedule.tween;

	      // If this node shared tween with the previous node,
	      // just assign the updated shared tween and we’re done!
	      // Otherwise, copy-on-write.
	      if (tween !== tween0) {
	        tween1 = tween0 = tween;
	        for (var i = 0, n = tween1.length; i < n; ++i) {
	          if (tween1[i].name === name) {
	            tween1 = tween1.slice();
	            tween1.splice(i, 1);
	            break;
	          }
	        }
	      }

	      schedule.tween = tween1;
	    };
	  }

	  function tweenFunction(id, name, value) {
	    var tween0, tween1;
	    if (typeof value !== "function") throw new Error;
	    return function() {
	      var schedule = set(this, id),
	          tween = schedule.tween;

	      // If this node shared tween with the previous node,
	      // just assign the updated shared tween and we’re done!
	      // Otherwise, copy-on-write.
	      if (tween !== tween0) {
	        tween1 = (tween0 = tween).slice();
	        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
	          if (tween1[i].name === name) {
	            tween1[i] = t;
	            break;
	          }
	        }
	        if (i === n) tween1.push(t);
	      }

	      schedule.tween = tween1;
	    };
	  }

	  function transition_tween(name, value) {
	    var id = this._id;

	    name += "";

	    if (arguments.length < 2) {
	      var tween = get(this.node(), id).tween;
	      for (var i = 0, n = tween.length, t; i < n; ++i) {
	        if ((t = tween[i]).name === name) {
	          return t.value;
	        }
	      }
	      return null;
	    }

	    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
	  }

	  function tweenValue(transition, name, value) {
	    var id = transition._id;

	    transition.each(function() {
	      var schedule = set(this, id);
	      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
	    });

	    return function(node) {
	      return get(node, id).value[name];
	    };
	  }

	  function interpolate(a, b) {
	    var c;
	    return (typeof b === "number" ? d3Interpolate.interpolateNumber
	        : b instanceof d3Color.color ? d3Interpolate.interpolateRgb
	        : (c = d3Color.color(b)) ? (b = c, d3Interpolate.interpolateRgb)
	        : d3Interpolate.interpolateString)(a, b);
	  }

	  function attrRemove(name) {
	    return function() {
	      this.removeAttribute(name);
	    };
	  }

	  function attrRemoveNS(fullname) {
	    return function() {
	      this.removeAttributeNS(fullname.space, fullname.local);
	    };
	  }

	  function attrConstant(name, interpolate, value1) {
	    var value00,
	        interpolate0;
	    return function() {
	      var value0 = this.getAttribute(name);
	      return value0 === value1 ? null
	          : value0 === value00 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value1);
	    };
	  }

	  function attrConstantNS(fullname, interpolate, value1) {
	    var value00,
	        interpolate0;
	    return function() {
	      var value0 = this.getAttributeNS(fullname.space, fullname.local);
	      return value0 === value1 ? null
	          : value0 === value00 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value1);
	    };
	  }

	  function attrFunction(name, interpolate, value) {
	    var value00,
	        value10,
	        interpolate0;
	    return function() {
	      var value0, value1 = value(this);
	      if (value1 == null) return void this.removeAttribute(name);
	      value0 = this.getAttribute(name);
	      return value0 === value1 ? null
	          : value0 === value00 && value1 === value10 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value10 = value1);
	    };
	  }

	  function attrFunctionNS(fullname, interpolate, value) {
	    var value00,
	        value10,
	        interpolate0;
	    return function() {
	      var value0, value1 = value(this);
	      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
	      value0 = this.getAttributeNS(fullname.space, fullname.local);
	      return value0 === value1 ? null
	          : value0 === value00 && value1 === value10 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value10 = value1);
	    };
	  }

	  function transition_attr(name, value) {
	    var fullname = d3Selection.namespace(name), i = fullname === "transform" ? d3Interpolate.interpolateTransformSvg : interpolate;
	    return this.attrTween(name, typeof value === "function"
	        ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
	        : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
	        : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
	  }

	  function attrTweenNS(fullname, value) {
	    function tween() {
	      var node = this, i = value.apply(node, arguments);
	      return i && function(t) {
	        node.setAttributeNS(fullname.space, fullname.local, i(t));
	      };
	    }
	    tween._value = value;
	    return tween;
	  }

	  function attrTween(name, value) {
	    function tween() {
	      var node = this, i = value.apply(node, arguments);
	      return i && function(t) {
	        node.setAttribute(name, i(t));
	      };
	    }
	    tween._value = value;
	    return tween;
	  }

	  function transition_attrTween(name, value) {
	    var key = "attr." + name;
	    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	    if (value == null) return this.tween(key, null);
	    if (typeof value !== "function") throw new Error;
	    var fullname = d3Selection.namespace(name);
	    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
	  }

	  function delayFunction(id, value) {
	    return function() {
	      init(this, id).delay = +value.apply(this, arguments);
	    };
	  }

	  function delayConstant(id, value) {
	    return value = +value, function() {
	      init(this, id).delay = value;
	    };
	  }

	  function transition_delay(value) {
	    var id = this._id;

	    return arguments.length
	        ? this.each((typeof value === "function"
	            ? delayFunction
	            : delayConstant)(id, value))
	        : get(this.node(), id).delay;
	  }

	  function durationFunction(id, value) {
	    return function() {
	      set(this, id).duration = +value.apply(this, arguments);
	    };
	  }

	  function durationConstant(id, value) {
	    return value = +value, function() {
	      set(this, id).duration = value;
	    };
	  }

	  function transition_duration(value) {
	    var id = this._id;

	    return arguments.length
	        ? this.each((typeof value === "function"
	            ? durationFunction
	            : durationConstant)(id, value))
	        : get(this.node(), id).duration;
	  }

	  function easeConstant(id, value) {
	    if (typeof value !== "function") throw new Error;
	    return function() {
	      set(this, id).ease = value;
	    };
	  }

	  function transition_ease(value) {
	    var id = this._id;

	    return arguments.length
	        ? this.each(easeConstant(id, value))
	        : get(this.node(), id).ease;
	  }

	  function transition_filter(match) {
	    if (typeof match !== "function") match = d3Selection.matcher(match);

	    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	          subgroup.push(node);
	        }
	      }
	    }

	    return new Transition(subgroups, this._parents, this._name, this._id);
	  }

	  function transition_merge(transition) {
	    if (transition._id !== this._id) throw new Error;

	    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	        if (node = group0[i] || group1[i]) {
	          merge[i] = node;
	        }
	      }
	    }

	    for (; j < m0; ++j) {
	      merges[j] = groups0[j];
	    }

	    return new Transition(merges, this._parents, this._name, this._id);
	  }

	  function start(name) {
	    return (name + "").trim().split(/^|\s+/).every(function(t) {
	      var i = t.indexOf(".");
	      if (i >= 0) t = t.slice(0, i);
	      return !t || t === "start";
	    });
	  }

	  function onFunction(id, name, listener) {
	    var on0, on1, sit = start(name) ? init : set;
	    return function() {
	      var schedule = sit(this, id),
	          on = schedule.on;

	      // If this node shared a dispatch with the previous node,
	      // just assign the updated shared dispatch and we’re done!
	      // Otherwise, copy-on-write.
	      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

	      schedule.on = on1;
	    };
	  }

	  function transition_on(name, listener) {
	    var id = this._id;

	    return arguments.length < 2
	        ? get(this.node(), id).on.on(name)
	        : this.each(onFunction(id, name, listener));
	  }

	  function removeFunction(id) {
	    return function() {
	      var parent = this.parentNode;
	      for (var i in this.__transition) if (+i !== id) return;
	      if (parent) parent.removeChild(this);
	    };
	  }

	  function transition_remove() {
	    return this.on("end.remove", removeFunction(this._id));
	  }

	  function transition_select(select) {
	    var name = this._name,
	        id = this._id;

	    if (typeof select !== "function") select = d3Selection.selector(select);

	    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	          if ("__data__" in node) subnode.__data__ = node.__data__;
	          subgroup[i] = subnode;
	          schedule(subgroup[i], name, id, i, subgroup, get(node, id));
	        }
	      }
	    }

	    return new Transition(subgroups, this._parents, name, id);
	  }

	  function transition_selectAll(select) {
	    var name = this._name,
	        id = this._id;

	    if (typeof select !== "function") select = d3Selection.selectorAll(select);

	    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
	            if (child = children[k]) {
	              schedule(child, name, id, k, children, inherit);
	            }
	          }
	          subgroups.push(children);
	          parents.push(node);
	        }
	      }
	    }

	    return new Transition(subgroups, parents, name, id);
	  }

	  var Selection = d3Selection.selection.prototype.constructor;

	  function transition_selection() {
	    return new Selection(this._groups, this._parents);
	  }

	  function styleRemove(name, interpolate) {
	    var value00,
	        value10,
	        interpolate0;
	    return function() {
	      var style = d3Selection.window(this).getComputedStyle(this, null),
	          value0 = style.getPropertyValue(name),
	          value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
	      return value0 === value1 ? null
	          : value0 === value00 && value1 === value10 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value10 = value1);
	    };
	  }

	  function styleRemoveEnd(name) {
	    return function() {
	      this.style.removeProperty(name);
	    };
	  }

	  function styleConstant(name, interpolate, value1) {
	    var value00,
	        interpolate0;
	    return function() {
	      var value0 = d3Selection.window(this).getComputedStyle(this, null).getPropertyValue(name);
	      return value0 === value1 ? null
	          : value0 === value00 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value1);
	    };
	  }

	  function styleFunction(name, interpolate, value) {
	    var value00,
	        value10,
	        interpolate0;
	    return function() {
	      var style = d3Selection.window(this).getComputedStyle(this, null),
	          value0 = style.getPropertyValue(name),
	          value1 = value(this);
	      if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
	      return value0 === value1 ? null
	          : value0 === value00 && value1 === value10 ? interpolate0
	          : interpolate0 = interpolate(value00 = value0, value10 = value1);
	    };
	  }

	  function transition_style(name, value, priority) {
	    var i = (name += "") === "transform" ? d3Interpolate.interpolateTransformCss : interpolate;
	    return value == null ? this
	            .styleTween(name, styleRemove(name, i))
	            .on("end.style." + name, styleRemoveEnd(name))
	        : this.styleTween(name, typeof value === "function"
	            ? styleFunction(name, i, tweenValue(this, "style." + name, value))
	            : styleConstant(name, i, value), priority);
	  }

	  function styleTween(name, value, priority) {
	    function tween() {
	      var node = this, i = value.apply(node, arguments);
	      return i && function(t) {
	        node.style.setProperty(name, i(t), priority);
	      };
	    }
	    tween._value = value;
	    return tween;
	  }

	  function transition_styleTween(name, value, priority) {
	    var key = "style." + (name += "");
	    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	    if (value == null) return this.tween(key, null);
	    if (typeof value !== "function") throw new Error;
	    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
	  }

	  function textConstant(value) {
	    return function() {
	      this.textContent = value;
	    };
	  }

	  function textFunction(value) {
	    return function() {
	      var value1 = value(this);
	      this.textContent = value1 == null ? "" : value1;
	    };
	  }

	  function transition_text(value) {
	    return this.tween("text", typeof value === "function"
	        ? textFunction(tweenValue(this, "text", value))
	        : textConstant(value == null ? "" : value + ""));
	  }

	  function transition_transition() {
	    var name = this._name,
	        id0 = this._id,
	        id1 = newId();

	    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          var inherit = get(node, id0);
	          schedule(node, name, id1, i, group, {
	            time: inherit.time + inherit.delay + inherit.duration,
	            delay: 0,
	            duration: inherit.duration,
	            ease: inherit.ease
	          });
	        }
	      }
	    }

	    return new Transition(groups, this._parents, name, id1);
	  }

	  var id = 0;

	  function Transition(groups, parents, name, id) {
	    this._groups = groups;
	    this._parents = parents;
	    this._name = name;
	    this._id = id;
	  }

	  function transition(name) {
	    return d3Selection.selection().transition(name);
	  }

	  function newId() {
	    return ++id;
	  }

	  var selection_prototype = d3Selection.selection.prototype;

	  Transition.prototype = transition.prototype = {
	    constructor: Transition,
	    select: transition_select,
	    selectAll: transition_selectAll,
	    filter: transition_filter,
	    merge: transition_merge,
	    selection: transition_selection,
	    transition: transition_transition,
	    call: selection_prototype.call,
	    nodes: selection_prototype.nodes,
	    node: selection_prototype.node,
	    size: selection_prototype.size,
	    empty: selection_prototype.empty,
	    each: selection_prototype.each,
	    on: transition_on,
	    attr: transition_attr,
	    attrTween: transition_attrTween,
	    style: transition_style,
	    styleTween: transition_styleTween,
	    text: transition_text,
	    remove: transition_remove,
	    tween: transition_tween,
	    delay: transition_delay,
	    duration: transition_duration,
	    ease: transition_ease
	  };

	  var defaultTiming = {
	    time: null, // Set on use.
	    delay: 0,
	    duration: 250,
	    ease: d3Ease.easeCubicInOut
	  };

	  function inherit(node, id) {
	    var timing;
	    while (!(timing = node.__transition) || !(timing = timing[id])) {
	      if (!(node = node.parentNode)) {
	        return defaultTiming.time = d3Timer.now(), defaultTiming;
	      }
	    }
	    return timing;
	  }

	  function selection_transition(name) {
	    var id,
	        timing;

	    if (name instanceof Transition) {
	      id = name._id, name = name._name;
	    } else {
	      id = newId(), (timing = defaultTiming).time = d3Timer.now(), name = name == null ? null : name + "";
	    }

	    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	        if (node = group[i]) {
	          schedule(node, name, id, i, group, timing || inherit(node, id));
	        }
	      }
	    }

	    return new Transition(groups, this._parents, name, id);
	  }

	  d3Selection.selection.prototype.interrupt = selection_interrupt;
	  d3Selection.selection.prototype.transition = selection_transition;

	  var root = [null];

	  function active(node, name) {
	    var schedules = node.__transition,
	        schedule,
	        i;

	    if (schedules) {
	      name = name == null ? null : name + "";
	      for (i in schedules) {
	        if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
	          return new Transition([[node]], root, name, +i);
	        }
	      }
	    }

	    return null;
	  }

	  exports.transition = transition;
	  exports.active = active;
	  exports.interrupt = interrupt;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-dispatch/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var noop = {value: function() {}};

	  function dispatch() {
	    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
	      _[t] = [];
	    }
	    return new Dispatch(_);
	  }

	  function Dispatch(_) {
	    this._ = _;
	  }

	  function parseTypenames(typenames, types) {
	    return typenames.trim().split(/^|\s+/).map(function(t) {
	      var name = "", i = t.indexOf(".");
	      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	      return {type: t, name: name};
	    });
	  }

	  Dispatch.prototype = dispatch.prototype = {
	    constructor: Dispatch,
	    on: function(typename, callback) {
	      var _ = this._,
	          T = parseTypenames(typename + "", _),
	          t,
	          i = -1,
	          n = T.length;

	      // If no callback was specified, return the callback of the given type and name.
	      if (arguments.length < 2) {
	        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
	        return;
	      }

	      // If a type was specified, set the callback for the given type and name.
	      // Otherwise, if a null callback was specified, remove callbacks of the given name.
	      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	      while (++i < n) {
	        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
	        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
	      }

	      return this;
	    },
	    copy: function() {
	      var copy = {}, _ = this._;
	      for (var t in _) copy[t] = _[t].slice();
	      return new Dispatch(copy);
	    },
	    call: function(type, that) {
	      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	    },
	    apply: function(type, that, args) {
	      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	    }
	  };

	  function get(type, name) {
	    for (var i = 0, n = type.length, c; i < n; ++i) {
	      if ((c = type[i]).name === name) {
	        return c.value;
	      }
	    }
	  }

	  function set(type, name, callback) {
	    for (var i = 0, n = type.length; i < n; ++i) {
	      if (type[i].name === name) {
	        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	        break;
	      }
	    }
	    if (callback != null) type.push({name: name, value: callback});
	    return type;
	  }

	  exports.dispatch = dispatch;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-timer/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var frame = 0;
	  var timeout = 0;
	  var interval = 0;
	  var pokeDelay = 1000;
	  var taskHead;
	  var taskTail;
	  var clockLast = 0;
	  var clockNow = 0;
	  var clockSkew = 0;
	  var clock = typeof performance === "object" && performance.now ? performance : Date;
	  var setFrame = typeof requestAnimationFrame === "function"
	          ? (clock === Date ? function(f) { requestAnimationFrame(function() { f(clock.now()); }); } : requestAnimationFrame)
	          : function(f) { setTimeout(f, 17); };
	  function now() {
	    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
	  }

	  function clearNow() {
	    clockNow = 0;
	  }

	  function Timer() {
	    this._call =
	    this._time =
	    this._next = null;
	  }

	  Timer.prototype = timer.prototype = {
	    constructor: Timer,
	    restart: function(callback, delay, time) {
	      if (typeof callback !== "function") throw new TypeError("callback is not a function");
	      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
	      if (!this._next && taskTail !== this) {
	        if (taskTail) taskTail._next = this;
	        else taskHead = this;
	        taskTail = this;
	      }
	      this._call = callback;
	      this._time = time;
	      sleep();
	    },
	    stop: function() {
	      if (this._call) {
	        this._call = null;
	        this._time = Infinity;
	        sleep();
	      }
	    }
	  };

	  function timer(callback, delay, time) {
	    var t = new Timer;
	    t.restart(callback, delay, time);
	    return t;
	  }

	  function timerFlush() {
	    now(); // Get the current time, if not already set.
	    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
	    var t = taskHead, e;
	    while (t) {
	      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
	      t = t._next;
	    }
	    --frame;
	  }

	  function wake(time) {
	    clockNow = (clockLast = time || clock.now()) + clockSkew;
	    frame = timeout = 0;
	    try {
	      timerFlush();
	    } finally {
	      frame = 0;
	      nap();
	      clockNow = 0;
	    }
	  }

	  function poke() {
	    var now = clock.now(), delay = now - clockLast;
	    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
	  }

	  function nap() {
	    var t0, t1 = taskHead, t2, time = Infinity;
	    while (t1) {
	      if (t1._call) {
	        if (time > t1._time) time = t1._time;
	        t0 = t1, t1 = t1._next;
	      } else {
	        t2 = t1._next, t1._next = null;
	        t1 = t0 ? t0._next = t2 : taskHead = t2;
	      }
	    }
	    taskTail = t0;
	    sleep(time);
	  }

	  function sleep(time) {
	    if (frame) return; // Soonest alarm already set, or will be.
	    if (timeout) timeout = clearTimeout(timeout);
	    var delay = time - clockNow;
	    if (delay > 24) {
	      if (time < Infinity) timeout = setTimeout(wake, delay);
	      if (interval) interval = clearInterval(interval);
	    } else {
	      if (!interval) interval = setInterval(poke, pokeDelay);
	      frame = 1, setFrame(wake);
	    }
	  }

	  function timeout$1(callback, delay, time) {
	    var t = new Timer;
	    delay = delay == null ? 0 : +delay;
	    t.restart(function(elapsed) {
	      t.stop();
	      callback(elapsed + delay);
	    }, delay, time);
	    return t;
	  }

	  function interval$1(callback, delay, time) {
	    var t = new Timer, total = delay;
	    if (delay == null) return t.restart(callback, delay, time), t;
	    delay = +delay, time = time == null ? now() : +time;
	    t.restart(function tick(elapsed) {
	      elapsed += total;
	      t.restart(tick, total += delay, time);
	      callback(elapsed);
	    }, delay, time);
	    return t;
	  }

	  exports.now = now;
	  exports.timer = timer;
	  exports.timerFlush = timerFlush;
	  exports.timeout = timeout$1;
	  exports.interval = interval$1;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-interpolate/ Version 1.1.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(9)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-color'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3));
	}(this, function (exports,d3Color) { 'use strict';

	  function basis(t1, v0, v1, v2, v3) {
	    var t2 = t1 * t1, t3 = t2 * t1;
	    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
	        + (4 - 6 * t2 + 3 * t3) * v1
	        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
	        + t3 * v3) / 6;
	  }

	  function basis$1(values) {
	    var n = values.length - 1;
	    return function(t) {
	      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
	          v1 = values[i],
	          v2 = values[i + 1],
	          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
	          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
	      return basis((t - i / n) * n, v0, v1, v2, v3);
	    };
	  }

	  function basisClosed(values) {
	    var n = values.length;
	    return function(t) {
	      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
	          v0 = values[(i + n - 1) % n],
	          v1 = values[i % n],
	          v2 = values[(i + 1) % n],
	          v3 = values[(i + 2) % n];
	      return basis((t - i / n) * n, v0, v1, v2, v3);
	    };
	  }

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function linear(a, d) {
	    return function(t) {
	      return a + t * d;
	    };
	  }

	  function exponential(a, b, y) {
	    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	      return Math.pow(a + t * b, y);
	    };
	  }

	  function hue(a, b) {
	    var d = b - a;
	    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
	  }

	  function gamma(y) {
	    return (y = +y) === 1 ? nogamma : function(a, b) {
	      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
	    };
	  }

	  function nogamma(a, b) {
	    var d = b - a;
	    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
	  }

	  var rgb$1 = (function rgbGamma(y) {
	    var color = gamma(y);

	    function rgb(start, end) {
	      var r = color((start = d3Color.rgb(start)).r, (end = d3Color.rgb(end)).r),
	          g = color(start.g, end.g),
	          b = color(start.b, end.b),
	          opacity = color(start.opacity, end.opacity);
	      return function(t) {
	        start.r = r(t);
	        start.g = g(t);
	        start.b = b(t);
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }

	    rgb.gamma = rgbGamma;

	    return rgb;
	  })(1);

	  function rgbSpline(spline) {
	    return function(colors) {
	      var n = colors.length,
	          r = new Array(n),
	          g = new Array(n),
	          b = new Array(n),
	          i, color;
	      for (i = 0; i < n; ++i) {
	        color = d3Color.rgb(colors[i]);
	        r[i] = color.r || 0;
	        g[i] = color.g || 0;
	        b[i] = color.b || 0;
	      }
	      r = spline(r);
	      g = spline(g);
	      b = spline(b);
	      color.opacity = 1;
	      return function(t) {
	        color.r = r(t);
	        color.g = g(t);
	        color.b = b(t);
	        return color + "";
	      };
	    };
	  }

	  var rgbBasis = rgbSpline(basis$1);
	  var rgbBasisClosed = rgbSpline(basisClosed);

	  function array(a, b) {
	    var nb = b ? b.length : 0,
	        na = a ? Math.min(nb, a.length) : 0,
	        x = new Array(nb),
	        c = new Array(nb),
	        i;

	    for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
	    for (; i < nb; ++i) c[i] = b[i];

	    return function(t) {
	      for (i = 0; i < na; ++i) c[i] = x[i](t);
	      return c;
	    };
	  }

	  function date(a, b) {
	    var d = new Date;
	    return a = +a, b -= a, function(t) {
	      return d.setTime(a + b * t), d;
	    };
	  }

	  function number(a, b) {
	    return a = +a, b -= a, function(t) {
	      return a + b * t;
	    };
	  }

	  function object(a, b) {
	    var i = {},
	        c = {},
	        k;

	    if (a === null || typeof a !== "object") a = {};
	    if (b === null || typeof b !== "object") b = {};

	    for (k in b) {
	      if (k in a) {
	        i[k] = value(a[k], b[k]);
	      } else {
	        c[k] = b[k];
	      }
	    }

	    return function(t) {
	      for (k in i) c[k] = i[k](t);
	      return c;
	    };
	  }

	  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
	  var reB = new RegExp(reA.source, "g");
	  function zero(b) {
	    return function() {
	      return b;
	    };
	  }

	  function one(b) {
	    return function(t) {
	      return b(t) + "";
	    };
	  }

	  function string(a, b) {
	    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	        am, // current match in a
	        bm, // current match in b
	        bs, // string preceding current number in b, if any
	        i = -1, // index in s
	        s = [], // string constants and placeholders
	        q = []; // number interpolators

	    // Coerce inputs to strings.
	    a = a + "", b = b + "";

	    // Interpolate pairs of numbers in a & b.
	    while ((am = reA.exec(a))
	        && (bm = reB.exec(b))) {
	      if ((bs = bm.index) > bi) { // a string precedes the next number in b
	        bs = b.slice(bi, bs);
	        if (s[i]) s[i] += bs; // coalesce with previous string
	        else s[++i] = bs;
	      }
	      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	        if (s[i]) s[i] += bm; // coalesce with previous string
	        else s[++i] = bm;
	      } else { // interpolate non-matching numbers
	        s[++i] = null;
	        q.push({i: i, x: number(am, bm)});
	      }
	      bi = reB.lastIndex;
	    }

	    // Add remains of b.
	    if (bi < b.length) {
	      bs = b.slice(bi);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }

	    // Special optimization for only a single match.
	    // Otherwise, interpolate each of the numbers and rejoin the string.
	    return s.length < 2 ? (q[0]
	        ? one(q[0].x)
	        : zero(b))
	        : (b = q.length, function(t) {
	            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	            return s.join("");
	          });
	  }

	  function value(a, b) {
	    var t = typeof b, c;
	    return b == null || t === "boolean" ? constant(b)
	        : (t === "number" ? number
	        : t === "string" ? ((c = d3Color.color(b)) ? (b = c, rgb$1) : string)
	        : b instanceof d3Color.color ? rgb$1
	        : b instanceof Date ? date
	        : Array.isArray(b) ? array
	        : isNaN(b) ? object
	        : number)(a, b);
	  }

	  function round(a, b) {
	    return a = +a, b -= a, function(t) {
	      return Math.round(a + b * t);
	    };
	  }

	  var degrees = 180 / Math.PI;

	  var identity = {
	    translateX: 0,
	    translateY: 0,
	    rotate: 0,
	    skewX: 0,
	    scaleX: 1,
	    scaleY: 1
	  };

	  function decompose(a, b, c, d, e, f) {
	    var scaleX, scaleY, skewX;
	    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	    return {
	      translateX: e,
	      translateY: f,
	      rotate: Math.atan2(b, a) * degrees,
	      skewX: Math.atan(skewX) * degrees,
	      scaleX: scaleX,
	      scaleY: scaleY
	    };
	  }

	  var cssNode;
	  var cssRoot;
	  var cssView;
	  var svgNode;
	  function parseCss(value) {
	    if (value === "none") return identity;
	    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
	    cssNode.style.transform = value;
	    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
	    cssRoot.removeChild(cssNode);
	    value = value.slice(7, -1).split(",");
	    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
	  }

	  function parseSvg(value) {
	    if (value == null) return identity;
	    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	    svgNode.setAttribute("transform", value);
	    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
	    value = value.matrix;
	    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	  }

	  function interpolateTransform(parse, pxComma, pxParen, degParen) {

	    function pop(s) {
	      return s.length ? s.pop() + " " : "";
	    }

	    function translate(xa, ya, xb, yb, s, q) {
	      if (xa !== xb || ya !== yb) {
	        var i = s.push("translate(", null, pxComma, null, pxParen);
	        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
	      } else if (xb || yb) {
	        s.push("translate(" + xb + pxComma + yb + pxParen);
	      }
	    }

	    function rotate(a, b, s, q) {
	      if (a !== b) {
	        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
	        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number(a, b)});
	      } else if (b) {
	        s.push(pop(s) + "rotate(" + b + degParen);
	      }
	    }

	    function skewX(a, b, s, q) {
	      if (a !== b) {
	        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number(a, b)});
	      } else if (b) {
	        s.push(pop(s) + "skewX(" + b + degParen);
	      }
	    }

	    function scale(xa, ya, xb, yb, s, q) {
	      if (xa !== xb || ya !== yb) {
	        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
	      } else if (xb !== 1 || yb !== 1) {
	        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	      }
	    }

	    return function(a, b) {
	      var s = [], // string constants and placeholders
	          q = []; // number interpolators
	      a = parse(a), b = parse(b);
	      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
	      rotate(a.rotate, b.rotate, s, q);
	      skewX(a.skewX, b.skewX, s, q);
	      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
	      a = b = null; // gc
	      return function(t) {
	        var i = -1, n = q.length, o;
	        while (++i < n) s[(o = q[i]).i] = o.x(t);
	        return s.join("");
	      };
	    };
	  }

	  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
	  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

	  var rho = Math.SQRT2;
	  var rho2 = 2;
	  var rho4 = 4;
	  var epsilon2 = 1e-12;
	  function cosh(x) {
	    return ((x = Math.exp(x)) + 1 / x) / 2;
	  }

	  function sinh(x) {
	    return ((x = Math.exp(x)) - 1 / x) / 2;
	  }

	  function tanh(x) {
	    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
	  }

	  // p0 = [ux0, uy0, w0]
	  // p1 = [ux1, uy1, w1]
	  function zoom(p0, p1) {
	    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
	        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
	        dx = ux1 - ux0,
	        dy = uy1 - uy0,
	        d2 = dx * dx + dy * dy,
	        i,
	        S;

	    // Special case for u0 ≅ u1.
	    if (d2 < epsilon2) {
	      S = Math.log(w1 / w0) / rho;
	      i = function(t) {
	        return [
	          ux0 + t * dx,
	          uy0 + t * dy,
	          w0 * Math.exp(rho * t * S)
	        ];
	      }
	    }

	    // General case.
	    else {
	      var d1 = Math.sqrt(d2),
	          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
	          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
	          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
	          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
	      S = (r1 - r0) / rho;
	      i = function(t) {
	        var s = t * S,
	            coshr0 = cosh(r0),
	            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
	        return [
	          ux0 + u * dx,
	          uy0 + u * dy,
	          w0 * coshr0 / cosh(rho * s + r0)
	        ];
	      }
	    }

	    i.duration = S * 1000;

	    return i;
	  }

	  function hsl$1(hue) {
	    return function(start, end) {
	      var h = hue((start = d3Color.hsl(start)).h, (end = d3Color.hsl(end)).h),
	          s = nogamma(start.s, end.s),
	          l = nogamma(start.l, end.l),
	          opacity = nogamma(start.opacity, end.opacity);
	      return function(t) {
	        start.h = h(t);
	        start.s = s(t);
	        start.l = l(t);
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }
	  }

	  var hsl$2 = hsl$1(hue);
	  var hslLong = hsl$1(nogamma);

	  function lab$1(start, end) {
	    var l = nogamma((start = d3Color.lab(start)).l, (end = d3Color.lab(end)).l),
	        a = nogamma(start.a, end.a),
	        b = nogamma(start.b, end.b),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.l = l(t);
	      start.a = a(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  function hcl$1(hue) {
	    return function(start, end) {
	      var h = hue((start = d3Color.hcl(start)).h, (end = d3Color.hcl(end)).h),
	          c = nogamma(start.c, end.c),
	          l = nogamma(start.l, end.l),
	          opacity = nogamma(start.opacity, end.opacity);
	      return function(t) {
	        start.h = h(t);
	        start.c = c(t);
	        start.l = l(t);
	        start.opacity = opacity(t);
	        return start + "";
	      };
	    }
	  }

	  var hcl$2 = hcl$1(hue);
	  var hclLong = hcl$1(nogamma);

	  function cubehelix$1(hue) {
	    return (function cubehelixGamma(y) {
	      y = +y;

	      function cubehelix(start, end) {
	        var h = hue((start = d3Color.cubehelix(start)).h, (end = d3Color.cubehelix(end)).h),
	            s = nogamma(start.s, end.s),
	            l = nogamma(start.l, end.l),
	            opacity = nogamma(start.opacity, end.opacity);
	        return function(t) {
	          start.h = h(t);
	          start.s = s(t);
	          start.l = l(Math.pow(t, y));
	          start.opacity = opacity(t);
	          return start + "";
	        };
	      }

	      cubehelix.gamma = cubehelixGamma;

	      return cubehelix;
	    })(1);
	  }

	  var cubehelix$2 = cubehelix$1(hue);
	  var cubehelixLong = cubehelix$1(nogamma);

	  function quantize(interpolator, n) {
	    var samples = new Array(n);
	    for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
	    return samples;
	  }

	  exports.interpolate = value;
	  exports.interpolateArray = array;
	  exports.interpolateBasis = basis$1;
	  exports.interpolateBasisClosed = basisClosed;
	  exports.interpolateDate = date;
	  exports.interpolateNumber = number;
	  exports.interpolateObject = object;
	  exports.interpolateRound = round;
	  exports.interpolateString = string;
	  exports.interpolateTransformCss = interpolateTransformCss;
	  exports.interpolateTransformSvg = interpolateTransformSvg;
	  exports.interpolateZoom = zoom;
	  exports.interpolateRgb = rgb$1;
	  exports.interpolateRgbBasis = rgbBasis;
	  exports.interpolateRgbBasisClosed = rgbBasisClosed;
	  exports.interpolateHsl = hsl$2;
	  exports.interpolateHslLong = hslLong;
	  exports.interpolateLab = lab$1;
	  exports.interpolateHcl = hcl$2;
	  exports.interpolateHclLong = hclLong;
	  exports.interpolateCubehelix = cubehelix$2;
	  exports.interpolateCubehelixLong = cubehelixLong;
	  exports.quantize = quantize;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-color/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function define(constructor, factory, prototype) {
	    constructor.prototype = factory.prototype = prototype;
	    prototype.constructor = constructor;
	  }

	  function extend(parent, definition) {
	    var prototype = Object.create(parent.prototype);
	    for (var key in definition) prototype[key] = definition[key];
	    return prototype;
	  }

	  function Color() {}

	  var darker = 0.7;
	  var brighter = 1 / darker;

	  var reHex3 = /^#([0-9a-f]{3})$/;
	  var reHex6 = /^#([0-9a-f]{6})$/;
	  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
	  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	  var reRgbaInteger = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	  var reRgbaPercent = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
	  var reHslaPercent = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
	  var named = {
	    aliceblue: 0xf0f8ff,
	    antiquewhite: 0xfaebd7,
	    aqua: 0x00ffff,
	    aquamarine: 0x7fffd4,
	    azure: 0xf0ffff,
	    beige: 0xf5f5dc,
	    bisque: 0xffe4c4,
	    black: 0x000000,
	    blanchedalmond: 0xffebcd,
	    blue: 0x0000ff,
	    blueviolet: 0x8a2be2,
	    brown: 0xa52a2a,
	    burlywood: 0xdeb887,
	    cadetblue: 0x5f9ea0,
	    chartreuse: 0x7fff00,
	    chocolate: 0xd2691e,
	    coral: 0xff7f50,
	    cornflowerblue: 0x6495ed,
	    cornsilk: 0xfff8dc,
	    crimson: 0xdc143c,
	    cyan: 0x00ffff,
	    darkblue: 0x00008b,
	    darkcyan: 0x008b8b,
	    darkgoldenrod: 0xb8860b,
	    darkgray: 0xa9a9a9,
	    darkgreen: 0x006400,
	    darkgrey: 0xa9a9a9,
	    darkkhaki: 0xbdb76b,
	    darkmagenta: 0x8b008b,
	    darkolivegreen: 0x556b2f,
	    darkorange: 0xff8c00,
	    darkorchid: 0x9932cc,
	    darkred: 0x8b0000,
	    darksalmon: 0xe9967a,
	    darkseagreen: 0x8fbc8f,
	    darkslateblue: 0x483d8b,
	    darkslategray: 0x2f4f4f,
	    darkslategrey: 0x2f4f4f,
	    darkturquoise: 0x00ced1,
	    darkviolet: 0x9400d3,
	    deeppink: 0xff1493,
	    deepskyblue: 0x00bfff,
	    dimgray: 0x696969,
	    dimgrey: 0x696969,
	    dodgerblue: 0x1e90ff,
	    firebrick: 0xb22222,
	    floralwhite: 0xfffaf0,
	    forestgreen: 0x228b22,
	    fuchsia: 0xff00ff,
	    gainsboro: 0xdcdcdc,
	    ghostwhite: 0xf8f8ff,
	    gold: 0xffd700,
	    goldenrod: 0xdaa520,
	    gray: 0x808080,
	    green: 0x008000,
	    greenyellow: 0xadff2f,
	    grey: 0x808080,
	    honeydew: 0xf0fff0,
	    hotpink: 0xff69b4,
	    indianred: 0xcd5c5c,
	    indigo: 0x4b0082,
	    ivory: 0xfffff0,
	    khaki: 0xf0e68c,
	    lavender: 0xe6e6fa,
	    lavenderblush: 0xfff0f5,
	    lawngreen: 0x7cfc00,
	    lemonchiffon: 0xfffacd,
	    lightblue: 0xadd8e6,
	    lightcoral: 0xf08080,
	    lightcyan: 0xe0ffff,
	    lightgoldenrodyellow: 0xfafad2,
	    lightgray: 0xd3d3d3,
	    lightgreen: 0x90ee90,
	    lightgrey: 0xd3d3d3,
	    lightpink: 0xffb6c1,
	    lightsalmon: 0xffa07a,
	    lightseagreen: 0x20b2aa,
	    lightskyblue: 0x87cefa,
	    lightslategray: 0x778899,
	    lightslategrey: 0x778899,
	    lightsteelblue: 0xb0c4de,
	    lightyellow: 0xffffe0,
	    lime: 0x00ff00,
	    limegreen: 0x32cd32,
	    linen: 0xfaf0e6,
	    magenta: 0xff00ff,
	    maroon: 0x800000,
	    mediumaquamarine: 0x66cdaa,
	    mediumblue: 0x0000cd,
	    mediumorchid: 0xba55d3,
	    mediumpurple: 0x9370db,
	    mediumseagreen: 0x3cb371,
	    mediumslateblue: 0x7b68ee,
	    mediumspringgreen: 0x00fa9a,
	    mediumturquoise: 0x48d1cc,
	    mediumvioletred: 0xc71585,
	    midnightblue: 0x191970,
	    mintcream: 0xf5fffa,
	    mistyrose: 0xffe4e1,
	    moccasin: 0xffe4b5,
	    navajowhite: 0xffdead,
	    navy: 0x000080,
	    oldlace: 0xfdf5e6,
	    olive: 0x808000,
	    olivedrab: 0x6b8e23,
	    orange: 0xffa500,
	    orangered: 0xff4500,
	    orchid: 0xda70d6,
	    palegoldenrod: 0xeee8aa,
	    palegreen: 0x98fb98,
	    paleturquoise: 0xafeeee,
	    palevioletred: 0xdb7093,
	    papayawhip: 0xffefd5,
	    peachpuff: 0xffdab9,
	    peru: 0xcd853f,
	    pink: 0xffc0cb,
	    plum: 0xdda0dd,
	    powderblue: 0xb0e0e6,
	    purple: 0x800080,
	    rebeccapurple: 0x663399,
	    red: 0xff0000,
	    rosybrown: 0xbc8f8f,
	    royalblue: 0x4169e1,
	    saddlebrown: 0x8b4513,
	    salmon: 0xfa8072,
	    sandybrown: 0xf4a460,
	    seagreen: 0x2e8b57,
	    seashell: 0xfff5ee,
	    sienna: 0xa0522d,
	    silver: 0xc0c0c0,
	    skyblue: 0x87ceeb,
	    slateblue: 0x6a5acd,
	    slategray: 0x708090,
	    slategrey: 0x708090,
	    snow: 0xfffafa,
	    springgreen: 0x00ff7f,
	    steelblue: 0x4682b4,
	    tan: 0xd2b48c,
	    teal: 0x008080,
	    thistle: 0xd8bfd8,
	    tomato: 0xff6347,
	    turquoise: 0x40e0d0,
	    violet: 0xee82ee,
	    wheat: 0xf5deb3,
	    white: 0xffffff,
	    whitesmoke: 0xf5f5f5,
	    yellow: 0xffff00,
	    yellowgreen: 0x9acd32
	  };

	  define(Color, color, {
	    displayable: function() {
	      return this.rgb().displayable();
	    },
	    toString: function() {
	      return this.rgb() + "";
	    }
	  });

	  function color(format) {
	    var m;
	    format = (format + "").trim().toLowerCase();
	    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
	        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	        : named.hasOwnProperty(format) ? rgbn(named[format])
	        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	        : null;
	  }

	  function rgbn(n) {
	    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	  }

	  function rgba(r, g, b, a) {
	    if (a <= 0) r = g = b = NaN;
	    return new Rgb(r, g, b, a);
	  }

	  function rgbConvert(o) {
	    if (!(o instanceof Color)) o = color(o);
	    if (!o) return new Rgb;
	    o = o.rgb();
	    return new Rgb(o.r, o.g, o.b, o.opacity);
	  }

	  function rgb(r, g, b, opacity) {
	    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	  }

	  function Rgb(r, g, b, opacity) {
	    this.r = +r;
	    this.g = +g;
	    this.b = +b;
	    this.opacity = +opacity;
	  }

	  define(Rgb, rgb, extend(Color, {
	    brighter: function(k) {
	      k = k == null ? brighter : Math.pow(brighter, k);
	      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	    },
	    darker: function(k) {
	      k = k == null ? darker : Math.pow(darker, k);
	      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	    },
	    rgb: function() {
	      return this;
	    },
	    displayable: function() {
	      return (0 <= this.r && this.r <= 255)
	          && (0 <= this.g && this.g <= 255)
	          && (0 <= this.b && this.b <= 255)
	          && (0 <= this.opacity && this.opacity <= 1);
	    },
	    toString: function() {
	      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	      return (a === 1 ? "rgb(" : "rgba(")
	          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	          + (a === 1 ? ")" : ", " + a + ")");
	    }
	  }));

	  function hsla(h, s, l, a) {
	    if (a <= 0) h = s = l = NaN;
	    else if (l <= 0 || l >= 1) h = s = NaN;
	    else if (s <= 0) h = NaN;
	    return new Hsl(h, s, l, a);
	  }

	  function hslConvert(o) {
	    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	    if (!(o instanceof Color)) o = color(o);
	    if (!o) return new Hsl;
	    if (o instanceof Hsl) return o;
	    o = o.rgb();
	    var r = o.r / 255,
	        g = o.g / 255,
	        b = o.b / 255,
	        min = Math.min(r, g, b),
	        max = Math.max(r, g, b),
	        h = NaN,
	        s = max - min,
	        l = (max + min) / 2;
	    if (s) {
	      if (r === max) h = (g - b) / s + (g < b) * 6;
	      else if (g === max) h = (b - r) / s + 2;
	      else h = (r - g) / s + 4;
	      s /= l < 0.5 ? max + min : 2 - max - min;
	      h *= 60;
	    } else {
	      s = l > 0 && l < 1 ? 0 : h;
	    }
	    return new Hsl(h, s, l, o.opacity);
	  }

	  function hsl(h, s, l, opacity) {
	    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	  }

	  function Hsl(h, s, l, opacity) {
	    this.h = +h;
	    this.s = +s;
	    this.l = +l;
	    this.opacity = +opacity;
	  }

	  define(Hsl, hsl, extend(Color, {
	    brighter: function(k) {
	      k = k == null ? brighter : Math.pow(brighter, k);
	      return new Hsl(this.h, this.s, this.l * k, this.opacity);
	    },
	    darker: function(k) {
	      k = k == null ? darker : Math.pow(darker, k);
	      return new Hsl(this.h, this.s, this.l * k, this.opacity);
	    },
	    rgb: function() {
	      var h = this.h % 360 + (this.h < 0) * 360,
	          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	          l = this.l,
	          m2 = l + (l < 0.5 ? l : 1 - l) * s,
	          m1 = 2 * l - m2;
	      return new Rgb(
	        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	        hsl2rgb(h, m1, m2),
	        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	        this.opacity
	      );
	    },
	    displayable: function() {
	      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	          && (0 <= this.l && this.l <= 1)
	          && (0 <= this.opacity && this.opacity <= 1);
	    }
	  }));

	  /* From FvD 13.37, CSS Color Module Level 3 */
	  function hsl2rgb(h, m1, m2) {
	    return (h < 60 ? m1 + (m2 - m1) * h / 60
	        : h < 180 ? m2
	        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	        : m1) * 255;
	  }

	  var deg2rad = Math.PI / 180;
	  var rad2deg = 180 / Math.PI;

	  var Kn = 18;
	  var Xn = 0.950470;
	  var Yn = 1;
	  var Zn = 1.088830;
	  var t0 = 4 / 29;
	  var t1 = 6 / 29;
	  var t2 = 3 * t1 * t1;
	  var t3 = t1 * t1 * t1;
	  function labConvert(o) {
	    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
	    if (o instanceof Hcl) {
	      var h = o.h * deg2rad;
	      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	    }
	    if (!(o instanceof Rgb)) o = rgbConvert(o);
	    var b = rgb2xyz(o.r),
	        a = rgb2xyz(o.g),
	        l = rgb2xyz(o.b),
	        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
	        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
	        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
	    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	  }

	  function lab(l, a, b, opacity) {
	    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
	  }

	  function Lab(l, a, b, opacity) {
	    this.l = +l;
	    this.a = +a;
	    this.b = +b;
	    this.opacity = +opacity;
	  }

	  define(Lab, lab, extend(Color, {
	    brighter: function(k) {
	      return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	    },
	    darker: function(k) {
	      return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	    },
	    rgb: function() {
	      var y = (this.l + 16) / 116,
	          x = isNaN(this.a) ? y : y + this.a / 500,
	          z = isNaN(this.b) ? y : y - this.b / 200;
	      y = Yn * lab2xyz(y);
	      x = Xn * lab2xyz(x);
	      z = Zn * lab2xyz(z);
	      return new Rgb(
	        xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	        xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
	        xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
	        this.opacity
	      );
	    }
	  }));

	  function xyz2lab(t) {
	    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	  }

	  function lab2xyz(t) {
	    return t > t1 ? t * t * t : t2 * (t - t0);
	  }

	  function xyz2rgb(x) {
	    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	  }

	  function rgb2xyz(x) {
	    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	  }

	  function hclConvert(o) {
	    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
	    if (!(o instanceof Lab)) o = labConvert(o);
	    var h = Math.atan2(o.b, o.a) * rad2deg;
	    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	  }

	  function hcl(h, c, l, opacity) {
	    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
	  }

	  function Hcl(h, c, l, opacity) {
	    this.h = +h;
	    this.c = +c;
	    this.l = +l;
	    this.opacity = +opacity;
	  }

	  define(Hcl, hcl, extend(Color, {
	    brighter: function(k) {
	      return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
	    },
	    darker: function(k) {
	      return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
	    },
	    rgb: function() {
	      return labConvert(this).rgb();
	    }
	  }));

	  var A = -0.14861;
	  var B = +1.78277;
	  var C = -0.29227;
	  var D = -0.90649;
	  var E = +1.97294;
	  var ED = E * D;
	  var EB = E * B;
	  var BC_DA = B * C - D * A;
	  function cubehelixConvert(o) {
	    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	    if (!(o instanceof Rgb)) o = rgbConvert(o);
	    var r = o.r / 255,
	        g = o.g / 255,
	        b = o.b / 255,
	        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	        bl = b - l,
	        k = (E * (g - l) - C * bl) / D,
	        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
	        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	  }

	  function cubehelix(h, s, l, opacity) {
	    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	  }

	  function Cubehelix(h, s, l, opacity) {
	    this.h = +h;
	    this.s = +s;
	    this.l = +l;
	    this.opacity = +opacity;
	  }

	  define(Cubehelix, cubehelix, extend(Color, {
	    brighter: function(k) {
	      k = k == null ? brighter : Math.pow(brighter, k);
	      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	    },
	    darker: function(k) {
	      k = k == null ? darker : Math.pow(darker, k);
	      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	    },
	    rgb: function() {
	      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	          l = +this.l,
	          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	          cosh = Math.cos(h),
	          sinh = Math.sin(h);
	      return new Rgb(
	        255 * (l + a * (A * cosh + B * sinh)),
	        255 * (l + a * (C * cosh + D * sinh)),
	        255 * (l + a * (E * cosh)),
	        this.opacity
	      );
	    }
	  }));

	  exports.color = color;
	  exports.rgb = rgb;
	  exports.hsl = hsl;
	  exports.lab = lab;
	  exports.hcl = hcl;
	  exports.cubehelix = cubehelix;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-ease/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function linear(t) {
	    return +t;
	  }

	  function quadIn(t) {
	    return t * t;
	  }

	  function quadOut(t) {
	    return t * (2 - t);
	  }

	  function quadInOut(t) {
	    return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
	  }

	  function cubicIn(t) {
	    return t * t * t;
	  }

	  function cubicOut(t) {
	    return --t * t * t + 1;
	  }

	  function cubicInOut(t) {
	    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	  }

	  var exponent = 3;

	  var polyIn = (function custom(e) {
	    e = +e;

	    function polyIn(t) {
	      return Math.pow(t, e);
	    }

	    polyIn.exponent = custom;

	    return polyIn;
	  })(exponent);

	  var polyOut = (function custom(e) {
	    e = +e;

	    function polyOut(t) {
	      return 1 - Math.pow(1 - t, e);
	    }

	    polyOut.exponent = custom;

	    return polyOut;
	  })(exponent);

	  var polyInOut = (function custom(e) {
	    e = +e;

	    function polyInOut(t) {
	      return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
	    }

	    polyInOut.exponent = custom;

	    return polyInOut;
	  })(exponent);

	  var pi = Math.PI;
	  var halfPi = pi / 2;
	  function sinIn(t) {
	    return 1 - Math.cos(t * halfPi);
	  }

	  function sinOut(t) {
	    return Math.sin(t * halfPi);
	  }

	  function sinInOut(t) {
	    return (1 - Math.cos(pi * t)) / 2;
	  }

	  function expIn(t) {
	    return Math.pow(2, 10 * t - 10);
	  }

	  function expOut(t) {
	    return 1 - Math.pow(2, -10 * t);
	  }

	  function expInOut(t) {
	    return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
	  }

	  function circleIn(t) {
	    return 1 - Math.sqrt(1 - t * t);
	  }

	  function circleOut(t) {
	    return Math.sqrt(1 - --t * t);
	  }

	  function circleInOut(t) {
	    return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
	  }

	  var b1 = 4 / 11;
	  var b2 = 6 / 11;
	  var b3 = 8 / 11;
	  var b4 = 3 / 4;
	  var b5 = 9 / 11;
	  var b6 = 10 / 11;
	  var b7 = 15 / 16;
	  var b8 = 21 / 22;
	  var b9 = 63 / 64;
	  var b0 = 1 / b1 / b1;
	  function bounceIn(t) {
	    return 1 - bounceOut(1 - t);
	  }

	  function bounceOut(t) {
	    return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
	  }

	  function bounceInOut(t) {
	    return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
	  }

	  var overshoot = 1.70158;

	  var backIn = (function custom(s) {
	    s = +s;

	    function backIn(t) {
	      return t * t * ((s + 1) * t - s);
	    }

	    backIn.overshoot = custom;

	    return backIn;
	  })(overshoot);

	  var backOut = (function custom(s) {
	    s = +s;

	    function backOut(t) {
	      return --t * t * ((s + 1) * t + s) + 1;
	    }

	    backOut.overshoot = custom;

	    return backOut;
	  })(overshoot);

	  var backInOut = (function custom(s) {
	    s = +s;

	    function backInOut(t) {
	      return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
	    }

	    backInOut.overshoot = custom;

	    return backInOut;
	  })(overshoot);

	  var tau = 2 * Math.PI;
	  var amplitude = 1;
	  var period = 0.3;
	  var elasticIn = (function custom(a, p) {
	    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	    function elasticIn(t) {
	      return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
	    }

	    elasticIn.amplitude = function(a) { return custom(a, p * tau); };
	    elasticIn.period = function(p) { return custom(a, p); };

	    return elasticIn;
	  })(amplitude, period);

	  var elasticOut = (function custom(a, p) {
	    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	    function elasticOut(t) {
	      return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
	    }

	    elasticOut.amplitude = function(a) { return custom(a, p * tau); };
	    elasticOut.period = function(p) { return custom(a, p); };

	    return elasticOut;
	  })(amplitude, period);

	  var elasticInOut = (function custom(a, p) {
	    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

	    function elasticInOut(t) {
	      return ((t = t * 2 - 1) < 0
	          ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
	          : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
	    }

	    elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
	    elasticInOut.period = function(p) { return custom(a, p); };

	    return elasticInOut;
	  })(amplitude, period);

	  exports.easeLinear = linear;
	  exports.easeQuad = quadInOut;
	  exports.easeQuadIn = quadIn;
	  exports.easeQuadOut = quadOut;
	  exports.easeQuadInOut = quadInOut;
	  exports.easeCubic = cubicInOut;
	  exports.easeCubicIn = cubicIn;
	  exports.easeCubicOut = cubicOut;
	  exports.easeCubicInOut = cubicInOut;
	  exports.easePoly = polyInOut;
	  exports.easePolyIn = polyIn;
	  exports.easePolyOut = polyOut;
	  exports.easePolyInOut = polyInOut;
	  exports.easeSin = sinInOut;
	  exports.easeSinIn = sinIn;
	  exports.easeSinOut = sinOut;
	  exports.easeSinInOut = sinInOut;
	  exports.easeExp = expInOut;
	  exports.easeExpIn = expIn;
	  exports.easeExpOut = expOut;
	  exports.easeExpInOut = expInOut;
	  exports.easeCircle = circleInOut;
	  exports.easeCircleIn = circleIn;
	  exports.easeCircleOut = circleOut;
	  exports.easeCircleInOut = circleInOut;
	  exports.easeBounce = bounceOut;
	  exports.easeBounceIn = bounceIn;
	  exports.easeBounceOut = bounceOut;
	  exports.easeBounceInOut = bounceInOut;
	  exports.easeBack = backInOut;
	  exports.easeBackIn = backIn;
	  exports.easeBackOut = backOut;
	  exports.easeBackInOut = backInOut;
	  exports.easeElastic = elasticOut;
	  exports.easeElasticIn = elasticIn;
	  exports.easeElasticOut = elasticOut;
	  exports.easeElasticInOut = elasticInOut;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-scale/ Version 1.0.3. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(3), __webpack_require__(12), __webpack_require__(8), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15), __webpack_require__(9)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-collection', 'd3-interpolate', 'd3-format', 'd3-time', 'd3-time-format', 'd3-color'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
	}(this, function (exports,d3Array,d3Collection,d3Interpolate,d3Format,d3Time,d3TimeFormat,d3Color) { 'use strict';

	  var array = Array.prototype;

	  var map$1 = array.map;
	  var slice = array.slice;

	  var implicit = {name: "implicit"};

	  function ordinal(range) {
	    var index = d3Collection.map(),
	        domain = [],
	        unknown = implicit;

	    range = range == null ? [] : slice.call(range);

	    function scale(d) {
	      var key = d + "", i = index.get(key);
	      if (!i) {
	        if (unknown !== implicit) return unknown;
	        index.set(key, i = domain.push(d));
	      }
	      return range[(i - 1) % range.length];
	    }

	    scale.domain = function(_) {
	      if (!arguments.length) return domain.slice();
	      domain = [], index = d3Collection.map();
	      var i = -1, n = _.length, d, key;
	      while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
	      return scale;
	    };

	    scale.range = function(_) {
	      return arguments.length ? (range = slice.call(_), scale) : range.slice();
	    };

	    scale.unknown = function(_) {
	      return arguments.length ? (unknown = _, scale) : unknown;
	    };

	    scale.copy = function() {
	      return ordinal()
	          .domain(domain)
	          .range(range)
	          .unknown(unknown);
	    };

	    return scale;
	  }

	  function band() {
	    var scale = ordinal().unknown(undefined),
	        domain = scale.domain,
	        ordinalRange = scale.range,
	        range = [0, 1],
	        step,
	        bandwidth,
	        round = false,
	        paddingInner = 0,
	        paddingOuter = 0,
	        align = 0.5;

	    delete scale.unknown;

	    function rescale() {
	      var n = domain().length,
	          reverse = range[1] < range[0],
	          start = range[reverse - 0],
	          stop = range[1 - reverse];
	      step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
	      if (round) step = Math.floor(step);
	      start += (stop - start - step * (n - paddingInner)) * align;
	      bandwidth = step * (1 - paddingInner);
	      if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
	      var values = d3Array.range(n).map(function(i) { return start + step * i; });
	      return ordinalRange(reverse ? values.reverse() : values);
	    }

	    scale.domain = function(_) {
	      return arguments.length ? (domain(_), rescale()) : domain();
	    };

	    scale.range = function(_) {
	      return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
	    };

	    scale.rangeRound = function(_) {
	      return range = [+_[0], +_[1]], round = true, rescale();
	    };

	    scale.bandwidth = function() {
	      return bandwidth;
	    };

	    scale.step = function() {
	      return step;
	    };

	    scale.round = function(_) {
	      return arguments.length ? (round = !!_, rescale()) : round;
	    };

	    scale.padding = function(_) {
	      return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
	    };

	    scale.paddingInner = function(_) {
	      return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
	    };

	    scale.paddingOuter = function(_) {
	      return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
	    };

	    scale.align = function(_) {
	      return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
	    };

	    scale.copy = function() {
	      return band()
	          .domain(domain())
	          .range(range)
	          .round(round)
	          .paddingInner(paddingInner)
	          .paddingOuter(paddingOuter)
	          .align(align);
	    };

	    return rescale();
	  }

	  function pointish(scale) {
	    var copy = scale.copy;

	    scale.padding = scale.paddingOuter;
	    delete scale.paddingInner;
	    delete scale.paddingOuter;

	    scale.copy = function() {
	      return pointish(copy());
	    };

	    return scale;
	  }

	  function point() {
	    return pointish(band().paddingInner(1));
	  }

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function number(x) {
	    return +x;
	  }

	  var unit = [0, 1];

	  function deinterpolate(a, b) {
	    return (b -= (a = +a))
	        ? function(x) { return (x - a) / b; }
	        : constant(b);
	  }

	  function deinterpolateClamp(deinterpolate) {
	    return function(a, b) {
	      var d = deinterpolate(a = +a, b = +b);
	      return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
	    };
	  }

	  function reinterpolateClamp(reinterpolate) {
	    return function(a, b) {
	      var r = reinterpolate(a = +a, b = +b);
	      return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
	    };
	  }

	  function bimap(domain, range, deinterpolate, reinterpolate) {
	    var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
	    if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
	    else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
	    return function(x) { return r0(d0(x)); };
	  }

	  function polymap(domain, range, deinterpolate, reinterpolate) {
	    var j = Math.min(domain.length, range.length) - 1,
	        d = new Array(j),
	        r = new Array(j),
	        i = -1;

	    // Reverse descending domains.
	    if (domain[j] < domain[0]) {
	      domain = domain.slice().reverse();
	      range = range.slice().reverse();
	    }

	    while (++i < j) {
	      d[i] = deinterpolate(domain[i], domain[i + 1]);
	      r[i] = reinterpolate(range[i], range[i + 1]);
	    }

	    return function(x) {
	      var i = d3Array.bisect(domain, x, 1, j) - 1;
	      return r[i](d[i](x));
	    };
	  }

	  function copy(source, target) {
	    return target
	        .domain(source.domain())
	        .range(source.range())
	        .interpolate(source.interpolate())
	        .clamp(source.clamp());
	  }

	  // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
	  // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
	  function continuous(deinterpolate$$, reinterpolate) {
	    var domain = unit,
	        range = unit,
	        interpolate = d3Interpolate.interpolate,
	        clamp = false,
	        piecewise,
	        output,
	        input;

	    function rescale() {
	      piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
	      output = input = null;
	      return scale;
	    }

	    function scale(x) {
	      return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate$$) : deinterpolate$$, interpolate)))(+x);
	    }

	    scale.invert = function(y) {
	      return (input || (input = piecewise(range, domain, deinterpolate, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
	    };

	    scale.domain = function(_) {
	      return arguments.length ? (domain = map$1.call(_, number), rescale()) : domain.slice();
	    };

	    scale.range = function(_) {
	      return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
	    };

	    scale.rangeRound = function(_) {
	      return range = slice.call(_), interpolate = d3Interpolate.interpolateRound, rescale();
	    };

	    scale.clamp = function(_) {
	      return arguments.length ? (clamp = !!_, rescale()) : clamp;
	    };

	    scale.interpolate = function(_) {
	      return arguments.length ? (interpolate = _, rescale()) : interpolate;
	    };

	    return rescale();
	  }

	  function tickFormat(domain, count, specifier) {
	    var start = domain[0],
	        stop = domain[domain.length - 1],
	        step = d3Array.tickStep(start, stop, count == null ? 10 : count),
	        precision;
	    specifier = d3Format.formatSpecifier(specifier == null ? ",f" : specifier);
	    switch (specifier.type) {
	      case "s": {
	        var value = Math.max(Math.abs(start), Math.abs(stop));
	        if (specifier.precision == null && !isNaN(precision = d3Format.precisionPrefix(step, value))) specifier.precision = precision;
	        return d3Format.formatPrefix(specifier, value);
	      }
	      case "":
	      case "e":
	      case "g":
	      case "p":
	      case "r": {
	        if (specifier.precision == null && !isNaN(precision = d3Format.precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	        break;
	      }
	      case "f":
	      case "%": {
	        if (specifier.precision == null && !isNaN(precision = d3Format.precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	        break;
	      }
	    }
	    return d3Format.format(specifier);
	  }

	  function linearish(scale) {
	    var domain = scale.domain;

	    scale.ticks = function(count) {
	      var d = domain();
	      return d3Array.ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	    };

	    scale.tickFormat = function(count, specifier) {
	      return tickFormat(domain(), count, specifier);
	    };

	    scale.nice = function(count) {
	      var d = domain(),
	          i = d.length - 1,
	          n = count == null ? 10 : count,
	          start = d[0],
	          stop = d[i],
	          step = d3Array.tickStep(start, stop, n);

	      if (step) {
	        step = d3Array.tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
	        d[0] = Math.floor(start / step) * step;
	        d[i] = Math.ceil(stop / step) * step;
	        domain(d);
	      }

	      return scale;
	    };

	    return scale;
	  }

	  function linear() {
	    var scale = continuous(deinterpolate, d3Interpolate.interpolateNumber);

	    scale.copy = function() {
	      return copy(scale, linear());
	    };

	    return linearish(scale);
	  }

	  function identity() {
	    var domain = [0, 1];

	    function scale(x) {
	      return +x;
	    }

	    scale.invert = scale;

	    scale.domain = scale.range = function(_) {
	      return arguments.length ? (domain = map$1.call(_, number), scale) : domain.slice();
	    };

	    scale.copy = function() {
	      return identity().domain(domain);
	    };

	    return linearish(scale);
	  }

	  function nice(domain, interval) {
	    domain = domain.slice();

	    var i0 = 0,
	        i1 = domain.length - 1,
	        x0 = domain[i0],
	        x1 = domain[i1],
	        t;

	    if (x1 < x0) {
	      t = i0, i0 = i1, i1 = t;
	      t = x0, x0 = x1, x1 = t;
	    }

	    domain[i0] = interval.floor(x0);
	    domain[i1] = interval.ceil(x1);
	    return domain;
	  }

	  function deinterpolate$1(a, b) {
	    return (b = Math.log(b / a))
	        ? function(x) { return Math.log(x / a) / b; }
	        : constant(b);
	  }

	  function reinterpolate(a, b) {
	    return a < 0
	        ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
	        : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
	  }

	  function pow10(x) {
	    return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
	  }

	  function powp(base) {
	    return base === 10 ? pow10
	        : base === Math.E ? Math.exp
	        : function(x) { return Math.pow(base, x); };
	  }

	  function logp(base) {
	    return base === Math.E ? Math.log
	        : base === 10 && Math.log10
	        || base === 2 && Math.log2
	        || (base = Math.log(base), function(x) { return Math.log(x) / base; });
	  }

	  function reflect(f) {
	    return function(x) {
	      return -f(-x);
	    };
	  }

	  function log() {
	    var scale = continuous(deinterpolate$1, reinterpolate).domain([1, 10]),
	        domain = scale.domain,
	        base = 10,
	        logs = logp(10),
	        pows = powp(10);

	    function rescale() {
	      logs = logp(base), pows = powp(base);
	      if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
	      return scale;
	    }

	    scale.base = function(_) {
	      return arguments.length ? (base = +_, rescale()) : base;
	    };

	    scale.domain = function(_) {
	      return arguments.length ? (domain(_), rescale()) : domain();
	    };

	    scale.ticks = function(count) {
	      var d = domain(),
	          u = d[0],
	          v = d[d.length - 1],
	          r;

	      if (r = v < u) i = u, u = v, v = i;

	      var i = logs(u),
	          j = logs(v),
	          p,
	          k,
	          t,
	          n = count == null ? 10 : +count,
	          z = [];

	      if (!(base % 1) && j - i < n) {
	        i = Math.round(i) - 1, j = Math.round(j) + 1;
	        if (u > 0) for (; i < j; ++i) {
	          for (k = 1, p = pows(i); k < base; ++k) {
	            t = p * k;
	            if (t < u) continue;
	            if (t > v) break;
	            z.push(t);
	          }
	        } else for (; i < j; ++i) {
	          for (k = base - 1, p = pows(i); k >= 1; --k) {
	            t = p * k;
	            if (t < u) continue;
	            if (t > v) break;
	            z.push(t);
	          }
	        }
	      } else {
	        z = d3Array.ticks(i, j, Math.min(j - i, n)).map(pows);
	      }

	      return r ? z.reverse() : z;
	    };

	    scale.tickFormat = function(count, specifier) {
	      if (specifier == null) specifier = base === 10 ? ".0e" : ",";
	      if (typeof specifier !== "function") specifier = d3Format.format(specifier);
	      if (count === Infinity) return specifier;
	      if (count == null) count = 10;
	      var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
	      return function(d) {
	        var i = d / pows(Math.round(logs(d)));
	        if (i * base < base - 0.5) i *= base;
	        return i <= k ? specifier(d) : "";
	      };
	    };

	    scale.nice = function() {
	      return domain(nice(domain(), {
	        floor: function(x) { return pows(Math.floor(logs(x))); },
	        ceil: function(x) { return pows(Math.ceil(logs(x))); }
	      }));
	    };

	    scale.copy = function() {
	      return copy(scale, log().base(base));
	    };

	    return scale;
	  }

	  function raise(x, exponent) {
	    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
	  }

	  function pow() {
	    var exponent = 1,
	        scale = continuous(deinterpolate, reinterpolate),
	        domain = scale.domain;

	    function deinterpolate(a, b) {
	      return (b = raise(b, exponent) - (a = raise(a, exponent)))
	          ? function(x) { return (raise(x, exponent) - a) / b; }
	          : constant(b);
	    }

	    function reinterpolate(a, b) {
	      b = raise(b, exponent) - (a = raise(a, exponent));
	      return function(t) { return raise(a + b * t, 1 / exponent); };
	    }

	    scale.exponent = function(_) {
	      return arguments.length ? (exponent = +_, domain(domain())) : exponent;
	    };

	    scale.copy = function() {
	      return copy(scale, pow().exponent(exponent));
	    };

	    return linearish(scale);
	  }

	  function sqrt() {
	    return pow().exponent(0.5);
	  }

	  function quantile$1() {
	    var domain = [],
	        range = [],
	        thresholds = [];

	    function rescale() {
	      var i = 0, n = Math.max(1, range.length);
	      thresholds = new Array(n - 1);
	      while (++i < n) thresholds[i - 1] = d3Array.quantile(domain, i / n);
	      return scale;
	    }

	    function scale(x) {
	      if (!isNaN(x = +x)) return range[d3Array.bisect(thresholds, x)];
	    }

	    scale.invertExtent = function(y) {
	      var i = range.indexOf(y);
	      return i < 0 ? [NaN, NaN] : [
	        i > 0 ? thresholds[i - 1] : domain[0],
	        i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
	      ];
	    };

	    scale.domain = function(_) {
	      if (!arguments.length) return domain.slice();
	      domain = [];
	      for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
	      domain.sort(d3Array.ascending);
	      return rescale();
	    };

	    scale.range = function(_) {
	      return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
	    };

	    scale.quantiles = function() {
	      return thresholds.slice();
	    };

	    scale.copy = function() {
	      return quantile$1()
	          .domain(domain)
	          .range(range);
	    };

	    return scale;
	  }

	  function quantize() {
	    var x0 = 0,
	        x1 = 1,
	        n = 1,
	        domain = [0.5],
	        range = [0, 1];

	    function scale(x) {
	      if (x <= x) return range[d3Array.bisect(domain, x, 0, n)];
	    }

	    function rescale() {
	      var i = -1;
	      domain = new Array(n);
	      while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
	      return scale;
	    }

	    scale.domain = function(_) {
	      return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
	    };

	    scale.range = function(_) {
	      return arguments.length ? (n = (range = slice.call(_)).length - 1, rescale()) : range.slice();
	    };

	    scale.invertExtent = function(y) {
	      var i = range.indexOf(y);
	      return i < 0 ? [NaN, NaN]
	          : i < 1 ? [x0, domain[0]]
	          : i >= n ? [domain[n - 1], x1]
	          : [domain[i - 1], domain[i]];
	    };

	    scale.copy = function() {
	      return quantize()
	          .domain([x0, x1])
	          .range(range);
	    };

	    return linearish(scale);
	  }

	  function threshold() {
	    var domain = [0.5],
	        range = [0, 1],
	        n = 1;

	    function scale(x) {
	      if (x <= x) return range[d3Array.bisect(domain, x, 0, n)];
	    }

	    scale.domain = function(_) {
	      return arguments.length ? (domain = slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
	    };

	    scale.range = function(_) {
	      return arguments.length ? (range = slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
	    };

	    scale.invertExtent = function(y) {
	      var i = range.indexOf(y);
	      return [domain[i - 1], domain[i]];
	    };

	    scale.copy = function() {
	      return threshold()
	          .domain(domain)
	          .range(range);
	    };

	    return scale;
	  }

	  var durationSecond = 1000;
	  var durationMinute = durationSecond * 60;
	  var durationHour = durationMinute * 60;
	  var durationDay = durationHour * 24;
	  var durationWeek = durationDay * 7;
	  var durationMonth = durationDay * 30;
	  var durationYear = durationDay * 365;
	  function date(t) {
	    return new Date(t);
	  }

	  function number$1(t) {
	    return t instanceof Date ? +t : +new Date(+t);
	  }

	  function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
	    var scale = continuous(deinterpolate, d3Interpolate.interpolateNumber),
	        invert = scale.invert,
	        domain = scale.domain;

	    var formatMillisecond = format(".%L"),
	        formatSecond = format(":%S"),
	        formatMinute = format("%I:%M"),
	        formatHour = format("%I %p"),
	        formatDay = format("%a %d"),
	        formatWeek = format("%b %d"),
	        formatMonth = format("%B"),
	        formatYear = format("%Y");

	    var tickIntervals = [
	      [second,  1,      durationSecond],
	      [second,  5,  5 * durationSecond],
	      [second, 15, 15 * durationSecond],
	      [second, 30, 30 * durationSecond],
	      [minute,  1,      durationMinute],
	      [minute,  5,  5 * durationMinute],
	      [minute, 15, 15 * durationMinute],
	      [minute, 30, 30 * durationMinute],
	      [  hour,  1,      durationHour  ],
	      [  hour,  3,  3 * durationHour  ],
	      [  hour,  6,  6 * durationHour  ],
	      [  hour, 12, 12 * durationHour  ],
	      [   day,  1,      durationDay   ],
	      [   day,  2,  2 * durationDay   ],
	      [  week,  1,      durationWeek  ],
	      [ month,  1,      durationMonth ],
	      [ month,  3,  3 * durationMonth ],
	      [  year,  1,      durationYear  ]
	    ];

	    function tickFormat(date) {
	      return (second(date) < date ? formatMillisecond
	          : minute(date) < date ? formatSecond
	          : hour(date) < date ? formatMinute
	          : day(date) < date ? formatHour
	          : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
	          : year(date) < date ? formatMonth
	          : formatYear)(date);
	    }

	    function tickInterval(interval, start, stop, step) {
	      if (interval == null) interval = 10;

	      // If a desired tick count is specified, pick a reasonable tick interval
	      // based on the extent of the domain and a rough estimate of tick size.
	      // Otherwise, assume interval is already a time interval and use it.
	      if (typeof interval === "number") {
	        var target = Math.abs(stop - start) / interval,
	            i = d3Array.bisector(function(i) { return i[2]; }).right(tickIntervals, target);
	        if (i === tickIntervals.length) {
	          step = d3Array.tickStep(start / durationYear, stop / durationYear, interval);
	          interval = year;
	        } else if (i) {
	          i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
	          step = i[1];
	          interval = i[0];
	        } else {
	          step = d3Array.tickStep(start, stop, interval);
	          interval = millisecond;
	        }
	      }

	      return step == null ? interval : interval.every(step);
	    }

	    scale.invert = function(y) {
	      return new Date(invert(y));
	    };

	    scale.domain = function(_) {
	      return arguments.length ? domain(map$1.call(_, number$1)) : domain().map(date);
	    };

	    scale.ticks = function(interval, step) {
	      var d = domain(),
	          t0 = d[0],
	          t1 = d[d.length - 1],
	          r = t1 < t0,
	          t;
	      if (r) t = t0, t0 = t1, t1 = t;
	      t = tickInterval(interval, t0, t1, step);
	      t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
	      return r ? t.reverse() : t;
	    };

	    scale.tickFormat = function(count, specifier) {
	      return specifier == null ? tickFormat : format(specifier);
	    };

	    scale.nice = function(interval, step) {
	      var d = domain();
	      return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
	          ? domain(nice(d, interval))
	          : scale;
	    };

	    scale.copy = function() {
	      return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
	    };

	    return scale;
	  }

	  function time() {
	    return calendar(d3Time.timeYear, d3Time.timeMonth, d3Time.timeWeek, d3Time.timeDay, d3Time.timeHour, d3Time.timeMinute, d3Time.timeSecond, d3Time.timeMillisecond, d3TimeFormat.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
	  }

	  function utcTime() {
	    return calendar(d3Time.utcYear, d3Time.utcMonth, d3Time.utcWeek, d3Time.utcDay, d3Time.utcHour, d3Time.utcMinute, d3Time.utcSecond, d3Time.utcMillisecond, d3TimeFormat.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
	  }

	  function colors(s) {
	    return s.match(/.{6}/g).map(function(x) {
	      return "#" + x;
	    });
	  }

	  var category10 = colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

	  var category20b = colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

	  var category20c = colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

	  var category20 = colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

	  var cubehelix$1 = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(300, 0.5, 0.0), d3Color.cubehelix(-240, 0.5, 1.0));

	  var warm = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(-100, 0.75, 0.35), d3Color.cubehelix(80, 1.50, 0.8));

	  var cool = d3Interpolate.interpolateCubehelixLong(d3Color.cubehelix(260, 0.75, 0.35), d3Color.cubehelix(80, 1.50, 0.8));

	  var rainbow = d3Color.cubehelix();

	  function rainbow$1(t) {
	    if (t < 0 || t > 1) t -= Math.floor(t);
	    var ts = Math.abs(t - 0.5);
	    rainbow.h = 360 * t - 100;
	    rainbow.s = 1.5 - 1.5 * ts;
	    rainbow.l = 0.8 - 0.9 * ts;
	    return rainbow + "";
	  }

	  function ramp(range) {
	    var n = range.length;
	    return function(t) {
	      return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
	    };
	  }

	  var viridis = ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

	  var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

	  var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

	  var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

	  function sequential(interpolator) {
	    var x0 = 0,
	        x1 = 1,
	        clamp = false;

	    function scale(x) {
	      var t = (x - x0) / (x1 - x0);
	      return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
	    }

	    scale.domain = function(_) {
	      return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
	    };

	    scale.clamp = function(_) {
	      return arguments.length ? (clamp = !!_, scale) : clamp;
	    };

	    scale.interpolator = function(_) {
	      return arguments.length ? (interpolator = _, scale) : interpolator;
	    };

	    scale.copy = function() {
	      return sequential(interpolator).domain([x0, x1]).clamp(clamp);
	    };

	    return linearish(scale);
	  }

	  exports.scaleBand = band;
	  exports.scalePoint = point;
	  exports.scaleIdentity = identity;
	  exports.scaleLinear = linear;
	  exports.scaleLog = log;
	  exports.scaleOrdinal = ordinal;
	  exports.scaleImplicit = implicit;
	  exports.scalePow = pow;
	  exports.scaleSqrt = sqrt;
	  exports.scaleQuantile = quantile$1;
	  exports.scaleQuantize = quantize;
	  exports.scaleThreshold = threshold;
	  exports.scaleTime = time;
	  exports.scaleUtc = utcTime;
	  exports.schemeCategory10 = category10;
	  exports.schemeCategory20b = category20b;
	  exports.schemeCategory20c = category20c;
	  exports.schemeCategory20 = category20;
	  exports.interpolateCubehelixDefault = cubehelix$1;
	  exports.interpolateRainbow = rainbow$1;
	  exports.interpolateWarm = warm;
	  exports.interpolateCool = cool;
	  exports.interpolateViridis = viridis;
	  exports.interpolateMagma = magma;
	  exports.interpolateInferno = inferno;
	  exports.interpolatePlasma = plasma;
	  exports.scaleSequential = sequential;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-collection/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var prefix = "$";

	  function Map() {}

	  Map.prototype = map.prototype = {
	    constructor: Map,
	    has: function(key) {
	      return (prefix + key) in this;
	    },
	    get: function(key) {
	      return this[prefix + key];
	    },
	    set: function(key, value) {
	      this[prefix + key] = value;
	      return this;
	    },
	    remove: function(key) {
	      var property = prefix + key;
	      return property in this && delete this[property];
	    },
	    clear: function() {
	      for (var property in this) if (property[0] === prefix) delete this[property];
	    },
	    keys: function() {
	      var keys = [];
	      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
	      return keys;
	    },
	    values: function() {
	      var values = [];
	      for (var property in this) if (property[0] === prefix) values.push(this[property]);
	      return values;
	    },
	    entries: function() {
	      var entries = [];
	      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
	      return entries;
	    },
	    size: function() {
	      var size = 0;
	      for (var property in this) if (property[0] === prefix) ++size;
	      return size;
	    },
	    empty: function() {
	      for (var property in this) if (property[0] === prefix) return false;
	      return true;
	    },
	    each: function(f) {
	      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
	    }
	  };

	  function map(object, f) {
	    var map = new Map;

	    // Copy constructor.
	    if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

	    // Index array by numeric index or specified key function.
	    else if (Array.isArray(object)) {
	      var i = -1,
	          n = object.length,
	          o;

	      if (f == null) while (++i < n) map.set(i, object[i]);
	      else while (++i < n) map.set(f(o = object[i], i, object), o);
	    }

	    // Convert object to map.
	    else if (object) for (var key in object) map.set(key, object[key]);

	    return map;
	  }

	  function nest() {
	    var keys = [],
	        sortKeys = [],
	        sortValues,
	        rollup,
	        nest;

	    function apply(array, depth, createResult, setResult) {
	      if (depth >= keys.length) return rollup != null
	          ? rollup(array) : (sortValues != null
	          ? array.sort(sortValues)
	          : array);

	      var i = -1,
	          n = array.length,
	          key = keys[depth++],
	          keyValue,
	          value,
	          valuesByKey = map(),
	          values,
	          result = createResult();

	      while (++i < n) {
	        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
	          values.push(value);
	        } else {
	          valuesByKey.set(keyValue, [value]);
	        }
	      }

	      valuesByKey.each(function(values, key) {
	        setResult(result, key, apply(values, depth, createResult, setResult));
	      });

	      return result;
	    }

	    function entries(map, depth) {
	      if (++depth > keys.length) return map;
	      var array, sortKey = sortKeys[depth - 1];
	      if (rollup != null && depth >= keys.length) array = map.entries();
	      else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
	      return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
	    }

	    return nest = {
	      object: function(array) { return apply(array, 0, createObject, setObject); },
	      map: function(array) { return apply(array, 0, createMap, setMap); },
	      entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
	      key: function(d) { keys.push(d); return nest; },
	      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
	      sortValues: function(order) { sortValues = order; return nest; },
	      rollup: function(f) { rollup = f; return nest; }
	    };
	  }

	  function createObject() {
	    return {};
	  }

	  function setObject(object, key, value) {
	    object[key] = value;
	  }

	  function createMap() {
	    return map();
	  }

	  function setMap(map, key, value) {
	    map.set(key, value);
	  }

	  function Set() {}

	  var proto = map.prototype;

	  Set.prototype = set.prototype = {
	    constructor: Set,
	    has: proto.has,
	    add: function(value) {
	      value += "";
	      this[prefix + value] = value;
	      return this;
	    },
	    remove: proto.remove,
	    clear: proto.clear,
	    values: proto.keys,
	    size: proto.size,
	    empty: proto.empty,
	    each: proto.each
	  };

	  function set(object, f) {
	    var set = new Set;

	    // Copy constructor.
	    if (object instanceof Set) object.each(function(value) { set.add(value); });

	    // Otherwise, assume it’s an array.
	    else if (object) {
	      var i = -1, n = object.length;
	      if (f == null) while (++i < n) set.add(object[i]);
	      else while (++i < n) set.add(f(object[i], i, object));
	    }

	    return set;
	  }

	  function keys(map) {
	    var keys = [];
	    for (var key in map) keys.push(key);
	    return keys;
	  }

	  function values(map) {
	    var values = [];
	    for (var key in map) values.push(map[key]);
	    return values;
	  }

	  function entries(map) {
	    var entries = [];
	    for (var key in map) entries.push({key: key, value: map[key]});
	    return entries;
	  }

	  exports.nest = nest;
	  exports.set = set;
	  exports.map = map;
	  exports.keys = keys;
	  exports.values = values;
	  exports.entries = entries;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-format/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  // Computes the decimal coefficient and exponent of the specified number x with
	  // significant digits p, where x is positive and p is in [1, 21] or undefined.
	  // For example, formatDecimal(1.23) returns ["123", 0].
	  function formatDecimal(x, p) {
	    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	    var i, coefficient = x.slice(0, i);

	    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	    return [
	      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	      +x.slice(i + 1)
	    ];
	  }

	  function exponent(x) {
	    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	  }

	  function formatGroup(grouping, thousands) {
	    return function(value, width) {
	      var i = value.length,
	          t = [],
	          j = 0,
	          g = grouping[0],
	          length = 0;

	      while (i > 0 && g > 0) {
	        if (length + g + 1 > width) g = Math.max(1, width - length);
	        t.push(value.substring(i -= g, i + g));
	        if ((length += g + 1) > width) break;
	        g = grouping[j = (j + 1) % grouping.length];
	      }

	      return t.reverse().join(thousands);
	    };
	  }

	  function formatDefault(x, p) {
	    x = x.toPrecision(p);

	    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
	      switch (x[i]) {
	        case ".": i0 = i1 = i; break;
	        case "0": if (i0 === 0) i0 = i; i1 = i; break;
	        case "e": break out;
	        default: if (i0 > 0) i0 = 0; break;
	      }
	    }

	    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
	  }

	  var prefixExponent;

	  function formatPrefixAuto(x, p) {
	    var d = formatDecimal(x, p);
	    if (!d) return x + "";
	    var coefficient = d[0],
	        exponent = d[1],
	        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	        n = coefficient.length;
	    return i === n ? coefficient
	        : i > n ? coefficient + new Array(i - n + 1).join("0")
	        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	  }

	  function formatRounded(x, p) {
	    var d = formatDecimal(x, p);
	    if (!d) return x + "";
	    var coefficient = d[0],
	        exponent = d[1];
	    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	  }

	  var formatTypes = {
	    "": formatDefault,
	    "%": function(x, p) { return (x * 100).toFixed(p); },
	    "b": function(x) { return Math.round(x).toString(2); },
	    "c": function(x) { return x + ""; },
	    "d": function(x) { return Math.round(x).toString(10); },
	    "e": function(x, p) { return x.toExponential(p); },
	    "f": function(x, p) { return x.toFixed(p); },
	    "g": function(x, p) { return x.toPrecision(p); },
	    "o": function(x) { return Math.round(x).toString(8); },
	    "p": function(x, p) { return formatRounded(x * 100, p); },
	    "r": formatRounded,
	    "s": formatPrefixAuto,
	    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	    "x": function(x) { return Math.round(x).toString(16); }
	  };

	  // [[fill]align][sign][symbol][0][width][,][.precision][type]
	  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

	  function formatSpecifier(specifier) {
	    return new FormatSpecifier(specifier);
	  }

	  function FormatSpecifier(specifier) {
	    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

	    var match,
	        fill = match[1] || " ",
	        align = match[2] || ">",
	        sign = match[3] || "-",
	        symbol = match[4] || "",
	        zero = !!match[5],
	        width = match[6] && +match[6],
	        comma = !!match[7],
	        precision = match[8] && +match[8].slice(1),
	        type = match[9] || "";

	    // The "n" type is an alias for ",g".
	    if (type === "n") comma = true, type = "g";

	    // Map invalid types to the default format.
	    else if (!formatTypes[type]) type = "";

	    // If zero fill is specified, padding goes after sign and before digits.
	    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

	    this.fill = fill;
	    this.align = align;
	    this.sign = sign;
	    this.symbol = symbol;
	    this.zero = zero;
	    this.width = width;
	    this.comma = comma;
	    this.precision = precision;
	    this.type = type;
	  }

	  FormatSpecifier.prototype.toString = function() {
	    return this.fill
	        + this.align
	        + this.sign
	        + this.symbol
	        + (this.zero ? "0" : "")
	        + (this.width == null ? "" : Math.max(1, this.width | 0))
	        + (this.comma ? "," : "")
	        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	        + this.type;
	  };

	  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

	  function identity(x) {
	    return x;
	  }

	  function formatLocale(locale) {
	    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
	        currency = locale.currency,
	        decimal = locale.decimal;

	    function newFormat(specifier) {
	      specifier = formatSpecifier(specifier);

	      var fill = specifier.fill,
	          align = specifier.align,
	          sign = specifier.sign,
	          symbol = specifier.symbol,
	          zero = specifier.zero,
	          width = specifier.width,
	          comma = specifier.comma,
	          precision = specifier.precision,
	          type = specifier.type;

	      // Compute the prefix and suffix.
	      // For SI-prefix, the suffix is lazily computed.
	      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

	      // What format function should we use?
	      // Is this an integer type?
	      // Can this type generate exponential notation?
	      var formatType = formatTypes[type],
	          maybeSuffix = !type || /[defgprs%]/.test(type);

	      // Set the default precision if not specified,
	      // or clamp the specified precision to the supported range.
	      // For significant precision, it must be in [1, 21].
	      // For fixed precision, it must be in [0, 20].
	      precision = precision == null ? (type ? 6 : 12)
	          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	          : Math.max(0, Math.min(20, precision));

	      function format(value) {
	        var valuePrefix = prefix,
	            valueSuffix = suffix,
	            i, n, c;

	        if (type === "c") {
	          valueSuffix = formatType(value) + valueSuffix;
	          value = "";
	        } else {
	          value = +value;

	          // Convert negative to positive, and compute the prefix.
	          // Note that -0 is not less than 0, but 1 / -0 is!
	          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

	          // Perform the initial formatting.
	          value = formatType(value, precision);

	          // If the original value was negative, it may be rounded to zero during
	          // formatting; treat this as (positive) zero.
	          if (valueNegative) {
	            i = -1, n = value.length;
	            valueNegative = false;
	            while (++i < n) {
	              if (c = value.charCodeAt(i), (48 < c && c < 58)
	                  || (type === "x" && 96 < c && c < 103)
	                  || (type === "X" && 64 < c && c < 71)) {
	                valueNegative = true;
	                break;
	              }
	            }
	          }

	          // Compute the prefix and suffix.
	          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

	          // Break the formatted value into the integer “value” part that can be
	          // grouped, and fractional or exponential “suffix” part that is not.
	          if (maybeSuffix) {
	            i = -1, n = value.length;
	            while (++i < n) {
	              if (c = value.charCodeAt(i), 48 > c || c > 57) {
	                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	                value = value.slice(0, i);
	                break;
	              }
	            }
	          }
	        }

	        // If the fill character is not "0", grouping is applied before padding.
	        if (comma && !zero) value = group(value, Infinity);

	        // Compute the padding.
	        var length = valuePrefix.length + value.length + valueSuffix.length,
	            padding = length < width ? new Array(width - length + 1).join(fill) : "";

	        // If the fill character is "0", grouping is applied after padding.
	        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	        // Reconstruct the final output based on the desired alignment.
	        switch (align) {
	          case "<": return valuePrefix + value + valueSuffix + padding;
	          case "=": return valuePrefix + padding + value + valueSuffix;
	          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
	        }
	        return padding + valuePrefix + value + valueSuffix;
	      }

	      format.toString = function() {
	        return specifier + "";
	      };

	      return format;
	    }

	    function formatPrefix(specifier, value) {
	      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	          k = Math.pow(10, -e),
	          prefix = prefixes[8 + e / 3];
	      return function(value) {
	        return f(k * value) + prefix;
	      };
	    }

	    return {
	      format: newFormat,
	      formatPrefix: formatPrefix
	    };
	  }

	  var locale;
	  defaultLocale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["$", ""]
	  });

	  function defaultLocale(definition) {
	    locale = formatLocale(definition);
	    exports.format = locale.format;
	    exports.formatPrefix = locale.formatPrefix;
	    return locale;
	  }

	  function precisionFixed(step) {
	    return Math.max(0, -exponent(Math.abs(step)));
	  }

	  function precisionPrefix(step, value) {
	    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	  }

	  function precisionRound(step, max) {
	    step = Math.abs(step), max = Math.abs(max) - step;
	    return Math.max(0, exponent(max) - exponent(step)) + 1;
	  }

	  exports.formatDefaultLocale = defaultLocale;
	  exports.formatLocale = formatLocale;
	  exports.formatSpecifier = formatSpecifier;
	  exports.precisionFixed = precisionFixed;
	  exports.precisionPrefix = precisionPrefix;
	  exports.precisionRound = precisionRound;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-time/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var t0 = new Date;
	  var t1 = new Date;
	  function newInterval(floori, offseti, count, field) {

	    function interval(date) {
	      return floori(date = new Date(+date)), date;
	    }

	    interval.floor = interval;

	    interval.ceil = function(date) {
	      return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	    };

	    interval.round = function(date) {
	      var d0 = interval(date),
	          d1 = interval.ceil(date);
	      return date - d0 < d1 - date ? d0 : d1;
	    };

	    interval.offset = function(date, step) {
	      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	    };

	    interval.range = function(start, stop, step) {
	      var range = [];
	      start = interval.ceil(start);
	      step = step == null ? 1 : Math.floor(step);
	      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	      do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
	      return range;
	    };

	    interval.filter = function(test) {
	      return newInterval(function(date) {
	        while (floori(date), !test(date)) date.setTime(date - 1);
	      }, function(date, step) {
	        while (--step >= 0) while (offseti(date, 1), !test(date));
	      });
	    };

	    if (count) {
	      interval.count = function(start, end) {
	        t0.setTime(+start), t1.setTime(+end);
	        floori(t0), floori(t1);
	        return Math.floor(count(t0, t1));
	      };

	      interval.every = function(step) {
	        step = Math.floor(step);
	        return !isFinite(step) || !(step > 0) ? null
	            : !(step > 1) ? interval
	            : interval.filter(field
	                ? function(d) { return field(d) % step === 0; }
	                : function(d) { return interval.count(0, d) % step === 0; });
	      };
	    }

	    return interval;
	  }

	  var millisecond = newInterval(function() {
	    // noop
	  }, function(date, step) {
	    date.setTime(+date + step);
	  }, function(start, end) {
	    return end - start;
	  });

	  // An optimized implementation for this simple case.
	  millisecond.every = function(k) {
	    k = Math.floor(k);
	    if (!isFinite(k) || !(k > 0)) return null;
	    if (!(k > 1)) return millisecond;
	    return newInterval(function(date) {
	      date.setTime(Math.floor(date / k) * k);
	    }, function(date, step) {
	      date.setTime(+date + step * k);
	    }, function(start, end) {
	      return (end - start) / k;
	    });
	  };

	  var milliseconds = millisecond.range;

	  var durationSecond = 1e3;
	  var durationMinute = 6e4;
	  var durationHour = 36e5;
	  var durationDay = 864e5;
	  var durationWeek = 6048e5;

	  var second = newInterval(function(date) {
	    date.setTime(Math.floor(date / durationSecond) * durationSecond);
	  }, function(date, step) {
	    date.setTime(+date + step * durationSecond);
	  }, function(start, end) {
	    return (end - start) / durationSecond;
	  }, function(date) {
	    return date.getUTCSeconds();
	  });

	  var seconds = second.range;

	  var minute = newInterval(function(date) {
	    date.setTime(Math.floor(date / durationMinute) * durationMinute);
	  }, function(date, step) {
	    date.setTime(+date + step * durationMinute);
	  }, function(start, end) {
	    return (end - start) / durationMinute;
	  }, function(date) {
	    return date.getMinutes();
	  });

	  var minutes = minute.range;

	  var hour = newInterval(function(date) {
	    var offset = date.getTimezoneOffset() * durationMinute % durationHour;
	    if (offset < 0) offset += durationHour;
	    date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
	  }, function(date, step) {
	    date.setTime(+date + step * durationHour);
	  }, function(start, end) {
	    return (end - start) / durationHour;
	  }, function(date) {
	    return date.getHours();
	  });

	  var hours = hour.range;

	  var day = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
	  }, function(date) {
	    return date.getDate() - 1;
	  });

	  var days = day.range;

	  function weekday(i) {
	    return newInterval(function(date) {
	      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	      date.setHours(0, 0, 0, 0);
	    }, function(date, step) {
	      date.setDate(date.getDate() + step * 7);
	    }, function(start, end) {
	      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
	    });
	  }

	  var sunday = weekday(0);
	  var monday = weekday(1);
	  var tuesday = weekday(2);
	  var wednesday = weekday(3);
	  var thursday = weekday(4);
	  var friday = weekday(5);
	  var saturday = weekday(6);

	  var sundays = sunday.range;
	  var mondays = monday.range;
	  var tuesdays = tuesday.range;
	  var wednesdays = wednesday.range;
	  var thursdays = thursday.range;
	  var fridays = friday.range;
	  var saturdays = saturday.range;

	  var month = newInterval(function(date) {
	    date.setDate(1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setMonth(date.getMonth() + step);
	  }, function(start, end) {
	    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	  }, function(date) {
	    return date.getMonth();
	  });

	  var months = month.range;

	  var year = newInterval(function(date) {
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step);
	  }, function(start, end) {
	    return end.getFullYear() - start.getFullYear();
	  }, function(date) {
	    return date.getFullYear();
	  });

	  // An optimized implementation for this simple case.
	  year.every = function(k) {
	    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	      date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	      date.setMonth(0, 1);
	      date.setHours(0, 0, 0, 0);
	    }, function(date, step) {
	      date.setFullYear(date.getFullYear() + step * k);
	    });
	  };

	  var years = year.range;

	  var utcMinute = newInterval(function(date) {
	    date.setUTCSeconds(0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * durationMinute);
	  }, function(start, end) {
	    return (end - start) / durationMinute;
	  }, function(date) {
	    return date.getUTCMinutes();
	  });

	  var utcMinutes = utcMinute.range;

	  var utcHour = newInterval(function(date) {
	    date.setUTCMinutes(0, 0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * durationHour);
	  }, function(start, end) {
	    return (end - start) / durationHour;
	  }, function(date) {
	    return date.getUTCHours();
	  });

	  var utcHours = utcHour.range;

	  var utcDay = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step);
	  }, function(start, end) {
	    return (end - start) / durationDay;
	  }, function(date) {
	    return date.getUTCDate() - 1;
	  });

	  var utcDays = utcDay.range;

	  function utcWeekday(i) {
	    return newInterval(function(date) {
	      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	      date.setUTCHours(0, 0, 0, 0);
	    }, function(date, step) {
	      date.setUTCDate(date.getUTCDate() + step * 7);
	    }, function(start, end) {
	      return (end - start) / durationWeek;
	    });
	  }

	  var utcSunday = utcWeekday(0);
	  var utcMonday = utcWeekday(1);
	  var utcTuesday = utcWeekday(2);
	  var utcWednesday = utcWeekday(3);
	  var utcThursday = utcWeekday(4);
	  var utcFriday = utcWeekday(5);
	  var utcSaturday = utcWeekday(6);

	  var utcSundays = utcSunday.range;
	  var utcMondays = utcMonday.range;
	  var utcTuesdays = utcTuesday.range;
	  var utcWednesdays = utcWednesday.range;
	  var utcThursdays = utcThursday.range;
	  var utcFridays = utcFriday.range;
	  var utcSaturdays = utcSaturday.range;

	  var utcMonth = newInterval(function(date) {
	    date.setUTCDate(1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCMonth(date.getUTCMonth() + step);
	  }, function(start, end) {
	    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	  }, function(date) {
	    return date.getUTCMonth();
	  });

	  var utcMonths = utcMonth.range;

	  var utcYear = newInterval(function(date) {
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step);
	  }, function(start, end) {
	    return end.getUTCFullYear() - start.getUTCFullYear();
	  }, function(date) {
	    return date.getUTCFullYear();
	  });

	  // An optimized implementation for this simple case.
	  utcYear.every = function(k) {
	    return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	      date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	      date.setUTCMonth(0, 1);
	      date.setUTCHours(0, 0, 0, 0);
	    }, function(date, step) {
	      date.setUTCFullYear(date.getUTCFullYear() + step * k);
	    });
	  };

	  var utcYears = utcYear.range;

	  exports.timeInterval = newInterval;
	  exports.timeMillisecond = millisecond;
	  exports.timeMilliseconds = milliseconds;
	  exports.utcMillisecond = millisecond;
	  exports.utcMilliseconds = milliseconds;
	  exports.timeSecond = second;
	  exports.timeSeconds = seconds;
	  exports.utcSecond = second;
	  exports.utcSeconds = seconds;
	  exports.timeMinute = minute;
	  exports.timeMinutes = minutes;
	  exports.timeHour = hour;
	  exports.timeHours = hours;
	  exports.timeDay = day;
	  exports.timeDays = days;
	  exports.timeWeek = sunday;
	  exports.timeWeeks = sundays;
	  exports.timeSunday = sunday;
	  exports.timeSundays = sundays;
	  exports.timeMonday = monday;
	  exports.timeMondays = mondays;
	  exports.timeTuesday = tuesday;
	  exports.timeTuesdays = tuesdays;
	  exports.timeWednesday = wednesday;
	  exports.timeWednesdays = wednesdays;
	  exports.timeThursday = thursday;
	  exports.timeThursdays = thursdays;
	  exports.timeFriday = friday;
	  exports.timeFridays = fridays;
	  exports.timeSaturday = saturday;
	  exports.timeSaturdays = saturdays;
	  exports.timeMonth = month;
	  exports.timeMonths = months;
	  exports.timeYear = year;
	  exports.timeYears = years;
	  exports.utcMinute = utcMinute;
	  exports.utcMinutes = utcMinutes;
	  exports.utcHour = utcHour;
	  exports.utcHours = utcHours;
	  exports.utcDay = utcDay;
	  exports.utcDays = utcDays;
	  exports.utcWeek = utcSunday;
	  exports.utcWeeks = utcSundays;
	  exports.utcSunday = utcSunday;
	  exports.utcSundays = utcSundays;
	  exports.utcMonday = utcMonday;
	  exports.utcMondays = utcMondays;
	  exports.utcTuesday = utcTuesday;
	  exports.utcTuesdays = utcTuesdays;
	  exports.utcWednesday = utcWednesday;
	  exports.utcWednesdays = utcWednesdays;
	  exports.utcThursday = utcThursday;
	  exports.utcThursdays = utcThursdays;
	  exports.utcFriday = utcFriday;
	  exports.utcFridays = utcFridays;
	  exports.utcSaturday = utcSaturday;
	  exports.utcSaturdays = utcSaturdays;
	  exports.utcMonth = utcMonth;
	  exports.utcMonths = utcMonths;
	  exports.utcYear = utcYear;
	  exports.utcYears = utcYears;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-time-format/ Version 2.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(14)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-time'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3));
	}(this, function (exports,d3Time) { 'use strict';

	  function localDate(d) {
	    if (0 <= d.y && d.y < 100) {
	      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	      date.setFullYear(d.y);
	      return date;
	    }
	    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	  }

	  function utcDate(d) {
	    if (0 <= d.y && d.y < 100) {
	      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	      date.setUTCFullYear(d.y);
	      return date;
	    }
	    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	  }

	  function newYear(y) {
	    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	  }

	  function formatLocale(locale) {
	    var locale_dateTime = locale.dateTime,
	        locale_date = locale.date,
	        locale_time = locale.time,
	        locale_periods = locale.periods,
	        locale_weekdays = locale.days,
	        locale_shortWeekdays = locale.shortDays,
	        locale_months = locale.months,
	        locale_shortMonths = locale.shortMonths;

	    var periodRe = formatRe(locale_periods),
	        periodLookup = formatLookup(locale_periods),
	        weekdayRe = formatRe(locale_weekdays),
	        weekdayLookup = formatLookup(locale_weekdays),
	        shortWeekdayRe = formatRe(locale_shortWeekdays),
	        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	        monthRe = formatRe(locale_months),
	        monthLookup = formatLookup(locale_months),
	        shortMonthRe = formatRe(locale_shortMonths),
	        shortMonthLookup = formatLookup(locale_shortMonths);

	    var formats = {
	      "a": formatShortWeekday,
	      "A": formatWeekday,
	      "b": formatShortMonth,
	      "B": formatMonth,
	      "c": null,
	      "d": formatDayOfMonth,
	      "e": formatDayOfMonth,
	      "H": formatHour24,
	      "I": formatHour12,
	      "j": formatDayOfYear,
	      "L": formatMilliseconds,
	      "m": formatMonthNumber,
	      "M": formatMinutes,
	      "p": formatPeriod,
	      "S": formatSeconds,
	      "U": formatWeekNumberSunday,
	      "w": formatWeekdayNumber,
	      "W": formatWeekNumberMonday,
	      "x": null,
	      "X": null,
	      "y": formatYear,
	      "Y": formatFullYear,
	      "Z": formatZone,
	      "%": formatLiteralPercent
	    };

	    var utcFormats = {
	      "a": formatUTCShortWeekday,
	      "A": formatUTCWeekday,
	      "b": formatUTCShortMonth,
	      "B": formatUTCMonth,
	      "c": null,
	      "d": formatUTCDayOfMonth,
	      "e": formatUTCDayOfMonth,
	      "H": formatUTCHour24,
	      "I": formatUTCHour12,
	      "j": formatUTCDayOfYear,
	      "L": formatUTCMilliseconds,
	      "m": formatUTCMonthNumber,
	      "M": formatUTCMinutes,
	      "p": formatUTCPeriod,
	      "S": formatUTCSeconds,
	      "U": formatUTCWeekNumberSunday,
	      "w": formatUTCWeekdayNumber,
	      "W": formatUTCWeekNumberMonday,
	      "x": null,
	      "X": null,
	      "y": formatUTCYear,
	      "Y": formatUTCFullYear,
	      "Z": formatUTCZone,
	      "%": formatLiteralPercent
	    };

	    var parses = {
	      "a": parseShortWeekday,
	      "A": parseWeekday,
	      "b": parseShortMonth,
	      "B": parseMonth,
	      "c": parseLocaleDateTime,
	      "d": parseDayOfMonth,
	      "e": parseDayOfMonth,
	      "H": parseHour24,
	      "I": parseHour24,
	      "j": parseDayOfYear,
	      "L": parseMilliseconds,
	      "m": parseMonthNumber,
	      "M": parseMinutes,
	      "p": parsePeriod,
	      "S": parseSeconds,
	      "U": parseWeekNumberSunday,
	      "w": parseWeekdayNumber,
	      "W": parseWeekNumberMonday,
	      "x": parseLocaleDate,
	      "X": parseLocaleTime,
	      "y": parseYear,
	      "Y": parseFullYear,
	      "Z": parseZone,
	      "%": parseLiteralPercent
	    };

	    // These recursive directive definitions must be deferred.
	    formats.x = newFormat(locale_date, formats);
	    formats.X = newFormat(locale_time, formats);
	    formats.c = newFormat(locale_dateTime, formats);
	    utcFormats.x = newFormat(locale_date, utcFormats);
	    utcFormats.X = newFormat(locale_time, utcFormats);
	    utcFormats.c = newFormat(locale_dateTime, utcFormats);

	    function newFormat(specifier, formats) {
	      return function(date) {
	        var string = [],
	            i = -1,
	            j = 0,
	            n = specifier.length,
	            c,
	            pad,
	            format;

	        if (!(date instanceof Date)) date = new Date(+date);

	        while (++i < n) {
	          if (specifier.charCodeAt(i) === 37) {
	            string.push(specifier.slice(j, i));
	            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	            else pad = c === "e" ? " " : "0";
	            if (format = formats[c]) c = format(date, pad);
	            string.push(c);
	            j = i + 1;
	          }
	        }

	        string.push(specifier.slice(j, i));
	        return string.join("");
	      };
	    }

	    function newParse(specifier, newDate) {
	      return function(string) {
	        var d = newYear(1900),
	            i = parseSpecifier(d, specifier, string += "", 0);
	        if (i != string.length) return null;

	        // The am-pm flag is 0 for AM, and 1 for PM.
	        if ("p" in d) d.H = d.H % 12 + d.p * 12;

	        // Convert day-of-week and week-of-year to day-of-year.
	        if ("W" in d || "U" in d) {
	          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	          var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	          d.m = 0;
	          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
	        }

	        // If a time zone is specified, all fields are interpreted as UTC and then
	        // offset according to the specified time zone.
	        if ("Z" in d) {
	          d.H += d.Z / 100 | 0;
	          d.M += d.Z % 100;
	          return utcDate(d);
	        }

	        // Otherwise, all fields are in local time.
	        return newDate(d);
	      };
	    }

	    function parseSpecifier(d, specifier, string, j) {
	      var i = 0,
	          n = specifier.length,
	          m = string.length,
	          c,
	          parse;

	      while (i < n) {
	        if (j >= m) return -1;
	        c = specifier.charCodeAt(i++);
	        if (c === 37) {
	          c = specifier.charAt(i++);
	          parse = parses[c in pads ? specifier.charAt(i++) : c];
	          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	        } else if (c != string.charCodeAt(j++)) {
	          return -1;
	        }
	      }

	      return j;
	    }

	    function parsePeriod(d, string, i) {
	      var n = periodRe.exec(string.slice(i));
	      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }

	    function parseShortWeekday(d, string, i) {
	      var n = shortWeekdayRe.exec(string.slice(i));
	      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }

	    function parseWeekday(d, string, i) {
	      var n = weekdayRe.exec(string.slice(i));
	      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }

	    function parseShortMonth(d, string, i) {
	      var n = shortMonthRe.exec(string.slice(i));
	      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }

	    function parseMonth(d, string, i) {
	      var n = monthRe.exec(string.slice(i));
	      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }

	    function parseLocaleDateTime(d, string, i) {
	      return parseSpecifier(d, locale_dateTime, string, i);
	    }

	    function parseLocaleDate(d, string, i) {
	      return parseSpecifier(d, locale_date, string, i);
	    }

	    function parseLocaleTime(d, string, i) {
	      return parseSpecifier(d, locale_time, string, i);
	    }

	    function formatShortWeekday(d) {
	      return locale_shortWeekdays[d.getDay()];
	    }

	    function formatWeekday(d) {
	      return locale_weekdays[d.getDay()];
	    }

	    function formatShortMonth(d) {
	      return locale_shortMonths[d.getMonth()];
	    }

	    function formatMonth(d) {
	      return locale_months[d.getMonth()];
	    }

	    function formatPeriod(d) {
	      return locale_periods[+(d.getHours() >= 12)];
	    }

	    function formatUTCShortWeekday(d) {
	      return locale_shortWeekdays[d.getUTCDay()];
	    }

	    function formatUTCWeekday(d) {
	      return locale_weekdays[d.getUTCDay()];
	    }

	    function formatUTCShortMonth(d) {
	      return locale_shortMonths[d.getUTCMonth()];
	    }

	    function formatUTCMonth(d) {
	      return locale_months[d.getUTCMonth()];
	    }

	    function formatUTCPeriod(d) {
	      return locale_periods[+(d.getUTCHours() >= 12)];
	    }

	    return {
	      format: function(specifier) {
	        var f = newFormat(specifier += "", formats);
	        f.toString = function() { return specifier; };
	        return f;
	      },
	      parse: function(specifier) {
	        var p = newParse(specifier += "", localDate);
	        p.toString = function() { return specifier; };
	        return p;
	      },
	      utcFormat: function(specifier) {
	        var f = newFormat(specifier += "", utcFormats);
	        f.toString = function() { return specifier; };
	        return f;
	      },
	      utcParse: function(specifier) {
	        var p = newParse(specifier, utcDate);
	        p.toString = function() { return specifier; };
	        return p;
	      }
	    };
	  }

	  var pads = {"-": "", "_": " ", "0": "0"};
	  var numberRe = /^\s*\d+/;
	  var percentRe = /^%/;
	  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	  function pad(value, fill, width) {
	    var sign = value < 0 ? "-" : "",
	        string = (sign ? -value : value) + "",
	        length = string.length;
	    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	  }

	  function requote(s) {
	    return s.replace(requoteRe, "\\$&");
	  }

	  function formatRe(names) {
	    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	  }

	  function formatLookup(names) {
	    var map = {}, i = -1, n = names.length;
	    while (++i < n) map[names[i].toLowerCase()] = i;
	    return map;
	  }

	  function parseWeekdayNumber(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 1));
	    return n ? (d.w = +n[0], i + n[0].length) : -1;
	  }

	  function parseWeekNumberSunday(d, string, i) {
	    var n = numberRe.exec(string.slice(i));
	    return n ? (d.U = +n[0], i + n[0].length) : -1;
	  }

	  function parseWeekNumberMonday(d, string, i) {
	    var n = numberRe.exec(string.slice(i));
	    return n ? (d.W = +n[0], i + n[0].length) : -1;
	  }

	  function parseFullYear(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 4));
	    return n ? (d.y = +n[0], i + n[0].length) : -1;
	  }

	  function parseYear(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	  }

	  function parseZone(d, string, i) {
	    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
	    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	  }

	  function parseMonthNumber(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	  }

	  function parseDayOfMonth(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.d = +n[0], i + n[0].length) : -1;
	  }

	  function parseDayOfYear(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 3));
	    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	  }

	  function parseHour24(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.H = +n[0], i + n[0].length) : -1;
	  }

	  function parseMinutes(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.M = +n[0], i + n[0].length) : -1;
	  }

	  function parseSeconds(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.S = +n[0], i + n[0].length) : -1;
	  }

	  function parseMilliseconds(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 3));
	    return n ? (d.L = +n[0], i + n[0].length) : -1;
	  }

	  function parseLiteralPercent(d, string, i) {
	    var n = percentRe.exec(string.slice(i, i + 1));
	    return n ? i + n[0].length : -1;
	  }

	  function formatDayOfMonth(d, p) {
	    return pad(d.getDate(), p, 2);
	  }

	  function formatHour24(d, p) {
	    return pad(d.getHours(), p, 2);
	  }

	  function formatHour12(d, p) {
	    return pad(d.getHours() % 12 || 12, p, 2);
	  }

	  function formatDayOfYear(d, p) {
	    return pad(1 + d3Time.timeDay.count(d3Time.timeYear(d), d), p, 3);
	  }

	  function formatMilliseconds(d, p) {
	    return pad(d.getMilliseconds(), p, 3);
	  }

	  function formatMonthNumber(d, p) {
	    return pad(d.getMonth() + 1, p, 2);
	  }

	  function formatMinutes(d, p) {
	    return pad(d.getMinutes(), p, 2);
	  }

	  function formatSeconds(d, p) {
	    return pad(d.getSeconds(), p, 2);
	  }

	  function formatWeekNumberSunday(d, p) {
	    return pad(d3Time.timeSunday.count(d3Time.timeYear(d), d), p, 2);
	  }

	  function formatWeekdayNumber(d) {
	    return d.getDay();
	  }

	  function formatWeekNumberMonday(d, p) {
	    return pad(d3Time.timeMonday.count(d3Time.timeYear(d), d), p, 2);
	  }

	  function formatYear(d, p) {
	    return pad(d.getFullYear() % 100, p, 2);
	  }

	  function formatFullYear(d, p) {
	    return pad(d.getFullYear() % 10000, p, 4);
	  }

	  function formatZone(d) {
	    var z = d.getTimezoneOffset();
	    return (z > 0 ? "-" : (z *= -1, "+"))
	        + pad(z / 60 | 0, "0", 2)
	        + pad(z % 60, "0", 2);
	  }

	  function formatUTCDayOfMonth(d, p) {
	    return pad(d.getUTCDate(), p, 2);
	  }

	  function formatUTCHour24(d, p) {
	    return pad(d.getUTCHours(), p, 2);
	  }

	  function formatUTCHour12(d, p) {
	    return pad(d.getUTCHours() % 12 || 12, p, 2);
	  }

	  function formatUTCDayOfYear(d, p) {
	    return pad(1 + d3Time.utcDay.count(d3Time.utcYear(d), d), p, 3);
	  }

	  function formatUTCMilliseconds(d, p) {
	    return pad(d.getUTCMilliseconds(), p, 3);
	  }

	  function formatUTCMonthNumber(d, p) {
	    return pad(d.getUTCMonth() + 1, p, 2);
	  }

	  function formatUTCMinutes(d, p) {
	    return pad(d.getUTCMinutes(), p, 2);
	  }

	  function formatUTCSeconds(d, p) {
	    return pad(d.getUTCSeconds(), p, 2);
	  }

	  function formatUTCWeekNumberSunday(d, p) {
	    return pad(d3Time.utcSunday.count(d3Time.utcYear(d), d), p, 2);
	  }

	  function formatUTCWeekdayNumber(d) {
	    return d.getUTCDay();
	  }

	  function formatUTCWeekNumberMonday(d, p) {
	    return pad(d3Time.utcMonday.count(d3Time.utcYear(d), d), p, 2);
	  }

	  function formatUTCYear(d, p) {
	    return pad(d.getUTCFullYear() % 100, p, 2);
	  }

	  function formatUTCFullYear(d, p) {
	    return pad(d.getUTCFullYear() % 10000, p, 4);
	  }

	  function formatUTCZone() {
	    return "+0000";
	  }

	  function formatLiteralPercent() {
	    return "%";
	  }

	  var locale;
	  defaultLocale({
	    dateTime: "%x, %X",
	    date: "%-m/%-d/%Y",
	    time: "%-I:%M:%S %p",
	    periods: ["AM", "PM"],
	    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	  });

	  function defaultLocale(definition) {
	    locale = formatLocale(definition);
	    exports.timeFormat = locale.format;
	    exports.timeParse = locale.parse;
	    exports.utcFormat = locale.utcFormat;
	    exports.utcParse = locale.utcParse;
	    return locale;
	  }

	  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	  function formatIsoNative(date) {
	    return date.toISOString();
	  }

	  var formatIso = Date.prototype.toISOString
	      ? formatIsoNative
	      : exports.utcFormat(isoSpecifier);

	  function parseIsoNative(string) {
	    var date = new Date(string);
	    return isNaN(date) ? null : date;
	  }

	  var parseIso = +new Date("2000-01-01T00:00:00.000Z")
	      ? parseIsoNative
	      : exports.utcParse(isoSpecifier);

	  exports.timeFormatDefaultLocale = defaultLocale;
	  exports.timeFormatLocale = formatLocale;
	  exports.isoFormat = formatIso;
	  exports.isoParse = parseIso;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-force/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(17), __webpack_require__(12), __webpack_require__(6), __webpack_require__(7)) :
	  typeof define === 'function' && define.amd ? define(['exports', 'd3-quadtree', 'd3-collection', 'd3-dispatch', 'd3-timer'], factory) :
	  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3));
	}(this, function (exports,d3Quadtree,d3Collection,d3Dispatch,d3Timer) { 'use strict';

	  function center(x, y) {
	    var nodes;

	    if (x == null) x = 0;
	    if (y == null) y = 0;

	    function force() {
	      var i,
	          n = nodes.length,
	          node,
	          sx = 0,
	          sy = 0;

	      for (i = 0; i < n; ++i) {
	        node = nodes[i], sx += node.x, sy += node.y;
	      }

	      for (sx = sx / n - x, sy = sy / n - y, i = 0; i < n; ++i) {
	        node = nodes[i], node.x -= sx, node.y -= sy;
	      }
	    }

	    force.initialize = function(_) {
	      nodes = _;
	    };

	    force.x = function(_) {
	      return arguments.length ? (x = +_, force) : x;
	    };

	    force.y = function(_) {
	      return arguments.length ? (y = +_, force) : y;
	    };

	    return force;
	  }

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function jiggle() {
	    return (Math.random() - 0.5) * 1e-6;
	  }

	  function x(d) {
	    return d.x + d.vx;
	  }

	  function y(d) {
	    return d.y + d.vy;
	  }

	  function collide(radius) {
	    var nodes,
	        radii,
	        strength = 1,
	        iterations = 1;

	    if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

	    function force() {
	      var i, n = nodes.length,
	          tree,
	          node,
	          xi,
	          yi,
	          ri,
	          ri2;

	      for (var k = 0; k < iterations; ++k) {
	        tree = d3Quadtree.quadtree(nodes, x, y).visitAfter(prepare);
	        for (i = 0; i < n; ++i) {
	          node = nodes[i];
	          ri = radii[i], ri2 = ri * ri;
	          xi = node.x + node.vx;
	          yi = node.y + node.vy;
	          tree.visit(apply);
	        }
	      }

	      function apply(quad, x0, y0, x1, y1) {
	        var data = quad.data, rj = quad.r, r = ri + rj;
	        if (data) {
	          if (data.index > i) {
	            var x = xi - data.x - data.vx,
	                y = yi - data.y - data.vy,
	                l = x * x + y * y;
	            if (l < r * r) {
	              if (x === 0) x = jiggle(), l += x * x;
	              if (y === 0) y = jiggle(), l += y * y;
	              l = (r - (l = Math.sqrt(l))) / l * strength;
	              node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
	              node.vy += (y *= l) * r;
	              data.vx -= x * (r = 1 - r);
	              data.vy -= y * r;
	            }
	          }
	          return;
	        }
	        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
	      }
	    }

	    function prepare(quad) {
	      if (quad.data) return quad.r = radii[quad.data.index];
	      for (var i = quad.r = 0; i < 4; ++i) {
	        if (quad[i] && quad[i].r > quad.r) {
	          quad.r = quad[i].r;
	        }
	      }
	    }

	    force.initialize = function(_) {
	      var i, n = (nodes = _).length; radii = new Array(n);
	      for (i = 0; i < n; ++i) radii[i] = +radius(nodes[i], i, nodes);
	    };

	    force.iterations = function(_) {
	      return arguments.length ? (iterations = +_, force) : iterations;
	    };

	    force.strength = function(_) {
	      return arguments.length ? (strength = +_, force) : strength;
	    };

	    force.radius = function(_) {
	      return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), force) : radius;
	    };

	    return force;
	  }

	  function index(d, i) {
	    return i;
	  }

	  function link(links) {
	    var id = index,
	        strength = defaultStrength,
	        strengths,
	        distance = constant(30),
	        distances,
	        nodes,
	        count,
	        bias,
	        iterations = 1;

	    if (links == null) links = [];

	    function defaultStrength(link) {
	      return 1 / Math.min(count[link.source.index], count[link.target.index]);
	    }

	    function force(alpha) {
	      for (var k = 0, n = links.length; k < iterations; ++k) {
	        for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
	          link = links[i], source = link.source, target = link.target;
	          x = target.x + target.vx - source.x - source.vx || jiggle();
	          y = target.y + target.vy - source.y - source.vy || jiggle();
	          l = Math.sqrt(x * x + y * y);
	          l = (l - distances[i]) / l * alpha * strengths[i];
	          x *= l, y *= l;
	          target.vx -= x * (b = bias[i]);
	          target.vy -= y * b;
	          source.vx += x * (b = 1 - b);
	          source.vy += y * b;
	        }
	      }
	    }

	    function initialize() {
	      if (!nodes) return;

	      var i,
	          n = nodes.length,
	          m = links.length,
	          nodeById = d3Collection.map(nodes, id),
	          link;

	      for (i = 0, count = new Array(n); i < n; ++i) {
	        count[i] = 0;
	      }

	      for (i = 0; i < m; ++i) {
	        link = links[i], link.index = i;
	        if (typeof link.source !== "object") link.source = nodeById.get(link.source);
	        if (typeof link.target !== "object") link.target = nodeById.get(link.target);
	        ++count[link.source.index], ++count[link.target.index];
	      }

	      for (i = 0, bias = new Array(m); i < m; ++i) {
	        link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
	      }

	      strengths = new Array(m), initializeStrength();
	      distances = new Array(m), initializeDistance();
	    }

	    function initializeStrength() {
	      if (!nodes) return;

	      for (var i = 0, n = links.length; i < n; ++i) {
	        strengths[i] = +strength(links[i], i, links);
	      }
	    }

	    function initializeDistance() {
	      if (!nodes) return;

	      for (var i = 0, n = links.length; i < n; ++i) {
	        distances[i] = +distance(links[i], i, links);
	      }
	    }

	    force.initialize = function(_) {
	      nodes = _;
	      initialize();
	    };

	    force.links = function(_) {
	      return arguments.length ? (links = _, initialize(), force) : links;
	    };

	    force.id = function(_) {
	      return arguments.length ? (id = _, force) : id;
	    };

	    force.iterations = function(_) {
	      return arguments.length ? (iterations = +_, force) : iterations;
	    };

	    force.strength = function(_) {
	      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
	    };

	    force.distance = function(_) {
	      return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), initializeDistance(), force) : distance;
	    };

	    return force;
	  }

	  function x$1(d) {
	    return d.x;
	  }

	  function y$1(d) {
	    return d.y;
	  }

	  var initialRadius = 10;
	  var initialAngle = Math.PI * (3 - Math.sqrt(5));
	  function simulation(nodes) {
	    var simulation,
	        alpha = 1,
	        alphaMin = 0.001,
	        alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
	        alphaTarget = 0,
	        velocityDecay = 0.6,
	        forces = d3Collection.map(),
	        stepper = d3Timer.timer(step),
	        event = d3Dispatch.dispatch("tick", "end");

	    if (nodes == null) nodes = [];

	    function step() {
	      tick();
	      event.call("tick", simulation);
	      if (alpha < alphaMin) {
	        stepper.stop();
	        event.call("end", simulation);
	      }
	    }

	    function tick() {
	      var i, n = nodes.length, node;

	      alpha += (alphaTarget - alpha) * alphaDecay;

	      forces.each(function(force) {
	        force(alpha);
	      });

	      for (i = 0; i < n; ++i) {
	        node = nodes[i];
	        if (node.fx == null) node.x += node.vx *= velocityDecay;
	        else node.x = node.fx, node.vx = 0;
	        if (node.fy == null) node.y += node.vy *= velocityDecay;
	        else node.y = node.fy, node.vy = 0;
	      }
	    }

	    function initializeNodes() {
	      for (var i = 0, n = nodes.length, node; i < n; ++i) {
	        node = nodes[i], node.index = i;
	        if (isNaN(node.x) || isNaN(node.y)) {
	          var radius = initialRadius * Math.sqrt(i), angle = i * initialAngle;
	          node.x = radius * Math.cos(angle);
	          node.y = radius * Math.sin(angle);
	        }
	        if (isNaN(node.vx) || isNaN(node.vy)) {
	          node.vx = node.vy = 0;
	        }
	      }
	    }

	    function initializeForce(force) {
	      if (force.initialize) force.initialize(nodes);
	      return force;
	    }

	    initializeNodes();

	    return simulation = {
	      tick: tick,

	      restart: function() {
	        return stepper.restart(step), simulation;
	      },

	      stop: function() {
	        return stepper.stop(), simulation;
	      },

	      nodes: function(_) {
	        return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
	      },

	      alpha: function(_) {
	        return arguments.length ? (alpha = +_, simulation) : alpha;
	      },

	      alphaMin: function(_) {
	        return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
	      },

	      alphaDecay: function(_) {
	        return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
	      },

	      alphaTarget: function(_) {
	        return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
	      },

	      velocityDecay: function(_) {
	        return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
	      },

	      force: function(name, _) {
	        return arguments.length > 1 ? ((_ == null ? forces.remove(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
	      },

	      find: function(x, y, radius) {
	        var i = 0,
	            n = nodes.length,
	            dx,
	            dy,
	            d2,
	            node,
	            closest;

	        if (radius == null) radius = Infinity;
	        else radius *= radius;

	        for (i = 0; i < n; ++i) {
	          node = nodes[i];
	          dx = x - node.x;
	          dy = y - node.y;
	          d2 = dx * dx + dy * dy;
	          if (d2 < radius) closest = node, radius = d2;
	        }

	        return closest;
	      },

	      on: function(name, _) {
	        return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
	      }
	    };
	  }

	  function manyBody() {
	    var nodes,
	        node,
	        alpha,
	        strength = constant(-30),
	        strengths,
	        distanceMin2 = 1,
	        distanceMax2 = Infinity,
	        theta2 = 0.81;

	    function force(_) {
	      var i, n = nodes.length, tree = d3Quadtree.quadtree(nodes, x$1, y$1).visitAfter(accumulate);
	      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
	    }

	    function initialize() {
	      if (!nodes) return;
	      var i, n = nodes.length;
	      strengths = new Array(n);
	      for (i = 0; i < n; ++i) strengths[i] = +strength(nodes[i], i, nodes);
	    }

	    function accumulate(quad) {
	      var strength = 0, q, c, x, y, i;

	      // For internal nodes, accumulate forces from child quadrants.
	      if (quad.length) {
	        for (x = y = i = 0; i < 4; ++i) {
	          if ((q = quad[i]) && (c = q.value)) {
	            strength += c, x += c * q.x, y += c * q.y;
	          }
	        }
	        quad.x = x / strength;
	        quad.y = y / strength;
	      }

	      // For leaf nodes, accumulate forces from coincident quadrants.
	      else {
	        q = quad;
	        q.x = q.data.x;
	        q.y = q.data.y;
	        do strength += strengths[q.data.index];
	        while (q = q.next);
	      }

	      quad.value = strength;
	    }

	    function apply(quad, x1, _, x2) {
	      if (!quad.value) return true;

	      var x = quad.x - node.x,
	          y = quad.y - node.y,
	          w = x2 - x1,
	          l = x * x + y * y;

	      // Apply the Barnes-Hut approximation if possible.
	      // Limit forces for very close nodes; randomize direction if coincident.
	      if (w * w / theta2 < l) {
	        if (l < distanceMax2) {
	          if (x === 0) x = jiggle(), l += x * x;
	          if (y === 0) y = jiggle(), l += y * y;
	          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
	          node.vx += x * quad.value * alpha / l;
	          node.vy += y * quad.value * alpha / l;
	        }
	        return true;
	      }

	      // Otherwise, process points directly.
	      else if (quad.length || l >= distanceMax2) return;

	      // Limit forces for very close nodes; randomize direction if coincident.
	      if (quad.data !== node || quad.next) {
	        if (x === 0) x = jiggle(), l += x * x;
	        if (y === 0) y = jiggle(), l += y * y;
	        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
	      }

	      do if (quad.data !== node) {
	        w = strengths[quad.data.index] * alpha / l;
	        node.vx += x * w;
	        node.vy += y * w;
	      } while (quad = quad.next);
	    }

	    force.initialize = function(_) {
	      nodes = _;
	      initialize();
	    };

	    force.strength = function(_) {
	      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
	    };

	    force.distanceMin = function(_) {
	      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
	    };

	    force.distanceMax = function(_) {
	      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
	    };

	    force.theta = function(_) {
	      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
	    };

	    return force;
	  }

	  function x$2(x) {
	    var strength = constant(0.1),
	        nodes,
	        strengths,
	        xz;

	    if (typeof x !== "function") x = constant(x == null ? 0 : +x);

	    function force(alpha) {
	      for (var i = 0, n = nodes.length, node; i < n; ++i) {
	        node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
	      }
	    }

	    function initialize() {
	      if (!nodes) return;
	      var i, n = nodes.length;
	      strengths = new Array(n);
	      xz = new Array(n);
	      for (i = 0; i < n; ++i) {
	        strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
	      }
	    }

	    force.initialize = function(_) {
	      nodes = _;
	      initialize();
	    };

	    force.strength = function(_) {
	      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
	    };

	    force.x = function(_) {
	      return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
	    };

	    return force;
	  }

	  function y$2(y) {
	    var strength = constant(0.1),
	        nodes,
	        strengths,
	        yz;

	    if (typeof y !== "function") y = constant(y == null ? 0 : +y);

	    function force(alpha) {
	      for (var i = 0, n = nodes.length, node; i < n; ++i) {
	        node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
	      }
	    }

	    function initialize() {
	      if (!nodes) return;
	      var i, n = nodes.length;
	      strengths = new Array(n);
	      yz = new Array(n);
	      for (i = 0; i < n; ++i) {
	        strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
	      }
	    }

	    force.initialize = function(_) {
	      nodes = _;
	      initialize();
	    };

	    force.strength = function(_) {
	      return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
	    };

	    force.y = function(_) {
	      return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
	    };

	    return force;
	  }

	  exports.forceCenter = center;
	  exports.forceCollide = collide;
	  exports.forceLink = link;
	  exports.forceManyBody = manyBody;
	  exports.forceSimulation = simulation;
	  exports.forceX = x$2;
	  exports.forceY = y$2;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-quadtree/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function tree_add(d) {
	    var x = +this._x.call(null, d),
	        y = +this._y.call(null, d);
	    return add(this.cover(x, y), x, y, d);
	  }

	  function add(tree, x, y, d) {
	    if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

	    var parent,
	        node = tree._root,
	        leaf = {data: d},
	        x0 = tree._x0,
	        y0 = tree._y0,
	        x1 = tree._x1,
	        y1 = tree._y1,
	        xm,
	        ym,
	        xp,
	        yp,
	        right,
	        bottom,
	        i,
	        j;

	    // If the tree is empty, initialize the root as a leaf.
	    if (!node) return tree._root = leaf, tree;

	    // Find the existing leaf for the new point, or add it.
	    while (node.length) {
	      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
	      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
	      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
	    }

	    // Is the new point is exactly coincident with the existing point?
	    xp = +tree._x.call(null, node.data);
	    yp = +tree._y.call(null, node.data);
	    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

	    // Otherwise, split the leaf node until the old and new point are separated.
	    do {
	      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
	      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
	      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
	    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
	    return parent[j] = node, parent[i] = leaf, tree;
	  }

	  function addAll(data) {
	    var d, i, n = data.length,
	        x,
	        y,
	        xz = new Array(n),
	        yz = new Array(n),
	        x0 = Infinity,
	        y0 = Infinity,
	        x1 = -Infinity,
	        y1 = -Infinity;

	    // Compute the points and their extent.
	    for (i = 0; i < n; ++i) {
	      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
	      xz[i] = x;
	      yz[i] = y;
	      if (x < x0) x0 = x;
	      if (x > x1) x1 = x;
	      if (y < y0) y0 = y;
	      if (y > y1) y1 = y;
	    }

	    // If there were no (valid) points, inherit the existing extent.
	    if (x1 < x0) x0 = this._x0, x1 = this._x1;
	    if (y1 < y0) y0 = this._y0, y1 = this._y1;

	    // Expand the tree to cover the new points.
	    this.cover(x0, y0).cover(x1, y1);

	    // Add the new points.
	    for (i = 0; i < n; ++i) {
	      add(this, xz[i], yz[i], data[i]);
	    }

	    return this;
	  }

	  function tree_cover(x, y) {
	    if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

	    var x0 = this._x0,
	        y0 = this._y0,
	        x1 = this._x1,
	        y1 = this._y1;

	    // If the quadtree has no extent, initialize them.
	    // Integer extent are necessary so that if we later double the extent,
	    // the existing quadrant boundaries don’t change due to floating point error!
	    if (isNaN(x0)) {
	      x1 = (x0 = Math.floor(x)) + 1;
	      y1 = (y0 = Math.floor(y)) + 1;
	    }

	    // Otherwise, double repeatedly to cover.
	    else if (x0 > x || x > x1 || y0 > y || y > y1) {
	      var z = x1 - x0,
	          node = this._root,
	          parent,
	          i;

	      switch (i = (y < (y0 + y1) / 2) << 1 | (x < (x0 + x1) / 2)) {
	        case 0: {
	          do parent = new Array(4), parent[i] = node, node = parent;
	          while (z *= 2, x1 = x0 + z, y1 = y0 + z, x > x1 || y > y1);
	          break;
	        }
	        case 1: {
	          do parent = new Array(4), parent[i] = node, node = parent;
	          while (z *= 2, x0 = x1 - z, y1 = y0 + z, x0 > x || y > y1);
	          break;
	        }
	        case 2: {
	          do parent = new Array(4), parent[i] = node, node = parent;
	          while (z *= 2, x1 = x0 + z, y0 = y1 - z, x > x1 || y0 > y);
	          break;
	        }
	        case 3: {
	          do parent = new Array(4), parent[i] = node, node = parent;
	          while (z *= 2, x0 = x1 - z, y0 = y1 - z, x0 > x || y0 > y);
	          break;
	        }
	      }

	      if (this._root && this._root.length) this._root = node;
	    }

	    // If the quadtree covers the point already, just return.
	    else return this;

	    this._x0 = x0;
	    this._y0 = y0;
	    this._x1 = x1;
	    this._y1 = y1;
	    return this;
	  }

	  function tree_data() {
	    var data = [];
	    this.visit(function(node) {
	      if (!node.length) do data.push(node.data); while (node = node.next)
	    });
	    return data;
	  }

	  function tree_extent(_) {
	    return arguments.length
	        ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
	        : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
	  }

	  function Quad(node, x0, y0, x1, y1) {
	    this.node = node;
	    this.x0 = x0;
	    this.y0 = y0;
	    this.x1 = x1;
	    this.y1 = y1;
	  }

	  function tree_find(x, y, radius) {
	    var data,
	        x0 = this._x0,
	        y0 = this._y0,
	        x1,
	        y1,
	        x2,
	        y2,
	        x3 = this._x1,
	        y3 = this._y1,
	        quads = [],
	        node = this._root,
	        q,
	        i;

	    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
	    if (radius == null) radius = Infinity;
	    else {
	      x0 = x - radius, y0 = y - radius;
	      x3 = x + radius, y3 = y + radius;
	      radius *= radius;
	    }

	    while (q = quads.pop()) {

	      // Stop searching if this quadrant can’t contain a closer node.
	      if (!(node = q.node)
	          || (x1 = q.x0) > x3
	          || (y1 = q.y0) > y3
	          || (x2 = q.x1) < x0
	          || (y2 = q.y1) < y0) continue;

	      // Bisect the current quadrant.
	      if (node.length) {
	        var xm = (x1 + x2) / 2,
	            ym = (y1 + y2) / 2;

	        quads.push(
	          new Quad(node[3], xm, ym, x2, y2),
	          new Quad(node[2], x1, ym, xm, y2),
	          new Quad(node[1], xm, y1, x2, ym),
	          new Quad(node[0], x1, y1, xm, ym)
	        );

	        // Visit the closest quadrant first.
	        if (i = (y >= ym) << 1 | (x >= xm)) {
	          q = quads[quads.length - 1];
	          quads[quads.length - 1] = quads[quads.length - 1 - i];
	          quads[quads.length - 1 - i] = q;
	        }
	      }

	      // Visit this point. (Visiting coincident points isn’t necessary!)
	      else {
	        var dx = x - +this._x.call(null, node.data),
	            dy = y - +this._y.call(null, node.data),
	            d2 = dx * dx + dy * dy;
	        if (d2 < radius) {
	          var d = Math.sqrt(radius = d2);
	          x0 = x - d, y0 = y - d;
	          x3 = x + d, y3 = y + d;
	          data = node.data;
	        }
	      }
	    }

	    return data;
	  }

	  function tree_remove(d) {
	    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

	    var parent,
	        node = this._root,
	        retainer,
	        previous,
	        next,
	        x0 = this._x0,
	        y0 = this._y0,
	        x1 = this._x1,
	        y1 = this._y1,
	        x,
	        y,
	        xm,
	        ym,
	        right,
	        bottom,
	        i,
	        j;

	    // If the tree is empty, initialize the root as a leaf.
	    if (!node) return this;

	    // Find the leaf node for the point.
	    // While descending, also retain the deepest parent with a non-removed sibling.
	    if (node.length) while (true) {
	      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
	      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
	      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
	      if (!node.length) break;
	      if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
	    }

	    // Find the point to remove.
	    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
	    if (next = node.next) delete node.next;

	    // If there are multiple coincident points, remove just the point.
	    if (previous) return (next ? previous.next = next : delete previous.next), this;

	    // If this is the root point, remove it.
	    if (!parent) return this._root = next, this;

	    // Remove this leaf.
	    next ? parent[i] = next : delete parent[i];

	    // If the parent now contains exactly one leaf, collapse superfluous parents.
	    if ((node = parent[0] || parent[1] || parent[2] || parent[3])
	        && node === (parent[3] || parent[2] || parent[1] || parent[0])
	        && !node.length) {
	      if (retainer) retainer[j] = node;
	      else this._root = node;
	    }

	    return this;
	  }

	  function removeAll(data) {
	    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
	    return this;
	  }

	  function tree_root() {
	    return this._root;
	  }

	  function tree_size() {
	    var size = 0;
	    this.visit(function(node) {
	      if (!node.length) do ++size; while (node = node.next)
	    });
	    return size;
	  }

	  function tree_visit(callback) {
	    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
	    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
	    while (q = quads.pop()) {
	      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
	        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
	        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
	        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
	        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
	        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
	      }
	    }
	    return this;
	  }

	  function tree_visitAfter(callback) {
	    var quads = [], next = [], q;
	    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
	    while (q = quads.pop()) {
	      var node = q.node;
	      if (node.length) {
	        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
	        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
	        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
	        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
	        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
	      }
	      next.push(q);
	    }
	    while (q = next.pop()) {
	      callback(q.node, q.x0, q.y0, q.x1, q.y1);
	    }
	    return this;
	  }

	  function defaultX(d) {
	    return d[0];
	  }

	  function tree_x(_) {
	    return arguments.length ? (this._x = _, this) : this._x;
	  }

	  function defaultY(d) {
	    return d[1];
	  }

	  function tree_y(_) {
	    return arguments.length ? (this._y = _, this) : this._y;
	  }

	  function quadtree(nodes, x, y) {
	    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
	    return nodes == null ? tree : tree.addAll(nodes);
	  }

	  function Quadtree(x, y, x0, y0, x1, y1) {
	    this._x = x;
	    this._y = y;
	    this._x0 = x0;
	    this._y0 = y0;
	    this._x1 = x1;
	    this._y1 = y1;
	    this._root = undefined;
	  }

	  function leaf_copy(leaf) {
	    var copy = {data: leaf.data}, next = copy;
	    while (leaf = leaf.next) next = next.next = {data: leaf.data};
	    return copy;
	  }

	  var treeProto = quadtree.prototype = Quadtree.prototype;

	  treeProto.copy = function() {
	    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
	        node = this._root,
	        nodes,
	        child;

	    if (!node) return copy;

	    if (!node.length) return copy._root = leaf_copy(node), copy;

	    nodes = [{source: node, target: copy._root = new Array(4)}];
	    while (node = nodes.pop()) {
	      for (var i = 0; i < 4; ++i) {
	        if (child = node.source[i]) {
	          if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
	          else node.target[i] = leaf_copy(child);
	        }
	      }
	    }

	    return copy;
	  };

	  treeProto.add = tree_add;
	  treeProto.addAll = addAll;
	  treeProto.cover = tree_cover;
	  treeProto.data = tree_data;
	  treeProto.extent = tree_extent;
	  treeProto.find = tree_find;
	  treeProto.remove = tree_remove;
	  treeProto.removeAll = removeAll;
	  treeProto.root = tree_root;
	  treeProto.size = tree_size;
	  treeProto.visit = tree_visit;
	  treeProto.visitAfter = tree_visitAfter;
	  treeProto.x = tree_x;
	  treeProto.y = tree_y;

	  exports.quadtree = quadtree;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = [
		{
			"city": "Tokyo–Yokohama",
			"country": "Japan",
			"population": 37843000,
			"latitude": 35.4437078,
			"longitude": 139.6380256
		},
		{
			"city": "Jakarta",
			"country": "Indonesia",
			"population": 30539000,
			"latitude": -6.2087634,
			"longitude": 106.845599
		},
		{
			"city": "Delhi",
			"country": "India",
			"population": 24998000,
			"latitude": 28.6139391,
			"longitude": 77.2090212
		},
		{
			"city": "Manila",
			"country": "Other",
			"population": 24123000,
			"latitude": 14.5995124,
			"longitude": 120.9842195
		},
		{
			"city": "Seoul–Gyeonggi–Incheon",
			"country": "Other",
			"population": 23480000,
			"latitude": 37.4562557,
			"longitude": 126.7052062
		},
		{
			"city": "Shanghai",
			"country": "China",
			"population": 23416000,
			"latitude": 31.230416,
			"longitude": 121.473701
		},
		{
			"city": "Karachi",
			"country": "Pakistan",
			"population": 22123000,
			"latitude": 24.8614622,
			"longitude": 67.0099388
		},
		{
			"city": "Beijing",
			"country": "China",
			"population": 21009000,
			"latitude": 39.904211,
			"longitude": 116.407395
		},
		{
			"city": "New York City",
			"country": "United States",
			"population": 20630000,
			"latitude": 40.7127837,
			"longitude": -74.0059413
		},
		{
			"city": "Guangzhou–Foshan",
			"country": "China",
			"population": 20597000,
			"latitude": 23.0402798,
			"longitude": 113.1018582
		},
		{
			"city": "São Paulo",
			"country": "Brazil",
			"population": 20365000,
			"latitude": -23.5505199,
			"longitude": -46.6333094
		},
		{
			"city": "Mexico City",
			"country": "Mexico",
			"population": 20063000,
			"latitude": 19.4326077,
			"longitude": -99.133208
		},
		{
			"city": "Mumbai",
			"country": "India",
			"population": 17712000,
			"latitude": 19.0759837,
			"longitude": 72.8776559
		},
		{
			"city": "Osaka–Kobe–Kyoto",
			"country": "Japan",
			"population": 17444000,
			"latitude": 35.0116363,
			"longitude": 135.7680294
		},
		{
			"city": "Moscow",
			"country": "Other",
			"population": 16170000,
			"latitude": 55.755826,
			"longitude": 37.6173
		},
		{
			"city": "Dhaka",
			"country": "Other",
			"population": 15669000,
			"latitude": 23.810332,
			"longitude": 90.4125181
		},
		{
			"city": "Greater Cairo",
			"country": "Other",
			"population": 15600000,
			"latitude": 30.0444196,
			"longitude": 31.2357116
		},
		{
			"city": "Los Angeles",
			"country": "United States",
			"population": 15058000,
			"latitude": 34.0522342,
			"longitude": -118.2436849
		},
		{
			"city": "Bangkok",
			"country": "Other",
			"population": 14998000,
			"latitude": 13.7563309,
			"longitude": 100.5017651
		},
		{
			"city": "Kolkata",
			"country": "India",
			"population": 14667000,
			"latitude": 22.572646,
			"longitude": 88.363895
		},
		{
			"city": "Buenos Aires",
			"country": "Other",
			"population": 14122000,
			"latitude": -34.6036844,
			"longitude": -58.3815591
		},
		{
			"city": "Tehran",
			"country": "Other",
			"population": 13532000,
			"latitude": 35.6891975,
			"longitude": 51.3889736
		},
		{
			"city": "Istanbul",
			"country": "Turkey",
			"population": 13287000,
			"latitude": 41.0082376,
			"longitude": 28.9783589
		},
		{
			"city": "Lagos",
			"country": "Other",
			"population": 13123000,
			"latitude": 6.5243793,
			"longitude": 3.3792057
		},
		{
			"city": "Shenzhen",
			"country": "China",
			"population": 12084000,
			"latitude": 22.543096,
			"longitude": 114.057865
		},
		{
			"city": "Rio de Janeiro",
			"country": "Brazil",
			"population": 11727000,
			"latitude": -22.9068467,
			"longitude": -43.1728965
		},
		{
			"city": "Kinshasa",
			"country": "Other",
			"population": 11587000,
			"latitude": -4.4419311,
			"longitude": 15.2662931
		},
		{
			"city": "Tianjin",
			"country": "China",
			"population": 10920000,
			"latitude": 39.084158,
			"longitude": 117.200983
		},
		{
			"city": "Paris",
			"country": "Other",
			"population": 10858000,
			"latitude": 48.856614,
			"longitude": 2.3522219
		},
		{
			"city": "Lima",
			"country": "Other",
			"population": 10750000,
			"latitude": -12.046374,
			"longitude": -77.0427934
		},
		{
			"city": "Chengdu",
			"country": "China",
			"population": 10376000,
			"latitude": 30.572816,
			"longitude": 104.066801
		},
		{
			"city": "London",
			"country": "Other",
			"population": 10236000,
			"latitude": 51.5073509,
			"longitude": -0.1277583
		},
		{
			"city": "Nagoya",
			"country": "Japan",
			"population": 10177000,
			"latitude": 35.1814464,
			"longitude": 136.906398
		},
		{
			"city": "Lahore",
			"country": "Pakistan",
			"population": 10052000,
			"latitude": 31.5546061,
			"longitude": 74.3571581
		},
		{
			"city": "Chennai",
			"country": "India",
			"population": 9714000,
			"latitude": 13.0826802,
			"longitude": 80.2707184
		},
		{
			"city": "Chicago",
			"country": "United States",
			"population": 9156000,
			"latitude": 41.8781136,
			"longitude": -87.6297982
		},
		{
			"city": "Bogotá",
			"country": "Other",
			"population": 8991000,
			"latitude": 4.7109886,
			"longitude": -74.072092
		},
		{
			"city": "Ho Chi Minh City",
			"country": "Other",
			"population": 8957000,
			"latitude": 10.8230989,
			"longitude": 106.6296638
		},
		{
			"city": "Hyderabad",
			"country": "India",
			"population": 8754000,
			"latitude": 17.385044,
			"longitude": 78.486671
		},
		{
			"city": "Bengaluru",
			"country": "India",
			"population": 8728906,
			"latitude": 12.9715987,
			"longitude": 77.5945627
		},
		{
			"city": "Dongguan",
			"country": "China",
			"population": 8442000,
			"latitude": 23.020673,
			"longitude": 113.7518
		},
		{
			"city": "Johannesburg–East Rand",
			"country": "South Africa",
			"population": 8432000,
			"latitude": -26.2041028,
			"longitude": 28.0473051
		},
		{
			"city": "Wuhan",
			"country": "China",
			"population": 7509000,
			"latitude": 30.593099,
			"longitude": 114.305393
		},
		{
			"city": "Taipei",
			"country": "Other",
			"population": 7438000,
			"latitude": 25.0329694,
			"longitude": 121.5654177
		},
		{
			"city": "Hangzhou",
			"country": "China",
			"population": 7275000,
			"latitude": 30.274085,
			"longitude": 120.15507
		},
		{
			"city": "Hong Kong",
			"country": "China",
			"population": 7246000,
			"latitude": 22.396428,
			"longitude": 114.109497
		},
		{
			"city": "Chongqing",
			"country": "China",
			"population": 7217000,
			"latitude": 29.56301,
			"longitude": 106.551556
		},
		{
			"city": "Ahmedabad",
			"country": "India",
			"population": 7186000,
			"latitude": 23.022505,
			"longitude": 72.5713621
		},
		{
			"city": "Kuala Lumpur",
			"country": "Other",
			"population": 7088000,
			"latitude": 3.139003,
			"longitude": 101.686855
		},
		{
			"city": "Quanzhou",
			"country": "China",
			"population": 6710000,
			"latitude": 24.874132,
			"longitude": 118.675676
		},
		{
			"city": "Essen–Düsseldorf",
			"country": "Other",
			"population": 6679000,
			"latitude": 51.4556432,
			"longitude": 7.0115552
		},
		{
			"city": "Baghdad",
			"country": "Other",
			"population": 6625000,
			"latitude": 33.3128057,
			"longitude": 44.3614875
		},
		{
			"city": "Toronto",
			"country": "Other",
			"population": 6456000,
			"latitude": 43.653226,
			"longitude": -79.3831843
		},
		{
			"city": "Santiago",
			"country": "Other",
			"population": 6225000,
			"latitude": -33.4488897,
			"longitude": -70.6692655
		},
		{
			"city": "Dallas–Fort Worth",
			"country": "United States",
			"population": 6174000,
			"latitude": 32.7554883,
			"longitude": -97.3307658
		},
		{
			"city": "Madrid",
			"country": "Other",
			"population": 6171000,
			"latitude": 40.4167754,
			"longitude": -3.7037902
		},
		{
			"city": "Nanjing",
			"country": "China",
			"population": 6155000,
			"latitude": 32.060255,
			"longitude": 118.796877
		},
		{
			"city": "Shenyang",
			"country": "China",
			"population": 6078000,
			"latitude": 41.805699,
			"longitude": 123.431472
		},
		{
			"city": "Xi'an–Xianyang",
			"country": "China",
			"population": 5977000,
			"latitude": 34.3243211,
			"longitude": 108.7051235
		},
		{
			"city": "San Francisco–San Jose",
			"country": "United States",
			"population": 5929000,
			"latitude": 37.7299514,
			"longitude": -122.4384735
		},
		{
			"city": "Luanda",
			"country": "Other",
			"population": 5899000,
			"latitude": -8.8399876,
			"longitude": 13.2894368
		},
		{
			"city": "Qingdao–Jimo",
			"country": "China",
			"population": 5816000,
			"latitude": 36.389402,
			"longitude": 120.447161
		},
		{
			"city": "Houston",
			"country": "United States",
			"population": 5764000,
			"latitude": 29.7604267,
			"longitude": -95.3698028
		},
		{
			"city": "Miami",
			"country": "United States",
			"population": 5764000,
			"latitude": 25.7616798,
			"longitude": -80.1917902
		},
		{
			"city": "Bandung",
			"country": "Indonesia",
			"population": 5695000,
			"latitude": -6.9174639,
			"longitude": 107.6191228
		},
		{
			"city": "Riyadh",
			"country": "Other",
			"population": 5666000,
			"latitude": 24.7135517,
			"longitude": 46.6752957
		},
		{
			"city": "Pune",
			"country": "India",
			"population": 5631000,
			"latitude": 18.5204303,
			"longitude": 73.8567437
		},
		{
			"city": "Singapore",
			"country": "Other",
			"population": 5624000,
			"latitude": 1.3553794,
			"longitude": 103.8677444
		},
		{
			"city": "Philadelphia",
			"country": "United States",
			"population": 5570000,
			"latitude": 39.9525839,
			"longitude": -75.1652215
		},
		{
			"city": "Surat",
			"country": "India",
			"population": 5447000,
			"latitude": 21.1702401,
			"longitude": 72.8310607
		},
		{
			"city": "Milan",
			"country": "Italy",
			"population": 5257000,
			"latitude": 45.4654219,
			"longitude": 9.1859243
		},
		{
			"city": "Suzhou",
			"country": "China",
			"population": 5246000,
			"latitude": 31.298979,
			"longitude": 120.58529
		},
		{
			"city": "Saint Petersburg",
			"country": "Other",
			"population": 5126000,
			"latitude": 59.9342802,
			"longitude": 30.3350986
		},
		{
			"city": "Khartoum",
			"country": "Other",
			"population": 5125000,
			"latitude": 15.5006544,
			"longitude": 32.5598994
		},
		{
			"city": "Atlanta",
			"country": "United States",
			"population": 5015000,
			"latitude": 33.7489954,
			"longitude": -84.3879824
		},
		{
			"city": "Zhengzhou–Xingyang",
			"country": "China",
			"population": 4942000,
			"latitude": 34.787375,
			"longitude": 113.383221
		},
		{
			"city": "Washington, D.C.",
			"country": "United States",
			"population": 4889000,
			"latitude": 38.9071923,
			"longitude": -77.0368707
		},
		{
			"city": "Surabaya",
			"country": "Indonesia",
			"population": 4881000,
			"latitude": -7.2574719,
			"longitude": 112.7520883
		},
		{
			"city": "Harbin",
			"country": "China",
			"population": 4815000,
			"latitude": 45.803775,
			"longitude": 126.534967
		},
		{
			"city": "Abidjan",
			"country": "Other",
			"population": 4800000,
			"latitude": 5.3599517,
			"longitude": -4.0082563
		},
		{
			"city": "Yangon",
			"country": "Other",
			"population": 4800000,
			"latitude": 16.8660694,
			"longitude": 96.195132
		},
		{
			"city": "Nairobi",
			"country": "Other",
			"population": 4738000,
			"latitude": -1.2920659,
			"longitude": 36.8219462
		},
		{
			"city": "Barcelona",
			"country": "Other",
			"population": 4693000,
			"latitude": 41.3850639,
			"longitude": 2.1734035
		},
		{
			"city": "Alexandria",
			"country": "Other",
			"population": 4689000,
			"latitude": 31.2000924,
			"longitude": 29.9187387
		},
		{
			"city": "Kabul",
			"country": "Other",
			"population": 4635000,
			"latitude": 34.5553494,
			"longitude": 69.207486
		},
		{
			"city": "Guadalajara",
			"country": "Mexico",
			"population": 4603000,
			"latitude": 20.6596988,
			"longitude": -103.3496092
		},
		{
			"city": "Ankara",
			"country": "Turkey",
			"population": 4538000,
			"latitude": 39.9333635,
			"longitude": 32.8597419
		},
		{
			"city": "Belo Horizonte",
			"country": "Brazil",
			"population": 4517000,
			"latitude": -19.9166813,
			"longitude": -43.9344931
		},
		{
			"city": "Boston",
			"country": "United States",
			"population": 4478000,
			"latitude": 42.3600825,
			"longitude": -71.0588801
		},
		{
			"city": "Xiamen",
			"country": "China",
			"population": 4420000,
			"latitude": 24.479834,
			"longitude": 118.089425
		},
		{
			"city": "Kuwait City",
			"country": "Other",
			"population": 4283000,
			"latitude": 29.375859,
			"longitude": 47.9774052
		},
		{
			"city": "Dar es Salaam",
			"country": "Other",
			"population": 4219000,
			"latitude": -6.792354,
			"longitude": 39.2083284
		},
		{
			"city": "Phoenix",
			"country": "United States",
			"population": 4194000,
			"latitude": 33.4483771,
			"longitude": -112.0740373
		},
		{
			"city": "Dalian",
			"country": "China",
			"population": 4183000,
			"latitude": 38.914003,
			"longitude": 121.614682
		},
		{
			"city": "Accra",
			"country": "Other",
			"population": 4145000,
			"latitude": 5.6037168,
			"longitude": -0.1869644
		},
		{
			"city": "Monterrey",
			"country": "Mexico",
			"population": 4083000,
			"latitude": 25.6866142,
			"longitude": -100.3161126
		},
		{
			"city": "Berlin",
			"country": "Other",
			"population": 4069000,
			"latitude": 52.5200066,
			"longitude": 13.404954
		},
		{
			"city": "Sydney",
			"country": "Other",
			"population": 4036000,
			"latitude": -33.8674869,
			"longitude": 151.2069902
		},
		{
			"city": "Fuzhou",
			"country": "China",
			"population": 3962000,
			"latitude": 26.074508,
			"longitude": 119.296494
		},
		{
			"city": "Medan",
			"country": "Indonesia",
			"population": 3942000,
			"latitude": 3.5951956,
			"longitude": 98.6722227
		},
		{
			"city": "Dubai",
			"country": "Other",
			"population": 3933000,
			"latitude": 25.2048493,
			"longitude": 55.2707828
		},
		{
			"city": "Melbourne",
			"country": "Other",
			"population": 3906000,
			"latitude": -37.814107,
			"longitude": 144.96328
		},
		{
			"city": "Rome",
			"country": "Italy",
			"population": 3906000,
			"latitude": 41.9027835,
			"longitude": 12.4963655
		},
		{
			"city": "Busan",
			"country": "Other",
			"population": 3906000,
			"latitude": 35.1795543,
			"longitude": 129.0756416
		},
		{
			"city": "Cape Town",
			"country": "South Africa",
			"population": 3812000,
			"latitude": -33.9248685,
			"longitude": 18.4240553
		},
		{
			"city": "Jinan",
			"country": "China",
			"population": 3789000,
			"latitude": 36.651216,
			"longitude": 117.12
		},
		{
			"city": "Ningbo",
			"country": "China",
			"population": 3753000,
			"latitude": 29.868336,
			"longitude": 121.54399
		},
		{
			"city": "Hanoi",
			"country": "Other",
			"population": 3715000,
			"latitude": 21.0277644,
			"longitude": 105.8341598
		},
		{
			"city": "Naples",
			"country": "Italy",
			"population": 3706000,
			"latitude": 40.8517746,
			"longitude": 14.2681244
		},
		{
			"city": "Taiyuan—Yuci",
			"country": "China",
			"population": 3702000,
			"latitude": 37.697792,
			"longitude": 112.708241
		},
		{
			"city": "Jeddah",
			"country": "Other",
			"population": 3677000,
			"latitude": 21.2854067,
			"longitude": 39.2375507
		},
		{
			"city": "Detroit",
			"country": "United States",
			"population": 3672000,
			"latitude": 42.331427,
			"longitude": -83.0457538
		},
		{
			"city": "Hefei",
			"country": "China",
			"population": 3665000,
			"latitude": 31.820592,
			"longitude": 117.227219
		},
		{
			"city": "Changsha",
			"country": "China",
			"population": 3657000,
			"latitude": 28.228209,
			"longitude": 112.938814
		},
		{
			"city": "Kunming–Anning",
			"country": "China",
			"population": 3649000,
			"latitude": 24.919493,
			"longitude": 102.478494
		},
		{
			"city": "Wuxi",
			"country": "China",
			"population": 3597000,
			"latitude": 31.49117,
			"longitude": 120.31191
		},
		{
			"city": "Medellín",
			"country": "Other",
			"population": 3568000,
			"latitude": 6.2530408,
			"longitude": -75.5645737
		},
		{
			"city": "Faisalabad",
			"country": "Pakistan",
			"population": 3560000,
			"latitude": 31.4187142,
			"longitude": 73.0791073
		},
		{
			"city": "Aleppo",
			"country": "Other",
			"population": 3560000,
			"latitude": 36.2021047,
			"longitude": 37.1342603
		},
		{
			"city": "Kano",
			"country": "Other",
			"population": 3550000,
			"latitude": 12.0021794,
			"longitude": 8.5919561
		},
		{
			"city": "Montreal",
			"country": "Other",
			"population": 3407963,
			"latitude": 45.5016889,
			"longitude": -73.567256
		},
		{
			"city": "Dakar",
			"country": "Other",
			"population": 3520000,
			"latitude": 14.7645042,
			"longitude": -17.3660286
		},
		{
			"city": "Athens",
			"country": "Other",
			"population": 3484000,
			"latitude": 37.983917,
			"longitude": 23.7293599
		},
		{
			"city": "Changzhou",
			"country": "China",
			"population": 3425000,
			"latitude": 31.811226,
			"longitude": 119.974062
		},
		{
			"city": "Durban",
			"country": "South Africa",
			"population": 3421000,
			"latitude": -29.8586804,
			"longitude": 31.0218404
		},
		{
			"city": "Porto Alegre",
			"country": "Brazil",
			"population": 3413000,
			"latitude": -30.0346471,
			"longitude": -51.2176584
		},
		{
			"city": "Jaipur",
			"country": "India",
			"population": 3409000,
			"latitude": 26.9124336,
			"longitude": 75.7872709
		},
		{
			"city": "Fortaleza",
			"country": "Brazil",
			"population": 3401000,
			"latitude": -3.7318616,
			"longitude": -38.5266704
		},
		{
			"city": "Addis Ababa",
			"country": "Other",
			"population": 3376000,
			"latitude": 8.9806034,
			"longitude": 38.7577605
		},
		{
			"city": "Changchun",
			"country": "China",
			"population": 3368000,
			"latitude": 43.817072,
			"longitude": 125.323544
		},
		{
			"city": "Shijiazhuang",
			"country": "China",
			"population": 3367000,
			"latitude": 38.042307,
			"longitude": 114.51486
		},
		{
			"city": "Recife",
			"country": "Brazil",
			"population": 3347000,
			"latitude": -8.0578381,
			"longitude": -34.8828969
		},
		{
			"city": "Mashhad",
			"country": "Other",
			"population": 3294000,
			"latitude": 36.2604623,
			"longitude": 59.6167549
		},
		{
			"city": "Seattle",
			"country": "United States",
			"population": 3218000,
			"latitude": 47.6062095,
			"longitude": -122.3320708
		},
		{
			"city": "Casablanca",
			"country": "Other",
			"population": 3211000,
			"latitude": 33.5731104,
			"longitude": -7.5898434
		},
		{
			"city": "Salvador",
			"country": "Brazil",
			"population": 3190000,
			"latitude": -12.9730401,
			"longitude": -38.502304
		},
		{
			"city": "Ürümqi",
			"country": "China",
			"population": 3184000,
			"latitude": 43.825592,
			"longitude": 87.616848
		},
		{
			"city": "Lucknow",
			"country": "India",
			"population": 3184000,
			"latitude": 26.8466937,
			"longitude": 80.946166
		},
		{
			"city": "Chittagong",
			"country": "Other",
			"population": 3176000,
			"latitude": 22.3475365,
			"longitude": 91.8123324
		},
		{
			"city": "Wenzhou",
			"country": "China",
			"population": 3169000,
			"latitude": 27.993828,
			"longitude": 120.699362
		},
		{
			"city": "Ibadan",
			"country": "Other",
			"population": 3160000,
			"latitude": 7.3775355,
			"longitude": 3.9470396
		},
		{
			"city": "İzmir",
			"country": "Turkey",
			"population": 3112000,
			"latitude": 38.423734,
			"longitude": 27.142826
		},
		{
			"city": "Curitiba",
			"country": "Brazil",
			"population": 3102000,
			"latitude": -25.4289541,
			"longitude": -49.267137
		},
		{
			"city": "San Diego",
			"country": "United States",
			"population": 3086000,
			"latitude": 32.715738,
			"longitude": -117.1610838
		},
		{
			"city": "Yaoundé",
			"country": "Other",
			"population": 3060000,
			"latitude": 3.8480325,
			"longitude": 11.5020752
		},
		{
			"city": "Zhangjiagang–Jiangyin–Jingjiang",
			"country": "China",
			"population": 3056000,
			"latitude": 31.8377775,
			"longitude": 120.3152942
		},
		{
			"city": "Kanpur",
			"country": "India",
			"population": 3037000,
			"latitude": 26.449923,
			"longitude": 80.3318736
		},
		{
			"city": "Zhongshan",
			"country": "China",
			"population": 3031000,
			"latitude": 22.516999,
			"longitude": 113.392725
		}
	];

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"id": "AFG",
				"properties": {
					"name": "Afghanistan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								61.210817,
								35.650072
							],
							[
								62.230651,
								35.270664
							],
							[
								62.984662,
								35.404041
							],
							[
								63.193538,
								35.857166
							],
							[
								63.982896,
								36.007957
							],
							[
								64.546479,
								36.312073
							],
							[
								64.746105,
								37.111818
							],
							[
								65.588948,
								37.305217
							],
							[
								65.745631,
								37.661164
							],
							[
								66.217385,
								37.39379
							],
							[
								66.518607,
								37.362784
							],
							[
								67.075782,
								37.356144
							],
							[
								67.83,
								37.144994
							],
							[
								68.135562,
								37.023115
							],
							[
								68.859446,
								37.344336
							],
							[
								69.196273,
								37.151144
							],
							[
								69.518785,
								37.608997
							],
							[
								70.116578,
								37.588223
							],
							[
								70.270574,
								37.735165
							],
							[
								70.376304,
								38.138396
							],
							[
								70.806821,
								38.486282
							],
							[
								71.348131,
								38.258905
							],
							[
								71.239404,
								37.953265
							],
							[
								71.541918,
								37.905774
							],
							[
								71.448693,
								37.065645
							],
							[
								71.844638,
								36.738171
							],
							[
								72.193041,
								36.948288
							],
							[
								72.63689,
								37.047558
							],
							[
								73.260056,
								37.495257
							],
							[
								73.948696,
								37.421566
							],
							[
								74.980002,
								37.41999
							],
							[
								75.158028,
								37.133031
							],
							[
								74.575893,
								37.020841
							],
							[
								74.067552,
								36.836176
							],
							[
								72.920025,
								36.720007
							],
							[
								71.846292,
								36.509942
							],
							[
								71.262348,
								36.074388
							],
							[
								71.498768,
								35.650563
							],
							[
								71.613076,
								35.153203
							],
							[
								71.115019,
								34.733126
							],
							[
								71.156773,
								34.348911
							],
							[
								70.881803,
								33.988856
							],
							[
								69.930543,
								34.02012
							],
							[
								70.323594,
								33.358533
							],
							[
								69.687147,
								33.105499
							],
							[
								69.262522,
								32.501944
							],
							[
								69.317764,
								31.901412
							],
							[
								68.926677,
								31.620189
							],
							[
								68.556932,
								31.71331
							],
							[
								67.792689,
								31.58293
							],
							[
								67.683394,
								31.303154
							],
							[
								66.938891,
								31.304911
							],
							[
								66.381458,
								30.738899
							],
							[
								66.346473,
								29.887943
							],
							[
								65.046862,
								29.472181
							],
							[
								64.350419,
								29.560031
							],
							[
								64.148002,
								29.340819
							],
							[
								63.550261,
								29.468331
							],
							[
								62.549857,
								29.318572
							],
							[
								60.874248,
								29.829239
							],
							[
								61.781222,
								30.73585
							],
							[
								61.699314,
								31.379506
							],
							[
								60.941945,
								31.548075
							],
							[
								60.863655,
								32.18292
							],
							[
								60.536078,
								32.981269
							],
							[
								60.9637,
								33.528832
							],
							[
								60.52843,
								33.676446
							],
							[
								60.803193,
								34.404102
							],
							[
								61.210817,
								35.650072
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "AGO",
				"properties": {
					"name": "Angola"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									16.326528,
									-5.87747
								],
								[
									16.57318,
									-6.622645
								],
								[
									16.860191,
									-7.222298
								],
								[
									17.089996,
									-7.545689
								],
								[
									17.47297,
									-8.068551
								],
								[
									18.134222,
									-7.987678
								],
								[
									18.464176,
									-7.847014
								],
								[
									19.016752,
									-7.988246
								],
								[
									19.166613,
									-7.738184
								],
								[
									19.417502,
									-7.155429
								],
								[
									20.037723,
									-7.116361
								],
								[
									20.091622,
									-6.94309
								],
								[
									20.601823,
									-6.939318
								],
								[
									20.514748,
									-7.299606
								],
								[
									21.728111,
									-7.290872
								],
								[
									21.746456,
									-7.920085
								],
								[
									21.949131,
									-8.305901
								],
								[
									21.801801,
									-8.908707
								],
								[
									21.875182,
									-9.523708
								],
								[
									22.208753,
									-9.894796
								],
								[
									22.155268,
									-11.084801
								],
								[
									22.402798,
									-10.993075
								],
								[
									22.837345,
									-11.017622
								],
								[
									23.456791,
									-10.867863
								],
								[
									23.912215,
									-10.926826
								],
								[
									24.017894,
									-11.237298
								],
								[
									23.904154,
									-11.722282
								],
								[
									24.079905,
									-12.191297
								],
								[
									23.930922,
									-12.565848
								],
								[
									24.016137,
									-12.911046
								],
								[
									21.933886,
									-12.898437
								],
								[
									21.887843,
									-16.08031
								],
								[
									22.562478,
									-16.898451
								],
								[
									23.215048,
									-17.523116
								],
								[
									21.377176,
									-17.930636
								],
								[
									18.956187,
									-17.789095
								],
								[
									18.263309,
									-17.309951
								],
								[
									14.209707,
									-17.353101
								],
								[
									14.058501,
									-17.423381
								],
								[
									13.462362,
									-16.971212
								],
								[
									12.814081,
									-16.941343
								],
								[
									12.215461,
									-17.111668
								],
								[
									11.734199,
									-17.301889
								],
								[
									11.640096,
									-16.673142
								],
								[
									11.778537,
									-15.793816
								],
								[
									12.123581,
									-14.878316
								],
								[
									12.175619,
									-14.449144
								],
								[
									12.500095,
									-13.5477
								],
								[
									12.738479,
									-13.137906
								],
								[
									13.312914,
									-12.48363
								],
								[
									13.633721,
									-12.038645
								],
								[
									13.738728,
									-11.297863
								],
								[
									13.686379,
									-10.731076
								],
								[
									13.387328,
									-10.373578
								],
								[
									13.120988,
									-9.766897
								],
								[
									12.87537,
									-9.166934
								],
								[
									12.929061,
									-8.959091
								],
								[
									13.236433,
									-8.562629
								],
								[
									12.93304,
									-7.596539
								],
								[
									12.728298,
									-6.927122
								],
								[
									12.227347,
									-6.294448
								],
								[
									12.322432,
									-6.100092
								],
								[
									12.735171,
									-5.965682
								],
								[
									13.024869,
									-5.984389
								],
								[
									13.375597,
									-5.864241
								],
								[
									16.326528,
									-5.87747
								]
							]
						],
						[
							[
								[
									12.436688,
									-5.684304
								],
								[
									12.182337,
									-5.789931
								],
								[
									11.914963,
									-5.037987
								],
								[
									12.318608,
									-4.60623
								],
								[
									12.62076,
									-4.438023
								],
								[
									12.995517,
									-4.781103
								],
								[
									12.631612,
									-4.991271
								],
								[
									12.468004,
									-5.248362
								],
								[
									12.436688,
									-5.684304
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ALB",
				"properties": {
					"name": "Albania"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								20.590247,
								41.855404
							],
							[
								20.463175,
								41.515089
							],
							[
								20.605182,
								41.086226
							],
							[
								21.02004,
								40.842727
							],
							[
								20.99999,
								40.580004
							],
							[
								20.674997,
								40.435
							],
							[
								20.615,
								40.110007
							],
							[
								20.150016,
								39.624998
							],
							[
								19.98,
								39.694993
							],
							[
								19.960002,
								39.915006
							],
							[
								19.406082,
								40.250773
							],
							[
								19.319059,
								40.72723
							],
							[
								19.40355,
								41.409566
							],
							[
								19.540027,
								41.719986
							],
							[
								19.371769,
								41.877548
							],
							[
								19.304486,
								42.195745
							],
							[
								19.738051,
								42.688247
							],
							[
								19.801613,
								42.500093
							],
							[
								20.0707,
								42.58863
							],
							[
								20.283755,
								42.32026
							],
							[
								20.52295,
								42.21787
							],
							[
								20.590247,
								41.855404
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ARE",
				"properties": {
					"name": "United Arab Emirates"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								51.579519,
								24.245497
							],
							[
								51.757441,
								24.294073
							],
							[
								51.794389,
								24.019826
							],
							[
								52.577081,
								24.177439
							],
							[
								53.404007,
								24.151317
							],
							[
								54.008001,
								24.121758
							],
							[
								54.693024,
								24.797892
							],
							[
								55.439025,
								25.439145
							],
							[
								56.070821,
								26.055464
							],
							[
								56.261042,
								25.714606
							],
							[
								56.396847,
								24.924732
							],
							[
								55.886233,
								24.920831
							],
							[
								55.804119,
								24.269604
							],
							[
								55.981214,
								24.130543
							],
							[
								55.528632,
								23.933604
							],
							[
								55.525841,
								23.524869
							],
							[
								55.234489,
								23.110993
							],
							[
								55.208341,
								22.70833
							],
							[
								55.006803,
								22.496948
							],
							[
								52.000733,
								23.001154
							],
							[
								51.617708,
								24.014219
							],
							[
								51.579519,
								24.245497
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ARG",
				"properties": {
					"name": "Argentina"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-65.5,
									-55.2
								],
								[
									-66.45,
									-55.25
								],
								[
									-66.95992,
									-54.89681
								],
								[
									-67.56244,
									-54.87001
								],
								[
									-68.63335,
									-54.8695
								],
								[
									-68.63401,
									-52.63637
								],
								[
									-68.25,
									-53.1
								],
								[
									-67.75,
									-53.85
								],
								[
									-66.45,
									-54.45
								],
								[
									-65.05,
									-54.7
								],
								[
									-65.5,
									-55.2
								]
							]
						],
						[
							[
								[
									-64.964892,
									-22.075862
								],
								[
									-64.377021,
									-22.798091
								],
								[
									-63.986838,
									-21.993644
								],
								[
									-62.846468,
									-22.034985
								],
								[
									-62.685057,
									-22.249029
								],
								[
									-60.846565,
									-23.880713
								],
								[
									-60.028966,
									-24.032796
								],
								[
									-58.807128,
									-24.771459
								],
								[
									-57.777217,
									-25.16234
								],
								[
									-57.63366,
									-25.603657
								],
								[
									-58.618174,
									-27.123719
								],
								[
									-57.60976,
									-27.395899
								],
								[
									-56.486702,
									-27.548499
								],
								[
									-55.695846,
									-27.387837
								],
								[
									-54.788795,
									-26.621786
								],
								[
									-54.625291,
									-25.739255
								],
								[
									-54.13005,
									-25.547639
								],
								[
									-53.628349,
									-26.124865
								],
								[
									-53.648735,
									-26.923473
								],
								[
									-54.490725,
									-27.474757
								],
								[
									-55.162286,
									-27.881915
								],
								[
									-56.2909,
									-28.852761
								],
								[
									-57.625133,
									-30.216295
								],
								[
									-57.874937,
									-31.016556
								],
								[
									-58.14244,
									-32.044504
								],
								[
									-58.132648,
									-33.040567
								],
								[
									-58.349611,
									-33.263189
								],
								[
									-58.427074,
									-33.909454
								],
								[
									-58.495442,
									-34.43149
								],
								[
									-57.22583,
									-35.288027
								],
								[
									-57.362359,
									-35.97739
								],
								[
									-56.737487,
									-36.413126
								],
								[
									-56.788285,
									-36.901572
								],
								[
									-57.749157,
									-38.183871
								],
								[
									-59.231857,
									-38.72022
								],
								[
									-61.237445,
									-38.928425
								],
								[
									-62.335957,
									-38.827707
								],
								[
									-62.125763,
									-39.424105
								],
								[
									-62.330531,
									-40.172586
								],
								[
									-62.145994,
									-40.676897
								],
								[
									-62.745803,
									-41.028761
								],
								[
									-63.770495,
									-41.166789
								],
								[
									-64.73209,
									-40.802677
								],
								[
									-65.118035,
									-41.064315
								],
								[
									-64.978561,
									-42.058001
								],
								[
									-64.303408,
									-42.359016
								],
								[
									-63.755948,
									-42.043687
								],
								[
									-63.458059,
									-42.563138
								],
								[
									-64.378804,
									-42.873558
								],
								[
									-65.181804,
									-43.495381
								],
								[
									-65.328823,
									-44.501366
								],
								[
									-65.565269,
									-45.036786
								],
								[
									-66.509966,
									-45.039628
								],
								[
									-67.293794,
									-45.551896
								],
								[
									-67.580546,
									-46.301773
								],
								[
									-66.597066,
									-47.033925
								],
								[
									-65.641027,
									-47.236135
								],
								[
									-65.985088,
									-48.133289
								],
								[
									-67.166179,
									-48.697337
								],
								[
									-67.816088,
									-49.869669
								],
								[
									-68.728745,
									-50.264218
								],
								[
									-69.138539,
									-50.73251
								],
								[
									-68.815561,
									-51.771104
								],
								[
									-68.149995,
									-52.349983
								],
								[
									-68.571545,
									-52.299444
								],
								[
									-69.498362,
									-52.142761
								],
								[
									-71.914804,
									-52.009022
								],
								[
									-72.329404,
									-51.425956
								],
								[
									-72.309974,
									-50.67701
								],
								[
									-72.975747,
									-50.74145
								],
								[
									-73.328051,
									-50.378785
								],
								[
									-73.415436,
									-49.318436
								],
								[
									-72.648247,
									-48.878618
								],
								[
									-72.331161,
									-48.244238
								],
								[
									-72.447355,
									-47.738533
								],
								[
									-71.917258,
									-46.884838
								],
								[
									-71.552009,
									-45.560733
								],
								[
									-71.659316,
									-44.973689
								],
								[
									-71.222779,
									-44.784243
								],
								[
									-71.329801,
									-44.407522
								],
								[
									-71.793623,
									-44.207172
								],
								[
									-71.464056,
									-43.787611
								],
								[
									-71.915424,
									-43.408565
								],
								[
									-72.148898,
									-42.254888
								],
								[
									-71.746804,
									-42.051386
								],
								[
									-71.915734,
									-40.832339
								],
								[
									-71.680761,
									-39.808164
								],
								[
									-71.413517,
									-38.916022
								],
								[
									-70.814664,
									-38.552995
								],
								[
									-71.118625,
									-37.576827
								],
								[
									-71.121881,
									-36.658124
								],
								[
									-70.364769,
									-36.005089
								],
								[
									-70.388049,
									-35.169688
								],
								[
									-69.817309,
									-34.193571
								],
								[
									-69.814777,
									-33.273886
								],
								[
									-70.074399,
									-33.09121
								],
								[
									-70.535069,
									-31.36501
								],
								[
									-69.919008,
									-30.336339
								],
								[
									-70.01355,
									-29.367923
								],
								[
									-69.65613,
									-28.459141
								],
								[
									-69.001235,
									-27.521214
								],
								[
									-68.295542,
									-26.89934
								],
								[
									-68.5948,
									-26.506909
								],
								[
									-68.386001,
									-26.185016
								],
								[
									-68.417653,
									-24.518555
								],
								[
									-67.328443,
									-24.025303
								],
								[
									-66.985234,
									-22.986349
								],
								[
									-67.106674,
									-22.735925
								],
								[
									-66.273339,
									-21.83231
								],
								[
									-64.964892,
									-22.075862
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ARM",
				"properties": {
					"name": "Armenia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								43.582746,
								41.092143
							],
							[
								44.97248,
								41.248129
							],
							[
								45.179496,
								40.985354
							],
							[
								45.560351,
								40.81229
							],
							[
								45.359175,
								40.561504
							],
							[
								45.891907,
								40.218476
							],
							[
								45.610012,
								39.899994
							],
							[
								46.034534,
								39.628021
							],
							[
								46.483499,
								39.464155
							],
							[
								46.50572,
								38.770605
							],
							[
								46.143623,
								38.741201
							],
							[
								45.735379,
								39.319719
							],
							[
								45.739978,
								39.473999
							],
							[
								45.298145,
								39.471751
							],
							[
								45.001987,
								39.740004
							],
							[
								44.79399,
								39.713003
							],
							[
								44.400009,
								40.005
							],
							[
								43.656436,
								40.253564
							],
							[
								43.752658,
								40.740201
							],
							[
								43.582746,
								41.092143
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ATA",
				"properties": {
					"name": "Antarctica"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-59.572095,
									-80.040179
								],
								[
									-59.865849,
									-80.549657
								],
								[
									-60.159656,
									-81.000327
								],
								[
									-62.255393,
									-80.863178
								],
								[
									-64.488125,
									-80.921934
								],
								[
									-65.741666,
									-80.588827
								],
								[
									-65.741666,
									-80.549657
								],
								[
									-66.290031,
									-80.255773
								],
								[
									-64.037688,
									-80.294944
								],
								[
									-61.883246,
									-80.39287
								],
								[
									-61.138976,
									-79.981371
								],
								[
									-60.610119,
									-79.628679
								],
								[
									-59.572095,
									-80.040179
								]
							]
						],
						[
							[
								[
									-159.208184,
									-79.497059
								],
								[
									-161.127601,
									-79.634209
								],
								[
									-162.439847,
									-79.281465
								],
								[
									-163.027408,
									-78.928774
								],
								[
									-163.066604,
									-78.869966
								],
								[
									-163.712896,
									-78.595667
								],
								[
									-163.105801,
									-78.223338
								],
								[
									-161.245113,
									-78.380176
								],
								[
									-160.246208,
									-78.693645
								],
								[
									-159.482405,
									-79.046338
								],
								[
									-159.208184,
									-79.497059
								]
							]
						],
						[
							[
								[
									-45.154758,
									-78.04707
								],
								[
									-43.920828,
									-78.478103
								],
								[
									-43.48995,
									-79.08556
								],
								[
									-43.372438,
									-79.516645
								],
								[
									-43.333267,
									-80.026123
								],
								[
									-44.880537,
									-80.339644
								],
								[
									-46.506174,
									-80.594357
								],
								[
									-48.386421,
									-80.829485
								],
								[
									-50.482107,
									-81.025442
								],
								[
									-52.851988,
									-80.966685
								],
								[
									-54.164259,
									-80.633528
								],
								[
									-53.987991,
									-80.222028
								],
								[
									-51.853134,
									-79.94773
								],
								[
									-50.991326,
									-79.614623
								],
								[
									-50.364595,
									-79.183487
								],
								[
									-49.914131,
									-78.811209
								],
								[
									-49.306959,
									-78.458569
								],
								[
									-48.660616,
									-78.047018
								],
								[
									-48.660616,
									-78.047019
								],
								[
									-48.151396,
									-78.04707
								],
								[
									-46.662857,
									-77.831476
								],
								[
									-45.154758,
									-78.04707
								]
							]
						],
						[
							[
								[
									-121.211511,
									-73.50099
								],
								[
									-119.918851,
									-73.657725
								],
								[
									-118.724143,
									-73.481353
								],
								[
									-119.292119,
									-73.834097
								],
								[
									-120.232217,
									-74.08881
								],
								[
									-121.62283,
									-74.010468
								],
								[
									-122.621735,
									-73.657778
								],
								[
									-122.621735,
									-73.657777
								],
								[
									-122.406245,
									-73.324619
								],
								[
									-121.211511,
									-73.50099
								]
							]
						],
						[
							[
								[
									-125.559566,
									-73.481353
								],
								[
									-124.031882,
									-73.873268
								],
								[
									-124.619469,
									-73.834097
								],
								[
									-125.912181,
									-73.736118
								],
								[
									-127.28313,
									-73.461769
								],
								[
									-127.28313,
									-73.461768
								],
								[
									-126.558472,
									-73.246226
								],
								[
									-125.559566,
									-73.481353
								]
							]
						],
						[
							[
								[
									-98.98155,
									-71.933334
								],
								[
									-97.884743,
									-72.070535
								],
								[
									-96.787937,
									-71.952971
								],
								[
									-96.20035,
									-72.521205
								],
								[
									-96.983765,
									-72.442864
								],
								[
									-98.198083,
									-72.482035
								],
								[
									-99.432013,
									-72.442864
								],
								[
									-100.783455,
									-72.50162
								],
								[
									-101.801868,
									-72.305663
								],
								[
									-102.330725,
									-71.894164
								],
								[
									-101.703967,
									-71.717792
								],
								[
									-100.430919,
									-71.854993
								],
								[
									-98.98155,
									-71.933334
								]
							]
						],
						[
							[
								[
									-68.451346,
									-70.955823
								],
								[
									-68.333834,
									-71.406493
								],
								[
									-68.510128,
									-71.798407
								],
								[
									-68.784297,
									-72.170736
								],
								[
									-69.959471,
									-72.307885
								],
								[
									-71.075889,
									-72.503842
								],
								[
									-72.388134,
									-72.484257
								],
								[
									-71.8985,
									-72.092343
								],
								[
									-73.073622,
									-72.229492
								],
								[
									-74.19004,
									-72.366693
								],
								[
									-74.953895,
									-72.072757
								],
								[
									-75.012625,
									-71.661258
								],
								[
									-73.915819,
									-71.269345
								],
								[
									-73.915819,
									-71.269344
								],
								[
									-73.230331,
									-71.15178
								],
								[
									-72.074717,
									-71.190951
								],
								[
									-71.780962,
									-70.681473
								],
								[
									-71.72218,
									-70.309196
								],
								[
									-71.741791,
									-69.505782
								],
								[
									-71.173815,
									-69.035475
								],
								[
									-70.253252,
									-68.87874
								],
								[
									-69.724447,
									-69.251017
								],
								[
									-69.489422,
									-69.623346
								],
								[
									-69.058518,
									-70.074016
								],
								[
									-68.725541,
									-70.505153
								],
								[
									-68.451346,
									-70.955823
								]
							]
						],
						[
							[
								[
									-58.614143,
									-64.152467
								],
								[
									-59.045073,
									-64.36801
								],
								[
									-59.789342,
									-64.211223
								],
								[
									-60.611928,
									-64.309202
								],
								[
									-61.297416,
									-64.54433
								],
								[
									-62.0221,
									-64.799094
								],
								[
									-62.51176,
									-65.09303
								],
								[
									-62.648858,
									-65.484942
								],
								[
									-62.590128,
									-65.857219
								],
								[
									-62.120079,
									-66.190326
								],
								[
									-62.805567,
									-66.425505
								],
								[
									-63.74569,
									-66.503847
								],
								[
									-64.294106,
									-66.837004
								],
								[
									-64.881693,
									-67.150474
								],
								[
									-65.508425,
									-67.58161
								],
								[
									-65.665082,
									-67.953887
								],
								[
									-65.312545,
									-68.365335
								],
								[
									-64.783715,
									-68.678908
								],
								[
									-63.961103,
									-68.913984
								],
								[
									-63.1973,
									-69.227556
								],
								[
									-62.785955,
									-69.619419
								],
								[
									-62.570516,
									-69.991747
								],
								[
									-62.276736,
									-70.383661
								],
								[
									-61.806661,
									-70.716768
								],
								[
									-61.512906,
									-71.089045
								],
								[
									-61.375809,
									-72.010074
								],
								[
									-61.081977,
									-72.382351
								],
								[
									-61.003661,
									-72.774265
								],
								[
									-60.690269,
									-73.166179
								],
								[
									-60.827367,
									-73.695242
								],
								[
									-61.375809,
									-74.106742
								],
								[
									-61.96337,
									-74.439848
								],
								[
									-63.295201,
									-74.576997
								],
								[
									-63.74569,
									-74.92974
								],
								[
									-64.352836,
									-75.262847
								],
								[
									-65.860987,
									-75.635124
								],
								[
									-67.192818,
									-75.79191
								],
								[
									-68.446282,
									-76.007452
								],
								[
									-69.797724,
									-76.222995
								],
								[
									-70.600724,
									-76.634494
								],
								[
									-72.206776,
									-76.673665
								],
								[
									-73.969536,
									-76.634494
								],
								[
									-75.555977,
									-76.712887
								],
								[
									-77.24037,
									-76.712887
								],
								[
									-76.926979,
									-77.104802
								],
								[
									-75.399294,
									-77.28107
								],
								[
									-74.282876,
									-77.55542
								],
								[
									-73.656119,
									-77.908112
								],
								[
									-74.772536,
									-78.221633
								],
								[
									-76.4961,
									-78.123654
								],
								[
									-77.925858,
									-78.378419
								],
								[
									-77.984666,
									-78.789918
								],
								[
									-78.023785,
									-79.181833
								],
								[
									-76.848637,
									-79.514939
								],
								[
									-76.633224,
									-79.887216
								],
								[
									-75.360097,
									-80.259545
								],
								[
									-73.244852,
									-80.416331
								],
								[
									-71.442946,
									-80.69063
								],
								[
									-70.013163,
									-81.004151
								],
								[
									-68.191646,
									-81.317672
								],
								[
									-65.704279,
									-81.474458
								],
								[
									-63.25603,
									-81.748757
								],
								[
									-61.552026,
									-82.042692
								],
								[
									-59.691416,
									-82.37585
								],
								[
									-58.712121,
									-82.846106
								],
								[
									-58.222487,
									-83.218434
								],
								[
									-57.008117,
									-82.865691
								],
								[
									-55.362894,
									-82.571755
								],
								[
									-53.619771,
									-82.258235
								],
								[
									-51.543644,
									-82.003521
								],
								[
									-49.76135,
									-81.729171
								],
								[
									-47.273931,
									-81.709586
								],
								[
									-44.825708,
									-81.846735
								],
								[
									-42.808363,
									-82.081915
								],
								[
									-42.16202,
									-81.65083
								],
								[
									-40.771433,
									-81.356894
								],
								[
									-38.244818,
									-81.337309
								],
								[
									-36.26667,
									-81.121715
								],
								[
									-34.386397,
									-80.906172
								],
								[
									-32.310296,
									-80.769023
								],
								[
									-30.097098,
									-80.592651
								],
								[
									-28.549802,
									-80.337938
								],
								[
									-29.254901,
									-79.985195
								],
								[
									-29.685805,
									-79.632503
								],
								[
									-29.685805,
									-79.260226
								],
								[
									-31.624808,
									-79.299397
								],
								[
									-33.681324,
									-79.456132
								],
								[
									-35.639912,
									-79.456132
								],
								[
									-35.914107,
									-79.083855
								],
								[
									-35.77701,
									-78.339248
								],
								[
									-35.326546,
									-78.123654
								],
								[
									-33.896763,
									-77.888526
								],
								[
									-32.212369,
									-77.65345
								],
								[
									-30.998051,
									-77.359515
								],
								[
									-29.783732,
									-77.065579
								],
								[
									-28.882779,
									-76.673665
								],
								[
									-27.511752,
									-76.497345
								],
								[
									-26.160336,
									-76.360144
								],
								[
									-25.474822,
									-76.281803
								],
								[
									-23.927552,
									-76.24258
								],
								[
									-22.458598,
									-76.105431
								],
								[
									-21.224694,
									-75.909474
								],
								[
									-20.010375,
									-75.674346
								],
								[
									-18.913543,
									-75.439218
								],
								[
									-17.522982,
									-75.125698
								],
								[
									-16.641589,
									-74.79254
								],
								[
									-15.701491,
									-74.498604
								],
								[
									-15.40771,
									-74.106742
								],
								[
									-16.46532,
									-73.871614
								],
								[
									-16.112784,
									-73.460114
								],
								[
									-15.446855,
									-73.146542
								],
								[
									-14.408805,
									-72.950585
								],
								[
									-13.311973,
									-72.715457
								],
								[
									-12.293508,
									-72.401936
								],
								[
									-11.510067,
									-72.010074
								],
								[
									-11.020433,
									-71.539767
								],
								[
									-10.295774,
									-71.265416
								],
								[
									-9.101015,
									-71.324224
								],
								[
									-8.611381,
									-71.65733
								],
								[
									-7.416622,
									-71.696501
								],
								[
									-7.377451,
									-71.324224
								],
								[
									-6.868232,
									-70.93231
								],
								[
									-5.790985,
									-71.030289
								],
								[
									-5.536375,
									-71.402617
								],
								[
									-4.341667,
									-71.461373
								],
								[
									-3.048981,
									-71.285053
								],
								[
									-1.795492,
									-71.167438
								],
								[
									-0.659489,
									-71.226246
								],
								[
									-0.228637,
									-71.637745
								],
								[
									0.868195,
									-71.304639
								],
								[
									1.886686,
									-71.128267
								],
								[
									3.022638,
									-70.991118
								],
								[
									4.139055,
									-70.853917
								],
								[
									5.157546,
									-70.618789
								],
								[
									6.273912,
									-70.462055
								],
								[
									7.13572,
									-70.246512
								],
								[
									7.742866,
									-69.893769
								],
								[
									8.48711,
									-70.148534
								],
								[
									9.525135,
									-70.011333
								],
								[
									10.249845,
									-70.48164
								],
								[
									10.817821,
									-70.834332
								],
								[
									11.953824,
									-70.638375
								],
								[
									12.404287,
									-70.246512
								],
								[
									13.422778,
									-69.972162
								],
								[
									14.734998,
									-70.030918
								],
								[
									15.126757,
									-70.403247
								],
								[
									15.949342,
									-70.030918
								],
								[
									17.026589,
									-69.913354
								],
								[
									18.201711,
									-69.874183
								],
								[
									19.259373,
									-69.893769
								],
								[
									20.375739,
									-70.011333
								],
								[
									21.452985,
									-70.07014
								],
								[
									21.923034,
									-70.403247
								],
								[
									22.569403,
									-70.697182
								],
								[
									23.666184,
									-70.520811
								],
								[
									24.841357,
									-70.48164
								],
								[
									25.977309,
									-70.48164
								],
								[
									27.093726,
									-70.462055
								],
								[
									28.09258,
									-70.324854
								],
								[
									29.150242,
									-70.20729
								],
								[
									30.031583,
									-69.93294
								],
								[
									30.971733,
									-69.75662
								],
								[
									31.990172,
									-69.658641
								],
								[
									32.754053,
									-69.384291
								],
								[
									33.302443,
									-68.835642
								],
								[
									33.870419,
									-68.502588
								],
								[
									34.908495,
									-68.659271
								],
								[
									35.300202,
									-69.012014
								],
								[
									36.16201,
									-69.247142
								],
								[
									37.200035,
									-69.168748
								],
								[
									37.905108,
									-69.52144
								],
								[
									38.649404,
									-69.776205
								],
								[
									39.667894,
									-69.541077
								],
								[
									40.020431,
									-69.109941
								],
								[
									40.921358,
									-68.933621
								],
								[
									41.959434,
									-68.600514
								],
								[
									42.938702,
									-68.463313
								],
								[
									44.113876,
									-68.267408
								],
								[
									44.897291,
									-68.051866
								],
								[
									45.719928,
									-67.816738
								],
								[
									46.503343,
									-67.601196
								],
								[
									47.44344,
									-67.718759
								],
								[
									48.344419,
									-67.366068
								],
								[
									48.990736,
									-67.091718
								],
								[
									49.930885,
									-67.111303
								],
								[
									50.753471,
									-66.876175
								],
								[
									50.949325,
									-66.523484
								],
								[
									51.791547,
									-66.249133
								],
								[
									52.614133,
									-66.053176
								],
								[
									53.613038,
									-65.89639
								],
								[
									54.53355,
									-65.818049
								],
								[
									55.414943,
									-65.876805
								],
								[
									56.355041,
									-65.974783
								],
								[
									57.158093,
									-66.249133
								],
								[
									57.255968,
									-66.680218
								],
								[
									58.137361,
									-67.013324
								],
								[
									58.744508,
									-67.287675
								],
								[
									59.939318,
									-67.405239
								],
								[
									60.605221,
									-67.679589
								],
								[
									61.427806,
									-67.953887
								],
								[
									62.387489,
									-68.012695
								],
								[
									63.19049,
									-67.816738
								],
								[
									64.052349,
									-67.405239
								],
								[
									64.992447,
									-67.620729
								],
								[
									65.971715,
									-67.738345
								],
								[
									66.911864,
									-67.855909
								],
								[
									67.891133,
									-67.934302
								],
								[
									68.890038,
									-67.934302
								],
								[
									69.712624,
									-68.972791
								],
								[
									69.673453,
									-69.227556
								],
								[
									69.555941,
									-69.678226
								],
								[
									68.596258,
									-69.93294
								],
								[
									67.81274,
									-70.305268
								],
								[
									67.949889,
									-70.697182
								],
								[
									69.066307,
									-70.677545
								],
								[
									68.929157,
									-71.069459
								],
								[
									68.419989,
									-71.441788
								],
								[
									67.949889,
									-71.853287
								],
								[
									68.71377,
									-72.166808
								],
								[
									69.869307,
									-72.264787
								],
								[
									71.024895,
									-72.088415
								],
								[
									71.573285,
									-71.696501
								],
								[
									71.906288,
									-71.324224
								],
								[
									72.454627,
									-71.010703
								],
								[
									73.08141,
									-70.716768
								],
								[
									73.33602,
									-70.364024
								],
								[
									73.864877,
									-69.874183
								],
								[
									74.491557,
									-69.776205
								],
								[
									75.62756,
									-69.737034
								],
								[
									76.626465,
									-69.619419
								],
								[
									77.644904,
									-69.462684
								],
								[
									78.134539,
									-69.07077
								],
								[
									78.428371,
									-68.698441
								],
								[
									79.113859,
									-68.326216
								],
								[
									80.093127,
									-68.071503
								],
								[
									80.93535,
									-67.875546
								],
								[
									81.483792,
									-67.542388
								],
								[
									82.051767,
									-67.366068
								],
								[
									82.776426,
									-67.209282
								],
								[
									83.775331,
									-67.30726
								],
								[
									84.676206,
									-67.209282
								],
								[
									85.655527,
									-67.091718
								],
								[
									86.752359,
									-67.150474
								],
								[
									87.477017,
									-66.876175
								],
								[
									87.986289,
									-66.209911
								],
								[
									88.358411,
									-66.484261
								],
								[
									88.828408,
									-66.954568
								],
								[
									89.67063,
									-67.150474
								],
								[
									90.630365,
									-67.228867
								],
								[
									91.5901,
									-67.111303
								],
								[
									92.608539,
									-67.189696
								],
								[
									93.548637,
									-67.209282
								],
								[
									94.17542,
									-67.111303
								],
								[
									95.017591,
									-67.170111
								],
								[
									95.781472,
									-67.385653
								],
								[
									96.682399,
									-67.248504
								],
								[
									97.759646,
									-67.248504
								],
								[
									98.68021,
									-67.111303
								],
								[
									99.718182,
									-67.248504
								],
								[
									100.384188,
									-66.915346
								],
								[
									100.893356,
									-66.58224
								],
								[
									101.578896,
									-66.30789
								],
								[
									102.832411,
									-65.563284
								],
								[
									103.478676,
									-65.700485
								],
								[
									104.242557,
									-65.974783
								],
								[
									104.90846,
									-66.327527
								],
								[
									106.181561,
									-66.934931
								],
								[
									107.160881,
									-66.954568
								],
								[
									108.081393,
									-66.954568
								],
								[
									109.15864,
									-66.837004
								],
								[
									110.235835,
									-66.699804
								],
								[
									111.058472,
									-66.425505
								],
								[
									111.74396,
									-66.13157
								],
								[
									112.860378,
									-66.092347
								],
								[
									113.604673,
									-65.876805
								],
								[
									114.388088,
									-66.072762
								],
								[
									114.897308,
									-66.386283
								],
								[
									115.602381,
									-66.699804
								],
								[
									116.699161,
									-66.660633
								],
								[
									117.384701,
									-66.915346
								],
								[
									118.57946,
									-67.170111
								],
								[
									119.832924,
									-67.268089
								],
								[
									120.871,
									-67.189696
								],
								[
									121.654415,
									-66.876175
								],
								[
									122.320369,
									-66.562654
								],
								[
									123.221296,
									-66.484261
								],
								[
									124.122274,
									-66.621462
								],
								[
									125.160247,
									-66.719389
								],
								[
									126.100396,
									-66.562654
								],
								[
									127.001427,
									-66.562654
								],
								[
									127.882768,
									-66.660633
								],
								[
									128.80328,
									-66.758611
								],
								[
									129.704259,
									-66.58224
								],
								[
									130.781454,
									-66.425505
								],
								[
									131.799945,
									-66.386283
								],
								[
									132.935896,
									-66.386283
								],
								[
									133.85646,
									-66.288304
								],
								[
									134.757387,
									-66.209963
								],
								[
									135.031582,
									-65.72007
								],
								[
									135.070753,
									-65.308571
								],
								[
									135.697485,
									-65.582869
								],
								[
									135.873805,
									-66.033591
								],
								[
									136.206705,
									-66.44509
								],
								[
									136.618049,
									-66.778197
								],
								[
									137.460271,
									-66.954568
								],
								[
									138.596223,
									-66.895761
								],
								[
									139.908442,
									-66.876175
								],
								[
									140.809421,
									-66.817367
								],
								[
									142.121692,
									-66.817367
								],
								[
									143.061842,
									-66.797782
								],
								[
									144.374061,
									-66.837004
								],
								[
									145.490427,
									-66.915346
								],
								[
									146.195552,
									-67.228867
								],
								[
									145.999699,
									-67.601196
								],
								[
									146.646067,
									-67.895131
								],
								[
									147.723263,
									-68.130259
								],
								[
									148.839629,
									-68.385024
								],
								[
									150.132314,
									-68.561292
								],
								[
									151.483705,
									-68.71813
								],
								[
									152.502247,
									-68.874813
								],
								[
									153.638199,
									-68.894502
								],
								[
									154.284567,
									-68.561292
								],
								[
									155.165857,
									-68.835642
								],
								[
									155.92979,
									-69.149215
								],
								[
									156.811132,
									-69.384291
								],
								[
									158.025528,
									-69.482269
								],
								[
									159.181013,
									-69.599833
								],
								[
									159.670699,
									-69.991747
								],
								[
									160.80665,
									-70.226875
								],
								[
									161.570479,
									-70.579618
								],
								[
									162.686897,
									-70.736353
								],
								[
									163.842434,
									-70.716768
								],
								[
									164.919681,
									-70.775524
								],
								[
									166.11444,
									-70.755938
								],
								[
									167.309095,
									-70.834332
								],
								[
									168.425616,
									-70.971481
								],
								[
									169.463589,
									-71.20666
								],
								[
									170.501665,
									-71.402617
								],
								[
									171.20679,
									-71.696501
								],
								[
									171.089227,
									-72.088415
								],
								[
									170.560422,
									-72.441159
								],
								[
									170.109958,
									-72.891829
								],
								[
									169.75737,
									-73.24452
								],
								[
									169.287321,
									-73.65602
								],
								[
									167.975101,
									-73.812806
								],
								[
									167.387489,
									-74.165498
								],
								[
									166.094803,
									-74.38104
								],
								[
									165.644391,
									-74.772954
								],
								[
									164.958851,
									-75.145283
								],
								[
									164.234193,
									-75.458804
								],
								[
									163.822797,
									-75.870303
								],
								[
									163.568239,
									-76.24258
								],
								[
									163.47026,
									-76.693302
								],
								[
									163.489897,
									-77.065579
								],
								[
									164.057873,
									-77.457442
								],
								[
									164.273363,
									-77.82977
								],
								[
									164.743464,
									-78.182514
								],
								[
									166.604126,
									-78.319611
								],
								[
									166.995781,
									-78.750748
								],
								[
									165.193876,
									-78.907483
								],
								[
									163.666217,
									-79.123025
								],
								[
									161.766385,
									-79.162248
								],
								[
									160.924162,
									-79.730482
								],
								[
									160.747894,
									-80.200737
								],
								[
									160.316964,
									-80.573066
								],
								[
									159.788211,
									-80.945395
								],
								[
									161.120016,
									-81.278501
								],
								[
									161.629287,
									-81.690001
								],
								[
									162.490992,
									-82.062278
								],
								[
									163.705336,
									-82.395435
								],
								[
									165.095949,
									-82.708956
								],
								[
									166.604126,
									-83.022477
								],
								[
									168.895665,
									-83.335998
								],
								[
									169.404782,
									-83.825891
								],
								[
									172.283934,
									-84.041433
								],
								[
									172.477049,
									-84.117914
								],
								[
									173.224083,
									-84.41371
								],
								[
									175.985672,
									-84.158997
								],
								[
									178.277212,
									-84.472518
								],
								[
									180,
									-84.71338
								],
								[
									-179.942499,
									-84.721443
								],
								[
									-179.058677,
									-84.139412
								],
								[
									-177.256772,
									-84.452933
								],
								[
									-177.140807,
									-84.417941
								],
								[
									-176.084673,
									-84.099259
								],
								[
									-175.947235,
									-84.110449
								],
								[
									-175.829882,
									-84.117914
								],
								[
									-174.382503,
									-84.534323
								],
								[
									-173.116559,
									-84.117914
								],
								[
									-172.889106,
									-84.061019
								],
								[
									-169.951223,
									-83.884647
								],
								[
									-168.999989,
									-84.117914
								],
								[
									-168.530199,
									-84.23739
								],
								[
									-167.022099,
									-84.570497
								],
								[
									-164.182144,
									-84.82521
								],
								[
									-161.929775,
									-85.138731
								],
								[
									-158.07138,
									-85.37391
								],
								[
									-155.192253,
									-85.09956
								],
								[
									-150.942099,
									-85.295517
								],
								[
									-148.533073,
									-85.609038
								],
								[
									-145.888918,
									-85.315102
								],
								[
									-143.107718,
									-85.040752
								],
								[
									-142.892279,
									-84.570497
								],
								[
									-146.829068,
									-84.531274
								],
								[
									-150.060732,
									-84.296146
								],
								[
									-150.902928,
									-83.904232
								],
								[
									-153.586201,
									-83.68869
								],
								[
									-153.409907,
									-83.23802
								],
								[
									-153.037759,
									-82.82652
								],
								[
									-152.665637,
									-82.454192
								],
								[
									-152.861517,
									-82.042692
								],
								[
									-154.526299,
									-81.768394
								],
								[
									-155.29018,
									-81.41565
								],
								[
									-156.83745,
									-81.102129
								],
								[
									-154.408787,
									-81.160937
								],
								[
									-152.097662,
									-81.004151
								],
								[
									-150.648293,
									-81.337309
								],
								[
									-148.865998,
									-81.043373
								],
								[
									-147.22075,
									-80.671045
								],
								[
									-146.417749,
									-80.337938
								],
								[
									-146.770286,
									-79.926439
								],
								[
									-148.062947,
									-79.652089
								],
								[
									-149.531901,
									-79.358205
								],
								[
									-151.588416,
									-79.299397
								],
								[
									-153.390322,
									-79.162248
								],
								[
									-155.329376,
									-79.064269
								],
								[
									-155.975668,
									-78.69194
								],
								[
									-157.268302,
									-78.378419
								],
								[
									-158.051768,
									-78.025676
								],
								[
									-158.365134,
									-76.889207
								],
								[
									-157.875474,
									-76.987238
								],
								[
									-156.974573,
									-77.300759
								],
								[
									-155.329376,
									-77.202728
								],
								[
									-153.742832,
									-77.065579
								],
								[
									-152.920247,
									-77.496664
								],
								[
									-151.33378,
									-77.398737
								],
								[
									-150.00195,
									-77.183143
								],
								[
									-148.748486,
									-76.908845
								],
								[
									-147.612483,
									-76.575738
								],
								[
									-146.104409,
									-76.47776
								],
								[
									-146.143528,
									-76.105431
								],
								[
									-146.496091,
									-75.733154
								],
								[
									-146.20231,
									-75.380411
								],
								[
									-144.909624,
									-75.204039
								],
								[
									-144.322037,
									-75.537197
								],
								[
									-142.794353,
									-75.34124
								],
								[
									-141.638764,
									-75.086475
								],
								[
									-140.209007,
									-75.06689
								],
								[
									-138.85759,
									-74.968911
								],
								[
									-137.5062,
									-74.733783
								],
								[
									-136.428901,
									-74.518241
								],
								[
									-135.214583,
									-74.302699
								],
								[
									-134.431194,
									-74.361455
								],
								[
									-133.745654,
									-74.439848
								],
								[
									-132.257168,
									-74.302699
								],
								[
									-130.925311,
									-74.479019
								],
								[
									-129.554284,
									-74.459433
								],
								[
									-128.242038,
									-74.322284
								],
								[
									-126.890622,
									-74.420263
								],
								[
									-125.402082,
									-74.518241
								],
								[
									-124.011496,
									-74.479019
								],
								[
									-122.562152,
									-74.498604
								],
								[
									-121.073613,
									-74.518241
								],
								[
									-119.70256,
									-74.479019
								],
								[
									-118.684145,
									-74.185083
								],
								[
									-117.469801,
									-74.028348
								],
								[
									-116.216312,
									-74.243891
								],
								[
									-115.021552,
									-74.067519
								],
								[
									-113.944331,
									-73.714828
								],
								[
									-113.297988,
									-74.028348
								],
								[
									-112.945452,
									-74.38104
								],
								[
									-112.299083,
									-74.714198
								],
								[
									-111.261059,
									-74.420263
								],
								[
									-110.066325,
									-74.79254
								],
								[
									-108.714909,
									-74.910103
								],
								[
									-107.559346,
									-75.184454
								],
								[
									-106.149148,
									-75.125698
								],
								[
									-104.876074,
									-74.949326
								],
								[
									-103.367949,
									-74.988497
								],
								[
									-102.016507,
									-75.125698
								],
								[
									-100.645531,
									-75.302018
								],
								[
									-100.1167,
									-74.870933
								],
								[
									-100.763043,
									-74.537826
								],
								[
									-101.252703,
									-74.185083
								],
								[
									-102.545337,
									-74.106742
								],
								[
									-103.113313,
									-73.734413
								],
								[
									-103.328752,
									-73.362084
								],
								[
									-103.681289,
									-72.61753
								],
								[
									-102.917485,
									-72.754679
								],
								[
									-101.60524,
									-72.813436
								],
								[
									-100.312528,
									-72.754679
								],
								[
									-99.13738,
									-72.911414
								],
								[
									-98.118889,
									-73.20535
								],
								[
									-97.688037,
									-73.558041
								],
								[
									-96.336595,
									-73.616849
								],
								[
									-95.043961,
									-73.4797
								],
								[
									-93.672907,
									-73.283743
								],
								[
									-92.439003,
									-73.166179
								],
								[
									-91.420564,
									-73.401307
								],
								[
									-90.088733,
									-73.322914
								],
								[
									-89.226951,
									-72.558722
								],
								[
									-88.423951,
									-73.009393
								],
								[
									-87.268337,
									-73.185764
								],
								[
									-86.014822,
									-73.087786
								],
								[
									-85.192236,
									-73.4797
								],
								[
									-83.879991,
									-73.518871
								],
								[
									-82.665646,
									-73.636434
								],
								[
									-81.470913,
									-73.851977
								],
								[
									-80.687447,
									-73.4797
								],
								[
									-80.295791,
									-73.126956
								],
								[
									-79.296886,
									-73.518871
								],
								[
									-77.925858,
									-73.420892
								],
								[
									-76.907367,
									-73.636434
								],
								[
									-76.221879,
									-73.969541
								],
								[
									-74.890049,
									-73.871614
								],
								[
									-73.852024,
									-73.65602
								],
								[
									-72.833533,
									-73.401307
								],
								[
									-71.619215,
									-73.264157
								],
								[
									-70.209042,
									-73.146542
								],
								[
									-68.935916,
									-73.009393
								],
								[
									-67.956622,
									-72.79385
								],
								[
									-67.369061,
									-72.480329
								],
								[
									-67.134036,
									-72.049244
								],
								[
									-67.251548,
									-71.637745
								],
								[
									-67.56494,
									-71.245831
								],
								[
									-67.917477,
									-70.853917
								],
								[
									-68.230843,
									-70.462055
								],
								[
									-68.485452,
									-70.109311
								],
								[
									-68.544209,
									-69.717397
								],
								[
									-68.446282,
									-69.325535
								],
								[
									-67.976233,
									-68.953206
								],
								[
									-67.5845,
									-68.541707
								],
								[
									-67.427843,
									-68.149844
								],
								[
									-67.62367,
									-67.718759
								],
								[
									-67.741183,
									-67.326845
								],
								[
									-67.251548,
									-66.876175
								],
								[
									-66.703184,
									-66.58224
								],
								[
									-66.056815,
									-66.209963
								],
								[
									-65.371327,
									-65.89639
								],
								[
									-64.568276,
									-65.602506
								],
								[
									-64.176542,
									-65.171423
								],
								[
									-63.628152,
									-64.897073
								],
								[
									-63.001394,
									-64.642308
								],
								[
									-62.041686,
									-64.583552
								],
								[
									-61.414928,
									-64.270031
								],
								[
									-60.709855,
									-64.074074
								],
								[
									-59.887269,
									-63.95651
								],
								[
									-59.162585,
									-63.701745
								],
								[
									-58.594557,
									-63.388224
								],
								[
									-57.811143,
									-63.27066
								],
								[
									-57.223582,
									-63.525425
								],
								[
									-57.59573,
									-63.858532
								],
								[
									-58.614143,
									-64.152467
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ATF",
				"properties": {
					"name": "French Southern and Antarctic Lands"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								68.935,
								-48.625
							],
							[
								69.58,
								-48.94
							],
							[
								70.525,
								-49.065
							],
							[
								70.56,
								-49.255
							],
							[
								70.28,
								-49.71
							],
							[
								68.745,
								-49.775
							],
							[
								68.72,
								-49.2425
							],
							[
								68.8675,
								-48.83
							],
							[
								68.935,
								-48.625
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "AUS",
				"properties": {
					"name": "Australia"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									145.397978,
									-40.792549
								],
								[
									146.364121,
									-41.137695
								],
								[
									146.908584,
									-41.000546
								],
								[
									147.689259,
									-40.808258
								],
								[
									148.289068,
									-40.875438
								],
								[
									148.359865,
									-42.062445
								],
								[
									148.017301,
									-42.407024
								],
								[
									147.914052,
									-43.211522
								],
								[
									147.564564,
									-42.937689
								],
								[
									146.870343,
									-43.634597
								],
								[
									146.663327,
									-43.580854
								],
								[
									146.048378,
									-43.549745
								],
								[
									145.43193,
									-42.693776
								],
								[
									145.29509,
									-42.03361
								],
								[
									144.718071,
									-41.162552
								],
								[
									144.743755,
									-40.703975
								],
								[
									145.397978,
									-40.792549
								]
							]
						],
						[
							[
								[
									143.561811,
									-13.763656
								],
								[
									143.922099,
									-14.548311
								],
								[
									144.563714,
									-14.171176
								],
								[
									144.894908,
									-14.594458
								],
								[
									145.374724,
									-14.984976
								],
								[
									145.271991,
									-15.428205
								],
								[
									145.48526,
									-16.285672
								],
								[
									145.637033,
									-16.784918
								],
								[
									145.888904,
									-16.906926
								],
								[
									146.160309,
									-17.761655
								],
								[
									146.063674,
									-18.280073
								],
								[
									146.387478,
									-18.958274
								],
								[
									147.471082,
									-19.480723
								],
								[
									148.177602,
									-19.955939
								],
								[
									148.848414,
									-20.39121
								],
								[
									148.717465,
									-20.633469
								],
								[
									149.28942,
									-21.260511
								],
								[
									149.678337,
									-22.342512
								],
								[
									150.077382,
									-22.122784
								],
								[
									150.482939,
									-22.556142
								],
								[
									150.727265,
									-22.402405
								],
								[
									150.899554,
									-23.462237
								],
								[
									151.609175,
									-24.076256
								],
								[
									152.07354,
									-24.457887
								],
								[
									152.855197,
									-25.267501
								],
								[
									153.136162,
									-26.071173
								],
								[
									153.161949,
									-26.641319
								],
								[
									153.092909,
									-27.2603
								],
								[
									153.569469,
									-28.110067
								],
								[
									153.512108,
									-28.995077
								],
								[
									153.339095,
									-29.458202
								],
								[
									153.069241,
									-30.35024
								],
								[
									153.089602,
									-30.923642
								],
								[
									152.891578,
									-31.640446
								],
								[
									152.450002,
									-32.550003
								],
								[
									151.709117,
									-33.041342
								],
								[
									151.343972,
									-33.816023
								],
								[
									151.010555,
									-34.31036
								],
								[
									150.714139,
									-35.17346
								],
								[
									150.32822,
									-35.671879
								],
								[
									150.075212,
									-36.420206
								],
								[
									149.946124,
									-37.109052
								],
								[
									149.997284,
									-37.425261
								],
								[
									149.423882,
									-37.772681
								],
								[
									148.304622,
									-37.809061
								],
								[
									147.381733,
									-38.219217
								],
								[
									146.922123,
									-38.606532
								],
								[
									146.317922,
									-39.035757
								],
								[
									145.489652,
									-38.593768
								],
								[
									144.876976,
									-38.417448
								],
								[
									145.032212,
									-37.896188
								],
								[
									144.485682,
									-38.085324
								],
								[
									143.609974,
									-38.809465
								],
								[
									142.745427,
									-38.538268
								],
								[
									142.17833,
									-38.380034
								],
								[
									141.606582,
									-38.308514
								],
								[
									140.638579,
									-38.019333
								],
								[
									139.992158,
									-37.402936
								],
								[
									139.806588,
									-36.643603
								],
								[
									139.574148,
									-36.138362
								],
								[
									139.082808,
									-35.732754
								],
								[
									138.120748,
									-35.612296
								],
								[
									138.449462,
									-35.127261
								],
								[
									138.207564,
									-34.384723
								],
								[
									137.71917,
									-35.076825
								],
								[
									136.829406,
									-35.260535
								],
								[
									137.352371,
									-34.707339
								],
								[
									137.503886,
									-34.130268
								],
								[
									137.890116,
									-33.640479
								],
								[
									137.810328,
									-32.900007
								],
								[
									136.996837,
									-33.752771
								],
								[
									136.372069,
									-34.094766
								],
								[
									135.989043,
									-34.890118
								],
								[
									135.208213,
									-34.47867
								],
								[
									135.239218,
									-33.947953
								],
								[
									134.613417,
									-33.222778
								],
								[
									134.085904,
									-32.848072
								],
								[
									134.273903,
									-32.617234
								],
								[
									132.990777,
									-32.011224
								],
								[
									132.288081,
									-31.982647
								],
								[
									131.326331,
									-31.495803
								],
								[
									129.535794,
									-31.590423
								],
								[
									128.240938,
									-31.948489
								],
								[
									127.102867,
									-32.282267
								],
								[
									126.148714,
									-32.215966
								],
								[
									125.088623,
									-32.728751
								],
								[
									124.221648,
									-32.959487
								],
								[
									124.028947,
									-33.483847
								],
								[
									123.659667,
									-33.890179
								],
								[
									122.811036,
									-33.914467
								],
								[
									122.183064,
									-34.003402
								],
								[
									121.299191,
									-33.821036
								],
								[
									120.580268,
									-33.930177
								],
								[
									119.893695,
									-33.976065
								],
								[
									119.298899,
									-34.509366
								],
								[
									119.007341,
									-34.464149
								],
								[
									118.505718,
									-34.746819
								],
								[
									118.024972,
									-35.064733
								],
								[
									117.295507,
									-35.025459
								],
								[
									116.625109,
									-35.025097
								],
								[
									115.564347,
									-34.386428
								],
								[
									115.026809,
									-34.196517
								],
								[
									115.048616,
									-33.623425
								],
								[
									115.545123,
									-33.487258
								],
								[
									115.714674,
									-33.259572
								],
								[
									115.679379,
									-32.900369
								],
								[
									115.801645,
									-32.205062
								],
								[
									115.689611,
									-31.612437
								],
								[
									115.160909,
									-30.601594
								],
								[
									114.997043,
									-30.030725
								],
								[
									115.040038,
									-29.461095
								],
								[
									114.641974,
									-28.810231
								],
								[
									114.616498,
									-28.516399
								],
								[
									114.173579,
									-28.118077
								],
								[
									114.048884,
									-27.334765
								],
								[
									113.477498,
									-26.543134
								],
								[
									113.338953,
									-26.116545
								],
								[
									113.778358,
									-26.549025
								],
								[
									113.440962,
									-25.621278
								],
								[
									113.936901,
									-25.911235
								],
								[
									114.232852,
									-26.298446
								],
								[
									114.216161,
									-25.786281
								],
								[
									113.721255,
									-24.998939
								],
								[
									113.625344,
									-24.683971
								],
								[
									113.393523,
									-24.384764
								],
								[
									113.502044,
									-23.80635
								],
								[
									113.706993,
									-23.560215
								],
								[
									113.843418,
									-23.059987
								],
								[
									113.736552,
									-22.475475
								],
								[
									114.149756,
									-21.755881
								],
								[
									114.225307,
									-22.517488
								],
								[
									114.647762,
									-21.82952
								],
								[
									115.460167,
									-21.495173
								],
								[
									115.947373,
									-21.068688
								],
								[
									116.711615,
									-20.701682
								],
								[
									117.166316,
									-20.623599
								],
								[
									117.441545,
									-20.746899
								],
								[
									118.229559,
									-20.374208
								],
								[
									118.836085,
									-20.263311
								],
								[
									118.987807,
									-20.044203
								],
								[
									119.252494,
									-19.952942
								],
								[
									119.805225,
									-19.976506
								],
								[
									120.85622,
									-19.683708
								],
								[
									121.399856,
									-19.239756
								],
								[
									121.655138,
									-18.705318
								],
								[
									122.241665,
									-18.197649
								],
								[
									122.286624,
									-17.798603
								],
								[
									122.312772,
									-17.254967
								],
								[
									123.012574,
									-16.4052
								],
								[
									123.433789,
									-17.268558
								],
								[
									123.859345,
									-17.069035
								],
								[
									123.503242,
									-16.596506
								],
								[
									123.817073,
									-16.111316
								],
								[
									124.258287,
									-16.327944
								],
								[
									124.379726,
									-15.56706
								],
								[
									124.926153,
									-15.0751
								],
								[
									125.167275,
									-14.680396
								],
								[
									125.670087,
									-14.51007
								],
								[
									125.685796,
									-14.230656
								],
								[
									126.125149,
									-14.347341
								],
								[
									126.142823,
									-14.095987
								],
								[
									126.582589,
									-13.952791
								],
								[
									127.065867,
									-13.817968
								],
								[
									127.804633,
									-14.276906
								],
								[
									128.35969,
									-14.86917
								],
								[
									128.985543,
									-14.875991
								],
								[
									129.621473,
									-14.969784
								],
								[
									129.4096,
									-14.42067
								],
								[
									129.888641,
									-13.618703
								],
								[
									130.339466,
									-13.357376
								],
								[
									130.183506,
									-13.10752
								],
								[
									130.617795,
									-12.536392
								],
								[
									131.223495,
									-12.183649
								],
								[
									131.735091,
									-12.302453
								],
								[
									132.575298,
									-12.114041
								],
								[
									132.557212,
									-11.603012
								],
								[
									131.824698,
									-11.273782
								],
								[
									132.357224,
									-11.128519
								],
								[
									133.019561,
									-11.376411
								],
								[
									133.550846,
									-11.786515
								],
								[
									134.393068,
									-12.042365
								],
								[
									134.678632,
									-11.941183
								],
								[
									135.298491,
									-12.248606
								],
								[
									135.882693,
									-11.962267
								],
								[
									136.258381,
									-12.049342
								],
								[
									136.492475,
									-11.857209
								],
								[
									136.95162,
									-12.351959
								],
								[
									136.685125,
									-12.887223
								],
								[
									136.305407,
									-13.29123
								],
								[
									135.961758,
									-13.324509
								],
								[
									136.077617,
									-13.724278
								],
								[
									135.783836,
									-14.223989
								],
								[
									135.428664,
									-14.715432
								],
								[
									135.500184,
									-14.997741
								],
								[
									136.295175,
									-15.550265
								],
								[
									137.06536,
									-15.870762
								],
								[
									137.580471,
									-16.215082
								],
								[
									138.303217,
									-16.807604
								],
								[
									138.585164,
									-16.806622
								],
								[
									139.108543,
									-17.062679
								],
								[
									139.260575,
									-17.371601
								],
								[
									140.215245,
									-17.710805
								],
								[
									140.875463,
									-17.369069
								],
								[
									141.07111,
									-16.832047
								],
								[
									141.274095,
									-16.38887
								],
								[
									141.398222,
									-15.840532
								],
								[
									141.702183,
									-15.044921
								],
								[
									141.56338,
									-14.561333
								],
								[
									141.63552,
									-14.270395
								],
								[
									141.519869,
									-13.698078
								],
								[
									141.65092,
									-12.944688
								],
								[
									141.842691,
									-12.741548
								],
								[
									141.68699,
									-12.407614
								],
								[
									141.928629,
									-11.877466
								],
								[
									142.118488,
									-11.328042
								],
								[
									142.143706,
									-11.042737
								],
								[
									142.51526,
									-10.668186
								],
								[
									142.79731,
									-11.157355
								],
								[
									142.866763,
									-11.784707
								],
								[
									143.115947,
									-11.90563
								],
								[
									143.158632,
									-12.325656
								],
								[
									143.522124,
									-12.834358
								],
								[
									143.597158,
									-13.400422
								],
								[
									143.561811,
									-13.763656
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "AUT",
				"properties": {
					"name": "Austria"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								16.979667,
								48.123497
							],
							[
								16.903754,
								47.714866
							],
							[
								16.340584,
								47.712902
							],
							[
								16.534268,
								47.496171
							],
							[
								16.202298,
								46.852386
							],
							[
								16.011664,
								46.683611
							],
							[
								15.137092,
								46.658703
							],
							[
								14.632472,
								46.431817
							],
							[
								13.806475,
								46.509306
							],
							[
								12.376485,
								46.767559
							],
							[
								12.153088,
								47.115393
							],
							[
								11.164828,
								46.941579
							],
							[
								11.048556,
								46.751359
							],
							[
								10.442701,
								46.893546
							],
							[
								9.932448,
								46.920728
							],
							[
								9.47997,
								47.10281
							],
							[
								9.632932,
								47.347601
							],
							[
								9.594226,
								47.525058
							],
							[
								9.896068,
								47.580197
							],
							[
								10.402084,
								47.302488
							],
							[
								10.544504,
								47.566399
							],
							[
								11.426414,
								47.523766
							],
							[
								12.141357,
								47.703083
							],
							[
								12.62076,
								47.672388
							],
							[
								12.932627,
								47.467646
							],
							[
								13.025851,
								47.637584
							],
							[
								12.884103,
								48.289146
							],
							[
								13.243357,
								48.416115
							],
							[
								13.595946,
								48.877172
							],
							[
								14.338898,
								48.555305
							],
							[
								14.901447,
								48.964402
							],
							[
								15.253416,
								49.039074
							],
							[
								16.029647,
								48.733899
							],
							[
								16.499283,
								48.785808
							],
							[
								16.960288,
								48.596982
							],
							[
								16.879983,
								48.470013
							],
							[
								16.979667,
								48.123497
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "AZE",
				"properties": {
					"name": "Azerbaijan"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									45.001987,
									39.740004
								],
								[
									45.298145,
									39.471751
								],
								[
									45.739978,
									39.473999
								],
								[
									45.735379,
									39.319719
								],
								[
									46.143623,
									38.741201
								],
								[
									45.457722,
									38.874139
								],
								[
									44.952688,
									39.335765
								],
								[
									44.79399,
									39.713003
								],
								[
									45.001987,
									39.740004
								]
							]
						],
						[
							[
								[
									47.373315,
									41.219732
								],
								[
									47.815666,
									41.151416
								],
								[
									47.987283,
									41.405819
								],
								[
									48.584353,
									41.80887
								],
								[
									49.110264,
									41.282287
								],
								[
									49.618915,
									40.572924
								],
								[
									50.08483,
									40.526157
								],
								[
									50.392821,
									40.256561
								],
								[
									49.569202,
									40.176101
								],
								[
									49.395259,
									39.399482
								],
								[
									49.223228,
									39.049219
								],
								[
									48.856532,
									38.815486
								],
								[
									48.883249,
									38.320245
								],
								[
									48.634375,
									38.270378
								],
								[
									48.010744,
									38.794015
								],
								[
									48.355529,
									39.288765
								],
								[
									48.060095,
									39.582235
								],
								[
									47.685079,
									39.508364
								],
								[
									46.50572,
									38.770605
								],
								[
									46.483499,
									39.464155
								],
								[
									46.034534,
									39.628021
								],
								[
									45.610012,
									39.899994
								],
								[
									45.891907,
									40.218476
								],
								[
									45.359175,
									40.561504
								],
								[
									45.560351,
									40.81229
								],
								[
									45.179496,
									40.985354
								],
								[
									44.97248,
									41.248129
								],
								[
									45.217426,
									41.411452
								],
								[
									45.962601,
									41.123873
								],
								[
									46.501637,
									41.064445
								],
								[
									46.637908,
									41.181673
								],
								[
									46.145432,
									41.722802
								],
								[
									46.404951,
									41.860675
								],
								[
									46.686071,
									41.827137
								],
								[
									47.373315,
									41.219732
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BDI",
				"properties": {
					"name": "Burundi"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								29.339998,
								-4.499983
							],
							[
								29.276384,
								-3.293907
							],
							[
								29.024926,
								-2.839258
							],
							[
								29.632176,
								-2.917858
							],
							[
								29.938359,
								-2.348487
							],
							[
								30.469696,
								-2.413858
							],
							[
								30.527677,
								-2.807632
							],
							[
								30.743013,
								-3.034285
							],
							[
								30.752263,
								-3.35933
							],
							[
								30.50556,
								-3.568567
							],
							[
								30.116333,
								-4.090138
							],
							[
								29.753512,
								-4.452389
							],
							[
								29.339998,
								-4.499983
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BEL",
				"properties": {
					"name": "Belgium"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								3.314971,
								51.345781
							],
							[
								4.047071,
								51.267259
							],
							[
								4.973991,
								51.475024
							],
							[
								5.606976,
								51.037298
							],
							[
								6.156658,
								50.803721
							],
							[
								6.043073,
								50.128052
							],
							[
								5.782417,
								50.090328
							],
							[
								5.674052,
								49.529484
							],
							[
								4.799222,
								49.985373
							],
							[
								4.286023,
								49.907497
							],
							[
								3.588184,
								50.378992
							],
							[
								3.123252,
								50.780363
							],
							[
								2.658422,
								50.796848
							],
							[
								2.513573,
								51.148506
							],
							[
								3.314971,
								51.345781
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BEN",
				"properties": {
					"name": "Benin"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								2.691702,
								6.258817
							],
							[
								1.865241,
								6.142158
							],
							[
								1.618951,
								6.832038
							],
							[
								1.664478,
								9.12859
							],
							[
								1.463043,
								9.334624
							],
							[
								1.425061,
								9.825395
							],
							[
								1.077795,
								10.175607
							],
							[
								0.772336,
								10.470808
							],
							[
								0.899563,
								10.997339
							],
							[
								1.24347,
								11.110511
							],
							[
								1.447178,
								11.547719
							],
							[
								1.935986,
								11.64115
							],
							[
								2.154474,
								11.94015
							],
							[
								2.490164,
								12.233052
							],
							[
								2.848643,
								12.235636
							],
							[
								3.61118,
								11.660167
							],
							[
								3.572216,
								11.327939
							],
							[
								3.797112,
								10.734746
							],
							[
								3.60007,
								10.332186
							],
							[
								3.705438,
								10.06321
							],
							[
								3.220352,
								9.444153
							],
							[
								2.912308,
								9.137608
							],
							[
								2.723793,
								8.506845
							],
							[
								2.749063,
								7.870734
							],
							[
								2.691702,
								6.258817
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BFA",
				"properties": {
					"name": "Burkina Faso"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-2.827496,
								9.642461
							],
							[
								-3.511899,
								9.900326
							],
							[
								-3.980449,
								9.862344
							],
							[
								-4.330247,
								9.610835
							],
							[
								-4.779884,
								9.821985
							],
							[
								-4.954653,
								10.152714
							],
							[
								-5.404342,
								10.370737
							],
							[
								-5.470565,
								10.95127
							],
							[
								-5.197843,
								11.375146
							],
							[
								-5.220942,
								11.713859
							],
							[
								-4.427166,
								12.542646
							],
							[
								-4.280405,
								13.228444
							],
							[
								-4.006391,
								13.472485
							],
							[
								-3.522803,
								13.337662
							],
							[
								-3.103707,
								13.541267
							],
							[
								-2.967694,
								13.79815
							],
							[
								-2.191825,
								14.246418
							],
							[
								-2.001035,
								14.559008
							],
							[
								-1.066363,
								14.973815
							],
							[
								-0.515854,
								15.116158
							],
							[
								-0.266257,
								14.924309
							],
							[
								0.374892,
								14.928908
							],
							[
								0.295646,
								14.444235
							],
							[
								0.429928,
								13.988733
							],
							[
								0.993046,
								13.33575
							],
							[
								1.024103,
								12.851826
							],
							[
								2.177108,
								12.625018
							],
							[
								2.154474,
								11.94015
							],
							[
								1.935986,
								11.64115
							],
							[
								1.447178,
								11.547719
							],
							[
								1.24347,
								11.110511
							],
							[
								0.899563,
								10.997339
							],
							[
								0.023803,
								11.018682
							],
							[
								-0.438702,
								11.098341
							],
							[
								-0.761576,
								10.93693
							],
							[
								-1.203358,
								11.009819
							],
							[
								-2.940409,
								10.96269
							],
							[
								-2.963896,
								10.395335
							],
							[
								-2.827496,
								9.642461
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BGD",
				"properties": {
					"name": "Bangladesh"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								92.672721,
								22.041239
							],
							[
								92.652257,
								21.324048
							],
							[
								92.303234,
								21.475485
							],
							[
								92.368554,
								20.670883
							],
							[
								92.082886,
								21.192195
							],
							[
								92.025215,
								21.70157
							],
							[
								91.834891,
								22.182936
							],
							[
								91.417087,
								22.765019
							],
							[
								90.496006,
								22.805017
							],
							[
								90.586957,
								22.392794
							],
							[
								90.272971,
								21.836368
							],
							[
								89.847467,
								22.039146
							],
							[
								89.70205,
								21.857116
							],
							[
								89.418863,
								21.966179
							],
							[
								89.031961,
								22.055708
							],
							[
								88.876312,
								22.879146
							],
							[
								88.52977,
								23.631142
							],
							[
								88.69994,
								24.233715
							],
							[
								88.084422,
								24.501657
							],
							[
								88.306373,
								24.866079
							],
							[
								88.931554,
								25.238692
							],
							[
								88.209789,
								25.768066
							],
							[
								88.563049,
								26.446526
							],
							[
								89.355094,
								26.014407
							],
							[
								89.832481,
								25.965082
							],
							[
								89.920693,
								25.26975
							],
							[
								90.872211,
								25.132601
							],
							[
								91.799596,
								25.147432
							],
							[
								92.376202,
								24.976693
							],
							[
								91.915093,
								24.130414
							],
							[
								91.46773,
								24.072639
							],
							[
								91.158963,
								23.503527
							],
							[
								91.706475,
								22.985264
							],
							[
								91.869928,
								23.624346
							],
							[
								92.146035,
								23.627499
							],
							[
								92.672721,
								22.041239
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BGR",
				"properties": {
					"name": "Bulgaria"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								22.65715,
								44.234923
							],
							[
								22.944832,
								43.823785
							],
							[
								23.332302,
								43.897011
							],
							[
								24.100679,
								43.741051
							],
							[
								25.569272,
								43.688445
							],
							[
								26.065159,
								43.943494
							],
							[
								27.2424,
								44.175986
							],
							[
								27.970107,
								43.812468
							],
							[
								28.558081,
								43.707462
							],
							[
								28.039095,
								43.293172
							],
							[
								27.673898,
								42.577892
							],
							[
								27.99672,
								42.007359
							],
							[
								27.135739,
								42.141485
							],
							[
								26.117042,
								41.826905
							],
							[
								26.106138,
								41.328899
							],
							[
								25.197201,
								41.234486
							],
							[
								24.492645,
								41.583896
							],
							[
								23.692074,
								41.309081
							],
							[
								22.952377,
								41.337994
							],
							[
								22.881374,
								41.999297
							],
							[
								22.380526,
								42.32026
							],
							[
								22.545012,
								42.461362
							],
							[
								22.436595,
								42.580321
							],
							[
								22.604801,
								42.898519
							],
							[
								22.986019,
								43.211161
							],
							[
								22.500157,
								43.642814
							],
							[
								22.410446,
								44.008063
							],
							[
								22.65715,
								44.234923
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BHS",
				"properties": {
					"name": "The Bahamas"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-77.53466,
									23.75975
								],
								[
									-77.78,
									23.71
								],
								[
									-78.03405,
									24.28615
								],
								[
									-78.40848,
									24.57564
								],
								[
									-78.19087,
									25.2103
								],
								[
									-77.89,
									25.17
								],
								[
									-77.54,
									24.34
								],
								[
									-77.53466,
									23.75975
								]
							]
						],
						[
							[
								[
									-77.82,
									26.58
								],
								[
									-78.91,
									26.42
								],
								[
									-78.98,
									26.79
								],
								[
									-78.51,
									26.87
								],
								[
									-77.85,
									26.84
								],
								[
									-77.82,
									26.58
								]
							]
						],
						[
							[
								[
									-77,
									26.59
								],
								[
									-77.17255,
									25.87918
								],
								[
									-77.35641,
									26.00735
								],
								[
									-77.34,
									26.53
								],
								[
									-77.78802,
									26.92516
								],
								[
									-77.79,
									27.04
								],
								[
									-77,
									26.59
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BIH",
				"properties": {
					"name": "Bosnia and Herzegovina"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								19.005486,
								44.860234
							],
							[
								19.36803,
								44.863
							],
							[
								19.11761,
								44.42307
							],
							[
								19.59976,
								44.03847
							],
							[
								19.454,
								43.5681
							],
							[
								19.21852,
								43.52384
							],
							[
								19.03165,
								43.43253
							],
							[
								18.70648,
								43.20011
							],
							[
								18.56,
								42.65
							],
							[
								17.674922,
								43.028563
							],
							[
								17.297373,
								43.446341
							],
							[
								16.916156,
								43.667722
							],
							[
								16.456443,
								44.04124
							],
							[
								16.23966,
								44.351143
							],
							[
								15.750026,
								44.818712
							],
							[
								15.959367,
								45.233777
							],
							[
								16.318157,
								45.004127
							],
							[
								16.534939,
								45.211608
							],
							[
								17.002146,
								45.233777
							],
							[
								17.861783,
								45.06774
							],
							[
								18.553214,
								45.08159
							],
							[
								19.005486,
								44.860234
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BLR",
				"properties": {
					"name": "Belarus"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								23.484128,
								53.912498
							],
							[
								24.450684,
								53.905702
							],
							[
								25.536354,
								54.282423
							],
							[
								25.768433,
								54.846963
							],
							[
								26.588279,
								55.167176
							],
							[
								26.494331,
								55.615107
							],
							[
								27.10246,
								55.783314
							],
							[
								28.176709,
								56.16913
							],
							[
								29.229513,
								55.918344
							],
							[
								29.371572,
								55.670091
							],
							[
								29.896294,
								55.789463
							],
							[
								30.873909,
								55.550976
							],
							[
								30.971836,
								55.081548
							],
							[
								30.757534,
								54.811771
							],
							[
								31.384472,
								54.157056
							],
							[
								31.791424,
								53.974639
							],
							[
								31.731273,
								53.794029
							],
							[
								32.405599,
								53.618045
							],
							[
								32.693643,
								53.351421
							],
							[
								32.304519,
								53.132726
							],
							[
								31.497644,
								53.167427
							],
							[
								31.305201,
								53.073996
							],
							[
								31.540018,
								52.742052
							],
							[
								31.785998,
								52.101678
							],
							[
								30.927549,
								52.042353
							],
							[
								30.619454,
								51.822806
							],
							[
								30.555117,
								51.319503
							],
							[
								30.157364,
								51.416138
							],
							[
								29.254938,
								51.368234
							],
							[
								28.992835,
								51.602044
							],
							[
								28.617613,
								51.427714
							],
							[
								28.241615,
								51.572227
							],
							[
								27.454066,
								51.592303
							],
							[
								26.337959,
								51.832289
							],
							[
								25.327788,
								51.910656
							],
							[
								24.553106,
								51.888461
							],
							[
								24.005078,
								51.617444
							],
							[
								23.527071,
								51.578454
							],
							[
								23.508002,
								52.023647
							],
							[
								23.199494,
								52.486977
							],
							[
								23.799199,
								52.691099
							],
							[
								23.804935,
								53.089731
							],
							[
								23.527536,
								53.470122
							],
							[
								23.484128,
								53.912498
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BLZ",
				"properties": {
					"name": "Belize"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-89.14308,
								17.808319
							],
							[
								-89.150909,
								17.955468
							],
							[
								-89.029857,
								18.001511
							],
							[
								-88.848344,
								17.883198
							],
							[
								-88.490123,
								18.486831
							],
							[
								-88.300031,
								18.499982
							],
							[
								-88.296336,
								18.353273
							],
							[
								-88.106813,
								18.348674
							],
							[
								-88.123479,
								18.076675
							],
							[
								-88.285355,
								17.644143
							],
							[
								-88.197867,
								17.489475
							],
							[
								-88.302641,
								17.131694
							],
							[
								-88.239518,
								17.036066
							],
							[
								-88.355428,
								16.530774
							],
							[
								-88.551825,
								16.265467
							],
							[
								-88.732434,
								16.233635
							],
							[
								-88.930613,
								15.887273
							],
							[
								-89.229122,
								15.886938
							],
							[
								-89.150806,
								17.015577
							],
							[
								-89.14308,
								17.808319
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BMU",
				"properties": {
					"name": "Bermuda"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-64.7799734332998,
								32.3072000581802
							],
							[
								-64.7873319183061,
								32.3039237143428
							],
							[
								-64.7946942710173,
								32.3032682700388
							],
							[
								-64.8094297981283,
								32.3098175728414
							],
							[
								-64.8167896352437,
								32.3058845718466
							],
							[
								-64.8101968029642,
								32.3022833180511
							],
							[
								-64.7962291465484,
								32.2934409732427
							],
							[
								-64.7815086336978,
								32.2868973114514
							],
							[
								-64.7997025513437,
								32.2796896417328
							],
							[
								-64.8066707691087,
								32.2747767569465
							],
							[
								-64.8225587873683,
								32.2669111289395
							],
							[
								-64.8287548840306,
								32.2669075473817
							],
							[
								-64.8306732143498,
								32.2583944840235
							],
							[
								-64.8399924854972,
								32.254782282336
							],
							[
								-64.8566090462354,
								32.2547740387514
							],
							[
								-64.8682296789446,
								32.2616393614322
							],
							[
								-64.8628241459563,
								32.2724481933959
							],
							[
								-64.8748651338951,
								32.2757120264753
							],
							[
								-64.8717752856644,
								32.2819371582026
							],
							[
								-64.8671422127295,
								32.2930760547989
							],
							[
								-64.8559068764437,
								32.2960321186471
							],
							[
								-64.8597429072279,
								32.3015842021933
							],
							[
								-64.8439233486717,
								32.3140553852543
							],
							[
								-64.8350242329311,
								32.3242161760006
							],
							[
								-64.8338690593672,
								32.3294587561557
							],
							[
								-64.8520298651164,
								32.3110911879954
							],
							[
								-64.8635922932573,
								32.3048469433363
							],
							[
								-64.8686668994079,
								32.30910745083
							],
							[
								-64.8721354593415,
								32.3041908606301
							],
							[
								-64.8779667328485,
								32.3038632800462
							],
							[
								-64.8780046844321,
								32.2907757831692
							],
							[
								-64.8849776658292,
								32.2819261366004
							],
							[
								-64.8783230004629,
								32.2613001418681
							],
							[
								-64.863194968877,
								32.2465799485801
							],
							[
								-64.8519819555722,
								32.2485519134663
							],
							[
								-64.842311980074,
								32.2492123317296
							],
							[
								-64.8388242605209,
								32.2475773472534
							],
							[
								-64.8334002575532,
								32.2462714714698
							],
							[
								-64.8256389530584,
								32.2472637398594
							],
							[
								-64.8205697556026,
								32.2531698880328
							],
							[
								-64.8105087275579,
								32.2561208974156
							],
							[
								-64.7900177727338,
								32.2659446936992
							],
							[
								-64.7745415970416,
								32.2718413023427
							],
							[
								-64.7644742436426,
								32.2855931353214
							],
							[
								-64.7551803442276,
								32.2908326702531
							],
							[
								-64.7423982971436,
								32.2996734994024
							],
							[
								-64.7206991797682,
								32.3137542201258
							],
							[
								-64.7117851247134,
								32.3176823360806
							],
							[
								-64.6962778813133,
								32.3275029115532
							],
							[
								-64.6768921127452,
								32.3324095397555
							],
							[
								-64.6567136927777,
								32.3451776458469
							],
							[
								-64.6532168823499,
								32.3494356627941
							],
							[
								-64.6605720384429,
								32.3589423487763
							],
							[
								-64.65125819471,
								32.3615600906466
							],
							[
								-64.6462011670816,
								32.36975169749
							],
							[
								-64.6613227512832,
								32.3763135008721
							],
							[
								-64.6690666074397,
								32.388444543924
							],
							[
								-64.6834270548595,
								32.3854968316788
							],
							[
								-64.6954617672714,
								32.3763221285869
							],
							[
								-64.70438689565,
								32.3704254760469
							],
							[
								-64.7117569982798,
								32.368132600249
							],
							[
								-64.7061764744404,
								32.3600110593559
							],
							[
								-64.700531552697,
								32.3590601356818
							],
							[
								-64.6940348033967,
								32.3640708659835
							],
							[
								-64.6895164826082,
								32.3633598579866
							],
							[
								-64.6864150099255,
								32.3547797587266
							],
							[
								-64.6824635995504,
								32.3540628176846
							],
							[
								-64.6835876652835,
								32.3626447677968
							],
							[
								-64.6801998697415,
								32.3631199096979
							],
							[
								-64.6672170444687,
								32.3597751617473
							],
							[
								-64.6598811264978,
								32.3497625771755
							],
							[
								-64.6737331235384,
								32.3390281851635
							],
							[
								-64.6887090648183,
								32.3342439408053
							],
							[
								-64.706732854446,
								32.3429010723036
							],
							[
								-64.7149301576112,
								32.3552188753513
							],
							[
								-64.7185967666669,
								32.3552239212394
							],
							[
								-64.7214189847314,
								32.3518830231342
							],
							[
								-64.7270616067222,
								32.3466461715475
							],
							[
								-64.734962460882,
								32.3442819830499
							],
							[
								-64.7383521549094,
								32.3407216514918
							],
							[
								-64.7411729976333,
								32.3311790864627
							],
							[
								-64.7423019216485,
								32.323311561213
							],
							[
								-64.7462482354281,
								32.318538611581
							],
							[
								-64.7566773739613,
								32.3130509130175
							],
							[
								-64.768738200563,
								32.3088369816572
							],
							[
								-64.7799734332998,
								32.3072000581802
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BOL",
				"properties": {
					"name": "Bolivia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-62.846468,
								-22.034985
							],
							[
								-63.986838,
								-21.993644
							],
							[
								-64.377021,
								-22.798091
							],
							[
								-64.964892,
								-22.075862
							],
							[
								-66.273339,
								-21.83231
							],
							[
								-67.106674,
								-22.735925
							],
							[
								-67.82818,
								-22.872919
							],
							[
								-68.219913,
								-21.494347
							],
							[
								-68.757167,
								-20.372658
							],
							[
								-68.442225,
								-19.405068
							],
							[
								-68.966818,
								-18.981683
							],
							[
								-69.100247,
								-18.260125
							],
							[
								-69.590424,
								-17.580012
							],
							[
								-68.959635,
								-16.500698
							],
							[
								-69.389764,
								-15.660129
							],
							[
								-69.160347,
								-15.323974
							],
							[
								-69.339535,
								-14.953195
							],
							[
								-68.948887,
								-14.453639
							],
							[
								-68.929224,
								-13.602684
							],
							[
								-68.88008,
								-12.899729
							],
							[
								-68.66508,
								-12.5613
							],
							[
								-69.529678,
								-10.951734
							],
							[
								-68.786158,
								-11.03638
							],
							[
								-68.271254,
								-11.014521
							],
							[
								-68.048192,
								-10.712059
							],
							[
								-67.173801,
								-10.306812
							],
							[
								-66.646908,
								-9.931331
							],
							[
								-65.338435,
								-9.761988
							],
							[
								-65.444837,
								-10.511451
							],
							[
								-65.321899,
								-10.895872
							],
							[
								-65.402281,
								-11.56627
							],
							[
								-64.316353,
								-12.461978
							],
							[
								-63.196499,
								-12.627033
							],
							[
								-62.80306,
								-13.000653
							],
							[
								-62.127081,
								-13.198781
							],
							[
								-61.713204,
								-13.489202
							],
							[
								-61.084121,
								-13.479384
							],
							[
								-60.503304,
								-13.775955
							],
							[
								-60.459198,
								-14.354007
							],
							[
								-60.264326,
								-14.645979
							],
							[
								-60.251149,
								-15.077219
							],
							[
								-60.542966,
								-15.09391
							],
							[
								-60.15839,
								-16.258284
							],
							[
								-58.24122,
								-16.299573
							],
							[
								-58.388058,
								-16.877109
							],
							[
								-58.280804,
								-17.27171
							],
							[
								-57.734558,
								-17.552468
							],
							[
								-57.498371,
								-18.174188
							],
							[
								-57.676009,
								-18.96184
							],
							[
								-57.949997,
								-19.400004
							],
							[
								-57.853802,
								-19.969995
							],
							[
								-58.166392,
								-20.176701
							],
							[
								-58.183471,
								-19.868399
							],
							[
								-59.115042,
								-19.356906
							],
							[
								-60.043565,
								-19.342747
							],
							[
								-61.786326,
								-19.633737
							],
							[
								-62.265961,
								-20.513735
							],
							[
								-62.291179,
								-21.051635
							],
							[
								-62.685057,
								-22.249029
							],
							[
								-62.846468,
								-22.034985
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BRA",
				"properties": {
					"name": "Brazil"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-57.625133,
								-30.216295
							],
							[
								-56.2909,
								-28.852761
							],
							[
								-55.162286,
								-27.881915
							],
							[
								-54.490725,
								-27.474757
							],
							[
								-53.648735,
								-26.923473
							],
							[
								-53.628349,
								-26.124865
							],
							[
								-54.13005,
								-25.547639
							],
							[
								-54.625291,
								-25.739255
							],
							[
								-54.428946,
								-25.162185
							],
							[
								-54.293476,
								-24.5708
							],
							[
								-54.29296,
								-24.021014
							],
							[
								-54.652834,
								-23.839578
							],
							[
								-55.027902,
								-24.001274
							],
							[
								-55.400747,
								-23.956935
							],
							[
								-55.517639,
								-23.571998
							],
							[
								-55.610683,
								-22.655619
							],
							[
								-55.797958,
								-22.35693
							],
							[
								-56.473317,
								-22.0863
							],
							[
								-56.88151,
								-22.282154
							],
							[
								-57.937156,
								-22.090176
							],
							[
								-57.870674,
								-20.732688
							],
							[
								-58.166392,
								-20.176701
							],
							[
								-57.853802,
								-19.969995
							],
							[
								-57.949997,
								-19.400004
							],
							[
								-57.676009,
								-18.96184
							],
							[
								-57.498371,
								-18.174188
							],
							[
								-57.734558,
								-17.552468
							],
							[
								-58.280804,
								-17.27171
							],
							[
								-58.388058,
								-16.877109
							],
							[
								-58.24122,
								-16.299573
							],
							[
								-60.15839,
								-16.258284
							],
							[
								-60.542966,
								-15.09391
							],
							[
								-60.251149,
								-15.077219
							],
							[
								-60.264326,
								-14.645979
							],
							[
								-60.459198,
								-14.354007
							],
							[
								-60.503304,
								-13.775955
							],
							[
								-61.084121,
								-13.479384
							],
							[
								-61.713204,
								-13.489202
							],
							[
								-62.127081,
								-13.198781
							],
							[
								-62.80306,
								-13.000653
							],
							[
								-63.196499,
								-12.627033
							],
							[
								-64.316353,
								-12.461978
							],
							[
								-65.402281,
								-11.56627
							],
							[
								-65.321899,
								-10.895872
							],
							[
								-65.444837,
								-10.511451
							],
							[
								-65.338435,
								-9.761988
							],
							[
								-66.646908,
								-9.931331
							],
							[
								-67.173801,
								-10.306812
							],
							[
								-68.048192,
								-10.712059
							],
							[
								-68.271254,
								-11.014521
							],
							[
								-68.786158,
								-11.03638
							],
							[
								-69.529678,
								-10.951734
							],
							[
								-70.093752,
								-11.123972
							],
							[
								-70.548686,
								-11.009147
							],
							[
								-70.481894,
								-9.490118
							],
							[
								-71.302412,
								-10.079436
							],
							[
								-72.184891,
								-10.053598
							],
							[
								-72.563033,
								-9.520194
							],
							[
								-73.226713,
								-9.462213
							],
							[
								-73.015383,
								-9.032833
							],
							[
								-73.571059,
								-8.424447
							],
							[
								-73.987235,
								-7.52383
							],
							[
								-73.723401,
								-7.340999
							],
							[
								-73.724487,
								-6.918595
							],
							[
								-73.120027,
								-6.629931
							],
							[
								-73.219711,
								-6.089189
							],
							[
								-72.964507,
								-5.741251
							],
							[
								-72.891928,
								-5.274561
							],
							[
								-71.748406,
								-4.593983
							],
							[
								-70.928843,
								-4.401591
							],
							[
								-70.794769,
								-4.251265
							],
							[
								-69.893635,
								-4.298187
							],
							[
								-69.444102,
								-1.556287
							],
							[
								-69.420486,
								-1.122619
							],
							[
								-69.577065,
								-0.549992
							],
							[
								-70.020656,
								-0.185156
							],
							[
								-70.015566,
								0.541414
							],
							[
								-69.452396,
								0.706159
							],
							[
								-69.252434,
								0.602651
							],
							[
								-69.218638,
								0.985677
							],
							[
								-69.804597,
								1.089081
							],
							[
								-69.816973,
								1.714805
							],
							[
								-67.868565,
								1.692455
							],
							[
								-67.53781,
								2.037163
							],
							[
								-67.259998,
								1.719999
							],
							[
								-67.065048,
								1.130112
							],
							[
								-66.876326,
								1.253361
							],
							[
								-66.325765,
								0.724452
							],
							[
								-65.548267,
								0.789254
							],
							[
								-65.354713,
								1.095282
							],
							[
								-64.611012,
								1.328731
							],
							[
								-64.199306,
								1.492855
							],
							[
								-64.083085,
								1.916369
							],
							[
								-63.368788,
								2.2009
							],
							[
								-63.422867,
								2.411068
							],
							[
								-64.269999,
								2.497006
							],
							[
								-64.408828,
								3.126786
							],
							[
								-64.368494,
								3.79721
							],
							[
								-64.816064,
								4.056445
							],
							[
								-64.628659,
								4.148481
							],
							[
								-63.888343,
								4.02053
							],
							[
								-63.093198,
								3.770571
							],
							[
								-62.804533,
								4.006965
							],
							[
								-62.08543,
								4.162124
							],
							[
								-60.966893,
								4.536468
							],
							[
								-60.601179,
								4.918098
							],
							[
								-60.733574,
								5.200277
							],
							[
								-60.213683,
								5.244486
							],
							[
								-59.980959,
								5.014061
							],
							[
								-60.111002,
								4.574967
							],
							[
								-59.767406,
								4.423503
							],
							[
								-59.53804,
								3.958803
							],
							[
								-59.815413,
								3.606499
							],
							[
								-59.974525,
								2.755233
							],
							[
								-59.718546,
								2.24963
							],
							[
								-59.646044,
								1.786894
							],
							[
								-59.030862,
								1.317698
							],
							[
								-58.540013,
								1.268088
							],
							[
								-58.429477,
								1.463942
							],
							[
								-58.11345,
								1.507195
							],
							[
								-57.660971,
								1.682585
							],
							[
								-57.335823,
								1.948538
							],
							[
								-56.782704,
								1.863711
							],
							[
								-56.539386,
								1.899523
							],
							[
								-55.995698,
								1.817667
							],
							[
								-55.9056,
								2.021996
							],
							[
								-56.073342,
								2.220795
							],
							[
								-55.973322,
								2.510364
							],
							[
								-55.569755,
								2.421506
							],
							[
								-55.097587,
								2.523748
							],
							[
								-54.524754,
								2.311849
							],
							[
								-54.088063,
								2.105557
							],
							[
								-53.778521,
								2.376703
							],
							[
								-53.554839,
								2.334897
							],
							[
								-53.418465,
								2.053389
							],
							[
								-52.939657,
								2.124858
							],
							[
								-52.556425,
								2.504705
							],
							[
								-52.249338,
								3.241094
							],
							[
								-51.657797,
								4.156232
							],
							[
								-51.317146,
								4.203491
							],
							[
								-51.069771,
								3.650398
							],
							[
								-50.508875,
								1.901564
							],
							[
								-49.974076,
								1.736483
							],
							[
								-49.947101,
								1.04619
							],
							[
								-50.699251,
								0.222984
							],
							[
								-50.388211,
								-0.078445
							],
							[
								-48.620567,
								-0.235489
							],
							[
								-48.584497,
								-1.237805
							],
							[
								-47.824956,
								-0.581618
							],
							[
								-46.566584,
								-0.941028
							],
							[
								-44.905703,
								-1.55174
							],
							[
								-44.417619,
								-2.13775
							],
							[
								-44.581589,
								-2.691308
							],
							[
								-43.418791,
								-2.38311
							],
							[
								-41.472657,
								-2.912018
							],
							[
								-39.978665,
								-2.873054
							],
							[
								-38.500383,
								-3.700652
							],
							[
								-37.223252,
								-4.820946
							],
							[
								-36.452937,
								-5.109404
							],
							[
								-35.597796,
								-5.149504
							],
							[
								-35.235389,
								-5.464937
							],
							[
								-34.89603,
								-6.738193
							],
							[
								-34.729993,
								-7.343221
							],
							[
								-35.128212,
								-8.996401
							],
							[
								-35.636967,
								-9.649282
							],
							[
								-37.046519,
								-11.040721
							],
							[
								-37.683612,
								-12.171195
							],
							[
								-38.423877,
								-13.038119
							],
							[
								-38.673887,
								-13.057652
							],
							[
								-38.953276,
								-13.79337
							],
							[
								-38.882298,
								-15.667054
							],
							[
								-39.161092,
								-17.208407
							],
							[
								-39.267339,
								-17.867746
							],
							[
								-39.583521,
								-18.262296
							],
							[
								-39.760823,
								-19.599113
							],
							[
								-40.774741,
								-20.904512
							],
							[
								-40.944756,
								-21.937317
							],
							[
								-41.754164,
								-22.370676
							],
							[
								-41.988284,
								-22.97007
							],
							[
								-43.074704,
								-22.967693
							],
							[
								-44.647812,
								-23.351959
							],
							[
								-45.352136,
								-23.796842
							],
							[
								-46.472093,
								-24.088969
							],
							[
								-47.648972,
								-24.885199
							],
							[
								-48.495458,
								-25.877025
							],
							[
								-48.641005,
								-26.623698
							],
							[
								-48.474736,
								-27.175912
							],
							[
								-48.66152,
								-28.186135
							],
							[
								-48.888457,
								-28.674115
							],
							[
								-49.587329,
								-29.224469
							],
							[
								-50.696874,
								-30.984465
							],
							[
								-51.576226,
								-31.777698
							],
							[
								-52.256081,
								-32.24537
							],
							[
								-52.7121,
								-33.196578
							],
							[
								-53.373662,
								-33.768378
							],
							[
								-53.650544,
								-33.202004
							],
							[
								-53.209589,
								-32.727666
							],
							[
								-53.787952,
								-32.047243
							],
							[
								-54.572452,
								-31.494511
							],
							[
								-55.60151,
								-30.853879
							],
							[
								-55.973245,
								-30.883076
							],
							[
								-56.976026,
								-30.109686
							],
							[
								-57.625133,
								-30.216295
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BRN",
				"properties": {
					"name": "Brunei"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								114.204017,
								4.525874
							],
							[
								114.599961,
								4.900011
							],
							[
								115.45071,
								5.44773
							],
							[
								115.4057,
								4.955228
							],
							[
								115.347461,
								4.316636
							],
							[
								114.869557,
								4.348314
							],
							[
								114.659596,
								4.007637
							],
							[
								114.204017,
								4.525874
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BTN",
				"properties": {
					"name": "Bhutan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								91.696657,
								27.771742
							],
							[
								92.103712,
								27.452614
							],
							[
								92.033484,
								26.83831
							],
							[
								91.217513,
								26.808648
							],
							[
								90.373275,
								26.875724
							],
							[
								89.744528,
								26.719403
							],
							[
								88.835643,
								27.098966
							],
							[
								88.814248,
								27.299316
							],
							[
								89.47581,
								28.042759
							],
							[
								90.015829,
								28.296439
							],
							[
								90.730514,
								28.064954
							],
							[
								91.258854,
								28.040614
							],
							[
								91.696657,
								27.771742
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "BWA",
				"properties": {
					"name": "Botswana"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								25.649163,
								-18.536026
							],
							[
								25.850391,
								-18.714413
							],
							[
								26.164791,
								-19.293086
							],
							[
								27.296505,
								-20.39152
							],
							[
								27.724747,
								-20.499059
							],
							[
								27.727228,
								-20.851802
							],
							[
								28.02137,
								-21.485975
							],
							[
								28.794656,
								-21.639454
							],
							[
								29.432188,
								-22.091313
							],
							[
								28.017236,
								-22.827754
							],
							[
								27.11941,
								-23.574323
							],
							[
								26.786407,
								-24.240691
							],
							[
								26.485753,
								-24.616327
							],
							[
								25.941652,
								-24.696373
							],
							[
								25.765849,
								-25.174845
							],
							[
								25.664666,
								-25.486816
							],
							[
								25.025171,
								-25.71967
							],
							[
								24.211267,
								-25.670216
							],
							[
								23.73357,
								-25.390129
							],
							[
								23.312097,
								-25.26869
							],
							[
								22.824271,
								-25.500459
							],
							[
								22.579532,
								-25.979448
							],
							[
								22.105969,
								-26.280256
							],
							[
								21.605896,
								-26.726534
							],
							[
								20.889609,
								-26.828543
							],
							[
								20.66647,
								-26.477453
							],
							[
								20.758609,
								-25.868136
							],
							[
								20.165726,
								-24.917962
							],
							[
								19.895768,
								-24.76779
							],
							[
								19.895458,
								-21.849157
							],
							[
								20.881134,
								-21.814327
							],
							[
								20.910641,
								-18.252219
							],
							[
								21.65504,
								-18.219146
							],
							[
								23.196858,
								-17.869038
							],
							[
								23.579006,
								-18.281261
							],
							[
								24.217365,
								-17.889347
							],
							[
								24.520705,
								-17.887125
							],
							[
								25.084443,
								-17.661816
							],
							[
								25.264226,
								-17.73654
							],
							[
								25.649163,
								-18.536026
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CAF",
				"properties": {
					"name": "Central African Republic"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								15.27946,
								7.421925
							],
							[
								16.106232,
								7.497088
							],
							[
								16.290562,
								7.754307
							],
							[
								16.456185,
								7.734774
							],
							[
								16.705988,
								7.508328
							],
							[
								17.96493,
								7.890914
							],
							[
								18.389555,
								8.281304
							],
							[
								18.911022,
								8.630895
							],
							[
								18.81201,
								8.982915
							],
							[
								19.094008,
								9.074847
							],
							[
								20.059685,
								9.012706
							],
							[
								21.000868,
								9.475985
							],
							[
								21.723822,
								10.567056
							],
							[
								22.231129,
								10.971889
							],
							[
								22.864165,
								11.142395
							],
							[
								22.977544,
								10.714463
							],
							[
								23.554304,
								10.089255
							],
							[
								23.55725,
								9.681218
							],
							[
								23.394779,
								9.265068
							],
							[
								23.459013,
								8.954286
							],
							[
								23.805813,
								8.666319
							],
							[
								24.567369,
								8.229188
							],
							[
								25.114932,
								7.825104
							],
							[
								25.124131,
								7.500085
							],
							[
								25.796648,
								6.979316
							],
							[
								26.213418,
								6.546603
							],
							[
								26.465909,
								5.946717
							],
							[
								27.213409,
								5.550953
							],
							[
								27.374226,
								5.233944
							],
							[
								27.044065,
								5.127853
							],
							[
								26.402761,
								5.150875
							],
							[
								25.650455,
								5.256088
							],
							[
								25.278798,
								5.170408
							],
							[
								25.128833,
								4.927245
							],
							[
								24.805029,
								4.897247
							],
							[
								24.410531,
								5.108784
							],
							[
								23.297214,
								4.609693
							],
							[
								22.84148,
								4.710126
							],
							[
								22.704124,
								4.633051
							],
							[
								22.405124,
								4.02916
							],
							[
								21.659123,
								4.224342
							],
							[
								20.927591,
								4.322786
							],
							[
								20.290679,
								4.691678
							],
							[
								19.467784,
								5.031528
							],
							[
								18.932312,
								4.709506
							],
							[
								18.542982,
								4.201785
							],
							[
								18.453065,
								3.504386
							],
							[
								17.8099,
								3.560196
							],
							[
								17.133042,
								3.728197
							],
							[
								16.537058,
								3.198255
							],
							[
								16.012852,
								2.26764
							],
							[
								15.907381,
								2.557389
							],
							[
								15.862732,
								3.013537
							],
							[
								15.405396,
								3.335301
							],
							[
								15.03622,
								3.851367
							],
							[
								14.950953,
								4.210389
							],
							[
								14.478372,
								4.732605
							],
							[
								14.558936,
								5.030598
							],
							[
								14.459407,
								5.451761
							],
							[
								14.53656,
								6.226959
							],
							[
								14.776545,
								6.408498
							],
							[
								15.27946,
								7.421925
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CAN",
				"properties": {
					"name": "Canada"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-63.6645,
									46.55001
								],
								[
									-62.9393,
									46.41587
								],
								[
									-62.01208,
									46.44314
								],
								[
									-62.50391,
									46.03339
								],
								[
									-62.87433,
									45.96818
								],
								[
									-64.1428,
									46.39265
								],
								[
									-64.39261,
									46.72747
								],
								[
									-64.01486,
									47.03601
								],
								[
									-63.6645,
									46.55001
								]
							]
						],
						[
							[
								[
									-61.806305,
									49.10506
								],
								[
									-62.29318,
									49.08717
								],
								[
									-63.58926,
									49.40069
								],
								[
									-64.51912,
									49.87304
								],
								[
									-64.17322,
									49.95718
								],
								[
									-62.85829,
									49.70641
								],
								[
									-61.835585,
									49.28855
								],
								[
									-61.806305,
									49.10506
								]
							]
						],
						[
							[
								[
									-123.510002,
									48.510011
								],
								[
									-124.012891,
									48.370846
								],
								[
									-125.655013,
									48.825005
								],
								[
									-125.954994,
									49.179996
								],
								[
									-126.850004,
									49.53
								],
								[
									-127.029993,
									49.814996
								],
								[
									-128.059336,
									49.994959
								],
								[
									-128.444584,
									50.539138
								],
								[
									-128.358414,
									50.770648
								],
								[
									-127.308581,
									50.552574
								],
								[
									-126.695001,
									50.400903
								],
								[
									-125.755007,
									50.295018
								],
								[
									-125.415002,
									49.950001
								],
								[
									-124.920768,
									49.475275
								],
								[
									-123.922509,
									49.062484
								],
								[
									-123.510002,
									48.510011
								]
							]
						],
						[
							[
								[
									-56.134036,
									50.68701
								],
								[
									-56.795882,
									49.812309
								],
								[
									-56.143105,
									50.150117
								],
								[
									-55.471492,
									49.935815
								],
								[
									-55.822401,
									49.587129
								],
								[
									-54.935143,
									49.313011
								],
								[
									-54.473775,
									49.556691
								],
								[
									-53.476549,
									49.249139
								],
								[
									-53.786014,
									48.516781
								],
								[
									-53.086134,
									48.687804
								],
								[
									-52.958648,
									48.157164
								],
								[
									-52.648099,
									47.535548
								],
								[
									-53.069158,
									46.655499
								],
								[
									-53.521456,
									46.618292
								],
								[
									-54.178936,
									46.807066
								],
								[
									-53.961869,
									47.625207
								],
								[
									-54.240482,
									47.752279
								],
								[
									-55.400773,
									46.884994
								],
								[
									-55.997481,
									46.91972
								],
								[
									-55.291219,
									47.389562
								],
								[
									-56.250799,
									47.632545
								],
								[
									-57.325229,
									47.572807
								],
								[
									-59.266015,
									47.603348
								],
								[
									-59.419494,
									47.899454
								],
								[
									-58.796586,
									48.251525
								],
								[
									-59.231625,
									48.523188
								],
								[
									-58.391805,
									49.125581
								],
								[
									-57.35869,
									50.718274
								],
								[
									-56.73865,
									51.287438
								],
								[
									-55.870977,
									51.632094
								],
								[
									-55.406974,
									51.588273
								],
								[
									-55.600218,
									51.317075
								],
								[
									-56.134036,
									50.68701
								]
							]
						],
						[
							[
								[
									-132.710008,
									54.040009
								],
								[
									-131.74999,
									54.120004
								],
								[
									-132.04948,
									52.984621
								],
								[
									-131.179043,
									52.180433
								],
								[
									-131.57783,
									52.182371
								],
								[
									-132.180428,
									52.639707
								],
								[
									-132.549992,
									53.100015
								],
								[
									-133.054611,
									53.411469
								],
								[
									-133.239664,
									53.85108
								],
								[
									-133.180004,
									54.169975
								],
								[
									-132.710008,
									54.040009
								]
							]
						],
						[
							[
								[
									-79.26582,
									62.158675
								],
								[
									-79.65752,
									61.63308
								],
								[
									-80.09956,
									61.7181
								],
								[
									-80.36215,
									62.01649
								],
								[
									-80.315395,
									62.085565
								],
								[
									-79.92939,
									62.3856
								],
								[
									-79.52002,
									62.36371
								],
								[
									-79.26582,
									62.158675
								]
							]
						],
						[
							[
								[
									-81.89825,
									62.7108
								],
								[
									-83.06857,
									62.15922
								],
								[
									-83.77462,
									62.18231
								],
								[
									-83.99367,
									62.4528
								],
								[
									-83.25048,
									62.91409
								],
								[
									-81.87699,
									62.90458
								],
								[
									-81.89825,
									62.7108
								]
							]
						],
						[
							[
								[
									-85.161308,
									65.657285
								],
								[
									-84.975764,
									65.217518
								],
								[
									-84.464012,
									65.371772
								],
								[
									-83.882626,
									65.109618
								],
								[
									-82.787577,
									64.766693
								],
								[
									-81.642014,
									64.455136
								],
								[
									-81.55344,
									63.979609
								],
								[
									-80.817361,
									64.057486
								],
								[
									-80.103451,
									63.725981
								],
								[
									-80.99102,
									63.411246
								],
								[
									-82.547178,
									63.651722
								],
								[
									-83.108798,
									64.101876
								],
								[
									-84.100417,
									63.569712
								],
								[
									-85.523405,
									63.052379
								],
								[
									-85.866769,
									63.637253
								],
								[
									-87.221983,
									63.541238
								],
								[
									-86.35276,
									64.035833
								],
								[
									-86.224886,
									64.822917
								],
								[
									-85.883848,
									65.738778
								],
								[
									-85.161308,
									65.657285
								]
							]
						],
						[
							[
								[
									-75.86588,
									67.14886
								],
								[
									-76.98687,
									67.09873
								],
								[
									-77.2364,
									67.58809
								],
								[
									-76.81166,
									68.14856
								],
								[
									-75.89521,
									68.28721
								],
								[
									-75.1145,
									68.01036
								],
								[
									-75.10333,
									67.58202
								],
								[
									-75.21597,
									67.44425
								],
								[
									-75.86588,
									67.14886
								]
							]
						],
						[
							[
								[
									-95.647681,
									69.10769
								],
								[
									-96.269521,
									68.75704
								],
								[
									-97.617401,
									69.06003
								],
								[
									-98.431801,
									68.9507
								],
								[
									-99.797401,
									69.40003
								],
								[
									-98.917401,
									69.71003
								],
								[
									-98.218261,
									70.14354
								],
								[
									-97.157401,
									69.86003
								],
								[
									-96.557401,
									69.68003
								],
								[
									-96.257401,
									69.49003
								],
								[
									-95.647681,
									69.10769
								]
							]
						],
						[
							[
								[
									-90.5471,
									69.49766
								],
								[
									-90.55151,
									68.47499
								],
								[
									-89.21515,
									69.25873
								],
								[
									-88.01966,
									68.61508
								],
								[
									-88.31749,
									67.87338
								],
								[
									-87.35017,
									67.19872
								],
								[
									-86.30607,
									67.92146
								],
								[
									-85.57664,
									68.78456
								],
								[
									-85.52197,
									69.88211
								],
								[
									-84.10081,
									69.80539
								],
								[
									-82.62258,
									69.65826
								],
								[
									-81.28043,
									69.16202
								],
								[
									-81.2202,
									68.66567
								],
								[
									-81.96436,
									68.13253
								],
								[
									-81.25928,
									67.59716
								],
								[
									-81.38653,
									67.11078
								],
								[
									-83.34456,
									66.41154
								],
								[
									-84.73542,
									66.2573
								],
								[
									-85.76943,
									66.55833
								],
								[
									-86.0676,
									66.05625
								],
								[
									-87.03143,
									65.21297
								],
								[
									-87.32324,
									64.77563
								],
								[
									-88.48296,
									64.09897
								],
								[
									-89.91444,
									64.03273
								],
								[
									-90.70398,
									63.61017
								],
								[
									-90.77004,
									62.96021
								],
								[
									-91.93342,
									62.83508
								],
								[
									-93.15698,
									62.02469
								],
								[
									-94.24153,
									60.89865
								],
								[
									-94.62931,
									60.11021
								],
								[
									-94.6846,
									58.94882
								],
								[
									-93.21502,
									58.78212
								],
								[
									-92.76462,
									57.84571
								],
								[
									-92.29703,
									57.08709
								],
								[
									-90.89769,
									57.28468
								],
								[
									-89.03953,
									56.85172
								],
								[
									-88.03978,
									56.47162
								],
								[
									-87.32421,
									55.99914
								],
								[
									-86.07121,
									55.72383
								],
								[
									-85.01181,
									55.3026
								],
								[
									-83.36055,
									55.24489
								],
								[
									-82.27285,
									55.14832
								],
								[
									-82.4362,
									54.28227
								],
								[
									-82.12502,
									53.27703
								],
								[
									-81.40075,
									52.15788
								],
								[
									-79.91289,
									51.20842
								],
								[
									-79.14301,
									51.53393
								],
								[
									-78.60191,
									52.56208
								],
								[
									-79.12421,
									54.14145
								],
								[
									-79.82958,
									54.66772
								],
								[
									-78.22874,
									55.13645
								],
								[
									-77.0956,
									55.83741
								],
								[
									-76.54137,
									56.53423
								],
								[
									-76.62319,
									57.20263
								],
								[
									-77.30226,
									58.05209
								],
								[
									-78.51688,
									58.80458
								],
								[
									-77.33676,
									59.85261
								],
								[
									-77.77272,
									60.75788
								],
								[
									-78.10687,
									62.31964
								],
								[
									-77.41067,
									62.55053
								],
								[
									-75.69621,
									62.2784
								],
								[
									-74.6682,
									62.18111
								],
								[
									-73.83988,
									62.4438
								],
								[
									-72.90853,
									62.10507
								],
								[
									-71.67708,
									61.52535
								],
								[
									-71.37369,
									61.13717
								],
								[
									-69.59042,
									61.06141
								],
								[
									-69.62033,
									60.22125
								],
								[
									-69.2879,
									58.95736
								],
								[
									-68.37455,
									58.80106
								],
								[
									-67.64976,
									58.21206
								],
								[
									-66.20178,
									58.76731
								],
								[
									-65.24517,
									59.87071
								],
								[
									-64.58352,
									60.33558
								],
								[
									-63.80475,
									59.4426
								],
								[
									-62.50236,
									58.16708
								],
								[
									-61.39655,
									56.96745
								],
								[
									-61.79866,
									56.33945
								],
								[
									-60.46853,
									55.77548
								],
								[
									-59.56962,
									55.20407
								],
								[
									-57.97508,
									54.94549
								],
								[
									-57.3332,
									54.6265
								],
								[
									-56.93689,
									53.78032
								],
								[
									-56.15811,
									53.64749
								],
								[
									-55.75632,
									53.27036
								],
								[
									-55.68338,
									52.14664
								],
								[
									-56.40916,
									51.7707
								],
								[
									-57.12691,
									51.41972
								],
								[
									-58.77482,
									51.0643
								],
								[
									-60.03309,
									50.24277
								],
								[
									-61.72366,
									50.08046
								],
								[
									-63.86251,
									50.29099
								],
								[
									-65.36331,
									50.2982
								],
								[
									-66.39905,
									50.22897
								],
								[
									-67.23631,
									49.51156
								],
								[
									-68.51114,
									49.06836
								],
								[
									-69.95362,
									47.74488
								],
								[
									-71.10458,
									46.82171
								],
								[
									-70.25522,
									46.98606
								],
								[
									-68.65,
									48.3
								],
								[
									-66.55243,
									49.1331
								],
								[
									-65.05626,
									49.23278
								],
								[
									-64.17099,
									48.74248
								],
								[
									-65.11545,
									48.07085
								],
								[
									-64.79854,
									46.99297
								],
								[
									-64.47219,
									46.23849
								],
								[
									-63.17329,
									45.73902
								],
								[
									-61.52072,
									45.88377
								],
								[
									-60.51815,
									47.00793
								],
								[
									-60.4486,
									46.28264
								],
								[
									-59.80287,
									45.9204
								],
								[
									-61.03988,
									45.26525
								],
								[
									-63.25471,
									44.67014
								],
								[
									-64.24656,
									44.26553
								],
								[
									-65.36406,
									43.54523
								],
								[
									-66.1234,
									43.61867
								],
								[
									-66.16173,
									44.46512
								],
								[
									-64.42549,
									45.29204
								],
								[
									-66.02605,
									45.25931
								],
								[
									-67.13741,
									45.13753
								],
								[
									-67.79134,
									45.70281
								],
								[
									-67.79046,
									47.06636
								],
								[
									-68.23444,
									47.35486
								],
								[
									-68.905,
									47.185
								],
								[
									-69.237216,
									47.447781
								],
								[
									-69.99997,
									46.69307
								],
								[
									-70.305,
									45.915
								],
								[
									-70.66,
									45.46
								],
								[
									-71.08482,
									45.30524
								],
								[
									-71.405,
									45.255
								],
								[
									-71.50506,
									45.0082
								],
								[
									-73.34783,
									45.00738
								],
								[
									-74.867,
									45.00048
								],
								[
									-75.31821,
									44.81645
								],
								[
									-76.375,
									44.09631
								],
								[
									-76.5,
									44.018459
								],
								[
									-76.820034,
									43.628784
								],
								[
									-77.737885,
									43.629056
								],
								[
									-78.72028,
									43.625089
								],
								[
									-79.171674,
									43.466339
								],
								[
									-79.01,
									43.27
								],
								[
									-78.92,
									42.965
								],
								[
									-78.939362,
									42.863611
								],
								[
									-80.247448,
									42.3662
								],
								[
									-81.277747,
									42.209026
								],
								[
									-82.439278,
									41.675105
								],
								[
									-82.690089,
									41.675105
								],
								[
									-83.02981,
									41.832796
								],
								[
									-83.142,
									41.975681
								],
								[
									-83.12,
									42.08
								],
								[
									-82.9,
									42.43
								],
								[
									-82.43,
									42.98
								],
								[
									-82.137642,
									43.571088
								],
								[
									-82.337763,
									44.44
								],
								[
									-82.550925,
									45.347517
								],
								[
									-83.592851,
									45.816894
								],
								[
									-83.469551,
									45.994686
								],
								[
									-83.616131,
									46.116927
								],
								[
									-83.890765,
									46.116927
								],
								[
									-84.091851,
									46.275419
								],
								[
									-84.14212,
									46.512226
								],
								[
									-84.3367,
									46.40877
								],
								[
									-84.6049,
									46.4396
								],
								[
									-84.543749,
									46.538684
								],
								[
									-84.779238,
									46.637102
								],
								[
									-84.87608,
									46.900083
								],
								[
									-85.652363,
									47.220219
								],
								[
									-86.461991,
									47.553338
								],
								[
									-87.439793,
									47.94
								],
								[
									-88.378114,
									48.302918
								],
								[
									-89.272917,
									48.019808
								],
								[
									-89.6,
									48.01
								],
								[
									-90.83,
									48.27
								],
								[
									-91.64,
									48.14
								],
								[
									-92.61,
									48.45
								],
								[
									-93.63087,
									48.60926
								],
								[
									-94.32914,
									48.67074
								],
								[
									-94.64,
									48.84
								],
								[
									-94.81758,
									49.38905
								],
								[
									-95.15609,
									49.38425
								],
								[
									-95.15907,
									49
								],
								[
									-97.22872,
									49.0007
								],
								[
									-100.65,
									49
								],
								[
									-104.04826,
									48.99986
								],
								[
									-107.05,
									49
								],
								[
									-110.05,
									49
								],
								[
									-113,
									49
								],
								[
									-116.04818,
									49
								],
								[
									-117.03121,
									49
								],
								[
									-120,
									49
								],
								[
									-122.84,
									49
								],
								[
									-122.97421,
									49.002538
								],
								[
									-124.91024,
									49.98456
								],
								[
									-125.62461,
									50.41656
								],
								[
									-127.43561,
									50.83061
								],
								[
									-127.99276,
									51.71583
								],
								[
									-127.85032,
									52.32961
								],
								[
									-129.12979,
									52.75538
								],
								[
									-129.30523,
									53.56159
								],
								[
									-130.51497,
									54.28757
								],
								[
									-130.53611,
									54.80278
								],
								[
									-129.98,
									55.285
								],
								[
									-130.00778,
									55.91583
								],
								[
									-131.70781,
									56.55212
								],
								[
									-132.73042,
									57.69289
								],
								[
									-133.35556,
									58.41028
								],
								[
									-134.27111,
									58.86111
								],
								[
									-134.945,
									59.27056
								],
								[
									-135.47583,
									59.78778
								],
								[
									-136.47972,
									59.46389
								],
								[
									-137.4525,
									58.905
								],
								[
									-138.34089,
									59.56211
								],
								[
									-139.039,
									60
								],
								[
									-140.013,
									60.27682
								],
								[
									-140.99778,
									60.30639
								],
								[
									-140.9925,
									66.00003
								],
								[
									-140.986,
									69.712
								],
								[
									-139.12052,
									69.47102
								],
								[
									-137.54636,
									68.99002
								],
								[
									-136.50358,
									68.89804
								],
								[
									-135.62576,
									69.31512
								],
								[
									-134.41464,
									69.62743
								],
								[
									-132.92925,
									69.50534
								],
								[
									-131.43136,
									69.94451
								],
								[
									-129.79471,
									70.19369
								],
								[
									-129.10773,
									69.77927
								],
								[
									-128.36156,
									70.01286
								],
								[
									-128.13817,
									70.48384
								],
								[
									-127.44712,
									70.37721
								],
								[
									-125.75632,
									69.48058
								],
								[
									-124.42483,
									70.1584
								],
								[
									-124.28968,
									69.39969
								],
								[
									-123.06108,
									69.56372
								],
								[
									-122.6835,
									69.85553
								],
								[
									-121.47226,
									69.79778
								],
								[
									-119.94288,
									69.37786
								],
								[
									-117.60268,
									69.01128
								],
								[
									-116.22643,
									68.84151
								],
								[
									-115.2469,
									68.90591
								],
								[
									-113.89794,
									68.3989
								],
								[
									-115.30489,
									67.90261
								],
								[
									-113.49727,
									67.68815
								],
								[
									-110.798,
									67.80612
								],
								[
									-109.94619,
									67.98104
								],
								[
									-108.8802,
									67.38144
								],
								[
									-107.79239,
									67.88736
								],
								[
									-108.81299,
									68.31164
								],
								[
									-108.16721,
									68.65392
								],
								[
									-106.95,
									68.7
								],
								[
									-106.15,
									68.8
								],
								[
									-105.34282,
									68.56122
								],
								[
									-104.33791,
									68.018
								],
								[
									-103.22115,
									68.09775
								],
								[
									-101.45433,
									67.64689
								],
								[
									-99.90195,
									67.80566
								],
								[
									-98.4432,
									67.78165
								],
								[
									-98.5586,
									68.40394
								],
								[
									-97.66948,
									68.57864
								],
								[
									-96.11991,
									68.23939
								],
								[
									-96.12588,
									67.29338
								],
								[
									-95.48943,
									68.0907
								],
								[
									-94.685,
									68.06383
								],
								[
									-94.23282,
									69.06903
								],
								[
									-95.30408,
									69.68571
								],
								[
									-96.47131,
									70.08976
								],
								[
									-96.39115,
									71.19482
								],
								[
									-95.2088,
									71.92053
								],
								[
									-93.88997,
									71.76015
								],
								[
									-92.87818,
									71.31869
								],
								[
									-91.51964,
									70.19129
								],
								[
									-92.40692,
									69.69997
								],
								[
									-90.5471,
									69.49766
								]
							]
						],
						[
							[
								[
									-114.16717,
									73.12145
								],
								[
									-114.66634,
									72.65277
								],
								[
									-112.44102,
									72.9554
								],
								[
									-111.05039,
									72.4504
								],
								[
									-109.92035,
									72.96113
								],
								[
									-109.00654,
									72.63335
								],
								[
									-108.18835,
									71.65089
								],
								[
									-107.68599,
									72.06548
								],
								[
									-108.39639,
									73.08953
								],
								[
									-107.51645,
									73.23598
								],
								[
									-106.52259,
									73.07601
								],
								[
									-105.40246,
									72.67259
								],
								[
									-104.77484,
									71.6984
								],
								[
									-104.46476,
									70.99297
								],
								[
									-102.78537,
									70.49776
								],
								[
									-100.98078,
									70.02432
								],
								[
									-101.08929,
									69.58447
								],
								[
									-102.73116,
									69.50402
								],
								[
									-102.09329,
									69.11962
								],
								[
									-102.43024,
									68.75282
								],
								[
									-104.24,
									68.91
								],
								[
									-105.96,
									69.18
								],
								[
									-107.12254,
									69.11922
								],
								[
									-109,
									68.78
								],
								[
									-111.534149,
									68.630059
								],
								[
									-113.3132,
									68.53554
								],
								[
									-113.85496,
									69.00744
								],
								[
									-115.22,
									69.28
								],
								[
									-116.10794,
									69.16821
								],
								[
									-117.34,
									69.96
								],
								[
									-116.67473,
									70.06655
								],
								[
									-115.13112,
									70.2373
								],
								[
									-113.72141,
									70.19237
								],
								[
									-112.4161,
									70.36638
								],
								[
									-114.35,
									70.6
								],
								[
									-116.48684,
									70.52045
								],
								[
									-117.9048,
									70.54056
								],
								[
									-118.43238,
									70.9092
								],
								[
									-116.11311,
									71.30918
								],
								[
									-117.65568,
									71.2952
								],
								[
									-119.40199,
									71.55859
								],
								[
									-118.56267,
									72.30785
								],
								[
									-117.86642,
									72.70594
								],
								[
									-115.18909,
									73.31459
								],
								[
									-114.16717,
									73.12145
								]
							]
						],
						[
							[
								[
									-104.5,
									73.42
								],
								[
									-105.38,
									72.76
								],
								[
									-106.94,
									73.46
								],
								[
									-106.6,
									73.6
								],
								[
									-105.26,
									73.64
								],
								[
									-104.5,
									73.42
								]
							]
						],
						[
							[
								[
									-76.34,
									73.102685
								],
								[
									-76.251404,
									72.826385
								],
								[
									-77.314438,
									72.855545
								],
								[
									-78.39167,
									72.876656
								],
								[
									-79.486252,
									72.742203
								],
								[
									-79.775833,
									72.802902
								],
								[
									-80.876099,
									73.333183
								],
								[
									-80.833885,
									73.693184
								],
								[
									-80.353058,
									73.75972
								],
								[
									-78.064438,
									73.651932
								],
								[
									-76.34,
									73.102685
								]
							]
						],
						[
							[
								[
									-86.562179,
									73.157447
								],
								[
									-85.774371,
									72.534126
								],
								[
									-84.850112,
									73.340278
								],
								[
									-82.31559,
									73.750951
								],
								[
									-80.600088,
									72.716544
								],
								[
									-80.748942,
									72.061907
								],
								[
									-78.770639,
									72.352173
								],
								[
									-77.824624,
									72.749617
								],
								[
									-75.605845,
									72.243678
								],
								[
									-74.228616,
									71.767144
								],
								[
									-74.099141,
									71.33084
								],
								[
									-72.242226,
									71.556925
								],
								[
									-71.200015,
									70.920013
								],
								[
									-68.786054,
									70.525024
								],
								[
									-67.91497,
									70.121948
								],
								[
									-66.969033,
									69.186087
								],
								[
									-68.805123,
									68.720198
								],
								[
									-66.449866,
									68.067163
								],
								[
									-64.862314,
									67.847539
								],
								[
									-63.424934,
									66.928473
								],
								[
									-61.851981,
									66.862121
								],
								[
									-62.163177,
									66.160251
								],
								[
									-63.918444,
									64.998669
								],
								[
									-65.14886,
									65.426033
								],
								[
									-66.721219,
									66.388041
								],
								[
									-68.015016,
									66.262726
								],
								[
									-68.141287,
									65.689789
								],
								[
									-67.089646,
									65.108455
								],
								[
									-65.73208,
									64.648406
								],
								[
									-65.320168,
									64.382737
								],
								[
									-64.669406,
									63.392927
								],
								[
									-65.013804,
									62.674185
								],
								[
									-66.275045,
									62.945099
								],
								[
									-68.783186,
									63.74567
								],
								[
									-67.369681,
									62.883966
								],
								[
									-66.328297,
									62.280075
								],
								[
									-66.165568,
									61.930897
								],
								[
									-68.877367,
									62.330149
								],
								[
									-71.023437,
									62.910708
								],
								[
									-72.235379,
									63.397836
								],
								[
									-71.886278,
									63.679989
								],
								[
									-73.378306,
									64.193963
								],
								[
									-74.834419,
									64.679076
								],
								[
									-74.818503,
									64.389093
								],
								[
									-77.70998,
									64.229542
								],
								[
									-78.555949,
									64.572906
								],
								[
									-77.897281,
									65.309192
								],
								[
									-76.018274,
									65.326969
								],
								[
									-73.959795,
									65.454765
								],
								[
									-74.293883,
									65.811771
								],
								[
									-73.944912,
									66.310578
								],
								[
									-72.651167,
									67.284576
								],
								[
									-72.92606,
									67.726926
								],
								[
									-73.311618,
									68.069437
								],
								[
									-74.843307,
									68.554627
								],
								[
									-76.869101,
									68.894736
								],
								[
									-76.228649,
									69.147769
								],
								[
									-77.28737,
									69.76954
								],
								[
									-78.168634,
									69.826488
								],
								[
									-78.957242,
									70.16688
								],
								[
									-79.492455,
									69.871808
								],
								[
									-81.305471,
									69.743185
								],
								[
									-84.944706,
									69.966634
								],
								[
									-87.060003,
									70.260001
								],
								[
									-88.681713,
									70.410741
								],
								[
									-89.51342,
									70.762038
								],
								[
									-88.467721,
									71.218186
								],
								[
									-89.888151,
									71.222552
								],
								[
									-90.20516,
									72.235074
								],
								[
									-89.436577,
									73.129464
								],
								[
									-88.408242,
									73.537889
								],
								[
									-85.826151,
									73.803816
								],
								[
									-86.562179,
									73.157447
								]
							]
						],
						[
							[
								[
									-100.35642,
									73.84389
								],
								[
									-99.16387,
									73.63339
								],
								[
									-97.38,
									73.76
								],
								[
									-97.12,
									73.47
								],
								[
									-98.05359,
									72.99052
								],
								[
									-96.54,
									72.56
								],
								[
									-96.72,
									71.66
								],
								[
									-98.35966,
									71.27285
								],
								[
									-99.32286,
									71.35639
								],
								[
									-100.01482,
									71.73827
								],
								[
									-102.5,
									72.51
								],
								[
									-102.48,
									72.83
								],
								[
									-100.43836,
									72.70588
								],
								[
									-101.54,
									73.36
								],
								[
									-100.35642,
									73.84389
								]
							]
						],
						[
							[
								[
									-93.196296,
									72.771992
								],
								[
									-94.269047,
									72.024596
								],
								[
									-95.409856,
									72.061881
								],
								[
									-96.033745,
									72.940277
								],
								[
									-96.018268,
									73.43743
								],
								[
									-95.495793,
									73.862417
								],
								[
									-94.503658,
									74.134907
								],
								[
									-92.420012,
									74.100025
								],
								[
									-90.509793,
									73.856732
								],
								[
									-92.003965,
									72.966244
								],
								[
									-93.196296,
									72.771992
								]
							]
						],
						[
							[
								[
									-120.46,
									71.383602
								],
								[
									-123.09219,
									70.90164
								],
								[
									-123.62,
									71.34
								],
								[
									-125.928949,
									71.868688
								],
								[
									-125.5,
									72.292261
								],
								[
									-124.80729,
									73.02256
								],
								[
									-123.94,
									73.68
								],
								[
									-124.91775,
									74.29275
								],
								[
									-121.53788,
									74.44893
								],
								[
									-120.10978,
									74.24135
								],
								[
									-117.55564,
									74.18577
								],
								[
									-116.58442,
									73.89607
								],
								[
									-115.51081,
									73.47519
								],
								[
									-116.76794,
									73.22292
								],
								[
									-119.22,
									72.52
								],
								[
									-120.46,
									71.82
								],
								[
									-120.46,
									71.383602
								]
							]
						],
						[
							[
								[
									-93.612756,
									74.979997
								],
								[
									-94.156909,
									74.592347
								],
								[
									-95.608681,
									74.666864
								],
								[
									-96.820932,
									74.927623
								],
								[
									-96.288587,
									75.377828
								],
								[
									-94.85082,
									75.647218
								],
								[
									-93.977747,
									75.29649
								],
								[
									-93.612756,
									74.979997
								]
							]
						],
						[
							[
								[
									-98.5,
									76.72
								],
								[
									-97.735585,
									76.25656
								],
								[
									-97.704415,
									75.74344
								],
								[
									-98.16,
									75
								],
								[
									-99.80874,
									74.89744
								],
								[
									-100.88366,
									75.05736
								],
								[
									-100.86292,
									75.64075
								],
								[
									-102.50209,
									75.5638
								],
								[
									-102.56552,
									76.3366
								],
								[
									-101.48973,
									76.30537
								],
								[
									-99.98349,
									76.64634
								],
								[
									-98.57699,
									76.58859
								],
								[
									-98.5,
									76.72
								]
							]
						],
						[
							[
								[
									-108.21141,
									76.20168
								],
								[
									-107.81943,
									75.84552
								],
								[
									-106.92893,
									76.01282
								],
								[
									-105.881,
									75.9694
								],
								[
									-105.70498,
									75.47951
								],
								[
									-106.31347,
									75.00527
								],
								[
									-109.7,
									74.85
								],
								[
									-112.22307,
									74.41696
								],
								[
									-113.74381,
									74.39427
								],
								[
									-113.87135,
									74.72029
								],
								[
									-111.79421,
									75.1625
								],
								[
									-116.31221,
									75.04343
								],
								[
									-117.7104,
									75.2222
								],
								[
									-116.34602,
									76.19903
								],
								[
									-115.40487,
									76.47887
								],
								[
									-112.59056,
									76.14134
								],
								[
									-110.81422,
									75.54919
								],
								[
									-109.0671,
									75.47321
								],
								[
									-110.49726,
									76.42982
								],
								[
									-109.5811,
									76.79417
								],
								[
									-108.54859,
									76.67832
								],
								[
									-108.21141,
									76.20168
								]
							]
						],
						[
							[
								[
									-94.684086,
									77.097878
								],
								[
									-93.573921,
									76.776296
								],
								[
									-91.605023,
									76.778518
								],
								[
									-90.741846,
									76.449597
								],
								[
									-90.969661,
									76.074013
								],
								[
									-89.822238,
									75.847774
								],
								[
									-89.187083,
									75.610166
								],
								[
									-87.838276,
									75.566189
								],
								[
									-86.379192,
									75.482421
								],
								[
									-84.789625,
									75.699204
								],
								[
									-82.753445,
									75.784315
								],
								[
									-81.128531,
									75.713983
								],
								[
									-80.057511,
									75.336849
								],
								[
									-79.833933,
									74.923127
								],
								[
									-80.457771,
									74.657304
								],
								[
									-81.948843,
									74.442459
								],
								[
									-83.228894,
									74.564028
								],
								[
									-86.097452,
									74.410032
								],
								[
									-88.15035,
									74.392307
								],
								[
									-89.764722,
									74.515555
								],
								[
									-92.422441,
									74.837758
								],
								[
									-92.768285,
									75.38682
								],
								[
									-92.889906,
									75.882655
								],
								[
									-93.893824,
									76.319244
								],
								[
									-95.962457,
									76.441381
								],
								[
									-97.121379,
									76.751078
								],
								[
									-96.745123,
									77.161389
								],
								[
									-94.684086,
									77.097878
								]
							]
						],
						[
							[
								[
									-116.198587,
									77.645287
								],
								[
									-116.335813,
									76.876962
								],
								[
									-117.106051,
									76.530032
								],
								[
									-118.040412,
									76.481172
								],
								[
									-119.899318,
									76.053213
								],
								[
									-121.499995,
									75.900019
								],
								[
									-122.854924,
									76.116543
								],
								[
									-122.854925,
									76.116543
								],
								[
									-121.157535,
									76.864508
								],
								[
									-119.103939,
									77.51222
								],
								[
									-117.570131,
									77.498319
								],
								[
									-116.198587,
									77.645287
								]
							]
						],
						[
							[
								[
									-93.840003,
									77.519997
								],
								[
									-94.295608,
									77.491343
								],
								[
									-96.169654,
									77.555111
								],
								[
									-96.436304,
									77.834629
								],
								[
									-94.422577,
									77.820005
								],
								[
									-93.720656,
									77.634331
								],
								[
									-93.840003,
									77.519997
								]
							]
						],
						[
							[
								[
									-110.186938,
									77.697015
								],
								[
									-112.051191,
									77.409229
								],
								[
									-113.534279,
									77.732207
								],
								[
									-112.724587,
									78.05105
								],
								[
									-111.264443,
									78.152956
								],
								[
									-109.854452,
									77.996325
								],
								[
									-110.186938,
									77.697015
								]
							]
						],
						[
							[
								[
									-109.663146,
									78.601973
								],
								[
									-110.881314,
									78.40692
								],
								[
									-112.542091,
									78.407902
								],
								[
									-112.525891,
									78.550555
								],
								[
									-111.50001,
									78.849994
								],
								[
									-110.963661,
									78.804441
								],
								[
									-109.663146,
									78.601973
								]
							]
						],
						[
							[
								[
									-95.830295,
									78.056941
								],
								[
									-97.309843,
									77.850597
								],
								[
									-98.124289,
									78.082857
								],
								[
									-98.552868,
									78.458105
								],
								[
									-98.631984,
									78.87193
								],
								[
									-97.337231,
									78.831984
								],
								[
									-96.754399,
									78.765813
								],
								[
									-95.559278,
									78.418315
								],
								[
									-95.830295,
									78.056941
								]
							]
						],
						[
							[
								[
									-100.060192,
									78.324754
								],
								[
									-99.670939,
									77.907545
								],
								[
									-101.30394,
									78.018985
								],
								[
									-102.949809,
									78.343229
								],
								[
									-105.176133,
									78.380332
								],
								[
									-104.210429,
									78.67742
								],
								[
									-105.41958,
									78.918336
								],
								[
									-105.492289,
									79.301594
								],
								[
									-103.529282,
									79.165349
								],
								[
									-100.825158,
									78.800462
								],
								[
									-100.060192,
									78.324754
								]
							]
						],
						[
							[
								[
									-87.02,
									79.66
								],
								[
									-85.81435,
									79.3369
								],
								[
									-87.18756,
									79.0393
								],
								[
									-89.03535,
									78.28723
								],
								[
									-90.80436,
									78.21533
								],
								[
									-92.87669,
									78.34333
								],
								[
									-93.95116,
									78.75099
								],
								[
									-93.93574,
									79.11373
								],
								[
									-93.14524,
									79.3801
								],
								[
									-94.974,
									79.37248
								],
								[
									-96.07614,
									79.70502
								],
								[
									-96.70972,
									80.15777
								],
								[
									-96.01644,
									80.60233
								],
								[
									-95.32345,
									80.90729
								],
								[
									-94.29843,
									80.97727
								],
								[
									-94.73542,
									81.20646
								],
								[
									-92.40984,
									81.25739
								],
								[
									-91.13289,
									80.72345
								],
								[
									-89.45,
									80.509322
								],
								[
									-87.81,
									80.32
								],
								[
									-87.02,
									79.66
								]
							]
						],
						[
							[
								[
									-68.5,
									83.106322
								],
								[
									-65.82735,
									83.02801
								],
								[
									-63.68,
									82.9
								],
								[
									-61.85,
									82.6286
								],
								[
									-61.89388,
									82.36165
								],
								[
									-64.334,
									81.92775
								],
								[
									-66.75342,
									81.72527
								],
								[
									-67.65755,
									81.50141
								],
								[
									-65.48031,
									81.50657
								],
								[
									-67.84,
									80.9
								],
								[
									-69.4697,
									80.61683
								],
								[
									-71.18,
									79.8
								],
								[
									-73.2428,
									79.63415
								],
								[
									-73.88,
									79.430162
								],
								[
									-76.90773,
									79.32309
								],
								[
									-75.52924,
									79.19766
								],
								[
									-76.22046,
									79.01907
								],
								[
									-75.39345,
									78.52581
								],
								[
									-76.34354,
									78.18296
								],
								[
									-77.88851,
									77.89991
								],
								[
									-78.36269,
									77.50859
								],
								[
									-79.75951,
									77.20968
								],
								[
									-79.61965,
									76.98336
								],
								[
									-77.91089,
									77.022045
								],
								[
									-77.88911,
									76.777955
								],
								[
									-80.56125,
									76.17812
								],
								[
									-83.17439,
									76.45403
								],
								[
									-86.11184,
									76.29901
								],
								[
									-87.6,
									76.42
								],
								[
									-89.49068,
									76.47239
								],
								[
									-89.6161,
									76.95213
								],
								[
									-87.76739,
									77.17833
								],
								[
									-88.26,
									77.9
								],
								[
									-87.65,
									77.970222
								],
								[
									-84.97634,
									77.53873
								],
								[
									-86.34,
									78.18
								],
								[
									-87.96192,
									78.37181
								],
								[
									-87.15198,
									78.75867
								],
								[
									-85.37868,
									78.9969
								],
								[
									-85.09495,
									79.34543
								],
								[
									-86.50734,
									79.73624
								],
								[
									-86.93179,
									80.25145
								],
								[
									-84.19844,
									80.20836
								],
								[
									-83.408696,
									80.1
								],
								[
									-81.84823,
									80.46442
								],
								[
									-84.1,
									80.58
								],
								[
									-87.59895,
									80.51627
								],
								[
									-89.36663,
									80.85569
								],
								[
									-90.2,
									81.26
								],
								[
									-91.36786,
									81.5531
								],
								[
									-91.58702,
									81.89429
								],
								[
									-90.1,
									82.085
								],
								[
									-88.93227,
									82.11751
								],
								[
									-86.97024,
									82.27961
								],
								[
									-85.5,
									82.652273
								],
								[
									-84.260005,
									82.6
								],
								[
									-83.18,
									82.32
								],
								[
									-82.42,
									82.86
								],
								[
									-81.1,
									83.02
								],
								[
									-79.30664,
									83.13056
								],
								[
									-76.25,
									83.172059
								],
								[
									-75.71878,
									83.06404
								],
								[
									-72.83153,
									83.23324
								],
								[
									-70.665765,
									83.169781
								],
								[
									-68.5,
									83.106322
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CHE",
				"properties": {
					"name": "Switzerland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								9.594226,
								47.525058
							],
							[
								9.632932,
								47.347601
							],
							[
								9.47997,
								47.10281
							],
							[
								9.932448,
								46.920728
							],
							[
								10.442701,
								46.893546
							],
							[
								10.363378,
								46.483571
							],
							[
								9.922837,
								46.314899
							],
							[
								9.182882,
								46.440215
							],
							[
								8.966306,
								46.036932
							],
							[
								8.489952,
								46.005151
							],
							[
								8.31663,
								46.163642
							],
							[
								7.755992,
								45.82449
							],
							[
								7.273851,
								45.776948
							],
							[
								6.843593,
								45.991147
							],
							[
								6.5001,
								46.429673
							],
							[
								6.022609,
								46.27299
							],
							[
								6.037389,
								46.725779
							],
							[
								6.768714,
								47.287708
							],
							[
								6.736571,
								47.541801
							],
							[
								7.192202,
								47.449766
							],
							[
								7.466759,
								47.620582
							],
							[
								8.317301,
								47.61358
							],
							[
								8.522612,
								47.830828
							],
							[
								9.594226,
								47.525058
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CHL",
				"properties": {
					"name": "Chile"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-68.63401,
									-52.63637
								],
								[
									-68.63335,
									-54.8695
								],
								[
									-67.56244,
									-54.87001
								],
								[
									-66.95992,
									-54.89681
								],
								[
									-67.29103,
									-55.30124
								],
								[
									-68.14863,
									-55.61183
								],
								[
									-68.639991,
									-55.580018
								],
								[
									-69.2321,
									-55.49906
								],
								[
									-69.95809,
									-55.19843
								],
								[
									-71.00568,
									-55.05383
								],
								[
									-72.2639,
									-54.49514
								],
								[
									-73.2852,
									-53.95752
								],
								[
									-74.66253,
									-52.83749
								],
								[
									-73.8381,
									-53.04743
								],
								[
									-72.43418,
									-53.7154
								],
								[
									-71.10773,
									-54.07433
								],
								[
									-70.59178,
									-53.61583
								],
								[
									-70.26748,
									-52.93123
								],
								[
									-69.34565,
									-52.5183
								],
								[
									-68.63401,
									-52.63637
								]
							]
						],
						[
							[
								[
									-68.219913,
									-21.494347
								],
								[
									-67.82818,
									-22.872919
								],
								[
									-67.106674,
									-22.735925
								],
								[
									-66.985234,
									-22.986349
								],
								[
									-67.328443,
									-24.025303
								],
								[
									-68.417653,
									-24.518555
								],
								[
									-68.386001,
									-26.185016
								],
								[
									-68.5948,
									-26.506909
								],
								[
									-68.295542,
									-26.89934
								],
								[
									-69.001235,
									-27.521214
								],
								[
									-69.65613,
									-28.459141
								],
								[
									-70.01355,
									-29.367923
								],
								[
									-69.919008,
									-30.336339
								],
								[
									-70.535069,
									-31.36501
								],
								[
									-70.074399,
									-33.09121
								],
								[
									-69.814777,
									-33.273886
								],
								[
									-69.817309,
									-34.193571
								],
								[
									-70.388049,
									-35.169688
								],
								[
									-70.364769,
									-36.005089
								],
								[
									-71.121881,
									-36.658124
								],
								[
									-71.118625,
									-37.576827
								],
								[
									-70.814664,
									-38.552995
								],
								[
									-71.413517,
									-38.916022
								],
								[
									-71.680761,
									-39.808164
								],
								[
									-71.915734,
									-40.832339
								],
								[
									-71.746804,
									-42.051386
								],
								[
									-72.148898,
									-42.254888
								],
								[
									-71.915424,
									-43.408565
								],
								[
									-71.464056,
									-43.787611
								],
								[
									-71.793623,
									-44.207172
								],
								[
									-71.329801,
									-44.407522
								],
								[
									-71.222779,
									-44.784243
								],
								[
									-71.659316,
									-44.973689
								],
								[
									-71.552009,
									-45.560733
								],
								[
									-71.917258,
									-46.884838
								],
								[
									-72.447355,
									-47.738533
								],
								[
									-72.331161,
									-48.244238
								],
								[
									-72.648247,
									-48.878618
								],
								[
									-73.415436,
									-49.318436
								],
								[
									-73.328051,
									-50.378785
								],
								[
									-72.975747,
									-50.74145
								],
								[
									-72.309974,
									-50.67701
								],
								[
									-72.329404,
									-51.425956
								],
								[
									-71.914804,
									-52.009022
								],
								[
									-69.498362,
									-52.142761
								],
								[
									-68.571545,
									-52.299444
								],
								[
									-69.461284,
									-52.291951
								],
								[
									-69.94278,
									-52.537931
								],
								[
									-70.845102,
									-52.899201
								],
								[
									-71.006332,
									-53.833252
								],
								[
									-71.429795,
									-53.856455
								],
								[
									-72.557943,
									-53.53141
								],
								[
									-73.702757,
									-52.835069
								],
								[
									-73.702757,
									-52.83507
								],
								[
									-74.946763,
									-52.262754
								],
								[
									-75.260026,
									-51.629355
								],
								[
									-74.976632,
									-51.043396
								],
								[
									-75.479754,
									-50.378372
								],
								[
									-75.608015,
									-48.673773
								],
								[
									-75.18277,
									-47.711919
								],
								[
									-74.126581,
									-46.939253
								],
								[
									-75.644395,
									-46.647643
								],
								[
									-74.692154,
									-45.763976
								],
								[
									-74.351709,
									-44.103044
								],
								[
									-73.240356,
									-44.454961
								],
								[
									-72.717804,
									-42.383356
								],
								[
									-73.3889,
									-42.117532
								],
								[
									-73.701336,
									-43.365776
								],
								[
									-74.331943,
									-43.224958
								],
								[
									-74.017957,
									-41.794813
								],
								[
									-73.677099,
									-39.942213
								],
								[
									-73.217593,
									-39.258689
								],
								[
									-73.505559,
									-38.282883
								],
								[
									-73.588061,
									-37.156285
								],
								[
									-73.166717,
									-37.12378
								],
								[
									-72.553137,
									-35.50884
								],
								[
									-71.861732,
									-33.909093
								],
								[
									-71.43845,
									-32.418899
								],
								[
									-71.668721,
									-30.920645
								],
								[
									-71.370083,
									-30.095682
								],
								[
									-71.489894,
									-28.861442
								],
								[
									-70.905124,
									-27.64038
								],
								[
									-70.724954,
									-25.705924
								],
								[
									-70.403966,
									-23.628997
								],
								[
									-70.091246,
									-21.393319
								],
								[
									-70.16442,
									-19.756468
								],
								[
									-70.372572,
									-18.347975
								],
								[
									-69.858444,
									-18.092694
								],
								[
									-69.590424,
									-17.580012
								],
								[
									-69.100247,
									-18.260125
								],
								[
									-68.966818,
									-18.981683
								],
								[
									-68.442225,
									-19.405068
								],
								[
									-68.757167,
									-20.372658
								],
								[
									-68.219913,
									-21.494347
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CHN",
				"properties": {
					"name": "China"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									110.339188,
									18.678395
								],
								[
									109.47521,
									18.197701
								],
								[
									108.655208,
									18.507682
								],
								[
									108.626217,
									19.367888
								],
								[
									109.119056,
									19.821039
								],
								[
									110.211599,
									20.101254
								],
								[
									110.786551,
									20.077534
								],
								[
									111.010051,
									19.69593
								],
								[
									110.570647,
									19.255879
								],
								[
									110.339188,
									18.678395
								]
							]
						],
						[
							[
								[
									127.657407,
									49.76027
								],
								[
									129.397818,
									49.4406
								],
								[
									130.582293,
									48.729687
								],
								[
									130.987282,
									47.790132
								],
								[
									132.506672,
									47.78897
								],
								[
									133.373596,
									48.183442
								],
								[
									135.026311,
									48.47823
								],
								[
									134.500814,
									47.57844
								],
								[
									134.112362,
									47.212467
								],
								[
									133.769644,
									46.116927
								],
								[
									133.097127,
									45.144066
								],
								[
									131.883454,
									45.321162
								],
								[
									131.025212,
									44.967953
								],
								[
									131.288555,
									44.11152
								],
								[
									131.144688,
									42.92999
								],
								[
									130.633866,
									42.903015
								],
								[
									130.640016,
									42.395009
								],
								[
									129.994267,
									42.985387
								],
								[
									129.596669,
									42.424982
								],
								[
									128.052215,
									41.994285
								],
								[
									128.208433,
									41.466772
								],
								[
									127.343783,
									41.503152
								],
								[
									126.869083,
									41.816569
								],
								[
									126.182045,
									41.107336
								],
								[
									125.079942,
									40.569824
								],
								[
									124.265625,
									39.928493
								],
								[
									122.86757,
									39.637788
								],
								[
									122.131388,
									39.170452
								],
								[
									121.054554,
									38.897471
								],
								[
									121.585995,
									39.360854
								],
								[
									121.376757,
									39.750261
								],
								[
									122.168595,
									40.422443
								],
								[
									121.640359,
									40.94639
								],
								[
									120.768629,
									40.593388
								],
								[
									119.639602,
									39.898056
								],
								[
									119.023464,
									39.252333
								],
								[
									118.042749,
									39.204274
								],
								[
									117.532702,
									38.737636
								],
								[
									118.059699,
									38.061476
								],
								[
									118.87815,
									37.897325
								],
								[
									118.911636,
									37.448464
								],
								[
									119.702802,
									37.156389
								],
								[
									120.823457,
									37.870428
								],
								[
									121.711259,
									37.481123
								],
								[
									122.357937,
									37.454484
								],
								[
									122.519995,
									36.930614
								],
								[
									121.104164,
									36.651329
								],
								[
									120.637009,
									36.11144
								],
								[
									119.664562,
									35.609791
								],
								[
									119.151208,
									34.909859
								],
								[
									120.227525,
									34.360332
								],
								[
									120.620369,
									33.376723
								],
								[
									121.229014,
									32.460319
								],
								[
									121.908146,
									31.692174
								],
								[
									121.891919,
									30.949352
								],
								[
									121.264257,
									30.676267
								],
								[
									121.503519,
									30.142915
								],
								[
									122.092114,
									29.83252
								],
								[
									121.938428,
									29.018022
								],
								[
									121.684439,
									28.225513
								],
								[
									121.125661,
									28.135673
								],
								[
									120.395473,
									27.053207
								],
								[
									119.585497,
									25.740781
								],
								[
									118.656871,
									24.547391
								],
								[
									117.281606,
									23.624501
								],
								[
									115.890735,
									22.782873
								],
								[
									114.763827,
									22.668074
								],
								[
									114.152547,
									22.22376
								],
								[
									113.80678,
									22.54834
								],
								[
									113.241078,
									22.051367
								],
								[
									111.843592,
									21.550494
								],
								[
									110.785466,
									21.397144
								],
								[
									110.444039,
									20.341033
								],
								[
									109.889861,
									20.282457
								],
								[
									109.627655,
									21.008227
								],
								[
									109.864488,
									21.395051
								],
								[
									108.522813,
									21.715212
								],
								[
									108.05018,
									21.55238
								],
								[
									107.04342,
									21.811899
								],
								[
									106.567273,
									22.218205
								],
								[
									106.725403,
									22.794268
								],
								[
									105.811247,
									22.976892
								],
								[
									105.329209,
									23.352063
								],
								[
									104.476858,
									22.81915
								],
								[
									103.504515,
									22.703757
								],
								[
									102.706992,
									22.708795
								],
								[
									102.170436,
									22.464753
								],
								[
									101.652018,
									22.318199
								],
								[
									101.80312,
									21.174367
								],
								[
									101.270026,
									21.201652
								],
								[
									101.180005,
									21.436573
								],
								[
									101.150033,
									21.849984
								],
								[
									100.416538,
									21.558839
								],
								[
									99.983489,
									21.742937
								],
								[
									99.240899,
									22.118314
								],
								[
									99.531992,
									22.949039
								],
								[
									98.898749,
									23.142722
								],
								[
									98.660262,
									24.063286
								],
								[
									97.60472,
									23.897405
								],
								[
									97.724609,
									25.083637
								],
								[
									98.671838,
									25.918703
								],
								[
									98.712094,
									26.743536
								],
								[
									98.68269,
									27.508812
								],
								[
									98.246231,
									27.747221
								],
								[
									97.911988,
									28.335945
								],
								[
									97.327114,
									28.261583
								],
								[
									96.248833,
									28.411031
								],
								[
									96.586591,
									28.83098
								],
								[
									96.117679,
									29.452802
								],
								[
									95.404802,
									29.031717
								],
								[
									94.56599,
									29.277438
								],
								[
									93.413348,
									28.640629
								],
								[
									92.503119,
									27.896876
								],
								[
									91.696657,
									27.771742
								],
								[
									91.258854,
									28.040614
								],
								[
									90.730514,
									28.064954
								],
								[
									90.015829,
									28.296439
								],
								[
									89.47581,
									28.042759
								],
								[
									88.814248,
									27.299316
								],
								[
									88.730326,
									28.086865
								],
								[
									88.120441,
									27.876542
								],
								[
									86.954517,
									27.974262
								],
								[
									85.82332,
									28.203576
								],
								[
									85.011638,
									28.642774
								],
								[
									84.23458,
									28.839894
								],
								[
									83.898993,
									29.320226
								],
								[
									83.337115,
									29.463732
								],
								[
									82.327513,
									30.115268
								],
								[
									81.525804,
									30.422717
								],
								[
									81.111256,
									30.183481
								],
								[
									79.721367,
									30.882715
								],
								[
									78.738894,
									31.515906
								],
								[
									78.458446,
									32.618164
								],
								[
									79.176129,
									32.48378
								],
								[
									79.208892,
									32.994395
								],
								[
									78.811086,
									33.506198
								],
								[
									78.912269,
									34.321936
								],
								[
									77.837451,
									35.49401
								],
								[
									76.192848,
									35.898403
								],
								[
									75.896897,
									36.666806
								],
								[
									75.158028,
									37.133031
								],
								[
									74.980002,
									37.41999
								],
								[
									74.829986,
									37.990007
								],
								[
									74.864816,
									38.378846
								],
								[
									74.257514,
									38.606507
								],
								[
									73.928852,
									38.505815
								],
								[
									73.675379,
									39.431237
								],
								[
									73.960013,
									39.660008
								],
								[
									73.822244,
									39.893973
								],
								[
									74.776862,
									40.366425
								],
								[
									75.467828,
									40.562072
								],
								[
									76.526368,
									40.427946
								],
								[
									76.904484,
									41.066486
								],
								[
									78.187197,
									41.185316
								],
								[
									78.543661,
									41.582243
								],
								[
									80.11943,
									42.123941
								],
								[
									80.25999,
									42.349999
								],
								[
									80.18015,
									42.920068
								],
								[
									80.866206,
									43.180362
								],
								[
									79.966106,
									44.917517
								],
								[
									81.947071,
									45.317027
								],
								[
									82.458926,
									45.53965
								],
								[
									83.180484,
									47.330031
								],
								[
									85.16429,
									47.000956
								],
								[
									85.720484,
									47.452969
								],
								[
									85.768233,
									48.455751
								],
								[
									86.598776,
									48.549182
								],
								[
									87.35997,
									49.214981
								],
								[
									87.751264,
									49.297198
								],
								[
									88.013832,
									48.599463
								],
								[
									88.854298,
									48.069082
								],
								[
									90.280826,
									47.693549
								],
								[
									90.970809,
									46.888146
								],
								[
									90.585768,
									45.719716
								],
								[
									90.94554,
									45.286073
								],
								[
									92.133891,
									45.115076
								],
								[
									93.480734,
									44.975472
								],
								[
									94.688929,
									44.352332
								],
								[
									95.306875,
									44.241331
								],
								[
									95.762455,
									43.319449
								],
								[
									96.349396,
									42.725635
								],
								[
									97.451757,
									42.74889
								],
								[
									99.515817,
									42.524691
								],
								[
									100.845866,
									42.663804
								],
								[
									101.83304,
									42.514873
								],
								[
									103.312278,
									41.907468
								],
								[
									104.522282,
									41.908347
								],
								[
									104.964994,
									41.59741
								],
								[
									106.129316,
									42.134328
								],
								[
									107.744773,
									42.481516
								],
								[
									109.243596,
									42.519446
								],
								[
									110.412103,
									42.871234
								],
								[
									111.129682,
									43.406834
								],
								[
									111.829588,
									43.743118
								],
								[
									111.667737,
									44.073176
								],
								[
									111.348377,
									44.457442
								],
								[
									111.873306,
									45.102079
								],
								[
									112.436062,
									45.011646
								],
								[
									113.463907,
									44.808893
								],
								[
									114.460332,
									45.339817
								],
								[
									115.985096,
									45.727235
								],
								[
									116.717868,
									46.388202
								],
								[
									117.421701,
									46.672733
								],
								[
									118.874326,
									46.805412
								],
								[
									119.66327,
									46.69268
								],
								[
									119.772824,
									47.048059
								],
								[
									118.866574,
									47.74706
								],
								[
									118.064143,
									48.06673
								],
								[
									117.295507,
									47.697709
								],
								[
									116.308953,
									47.85341
								],
								[
									115.742837,
									47.726545
								],
								[
									115.485282,
									48.135383
								],
								[
									116.191802,
									49.134598
								],
								[
									116.678801,
									49.888531
								],
								[
									117.879244,
									49.510983
								],
								[
									119.288461,
									50.142883
								],
								[
									119.279366,
									50.582908
								],
								[
									120.18205,
									51.643566
								],
								[
									120.738191,
									51.964115
								],
								[
									120.725789,
									52.516226
								],
								[
									120.177089,
									52.753886
								],
								[
									121.003085,
									53.251401
								],
								[
									122.245748,
									53.431726
								],
								[
									123.571507,
									53.458804
								],
								[
									125.068211,
									53.161045
								],
								[
									125.946349,
									52.792799
								],
								[
									126.564399,
									51.784255
								],
								[
									126.939157,
									51.353894
								],
								[
									127.287456,
									50.739797
								],
								[
									127.657407,
									49.76027
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CIV",
				"properties": {
					"name": "Ivory Coast"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-2.856125,
								4.994476
							],
							[
								-3.311084,
								4.984296
							],
							[
								-4.00882,
								5.179813
							],
							[
								-4.649917,
								5.168264
							],
							[
								-5.834496,
								4.993701
							],
							[
								-6.528769,
								4.705088
							],
							[
								-7.518941,
								4.338288
							],
							[
								-7.712159,
								4.364566
							],
							[
								-7.635368,
								5.188159
							],
							[
								-7.539715,
								5.313345
							],
							[
								-7.570153,
								5.707352
							],
							[
								-7.993693,
								6.12619
							],
							[
								-8.311348,
								6.193033
							],
							[
								-8.60288,
								6.467564
							],
							[
								-8.385452,
								6.911801
							],
							[
								-8.485446,
								7.395208
							],
							[
								-8.439298,
								7.686043
							],
							[
								-8.280703,
								7.68718
							],
							[
								-8.221792,
								8.123329
							],
							[
								-8.299049,
								8.316444
							],
							[
								-8.203499,
								8.455453
							],
							[
								-7.8321,
								8.575704
							],
							[
								-8.079114,
								9.376224
							],
							[
								-8.309616,
								9.789532
							],
							[
								-8.229337,
								10.12902
							],
							[
								-8.029944,
								10.206535
							],
							[
								-7.89959,
								10.297382
							],
							[
								-7.622759,
								10.147236
							],
							[
								-6.850507,
								10.138994
							],
							[
								-6.666461,
								10.430811
							],
							[
								-6.493965,
								10.411303
							],
							[
								-6.205223,
								10.524061
							],
							[
								-6.050452,
								10.096361
							],
							[
								-5.816926,
								10.222555
							],
							[
								-5.404342,
								10.370737
							],
							[
								-4.954653,
								10.152714
							],
							[
								-4.779884,
								9.821985
							],
							[
								-4.330247,
								9.610835
							],
							[
								-3.980449,
								9.862344
							],
							[
								-3.511899,
								9.900326
							],
							[
								-2.827496,
								9.642461
							],
							[
								-2.56219,
								8.219628
							],
							[
								-2.983585,
								7.379705
							],
							[
								-3.24437,
								6.250472
							],
							[
								-2.810701,
								5.389051
							],
							[
								-2.856125,
								4.994476
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CMR",
				"properties": {
					"name": "Cameroon"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								13.075822,
								2.267097
							],
							[
								12.951334,
								2.321616
							],
							[
								12.35938,
								2.192812
							],
							[
								11.751665,
								2.326758
							],
							[
								11.276449,
								2.261051
							],
							[
								9.649158,
								2.283866
							],
							[
								9.795196,
								3.073404
							],
							[
								9.404367,
								3.734527
							],
							[
								8.948116,
								3.904129
							],
							[
								8.744924,
								4.352215
							],
							[
								8.488816,
								4.495617
							],
							[
								8.500288,
								4.771983
							],
							[
								8.757533,
								5.479666
							],
							[
								9.233163,
								6.444491
							],
							[
								9.522706,
								6.453482
							],
							[
								10.118277,
								7.03877
							],
							[
								10.497375,
								7.055358
							],
							[
								11.058788,
								6.644427
							],
							[
								11.745774,
								6.981383
							],
							[
								11.839309,
								7.397042
							],
							[
								12.063946,
								7.799808
							],
							[
								12.218872,
								8.305824
							],
							[
								12.753672,
								8.717763
							],
							[
								12.955468,
								9.417772
							],
							[
								13.1676,
								9.640626
							],
							[
								13.308676,
								10.160362
							],
							[
								13.57295,
								10.798566
							],
							[
								14.415379,
								11.572369
							],
							[
								14.468192,
								11.904752
							],
							[
								14.577178,
								12.085361
							],
							[
								14.181336,
								12.483657
							],
							[
								14.213531,
								12.802035
							],
							[
								14.495787,
								12.859396
							],
							[
								14.893386,
								12.219048
							],
							[
								14.960152,
								11.555574
							],
							[
								14.923565,
								10.891325
							],
							[
								15.467873,
								9.982337
							],
							[
								14.909354,
								9.992129
							],
							[
								14.627201,
								9.920919
							],
							[
								14.171466,
								10.021378
							],
							[
								13.954218,
								9.549495
							],
							[
								14.544467,
								8.965861
							],
							[
								14.979996,
								8.796104
							],
							[
								15.120866,
								8.38215
							],
							[
								15.436092,
								7.692812
							],
							[
								15.27946,
								7.421925
							],
							[
								14.776545,
								6.408498
							],
							[
								14.53656,
								6.226959
							],
							[
								14.459407,
								5.451761
							],
							[
								14.558936,
								5.030598
							],
							[
								14.478372,
								4.732605
							],
							[
								14.950953,
								4.210389
							],
							[
								15.03622,
								3.851367
							],
							[
								15.405396,
								3.335301
							],
							[
								15.862732,
								3.013537
							],
							[
								15.907381,
								2.557389
							],
							[
								16.012852,
								2.26764
							],
							[
								15.940919,
								1.727673
							],
							[
								15.146342,
								1.964015
							],
							[
								14.337813,
								2.227875
							],
							[
								13.075822,
								2.267097
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "COD",
				"properties": {
					"name": "Democratic Republic of the Congo"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								30.83386,
								3.509166
							],
							[
								30.773347,
								2.339883
							],
							[
								31.174149,
								2.204465
							],
							[
								30.85267,
								1.849396
							],
							[
								30.468508,
								1.583805
							],
							[
								30.086154,
								1.062313
							],
							[
								29.875779,
								0.59738
							],
							[
								29.819503,
								-0.20531
							],
							[
								29.587838,
								-0.587406
							],
							[
								29.579466,
								-1.341313
							],
							[
								29.291887,
								-1.620056
							],
							[
								29.254835,
								-2.21511
							],
							[
								29.117479,
								-2.292211
							],
							[
								29.024926,
								-2.839258
							],
							[
								29.276384,
								-3.293907
							],
							[
								29.339998,
								-4.499983
							],
							[
								29.519987,
								-5.419979
							],
							[
								29.419993,
								-5.939999
							],
							[
								29.620032,
								-6.520015
							],
							[
								30.199997,
								-7.079981
							],
							[
								30.740015,
								-8.340007
							],
							[
								30.346086,
								-8.238257
							],
							[
								29.002912,
								-8.407032
							],
							[
								28.734867,
								-8.526559
							],
							[
								28.449871,
								-9.164918
							],
							[
								28.673682,
								-9.605925
							],
							[
								28.49607,
								-10.789884
							],
							[
								28.372253,
								-11.793647
							],
							[
								28.642417,
								-11.971569
							],
							[
								29.341548,
								-12.360744
							],
							[
								29.616001,
								-12.178895
							],
							[
								29.699614,
								-13.257227
							],
							[
								28.934286,
								-13.248958
							],
							[
								28.523562,
								-12.698604
							],
							[
								28.155109,
								-12.272481
							],
							[
								27.388799,
								-12.132747
							],
							[
								27.16442,
								-11.608748
							],
							[
								26.553088,
								-11.92444
							],
							[
								25.75231,
								-11.784965
							],
							[
								25.418118,
								-11.330936
							],
							[
								24.78317,
								-11.238694
							],
							[
								24.314516,
								-11.262826
							],
							[
								24.257155,
								-10.951993
							],
							[
								23.912215,
								-10.926826
							],
							[
								23.456791,
								-10.867863
							],
							[
								22.837345,
								-11.017622
							],
							[
								22.402798,
								-10.993075
							],
							[
								22.155268,
								-11.084801
							],
							[
								22.208753,
								-9.894796
							],
							[
								21.875182,
								-9.523708
							],
							[
								21.801801,
								-8.908707
							],
							[
								21.949131,
								-8.305901
							],
							[
								21.746456,
								-7.920085
							],
							[
								21.728111,
								-7.290872
							],
							[
								20.514748,
								-7.299606
							],
							[
								20.601823,
								-6.939318
							],
							[
								20.091622,
								-6.94309
							],
							[
								20.037723,
								-7.116361
							],
							[
								19.417502,
								-7.155429
							],
							[
								19.166613,
								-7.738184
							],
							[
								19.016752,
								-7.988246
							],
							[
								18.464176,
								-7.847014
							],
							[
								18.134222,
								-7.987678
							],
							[
								17.47297,
								-8.068551
							],
							[
								17.089996,
								-7.545689
							],
							[
								16.860191,
								-7.222298
							],
							[
								16.57318,
								-6.622645
							],
							[
								16.326528,
								-5.87747
							],
							[
								13.375597,
								-5.864241
							],
							[
								13.024869,
								-5.984389
							],
							[
								12.735171,
								-5.965682
							],
							[
								12.322432,
								-6.100092
							],
							[
								12.182337,
								-5.789931
							],
							[
								12.436688,
								-5.684304
							],
							[
								12.468004,
								-5.248362
							],
							[
								12.631612,
								-4.991271
							],
							[
								12.995517,
								-4.781103
							],
							[
								13.25824,
								-4.882957
							],
							[
								13.600235,
								-4.500138
							],
							[
								14.144956,
								-4.510009
							],
							[
								14.209035,
								-4.793092
							],
							[
								14.582604,
								-4.970239
							],
							[
								15.170992,
								-4.343507
							],
							[
								15.75354,
								-3.855165
							],
							[
								16.00629,
								-3.535133
							],
							[
								15.972803,
								-2.712392
							],
							[
								16.407092,
								-1.740927
							],
							[
								16.865307,
								-1.225816
							],
							[
								17.523716,
								-0.74383
							],
							[
								17.638645,
								-0.424832
							],
							[
								17.663553,
								-0.058084
							],
							[
								17.82654,
								0.288923
							],
							[
								17.774192,
								0.855659
							],
							[
								17.898835,
								1.741832
							],
							[
								18.094276,
								2.365722
							],
							[
								18.393792,
								2.900443
							],
							[
								18.453065,
								3.504386
							],
							[
								18.542982,
								4.201785
							],
							[
								18.932312,
								4.709506
							],
							[
								19.467784,
								5.031528
							],
							[
								20.290679,
								4.691678
							],
							[
								20.927591,
								4.322786
							],
							[
								21.659123,
								4.224342
							],
							[
								22.405124,
								4.02916
							],
							[
								22.704124,
								4.633051
							],
							[
								22.84148,
								4.710126
							],
							[
								23.297214,
								4.609693
							],
							[
								24.410531,
								5.108784
							],
							[
								24.805029,
								4.897247
							],
							[
								25.128833,
								4.927245
							],
							[
								25.278798,
								5.170408
							],
							[
								25.650455,
								5.256088
							],
							[
								26.402761,
								5.150875
							],
							[
								27.044065,
								5.127853
							],
							[
								27.374226,
								5.233944
							],
							[
								27.979977,
								4.408413
							],
							[
								28.428994,
								4.287155
							],
							[
								28.696678,
								4.455077
							],
							[
								29.159078,
								4.389267
							],
							[
								29.715995,
								4.600805
							],
							[
								29.9535,
								4.173699
							],
							[
								30.83386,
								3.509166
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "COG",
				"properties": {
					"name": "Republic of the Congo"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								12.995517,
								-4.781103
							],
							[
								12.62076,
								-4.438023
							],
							[
								12.318608,
								-4.60623
							],
							[
								11.914963,
								-5.037987
							],
							[
								11.093773,
								-3.978827
							],
							[
								11.855122,
								-3.426871
							],
							[
								11.478039,
								-2.765619
							],
							[
								11.820964,
								-2.514161
							],
							[
								12.495703,
								-2.391688
							],
							[
								12.575284,
								-1.948511
							],
							[
								13.109619,
								-2.42874
							],
							[
								13.992407,
								-2.470805
							],
							[
								14.29921,
								-1.998276
							],
							[
								14.425456,
								-1.333407
							],
							[
								14.316418,
								-0.552627
							],
							[
								13.843321,
								0.038758
							],
							[
								14.276266,
								1.19693
							],
							[
								14.026669,
								1.395677
							],
							[
								13.282631,
								1.314184
							],
							[
								13.003114,
								1.830896
							],
							[
								13.075822,
								2.267097
							],
							[
								14.337813,
								2.227875
							],
							[
								15.146342,
								1.964015
							],
							[
								15.940919,
								1.727673
							],
							[
								16.012852,
								2.26764
							],
							[
								16.537058,
								3.198255
							],
							[
								17.133042,
								3.728197
							],
							[
								17.8099,
								3.560196
							],
							[
								18.453065,
								3.504386
							],
							[
								18.393792,
								2.900443
							],
							[
								18.094276,
								2.365722
							],
							[
								17.898835,
								1.741832
							],
							[
								17.774192,
								0.855659
							],
							[
								17.82654,
								0.288923
							],
							[
								17.663553,
								-0.058084
							],
							[
								17.638645,
								-0.424832
							],
							[
								17.523716,
								-0.74383
							],
							[
								16.865307,
								-1.225816
							],
							[
								16.407092,
								-1.740927
							],
							[
								15.972803,
								-2.712392
							],
							[
								16.00629,
								-3.535133
							],
							[
								15.75354,
								-3.855165
							],
							[
								15.170992,
								-4.343507
							],
							[
								14.582604,
								-4.970239
							],
							[
								14.209035,
								-4.793092
							],
							[
								14.144956,
								-4.510009
							],
							[
								13.600235,
								-4.500138
							],
							[
								13.25824,
								-4.882957
							],
							[
								12.995517,
								-4.781103
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "COL",
				"properties": {
					"name": "Colombia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-75.373223,
								-0.152032
							],
							[
								-75.801466,
								0.084801
							],
							[
								-76.292314,
								0.416047
							],
							[
								-76.57638,
								0.256936
							],
							[
								-77.424984,
								0.395687
							],
							[
								-77.668613,
								0.825893
							],
							[
								-77.855061,
								0.809925
							],
							[
								-78.855259,
								1.380924
							],
							[
								-78.990935,
								1.69137
							],
							[
								-78.617831,
								1.766404
							],
							[
								-78.662118,
								2.267355
							],
							[
								-78.42761,
								2.629556
							],
							[
								-77.931543,
								2.696606
							],
							[
								-77.510431,
								3.325017
							],
							[
								-77.12769,
								3.849636
							],
							[
								-77.496272,
								4.087606
							],
							[
								-77.307601,
								4.667984
							],
							[
								-77.533221,
								5.582812
							],
							[
								-77.318815,
								5.845354
							],
							[
								-77.476661,
								6.691116
							],
							[
								-77.881571,
								7.223771
							],
							[
								-77.753414,
								7.70984
							],
							[
								-77.431108,
								7.638061
							],
							[
								-77.242566,
								7.935278
							],
							[
								-77.474723,
								8.524286
							],
							[
								-77.353361,
								8.670505
							],
							[
								-76.836674,
								8.638749
							],
							[
								-76.086384,
								9.336821
							],
							[
								-75.6746,
								9.443248
							],
							[
								-75.664704,
								9.774003
							],
							[
								-75.480426,
								10.61899
							],
							[
								-74.906895,
								11.083045
							],
							[
								-74.276753,
								11.102036
							],
							[
								-74.197223,
								11.310473
							],
							[
								-73.414764,
								11.227015
							],
							[
								-72.627835,
								11.731972
							],
							[
								-72.238195,
								11.95555
							],
							[
								-71.75409,
								12.437303
							],
							[
								-71.399822,
								12.376041
							],
							[
								-71.137461,
								12.112982
							],
							[
								-71.331584,
								11.776284
							],
							[
								-71.973922,
								11.608672
							],
							[
								-72.227575,
								11.108702
							],
							[
								-72.614658,
								10.821975
							],
							[
								-72.905286,
								10.450344
							],
							[
								-73.027604,
								9.73677
							],
							[
								-73.304952,
								9.152
							],
							[
								-72.78873,
								9.085027
							],
							[
								-72.660495,
								8.625288
							],
							[
								-72.439862,
								8.405275
							],
							[
								-72.360901,
								8.002638
							],
							[
								-72.479679,
								7.632506
							],
							[
								-72.444487,
								7.423785
							],
							[
								-72.198352,
								7.340431
							],
							[
								-71.960176,
								6.991615
							],
							[
								-70.674234,
								7.087785
							],
							[
								-70.093313,
								6.960376
							],
							[
								-69.38948,
								6.099861
							],
							[
								-68.985319,
								6.206805
							],
							[
								-68.265052,
								6.153268
							],
							[
								-67.695087,
								6.267318
							],
							[
								-67.34144,
								6.095468
							],
							[
								-67.521532,
								5.55687
							],
							[
								-67.744697,
								5.221129
							],
							[
								-67.823012,
								4.503937
							],
							[
								-67.621836,
								3.839482
							],
							[
								-67.337564,
								3.542342
							],
							[
								-67.303173,
								3.318454
							],
							[
								-67.809938,
								2.820655
							],
							[
								-67.447092,
								2.600281
							],
							[
								-67.181294,
								2.250638
							],
							[
								-66.876326,
								1.253361
							],
							[
								-67.065048,
								1.130112
							],
							[
								-67.259998,
								1.719999
							],
							[
								-67.53781,
								2.037163
							],
							[
								-67.868565,
								1.692455
							],
							[
								-69.816973,
								1.714805
							],
							[
								-69.804597,
								1.089081
							],
							[
								-69.218638,
								0.985677
							],
							[
								-69.252434,
								0.602651
							],
							[
								-69.452396,
								0.706159
							],
							[
								-70.015566,
								0.541414
							],
							[
								-70.020656,
								-0.185156
							],
							[
								-69.577065,
								-0.549992
							],
							[
								-69.420486,
								-1.122619
							],
							[
								-69.444102,
								-1.556287
							],
							[
								-69.893635,
								-4.298187
							],
							[
								-70.394044,
								-3.766591
							],
							[
								-70.692682,
								-3.742872
							],
							[
								-70.047709,
								-2.725156
							],
							[
								-70.813476,
								-2.256865
							],
							[
								-71.413646,
								-2.342802
							],
							[
								-71.774761,
								-2.16979
							],
							[
								-72.325787,
								-2.434218
							],
							[
								-73.070392,
								-2.308954
							],
							[
								-73.659504,
								-1.260491
							],
							[
								-74.122395,
								-1.002833
							],
							[
								-74.441601,
								-0.53082
							],
							[
								-75.106625,
								-0.057205
							],
							[
								-75.373223,
								-0.152032
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CRI",
				"properties": {
					"name": "Costa Rica"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-82.965783,
								8.225028
							],
							[
								-83.508437,
								8.446927
							],
							[
								-83.711474,
								8.656836
							],
							[
								-83.596313,
								8.830443
							],
							[
								-83.632642,
								9.051386
							],
							[
								-83.909886,
								9.290803
							],
							[
								-84.303402,
								9.487354
							],
							[
								-84.647644,
								9.615537
							],
							[
								-84.713351,
								9.908052
							],
							[
								-84.97566,
								10.086723
							],
							[
								-84.911375,
								9.795992
							],
							[
								-85.110923,
								9.55704
							],
							[
								-85.339488,
								9.834542
							],
							[
								-85.660787,
								9.933347
							],
							[
								-85.797445,
								10.134886
							],
							[
								-85.791709,
								10.439337
							],
							[
								-85.659314,
								10.754331
							],
							[
								-85.941725,
								10.895278
							],
							[
								-85.71254,
								11.088445
							],
							[
								-85.561852,
								11.217119
							],
							[
								-84.903003,
								10.952303
							],
							[
								-84.673069,
								11.082657
							],
							[
								-84.355931,
								10.999226
							],
							[
								-84.190179,
								10.79345
							],
							[
								-83.895054,
								10.726839
							],
							[
								-83.655612,
								10.938764
							],
							[
								-83.40232,
								10.395438
							],
							[
								-83.015677,
								9.992982
							],
							[
								-82.546196,
								9.566135
							],
							[
								-82.932891,
								9.476812
							],
							[
								-82.927155,
								9.07433
							],
							[
								-82.719183,
								8.925709
							],
							[
								-82.868657,
								8.807266
							],
							[
								-82.829771,
								8.626295
							],
							[
								-82.913176,
								8.423517
							],
							[
								-82.965783,
								8.225028
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CUB",
				"properties": {
					"name": "Cuba"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-82.268151,
								23.188611
							],
							[
								-81.404457,
								23.117271
							],
							[
								-80.618769,
								23.10598
							],
							[
								-79.679524,
								22.765303
							],
							[
								-79.281486,
								22.399202
							],
							[
								-78.347434,
								22.512166
							],
							[
								-77.993296,
								22.277194
							],
							[
								-77.146422,
								21.657851
							],
							[
								-76.523825,
								21.20682
							],
							[
								-76.19462,
								21.220565
							],
							[
								-75.598222,
								21.016624
							],
							[
								-75.67106,
								20.735091
							],
							[
								-74.933896,
								20.693905
							],
							[
								-74.178025,
								20.284628
							],
							[
								-74.296648,
								20.050379
							],
							[
								-74.961595,
								19.923435
							],
							[
								-75.63468,
								19.873774
							],
							[
								-76.323656,
								19.952891
							],
							[
								-77.755481,
								19.855481
							],
							[
								-77.085108,
								20.413354
							],
							[
								-77.492655,
								20.673105
							],
							[
								-78.137292,
								20.739949
							],
							[
								-78.482827,
								21.028613
							],
							[
								-78.719867,
								21.598114
							],
							[
								-79.285,
								21.559175
							],
							[
								-80.217475,
								21.827324
							],
							[
								-80.517535,
								22.037079
							],
							[
								-81.820943,
								22.192057
							],
							[
								-82.169992,
								22.387109
							],
							[
								-81.795002,
								22.636965
							],
							[
								-82.775898,
								22.68815
							],
							[
								-83.494459,
								22.168518
							],
							[
								-83.9088,
								22.154565
							],
							[
								-84.052151,
								21.910575
							],
							[
								-84.54703,
								21.801228
							],
							[
								-84.974911,
								21.896028
							],
							[
								-84.447062,
								22.20495
							],
							[
								-84.230357,
								22.565755
							],
							[
								-83.77824,
								22.788118
							],
							[
								-83.267548,
								22.983042
							],
							[
								-82.510436,
								23.078747
							],
							[
								-82.268151,
								23.188611
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "-99",
				"properties": {
					"name": "Northern Cyprus"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								32.73178,
								35.140026
							],
							[
								32.802474,
								35.145504
							],
							[
								32.946961,
								35.386703
							],
							[
								33.667227,
								35.373216
							],
							[
								34.576474,
								35.671596
							],
							[
								33.900804,
								35.245756
							],
							[
								33.973617,
								35.058506
							],
							[
								33.86644,
								35.093595
							],
							[
								33.675392,
								35.017863
							],
							[
								33.525685,
								35.038688
							],
							[
								33.475817,
								35.000345
							],
							[
								33.455922,
								35.101424
							],
							[
								33.383833,
								35.162712
							],
							[
								33.190977,
								35.173125
							],
							[
								32.919572,
								35.087833
							],
							[
								32.73178,
								35.140026
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CYP",
				"properties": {
					"name": "Cyprus"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								33.973617,
								35.058506
							],
							[
								34.004881,
								34.978098
							],
							[
								32.979827,
								34.571869
							],
							[
								32.490296,
								34.701655
							],
							[
								32.256667,
								35.103232
							],
							[
								32.73178,
								35.140026
							],
							[
								32.919572,
								35.087833
							],
							[
								33.190977,
								35.173125
							],
							[
								33.383833,
								35.162712
							],
							[
								33.455922,
								35.101424
							],
							[
								33.475817,
								35.000345
							],
							[
								33.525685,
								35.038688
							],
							[
								33.675392,
								35.017863
							],
							[
								33.86644,
								35.093595
							],
							[
								33.973617,
								35.058506
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CZE",
				"properties": {
					"name": "Czech Republic"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								16.960288,
								48.596982
							],
							[
								16.499283,
								48.785808
							],
							[
								16.029647,
								48.733899
							],
							[
								15.253416,
								49.039074
							],
							[
								14.901447,
								48.964402
							],
							[
								14.338898,
								48.555305
							],
							[
								13.595946,
								48.877172
							],
							[
								13.031329,
								49.307068
							],
							[
								12.521024,
								49.547415
							],
							[
								12.415191,
								49.969121
							],
							[
								12.240111,
								50.266338
							],
							[
								12.966837,
								50.484076
							],
							[
								13.338132,
								50.733234
							],
							[
								14.056228,
								50.926918
							],
							[
								14.307013,
								51.117268
							],
							[
								14.570718,
								51.002339
							],
							[
								15.016996,
								51.106674
							],
							[
								15.490972,
								50.78473
							],
							[
								16.238627,
								50.697733
							],
							[
								16.176253,
								50.422607
							],
							[
								16.719476,
								50.215747
							],
							[
								16.868769,
								50.473974
							],
							[
								17.554567,
								50.362146
							],
							[
								17.649445,
								50.049038
							],
							[
								18.392914,
								49.988629
							],
							[
								18.853144,
								49.49623
							],
							[
								18.554971,
								49.495015
							],
							[
								18.399994,
								49.315001
							],
							[
								18.170498,
								49.271515
							],
							[
								18.104973,
								49.043983
							],
							[
								17.913512,
								48.996493
							],
							[
								17.886485,
								48.903475
							],
							[
								17.545007,
								48.800019
							],
							[
								17.101985,
								48.816969
							],
							[
								16.960288,
								48.596982
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "DEU",
				"properties": {
					"name": "Germany"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								9.921906,
								54.983104
							],
							[
								9.93958,
								54.596642
							],
							[
								10.950112,
								54.363607
							],
							[
								10.939467,
								54.008693
							],
							[
								11.956252,
								54.196486
							],
							[
								12.51844,
								54.470371
							],
							[
								13.647467,
								54.075511
							],
							[
								14.119686,
								53.757029
							],
							[
								14.353315,
								53.248171
							],
							[
								14.074521,
								52.981263
							],
							[
								14.4376,
								52.62485
							],
							[
								14.685026,
								52.089947
							],
							[
								14.607098,
								51.745188
							],
							[
								15.016996,
								51.106674
							],
							[
								14.570718,
								51.002339
							],
							[
								14.307013,
								51.117268
							],
							[
								14.056228,
								50.926918
							],
							[
								13.338132,
								50.733234
							],
							[
								12.966837,
								50.484076
							],
							[
								12.240111,
								50.266338
							],
							[
								12.415191,
								49.969121
							],
							[
								12.521024,
								49.547415
							],
							[
								13.031329,
								49.307068
							],
							[
								13.595946,
								48.877172
							],
							[
								13.243357,
								48.416115
							],
							[
								12.884103,
								48.289146
							],
							[
								13.025851,
								47.637584
							],
							[
								12.932627,
								47.467646
							],
							[
								12.62076,
								47.672388
							],
							[
								12.141357,
								47.703083
							],
							[
								11.426414,
								47.523766
							],
							[
								10.544504,
								47.566399
							],
							[
								10.402084,
								47.302488
							],
							[
								9.896068,
								47.580197
							],
							[
								9.594226,
								47.525058
							],
							[
								8.522612,
								47.830828
							],
							[
								8.317301,
								47.61358
							],
							[
								7.466759,
								47.620582
							],
							[
								7.593676,
								48.333019
							],
							[
								8.099279,
								49.017784
							],
							[
								6.65823,
								49.201958
							],
							[
								6.18632,
								49.463803
							],
							[
								6.242751,
								49.902226
							],
							[
								6.043073,
								50.128052
							],
							[
								6.156658,
								50.803721
							],
							[
								5.988658,
								51.851616
							],
							[
								6.589397,
								51.852029
							],
							[
								6.84287,
								52.22844
							],
							[
								7.092053,
								53.144043
							],
							[
								6.90514,
								53.482162
							],
							[
								7.100425,
								53.693932
							],
							[
								7.936239,
								53.748296
							],
							[
								8.121706,
								53.527792
							],
							[
								8.800734,
								54.020786
							],
							[
								8.572118,
								54.395646
							],
							[
								8.526229,
								54.962744
							],
							[
								9.282049,
								54.830865
							],
							[
								9.921906,
								54.983104
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "DJI",
				"properties": {
					"name": "Djibouti"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								43.081226,
								12.699639
							],
							[
								43.317852,
								12.390148
							],
							[
								43.286381,
								11.974928
							],
							[
								42.715874,
								11.735641
							],
							[
								43.145305,
								11.46204
							],
							[
								42.776852,
								10.926879
							],
							[
								42.55493,
								11.10511
							],
							[
								42.31414,
								11.0342
							],
							[
								41.75557,
								11.05091
							],
							[
								41.73959,
								11.35511
							],
							[
								41.66176,
								11.6312
							],
							[
								42,
								12.1
							],
							[
								42.35156,
								12.54223
							],
							[
								42.779642,
								12.455416
							],
							[
								43.081226,
								12.699639
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "DNK",
				"properties": {
					"name": "Denmark"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									12.690006,
									55.609991
								],
								[
									12.089991,
									54.800015
								],
								[
									11.043543,
									55.364864
								],
								[
									10.903914,
									55.779955
								],
								[
									12.370904,
									56.111407
								],
								[
									12.690006,
									55.609991
								]
							]
						],
						[
							[
								[
									10.912182,
									56.458621
								],
								[
									10.667804,
									56.081383
								],
								[
									10.369993,
									56.190007
								],
								[
									9.649985,
									55.469999
								],
								[
									9.921906,
									54.983104
								],
								[
									9.282049,
									54.830865
								],
								[
									8.526229,
									54.962744
								],
								[
									8.120311,
									55.517723
								],
								[
									8.089977,
									56.540012
								],
								[
									8.256582,
									56.809969
								],
								[
									8.543438,
									57.110003
								],
								[
									9.424469,
									57.172066
								],
								[
									9.775559,
									57.447941
								],
								[
									10.580006,
									57.730017
								],
								[
									10.546106,
									57.215733
								],
								[
									10.25,
									56.890016
								],
								[
									10.369993,
									56.609982
								],
								[
									10.912182,
									56.458621
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "DOM",
				"properties": {
					"name": "Dominican Republic"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-71.712361,
								19.714456
							],
							[
								-71.587304,
								19.884911
							],
							[
								-70.806706,
								19.880286
							],
							[
								-70.214365,
								19.622885
							],
							[
								-69.950815,
								19.648
							],
							[
								-69.76925,
								19.293267
							],
							[
								-69.222126,
								19.313214
							],
							[
								-69.254346,
								19.015196
							],
							[
								-68.809412,
								18.979074
							],
							[
								-68.317943,
								18.612198
							],
							[
								-68.689316,
								18.205142
							],
							[
								-69.164946,
								18.422648
							],
							[
								-69.623988,
								18.380713
							],
							[
								-69.952934,
								18.428307
							],
							[
								-70.133233,
								18.245915
							],
							[
								-70.517137,
								18.184291
							],
							[
								-70.669298,
								18.426886
							],
							[
								-70.99995,
								18.283329
							],
							[
								-71.40021,
								17.598564
							],
							[
								-71.657662,
								17.757573
							],
							[
								-71.708305,
								18.044997
							],
							[
								-71.687738,
								18.31666
							],
							[
								-71.945112,
								18.6169
							],
							[
								-71.701303,
								18.785417
							],
							[
								-71.624873,
								19.169838
							],
							[
								-71.712361,
								19.714456
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "DZA",
				"properties": {
					"name": "Algeria"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								11.999506,
								23.471668
							],
							[
								8.572893,
								21.565661
							],
							[
								5.677566,
								19.601207
							],
							[
								4.267419,
								19.155265
							],
							[
								3.158133,
								19.057364
							],
							[
								3.146661,
								19.693579
							],
							[
								2.683588,
								19.85623
							],
							[
								2.060991,
								20.142233
							],
							[
								1.823228,
								20.610809
							],
							[
								-1.550055,
								22.792666
							],
							[
								-4.923337,
								24.974574
							],
							[
								-8.6844,
								27.395744
							],
							[
								-8.665124,
								27.589479
							],
							[
								-8.66559,
								27.656426
							],
							[
								-8.674116,
								28.841289
							],
							[
								-7.059228,
								29.579228
							],
							[
								-6.060632,
								29.7317
							],
							[
								-5.242129,
								30.000443
							],
							[
								-4.859646,
								30.501188
							],
							[
								-3.690441,
								30.896952
							],
							[
								-3.647498,
								31.637294
							],
							[
								-3.06898,
								31.724498
							],
							[
								-2.616605,
								32.094346
							],
							[
								-1.307899,
								32.262889
							],
							[
								-1.124551,
								32.651522
							],
							[
								-1.388049,
								32.864015
							],
							[
								-1.733455,
								33.919713
							],
							[
								-1.792986,
								34.527919
							],
							[
								-2.169914,
								35.168396
							],
							[
								-1.208603,
								35.714849
							],
							[
								-0.127454,
								35.888662
							],
							[
								0.503877,
								36.301273
							],
							[
								1.466919,
								36.605647
							],
							[
								3.161699,
								36.783905
							],
							[
								4.815758,
								36.865037
							],
							[
								5.32012,
								36.716519
							],
							[
								6.26182,
								37.110655
							],
							[
								7.330385,
								37.118381
							],
							[
								7.737078,
								36.885708
							],
							[
								8.420964,
								36.946427
							],
							[
								8.217824,
								36.433177
							],
							[
								8.376368,
								35.479876
							],
							[
								8.140981,
								34.655146
							],
							[
								7.524482,
								34.097376
							],
							[
								7.612642,
								33.344115
							],
							[
								8.430473,
								32.748337
							],
							[
								8.439103,
								32.506285
							],
							[
								9.055603,
								32.102692
							],
							[
								9.48214,
								30.307556
							],
							[
								9.805634,
								29.424638
							],
							[
								9.859998,
								28.95999
							],
							[
								9.683885,
								28.144174
							],
							[
								9.756128,
								27.688259
							],
							[
								9.629056,
								27.140953
							],
							[
								9.716286,
								26.512206
							],
							[
								9.319411,
								26.094325
							],
							[
								9.910693,
								25.365455
							],
							[
								9.948261,
								24.936954
							],
							[
								10.303847,
								24.379313
							],
							[
								10.771364,
								24.562532
							],
							[
								11.560669,
								24.097909
							],
							[
								11.999506,
								23.471668
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ECU",
				"properties": {
					"name": "Ecuador"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-80.302561,
								-3.404856
							],
							[
								-79.770293,
								-2.657512
							],
							[
								-79.986559,
								-2.220794
							],
							[
								-80.368784,
								-2.685159
							],
							[
								-80.967765,
								-2.246943
							],
							[
								-80.764806,
								-1.965048
							],
							[
								-80.933659,
								-1.057455
							],
							[
								-80.58337,
								-0.906663
							],
							[
								-80.399325,
								-0.283703
							],
							[
								-80.020898,
								0.36034
							],
							[
								-80.09061,
								0.768429
							],
							[
								-79.542762,
								0.982938
							],
							[
								-78.855259,
								1.380924
							],
							[
								-77.855061,
								0.809925
							],
							[
								-77.668613,
								0.825893
							],
							[
								-77.424984,
								0.395687
							],
							[
								-76.57638,
								0.256936
							],
							[
								-76.292314,
								0.416047
							],
							[
								-75.801466,
								0.084801
							],
							[
								-75.373223,
								-0.152032
							],
							[
								-75.233723,
								-0.911417
							],
							[
								-75.544996,
								-1.56161
							],
							[
								-76.635394,
								-2.608678
							],
							[
								-77.837905,
								-3.003021
							],
							[
								-78.450684,
								-3.873097
							],
							[
								-78.639897,
								-4.547784
							],
							[
								-79.205289,
								-4.959129
							],
							[
								-79.624979,
								-4.454198
							],
							[
								-80.028908,
								-4.346091
							],
							[
								-80.442242,
								-4.425724
							],
							[
								-80.469295,
								-4.059287
							],
							[
								-80.184015,
								-3.821162
							],
							[
								-80.302561,
								-3.404856
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "EGY",
				"properties": {
					"name": "Egypt"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								34.9226,
								29.50133
							],
							[
								34.64174,
								29.09942
							],
							[
								34.42655,
								28.34399
							],
							[
								34.15451,
								27.8233
							],
							[
								33.92136,
								27.6487
							],
							[
								33.58811,
								27.97136
							],
							[
								33.13676,
								28.41765
							],
							[
								32.42323,
								29.85108
							],
							[
								32.32046,
								29.76043
							],
							[
								32.73482,
								28.70523
							],
							[
								33.34876,
								27.69989
							],
							[
								34.10455,
								26.14227
							],
							[
								34.47387,
								25.59856
							],
							[
								34.79507,
								25.03375
							],
							[
								35.69241,
								23.92671
							],
							[
								35.49372,
								23.75237
							],
							[
								35.52598,
								23.10244
							],
							[
								36.69069,
								22.20485
							],
							[
								36.86623,
								22
							],
							[
								32.9,
								22
							],
							[
								29.02,
								22
							],
							[
								25,
								22
							],
							[
								25,
								25.6825
							],
							[
								25,
								29.238655
							],
							[
								24.70007,
								30.04419
							],
							[
								24.95762,
								30.6616
							],
							[
								24.80287,
								31.08929
							],
							[
								25.16482,
								31.56915
							],
							[
								26.49533,
								31.58568
							],
							[
								27.45762,
								31.32126
							],
							[
								28.45048,
								31.02577
							],
							[
								28.91353,
								30.87005
							],
							[
								29.68342,
								31.18686
							],
							[
								30.09503,
								31.4734
							],
							[
								30.97693,
								31.55586
							],
							[
								31.68796,
								31.4296
							],
							[
								31.96041,
								30.9336
							],
							[
								32.19247,
								31.26034
							],
							[
								32.99392,
								31.02407
							],
							[
								33.7734,
								30.96746
							],
							[
								34.26544,
								31.21936
							],
							[
								34.9226,
								29.50133
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ERI",
				"properties": {
					"name": "Eritrea"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								42.35156,
								12.54223
							],
							[
								42.00975,
								12.86582
							],
							[
								41.59856,
								13.45209
							],
							[
								41.155194,
								13.77332
							],
							[
								40.8966,
								14.11864
							],
							[
								40.026219,
								14.519579
							],
							[
								39.34061,
								14.53155
							],
							[
								39.0994,
								14.74064
							],
							[
								38.51295,
								14.50547
							],
							[
								37.90607,
								14.95943
							],
							[
								37.59377,
								14.2131
							],
							[
								36.42951,
								14.42211
							],
							[
								36.323189,
								14.822481
							],
							[
								36.75386,
								16.291874
							],
							[
								36.85253,
								16.95655
							],
							[
								37.16747,
								17.26314
							],
							[
								37.904,
								17.42754
							],
							[
								38.41009,
								17.998307
							],
							[
								38.990623,
								16.840626
							],
							[
								39.26611,
								15.922723
							],
							[
								39.814294,
								15.435647
							],
							[
								41.179275,
								14.49108
							],
							[
								41.734952,
								13.921037
							],
							[
								42.276831,
								13.343992
							],
							[
								42.589576,
								13.000421
							],
							[
								43.081226,
								12.699639
							],
							[
								42.779642,
								12.455416
							],
							[
								42.35156,
								12.54223
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ESP",
				"properties": {
					"name": "Spain"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-9.034818,
								41.880571
							],
							[
								-8.984433,
								42.592775
							],
							[
								-9.392884,
								43.026625
							],
							[
								-7.97819,
								43.748338
							],
							[
								-6.754492,
								43.567909
							],
							[
								-5.411886,
								43.57424
							],
							[
								-4.347843,
								43.403449
							],
							[
								-3.517532,
								43.455901
							],
							[
								-1.901351,
								43.422802
							],
							[
								-1.502771,
								43.034014
							],
							[
								0.338047,
								42.579546
							],
							[
								0.701591,
								42.795734
							],
							[
								1.826793,
								42.343385
							],
							[
								2.985999,
								42.473015
							],
							[
								3.039484,
								41.89212
							],
							[
								2.091842,
								41.226089
							],
							[
								0.810525,
								41.014732
							],
							[
								0.721331,
								40.678318
							],
							[
								0.106692,
								40.123934
							],
							[
								-0.278711,
								39.309978
							],
							[
								0.111291,
								38.738514
							],
							[
								-0.467124,
								38.292366
							],
							[
								-0.683389,
								37.642354
							],
							[
								-1.438382,
								37.443064
							],
							[
								-2.146453,
								36.674144
							],
							[
								-3.415781,
								36.6589
							],
							[
								-4.368901,
								36.677839
							],
							[
								-4.995219,
								36.324708
							],
							[
								-5.37716,
								35.94685
							],
							[
								-5.866432,
								36.029817
							],
							[
								-6.236694,
								36.367677
							],
							[
								-6.520191,
								36.942913
							],
							[
								-7.453726,
								37.097788
							],
							[
								-7.537105,
								37.428904
							],
							[
								-7.166508,
								37.803894
							],
							[
								-7.029281,
								38.075764
							],
							[
								-7.374092,
								38.373059
							],
							[
								-7.098037,
								39.030073
							],
							[
								-7.498632,
								39.629571
							],
							[
								-7.066592,
								39.711892
							],
							[
								-7.026413,
								40.184524
							],
							[
								-6.86402,
								40.330872
							],
							[
								-6.851127,
								41.111083
							],
							[
								-6.389088,
								41.381815
							],
							[
								-6.668606,
								41.883387
							],
							[
								-7.251309,
								41.918346
							],
							[
								-7.422513,
								41.792075
							],
							[
								-8.013175,
								41.790886
							],
							[
								-8.263857,
								42.280469
							],
							[
								-8.671946,
								42.134689
							],
							[
								-9.034818,
								41.880571
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "EST",
				"properties": {
					"name": "Estonia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								24.312863,
								57.793424
							],
							[
								24.428928,
								58.383413
							],
							[
								24.061198,
								58.257375
							],
							[
								23.42656,
								58.612753
							],
							[
								23.339795,
								59.18724
							],
							[
								24.604214,
								59.465854
							],
							[
								25.864189,
								59.61109
							],
							[
								26.949136,
								59.445803
							],
							[
								27.981114,
								59.475388
							],
							[
								28.131699,
								59.300825
							],
							[
								27.420166,
								58.724581
							],
							[
								27.716686,
								57.791899
							],
							[
								27.288185,
								57.474528
							],
							[
								26.463532,
								57.476389
							],
							[
								25.60281,
								57.847529
							],
							[
								25.164594,
								57.970157
							],
							[
								24.312863,
								57.793424
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ETH",
				"properties": {
					"name": "Ethiopia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								37.90607,
								14.95943
							],
							[
								38.51295,
								14.50547
							],
							[
								39.0994,
								14.74064
							],
							[
								39.34061,
								14.53155
							],
							[
								40.02625,
								14.51959
							],
							[
								40.8966,
								14.11864
							],
							[
								41.1552,
								13.77333
							],
							[
								41.59856,
								13.45209
							],
							[
								42.00975,
								12.86582
							],
							[
								42.35156,
								12.54223
							],
							[
								42,
								12.1
							],
							[
								41.66176,
								11.6312
							],
							[
								41.73959,
								11.35511
							],
							[
								41.75557,
								11.05091
							],
							[
								42.31414,
								11.0342
							],
							[
								42.55493,
								11.10511
							],
							[
								42.776852,
								10.926879
							],
							[
								42.55876,
								10.57258
							],
							[
								42.92812,
								10.02194
							],
							[
								43.29699,
								9.54048
							],
							[
								43.67875,
								9.18358
							],
							[
								46.94834,
								7.99688
							],
							[
								47.78942,
								8.003
							],
							[
								44.9636,
								5.00162
							],
							[
								43.66087,
								4.95755
							],
							[
								42.76967,
								4.25259
							],
							[
								42.12861,
								4.23413
							],
							[
								41.855083,
								3.918912
							],
							[
								41.1718,
								3.91909
							],
							[
								40.76848,
								4.25702
							],
							[
								39.85494,
								3.83879
							],
							[
								39.559384,
								3.42206
							],
							[
								38.89251,
								3.50074
							],
							[
								38.67114,
								3.61607
							],
							[
								38.43697,
								3.58851
							],
							[
								38.120915,
								3.598605
							],
							[
								36.855093,
								4.447864
							],
							[
								36.159079,
								4.447864
							],
							[
								35.817448,
								4.776966
							],
							[
								35.817448,
								5.338232
							],
							[
								35.298007,
								5.506
							],
							[
								34.70702,
								6.59422
							],
							[
								34.25032,
								6.82607
							],
							[
								34.0751,
								7.22595
							],
							[
								33.56829,
								7.71334
							],
							[
								32.95418,
								7.78497
							],
							[
								33.2948,
								8.35458
							],
							[
								33.8255,
								8.37916
							],
							[
								33.97498,
								8.68456
							],
							[
								33.96162,
								9.58358
							],
							[
								34.25745,
								10.63009
							],
							[
								34.73115,
								10.91017
							],
							[
								34.83163,
								11.31896
							],
							[
								35.26049,
								12.08286
							],
							[
								35.86363,
								12.57828
							],
							[
								36.27022,
								13.56333
							],
							[
								36.42951,
								14.42211
							],
							[
								37.59377,
								14.2131
							],
							[
								37.90607,
								14.95943
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "FIN",
				"properties": {
					"name": "Finland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								28.59193,
								69.064777
							],
							[
								28.445944,
								68.364613
							],
							[
								29.977426,
								67.698297
							],
							[
								29.054589,
								66.944286
							],
							[
								30.21765,
								65.80598
							],
							[
								29.54443,
								64.948672
							],
							[
								30.444685,
								64.204453
							],
							[
								30.035872,
								63.552814
							],
							[
								31.516092,
								62.867687
							],
							[
								31.139991,
								62.357693
							],
							[
								30.211107,
								61.780028
							],
							[
								28.069998,
								60.503517
							],
							[
								26.255173,
								60.423961
							],
							[
								24.496624,
								60.057316
							],
							[
								22.869695,
								59.846373
							],
							[
								22.290764,
								60.391921
							],
							[
								21.322244,
								60.72017
							],
							[
								21.544866,
								61.705329
							],
							[
								21.059211,
								62.607393
							],
							[
								21.536029,
								63.189735
							],
							[
								22.442744,
								63.81781
							],
							[
								24.730512,
								64.902344
							],
							[
								25.398068,
								65.111427
							],
							[
								25.294043,
								65.534346
							],
							[
								23.903379,
								66.006927
							],
							[
								23.56588,
								66.396051
							],
							[
								23.539473,
								67.936009
							],
							[
								21.978535,
								68.616846
							],
							[
								20.645593,
								69.106247
							],
							[
								21.244936,
								69.370443
							],
							[
								22.356238,
								68.841741
							],
							[
								23.66205,
								68.891247
							],
							[
								24.735679,
								68.649557
							],
							[
								25.689213,
								69.092114
							],
							[
								26.179622,
								69.825299
							],
							[
								27.732292,
								70.164193
							],
							[
								29.015573,
								69.766491
							],
							[
								28.59193,
								69.064777
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "FJI",
				"properties": {
					"name": "Fiji"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									178.3736,
									-17.33992
								],
								[
									178.71806,
									-17.62846
								],
								[
									178.55271,
									-18.15059
								],
								[
									177.93266,
									-18.28799
								],
								[
									177.38146,
									-18.16432
								],
								[
									177.28504,
									-17.72465
								],
								[
									177.67087,
									-17.38114
								],
								[
									178.12557,
									-17.50481
								],
								[
									178.3736,
									-17.33992
								]
							]
						],
						[
							[
								[
									179.364143,
									-16.801354
								],
								[
									178.725059,
									-17.012042
								],
								[
									178.596839,
									-16.63915
								],
								[
									179.096609,
									-16.433984
								],
								[
									179.413509,
									-16.379054
								],
								[
									180,
									-16.067133
								],
								[
									180,
									-16.555217
								],
								[
									179.364143,
									-16.801354
								]
							]
						],
						[
							[
								[
									-179.917369,
									-16.501783
								],
								[
									-180,
									-16.555217
								],
								[
									-180,
									-16.067133
								],
								[
									-179.79332,
									-16.020882
								],
								[
									-179.917369,
									-16.501783
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "FLK",
				"properties": {
					"name": "Falkland Islands"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-61.2,
								-51.85
							],
							[
								-60,
								-51.25
							],
							[
								-59.15,
								-51.5
							],
							[
								-58.55,
								-51.1
							],
							[
								-57.75,
								-51.55
							],
							[
								-58.05,
								-51.9
							],
							[
								-59.4,
								-52.2
							],
							[
								-59.85,
								-51.85
							],
							[
								-60.7,
								-52.3
							],
							[
								-61.2,
								-51.85
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "FRA",
				"properties": {
					"name": "France"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									9.560016,
									42.152492
								],
								[
									9.229752,
									41.380007
								],
								[
									8.775723,
									41.583612
								],
								[
									8.544213,
									42.256517
								],
								[
									8.746009,
									42.628122
								],
								[
									9.390001,
									43.009985
								],
								[
									9.560016,
									42.152492
								]
							]
						],
						[
							[
								[
									3.588184,
									50.378992
								],
								[
									4.286023,
									49.907497
								],
								[
									4.799222,
									49.985373
								],
								[
									5.674052,
									49.529484
								],
								[
									5.897759,
									49.442667
								],
								[
									6.18632,
									49.463803
								],
								[
									6.65823,
									49.201958
								],
								[
									8.099279,
									49.017784
								],
								[
									7.593676,
									48.333019
								],
								[
									7.466759,
									47.620582
								],
								[
									7.192202,
									47.449766
								],
								[
									6.736571,
									47.541801
								],
								[
									6.768714,
									47.287708
								],
								[
									6.037389,
									46.725779
								],
								[
									6.022609,
									46.27299
								],
								[
									6.5001,
									46.429673
								],
								[
									6.843593,
									45.991147
								],
								[
									6.802355,
									45.70858
								],
								[
									7.096652,
									45.333099
								],
								[
									6.749955,
									45.028518
								],
								[
									7.007562,
									44.254767
								],
								[
									7.549596,
									44.127901
								],
								[
									7.435185,
									43.693845
								],
								[
									6.529245,
									43.128892
								],
								[
									4.556963,
									43.399651
								],
								[
									3.100411,
									43.075201
								],
								[
									2.985999,
									42.473015
								],
								[
									1.826793,
									42.343385
								],
								[
									0.701591,
									42.795734
								],
								[
									0.338047,
									42.579546
								],
								[
									-1.502771,
									43.034014
								],
								[
									-1.901351,
									43.422802
								],
								[
									-1.384225,
									44.02261
								],
								[
									-1.193798,
									46.014918
								],
								[
									-2.225724,
									47.064363
								],
								[
									-2.963276,
									47.570327
								],
								[
									-4.491555,
									47.954954
								],
								[
									-4.59235,
									48.68416
								],
								[
									-3.295814,
									48.901692
								],
								[
									-1.616511,
									48.644421
								],
								[
									-1.933494,
									49.776342
								],
								[
									-0.989469,
									49.347376
								],
								[
									1.338761,
									50.127173
								],
								[
									1.639001,
									50.946606
								],
								[
									2.513573,
									51.148506
								],
								[
									2.658422,
									50.796848
								],
								[
									3.123252,
									50.780363
								],
								[
									3.588184,
									50.378992
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GAB",
				"properties": {
					"name": "Gabon"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								11.093773,
								-3.978827
							],
							[
								10.066135,
								-2.969483
							],
							[
								9.405245,
								-2.144313
							],
							[
								8.797996,
								-1.111301
							],
							[
								8.830087,
								-0.779074
							],
							[
								9.04842,
								-0.459351
							],
							[
								9.291351,
								0.268666
							],
							[
								9.492889,
								1.01012
							],
							[
								9.830284,
								1.067894
							],
							[
								11.285079,
								1.057662
							],
							[
								11.276449,
								2.261051
							],
							[
								11.751665,
								2.326758
							],
							[
								12.35938,
								2.192812
							],
							[
								12.951334,
								2.321616
							],
							[
								13.075822,
								2.267097
							],
							[
								13.003114,
								1.830896
							],
							[
								13.282631,
								1.314184
							],
							[
								14.026669,
								1.395677
							],
							[
								14.276266,
								1.19693
							],
							[
								13.843321,
								0.038758
							],
							[
								14.316418,
								-0.552627
							],
							[
								14.425456,
								-1.333407
							],
							[
								14.29921,
								-1.998276
							],
							[
								13.992407,
								-2.470805
							],
							[
								13.109619,
								-2.42874
							],
							[
								12.575284,
								-1.948511
							],
							[
								12.495703,
								-2.391688
							],
							[
								11.820964,
								-2.514161
							],
							[
								11.478039,
								-2.765619
							],
							[
								11.855122,
								-3.426871
							],
							[
								11.093773,
								-3.978827
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GBR",
				"properties": {
					"name": "United Kingdom"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-5.661949,
									54.554603
								],
								[
									-6.197885,
									53.867565
								],
								[
									-6.95373,
									54.073702
								],
								[
									-7.572168,
									54.059956
								],
								[
									-7.366031,
									54.595841
								],
								[
									-7.572168,
									55.131622
								],
								[
									-6.733847,
									55.17286
								],
								[
									-5.661949,
									54.554603
								]
							]
						],
						[
							[
								[
									-3.005005,
									58.635
								],
								[
									-4.073828,
									57.553025
								],
								[
									-3.055002,
									57.690019
								],
								[
									-1.959281,
									57.6848
								],
								[
									-2.219988,
									56.870017
								],
								[
									-3.119003,
									55.973793
								],
								[
									-2.085009,
									55.909998
								],
								[
									-2.005676,
									55.804903
								],
								[
									-1.114991,
									54.624986
								],
								[
									-0.430485,
									54.464376
								],
								[
									0.184981,
									53.325014
								],
								[
									0.469977,
									52.929999
								],
								[
									1.681531,
									52.73952
								],
								[
									1.559988,
									52.099998
								],
								[
									1.050562,
									51.806761
								],
								[
									1.449865,
									51.289428
								],
								[
									0.550334,
									50.765739
								],
								[
									-0.787517,
									50.774989
								],
								[
									-2.489998,
									50.500019
								],
								[
									-2.956274,
									50.69688
								],
								[
									-3.617448,
									50.228356
								],
								[
									-4.542508,
									50.341837
								],
								[
									-5.245023,
									49.96
								],
								[
									-5.776567,
									50.159678
								],
								[
									-4.30999,
									51.210001
								],
								[
									-3.414851,
									51.426009
								],
								[
									-3.422719,
									51.426848
								],
								[
									-4.984367,
									51.593466
								],
								[
									-5.267296,
									51.9914
								],
								[
									-4.222347,
									52.301356
								],
								[
									-4.770013,
									52.840005
								],
								[
									-4.579999,
									53.495004
								],
								[
									-3.093831,
									53.404547
								],
								[
									-3.09208,
									53.404441
								],
								[
									-2.945009,
									53.985
								],
								[
									-3.614701,
									54.600937
								],
								[
									-3.630005,
									54.615013
								],
								[
									-4.844169,
									54.790971
								],
								[
									-5.082527,
									55.061601
								],
								[
									-4.719112,
									55.508473
								],
								[
									-5.047981,
									55.783986
								],
								[
									-5.586398,
									55.311146
								],
								[
									-5.644999,
									56.275015
								],
								[
									-6.149981,
									56.78501
								],
								[
									-5.786825,
									57.818848
								],
								[
									-5.009999,
									58.630013
								],
								[
									-4.211495,
									58.550845
								],
								[
									-3.005005,
									58.635
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GEO",
				"properties": {
					"name": "Georgia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								41.554084,
								41.535656
							],
							[
								41.703171,
								41.962943
							],
							[
								41.45347,
								42.645123
							],
							[
								40.875469,
								43.013628
							],
							[
								40.321394,
								43.128634
							],
							[
								39.955009,
								43.434998
							],
							[
								40.076965,
								43.553104
							],
							[
								40.922185,
								43.382159
							],
							[
								42.394395,
								43.220308
							],
							[
								43.756017,
								42.740828
							],
							[
								43.9312,
								42.554974
							],
							[
								44.537623,
								42.711993
							],
							[
								45.470279,
								42.502781
							],
							[
								45.77641,
								42.092444
							],
							[
								46.404951,
								41.860675
							],
							[
								46.145432,
								41.722802
							],
							[
								46.637908,
								41.181673
							],
							[
								46.501637,
								41.064445
							],
							[
								45.962601,
								41.123873
							],
							[
								45.217426,
								41.411452
							],
							[
								44.97248,
								41.248129
							],
							[
								43.582746,
								41.092143
							],
							[
								42.619549,
								41.583173
							],
							[
								41.554084,
								41.535656
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GHA",
				"properties": {
					"name": "Ghana"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								1.060122,
								5.928837
							],
							[
								-0.507638,
								5.343473
							],
							[
								-1.063625,
								5.000548
							],
							[
								-1.964707,
								4.710462
							],
							[
								-2.856125,
								4.994476
							],
							[
								-2.810701,
								5.389051
							],
							[
								-3.24437,
								6.250472
							],
							[
								-2.983585,
								7.379705
							],
							[
								-2.56219,
								8.219628
							],
							[
								-2.827496,
								9.642461
							],
							[
								-2.963896,
								10.395335
							],
							[
								-2.940409,
								10.96269
							],
							[
								-1.203358,
								11.009819
							],
							[
								-0.761576,
								10.93693
							],
							[
								-0.438702,
								11.098341
							],
							[
								0.023803,
								11.018682
							],
							[
								-0.049785,
								10.706918
							],
							[
								0.36758,
								10.191213
							],
							[
								0.365901,
								9.465004
							],
							[
								0.461192,
								8.677223
							],
							[
								0.712029,
								8.312465
							],
							[
								0.490957,
								7.411744
							],
							[
								0.570384,
								6.914359
							],
							[
								0.836931,
								6.279979
							],
							[
								1.060122,
								5.928837
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GIN",
				"properties": {
					"name": "Guinea"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-8.439298,
								7.686043
							],
							[
								-8.722124,
								7.711674
							],
							[
								-8.926065,
								7.309037
							],
							[
								-9.208786,
								7.313921
							],
							[
								-9.403348,
								7.526905
							],
							[
								-9.33728,
								7.928534
							],
							[
								-9.755342,
								8.541055
							],
							[
								-10.016567,
								8.428504
							],
							[
								-10.230094,
								8.406206
							],
							[
								-10.505477,
								8.348896
							],
							[
								-10.494315,
								8.715541
							],
							[
								-10.65477,
								8.977178
							],
							[
								-10.622395,
								9.26791
							],
							[
								-10.839152,
								9.688246
							],
							[
								-11.117481,
								10.045873
							],
							[
								-11.917277,
								10.046984
							],
							[
								-12.150338,
								9.858572
							],
							[
								-12.425929,
								9.835834
							],
							[
								-12.596719,
								9.620188
							],
							[
								-12.711958,
								9.342712
							],
							[
								-13.24655,
								8.903049
							],
							[
								-13.685154,
								9.494744
							],
							[
								-14.074045,
								9.886167
							],
							[
								-14.330076,
								10.01572
							],
							[
								-14.579699,
								10.214467
							],
							[
								-14.693232,
								10.656301
							],
							[
								-14.839554,
								10.876572
							],
							[
								-15.130311,
								11.040412
							],
							[
								-14.685687,
								11.527824
							],
							[
								-14.382192,
								11.509272
							],
							[
								-14.121406,
								11.677117
							],
							[
								-13.9008,
								11.678719
							],
							[
								-13.743161,
								11.811269
							],
							[
								-13.828272,
								12.142644
							],
							[
								-13.718744,
								12.247186
							],
							[
								-13.700476,
								12.586183
							],
							[
								-13.217818,
								12.575874
							],
							[
								-12.499051,
								12.33209
							],
							[
								-12.278599,
								12.35444
							],
							[
								-12.203565,
								12.465648
							],
							[
								-11.658301,
								12.386583
							],
							[
								-11.513943,
								12.442988
							],
							[
								-11.456169,
								12.076834
							],
							[
								-11.297574,
								12.077971
							],
							[
								-11.036556,
								12.211245
							],
							[
								-10.87083,
								12.177887
							],
							[
								-10.593224,
								11.923975
							],
							[
								-10.165214,
								11.844084
							],
							[
								-9.890993,
								12.060479
							],
							[
								-9.567912,
								12.194243
							],
							[
								-9.327616,
								12.334286
							],
							[
								-9.127474,
								12.30806
							],
							[
								-8.905265,
								12.088358
							],
							[
								-8.786099,
								11.812561
							],
							[
								-8.376305,
								11.393646
							],
							[
								-8.581305,
								11.136246
							],
							[
								-8.620321,
								10.810891
							],
							[
								-8.407311,
								10.909257
							],
							[
								-8.282357,
								10.792597
							],
							[
								-8.335377,
								10.494812
							],
							[
								-8.029944,
								10.206535
							],
							[
								-8.229337,
								10.12902
							],
							[
								-8.309616,
								9.789532
							],
							[
								-8.079114,
								9.376224
							],
							[
								-7.8321,
								8.575704
							],
							[
								-8.203499,
								8.455453
							],
							[
								-8.299049,
								8.316444
							],
							[
								-8.221792,
								8.123329
							],
							[
								-8.280703,
								7.68718
							],
							[
								-8.439298,
								7.686043
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GMB",
				"properties": {
					"name": "Gambia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-16.841525,
								13.151394
							],
							[
								-16.713729,
								13.594959
							],
							[
								-15.624596,
								13.623587
							],
							[
								-15.39877,
								13.860369
							],
							[
								-15.081735,
								13.876492
							],
							[
								-14.687031,
								13.630357
							],
							[
								-14.376714,
								13.62568
							],
							[
								-14.046992,
								13.794068
							],
							[
								-13.844963,
								13.505042
							],
							[
								-14.277702,
								13.280585
							],
							[
								-14.712197,
								13.298207
							],
							[
								-15.141163,
								13.509512
							],
							[
								-15.511813,
								13.27857
							],
							[
								-15.691001,
								13.270353
							],
							[
								-15.931296,
								13.130284
							],
							[
								-16.841525,
								13.151394
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GNB",
				"properties": {
					"name": "Guinea Bissau"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-15.130311,
								11.040412
							],
							[
								-15.66418,
								11.458474
							],
							[
								-16.085214,
								11.524594
							],
							[
								-16.314787,
								11.806515
							],
							[
								-16.308947,
								11.958702
							],
							[
								-16.613838,
								12.170911
							],
							[
								-16.677452,
								12.384852
							],
							[
								-16.147717,
								12.547762
							],
							[
								-15.816574,
								12.515567
							],
							[
								-15.548477,
								12.62817
							],
							[
								-13.700476,
								12.586183
							],
							[
								-13.718744,
								12.247186
							],
							[
								-13.828272,
								12.142644
							],
							[
								-13.743161,
								11.811269
							],
							[
								-13.9008,
								11.678719
							],
							[
								-14.121406,
								11.677117
							],
							[
								-14.382192,
								11.509272
							],
							[
								-14.685687,
								11.527824
							],
							[
								-15.130311,
								11.040412
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GNQ",
				"properties": {
					"name": "Equatorial Guinea"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								9.492889,
								1.01012
							],
							[
								9.305613,
								1.160911
							],
							[
								9.649158,
								2.283866
							],
							[
								11.276449,
								2.261051
							],
							[
								11.285079,
								1.057662
							],
							[
								9.830284,
								1.067894
							],
							[
								9.492889,
								1.01012
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GRC",
				"properties": {
					"name": "Greece"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									23.69998,
									35.705004
								],
								[
									24.246665,
									35.368022
								],
								[
									25.025015,
									35.424996
								],
								[
									25.769208,
									35.354018
								],
								[
									25.745023,
									35.179998
								],
								[
									26.290003,
									35.29999
								],
								[
									26.164998,
									35.004995
								],
								[
									24.724982,
									34.919988
								],
								[
									24.735007,
									35.084991
								],
								[
									23.514978,
									35.279992
								],
								[
									23.69998,
									35.705004
								]
							]
						],
						[
							[
								[
									26.604196,
									41.562115
								],
								[
									26.294602,
									40.936261
								],
								[
									26.056942,
									40.824123
								],
								[
									25.447677,
									40.852545
								],
								[
									24.925848,
									40.947062
								],
								[
									23.714811,
									40.687129
								],
								[
									24.407999,
									40.124993
								],
								[
									23.899968,
									39.962006
								],
								[
									23.342999,
									39.960998
								],
								[
									22.813988,
									40.476005
								],
								[
									22.626299,
									40.256561
								],
								[
									22.849748,
									39.659311
								],
								[
									23.350027,
									39.190011
								],
								[
									22.973099,
									38.970903
								],
								[
									23.530016,
									38.510001
								],
								[
									24.025025,
									38.219993
								],
								[
									24.040011,
									37.655015
								],
								[
									23.115003,
									37.920011
								],
								[
									23.409972,
									37.409991
								],
								[
									22.774972,
									37.30501
								],
								[
									23.154225,
									36.422506
								],
								[
									22.490028,
									36.41
								],
								[
									21.670026,
									36.844986
								],
								[
									21.295011,
									37.644989
								],
								[
									21.120034,
									38.310323
								],
								[
									20.730032,
									38.769985
								],
								[
									20.217712,
									39.340235
								],
								[
									20.150016,
									39.624998
								],
								[
									20.615,
									40.110007
								],
								[
									20.674997,
									40.435
								],
								[
									20.99999,
									40.580004
								],
								[
									21.02004,
									40.842727
								],
								[
									21.674161,
									40.931275
								],
								[
									22.055378,
									41.149866
								],
								[
									22.597308,
									41.130487
								],
								[
									22.76177,
									41.3048
								],
								[
									22.952377,
									41.337994
								],
								[
									23.692074,
									41.309081
								],
								[
									24.492645,
									41.583896
								],
								[
									25.197201,
									41.234486
								],
								[
									26.106138,
									41.328899
								],
								[
									26.117042,
									41.826905
								],
								[
									26.604196,
									41.562115
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GRL",
				"properties": {
					"name": "Greenland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-46.76379,
								82.62796
							],
							[
								-43.40644,
								83.22516
							],
							[
								-39.89753,
								83.18018
							],
							[
								-38.62214,
								83.54905
							],
							[
								-35.08787,
								83.64513
							],
							[
								-27.10046,
								83.51966
							],
							[
								-20.84539,
								82.72669
							],
							[
								-22.69182,
								82.34165
							],
							[
								-26.51753,
								82.29765
							],
							[
								-31.9,
								82.2
							],
							[
								-31.39646,
								82.02154
							],
							[
								-27.85666,
								82.13178
							],
							[
								-24.84448,
								81.78697
							],
							[
								-22.90328,
								82.09317
							],
							[
								-22.07175,
								81.73449
							],
							[
								-23.16961,
								81.15271
							],
							[
								-20.62363,
								81.52462
							],
							[
								-15.76818,
								81.91245
							],
							[
								-12.77018,
								81.71885
							],
							[
								-12.20855,
								81.29154
							],
							[
								-16.28533,
								80.58004
							],
							[
								-16.85,
								80.35
							],
							[
								-20.04624,
								80.17708
							],
							[
								-17.73035,
								80.12912
							],
							[
								-18.9,
								79.4
							],
							[
								-19.70499,
								78.75128
							],
							[
								-19.67353,
								77.63859
							],
							[
								-18.47285,
								76.98565
							],
							[
								-20.03503,
								76.94434
							],
							[
								-21.67944,
								76.62795
							],
							[
								-19.83407,
								76.09808
							],
							[
								-19.59896,
								75.24838
							],
							[
								-20.66818,
								75.15585
							],
							[
								-19.37281,
								74.29561
							],
							[
								-21.59422,
								74.22382
							],
							[
								-20.43454,
								73.81713
							],
							[
								-20.76234,
								73.46436
							],
							[
								-22.17221,
								73.30955
							],
							[
								-23.56593,
								73.30663
							],
							[
								-22.31311,
								72.62928
							],
							[
								-22.29954,
								72.18409
							],
							[
								-24.27834,
								72.59788
							],
							[
								-24.79296,
								72.3302
							],
							[
								-23.44296,
								72.08016
							],
							[
								-22.13281,
								71.46898
							],
							[
								-21.75356,
								70.66369
							],
							[
								-23.53603,
								70.471
							],
							[
								-24.30702,
								70.85649
							],
							[
								-25.54341,
								71.43094
							],
							[
								-25.20135,
								70.75226
							],
							[
								-26.36276,
								70.22646
							],
							[
								-23.72742,
								70.18401
							],
							[
								-22.34902,
								70.12946
							],
							[
								-25.02927,
								69.2588
							],
							[
								-27.74737,
								68.47046
							],
							[
								-30.67371,
								68.12503
							],
							[
								-31.77665,
								68.12078
							],
							[
								-32.81105,
								67.73547
							],
							[
								-34.20196,
								66.67974
							],
							[
								-36.35284,
								65.9789
							],
							[
								-37.04378,
								65.93768
							],
							[
								-38.37505,
								65.69213
							],
							[
								-39.81222,
								65.45848
							],
							[
								-40.66899,
								64.83997
							],
							[
								-40.68281,
								64.13902
							],
							[
								-41.1887,
								63.48246
							],
							[
								-42.81938,
								62.68233
							],
							[
								-42.41666,
								61.90093
							],
							[
								-42.86619,
								61.07404
							],
							[
								-43.3784,
								60.09772
							],
							[
								-44.7875,
								60.03676
							],
							[
								-46.26364,
								60.85328
							],
							[
								-48.26294,
								60.85843
							],
							[
								-49.23308,
								61.40681
							],
							[
								-49.90039,
								62.38336
							],
							[
								-51.63325,
								63.62691
							],
							[
								-52.14014,
								64.27842
							],
							[
								-52.27659,
								65.1767
							],
							[
								-53.66166,
								66.09957
							],
							[
								-53.30161,
								66.8365
							],
							[
								-53.96911,
								67.18899
							],
							[
								-52.9804,
								68.35759
							],
							[
								-51.47536,
								68.72958
							],
							[
								-51.08041,
								69.14781
							],
							[
								-50.87122,
								69.9291
							],
							[
								-52.013585,
								69.574925
							],
							[
								-52.55792,
								69.42616
							],
							[
								-53.45629,
								69.283625
							],
							[
								-54.68336,
								69.61003
							],
							[
								-54.75001,
								70.28932
							],
							[
								-54.35884,
								70.821315
							],
							[
								-53.431315,
								70.835755
							],
							[
								-51.39014,
								70.56978
							],
							[
								-53.10937,
								71.20485
							],
							[
								-54.00422,
								71.54719
							],
							[
								-55,
								71.406537
							],
							[
								-55.83468,
								71.65444
							],
							[
								-54.71819,
								72.58625
							],
							[
								-55.32634,
								72.95861
							],
							[
								-56.12003,
								73.64977
							],
							[
								-57.32363,
								74.71026
							],
							[
								-58.59679,
								75.09861
							],
							[
								-58.58516,
								75.51727
							],
							[
								-61.26861,
								76.10238
							],
							[
								-63.39165,
								76.1752
							],
							[
								-66.06427,
								76.13486
							],
							[
								-68.50438,
								76.06141
							],
							[
								-69.66485,
								76.37975
							],
							[
								-71.40257,
								77.00857
							],
							[
								-68.77671,
								77.32312
							],
							[
								-66.76397,
								77.37595
							],
							[
								-71.04293,
								77.63595
							],
							[
								-73.297,
								78.04419
							],
							[
								-73.15938,
								78.43271
							],
							[
								-69.37345,
								78.91388
							],
							[
								-65.7107,
								79.39436
							],
							[
								-65.3239,
								79.75814
							],
							[
								-68.02298,
								80.11721
							],
							[
								-67.15129,
								80.51582
							],
							[
								-63.68925,
								81.21396
							],
							[
								-62.23444,
								81.3211
							],
							[
								-62.65116,
								81.77042
							],
							[
								-60.28249,
								82.03363
							],
							[
								-57.20744,
								82.19074
							],
							[
								-54.13442,
								82.19962
							],
							[
								-53.04328,
								81.88833
							],
							[
								-50.39061,
								82.43883
							],
							[
								-48.00386,
								82.06481
							],
							[
								-46.59984,
								81.985945
							],
							[
								-44.523,
								81.6607
							],
							[
								-46.9007,
								82.19979
							],
							[
								-46.76379,
								82.62796
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GTM",
				"properties": {
					"name": "Guatemala"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-90.095555,
								13.735338
							],
							[
								-90.608624,
								13.909771
							],
							[
								-91.23241,
								13.927832
							],
							[
								-91.689747,
								14.126218
							],
							[
								-92.22775,
								14.538829
							],
							[
								-92.20323,
								14.830103
							],
							[
								-92.087216,
								15.064585
							],
							[
								-92.229249,
								15.251447
							],
							[
								-91.74796,
								16.066565
							],
							[
								-90.464473,
								16.069562
							],
							[
								-90.438867,
								16.41011
							],
							[
								-90.600847,
								16.470778
							],
							[
								-90.711822,
								16.687483
							],
							[
								-91.08167,
								16.918477
							],
							[
								-91.453921,
								17.252177
							],
							[
								-91.002269,
								17.254658
							],
							[
								-91.00152,
								17.817595
							],
							[
								-90.067934,
								17.819326
							],
							[
								-89.14308,
								17.808319
							],
							[
								-89.150806,
								17.015577
							],
							[
								-89.229122,
								15.886938
							],
							[
								-88.930613,
								15.887273
							],
							[
								-88.604586,
								15.70638
							],
							[
								-88.518364,
								15.855389
							],
							[
								-88.225023,
								15.727722
							],
							[
								-88.68068,
								15.346247
							],
							[
								-89.154811,
								15.066419
							],
							[
								-89.22522,
								14.874286
							],
							[
								-89.145535,
								14.678019
							],
							[
								-89.353326,
								14.424133
							],
							[
								-89.587343,
								14.362586
							],
							[
								-89.534219,
								14.244816
							],
							[
								-89.721934,
								14.134228
							],
							[
								-90.064678,
								13.88197
							],
							[
								-90.095555,
								13.735338
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GUF",
				"properties": {
					"name": "French Guiana"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-52.556425,
								2.504705
							],
							[
								-52.939657,
								2.124858
							],
							[
								-53.418465,
								2.053389
							],
							[
								-53.554839,
								2.334897
							],
							[
								-53.778521,
								2.376703
							],
							[
								-54.088063,
								2.105557
							],
							[
								-54.524754,
								2.311849
							],
							[
								-54.27123,
								2.738748
							],
							[
								-54.184284,
								3.194172
							],
							[
								-54.011504,
								3.62257
							],
							[
								-54.399542,
								4.212611
							],
							[
								-54.478633,
								4.896756
							],
							[
								-53.958045,
								5.756548
							],
							[
								-53.618453,
								5.646529
							],
							[
								-52.882141,
								5.409851
							],
							[
								-51.823343,
								4.565768
							],
							[
								-51.657797,
								4.156232
							],
							[
								-52.249338,
								3.241094
							],
							[
								-52.556425,
								2.504705
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "GUY",
				"properties": {
					"name": "Guyana"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-59.758285,
								8.367035
							],
							[
								-59.101684,
								7.999202
							],
							[
								-58.482962,
								7.347691
							],
							[
								-58.454876,
								6.832787
							],
							[
								-58.078103,
								6.809094
							],
							[
								-57.542219,
								6.321268
							],
							[
								-57.147436,
								5.97315
							],
							[
								-57.307246,
								5.073567
							],
							[
								-57.914289,
								4.812626
							],
							[
								-57.86021,
								4.576801
							],
							[
								-58.044694,
								4.060864
							],
							[
								-57.601569,
								3.334655
							],
							[
								-57.281433,
								3.333492
							],
							[
								-57.150098,
								2.768927
							],
							[
								-56.539386,
								1.899523
							],
							[
								-56.782704,
								1.863711
							],
							[
								-57.335823,
								1.948538
							],
							[
								-57.660971,
								1.682585
							],
							[
								-58.11345,
								1.507195
							],
							[
								-58.429477,
								1.463942
							],
							[
								-58.540013,
								1.268088
							],
							[
								-59.030862,
								1.317698
							],
							[
								-59.646044,
								1.786894
							],
							[
								-59.718546,
								2.24963
							],
							[
								-59.974525,
								2.755233
							],
							[
								-59.815413,
								3.606499
							],
							[
								-59.53804,
								3.958803
							],
							[
								-59.767406,
								4.423503
							],
							[
								-60.111002,
								4.574967
							],
							[
								-59.980959,
								5.014061
							],
							[
								-60.213683,
								5.244486
							],
							[
								-60.733574,
								5.200277
							],
							[
								-61.410303,
								5.959068
							],
							[
								-61.139415,
								6.234297
							],
							[
								-61.159336,
								6.696077
							],
							[
								-60.543999,
								6.856584
							],
							[
								-60.295668,
								7.043911
							],
							[
								-60.637973,
								7.415
							],
							[
								-60.550588,
								7.779603
							],
							[
								-59.758285,
								8.367035
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "HND",
				"properties": {
					"name": "Honduras"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-87.316654,
								12.984686
							],
							[
								-87.489409,
								13.297535
							],
							[
								-87.793111,
								13.38448
							],
							[
								-87.723503,
								13.78505
							],
							[
								-87.859515,
								13.893312
							],
							[
								-88.065343,
								13.964626
							],
							[
								-88.503998,
								13.845486
							],
							[
								-88.541231,
								13.980155
							],
							[
								-88.843073,
								14.140507
							],
							[
								-89.058512,
								14.340029
							],
							[
								-89.353326,
								14.424133
							],
							[
								-89.145535,
								14.678019
							],
							[
								-89.22522,
								14.874286
							],
							[
								-89.154811,
								15.066419
							],
							[
								-88.68068,
								15.346247
							],
							[
								-88.225023,
								15.727722
							],
							[
								-88.121153,
								15.688655
							],
							[
								-87.901813,
								15.864458
							],
							[
								-87.61568,
								15.878799
							],
							[
								-87.522921,
								15.797279
							],
							[
								-87.367762,
								15.84694
							],
							[
								-86.903191,
								15.756713
							],
							[
								-86.440946,
								15.782835
							],
							[
								-86.119234,
								15.893449
							],
							[
								-86.001954,
								16.005406
							],
							[
								-85.683317,
								15.953652
							],
							[
								-85.444004,
								15.885749
							],
							[
								-85.182444,
								15.909158
							],
							[
								-84.983722,
								15.995923
							],
							[
								-84.52698,
								15.857224
							],
							[
								-84.368256,
								15.835158
							],
							[
								-84.063055,
								15.648244
							],
							[
								-83.773977,
								15.424072
							],
							[
								-83.410381,
								15.270903
							],
							[
								-83.147219,
								14.995829
							],
							[
								-83.489989,
								15.016267
							],
							[
								-83.628585,
								14.880074
							],
							[
								-83.975721,
								14.749436
							],
							[
								-84.228342,
								14.748764
							],
							[
								-84.449336,
								14.621614
							],
							[
								-84.649582,
								14.666805
							],
							[
								-84.820037,
								14.819587
							],
							[
								-84.924501,
								14.790493
							],
							[
								-85.052787,
								14.551541
							],
							[
								-85.148751,
								14.560197
							],
							[
								-85.165365,
								14.35437
							],
							[
								-85.514413,
								14.079012
							],
							[
								-85.698665,
								13.960078
							],
							[
								-85.801295,
								13.836055
							],
							[
								-86.096264,
								14.038187
							],
							[
								-86.312142,
								13.771356
							],
							[
								-86.520708,
								13.778487
							],
							[
								-86.755087,
								13.754845
							],
							[
								-86.733822,
								13.263093
							],
							[
								-86.880557,
								13.254204
							],
							[
								-87.005769,
								13.025794
							],
							[
								-87.316654,
								12.984686
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "HRV",
				"properties": {
					"name": "Croatia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								18.829838,
								45.908878
							],
							[
								19.072769,
								45.521511
							],
							[
								19.390476,
								45.236516
							],
							[
								19.005486,
								44.860234
							],
							[
								18.553214,
								45.08159
							],
							[
								17.861783,
								45.06774
							],
							[
								17.002146,
								45.233777
							],
							[
								16.534939,
								45.211608
							],
							[
								16.318157,
								45.004127
							],
							[
								15.959367,
								45.233777
							],
							[
								15.750026,
								44.818712
							],
							[
								16.23966,
								44.351143
							],
							[
								16.456443,
								44.04124
							],
							[
								16.916156,
								43.667722
							],
							[
								17.297373,
								43.446341
							],
							[
								17.674922,
								43.028563
							],
							[
								18.56,
								42.65
							],
							[
								18.450016,
								42.479991
							],
							[
								17.50997,
								42.849995
							],
							[
								16.930006,
								43.209998
							],
							[
								16.015385,
								43.507215
							],
							[
								15.174454,
								44.243191
							],
							[
								15.37625,
								44.317915
							],
							[
								14.920309,
								44.738484
							],
							[
								14.901602,
								45.07606
							],
							[
								14.258748,
								45.233777
							],
							[
								13.952255,
								44.802124
							],
							[
								13.656976,
								45.136935
							],
							[
								13.679403,
								45.484149
							],
							[
								13.71506,
								45.500324
							],
							[
								14.411968,
								45.466166
							],
							[
								14.595109,
								45.634941
							],
							[
								14.935244,
								45.471695
							],
							[
								15.327675,
								45.452316
							],
							[
								15.323954,
								45.731783
							],
							[
								15.67153,
								45.834154
							],
							[
								15.768733,
								46.238108
							],
							[
								16.564808,
								46.503751
							],
							[
								16.882515,
								46.380632
							],
							[
								17.630066,
								45.951769
							],
							[
								18.456062,
								45.759481
							],
							[
								18.829838,
								45.908878
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "HTI",
				"properties": {
					"name": "Haiti"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-73.189791,
								19.915684
							],
							[
								-72.579673,
								19.871501
							],
							[
								-71.712361,
								19.714456
							],
							[
								-71.624873,
								19.169838
							],
							[
								-71.701303,
								18.785417
							],
							[
								-71.945112,
								18.6169
							],
							[
								-71.687738,
								18.31666
							],
							[
								-71.708305,
								18.044997
							],
							[
								-72.372476,
								18.214961
							],
							[
								-72.844411,
								18.145611
							],
							[
								-73.454555,
								18.217906
							],
							[
								-73.922433,
								18.030993
							],
							[
								-74.458034,
								18.34255
							],
							[
								-74.369925,
								18.664908
							],
							[
								-73.449542,
								18.526053
							],
							[
								-72.694937,
								18.445799
							],
							[
								-72.334882,
								18.668422
							],
							[
								-72.79165,
								19.101625
							],
							[
								-72.784105,
								19.483591
							],
							[
								-73.415022,
								19.639551
							],
							[
								-73.189791,
								19.915684
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "HUN",
				"properties": {
					"name": "Hungary"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								16.202298,
								46.852386
							],
							[
								16.534268,
								47.496171
							],
							[
								16.340584,
								47.712902
							],
							[
								16.903754,
								47.714866
							],
							[
								16.979667,
								48.123497
							],
							[
								17.488473,
								47.867466
							],
							[
								17.857133,
								47.758429
							],
							[
								18.696513,
								47.880954
							],
							[
								18.777025,
								48.081768
							],
							[
								19.174365,
								48.111379
							],
							[
								19.661364,
								48.266615
							],
							[
								19.769471,
								48.202691
							],
							[
								20.239054,
								48.327567
							],
							[
								20.473562,
								48.56285
							],
							[
								20.801294,
								48.623854
							],
							[
								21.872236,
								48.319971
							],
							[
								22.085608,
								48.422264
							],
							[
								22.64082,
								48.15024
							],
							[
								22.710531,
								47.882194
							],
							[
								22.099768,
								47.672439
							],
							[
								21.626515,
								46.994238
							],
							[
								21.021952,
								46.316088
							],
							[
								20.220192,
								46.127469
							],
							[
								19.596045,
								46.17173
							],
							[
								18.829838,
								45.908878
							],
							[
								18.456062,
								45.759481
							],
							[
								17.630066,
								45.951769
							],
							[
								16.882515,
								46.380632
							],
							[
								16.564808,
								46.503751
							],
							[
								16.370505,
								46.841327
							],
							[
								16.202298,
								46.852386
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "IDN",
				"properties": {
					"name": "Indonesia"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									120.715609,
									-10.239581
								],
								[
									120.295014,
									-10.25865
								],
								[
									118.967808,
									-9.557969
								],
								[
									119.90031,
									-9.36134
								],
								[
									120.425756,
									-9.665921
								],
								[
									120.775502,
									-9.969675
								],
								[
									120.715609,
									-10.239581
								]
							]
						],
						[
							[
								[
									124.43595,
									-10.140001
								],
								[
									123.579982,
									-10.359987
								],
								[
									123.459989,
									-10.239995
								],
								[
									123.550009,
									-9.900016
								],
								[
									123.980009,
									-9.290027
								],
								[
									124.968682,
									-8.89279
								],
								[
									125.07002,
									-9.089987
								],
								[
									125.08852,
									-9.393173
								],
								[
									124.43595,
									-10.140001
								]
							]
						],
						[
							[
								[
									117.900018,
									-8.095681
								],
								[
									118.260616,
									-8.362383
								],
								[
									118.87846,
									-8.280683
								],
								[
									119.126507,
									-8.705825
								],
								[
									117.970402,
									-8.906639
								],
								[
									117.277731,
									-9.040895
								],
								[
									116.740141,
									-9.032937
								],
								[
									117.083737,
									-8.457158
								],
								[
									117.632024,
									-8.449303
								],
								[
									117.900018,
									-8.095681
								]
							]
						],
						[
							[
								[
									122.903537,
									-8.094234
								],
								[
									122.756983,
									-8.649808
								],
								[
									121.254491,
									-8.933666
								],
								[
									119.924391,
									-8.810418
								],
								[
									119.920929,
									-8.444859
								],
								[
									120.715092,
									-8.236965
								],
								[
									121.341669,
									-8.53674
								],
								[
									122.007365,
									-8.46062
								],
								[
									122.903537,
									-8.094234
								]
							]
						],
						[
							[
								[
									108.623479,
									-6.777674
								],
								[
									110.539227,
									-6.877358
								],
								[
									110.759576,
									-6.465186
								],
								[
									112.614811,
									-6.946036
								],
								[
									112.978768,
									-7.594213
								],
								[
									114.478935,
									-7.776528
								],
								[
									115.705527,
									-8.370807
								],
								[
									114.564511,
									-8.751817
								],
								[
									113.464734,
									-8.348947
								],
								[
									112.559672,
									-8.376181
								],
								[
									111.522061,
									-8.302129
								],
								[
									110.58615,
									-8.122605
								],
								[
									109.427667,
									-7.740664
								],
								[
									108.693655,
									-7.6416
								],
								[
									108.277763,
									-7.766657
								],
								[
									106.454102,
									-7.3549
								],
								[
									106.280624,
									-6.9249
								],
								[
									105.365486,
									-6.851416
								],
								[
									106.051646,
									-5.895919
								],
								[
									107.265009,
									-5.954985
								],
								[
									108.072091,
									-6.345762
								],
								[
									108.486846,
									-6.421985
								],
								[
									108.623479,
									-6.777674
								]
							]
						],
						[
							[
								[
									134.724624,
									-6.214401
								],
								[
									134.210134,
									-6.895238
								],
								[
									134.112776,
									-6.142467
								],
								[
									134.290336,
									-5.783058
								],
								[
									134.499625,
									-5.445042
								],
								[
									134.727002,
									-5.737582
								],
								[
									134.724624,
									-6.214401
								]
							]
						],
						[
							[
								[
									127.249215,
									-3.459065
								],
								[
									126.874923,
									-3.790983
								],
								[
									126.183802,
									-3.607376
								],
								[
									125.989034,
									-3.177273
								],
								[
									127.000651,
									-3.129318
								],
								[
									127.249215,
									-3.459065
								]
							]
						],
						[
							[
								[
									130.471344,
									-3.093764
								],
								[
									130.834836,
									-3.858472
								],
								[
									129.990547,
									-3.446301
								],
								[
									129.155249,
									-3.362637
								],
								[
									128.590684,
									-3.428679
								],
								[
									127.898891,
									-3.393436
								],
								[
									128.135879,
									-2.84365
								],
								[
									129.370998,
									-2.802154
								],
								[
									130.471344,
									-3.093764
								]
							]
						],
						[
							[
								[
									134.143368,
									-1.151867
								],
								[
									134.422627,
									-2.769185
								],
								[
									135.457603,
									-3.367753
								],
								[
									136.293314,
									-2.307042
								],
								[
									137.440738,
									-1.703513
								],
								[
									138.329727,
									-1.702686
								],
								[
									139.184921,
									-2.051296
								],
								[
									139.926684,
									-2.409052
								],
								[
									141.00021,
									-2.600151
								],
								[
									141.017057,
									-5.859022
								],
								[
									141.033852,
									-9.117893
								],
								[
									140.143415,
									-8.297168
								],
								[
									139.127767,
									-8.096043
								],
								[
									138.881477,
									-8.380935
								],
								[
									137.614474,
									-8.411683
								],
								[
									138.039099,
									-7.597882
								],
								[
									138.668621,
									-7.320225
								],
								[
									138.407914,
									-6.232849
								],
								[
									137.92784,
									-5.393366
								],
								[
									135.98925,
									-4.546544
								],
								[
									135.164598,
									-4.462931
								],
								[
									133.66288,
									-3.538853
								],
								[
									133.367705,
									-4.024819
								],
								[
									132.983956,
									-4.112979
								],
								[
									132.756941,
									-3.746283
								],
								[
									132.753789,
									-3.311787
								],
								[
									131.989804,
									-2.820551
								],
								[
									133.066845,
									-2.460418
								],
								[
									133.780031,
									-2.479848
								],
								[
									133.696212,
									-2.214542
								],
								[
									132.232373,
									-2.212526
								],
								[
									131.836222,
									-1.617162
								],
								[
									130.94284,
									-1.432522
								],
								[
									130.519558,
									-0.93772
								],
								[
									131.867538,
									-0.695461
								],
								[
									132.380116,
									-0.369538
								],
								[
									133.985548,
									-0.78021
								],
								[
									134.143368,
									-1.151867
								]
							]
						],
						[
							[
								[
									125.240501,
									1.419836
								],
								[
									124.437035,
									0.427881
								],
								[
									123.685505,
									0.235593
								],
								[
									122.723083,
									0.431137
								],
								[
									121.056725,
									0.381217
								],
								[
									120.183083,
									0.237247
								],
								[
									120.04087,
									-0.519658
								],
								[
									120.935905,
									-1.408906
								],
								[
									121.475821,
									-0.955962
								],
								[
									123.340565,
									-0.615673
								],
								[
									123.258399,
									-1.076213
								],
								[
									122.822715,
									-0.930951
								],
								[
									122.38853,
									-1.516858
								],
								[
									121.508274,
									-1.904483
								],
								[
									122.454572,
									-3.186058
								],
								[
									122.271896,
									-3.5295
								],
								[
									123.170963,
									-4.683693
								],
								[
									123.162333,
									-5.340604
								],
								[
									122.628515,
									-5.634591
								],
								[
									122.236394,
									-5.282933
								],
								[
									122.719569,
									-4.464172
								],
								[
									121.738234,
									-4.851331
								],
								[
									121.489463,
									-4.574553
								],
								[
									121.619171,
									-4.188478
								],
								[
									120.898182,
									-3.602105
								],
								[
									120.972389,
									-2.627643
								],
								[
									120.305453,
									-2.931604
								],
								[
									120.390047,
									-4.097579
								],
								[
									120.430717,
									-5.528241
								],
								[
									119.796543,
									-5.6734
								],
								[
									119.366906,
									-5.379878
								],
								[
									119.653606,
									-4.459417
								],
								[
									119.498835,
									-3.494412
								],
								[
									119.078344,
									-3.487022
								],
								[
									118.767769,
									-2.801999
								],
								[
									119.180974,
									-2.147104
								],
								[
									119.323394,
									-1.353147
								],
								[
									119.825999,
									0.154254
								],
								[
									120.035702,
									0.566477
								],
								[
									120.885779,
									1.309223
								],
								[
									121.666817,
									1.013944
								],
								[
									122.927567,
									0.875192
								],
								[
									124.077522,
									0.917102
								],
								[
									125.065989,
									1.643259
								],
								[
									125.240501,
									1.419836
								]
							]
						],
						[
							[
								[
									128.688249,
									1.132386
								],
								[
									128.635952,
									0.258486
								],
								[
									128.12017,
									0.356413
								],
								[
									127.968034,
									-0.252077
								],
								[
									128.379999,
									-0.780004
								],
								[
									128.100016,
									-0.899996
								],
								[
									127.696475,
									-0.266598
								],
								[
									127.39949,
									1.011722
								],
								[
									127.600512,
									1.810691
								],
								[
									127.932378,
									2.174596
								],
								[
									128.004156,
									1.628531
								],
								[
									128.594559,
									1.540811
								],
								[
									128.688249,
									1.132386
								]
							]
						],
						[
							[
								[
									117.875627,
									1.827641
								],
								[
									118.996747,
									0.902219
								],
								[
									117.811858,
									0.784242
								],
								[
									117.478339,
									0.102475
								],
								[
									117.521644,
									-0.803723
								],
								[
									116.560048,
									-1.487661
								],
								[
									116.533797,
									-2.483517
								],
								[
									116.148084,
									-4.012726
								],
								[
									116.000858,
									-3.657037
								],
								[
									114.864803,
									-4.106984
								],
								[
									114.468652,
									-3.495704
								],
								[
									113.755672,
									-3.43917
								],
								[
									113.256994,
									-3.118776
								],
								[
									112.068126,
									-3.478392
								],
								[
									111.703291,
									-2.994442
								],
								[
									111.04824,
									-3.049426
								],
								[
									110.223846,
									-2.934032
								],
								[
									110.070936,
									-1.592874
								],
								[
									109.571948,
									-1.314907
								],
								[
									109.091874,
									-0.459507
								],
								[
									108.952658,
									0.415375
								],
								[
									109.069136,
									1.341934
								],
								[
									109.66326,
									2.006467
								],
								[
									109.830227,
									1.338136
								],
								[
									110.514061,
									0.773131
								],
								[
									111.159138,
									0.976478
								],
								[
									111.797548,
									0.904441
								],
								[
									112.380252,
									1.410121
								],
								[
									112.859809,
									1.49779
								],
								[
									113.80585,
									1.217549
								],
								[
									114.621355,
									1.430688
								],
								[
									115.134037,
									2.821482
								],
								[
									115.519078,
									3.169238
								],
								[
									115.865517,
									4.306559
								],
								[
									117.015214,
									4.306094
								],
								[
									117.882035,
									4.137551
								],
								[
									117.313232,
									3.234428
								],
								[
									118.04833,
									2.28769
								],
								[
									117.875627,
									1.827641
								]
							]
						],
						[
							[
								[
									105.817655,
									-5.852356
								],
								[
									104.710384,
									-5.873285
								],
								[
									103.868213,
									-5.037315
								],
								[
									102.584261,
									-4.220259
								],
								[
									102.156173,
									-3.614146
								],
								[
									101.399113,
									-2.799777
								],
								[
									100.902503,
									-2.050262
								],
								[
									100.141981,
									-0.650348
								],
								[
									99.26374,
									0.183142
								],
								[
									98.970011,
									1.042882
								],
								[
									98.601351,
									1.823507
								],
								[
									97.699598,
									2.453184
								],
								[
									97.176942,
									3.308791
								],
								[
									96.424017,
									3.86886
								],
								[
									95.380876,
									4.970782
								],
								[
									95.293026,
									5.479821
								],
								[
									95.936863,
									5.439513
								],
								[
									97.484882,
									5.246321
								],
								[
									98.369169,
									4.26837
								],
								[
									99.142559,
									3.59035
								],
								[
									99.693998,
									3.174329
								],
								[
									100.641434,
									2.099381
								],
								[
									101.658012,
									2.083697
								],
								[
									102.498271,
									1.3987
								],
								[
									103.07684,
									0.561361
								],
								[
									103.838396,
									0.104542
								],
								[
									103.437645,
									-0.711946
								],
								[
									104.010789,
									-1.059212
								],
								[
									104.369991,
									-1.084843
								],
								[
									104.53949,
									-1.782372
								],
								[
									104.887893,
									-2.340425
								],
								[
									105.622111,
									-2.428844
								],
								[
									106.108593,
									-3.061777
								],
								[
									105.857446,
									-4.305525
								],
								[
									105.817655,
									-5.852356
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "IND",
				"properties": {
					"name": "India"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								77.837451,
								35.49401
							],
							[
								78.912269,
								34.321936
							],
							[
								78.811086,
								33.506198
							],
							[
								79.208892,
								32.994395
							],
							[
								79.176129,
								32.48378
							],
							[
								78.458446,
								32.618164
							],
							[
								78.738894,
								31.515906
							],
							[
								79.721367,
								30.882715
							],
							[
								81.111256,
								30.183481
							],
							[
								80.476721,
								29.729865
							],
							[
								80.088425,
								28.79447
							],
							[
								81.057203,
								28.416095
							],
							[
								81.999987,
								27.925479
							],
							[
								83.304249,
								27.364506
							],
							[
								84.675018,
								27.234901
							],
							[
								85.251779,
								26.726198
							],
							[
								86.024393,
								26.630985
							],
							[
								87.227472,
								26.397898
							],
							[
								88.060238,
								26.414615
							],
							[
								88.174804,
								26.810405
							],
							[
								88.043133,
								27.445819
							],
							[
								88.120441,
								27.876542
							],
							[
								88.730326,
								28.086865
							],
							[
								88.814248,
								27.299316
							],
							[
								88.835643,
								27.098966
							],
							[
								89.744528,
								26.719403
							],
							[
								90.373275,
								26.875724
							],
							[
								91.217513,
								26.808648
							],
							[
								92.033484,
								26.83831
							],
							[
								92.103712,
								27.452614
							],
							[
								91.696657,
								27.771742
							],
							[
								92.503119,
								27.896876
							],
							[
								93.413348,
								28.640629
							],
							[
								94.56599,
								29.277438
							],
							[
								95.404802,
								29.031717
							],
							[
								96.117679,
								29.452802
							],
							[
								96.586591,
								28.83098
							],
							[
								96.248833,
								28.411031
							],
							[
								97.327114,
								28.261583
							],
							[
								97.402561,
								27.882536
							],
							[
								97.051989,
								27.699059
							],
							[
								97.133999,
								27.083774
							],
							[
								96.419366,
								27.264589
							],
							[
								95.124768,
								26.573572
							],
							[
								95.155153,
								26.001307
							],
							[
								94.603249,
								25.162495
							],
							[
								94.552658,
								24.675238
							],
							[
								94.106742,
								23.850741
							],
							[
								93.325188,
								24.078556
							],
							[
								93.286327,
								23.043658
							],
							[
								93.060294,
								22.703111
							],
							[
								93.166128,
								22.27846
							],
							[
								92.672721,
								22.041239
							],
							[
								92.146035,
								23.627499
							],
							[
								91.869928,
								23.624346
							],
							[
								91.706475,
								22.985264
							],
							[
								91.158963,
								23.503527
							],
							[
								91.46773,
								24.072639
							],
							[
								91.915093,
								24.130414
							],
							[
								92.376202,
								24.976693
							],
							[
								91.799596,
								25.147432
							],
							[
								90.872211,
								25.132601
							],
							[
								89.920693,
								25.26975
							],
							[
								89.832481,
								25.965082
							],
							[
								89.355094,
								26.014407
							],
							[
								88.563049,
								26.446526
							],
							[
								88.209789,
								25.768066
							],
							[
								88.931554,
								25.238692
							],
							[
								88.306373,
								24.866079
							],
							[
								88.084422,
								24.501657
							],
							[
								88.69994,
								24.233715
							],
							[
								88.52977,
								23.631142
							],
							[
								88.876312,
								22.879146
							],
							[
								89.031961,
								22.055708
							],
							[
								88.888766,
								21.690588
							],
							[
								88.208497,
								21.703172
							],
							[
								86.975704,
								21.495562
							],
							[
								87.033169,
								20.743308
							],
							[
								86.499351,
								20.151638
							],
							[
								85.060266,
								19.478579
							],
							[
								83.941006,
								18.30201
							],
							[
								83.189217,
								17.671221
							],
							[
								82.192792,
								17.016636
							],
							[
								82.191242,
								16.556664
							],
							[
								81.692719,
								16.310219
							],
							[
								80.791999,
								15.951972
							],
							[
								80.324896,
								15.899185
							],
							[
								80.025069,
								15.136415
							],
							[
								80.233274,
								13.835771
							],
							[
								80.286294,
								13.006261
							],
							[
								79.862547,
								12.056215
							],
							[
								79.857999,
								10.357275
							],
							[
								79.340512,
								10.308854
							],
							[
								78.885345,
								9.546136
							],
							[
								79.18972,
								9.216544
							],
							[
								78.277941,
								8.933047
							],
							[
								77.941165,
								8.252959
							],
							[
								77.539898,
								7.965535
							],
							[
								76.592979,
								8.899276
							],
							[
								76.130061,
								10.29963
							],
							[
								75.746467,
								11.308251
							],
							[
								75.396101,
								11.781245
							],
							[
								74.864816,
								12.741936
							],
							[
								74.616717,
								13.992583
							],
							[
								74.443859,
								14.617222
							],
							[
								73.534199,
								15.990652
							],
							[
								73.119909,
								17.92857
							],
							[
								72.820909,
								19.208234
							],
							[
								72.824475,
								20.419503
							],
							[
								72.630533,
								21.356009
							],
							[
								71.175273,
								20.757441
							],
							[
								70.470459,
								20.877331
							],
							[
								69.16413,
								22.089298
							],
							[
								69.644928,
								22.450775
							],
							[
								69.349597,
								22.84318
							],
							[
								68.176645,
								23.691965
							],
							[
								68.842599,
								24.359134
							],
							[
								71.04324,
								24.356524
							],
							[
								70.844699,
								25.215102
							],
							[
								70.282873,
								25.722229
							],
							[
								70.168927,
								26.491872
							],
							[
								69.514393,
								26.940966
							],
							[
								70.616496,
								27.989196
							],
							[
								71.777666,
								27.91318
							],
							[
								72.823752,
								28.961592
							],
							[
								73.450638,
								29.976413
							],
							[
								74.42138,
								30.979815
							],
							[
								74.405929,
								31.692639
							],
							[
								75.258642,
								32.271105
							],
							[
								74.451559,
								32.7649
							],
							[
								74.104294,
								33.441473
							],
							[
								73.749948,
								34.317699
							],
							[
								74.240203,
								34.748887
							],
							[
								75.757061,
								34.504923
							],
							[
								76.871722,
								34.653544
							],
							[
								77.837451,
								35.49401
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "IRL",
				"properties": {
					"name": "Ireland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-6.197885,
								53.867565
							],
							[
								-6.032985,
								53.153164
							],
							[
								-6.788857,
								52.260118
							],
							[
								-8.561617,
								51.669301
							],
							[
								-9.977086,
								51.820455
							],
							[
								-9.166283,
								52.864629
							],
							[
								-9.688525,
								53.881363
							],
							[
								-8.327987,
								54.664519
							],
							[
								-7.572168,
								55.131622
							],
							[
								-7.366031,
								54.595841
							],
							[
								-7.572168,
								54.059956
							],
							[
								-6.95373,
								54.073702
							],
							[
								-6.197885,
								53.867565
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "IRN",
				"properties": {
					"name": "Iran"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								53.921598,
								37.198918
							],
							[
								54.800304,
								37.392421
							],
							[
								55.511578,
								37.964117
							],
							[
								56.180375,
								37.935127
							],
							[
								56.619366,
								38.121394
							],
							[
								57.330434,
								38.029229
							],
							[
								58.436154,
								37.522309
							],
							[
								59.234762,
								37.412988
							],
							[
								60.377638,
								36.527383
							],
							[
								61.123071,
								36.491597
							],
							[
								61.210817,
								35.650072
							],
							[
								60.803193,
								34.404102
							],
							[
								60.52843,
								33.676446
							],
							[
								60.9637,
								33.528832
							],
							[
								60.536078,
								32.981269
							],
							[
								60.863655,
								32.18292
							],
							[
								60.941945,
								31.548075
							],
							[
								61.699314,
								31.379506
							],
							[
								61.781222,
								30.73585
							],
							[
								60.874248,
								29.829239
							],
							[
								61.369309,
								29.303276
							],
							[
								61.771868,
								28.699334
							],
							[
								62.72783,
								28.259645
							],
							[
								62.755426,
								27.378923
							],
							[
								63.233898,
								27.217047
							],
							[
								63.316632,
								26.756532
							],
							[
								61.874187,
								26.239975
							],
							[
								61.497363,
								25.078237
							],
							[
								59.616134,
								25.380157
							],
							[
								58.525761,
								25.609962
							],
							[
								57.397251,
								25.739902
							],
							[
								56.970766,
								26.966106
							],
							[
								56.492139,
								27.143305
							],
							[
								55.72371,
								26.964633
							],
							[
								54.71509,
								26.480658
							],
							[
								53.493097,
								26.812369
							],
							[
								52.483598,
								27.580849
							],
							[
								51.520763,
								27.86569
							],
							[
								50.852948,
								28.814521
							],
							[
								50.115009,
								30.147773
							],
							[
								49.57685,
								29.985715
							],
							[
								48.941333,
								30.31709
							],
							[
								48.567971,
								29.926778
							],
							[
								48.014568,
								30.452457
							],
							[
								48.004698,
								30.985137
							],
							[
								47.685286,
								30.984853
							],
							[
								47.849204,
								31.709176
							],
							[
								47.334661,
								32.469155
							],
							[
								46.109362,
								33.017287
							],
							[
								45.416691,
								33.967798
							],
							[
								45.64846,
								34.748138
							],
							[
								46.151788,
								35.093259
							],
							[
								46.07634,
								35.677383
							],
							[
								45.420618,
								35.977546
							],
							[
								44.77267,
								37.17045
							],
							[
								44.225756,
								37.971584
							],
							[
								44.421403,
								38.281281
							],
							[
								44.109225,
								39.428136
							],
							[
								44.79399,
								39.713003
							],
							[
								44.952688,
								39.335765
							],
							[
								45.457722,
								38.874139
							],
							[
								46.143623,
								38.741201
							],
							[
								46.50572,
								38.770605
							],
							[
								47.685079,
								39.508364
							],
							[
								48.060095,
								39.582235
							],
							[
								48.355529,
								39.288765
							],
							[
								48.010744,
								38.794015
							],
							[
								48.634375,
								38.270378
							],
							[
								48.883249,
								38.320245
							],
							[
								49.199612,
								37.582874
							],
							[
								50.147771,
								37.374567
							],
							[
								50.842354,
								36.872814
							],
							[
								52.264025,
								36.700422
							],
							[
								53.82579,
								36.965031
							],
							[
								53.921598,
								37.198918
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "IRQ",
				"properties": {
					"name": "Iraq"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								45.420618,
								35.977546
							],
							[
								46.07634,
								35.677383
							],
							[
								46.151788,
								35.093259
							],
							[
								45.64846,
								34.748138
							],
							[
								45.416691,
								33.967798
							],
							[
								46.109362,
								33.017287
							],
							[
								47.334661,
								32.469155
							],
							[
								47.849204,
								31.709176
							],
							[
								47.685286,
								30.984853
							],
							[
								48.004698,
								30.985137
							],
							[
								48.014568,
								30.452457
							],
							[
								48.567971,
								29.926778
							],
							[
								47.974519,
								29.975819
							],
							[
								47.302622,
								30.05907
							],
							[
								46.568713,
								29.099025
							],
							[
								44.709499,
								29.178891
							],
							[
								41.889981,
								31.190009
							],
							[
								40.399994,
								31.889992
							],
							[
								39.195468,
								32.161009
							],
							[
								38.792341,
								33.378686
							],
							[
								41.006159,
								34.419372
							],
							[
								41.383965,
								35.628317
							],
							[
								41.289707,
								36.358815
							],
							[
								41.837064,
								36.605854
							],
							[
								42.349591,
								37.229873
							],
							[
								42.779126,
								37.385264
							],
							[
								43.942259,
								37.256228
							],
							[
								44.293452,
								37.001514
							],
							[
								44.772699,
								37.170445
							],
							[
								45.420618,
								35.977546
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ISL",
				"properties": {
					"name": "Iceland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-14.508695,
								66.455892
							],
							[
								-14.739637,
								65.808748
							],
							[
								-13.609732,
								65.126671
							],
							[
								-14.909834,
								64.364082
							],
							[
								-17.794438,
								63.678749
							],
							[
								-18.656246,
								63.496383
							],
							[
								-19.972755,
								63.643635
							],
							[
								-22.762972,
								63.960179
							],
							[
								-21.778484,
								64.402116
							],
							[
								-23.955044,
								64.89113
							],
							[
								-22.184403,
								65.084968
							],
							[
								-22.227423,
								65.378594
							],
							[
								-24.326184,
								65.611189
							],
							[
								-23.650515,
								66.262519
							],
							[
								-22.134922,
								66.410469
							],
							[
								-20.576284,
								65.732112
							],
							[
								-19.056842,
								66.276601
							],
							[
								-17.798624,
								65.993853
							],
							[
								-16.167819,
								66.526792
							],
							[
								-14.508695,
								66.455892
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ISR",
				"properties": {
					"name": "Israel"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								35.719918,
								32.709192
							],
							[
								35.545665,
								32.393992
							],
							[
								35.18393,
								32.532511
							],
							[
								34.974641,
								31.866582
							],
							[
								35.225892,
								31.754341
							],
							[
								34.970507,
								31.616778
							],
							[
								34.927408,
								31.353435
							],
							[
								35.397561,
								31.489086
							],
							[
								35.420918,
								31.100066
							],
							[
								34.922603,
								29.501326
							],
							[
								34.265433,
								31.219361
							],
							[
								34.556372,
								31.548824
							],
							[
								34.488107,
								31.605539
							],
							[
								34.752587,
								32.072926
							],
							[
								34.955417,
								32.827376
							],
							[
								35.098457,
								33.080539
							],
							[
								35.126053,
								33.0909
							],
							[
								35.460709,
								33.08904
							],
							[
								35.552797,
								33.264275
							],
							[
								35.821101,
								33.277426
							],
							[
								35.836397,
								32.868123
							],
							[
								35.700798,
								32.716014
							],
							[
								35.719918,
								32.709192
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ITA",
				"properties": {
					"name": "Italy"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									15.520376,
									38.231155
								],
								[
									15.160243,
									37.444046
								],
								[
									15.309898,
									37.134219
								],
								[
									15.099988,
									36.619987
								],
								[
									14.335229,
									36.996631
								],
								[
									13.826733,
									37.104531
								],
								[
									12.431004,
									37.61295
								],
								[
									12.570944,
									38.126381
								],
								[
									13.741156,
									38.034966
								],
								[
									14.761249,
									38.143874
								],
								[
									15.520376,
									38.231155
								]
							]
						],
						[
							[
								[
									9.210012,
									41.209991
								],
								[
									9.809975,
									40.500009
								],
								[
									9.669519,
									39.177376
								],
								[
									9.214818,
									39.240473
								],
								[
									8.806936,
									38.906618
								],
								[
									8.428302,
									39.171847
								],
								[
									8.388253,
									40.378311
								],
								[
									8.159998,
									40.950007
								],
								[
									8.709991,
									40.899984
								],
								[
									9.210012,
									41.209991
								]
							]
						],
						[
							[
								[
									12.376485,
									46.767559
								],
								[
									13.806475,
									46.509306
								],
								[
									13.69811,
									46.016778
								],
								[
									13.93763,
									45.591016
								],
								[
									13.141606,
									45.736692
								],
								[
									12.328581,
									45.381778
								],
								[
									12.383875,
									44.885374
								],
								[
									12.261453,
									44.600482
								],
								[
									12.589237,
									44.091366
								],
								[
									13.526906,
									43.587727
								],
								[
									14.029821,
									42.761008
								],
								[
									15.14257,
									41.95514
								],
								[
									15.926191,
									41.961315
								],
								[
									16.169897,
									41.740295
								],
								[
									15.889346,
									41.541082
								],
								[
									16.785002,
									41.179606
								],
								[
									17.519169,
									40.877143
								],
								[
									18.376687,
									40.355625
								],
								[
									18.480247,
									40.168866
								],
								[
									18.293385,
									39.810774
								],
								[
									17.73838,
									40.277671
								],
								[
									16.869596,
									40.442235
								],
								[
									16.448743,
									39.795401
								],
								[
									17.17149,
									39.4247
								],
								[
									17.052841,
									38.902871
								],
								[
									16.635088,
									38.843572
								],
								[
									16.100961,
									37.985899
								],
								[
									15.684087,
									37.908849
								],
								[
									15.687963,
									38.214593
								],
								[
									15.891981,
									38.750942
								],
								[
									16.109332,
									38.964547
								],
								[
									15.718814,
									39.544072
								],
								[
									15.413613,
									40.048357
								],
								[
									14.998496,
									40.172949
								],
								[
									14.703268,
									40.60455
								],
								[
									14.060672,
									40.786348
								],
								[
									13.627985,
									41.188287
								],
								[
									12.888082,
									41.25309
								],
								[
									12.106683,
									41.704535
								],
								[
									11.191906,
									42.355425
								],
								[
									10.511948,
									42.931463
								],
								[
									10.200029,
									43.920007
								],
								[
									9.702488,
									44.036279
								],
								[
									8.888946,
									44.366336
								],
								[
									8.428561,
									44.231228
								],
								[
									7.850767,
									43.767148
								],
								[
									7.435185,
									43.693845
								],
								[
									7.549596,
									44.127901
								],
								[
									7.007562,
									44.254767
								],
								[
									6.749955,
									45.028518
								],
								[
									7.096652,
									45.333099
								],
								[
									6.802355,
									45.70858
								],
								[
									6.843593,
									45.991147
								],
								[
									7.273851,
									45.776948
								],
								[
									7.755992,
									45.82449
								],
								[
									8.31663,
									46.163642
								],
								[
									8.489952,
									46.005151
								],
								[
									8.966306,
									46.036932
								],
								[
									9.182882,
									46.440215
								],
								[
									9.922837,
									46.314899
								],
								[
									10.363378,
									46.483571
								],
								[
									10.442701,
									46.893546
								],
								[
									11.048556,
									46.751359
								],
								[
									11.164828,
									46.941579
								],
								[
									12.153088,
									47.115393
								],
								[
									12.376485,
									46.767559
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "JAM",
				"properties": {
					"name": "Jamaica"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-77.569601,
								18.490525
							],
							[
								-76.896619,
								18.400867
							],
							[
								-76.365359,
								18.160701
							],
							[
								-76.199659,
								17.886867
							],
							[
								-76.902561,
								17.868238
							],
							[
								-77.206341,
								17.701116
							],
							[
								-77.766023,
								17.861597
							],
							[
								-78.337719,
								18.225968
							],
							[
								-78.217727,
								18.454533
							],
							[
								-77.797365,
								18.524218
							],
							[
								-77.569601,
								18.490525
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "JOR",
				"properties": {
					"name": "Jordan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								35.545665,
								32.393992
							],
							[
								35.719918,
								32.709192
							],
							[
								36.834062,
								32.312938
							],
							[
								38.792341,
								33.378686
							],
							[
								39.195468,
								32.161009
							],
							[
								39.004886,
								32.010217
							],
							[
								37.002166,
								31.508413
							],
							[
								37.998849,
								30.5085
							],
							[
								37.66812,
								30.338665
							],
							[
								37.503582,
								30.003776
							],
							[
								36.740528,
								29.865283
							],
							[
								36.501214,
								29.505254
							],
							[
								36.068941,
								29.197495
							],
							[
								34.956037,
								29.356555
							],
							[
								34.922603,
								29.501326
							],
							[
								35.420918,
								31.100066
							],
							[
								35.397561,
								31.489086
							],
							[
								35.545252,
								31.782505
							],
							[
								35.545665,
								32.393992
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "JPN",
				"properties": {
					"name": "Japan"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									134.638428,
									34.149234
								],
								[
									134.766379,
									33.806335
								],
								[
									134.203416,
									33.201178
								],
								[
									133.79295,
									33.521985
								],
								[
									133.280268,
									33.28957
								],
								[
									133.014858,
									32.704567
								],
								[
									132.363115,
									32.989382
								],
								[
									132.371176,
									33.463642
								],
								[
									132.924373,
									34.060299
								],
								[
									133.492968,
									33.944621
								],
								[
									133.904106,
									34.364931
								],
								[
									134.638428,
									34.149234
								]
							]
						],
						[
							[
								[
									140.976388,
									37.142074
								],
								[
									140.59977,
									36.343983
								],
								[
									140.774074,
									35.842877
								],
								[
									140.253279,
									35.138114
								],
								[
									138.975528,
									34.6676
								],
								[
									137.217599,
									34.606286
								],
								[
									135.792983,
									33.464805
								],
								[
									135.120983,
									33.849071
								],
								[
									135.079435,
									34.596545
								],
								[
									133.340316,
									34.375938
								],
								[
									132.156771,
									33.904933
								],
								[
									130.986145,
									33.885761
								],
								[
									132.000036,
									33.149992
								],
								[
									131.33279,
									31.450355
								],
								[
									130.686318,
									31.029579
								],
								[
									130.20242,
									31.418238
								],
								[
									130.447676,
									32.319475
								],
								[
									129.814692,
									32.61031
								],
								[
									129.408463,
									33.296056
								],
								[
									130.353935,
									33.604151
								],
								[
									130.878451,
									34.232743
								],
								[
									131.884229,
									34.749714
								],
								[
									132.617673,
									35.433393
								],
								[
									134.608301,
									35.731618
								],
								[
									135.677538,
									35.527134
								],
								[
									136.723831,
									37.304984
								],
								[
									137.390612,
									36.827391
								],
								[
									138.857602,
									37.827485
								],
								[
									139.426405,
									38.215962
								],
								[
									140.05479,
									39.438807
								],
								[
									139.883379,
									40.563312
								],
								[
									140.305783,
									41.195005
								],
								[
									141.368973,
									41.37856
								],
								[
									141.914263,
									39.991616
								],
								[
									141.884601,
									39.180865
								],
								[
									140.959489,
									38.174001
								],
								[
									140.976388,
									37.142074
								]
							]
						],
						[
							[
								[
									143.910162,
									44.1741
								],
								[
									144.613427,
									43.960883
								],
								[
									145.320825,
									44.384733
								],
								[
									145.543137,
									43.262088
								],
								[
									144.059662,
									42.988358
								],
								[
									143.18385,
									41.995215
								],
								[
									141.611491,
									42.678791
								],
								[
									141.067286,
									41.584594
								],
								[
									139.955106,
									41.569556
								],
								[
									139.817544,
									42.563759
								],
								[
									140.312087,
									43.333273
								],
								[
									141.380549,
									43.388825
								],
								[
									141.671952,
									44.772125
								],
								[
									141.967645,
									45.551483
								],
								[
									143.14287,
									44.510358
								],
								[
									143.910162,
									44.1741
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "KAZ",
				"properties": {
					"name": "Kazakhstan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								70.962315,
								42.266154
							],
							[
								70.388965,
								42.081308
							],
							[
								69.070027,
								41.384244
							],
							[
								68.632483,
								40.668681
							],
							[
								68.259896,
								40.662325
							],
							[
								67.985856,
								41.135991
							],
							[
								66.714047,
								41.168444
							],
							[
								66.510649,
								41.987644
							],
							[
								66.023392,
								41.994646
							],
							[
								66.098012,
								42.99766
							],
							[
								64.900824,
								43.728081
							],
							[
								63.185787,
								43.650075
							],
							[
								62.0133,
								43.504477
							],
							[
								61.05832,
								44.405817
							],
							[
								60.239972,
								44.784037
							],
							[
								58.689989,
								45.500014
							],
							[
								58.503127,
								45.586804
							],
							[
								55.928917,
								44.995858
							],
							[
								55.968191,
								41.308642
							],
							[
								55.455251,
								41.259859
							],
							[
								54.755345,
								42.043971
							],
							[
								54.079418,
								42.324109
							],
							[
								52.944293,
								42.116034
							],
							[
								52.50246,
								41.783316
							],
							[
								52.446339,
								42.027151
							],
							[
								52.692112,
								42.443895
							],
							[
								52.501426,
								42.792298
							],
							[
								51.342427,
								43.132975
							],
							[
								50.891292,
								44.031034
							],
							[
								50.339129,
								44.284016
							],
							[
								50.305643,
								44.609836
							],
							[
								51.278503,
								44.514854
							],
							[
								51.316899,
								45.245998
							],
							[
								52.16739,
								45.408391
							],
							[
								53.040876,
								45.259047
							],
							[
								53.220866,
								46.234646
							],
							[
								53.042737,
								46.853006
							],
							[
								52.042023,
								46.804637
							],
							[
								51.191945,
								47.048705
							],
							[
								50.034083,
								46.60899
							],
							[
								49.10116,
								46.39933
							],
							[
								48.593241,
								46.561034
							],
							[
								48.694734,
								47.075628
							],
							[
								48.057253,
								47.743753
							],
							[
								47.315231,
								47.715847
							],
							[
								46.466446,
								48.394152
							],
							[
								47.043672,
								49.152039
							],
							[
								46.751596,
								49.356006
							],
							[
								47.54948,
								50.454698
							],
							[
								48.577841,
								49.87476
							],
							[
								48.702382,
								50.605128
							],
							[
								50.766648,
								51.692762
							],
							[
								52.328724,
								51.718652
							],
							[
								54.532878,
								51.02624
							],
							[
								55.716941,
								50.621717
							],
							[
								56.777961,
								51.043551
							],
							[
								58.363291,
								51.063653
							],
							[
								59.642282,
								50.545442
							],
							[
								59.932807,
								50.842194
							],
							[
								61.337424,
								50.79907
							],
							[
								61.588003,
								51.272659
							],
							[
								59.967534,
								51.96042
							],
							[
								60.927269,
								52.447548
							],
							[
								60.739993,
								52.719986
							],
							[
								61.699986,
								52.979996
							],
							[
								60.978066,
								53.664993
							],
							[
								61.436591,
								54.006265
							],
							[
								65.178534,
								54.354228
							],
							[
								65.666876,
								54.601267
							],
							[
								68.1691,
								54.970392
							],
							[
								69.068167,
								55.38525
							],
							[
								70.865267,
								55.169734
							],
							[
								71.180131,
								54.133285
							],
							[
								72.22415,
								54.376655
							],
							[
								73.508516,
								54.035617
							],
							[
								73.425679,
								53.48981
							],
							[
								74.384845,
								53.546861
							],
							[
								76.8911,
								54.490524
							],
							[
								76.525179,
								54.177003
							],
							[
								77.800916,
								53.404415
							],
							[
								80.03556,
								50.864751
							],
							[
								80.568447,
								51.388336
							],
							[
								81.945986,
								50.812196
							],
							[
								83.383004,
								51.069183
							],
							[
								83.935115,
								50.889246
							],
							[
								84.416377,
								50.3114
							],
							[
								85.11556,
								50.117303
							],
							[
								85.54127,
								49.692859
							],
							[
								86.829357,
								49.826675
							],
							[
								87.35997,
								49.214981
							],
							[
								86.598776,
								48.549182
							],
							[
								85.768233,
								48.455751
							],
							[
								85.720484,
								47.452969
							],
							[
								85.16429,
								47.000956
							],
							[
								83.180484,
								47.330031
							],
							[
								82.458926,
								45.53965
							],
							[
								81.947071,
								45.317027
							],
							[
								79.966106,
								44.917517
							],
							[
								80.866206,
								43.180362
							],
							[
								80.18015,
								42.920068
							],
							[
								80.25999,
								42.349999
							],
							[
								79.643645,
								42.496683
							],
							[
								79.142177,
								42.856092
							],
							[
								77.658392,
								42.960686
							],
							[
								76.000354,
								42.988022
							],
							[
								75.636965,
								42.8779
							],
							[
								74.212866,
								43.298339
							],
							[
								73.645304,
								43.091272
							],
							[
								73.489758,
								42.500894
							],
							[
								71.844638,
								42.845395
							],
							[
								71.186281,
								42.704293
							],
							[
								70.962315,
								42.266154
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "KEN",
				"properties": {
					"name": "Kenya"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								40.993,
								-0.85829
							],
							[
								41.58513,
								-1.68325
							],
							[
								40.88477,
								-2.08255
							],
							[
								40.63785,
								-2.49979
							],
							[
								40.26304,
								-2.57309
							],
							[
								40.12119,
								-3.27768
							],
							[
								39.80006,
								-3.68116
							],
							[
								39.60489,
								-4.34653
							],
							[
								39.20222,
								-4.67677
							],
							[
								37.7669,
								-3.67712
							],
							[
								37.69869,
								-3.09699
							],
							[
								34.07262,
								-1.05982
							],
							[
								33.903711,
								-0.95
							],
							[
								33.893569,
								0.109814
							],
							[
								34.18,
								0.515
							],
							[
								34.6721,
								1.17694
							],
							[
								35.03599,
								1.90584
							],
							[
								34.59607,
								3.05374
							],
							[
								34.47913,
								3.5556
							],
							[
								34.005,
								4.249885
							],
							[
								34.620196,
								4.847123
							],
							[
								35.298007,
								5.506
							],
							[
								35.817448,
								5.338232
							],
							[
								35.817448,
								4.776966
							],
							[
								36.159079,
								4.447864
							],
							[
								36.855093,
								4.447864
							],
							[
								38.120915,
								3.598605
							],
							[
								38.43697,
								3.58851
							],
							[
								38.67114,
								3.61607
							],
							[
								38.89251,
								3.50074
							],
							[
								39.559384,
								3.42206
							],
							[
								39.85494,
								3.83879
							],
							[
								40.76848,
								4.25702
							],
							[
								41.1718,
								3.91909
							],
							[
								41.855083,
								3.918912
							],
							[
								40.98105,
								2.78452
							],
							[
								40.993,
								-0.85829
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "KGZ",
				"properties": {
					"name": "Kyrgyzstan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								70.962315,
								42.266154
							],
							[
								71.186281,
								42.704293
							],
							[
								71.844638,
								42.845395
							],
							[
								73.489758,
								42.500894
							],
							[
								73.645304,
								43.091272
							],
							[
								74.212866,
								43.298339
							],
							[
								75.636965,
								42.8779
							],
							[
								76.000354,
								42.988022
							],
							[
								77.658392,
								42.960686
							],
							[
								79.142177,
								42.856092
							],
							[
								79.643645,
								42.496683
							],
							[
								80.25999,
								42.349999
							],
							[
								80.11943,
								42.123941
							],
							[
								78.543661,
								41.582243
							],
							[
								78.187197,
								41.185316
							],
							[
								76.904484,
								41.066486
							],
							[
								76.526368,
								40.427946
							],
							[
								75.467828,
								40.562072
							],
							[
								74.776862,
								40.366425
							],
							[
								73.822244,
								39.893973
							],
							[
								73.960013,
								39.660008
							],
							[
								73.675379,
								39.431237
							],
							[
								71.784694,
								39.279463
							],
							[
								70.549162,
								39.604198
							],
							[
								69.464887,
								39.526683
							],
							[
								69.55961,
								40.103211
							],
							[
								70.648019,
								39.935754
							],
							[
								71.014198,
								40.244366
							],
							[
								71.774875,
								40.145844
							],
							[
								73.055417,
								40.866033
							],
							[
								71.870115,
								41.3929
							],
							[
								71.157859,
								41.143587
							],
							[
								70.420022,
								41.519998
							],
							[
								71.259248,
								42.167711
							],
							[
								70.962315,
								42.266154
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "KHM",
				"properties": {
					"name": "Cambodia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								103.49728,
								10.632555
							],
							[
								103.09069,
								11.153661
							],
							[
								102.584932,
								12.186595
							],
							[
								102.348099,
								13.394247
							],
							[
								102.988422,
								14.225721
							],
							[
								104.281418,
								14.416743
							],
							[
								105.218777,
								14.273212
							],
							[
								106.043946,
								13.881091
							],
							[
								106.496373,
								14.570584
							],
							[
								107.382727,
								14.202441
							],
							[
								107.614548,
								13.535531
							],
							[
								107.491403,
								12.337206
							],
							[
								105.810524,
								11.567615
							],
							[
								106.24967,
								10.961812
							],
							[
								105.199915,
								10.88931
							],
							[
								104.334335,
								10.486544
							],
							[
								103.49728,
								10.632555
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "KOR",
				"properties": {
					"name": "South Korea"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								128.349716,
								38.612243
							],
							[
								129.21292,
								37.432392
							],
							[
								129.46045,
								36.784189
							],
							[
								129.468304,
								35.632141
							],
							[
								129.091377,
								35.082484
							],
							[
								128.18585,
								34.890377
							],
							[
								127.386519,
								34.475674
							],
							[
								126.485748,
								34.390046
							],
							[
								126.37392,
								34.93456
							],
							[
								126.559231,
								35.684541
							],
							[
								126.117398,
								36.725485
							],
							[
								126.860143,
								36.893924
							],
							[
								126.174759,
								37.749686
							],
							[
								126.237339,
								37.840378
							],
							[
								126.68372,
								37.804773
							],
							[
								127.073309,
								38.256115
							],
							[
								127.780035,
								38.304536
							],
							[
								128.205746,
								38.370397
							],
							[
								128.349716,
								38.612243
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "CS-KM",
				"properties": {
					"name": "Kosovo"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								20.76216,
								42.05186
							],
							[
								20.71731,
								41.84711
							],
							[
								20.59023,
								41.85541
							],
							[
								20.52295,
								42.21787
							],
							[
								20.28374,
								42.32025
							],
							[
								20.0707,
								42.58863
							],
							[
								20.25758,
								42.81275
							],
							[
								20.49679,
								42.88469
							],
							[
								20.63508,
								43.21671
							],
							[
								20.81448,
								43.27205
							],
							[
								20.95651,
								43.13094
							],
							[
								21.143395,
								43.068685
							],
							[
								21.27421,
								42.90959
							],
							[
								21.43866,
								42.86255
							],
							[
								21.63302,
								42.67717
							],
							[
								21.77505,
								42.6827
							],
							[
								21.66292,
								42.43922
							],
							[
								21.54332,
								42.32025
							],
							[
								21.576636,
								42.245224
							],
							[
								21.3527,
								42.2068
							],
							[
								20.76216,
								42.05186
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "KWT",
				"properties": {
					"name": "Kuwait"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								47.974519,
								29.975819
							],
							[
								48.183189,
								29.534477
							],
							[
								48.093943,
								29.306299
							],
							[
								48.416094,
								28.552004
							],
							[
								47.708851,
								28.526063
							],
							[
								47.459822,
								29.002519
							],
							[
								46.568713,
								29.099025
							],
							[
								47.302622,
								30.05907
							],
							[
								47.974519,
								29.975819
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LAO",
				"properties": {
					"name": "Laos"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								105.218777,
								14.273212
							],
							[
								105.544338,
								14.723934
							],
							[
								105.589039,
								15.570316
							],
							[
								104.779321,
								16.441865
							],
							[
								104.716947,
								17.428859
							],
							[
								103.956477,
								18.240954
							],
							[
								103.200192,
								18.309632
							],
							[
								102.998706,
								17.961695
							],
							[
								102.413005,
								17.932782
							],
							[
								102.113592,
								18.109102
							],
							[
								101.059548,
								17.512497
							],
							[
								101.035931,
								18.408928
							],
							[
								101.282015,
								19.462585
							],
							[
								100.606294,
								19.508344
							],
							[
								100.548881,
								20.109238
							],
							[
								100.115988,
								20.41785
							],
							[
								100.329101,
								20.786122
							],
							[
								101.180005,
								21.436573
							],
							[
								101.270026,
								21.201652
							],
							[
								101.80312,
								21.174367
							],
							[
								101.652018,
								22.318199
							],
							[
								102.170436,
								22.464753
							],
							[
								102.754896,
								21.675137
							],
							[
								103.203861,
								20.766562
							],
							[
								104.435,
								20.758733
							],
							[
								104.822574,
								19.886642
							],
							[
								104.183388,
								19.624668
							],
							[
								103.896532,
								19.265181
							],
							[
								105.094598,
								18.666975
							],
							[
								105.925762,
								17.485315
							],
							[
								106.556008,
								16.604284
							],
							[
								107.312706,
								15.908538
							],
							[
								107.564525,
								15.202173
							],
							[
								107.382727,
								14.202441
							],
							[
								106.496373,
								14.570584
							],
							[
								106.043946,
								13.881091
							],
							[
								105.218777,
								14.273212
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LBN",
				"properties": {
					"name": "Lebanon"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								35.821101,
								33.277426
							],
							[
								35.552797,
								33.264275
							],
							[
								35.460709,
								33.08904
							],
							[
								35.126053,
								33.0909
							],
							[
								35.482207,
								33.90545
							],
							[
								35.979592,
								34.610058
							],
							[
								35.998403,
								34.644914
							],
							[
								36.448194,
								34.593935
							],
							[
								36.61175,
								34.201789
							],
							[
								36.06646,
								33.824912
							],
							[
								35.821101,
								33.277426
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LBR",
				"properties": {
					"name": "Liberia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-7.712159,
								4.364566
							],
							[
								-7.974107,
								4.355755
							],
							[
								-9.004794,
								4.832419
							],
							[
								-9.91342,
								5.593561
							],
							[
								-10.765384,
								6.140711
							],
							[
								-11.438779,
								6.785917
							],
							[
								-11.199802,
								7.105846
							],
							[
								-11.146704,
								7.396706
							],
							[
								-10.695595,
								7.939464
							],
							[
								-10.230094,
								8.406206
							],
							[
								-10.016567,
								8.428504
							],
							[
								-9.755342,
								8.541055
							],
							[
								-9.33728,
								7.928534
							],
							[
								-9.403348,
								7.526905
							],
							[
								-9.208786,
								7.313921
							],
							[
								-8.926065,
								7.309037
							],
							[
								-8.722124,
								7.711674
							],
							[
								-8.439298,
								7.686043
							],
							[
								-8.485446,
								7.395208
							],
							[
								-8.385452,
								6.911801
							],
							[
								-8.60288,
								6.467564
							],
							[
								-8.311348,
								6.193033
							],
							[
								-7.993693,
								6.12619
							],
							[
								-7.570153,
								5.707352
							],
							[
								-7.539715,
								5.313345
							],
							[
								-7.635368,
								5.188159
							],
							[
								-7.712159,
								4.364566
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LBY",
				"properties": {
					"name": "Libya"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								14.8513,
								22.86295
							],
							[
								14.143871,
								22.491289
							],
							[
								13.581425,
								23.040506
							],
							[
								11.999506,
								23.471668
							],
							[
								11.560669,
								24.097909
							],
							[
								10.771364,
								24.562532
							],
							[
								10.303847,
								24.379313
							],
							[
								9.948261,
								24.936954
							],
							[
								9.910693,
								25.365455
							],
							[
								9.319411,
								26.094325
							],
							[
								9.716286,
								26.512206
							],
							[
								9.629056,
								27.140953
							],
							[
								9.756128,
								27.688259
							],
							[
								9.683885,
								28.144174
							],
							[
								9.859998,
								28.95999
							],
							[
								9.805634,
								29.424638
							],
							[
								9.48214,
								30.307556
							],
							[
								9.970017,
								30.539325
							],
							[
								10.056575,
								30.961831
							],
							[
								9.950225,
								31.37607
							],
							[
								10.636901,
								31.761421
							],
							[
								10.94479,
								32.081815
							],
							[
								11.432253,
								32.368903
							],
							[
								11.488787,
								33.136996
							],
							[
								12.66331,
								32.79278
							],
							[
								13.08326,
								32.87882
							],
							[
								13.91868,
								32.71196
							],
							[
								15.24563,
								32.26508
							],
							[
								15.71394,
								31.37626
							],
							[
								16.61162,
								31.18218
							],
							[
								18.02109,
								30.76357
							],
							[
								19.08641,
								30.26639
							],
							[
								19.57404,
								30.52582
							],
							[
								20.05335,
								30.98576
							],
							[
								19.82033,
								31.75179
							],
							[
								20.13397,
								32.2382
							],
							[
								20.85452,
								32.7068
							],
							[
								21.54298,
								32.8432
							],
							[
								22.89576,
								32.63858
							],
							[
								23.2368,
								32.19149
							],
							[
								23.60913,
								32.18726
							],
							[
								23.9275,
								32.01667
							],
							[
								24.92114,
								31.89936
							],
							[
								25.16482,
								31.56915
							],
							[
								24.80287,
								31.08929
							],
							[
								24.95762,
								30.6616
							],
							[
								24.70007,
								30.04419
							],
							[
								25,
								29.238655
							],
							[
								25,
								25.6825
							],
							[
								25,
								22
							],
							[
								25,
								20.00304
							],
							[
								23.85,
								20
							],
							[
								23.83766,
								19.58047
							],
							[
								19.84926,
								21.49509
							],
							[
								15.86085,
								23.40972
							],
							[
								14.8513,
								22.86295
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LKA",
				"properties": {
					"name": "Sri Lanka"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								81.787959,
								7.523055
							],
							[
								81.637322,
								6.481775
							],
							[
								81.21802,
								6.197141
							],
							[
								80.348357,
								5.96837
							],
							[
								79.872469,
								6.763463
							],
							[
								79.695167,
								8.200843
							],
							[
								80.147801,
								9.824078
							],
							[
								80.838818,
								9.268427
							],
							[
								81.304319,
								8.564206
							],
							[
								81.787959,
								7.523055
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LSO",
				"properties": {
					"name": "Lesotho"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								28.978263,
								-28.955597
							],
							[
								29.325166,
								-29.257387
							],
							[
								29.018415,
								-29.743766
							],
							[
								28.8484,
								-30.070051
							],
							[
								28.291069,
								-30.226217
							],
							[
								28.107205,
								-30.545732
							],
							[
								27.749397,
								-30.645106
							],
							[
								26.999262,
								-29.875954
							],
							[
								27.532511,
								-29.242711
							],
							[
								28.074338,
								-28.851469
							],
							[
								28.5417,
								-28.647502
							],
							[
								28.978263,
								-28.955597
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LTU",
				"properties": {
					"name": "Lithuania"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								22.731099,
								54.327537
							],
							[
								22.651052,
								54.582741
							],
							[
								22.757764,
								54.856574
							],
							[
								22.315724,
								55.015299
							],
							[
								21.268449,
								55.190482
							],
							[
								21.0558,
								56.031076
							],
							[
								22.201157,
								56.337802
							],
							[
								23.878264,
								56.273671
							],
							[
								24.860684,
								56.372528
							],
							[
								25.000934,
								56.164531
							],
							[
								25.533047,
								56.100297
							],
							[
								26.494331,
								55.615107
							],
							[
								26.588279,
								55.167176
							],
							[
								25.768433,
								54.846963
							],
							[
								25.536354,
								54.282423
							],
							[
								24.450684,
								53.905702
							],
							[
								23.484128,
								53.912498
							],
							[
								23.243987,
								54.220567
							],
							[
								22.731099,
								54.327537
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LUX",
				"properties": {
					"name": "Luxembourg"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								6.043073,
								50.128052
							],
							[
								6.242751,
								49.902226
							],
							[
								6.18632,
								49.463803
							],
							[
								5.897759,
								49.442667
							],
							[
								5.674052,
								49.529484
							],
							[
								5.782417,
								50.090328
							],
							[
								6.043073,
								50.128052
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "LVA",
				"properties": {
					"name": "Latvia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								21.0558,
								56.031076
							],
							[
								21.090424,
								56.783873
							],
							[
								21.581866,
								57.411871
							],
							[
								22.524341,
								57.753374
							],
							[
								23.318453,
								57.006236
							],
							[
								24.12073,
								57.025693
							],
							[
								24.312863,
								57.793424
							],
							[
								25.164594,
								57.970157
							],
							[
								25.60281,
								57.847529
							],
							[
								26.463532,
								57.476389
							],
							[
								27.288185,
								57.474528
							],
							[
								27.770016,
								57.244258
							],
							[
								27.855282,
								56.759326
							],
							[
								28.176709,
								56.16913
							],
							[
								27.10246,
								55.783314
							],
							[
								26.494331,
								55.615107
							],
							[
								25.533047,
								56.100297
							],
							[
								25.000934,
								56.164531
							],
							[
								24.860684,
								56.372528
							],
							[
								23.878264,
								56.273671
							],
							[
								22.201157,
								56.337802
							],
							[
								21.0558,
								56.031076
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MAR",
				"properties": {
					"name": "Morocco"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-5.193863,
								35.755182
							],
							[
								-4.591006,
								35.330712
							],
							[
								-3.640057,
								35.399855
							],
							[
								-2.604306,
								35.179093
							],
							[
								-2.169914,
								35.168396
							],
							[
								-1.792986,
								34.527919
							],
							[
								-1.733455,
								33.919713
							],
							[
								-1.388049,
								32.864015
							],
							[
								-1.124551,
								32.651522
							],
							[
								-1.307899,
								32.262889
							],
							[
								-2.616605,
								32.094346
							],
							[
								-3.06898,
								31.724498
							],
							[
								-3.647498,
								31.637294
							],
							[
								-3.690441,
								30.896952
							],
							[
								-4.859646,
								30.501188
							],
							[
								-5.242129,
								30.000443
							],
							[
								-6.060632,
								29.7317
							],
							[
								-7.059228,
								29.579228
							],
							[
								-8.674116,
								28.841289
							],
							[
								-8.66559,
								27.656426
							],
							[
								-8.817809,
								27.656426
							],
							[
								-8.817828,
								27.656426
							],
							[
								-8.794884,
								27.120696
							],
							[
								-9.413037,
								27.088476
							],
							[
								-9.735343,
								26.860945
							],
							[
								-10.189424,
								26.860945
							],
							[
								-10.551263,
								26.990808
							],
							[
								-11.392555,
								26.883424
							],
							[
								-11.71822,
								26.104092
							],
							[
								-12.030759,
								26.030866
							],
							[
								-12.500963,
								24.770116
							],
							[
								-13.89111,
								23.691009
							],
							[
								-14.221168,
								22.310163
							],
							[
								-14.630833,
								21.86094
							],
							[
								-14.750955,
								21.5006
							],
							[
								-17.002962,
								21.420734
							],
							[
								-17.020428,
								21.42231
							],
							[
								-16.973248,
								21.885745
							],
							[
								-16.589137,
								22.158234
							],
							[
								-16.261922,
								22.67934
							],
							[
								-16.326414,
								23.017768
							],
							[
								-15.982611,
								23.723358
							],
							[
								-15.426004,
								24.359134
							],
							[
								-15.089332,
								24.520261
							],
							[
								-14.824645,
								25.103533
							],
							[
								-14.800926,
								25.636265
							],
							[
								-14.43994,
								26.254418
							],
							[
								-13.773805,
								26.618892
							],
							[
								-13.139942,
								27.640148
							],
							[
								-13.121613,
								27.654148
							],
							[
								-12.618837,
								28.038186
							],
							[
								-11.688919,
								28.148644
							],
							[
								-10.900957,
								28.832142
							],
							[
								-10.399592,
								29.098586
							],
							[
								-9.564811,
								29.933574
							],
							[
								-9.814718,
								31.177736
							],
							[
								-9.434793,
								32.038096
							],
							[
								-9.300693,
								32.564679
							],
							[
								-8.657476,
								33.240245
							],
							[
								-7.654178,
								33.697065
							],
							[
								-6.912544,
								34.110476
							],
							[
								-6.244342,
								35.145865
							],
							[
								-5.929994,
								35.759988
							],
							[
								-5.193863,
								35.755182
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MDA",
				"properties": {
					"name": "Moldova"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								26.619337,
								48.220726
							],
							[
								26.857824,
								48.368211
							],
							[
								27.522537,
								48.467119
							],
							[
								28.259547,
								48.155562
							],
							[
								28.670891,
								48.118149
							],
							[
								29.122698,
								47.849095
							],
							[
								29.050868,
								47.510227
							],
							[
								29.415135,
								47.346645
							],
							[
								29.559674,
								46.928583
							],
							[
								29.908852,
								46.674361
							],
							[
								29.83821,
								46.525326
							],
							[
								30.024659,
								46.423937
							],
							[
								29.759972,
								46.349988
							],
							[
								29.170654,
								46.379262
							],
							[
								29.072107,
								46.517678
							],
							[
								28.862972,
								46.437889
							],
							[
								28.933717,
								46.25883
							],
							[
								28.659987,
								45.939987
							],
							[
								28.485269,
								45.596907
							],
							[
								28.233554,
								45.488283
							],
							[
								28.054443,
								45.944586
							],
							[
								28.160018,
								46.371563
							],
							[
								28.12803,
								46.810476
							],
							[
								27.551166,
								47.405117
							],
							[
								27.233873,
								47.826771
							],
							[
								26.924176,
								48.123264
							],
							[
								26.619337,
								48.220726
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MDG",
				"properties": {
					"name": "Madagascar"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								49.543519,
								-12.469833
							],
							[
								49.808981,
								-12.895285
							],
							[
								50.056511,
								-13.555761
							],
							[
								50.217431,
								-14.758789
							],
							[
								50.476537,
								-15.226512
							],
							[
								50.377111,
								-15.706069
							],
							[
								50.200275,
								-16.000263
							],
							[
								49.860606,
								-15.414253
							],
							[
								49.672607,
								-15.710204
							],
							[
								49.863344,
								-16.451037
							],
							[
								49.774564,
								-16.875042
							],
							[
								49.498612,
								-17.106036
							],
							[
								49.435619,
								-17.953064
							],
							[
								49.041792,
								-19.118781
							],
							[
								48.548541,
								-20.496888
							],
							[
								47.930749,
								-22.391501
							],
							[
								47.547723,
								-23.781959
							],
							[
								47.095761,
								-24.94163
							],
							[
								46.282478,
								-25.178463
							],
							[
								45.409508,
								-25.601434
							],
							[
								44.833574,
								-25.346101
							],
							[
								44.03972,
								-24.988345
							],
							[
								43.763768,
								-24.460677
							],
							[
								43.697778,
								-23.574116
							],
							[
								43.345654,
								-22.776904
							],
							[
								43.254187,
								-22.057413
							],
							[
								43.433298,
								-21.336475
							],
							[
								43.893683,
								-21.163307
							],
							[
								43.89637,
								-20.830459
							],
							[
								44.374325,
								-20.072366
							],
							[
								44.464397,
								-19.435454
							],
							[
								44.232422,
								-18.961995
							],
							[
								44.042976,
								-18.331387
							],
							[
								43.963084,
								-17.409945
							],
							[
								44.312469,
								-16.850496
							],
							[
								44.446517,
								-16.216219
							],
							[
								44.944937,
								-16.179374
							],
							[
								45.502732,
								-15.974373
							],
							[
								45.872994,
								-15.793454
							],
							[
								46.312243,
								-15.780018
							],
							[
								46.882183,
								-15.210182
							],
							[
								47.70513,
								-14.594303
							],
							[
								48.005215,
								-14.091233
							],
							[
								47.869047,
								-13.663869
							],
							[
								48.293828,
								-13.784068
							],
							[
								48.84506,
								-13.089175
							],
							[
								48.863509,
								-12.487868
							],
							[
								49.194651,
								-12.040557
							],
							[
								49.543519,
								-12.469833
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MEX",
				"properties": {
					"name": "Mexico"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-97.140008,
								25.869997
							],
							[
								-97.528072,
								24.992144
							],
							[
								-97.702946,
								24.272343
							],
							[
								-97.776042,
								22.93258
							],
							[
								-97.872367,
								22.444212
							],
							[
								-97.699044,
								21.898689
							],
							[
								-97.38896,
								21.411019
							],
							[
								-97.189333,
								20.635433
							],
							[
								-96.525576,
								19.890931
							],
							[
								-96.292127,
								19.320371
							],
							[
								-95.900885,
								18.828024
							],
							[
								-94.839063,
								18.562717
							],
							[
								-94.42573,
								18.144371
							],
							[
								-93.548651,
								18.423837
							],
							[
								-92.786114,
								18.524839
							],
							[
								-92.037348,
								18.704569
							],
							[
								-91.407903,
								18.876083
							],
							[
								-90.77187,
								19.28412
							],
							[
								-90.53359,
								19.867418
							],
							[
								-90.451476,
								20.707522
							],
							[
								-90.278618,
								20.999855
							],
							[
								-89.601321,
								21.261726
							],
							[
								-88.543866,
								21.493675
							],
							[
								-87.658417,
								21.458846
							],
							[
								-87.05189,
								21.543543
							],
							[
								-86.811982,
								21.331515
							],
							[
								-86.845908,
								20.849865
							],
							[
								-87.383291,
								20.255405
							],
							[
								-87.621054,
								19.646553
							],
							[
								-87.43675,
								19.472403
							],
							[
								-87.58656,
								19.04013
							],
							[
								-87.837191,
								18.259816
							],
							[
								-88.090664,
								18.516648
							],
							[
								-88.300031,
								18.499982
							],
							[
								-88.490123,
								18.486831
							],
							[
								-88.848344,
								17.883198
							],
							[
								-89.029857,
								18.001511
							],
							[
								-89.150909,
								17.955468
							],
							[
								-89.14308,
								17.808319
							],
							[
								-90.067934,
								17.819326
							],
							[
								-91.00152,
								17.817595
							],
							[
								-91.002269,
								17.254658
							],
							[
								-91.453921,
								17.252177
							],
							[
								-91.08167,
								16.918477
							],
							[
								-90.711822,
								16.687483
							],
							[
								-90.600847,
								16.470778
							],
							[
								-90.438867,
								16.41011
							],
							[
								-90.464473,
								16.069562
							],
							[
								-91.74796,
								16.066565
							],
							[
								-92.229249,
								15.251447
							],
							[
								-92.087216,
								15.064585
							],
							[
								-92.20323,
								14.830103
							],
							[
								-92.22775,
								14.538829
							],
							[
								-93.359464,
								15.61543
							],
							[
								-93.875169,
								15.940164
							],
							[
								-94.691656,
								16.200975
							],
							[
								-95.250227,
								16.128318
							],
							[
								-96.053382,
								15.752088
							],
							[
								-96.557434,
								15.653515
							],
							[
								-97.263592,
								15.917065
							],
							[
								-98.01303,
								16.107312
							],
							[
								-98.947676,
								16.566043
							],
							[
								-99.697397,
								16.706164
							],
							[
								-100.829499,
								17.171071
							],
							[
								-101.666089,
								17.649026
							],
							[
								-101.918528,
								17.91609
							],
							[
								-102.478132,
								17.975751
							],
							[
								-103.50099,
								18.292295
							],
							[
								-103.917527,
								18.748572
							],
							[
								-104.99201,
								19.316134
							],
							[
								-105.493038,
								19.946767
							],
							[
								-105.731396,
								20.434102
							],
							[
								-105.397773,
								20.531719
							],
							[
								-105.500661,
								20.816895
							],
							[
								-105.270752,
								21.076285
							],
							[
								-105.265817,
								21.422104
							],
							[
								-105.603161,
								21.871146
							],
							[
								-105.693414,
								22.26908
							],
							[
								-106.028716,
								22.773752
							],
							[
								-106.90998,
								23.767774
							],
							[
								-107.915449,
								24.548915
							],
							[
								-108.401905,
								25.172314
							],
							[
								-109.260199,
								25.580609
							],
							[
								-109.444089,
								25.824884
							],
							[
								-109.291644,
								26.442934
							],
							[
								-109.801458,
								26.676176
							],
							[
								-110.391732,
								27.162115
							],
							[
								-110.641019,
								27.859876
							],
							[
								-111.178919,
								27.941241
							],
							[
								-111.759607,
								28.467953
							],
							[
								-112.228235,
								28.954409
							],
							[
								-112.271824,
								29.266844
							],
							[
								-112.809594,
								30.021114
							],
							[
								-113.163811,
								30.786881
							],
							[
								-113.148669,
								31.170966
							],
							[
								-113.871881,
								31.567608
							],
							[
								-114.205737,
								31.524045
							],
							[
								-114.776451,
								31.799532
							],
							[
								-114.9367,
								31.393485
							],
							[
								-114.771232,
								30.913617
							],
							[
								-114.673899,
								30.162681
							],
							[
								-114.330974,
								29.750432
							],
							[
								-113.588875,
								29.061611
							],
							[
								-113.424053,
								28.826174
							],
							[
								-113.271969,
								28.754783
							],
							[
								-113.140039,
								28.411289
							],
							[
								-112.962298,
								28.42519
							],
							[
								-112.761587,
								27.780217
							],
							[
								-112.457911,
								27.525814
							],
							[
								-112.244952,
								27.171727
							],
							[
								-111.616489,
								26.662817
							],
							[
								-111.284675,
								25.73259
							],
							[
								-110.987819,
								25.294606
							],
							[
								-110.710007,
								24.826004
							],
							[
								-110.655049,
								24.298595
							],
							[
								-110.172856,
								24.265548
							],
							[
								-109.771847,
								23.811183
							],
							[
								-109.409104,
								23.364672
							],
							[
								-109.433392,
								23.185588
							],
							[
								-109.854219,
								22.818272
							],
							[
								-110.031392,
								22.823078
							],
							[
								-110.295071,
								23.430973
							],
							[
								-110.949501,
								24.000964
							],
							[
								-111.670568,
								24.484423
							],
							[
								-112.182036,
								24.738413
							],
							[
								-112.148989,
								25.470125
							],
							[
								-112.300711,
								26.012004
							],
							[
								-112.777297,
								26.32196
							],
							[
								-113.464671,
								26.768186
							],
							[
								-113.59673,
								26.63946
							],
							[
								-113.848937,
								26.900064
							],
							[
								-114.465747,
								27.14209
							],
							[
								-115.055142,
								27.722727
							],
							[
								-114.982253,
								27.7982
							],
							[
								-114.570366,
								27.741485
							],
							[
								-114.199329,
								28.115003
							],
							[
								-114.162018,
								28.566112
							],
							[
								-114.931842,
								29.279479
							],
							[
								-115.518654,
								29.556362
							],
							[
								-115.887365,
								30.180794
							],
							[
								-116.25835,
								30.836464
							],
							[
								-116.721526,
								31.635744
							],
							[
								-117.12776,
								32.53534
							],
							[
								-115.99135,
								32.61239
							],
							[
								-114.72139,
								32.72083
							],
							[
								-114.815,
								32.52528
							],
							[
								-113.30498,
								32.03914
							],
							[
								-111.02361,
								31.33472
							],
							[
								-109.035,
								31.34194
							],
							[
								-108.24194,
								31.34222
							],
							[
								-108.24,
								31.754854
							],
							[
								-106.50759,
								31.75452
							],
							[
								-106.1429,
								31.39995
							],
							[
								-105.63159,
								31.08383
							],
							[
								-105.03737,
								30.64402
							],
							[
								-104.70575,
								30.12173
							],
							[
								-104.45697,
								29.57196
							],
							[
								-103.94,
								29.27
							],
							[
								-103.11,
								28.97
							],
							[
								-102.48,
								29.76
							],
							[
								-101.6624,
								29.7793
							],
							[
								-100.9576,
								29.38071
							],
							[
								-100.45584,
								28.69612
							],
							[
								-100.11,
								28.11
							],
							[
								-99.52,
								27.54
							],
							[
								-99.3,
								26.84
							],
							[
								-99.02,
								26.37
							],
							[
								-98.24,
								26.06
							],
							[
								-97.53,
								25.84
							],
							[
								-97.140008,
								25.869997
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MKD",
				"properties": {
					"name": "Macedonia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								20.59023,
								41.85541
							],
							[
								20.71731,
								41.84711
							],
							[
								20.76216,
								42.05186
							],
							[
								21.3527,
								42.2068
							],
							[
								21.576636,
								42.245224
							],
							[
								21.91708,
								42.30364
							],
							[
								22.380526,
								42.32026
							],
							[
								22.881374,
								41.999297
							],
							[
								22.952377,
								41.337994
							],
							[
								22.76177,
								41.3048
							],
							[
								22.597308,
								41.130487
							],
							[
								22.055378,
								41.149866
							],
							[
								21.674161,
								40.931275
							],
							[
								21.02004,
								40.842727
							],
							[
								20.60518,
								41.08622
							],
							[
								20.46315,
								41.51509
							],
							[
								20.59023,
								41.85541
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MLI",
				"properties": {
					"name": "Mali"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-12.17075,
								14.616834
							],
							[
								-11.834208,
								14.799097
							],
							[
								-11.666078,
								15.388208
							],
							[
								-11.349095,
								15.411256
							],
							[
								-10.650791,
								15.132746
							],
							[
								-10.086846,
								15.330486
							],
							[
								-9.700255,
								15.264107
							],
							[
								-9.550238,
								15.486497
							],
							[
								-5.537744,
								15.50169
							],
							[
								-5.315277,
								16.201854
							],
							[
								-5.488523,
								16.325102
							],
							[
								-5.971129,
								20.640833
							],
							[
								-6.453787,
								24.956591
							],
							[
								-4.923337,
								24.974574
							],
							[
								-1.550055,
								22.792666
							],
							[
								1.823228,
								20.610809
							],
							[
								2.060991,
								20.142233
							],
							[
								2.683588,
								19.85623
							],
							[
								3.146661,
								19.693579
							],
							[
								3.158133,
								19.057364
							],
							[
								4.267419,
								19.155265
							],
							[
								4.27021,
								16.852227
							],
							[
								3.723422,
								16.184284
							],
							[
								3.638259,
								15.56812
							],
							[
								2.749993,
								15.409525
							],
							[
								1.385528,
								15.323561
							],
							[
								1.015783,
								14.968182
							],
							[
								0.374892,
								14.928908
							],
							[
								-0.266257,
								14.924309
							],
							[
								-0.515854,
								15.116158
							],
							[
								-1.066363,
								14.973815
							],
							[
								-2.001035,
								14.559008
							],
							[
								-2.191825,
								14.246418
							],
							[
								-2.967694,
								13.79815
							],
							[
								-3.103707,
								13.541267
							],
							[
								-3.522803,
								13.337662
							],
							[
								-4.006391,
								13.472485
							],
							[
								-4.280405,
								13.228444
							],
							[
								-4.427166,
								12.542646
							],
							[
								-5.220942,
								11.713859
							],
							[
								-5.197843,
								11.375146
							],
							[
								-5.470565,
								10.95127
							],
							[
								-5.404342,
								10.370737
							],
							[
								-5.816926,
								10.222555
							],
							[
								-6.050452,
								10.096361
							],
							[
								-6.205223,
								10.524061
							],
							[
								-6.493965,
								10.411303
							],
							[
								-6.666461,
								10.430811
							],
							[
								-6.850507,
								10.138994
							],
							[
								-7.622759,
								10.147236
							],
							[
								-7.89959,
								10.297382
							],
							[
								-8.029944,
								10.206535
							],
							[
								-8.335377,
								10.494812
							],
							[
								-8.282357,
								10.792597
							],
							[
								-8.407311,
								10.909257
							],
							[
								-8.620321,
								10.810891
							],
							[
								-8.581305,
								11.136246
							],
							[
								-8.376305,
								11.393646
							],
							[
								-8.786099,
								11.812561
							],
							[
								-8.905265,
								12.088358
							],
							[
								-9.127474,
								12.30806
							],
							[
								-9.327616,
								12.334286
							],
							[
								-9.567912,
								12.194243
							],
							[
								-9.890993,
								12.060479
							],
							[
								-10.165214,
								11.844084
							],
							[
								-10.593224,
								11.923975
							],
							[
								-10.87083,
								12.177887
							],
							[
								-11.036556,
								12.211245
							],
							[
								-11.297574,
								12.077971
							],
							[
								-11.456169,
								12.076834
							],
							[
								-11.513943,
								12.442988
							],
							[
								-11.467899,
								12.754519
							],
							[
								-11.553398,
								13.141214
							],
							[
								-11.927716,
								13.422075
							],
							[
								-12.124887,
								13.994727
							],
							[
								-12.17075,
								14.616834
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MLT",
				"properties": {
					"name": "Malta"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									14.566171,
									35.852721
								],
								[
									14.532684,
									35.820191
								],
								[
									14.436463,
									35.821664
								],
								[
									14.352334,
									35.872281
								],
								[
									14.3513,
									35.978399
								],
								[
									14.448348,
									35.957444
								],
								[
									14.537025,
									35.886285
								],
								[
									14.566171,
									35.852721
								]
							]
						],
						[
							[
								[
									14.313473,
									36.027569
								],
								[
									14.253632,
									36.012143
								],
								[
									14.194204,
									36.042245
								],
								[
									14.180354,
									36.060383
								],
								[
									14.263243,
									36.075809
								],
								[
									14.303758,
									36.062295
								],
								[
									14.320914,
									36.03625
								],
								[
									14.313473,
									36.027569
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MMR",
				"properties": {
					"name": "Myanmar"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								99.543309,
								20.186598
							],
							[
								98.959676,
								19.752981
							],
							[
								98.253724,
								19.708203
							],
							[
								97.797783,
								18.62708
							],
							[
								97.375896,
								18.445438
							],
							[
								97.859123,
								17.567946
							],
							[
								98.493761,
								16.837836
							],
							[
								98.903348,
								16.177824
							],
							[
								98.537376,
								15.308497
							],
							[
								98.192074,
								15.123703
							],
							[
								98.430819,
								14.622028
							],
							[
								99.097755,
								13.827503
							],
							[
								99.212012,
								13.269294
							],
							[
								99.196354,
								12.804748
							],
							[
								99.587286,
								11.892763
							],
							[
								99.038121,
								10.960546
							],
							[
								98.553551,
								9.93296
							],
							[
								98.457174,
								10.675266
							],
							[
								98.764546,
								11.441292
							],
							[
								98.428339,
								12.032987
							],
							[
								98.509574,
								13.122378
							],
							[
								98.103604,
								13.64046
							],
							[
								97.777732,
								14.837286
							],
							[
								97.597072,
								16.100568
							],
							[
								97.16454,
								16.928734
							],
							[
								96.505769,
								16.427241
							],
							[
								95.369352,
								15.71439
							],
							[
								94.808405,
								15.803454
							],
							[
								94.188804,
								16.037936
							],
							[
								94.533486,
								17.27724
							],
							[
								94.324817,
								18.213514
							],
							[
								93.540988,
								19.366493
							],
							[
								93.663255,
								19.726962
							],
							[
								93.078278,
								19.855145
							],
							[
								92.368554,
								20.670883
							],
							[
								92.303234,
								21.475485
							],
							[
								92.652257,
								21.324048
							],
							[
								92.672721,
								22.041239
							],
							[
								93.166128,
								22.27846
							],
							[
								93.060294,
								22.703111
							],
							[
								93.286327,
								23.043658
							],
							[
								93.325188,
								24.078556
							],
							[
								94.106742,
								23.850741
							],
							[
								94.552658,
								24.675238
							],
							[
								94.603249,
								25.162495
							],
							[
								95.155153,
								26.001307
							],
							[
								95.124768,
								26.573572
							],
							[
								96.419366,
								27.264589
							],
							[
								97.133999,
								27.083774
							],
							[
								97.051989,
								27.699059
							],
							[
								97.402561,
								27.882536
							],
							[
								97.327114,
								28.261583
							],
							[
								97.911988,
								28.335945
							],
							[
								98.246231,
								27.747221
							],
							[
								98.68269,
								27.508812
							],
							[
								98.712094,
								26.743536
							],
							[
								98.671838,
								25.918703
							],
							[
								97.724609,
								25.083637
							],
							[
								97.60472,
								23.897405
							],
							[
								98.660262,
								24.063286
							],
							[
								98.898749,
								23.142722
							],
							[
								99.531992,
								22.949039
							],
							[
								99.240899,
								22.118314
							],
							[
								99.983489,
								21.742937
							],
							[
								100.416538,
								21.558839
							],
							[
								101.150033,
								21.849984
							],
							[
								101.180005,
								21.436573
							],
							[
								100.329101,
								20.786122
							],
							[
								100.115988,
								20.41785
							],
							[
								99.543309,
								20.186598
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MNE",
				"properties": {
					"name": "Montenegro"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								19.801613,
								42.500093
							],
							[
								19.738051,
								42.688247
							],
							[
								19.30449,
								42.19574
							],
							[
								19.37177,
								41.87755
							],
							[
								19.16246,
								41.95502
							],
							[
								18.88214,
								42.28151
							],
							[
								18.45,
								42.48
							],
							[
								18.56,
								42.65
							],
							[
								18.70648,
								43.20011
							],
							[
								19.03165,
								43.43253
							],
							[
								19.21852,
								43.52384
							],
							[
								19.48389,
								43.35229
							],
							[
								19.63,
								43.21378
							],
							[
								19.95857,
								43.10604
							],
							[
								20.3398,
								42.89852
							],
							[
								20.25758,
								42.81275
							],
							[
								20.0707,
								42.58863
							],
							[
								19.801613,
								42.500093
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MNG",
				"properties": {
					"name": "Mongolia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								87.751264,
								49.297198
							],
							[
								88.805567,
								49.470521
							],
							[
								90.713667,
								50.331812
							],
							[
								92.234712,
								50.802171
							],
							[
								93.104219,
								50.49529
							],
							[
								94.147566,
								50.480537
							],
							[
								94.815949,
								50.013433
							],
							[
								95.814028,
								49.977467
							],
							[
								97.259728,
								49.726061
							],
							[
								98.231762,
								50.422401
							],
							[
								97.82574,
								51.010995
							],
							[
								98.861491,
								52.047366
							],
							[
								99.981732,
								51.634006
							],
							[
								100.88948,
								51.516856
							],
							[
								102.065223,
								51.259921
							],
							[
								102.255909,
								50.510561
							],
							[
								103.676545,
								50.089966
							],
							[
								104.621552,
								50.275329
							],
							[
								105.886591,
								50.406019
							],
							[
								106.888804,
								50.274296
							],
							[
								107.868176,
								49.793705
							],
							[
								108.475167,
								49.282548
							],
							[
								109.402449,
								49.292961
							],
							[
								110.662011,
								49.130128
							],
							[
								111.581231,
								49.377968
							],
							[
								112.89774,
								49.543565
							],
							[
								114.362456,
								50.248303
							],
							[
								114.96211,
								50.140247
							],
							[
								115.485695,
								49.805177
							],
							[
								116.678801,
								49.888531
							],
							[
								116.191802,
								49.134598
							],
							[
								115.485282,
								48.135383
							],
							[
								115.742837,
								47.726545
							],
							[
								116.308953,
								47.85341
							],
							[
								117.295507,
								47.697709
							],
							[
								118.064143,
								48.06673
							],
							[
								118.866574,
								47.74706
							],
							[
								119.772824,
								47.048059
							],
							[
								119.66327,
								46.69268
							],
							[
								118.874326,
								46.805412
							],
							[
								117.421701,
								46.672733
							],
							[
								116.717868,
								46.388202
							],
							[
								115.985096,
								45.727235
							],
							[
								114.460332,
								45.339817
							],
							[
								113.463907,
								44.808893
							],
							[
								112.436062,
								45.011646
							],
							[
								111.873306,
								45.102079
							],
							[
								111.348377,
								44.457442
							],
							[
								111.667737,
								44.073176
							],
							[
								111.829588,
								43.743118
							],
							[
								111.129682,
								43.406834
							],
							[
								110.412103,
								42.871234
							],
							[
								109.243596,
								42.519446
							],
							[
								107.744773,
								42.481516
							],
							[
								106.129316,
								42.134328
							],
							[
								104.964994,
								41.59741
							],
							[
								104.522282,
								41.908347
							],
							[
								103.312278,
								41.907468
							],
							[
								101.83304,
								42.514873
							],
							[
								100.845866,
								42.663804
							],
							[
								99.515817,
								42.524691
							],
							[
								97.451757,
								42.74889
							],
							[
								96.349396,
								42.725635
							],
							[
								95.762455,
								43.319449
							],
							[
								95.306875,
								44.241331
							],
							[
								94.688929,
								44.352332
							],
							[
								93.480734,
								44.975472
							],
							[
								92.133891,
								45.115076
							],
							[
								90.94554,
								45.286073
							],
							[
								90.585768,
								45.719716
							],
							[
								90.970809,
								46.888146
							],
							[
								90.280826,
								47.693549
							],
							[
								88.854298,
								48.069082
							],
							[
								88.013832,
								48.599463
							],
							[
								87.751264,
								49.297198
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MOZ",
				"properties": {
					"name": "Mozambique"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								34.559989,
								-11.52002
							],
							[
								35.312398,
								-11.439146
							],
							[
								36.514082,
								-11.720938
							],
							[
								36.775151,
								-11.594537
							],
							[
								37.471284,
								-11.568751
							],
							[
								37.827645,
								-11.268769
							],
							[
								38.427557,
								-11.285202
							],
							[
								39.52103,
								-10.896854
							],
							[
								40.316589,
								-10.317096
							],
							[
								40.478387,
								-10.765441
							],
							[
								40.437253,
								-11.761711
							],
							[
								40.560811,
								-12.639177
							],
							[
								40.59962,
								-14.201975
							],
							[
								40.775475,
								-14.691764
							],
							[
								40.477251,
								-15.406294
							],
							[
								40.089264,
								-16.100774
							],
							[
								39.452559,
								-16.720891
							],
							[
								38.538351,
								-17.101023
							],
							[
								37.411133,
								-17.586368
							],
							[
								36.281279,
								-18.659688
							],
							[
								35.896497,
								-18.84226
							],
							[
								35.1984,
								-19.552811
							],
							[
								34.786383,
								-19.784012
							],
							[
								34.701893,
								-20.497043
							],
							[
								35.176127,
								-21.254361
							],
							[
								35.373428,
								-21.840837
							],
							[
								35.385848,
								-22.14
							],
							[
								35.562546,
								-22.09
							],
							[
								35.533935,
								-23.070788
							],
							[
								35.371774,
								-23.535359
							],
							[
								35.60747,
								-23.706563
							],
							[
								35.458746,
								-24.12261
							],
							[
								35.040735,
								-24.478351
							],
							[
								34.215824,
								-24.816314
							],
							[
								33.01321,
								-25.357573
							],
							[
								32.574632,
								-25.727318
							],
							[
								32.660363,
								-26.148584
							],
							[
								32.915955,
								-26.215867
							],
							[
								32.83012,
								-26.742192
							],
							[
								32.071665,
								-26.73382
							],
							[
								31.985779,
								-26.29178
							],
							[
								31.837778,
								-25.843332
							],
							[
								31.752408,
								-25.484284
							],
							[
								31.930589,
								-24.369417
							],
							[
								31.670398,
								-23.658969
							],
							[
								31.191409,
								-22.25151
							],
							[
								32.244988,
								-21.116489
							],
							[
								32.508693,
								-20.395292
							],
							[
								32.659743,
								-20.30429
							],
							[
								32.772708,
								-19.715592
							],
							[
								32.611994,
								-19.419383
							],
							[
								32.654886,
								-18.67209
							],
							[
								32.849861,
								-17.979057
							],
							[
								32.847639,
								-16.713398
							],
							[
								32.328239,
								-16.392074
							],
							[
								31.852041,
								-16.319417
							],
							[
								31.636498,
								-16.07199
							],
							[
								31.173064,
								-15.860944
							],
							[
								30.338955,
								-15.880839
							],
							[
								30.274256,
								-15.507787
							],
							[
								30.179481,
								-14.796099
							],
							[
								33.214025,
								-13.97186
							],
							[
								33.7897,
								-14.451831
							],
							[
								34.064825,
								-14.35995
							],
							[
								34.459633,
								-14.61301
							],
							[
								34.517666,
								-15.013709
							],
							[
								34.307291,
								-15.478641
							],
							[
								34.381292,
								-16.18356
							],
							[
								35.03381,
								-16.8013
							],
							[
								35.339063,
								-16.10744
							],
							[
								35.771905,
								-15.896859
							],
							[
								35.686845,
								-14.611046
							],
							[
								35.267956,
								-13.887834
							],
							[
								34.907151,
								-13.565425
							],
							[
								34.559989,
								-13.579998
							],
							[
								34.280006,
								-12.280025
							],
							[
								34.559989,
								-11.52002
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MRT",
				"properties": {
					"name": "Mauritania"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-12.17075,
								14.616834
							],
							[
								-12.830658,
								15.303692
							],
							[
								-13.435738,
								16.039383
							],
							[
								-14.099521,
								16.304302
							],
							[
								-14.577348,
								16.598264
							],
							[
								-15.135737,
								16.587282
							],
							[
								-15.623666,
								16.369337
							],
							[
								-16.12069,
								16.455663
							],
							[
								-16.463098,
								16.135036
							],
							[
								-16.549708,
								16.673892
							],
							[
								-16.270552,
								17.166963
							],
							[
								-16.146347,
								18.108482
							],
							[
								-16.256883,
								19.096716
							],
							[
								-16.377651,
								19.593817
							],
							[
								-16.277838,
								20.092521
							],
							[
								-16.536324,
								20.567866
							],
							[
								-17.063423,
								20.999752
							],
							[
								-16.845194,
								21.333323
							],
							[
								-12.929102,
								21.327071
							],
							[
								-13.118754,
								22.77122
							],
							[
								-12.874222,
								23.284832
							],
							[
								-11.937224,
								23.374594
							],
							[
								-11.969419,
								25.933353
							],
							[
								-8.687294,
								25.881056
							],
							[
								-8.6844,
								27.395744
							],
							[
								-4.923337,
								24.974574
							],
							[
								-6.453787,
								24.956591
							],
							[
								-5.971129,
								20.640833
							],
							[
								-5.488523,
								16.325102
							],
							[
								-5.315277,
								16.201854
							],
							[
								-5.537744,
								15.50169
							],
							[
								-9.550238,
								15.486497
							],
							[
								-9.700255,
								15.264107
							],
							[
								-10.086846,
								15.330486
							],
							[
								-10.650791,
								15.132746
							],
							[
								-11.349095,
								15.411256
							],
							[
								-11.666078,
								15.388208
							],
							[
								-11.834208,
								14.799097
							],
							[
								-12.17075,
								14.616834
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MWI",
				"properties": {
					"name": "Malawi"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								34.559989,
								-11.52002
							],
							[
								34.280006,
								-12.280025
							],
							[
								34.559989,
								-13.579998
							],
							[
								34.907151,
								-13.565425
							],
							[
								35.267956,
								-13.887834
							],
							[
								35.686845,
								-14.611046
							],
							[
								35.771905,
								-15.896859
							],
							[
								35.339063,
								-16.10744
							],
							[
								35.03381,
								-16.8013
							],
							[
								34.381292,
								-16.18356
							],
							[
								34.307291,
								-15.478641
							],
							[
								34.517666,
								-15.013709
							],
							[
								34.459633,
								-14.61301
							],
							[
								34.064825,
								-14.35995
							],
							[
								33.7897,
								-14.451831
							],
							[
								33.214025,
								-13.97186
							],
							[
								32.688165,
								-13.712858
							],
							[
								32.991764,
								-12.783871
							],
							[
								33.306422,
								-12.435778
							],
							[
								33.114289,
								-11.607198
							],
							[
								33.31531,
								-10.79655
							],
							[
								33.485688,
								-10.525559
							],
							[
								33.231388,
								-9.676722
							],
							[
								32.759375,
								-9.230599
							],
							[
								33.739729,
								-9.417151
							],
							[
								33.940838,
								-9.693674
							],
							[
								34.280006,
								-10.16
							],
							[
								34.559989,
								-11.52002
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "MYS",
				"properties": {
					"name": "Malaysia"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									101.075516,
									6.204867
								],
								[
									101.154219,
									5.691384
								],
								[
									101.814282,
									5.810808
								],
								[
									102.141187,
									6.221636
								],
								[
									102.371147,
									6.128205
								],
								[
									102.961705,
									5.524495
								],
								[
									103.381215,
									4.855001
								],
								[
									103.438575,
									4.181606
								],
								[
									103.332122,
									3.726698
								],
								[
									103.429429,
									3.382869
								],
								[
									103.502448,
									2.791019
								],
								[
									103.854674,
									2.515454
								],
								[
									104.247932,
									1.631141
								],
								[
									104.228811,
									1.293048
								],
								[
									103.519707,
									1.226334
								],
								[
									102.573615,
									1.967115
								],
								[
									101.390638,
									2.760814
								],
								[
									101.27354,
									3.270292
								],
								[
									100.695435,
									3.93914
								],
								[
									100.557408,
									4.76728
								],
								[
									100.196706,
									5.312493
								],
								[
									100.30626,
									6.040562
								],
								[
									100.085757,
									6.464489
								],
								[
									100.259596,
									6.642825
								],
								[
									101.075516,
									6.204867
								]
							]
						],
						[
							[
								[
									118.618321,
									4.478202
								],
								[
									117.882035,
									4.137551
								],
								[
									117.015214,
									4.306094
								],
								[
									115.865517,
									4.306559
								],
								[
									115.519078,
									3.169238
								],
								[
									115.134037,
									2.821482
								],
								[
									114.621355,
									1.430688
								],
								[
									113.80585,
									1.217549
								],
								[
									112.859809,
									1.49779
								],
								[
									112.380252,
									1.410121
								],
								[
									111.797548,
									0.904441
								],
								[
									111.159138,
									0.976478
								],
								[
									110.514061,
									0.773131
								],
								[
									109.830227,
									1.338136
								],
								[
									109.66326,
									2.006467
								],
								[
									110.396135,
									1.663775
								],
								[
									111.168853,
									1.850637
								],
								[
									111.370081,
									2.697303
								],
								[
									111.796928,
									2.885897
								],
								[
									112.995615,
									3.102395
								],
								[
									113.712935,
									3.893509
								],
								[
									114.204017,
									4.525874
								],
								[
									114.659596,
									4.007637
								],
								[
									114.869557,
									4.348314
								],
								[
									115.347461,
									4.316636
								],
								[
									115.4057,
									4.955228
								],
								[
									115.45071,
									5.44773
								],
								[
									116.220741,
									6.143191
								],
								[
									116.725103,
									6.924771
								],
								[
									117.129626,
									6.928053
								],
								[
									117.643393,
									6.422166
								],
								[
									117.689075,
									5.98749
								],
								[
									118.347691,
									5.708696
								],
								[
									119.181904,
									5.407836
								],
								[
									119.110694,
									5.016128
								],
								[
									118.439727,
									4.966519
								],
								[
									118.618321,
									4.478202
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NAM",
				"properties": {
					"name": "Namibia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								16.344977,
								-28.576705
							],
							[
								15.601818,
								-27.821247
							],
							[
								15.210472,
								-27.090956
							],
							[
								14.989711,
								-26.117372
							],
							[
								14.743214,
								-25.39292
							],
							[
								14.408144,
								-23.853014
							],
							[
								14.385717,
								-22.656653
							],
							[
								14.257714,
								-22.111208
							],
							[
								13.868642,
								-21.699037
							],
							[
								13.352498,
								-20.872834
							],
							[
								12.826845,
								-19.673166
							],
							[
								12.608564,
								-19.045349
							],
							[
								11.794919,
								-18.069129
							],
							[
								11.734199,
								-17.301889
							],
							[
								12.215461,
								-17.111668
							],
							[
								12.814081,
								-16.941343
							],
							[
								13.462362,
								-16.971212
							],
							[
								14.058501,
								-17.423381
							],
							[
								14.209707,
								-17.353101
							],
							[
								18.263309,
								-17.309951
							],
							[
								18.956187,
								-17.789095
							],
							[
								21.377176,
								-17.930636
							],
							[
								23.215048,
								-17.523116
							],
							[
								24.033862,
								-17.295843
							],
							[
								24.682349,
								-17.353411
							],
							[
								25.07695,
								-17.578823
							],
							[
								25.084443,
								-17.661816
							],
							[
								24.520705,
								-17.887125
							],
							[
								24.217365,
								-17.889347
							],
							[
								23.579006,
								-18.281261
							],
							[
								23.196858,
								-17.869038
							],
							[
								21.65504,
								-18.219146
							],
							[
								20.910641,
								-18.252219
							],
							[
								20.881134,
								-21.814327
							],
							[
								19.895458,
								-21.849157
							],
							[
								19.895768,
								-24.76779
							],
							[
								19.894734,
								-28.461105
							],
							[
								19.002127,
								-28.972443
							],
							[
								18.464899,
								-29.045462
							],
							[
								17.836152,
								-28.856378
							],
							[
								17.387497,
								-28.783514
							],
							[
								17.218929,
								-28.355943
							],
							[
								16.824017,
								-28.082162
							],
							[
								16.344977,
								-28.576705
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NCL",
				"properties": {
					"name": "New Caledonia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								165.77999,
								-21.080005
							],
							[
								166.599991,
								-21.700019
							],
							[
								167.120011,
								-22.159991
							],
							[
								166.740035,
								-22.399976
							],
							[
								166.189732,
								-22.129708
							],
							[
								165.474375,
								-21.679607
							],
							[
								164.829815,
								-21.14982
							],
							[
								164.167995,
								-20.444747
							],
							[
								164.029606,
								-20.105646
							],
							[
								164.459967,
								-20.120012
							],
							[
								165.020036,
								-20.459991
							],
							[
								165.460009,
								-20.800022
							],
							[
								165.77999,
								-21.080005
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NER",
				"properties": {
					"name": "Niger"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								2.154474,
								11.94015
							],
							[
								2.177108,
								12.625018
							],
							[
								1.024103,
								12.851826
							],
							[
								0.993046,
								13.33575
							],
							[
								0.429928,
								13.988733
							],
							[
								0.295646,
								14.444235
							],
							[
								0.374892,
								14.928908
							],
							[
								1.015783,
								14.968182
							],
							[
								1.385528,
								15.323561
							],
							[
								2.749993,
								15.409525
							],
							[
								3.638259,
								15.56812
							],
							[
								3.723422,
								16.184284
							],
							[
								4.27021,
								16.852227
							],
							[
								4.267419,
								19.155265
							],
							[
								5.677566,
								19.601207
							],
							[
								8.572893,
								21.565661
							],
							[
								11.999506,
								23.471668
							],
							[
								13.581425,
								23.040506
							],
							[
								14.143871,
								22.491289
							],
							[
								14.8513,
								22.86295
							],
							[
								15.096888,
								21.308519
							],
							[
								15.471077,
								21.048457
							],
							[
								15.487148,
								20.730415
							],
							[
								15.903247,
								20.387619
							],
							[
								15.685741,
								19.95718
							],
							[
								15.300441,
								17.92795
							],
							[
								15.247731,
								16.627306
							],
							[
								13.972202,
								15.684366
							],
							[
								13.540394,
								14.367134
							],
							[
								13.956699,
								13.996691
							],
							[
								13.954477,
								13.353449
							],
							[
								14.595781,
								13.330427
							],
							[
								14.495787,
								12.859396
							],
							[
								14.213531,
								12.802035
							],
							[
								14.181336,
								12.483657
							],
							[
								13.995353,
								12.461565
							],
							[
								13.318702,
								13.556356
							],
							[
								13.083987,
								13.596147
							],
							[
								12.302071,
								13.037189
							],
							[
								11.527803,
								13.32898
							],
							[
								10.989593,
								13.387323
							],
							[
								10.701032,
								13.246918
							],
							[
								10.114814,
								13.277252
							],
							[
								9.524928,
								12.851102
							],
							[
								9.014933,
								12.826659
							],
							[
								7.804671,
								13.343527
							],
							[
								7.330747,
								13.098038
							],
							[
								6.820442,
								13.115091
							],
							[
								6.445426,
								13.492768
							],
							[
								5.443058,
								13.865924
							],
							[
								4.368344,
								13.747482
							],
							[
								4.107946,
								13.531216
							],
							[
								3.967283,
								12.956109
							],
							[
								3.680634,
								12.552903
							],
							[
								3.61118,
								11.660167
							],
							[
								2.848643,
								12.235636
							],
							[
								2.490164,
								12.233052
							],
							[
								2.154474,
								11.94015
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NGA",
				"properties": {
					"name": "Nigeria"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								8.500288,
								4.771983
							],
							[
								7.462108,
								4.412108
							],
							[
								7.082596,
								4.464689
							],
							[
								6.698072,
								4.240594
							],
							[
								5.898173,
								4.262453
							],
							[
								5.362805,
								4.887971
							],
							[
								5.033574,
								5.611802
							],
							[
								4.325607,
								6.270651
							],
							[
								3.57418,
								6.2583
							],
							[
								2.691702,
								6.258817
							],
							[
								2.749063,
								7.870734
							],
							[
								2.723793,
								8.506845
							],
							[
								2.912308,
								9.137608
							],
							[
								3.220352,
								9.444153
							],
							[
								3.705438,
								10.06321
							],
							[
								3.60007,
								10.332186
							],
							[
								3.797112,
								10.734746
							],
							[
								3.572216,
								11.327939
							],
							[
								3.61118,
								11.660167
							],
							[
								3.680634,
								12.552903
							],
							[
								3.967283,
								12.956109
							],
							[
								4.107946,
								13.531216
							],
							[
								4.368344,
								13.747482
							],
							[
								5.443058,
								13.865924
							],
							[
								6.445426,
								13.492768
							],
							[
								6.820442,
								13.115091
							],
							[
								7.330747,
								13.098038
							],
							[
								7.804671,
								13.343527
							],
							[
								9.014933,
								12.826659
							],
							[
								9.524928,
								12.851102
							],
							[
								10.114814,
								13.277252
							],
							[
								10.701032,
								13.246918
							],
							[
								10.989593,
								13.387323
							],
							[
								11.527803,
								13.32898
							],
							[
								12.302071,
								13.037189
							],
							[
								13.083987,
								13.596147
							],
							[
								13.318702,
								13.556356
							],
							[
								13.995353,
								12.461565
							],
							[
								14.181336,
								12.483657
							],
							[
								14.577178,
								12.085361
							],
							[
								14.468192,
								11.904752
							],
							[
								14.415379,
								11.572369
							],
							[
								13.57295,
								10.798566
							],
							[
								13.308676,
								10.160362
							],
							[
								13.1676,
								9.640626
							],
							[
								12.955468,
								9.417772
							],
							[
								12.753672,
								8.717763
							],
							[
								12.218872,
								8.305824
							],
							[
								12.063946,
								7.799808
							],
							[
								11.839309,
								7.397042
							],
							[
								11.745774,
								6.981383
							],
							[
								11.058788,
								6.644427
							],
							[
								10.497375,
								7.055358
							],
							[
								10.118277,
								7.03877
							],
							[
								9.522706,
								6.453482
							],
							[
								9.233163,
								6.444491
							],
							[
								8.757533,
								5.479666
							],
							[
								8.500288,
								4.771983
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NIC",
				"properties": {
					"name": "Nicaragua"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-85.71254,
								11.088445
							],
							[
								-86.058488,
								11.403439
							],
							[
								-86.52585,
								11.806877
							],
							[
								-86.745992,
								12.143962
							],
							[
								-87.167516,
								12.458258
							],
							[
								-87.668493,
								12.90991
							],
							[
								-87.557467,
								13.064552
							],
							[
								-87.392386,
								12.914018
							],
							[
								-87.316654,
								12.984686
							],
							[
								-87.005769,
								13.025794
							],
							[
								-86.880557,
								13.254204
							],
							[
								-86.733822,
								13.263093
							],
							[
								-86.755087,
								13.754845
							],
							[
								-86.520708,
								13.778487
							],
							[
								-86.312142,
								13.771356
							],
							[
								-86.096264,
								14.038187
							],
							[
								-85.801295,
								13.836055
							],
							[
								-85.698665,
								13.960078
							],
							[
								-85.514413,
								14.079012
							],
							[
								-85.165365,
								14.35437
							],
							[
								-85.148751,
								14.560197
							],
							[
								-85.052787,
								14.551541
							],
							[
								-84.924501,
								14.790493
							],
							[
								-84.820037,
								14.819587
							],
							[
								-84.649582,
								14.666805
							],
							[
								-84.449336,
								14.621614
							],
							[
								-84.228342,
								14.748764
							],
							[
								-83.975721,
								14.749436
							],
							[
								-83.628585,
								14.880074
							],
							[
								-83.489989,
								15.016267
							],
							[
								-83.147219,
								14.995829
							],
							[
								-83.233234,
								14.899866
							],
							[
								-83.284162,
								14.676624
							],
							[
								-83.182126,
								14.310703
							],
							[
								-83.4125,
								13.970078
							],
							[
								-83.519832,
								13.567699
							],
							[
								-83.552207,
								13.127054
							],
							[
								-83.498515,
								12.869292
							],
							[
								-83.473323,
								12.419087
							],
							[
								-83.626104,
								12.32085
							],
							[
								-83.719613,
								11.893124
							],
							[
								-83.650858,
								11.629032
							],
							[
								-83.85547,
								11.373311
							],
							[
								-83.808936,
								11.103044
							],
							[
								-83.655612,
								10.938764
							],
							[
								-83.895054,
								10.726839
							],
							[
								-84.190179,
								10.79345
							],
							[
								-84.355931,
								10.999226
							],
							[
								-84.673069,
								11.082657
							],
							[
								-84.903003,
								10.952303
							],
							[
								-85.561852,
								11.217119
							],
							[
								-85.71254,
								11.088445
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NLD",
				"properties": {
					"name": "Netherlands"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								6.074183,
								53.510403
							],
							[
								6.90514,
								53.482162
							],
							[
								7.092053,
								53.144043
							],
							[
								6.84287,
								52.22844
							],
							[
								6.589397,
								51.852029
							],
							[
								5.988658,
								51.851616
							],
							[
								6.156658,
								50.803721
							],
							[
								5.606976,
								51.037298
							],
							[
								4.973991,
								51.475024
							],
							[
								4.047071,
								51.267259
							],
							[
								3.314971,
								51.345755
							],
							[
								3.830289,
								51.620545
							],
							[
								4.705997,
								53.091798
							],
							[
								6.074183,
								53.510403
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NOR",
				"properties": {
					"name": "Norway"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									28.165547,
									71.185474
								],
								[
									31.293418,
									70.453788
								],
								[
									30.005435,
									70.186259
								],
								[
									31.101079,
									69.55808
								],
								[
									29.399581,
									69.156916
								],
								[
									28.59193,
									69.064777
								],
								[
									29.015573,
									69.766491
								],
								[
									27.732292,
									70.164193
								],
								[
									26.179622,
									69.825299
								],
								[
									25.689213,
									69.092114
								],
								[
									24.735679,
									68.649557
								],
								[
									23.66205,
									68.891247
								],
								[
									22.356238,
									68.841741
								],
								[
									21.244936,
									69.370443
								],
								[
									20.645593,
									69.106247
								],
								[
									20.025269,
									69.065139
								],
								[
									19.87856,
									68.407194
								],
								[
									17.993868,
									68.567391
								],
								[
									17.729182,
									68.010552
								],
								[
									16.768879,
									68.013937
								],
								[
									16.108712,
									67.302456
								],
								[
									15.108411,
									66.193867
								],
								[
									13.55569,
									64.787028
								],
								[
									13.919905,
									64.445421
								],
								[
									13.571916,
									64.049114
								],
								[
									12.579935,
									64.066219
								],
								[
									11.930569,
									63.128318
								],
								[
									11.992064,
									61.800362
								],
								[
									12.631147,
									61.293572
								],
								[
									12.300366,
									60.117933
								],
								[
									11.468272,
									59.432393
								],
								[
									11.027369,
									58.856149
								],
								[
									10.356557,
									59.469807
								],
								[
									8.382,
									58.313288
								],
								[
									7.048748,
									58.078884
								],
								[
									5.665835,
									58.588155
								],
								[
									5.308234,
									59.663232
								],
								[
									4.992078,
									61.970998
								],
								[
									5.9129,
									62.614473
								],
								[
									8.553411,
									63.454008
								],
								[
									10.527709,
									64.486038
								],
								[
									12.358347,
									65.879726
								],
								[
									14.761146,
									67.810642
								],
								[
									16.435927,
									68.563205
								],
								[
									19.184028,
									69.817444
								],
								[
									21.378416,
									70.255169
								],
								[
									23.023742,
									70.202072
								],
								[
									24.546543,
									71.030497
								],
								[
									26.37005,
									70.986262
								],
								[
									28.165547,
									71.185474
								]
							]
						],
						[
							[
								[
									24.72412,
									77.85385
								],
								[
									22.49032,
									77.44493
								],
								[
									20.72601,
									77.67704
								],
								[
									21.41611,
									77.93504
								],
								[
									20.8119,
									78.25463
								],
								[
									22.88426,
									78.45494
								],
								[
									23.28134,
									78.07954
								],
								[
									24.72412,
									77.85385
								]
							]
						],
						[
							[
								[
									18.25183,
									79.70175
								],
								[
									21.54383,
									78.95611
								],
								[
									19.02737,
									78.5626
								],
								[
									18.47172,
									77.82669
								],
								[
									17.59441,
									77.63796
								],
								[
									17.1182,
									76.80941
								],
								[
									15.91315,
									76.77045
								],
								[
									13.76259,
									77.38035
								],
								[
									14.66956,
									77.73565
								],
								[
									13.1706,
									78.02493
								],
								[
									11.22231,
									78.8693
								],
								[
									10.44453,
									79.65239
								],
								[
									13.17077,
									80.01046
								],
								[
									13.71852,
									79.66039
								],
								[
									15.14282,
									79.67431
								],
								[
									15.52255,
									80.01608
								],
								[
									16.99085,
									80.05086
								],
								[
									18.25183,
									79.70175
								]
							]
						],
						[
							[
								[
									25.447625,
									80.40734
								],
								[
									27.407506,
									80.056406
								],
								[
									25.924651,
									79.517834
								],
								[
									23.024466,
									79.400012
								],
								[
									20.075188,
									79.566823
								],
								[
									19.897266,
									79.842362
								],
								[
									18.462264,
									79.85988
								],
								[
									17.368015,
									80.318896
								],
								[
									20.455992,
									80.598156
								],
								[
									21.907945,
									80.357679
								],
								[
									22.919253,
									80.657144
								],
								[
									25.447625,
									80.40734
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NPL",
				"properties": {
					"name": "Nepal"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								88.120441,
								27.876542
							],
							[
								88.043133,
								27.445819
							],
							[
								88.174804,
								26.810405
							],
							[
								88.060238,
								26.414615
							],
							[
								87.227472,
								26.397898
							],
							[
								86.024393,
								26.630985
							],
							[
								85.251779,
								26.726198
							],
							[
								84.675018,
								27.234901
							],
							[
								83.304249,
								27.364506
							],
							[
								81.999987,
								27.925479
							],
							[
								81.057203,
								28.416095
							],
							[
								80.088425,
								28.79447
							],
							[
								80.476721,
								29.729865
							],
							[
								81.111256,
								30.183481
							],
							[
								81.525804,
								30.422717
							],
							[
								82.327513,
								30.115268
							],
							[
								83.337115,
								29.463732
							],
							[
								83.898993,
								29.320226
							],
							[
								84.23458,
								28.839894
							],
							[
								85.011638,
								28.642774
							],
							[
								85.82332,
								28.203576
							],
							[
								86.954517,
								27.974262
							],
							[
								88.120441,
								27.876542
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "NZL",
				"properties": {
					"name": "New Zealand"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									173.020375,
									-40.919052
								],
								[
									173.247234,
									-41.331999
								],
								[
									173.958405,
									-40.926701
								],
								[
									174.247587,
									-41.349155
								],
								[
									174.248517,
									-41.770008
								],
								[
									173.876447,
									-42.233184
								],
								[
									173.22274,
									-42.970038
								],
								[
									172.711246,
									-43.372288
								],
								[
									173.080113,
									-43.853344
								],
								[
									172.308584,
									-43.865694
								],
								[
									171.452925,
									-44.242519
								],
								[
									171.185138,
									-44.897104
								],
								[
									170.616697,
									-45.908929
								],
								[
									169.831422,
									-46.355775
								],
								[
									169.332331,
									-46.641235
								],
								[
									168.411354,
									-46.619945
								],
								[
									167.763745,
									-46.290197
								],
								[
									166.676886,
									-46.219917
								],
								[
									166.509144,
									-45.852705
								],
								[
									167.046424,
									-45.110941
								],
								[
									168.303763,
									-44.123973
								],
								[
									168.949409,
									-43.935819
								],
								[
									169.667815,
									-43.555326
								],
								[
									170.52492,
									-43.031688
								],
								[
									171.12509,
									-42.512754
								],
								[
									171.569714,
									-41.767424
								],
								[
									171.948709,
									-41.514417
								],
								[
									172.097227,
									-40.956104
								],
								[
									172.79858,
									-40.493962
								],
								[
									173.020375,
									-40.919052
								]
							]
						],
						[
							[
								[
									174.612009,
									-36.156397
								],
								[
									175.336616,
									-37.209098
								],
								[
									175.357596,
									-36.526194
								],
								[
									175.808887,
									-36.798942
								],
								[
									175.95849,
									-37.555382
								],
								[
									176.763195,
									-37.881253
								],
								[
									177.438813,
									-37.961248
								],
								[
									178.010354,
									-37.579825
								],
								[
									178.517094,
									-37.695373
								],
								[
									178.274731,
									-38.582813
								],
								[
									177.97046,
									-39.166343
								],
								[
									177.206993,
									-39.145776
								],
								[
									176.939981,
									-39.449736
								],
								[
									177.032946,
									-39.879943
								],
								[
									176.885824,
									-40.065978
								],
								[
									176.508017,
									-40.604808
								],
								[
									176.01244,
									-41.289624
								],
								[
									175.239567,
									-41.688308
								],
								[
									175.067898,
									-41.425895
								],
								[
									174.650973,
									-41.281821
								],
								[
									175.22763,
									-40.459236
								],
								[
									174.900157,
									-39.908933
								],
								[
									173.824047,
									-39.508854
								],
								[
									173.852262,
									-39.146602
								],
								[
									174.574802,
									-38.797683
								],
								[
									174.743474,
									-38.027808
								],
								[
									174.697017,
									-37.381129
								],
								[
									174.292028,
									-36.711092
								],
								[
									174.319004,
									-36.534824
								],
								[
									173.840997,
									-36.121981
								],
								[
									173.054171,
									-35.237125
								],
								[
									172.636005,
									-34.529107
								],
								[
									173.007042,
									-34.450662
								],
								[
									173.551298,
									-35.006183
								],
								[
									174.32939,
									-35.265496
								],
								[
									174.612009,
									-36.156397
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "OMN",
				"properties": {
					"name": "Oman"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									58.861141,
									21.114035
								],
								[
									58.487986,
									20.428986
								],
								[
									58.034318,
									20.481437
								],
								[
									57.826373,
									20.243002
								],
								[
									57.665762,
									19.736005
								],
								[
									57.7887,
									19.06757
								],
								[
									57.694391,
									18.94471
								],
								[
									57.234264,
									18.947991
								],
								[
									56.609651,
									18.574267
								],
								[
									56.512189,
									18.087113
								],
								[
									56.283521,
									17.876067
								],
								[
									55.661492,
									17.884128
								],
								[
									55.269939,
									17.632309
								],
								[
									55.2749,
									17.228354
								],
								[
									54.791002,
									16.950697
								],
								[
									54.239253,
									17.044981
								],
								[
									53.570508,
									16.707663
								],
								[
									53.108573,
									16.651051
								],
								[
									52.782184,
									17.349742
								],
								[
									52.00001,
									19.000003
								],
								[
									54.999982,
									19.999994
								],
								[
									55.666659,
									22.000001
								],
								[
									55.208341,
									22.70833
								],
								[
									55.234489,
									23.110993
								],
								[
									55.525841,
									23.524869
								],
								[
									55.528632,
									23.933604
								],
								[
									55.981214,
									24.130543
								],
								[
									55.804119,
									24.269604
								],
								[
									55.886233,
									24.920831
								],
								[
									56.396847,
									24.924732
								],
								[
									56.84514,
									24.241673
								],
								[
									57.403453,
									23.878594
								],
								[
									58.136948,
									23.747931
								],
								[
									58.729211,
									23.565668
								],
								[
									59.180502,
									22.992395
								],
								[
									59.450098,
									22.660271
								],
								[
									59.80806,
									22.533612
								],
								[
									59.806148,
									22.310525
								],
								[
									59.442191,
									21.714541
								],
								[
									59.282408,
									21.433886
								],
								[
									58.861141,
									21.114035
								]
							]
						],
						[
							[
								[
									56.391421,
									25.895991
								],
								[
									56.261042,
									25.714606
								],
								[
									56.070821,
									26.055464
								],
								[
									56.362017,
									26.395934
								],
								[
									56.485679,
									26.309118
								],
								[
									56.391421,
									25.895991
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PAK",
				"properties": {
					"name": "Pakistan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								75.158028,
								37.133031
							],
							[
								75.896897,
								36.666806
							],
							[
								76.192848,
								35.898403
							],
							[
								77.837451,
								35.49401
							],
							[
								76.871722,
								34.653544
							],
							[
								75.757061,
								34.504923
							],
							[
								74.240203,
								34.748887
							],
							[
								73.749948,
								34.317699
							],
							[
								74.104294,
								33.441473
							],
							[
								74.451559,
								32.7649
							],
							[
								75.258642,
								32.271105
							],
							[
								74.405929,
								31.692639
							],
							[
								74.42138,
								30.979815
							],
							[
								73.450638,
								29.976413
							],
							[
								72.823752,
								28.961592
							],
							[
								71.777666,
								27.91318
							],
							[
								70.616496,
								27.989196
							],
							[
								69.514393,
								26.940966
							],
							[
								70.168927,
								26.491872
							],
							[
								70.282873,
								25.722229
							],
							[
								70.844699,
								25.215102
							],
							[
								71.04324,
								24.356524
							],
							[
								68.842599,
								24.359134
							],
							[
								68.176645,
								23.691965
							],
							[
								67.443667,
								23.944844
							],
							[
								67.145442,
								24.663611
							],
							[
								66.372828,
								25.425141
							],
							[
								64.530408,
								25.237039
							],
							[
								62.905701,
								25.218409
							],
							[
								61.497363,
								25.078237
							],
							[
								61.874187,
								26.239975
							],
							[
								63.316632,
								26.756532
							],
							[
								63.233898,
								27.217047
							],
							[
								62.755426,
								27.378923
							],
							[
								62.72783,
								28.259645
							],
							[
								61.771868,
								28.699334
							],
							[
								61.369309,
								29.303276
							],
							[
								60.874248,
								29.829239
							],
							[
								62.549857,
								29.318572
							],
							[
								63.550261,
								29.468331
							],
							[
								64.148002,
								29.340819
							],
							[
								64.350419,
								29.560031
							],
							[
								65.046862,
								29.472181
							],
							[
								66.346473,
								29.887943
							],
							[
								66.381458,
								30.738899
							],
							[
								66.938891,
								31.304911
							],
							[
								67.683394,
								31.303154
							],
							[
								67.792689,
								31.58293
							],
							[
								68.556932,
								31.71331
							],
							[
								68.926677,
								31.620189
							],
							[
								69.317764,
								31.901412
							],
							[
								69.262522,
								32.501944
							],
							[
								69.687147,
								33.105499
							],
							[
								70.323594,
								33.358533
							],
							[
								69.930543,
								34.02012
							],
							[
								70.881803,
								33.988856
							],
							[
								71.156773,
								34.348911
							],
							[
								71.115019,
								34.733126
							],
							[
								71.613076,
								35.153203
							],
							[
								71.498768,
								35.650563
							],
							[
								71.262348,
								36.074388
							],
							[
								71.846292,
								36.509942
							],
							[
								72.920025,
								36.720007
							],
							[
								74.067552,
								36.836176
							],
							[
								74.575893,
								37.020841
							],
							[
								75.158028,
								37.133031
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PAN",
				"properties": {
					"name": "Panama"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-77.881571,
								7.223771
							],
							[
								-78.214936,
								7.512255
							],
							[
								-78.429161,
								8.052041
							],
							[
								-78.182096,
								8.319182
							],
							[
								-78.435465,
								8.387705
							],
							[
								-78.622121,
								8.718124
							],
							[
								-79.120307,
								8.996092
							],
							[
								-79.557877,
								8.932375
							],
							[
								-79.760578,
								8.584515
							],
							[
								-80.164481,
								8.333316
							],
							[
								-80.382659,
								8.298409
							],
							[
								-80.480689,
								8.090308
							],
							[
								-80.00369,
								7.547524
							],
							[
								-80.276671,
								7.419754
							],
							[
								-80.421158,
								7.271572
							],
							[
								-80.886401,
								7.220541
							],
							[
								-81.059543,
								7.817921
							],
							[
								-81.189716,
								7.647906
							],
							[
								-81.519515,
								7.70661
							],
							[
								-81.721311,
								8.108963
							],
							[
								-82.131441,
								8.175393
							],
							[
								-82.390934,
								8.292362
							],
							[
								-82.820081,
								8.290864
							],
							[
								-82.850958,
								8.073823
							],
							[
								-82.965783,
								8.225028
							],
							[
								-82.913176,
								8.423517
							],
							[
								-82.829771,
								8.626295
							],
							[
								-82.868657,
								8.807266
							],
							[
								-82.719183,
								8.925709
							],
							[
								-82.927155,
								9.07433
							],
							[
								-82.932891,
								9.476812
							],
							[
								-82.546196,
								9.566135
							],
							[
								-82.187123,
								9.207449
							],
							[
								-82.207586,
								8.995575
							],
							[
								-81.808567,
								8.950617
							],
							[
								-81.714154,
								9.031955
							],
							[
								-81.439287,
								8.786234
							],
							[
								-80.947302,
								8.858504
							],
							[
								-80.521901,
								9.111072
							],
							[
								-79.9146,
								9.312765
							],
							[
								-79.573303,
								9.61161
							],
							[
								-79.021192,
								9.552931
							],
							[
								-79.05845,
								9.454565
							],
							[
								-78.500888,
								9.420459
							],
							[
								-78.055928,
								9.24773
							],
							[
								-77.729514,
								8.946844
							],
							[
								-77.353361,
								8.670505
							],
							[
								-77.474723,
								8.524286
							],
							[
								-77.242566,
								7.935278
							],
							[
								-77.431108,
								7.638061
							],
							[
								-77.753414,
								7.70984
							],
							[
								-77.881571,
								7.223771
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PER",
				"properties": {
					"name": "Peru"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-69.590424,
								-17.580012
							],
							[
								-69.858444,
								-18.092694
							],
							[
								-70.372572,
								-18.347975
							],
							[
								-71.37525,
								-17.773799
							],
							[
								-71.462041,
								-17.363488
							],
							[
								-73.44453,
								-16.359363
							],
							[
								-75.237883,
								-15.265683
							],
							[
								-76.009205,
								-14.649286
							],
							[
								-76.423469,
								-13.823187
							],
							[
								-76.259242,
								-13.535039
							],
							[
								-77.106192,
								-12.222716
							],
							[
								-78.092153,
								-10.377712
							],
							[
								-79.036953,
								-8.386568
							],
							[
								-79.44592,
								-7.930833
							],
							[
								-79.760578,
								-7.194341
							],
							[
								-80.537482,
								-6.541668
							],
							[
								-81.249996,
								-6.136834
							],
							[
								-80.926347,
								-5.690557
							],
							[
								-81.410943,
								-4.736765
							],
							[
								-81.09967,
								-4.036394
							],
							[
								-80.302561,
								-3.404856
							],
							[
								-80.184015,
								-3.821162
							],
							[
								-80.469295,
								-4.059287
							],
							[
								-80.442242,
								-4.425724
							],
							[
								-80.028908,
								-4.346091
							],
							[
								-79.624979,
								-4.454198
							],
							[
								-79.205289,
								-4.959129
							],
							[
								-78.639897,
								-4.547784
							],
							[
								-78.450684,
								-3.873097
							],
							[
								-77.837905,
								-3.003021
							],
							[
								-76.635394,
								-2.608678
							],
							[
								-75.544996,
								-1.56161
							],
							[
								-75.233723,
								-0.911417
							],
							[
								-75.373223,
								-0.152032
							],
							[
								-75.106625,
								-0.057205
							],
							[
								-74.441601,
								-0.53082
							],
							[
								-74.122395,
								-1.002833
							],
							[
								-73.659504,
								-1.260491
							],
							[
								-73.070392,
								-2.308954
							],
							[
								-72.325787,
								-2.434218
							],
							[
								-71.774761,
								-2.16979
							],
							[
								-71.413646,
								-2.342802
							],
							[
								-70.813476,
								-2.256865
							],
							[
								-70.047709,
								-2.725156
							],
							[
								-70.692682,
								-3.742872
							],
							[
								-70.394044,
								-3.766591
							],
							[
								-69.893635,
								-4.298187
							],
							[
								-70.794769,
								-4.251265
							],
							[
								-70.928843,
								-4.401591
							],
							[
								-71.748406,
								-4.593983
							],
							[
								-72.891928,
								-5.274561
							],
							[
								-72.964507,
								-5.741251
							],
							[
								-73.219711,
								-6.089189
							],
							[
								-73.120027,
								-6.629931
							],
							[
								-73.724487,
								-6.918595
							],
							[
								-73.723401,
								-7.340999
							],
							[
								-73.987235,
								-7.52383
							],
							[
								-73.571059,
								-8.424447
							],
							[
								-73.015383,
								-9.032833
							],
							[
								-73.226713,
								-9.462213
							],
							[
								-72.563033,
								-9.520194
							],
							[
								-72.184891,
								-10.053598
							],
							[
								-71.302412,
								-10.079436
							],
							[
								-70.481894,
								-9.490118
							],
							[
								-70.548686,
								-11.009147
							],
							[
								-70.093752,
								-11.123972
							],
							[
								-69.529678,
								-10.951734
							],
							[
								-68.66508,
								-12.5613
							],
							[
								-68.88008,
								-12.899729
							],
							[
								-68.929224,
								-13.602684
							],
							[
								-68.948887,
								-14.453639
							],
							[
								-69.339535,
								-14.953195
							],
							[
								-69.160347,
								-15.323974
							],
							[
								-69.389764,
								-15.660129
							],
							[
								-68.959635,
								-16.500698
							],
							[
								-69.590424,
								-17.580012
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PHL",
				"properties": {
					"name": "Philippines"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									126.376814,
									8.414706
								],
								[
									126.478513,
									7.750354
								],
								[
									126.537424,
									7.189381
								],
								[
									126.196773,
									6.274294
								],
								[
									125.831421,
									7.293715
								],
								[
									125.363852,
									6.786485
								],
								[
									125.683161,
									6.049657
								],
								[
									125.396512,
									5.581003
								],
								[
									124.219788,
									6.161355
								],
								[
									123.93872,
									6.885136
								],
								[
									124.243662,
									7.36061
								],
								[
									123.610212,
									7.833527
								],
								[
									123.296071,
									7.418876
								],
								[
									122.825506,
									7.457375
								],
								[
									122.085499,
									6.899424
								],
								[
									121.919928,
									7.192119
								],
								[
									122.312359,
									8.034962
								],
								[
									122.942398,
									8.316237
								],
								[
									123.487688,
									8.69301
								],
								[
									123.841154,
									8.240324
								],
								[
									124.60147,
									8.514158
								],
								[
									124.764612,
									8.960409
								],
								[
									125.471391,
									8.986997
								],
								[
									125.412118,
									9.760335
								],
								[
									126.222714,
									9.286074
								],
								[
									126.306637,
									8.782487
								],
								[
									126.376814,
									8.414706
								]
							]
						],
						[
							[
								[
									123.982438,
									10.278779
								],
								[
									123.623183,
									9.950091
								],
								[
									123.309921,
									9.318269
								],
								[
									122.995883,
									9.022189
								],
								[
									122.380055,
									9.713361
								],
								[
									122.586089,
									9.981045
								],
								[
									122.837081,
									10.261157
								],
								[
									122.947411,
									10.881868
								],
								[
									123.49885,
									10.940624
								],
								[
									123.337774,
									10.267384
								],
								[
									124.077936,
									11.232726
								],
								[
									123.982438,
									10.278779
								]
							]
						],
						[
							[
								[
									118.504581,
									9.316383
								],
								[
									117.174275,
									8.3675
								],
								[
									117.664477,
									9.066889
								],
								[
									118.386914,
									9.6845
								],
								[
									118.987342,
									10.376292
								],
								[
									119.511496,
									11.369668
								],
								[
									119.689677,
									10.554291
								],
								[
									119.029458,
									10.003653
								],
								[
									118.504581,
									9.316383
								]
							]
						],
						[
							[
								[
									121.883548,
									11.891755
								],
								[
									122.483821,
									11.582187
								],
								[
									123.120217,
									11.58366
								],
								[
									123.100838,
									11.165934
								],
								[
									122.637714,
									10.741308
								],
								[
									122.00261,
									10.441017
								],
								[
									121.967367,
									10.905691
								],
								[
									122.03837,
									11.415841
								],
								[
									121.883548,
									11.891755
								]
							]
						],
						[
							[
								[
									125.502552,
									12.162695
								],
								[
									125.783465,
									11.046122
								],
								[
									125.011884,
									11.311455
								],
								[
									125.032761,
									10.975816
								],
								[
									125.277449,
									10.358722
								],
								[
									124.801819,
									10.134679
								],
								[
									124.760168,
									10.837995
								],
								[
									124.459101,
									10.88993
								],
								[
									124.302522,
									11.495371
								],
								[
									124.891013,
									11.415583
								],
								[
									124.87799,
									11.79419
								],
								[
									124.266762,
									12.557761
								],
								[
									125.227116,
									12.535721
								],
								[
									125.502552,
									12.162695
								]
							]
						],
						[
							[
								[
									121.527394,
									13.06959
								],
								[
									121.26219,
									12.20556
								],
								[
									120.833896,
									12.704496
								],
								[
									120.323436,
									13.466413
								],
								[
									121.180128,
									13.429697
								],
								[
									121.527394,
									13.06959
								]
							]
						],
						[
							[
								[
									121.321308,
									18.504065
								],
								[
									121.937601,
									18.218552
								],
								[
									122.246006,
									18.47895
								],
								[
									122.336957,
									18.224883
								],
								[
									122.174279,
									17.810283
								],
								[
									122.515654,
									17.093505
								],
								[
									122.252311,
									16.262444
								],
								[
									121.662786,
									15.931018
								],
								[
									121.50507,
									15.124814
								],
								[
									121.728829,
									14.328376
								],
								[
									122.258925,
									14.218202
								],
								[
									122.701276,
									14.336541
								],
								[
									123.950295,
									13.782131
								],
								[
									123.855107,
									13.237771
								],
								[
									124.181289,
									12.997527
								],
								[
									124.077419,
									12.536677
								],
								[
									123.298035,
									13.027526
								],
								[
									122.928652,
									13.55292
								],
								[
									122.671355,
									13.185836
								],
								[
									122.03465,
									13.784482
								],
								[
									121.126385,
									13.636687
								],
								[
									120.628637,
									13.857656
								],
								[
									120.679384,
									14.271016
								],
								[
									120.991819,
									14.525393
								],
								[
									120.693336,
									14.756671
								],
								[
									120.564145,
									14.396279
								],
								[
									120.070429,
									14.970869
								],
								[
									119.920929,
									15.406347
								],
								[
									119.883773,
									16.363704
								],
								[
									120.286488,
									16.034629
								],
								[
									120.390047,
									17.599081
								],
								[
									120.715867,
									18.505227
								],
								[
									121.321308,
									18.504065
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PNG",
				"properties": {
					"name": "Papua New Guinea"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									155.880026,
									-6.819997
								],
								[
									155.599991,
									-6.919991
								],
								[
									155.166994,
									-6.535931
								],
								[
									154.729192,
									-5.900828
								],
								[
									154.514114,
									-5.139118
								],
								[
									154.652504,
									-5.042431
								],
								[
									154.759991,
									-5.339984
								],
								[
									155.062918,
									-5.566792
								],
								[
									155.547746,
									-6.200655
								],
								[
									156.019965,
									-6.540014
								],
								[
									155.880026,
									-6.819997
								]
							]
						],
						[
							[
								[
									151.982796,
									-5.478063
								],
								[
									151.459107,
									-5.56028
								],
								[
									151.30139,
									-5.840728
								],
								[
									150.754447,
									-6.083763
								],
								[
									150.241197,
									-6.317754
								],
								[
									149.709963,
									-6.316513
								],
								[
									148.890065,
									-6.02604
								],
								[
									148.318937,
									-5.747142
								],
								[
									148.401826,
									-5.437756
								],
								[
									149.298412,
									-5.583742
								],
								[
									149.845562,
									-5.505503
								],
								[
									149.99625,
									-5.026101
								],
								[
									150.139756,
									-5.001348
								],
								[
									150.236908,
									-5.53222
								],
								[
									150.807467,
									-5.455842
								],
								[
									151.089672,
									-5.113693
								],
								[
									151.647881,
									-4.757074
								],
								[
									151.537862,
									-4.167807
								],
								[
									152.136792,
									-4.14879
								],
								[
									152.338743,
									-4.312966
								],
								[
									152.318693,
									-4.867661
								],
								[
									151.982796,
									-5.478063
								]
							]
						],
						[
							[
								[
									147.191874,
									-7.388024
								],
								[
									148.084636,
									-8.044108
								],
								[
									148.734105,
									-9.104664
								],
								[
									149.306835,
									-9.071436
								],
								[
									149.266631,
									-9.514406
								],
								[
									150.038728,
									-9.684318
								],
								[
									149.738798,
									-9.872937
								],
								[
									150.801628,
									-10.293687
								],
								[
									150.690575,
									-10.582713
								],
								[
									150.028393,
									-10.652476
								],
								[
									149.78231,
									-10.393267
								],
								[
									148.923138,
									-10.280923
								],
								[
									147.913018,
									-10.130441
								],
								[
									147.135443,
									-9.492444
								],
								[
									146.567881,
									-8.942555
								],
								[
									146.048481,
									-8.067414
								],
								[
									144.744168,
									-7.630128
								],
								[
									143.897088,
									-7.91533
								],
								[
									143.286376,
									-8.245491
								],
								[
									143.413913,
									-8.983069
								],
								[
									142.628431,
									-9.326821
								],
								[
									142.068259,
									-9.159596
								],
								[
									141.033852,
									-9.117893
								],
								[
									141.017057,
									-5.859022
								],
								[
									141.00021,
									-2.600151
								],
								[
									142.735247,
									-3.289153
								],
								[
									144.583971,
									-3.861418
								],
								[
									145.27318,
									-4.373738
								],
								[
									145.829786,
									-4.876498
								],
								[
									145.981922,
									-5.465609
								],
								[
									147.648073,
									-6.083659
								],
								[
									147.891108,
									-6.614015
								],
								[
									146.970905,
									-6.721657
								],
								[
									147.191874,
									-7.388024
								]
							]
						],
						[
							[
								[
									153.140038,
									-4.499983
								],
								[
									152.827292,
									-4.766427
								],
								[
									152.638673,
									-4.176127
								],
								[
									152.406026,
									-3.789743
								],
								[
									151.953237,
									-3.462062
								],
								[
									151.384279,
									-3.035422
								],
								[
									150.66205,
									-2.741486
								],
								[
									150.939965,
									-2.500002
								],
								[
									151.479984,
									-2.779985
								],
								[
									151.820015,
									-2.999972
								],
								[
									152.239989,
									-3.240009
								],
								[
									152.640017,
									-3.659983
								],
								[
									153.019994,
									-3.980015
								],
								[
									153.140038,
									-4.499983
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "POL",
				"properties": {
					"name": "Poland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								15.016996,
								51.106674
							],
							[
								14.607098,
								51.745188
							],
							[
								14.685026,
								52.089947
							],
							[
								14.4376,
								52.62485
							],
							[
								14.074521,
								52.981263
							],
							[
								14.353315,
								53.248171
							],
							[
								14.119686,
								53.757029
							],
							[
								14.8029,
								54.050706
							],
							[
								16.363477,
								54.513159
							],
							[
								17.622832,
								54.851536
							],
							[
								18.620859,
								54.682606
							],
							[
								18.696255,
								54.438719
							],
							[
								19.66064,
								54.426084
							],
							[
								20.892245,
								54.312525
							],
							[
								22.731099,
								54.327537
							],
							[
								23.243987,
								54.220567
							],
							[
								23.484128,
								53.912498
							],
							[
								23.527536,
								53.470122
							],
							[
								23.804935,
								53.089731
							],
							[
								23.799199,
								52.691099
							],
							[
								23.199494,
								52.486977
							],
							[
								23.508002,
								52.023647
							],
							[
								23.527071,
								51.578454
							],
							[
								24.029986,
								50.705407
							],
							[
								23.922757,
								50.424881
							],
							[
								23.426508,
								50.308506
							],
							[
								22.51845,
								49.476774
							],
							[
								22.776419,
								49.027395
							],
							[
								22.558138,
								49.085738
							],
							[
								21.607808,
								49.470107
							],
							[
								20.887955,
								49.328772
							],
							[
								20.415839,
								49.431453
							],
							[
								19.825023,
								49.217125
							],
							[
								19.320713,
								49.571574
							],
							[
								18.909575,
								49.435846
							],
							[
								18.853144,
								49.49623
							],
							[
								18.392914,
								49.988629
							],
							[
								17.649445,
								50.049038
							],
							[
								17.554567,
								50.362146
							],
							[
								16.868769,
								50.473974
							],
							[
								16.719476,
								50.215747
							],
							[
								16.176253,
								50.422607
							],
							[
								16.238627,
								50.697733
							],
							[
								15.490972,
								50.78473
							],
							[
								15.016996,
								51.106674
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PRI",
				"properties": {
					"name": "Puerto Rico"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-66.282434,
								18.514762
							],
							[
								-65.771303,
								18.426679
							],
							[
								-65.591004,
								18.228035
							],
							[
								-65.847164,
								17.975906
							],
							[
								-66.599934,
								17.981823
							],
							[
								-67.184162,
								17.946553
							],
							[
								-67.242428,
								18.37446
							],
							[
								-67.100679,
								18.520601
							],
							[
								-66.282434,
								18.514762
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PRK",
				"properties": {
					"name": "North Korea"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								130.640016,
								42.395009
							],
							[
								130.780007,
								42.220007
							],
							[
								130.400031,
								42.280004
							],
							[
								129.965949,
								41.941368
							],
							[
								129.667362,
								41.601104
							],
							[
								129.705189,
								40.882828
							],
							[
								129.188115,
								40.661808
							],
							[
								129.0104,
								40.485436
							],
							[
								128.633368,
								40.189847
							],
							[
								127.967414,
								40.025413
							],
							[
								127.533436,
								39.75685
							],
							[
								127.50212,
								39.323931
							],
							[
								127.385434,
								39.213472
							],
							[
								127.783343,
								39.050898
							],
							[
								128.349716,
								38.612243
							],
							[
								128.205746,
								38.370397
							],
							[
								127.780035,
								38.304536
							],
							[
								127.073309,
								38.256115
							],
							[
								126.68372,
								37.804773
							],
							[
								126.237339,
								37.840378
							],
							[
								126.174759,
								37.749686
							],
							[
								125.689104,
								37.94001
							],
							[
								125.568439,
								37.752089
							],
							[
								125.27533,
								37.669071
							],
							[
								125.240087,
								37.857224
							],
							[
								124.981033,
								37.948821
							],
							[
								124.712161,
								38.108346
							],
							[
								124.985994,
								38.548474
							],
							[
								125.221949,
								38.665857
							],
							[
								125.132859,
								38.848559
							],
							[
								125.38659,
								39.387958
							],
							[
								125.321116,
								39.551385
							],
							[
								124.737482,
								39.660344
							],
							[
								124.265625,
								39.928493
							],
							[
								125.079942,
								40.569824
							],
							[
								126.182045,
								41.107336
							],
							[
								126.869083,
								41.816569
							],
							[
								127.343783,
								41.503152
							],
							[
								128.208433,
								41.466772
							],
							[
								128.052215,
								41.994285
							],
							[
								129.596669,
								42.424982
							],
							[
								129.994267,
								42.985387
							],
							[
								130.640016,
								42.395009
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PRT",
				"properties": {
					"name": "Portugal"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-9.034818,
								41.880571
							],
							[
								-8.671946,
								42.134689
							],
							[
								-8.263857,
								42.280469
							],
							[
								-8.013175,
								41.790886
							],
							[
								-7.422513,
								41.792075
							],
							[
								-7.251309,
								41.918346
							],
							[
								-6.668606,
								41.883387
							],
							[
								-6.389088,
								41.381815
							],
							[
								-6.851127,
								41.111083
							],
							[
								-6.86402,
								40.330872
							],
							[
								-7.026413,
								40.184524
							],
							[
								-7.066592,
								39.711892
							],
							[
								-7.498632,
								39.629571
							],
							[
								-7.098037,
								39.030073
							],
							[
								-7.374092,
								38.373059
							],
							[
								-7.029281,
								38.075764
							],
							[
								-7.166508,
								37.803894
							],
							[
								-7.537105,
								37.428904
							],
							[
								-7.453726,
								37.097788
							],
							[
								-7.855613,
								36.838269
							],
							[
								-8.382816,
								36.97888
							],
							[
								-8.898857,
								36.868809
							],
							[
								-8.746101,
								37.651346
							],
							[
								-8.839998,
								38.266243
							],
							[
								-9.287464,
								38.358486
							],
							[
								-9.526571,
								38.737429
							],
							[
								-9.446989,
								39.392066
							],
							[
								-9.048305,
								39.755093
							],
							[
								-8.977353,
								40.159306
							],
							[
								-8.768684,
								40.760639
							],
							[
								-8.790853,
								41.184334
							],
							[
								-8.990789,
								41.543459
							],
							[
								-9.034818,
								41.880571
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PRY",
				"properties": {
					"name": "Paraguay"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-62.685057,
								-22.249029
							],
							[
								-62.291179,
								-21.051635
							],
							[
								-62.265961,
								-20.513735
							],
							[
								-61.786326,
								-19.633737
							],
							[
								-60.043565,
								-19.342747
							],
							[
								-59.115042,
								-19.356906
							],
							[
								-58.183471,
								-19.868399
							],
							[
								-58.166392,
								-20.176701
							],
							[
								-57.870674,
								-20.732688
							],
							[
								-57.937156,
								-22.090176
							],
							[
								-56.88151,
								-22.282154
							],
							[
								-56.473317,
								-22.0863
							],
							[
								-55.797958,
								-22.35693
							],
							[
								-55.610683,
								-22.655619
							],
							[
								-55.517639,
								-23.571998
							],
							[
								-55.400747,
								-23.956935
							],
							[
								-55.027902,
								-24.001274
							],
							[
								-54.652834,
								-23.839578
							],
							[
								-54.29296,
								-24.021014
							],
							[
								-54.293476,
								-24.5708
							],
							[
								-54.428946,
								-25.162185
							],
							[
								-54.625291,
								-25.739255
							],
							[
								-54.788795,
								-26.621786
							],
							[
								-55.695846,
								-27.387837
							],
							[
								-56.486702,
								-27.548499
							],
							[
								-57.60976,
								-27.395899
							],
							[
								-58.618174,
								-27.123719
							],
							[
								-57.63366,
								-25.603657
							],
							[
								-57.777217,
								-25.16234
							],
							[
								-58.807128,
								-24.771459
							],
							[
								-60.028966,
								-24.032796
							],
							[
								-60.846565,
								-23.880713
							],
							[
								-62.685057,
								-22.249029
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "QAT",
				"properties": {
					"name": "Qatar"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								50.810108,
								24.754743
							],
							[
								50.743911,
								25.482424
							],
							[
								51.013352,
								26.006992
							],
							[
								51.286462,
								26.114582
							],
							[
								51.589079,
								25.801113
							],
							[
								51.6067,
								25.21567
							],
							[
								51.389608,
								24.627386
							],
							[
								51.112415,
								24.556331
							],
							[
								50.810108,
								24.754743
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ROU",
				"properties": {
					"name": "Romania"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								22.710531,
								47.882194
							],
							[
								23.142236,
								48.096341
							],
							[
								23.760958,
								47.985598
							],
							[
								24.402056,
								47.981878
							],
							[
								24.866317,
								47.737526
							],
							[
								25.207743,
								47.891056
							],
							[
								25.945941,
								47.987149
							],
							[
								26.19745,
								48.220881
							],
							[
								26.619337,
								48.220726
							],
							[
								26.924176,
								48.123264
							],
							[
								27.233873,
								47.826771
							],
							[
								27.551166,
								47.405117
							],
							[
								28.12803,
								46.810476
							],
							[
								28.160018,
								46.371563
							],
							[
								28.054443,
								45.944586
							],
							[
								28.233554,
								45.488283
							],
							[
								28.679779,
								45.304031
							],
							[
								29.149725,
								45.464925
							],
							[
								29.603289,
								45.293308
							],
							[
								29.626543,
								45.035391
							],
							[
								29.141612,
								44.82021
							],
							[
								28.837858,
								44.913874
							],
							[
								28.558081,
								43.707462
							],
							[
								27.970107,
								43.812468
							],
							[
								27.2424,
								44.175986
							],
							[
								26.065159,
								43.943494
							],
							[
								25.569272,
								43.688445
							],
							[
								24.100679,
								43.741051
							],
							[
								23.332302,
								43.897011
							],
							[
								22.944832,
								43.823785
							],
							[
								22.65715,
								44.234923
							],
							[
								22.474008,
								44.409228
							],
							[
								22.705726,
								44.578003
							],
							[
								22.459022,
								44.702517
							],
							[
								22.145088,
								44.478422
							],
							[
								21.562023,
								44.768947
							],
							[
								21.483526,
								45.18117
							],
							[
								20.874313,
								45.416375
							],
							[
								20.762175,
								45.734573
							],
							[
								20.220192,
								46.127469
							],
							[
								21.021952,
								46.316088
							],
							[
								21.626515,
								46.994238
							],
							[
								22.099768,
								47.672439
							],
							[
								22.710531,
								47.882194
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "RUS",
				"properties": {
					"name": "Russia"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									143.648007,
									50.7476
								],
								[
									144.654148,
									48.976391
								],
								[
									143.173928,
									49.306551
								],
								[
									142.558668,
									47.861575
								],
								[
									143.533492,
									46.836728
								],
								[
									143.505277,
									46.137908
								],
								[
									142.747701,
									46.740765
								],
								[
									142.09203,
									45.966755
								],
								[
									141.906925,
									46.805929
								],
								[
									142.018443,
									47.780133
								],
								[
									141.904445,
									48.859189
								],
								[
									142.1358,
									49.615163
								],
								[
									142.179983,
									50.952342
								],
								[
									141.594076,
									51.935435
								],
								[
									141.682546,
									53.301966
								],
								[
									142.606934,
									53.762145
								],
								[
									142.209749,
									54.225476
								],
								[
									142.654786,
									54.365881
								],
								[
									142.914616,
									53.704578
								],
								[
									143.260848,
									52.74076
								],
								[
									143.235268,
									51.75666
								],
								[
									143.648007,
									50.7476
								]
							]
						],
						[
							[
								[
									22.731099,
									54.327537
								],
								[
									20.892245,
									54.312525
								],
								[
									19.66064,
									54.426084
								],
								[
									19.888481,
									54.86616
								],
								[
									21.268449,
									55.190482
								],
								[
									22.315724,
									55.015299
								],
								[
									22.757764,
									54.856574
								],
								[
									22.651052,
									54.582741
								],
								[
									22.731099,
									54.327537
								]
							]
						],
						[
							[
								[
									-175.01425,
									66.58435
								],
								[
									-174.33983,
									66.33556
								],
								[
									-174.57182,
									67.06219
								],
								[
									-171.85731,
									66.91308
								],
								[
									-169.89958,
									65.97724
								],
								[
									-170.89107,
									65.54139
								],
								[
									-172.53025,
									65.43791
								],
								[
									-172.555,
									64.46079
								],
								[
									-172.95533,
									64.25269
								],
								[
									-173.89184,
									64.2826
								],
								[
									-174.65392,
									64.63125
								],
								[
									-175.98353,
									64.92288
								],
								[
									-176.20716,
									65.35667
								],
								[
									-177.22266,
									65.52024
								],
								[
									-178.35993,
									65.39052
								],
								[
									-178.90332,
									65.74044
								],
								[
									-178.68611,
									66.11211
								],
								[
									-179.88377,
									65.87456
								],
								[
									-179.43268,
									65.40411
								],
								[
									-180,
									64.979709
								],
								[
									-180,
									68.963636
								],
								[
									-177.55,
									68.2
								],
								[
									-174.92825,
									67.20589
								],
								[
									-175.01425,
									66.58435
								]
							]
						],
						[
							[
								[
									180,
									70.832199
								],
								[
									178.903425,
									70.78114
								],
								[
									178.7253,
									71.0988
								],
								[
									180,
									71.515714
								],
								[
									180,
									70.832199
								]
							]
						],
						[
							[
								[
									-178.69378,
									70.89302
								],
								[
									-180,
									70.832199
								],
								[
									-180,
									71.515714
								],
								[
									-179.871875,
									71.55762
								],
								[
									-179.02433,
									71.55553
								],
								[
									-177.577945,
									71.26948
								],
								[
									-177.663575,
									71.13277
								],
								[
									-178.69378,
									70.89302
								]
							]
						],
						[
							[
								[
									143.60385,
									73.21244
								],
								[
									142.08763,
									73.20544
								],
								[
									140.038155,
									73.31692
								],
								[
									139.86312,
									73.36983
								],
								[
									140.81171,
									73.76506
								],
								[
									142.06207,
									73.85758
								],
								[
									143.48283,
									73.47525
								],
								[
									143.60385,
									73.21244
								]
							]
						],
						[
							[
								[
									150.73167,
									75.08406
								],
								[
									149.575925,
									74.68892
								],
								[
									147.977465,
									74.778355
								],
								[
									146.11919,
									75.17298
								],
								[
									146.358485,
									75.49682
								],
								[
									148.22223,
									75.345845
								],
								[
									150.73167,
									75.08406
								]
							]
						],
						[
							[
								[
									145.086285,
									75.562625
								],
								[
									144.3,
									74.82
								],
								[
									140.61381,
									74.84768
								],
								[
									138.95544,
									74.61148
								],
								[
									136.97439,
									75.26167
								],
								[
									137.51176,
									75.94917
								],
								[
									138.831075,
									76.13676
								],
								[
									141.471615,
									76.09289
								],
								[
									145.086285,
									75.562625
								]
							]
						],
						[
							[
								[
									57.535693,
									70.720464
								],
								[
									56.944979,
									70.632743
								],
								[
									53.677375,
									70.762658
								],
								[
									53.412017,
									71.206662
								],
								[
									51.601895,
									71.474759
								],
								[
									51.455754,
									72.014881
								],
								[
									52.478275,
									72.229442
								],
								[
									52.444169,
									72.774731
								],
								[
									54.427614,
									73.627548
								],
								[
									53.50829,
									73.749814
								],
								[
									55.902459,
									74.627486
								],
								[
									55.631933,
									75.081412
								],
								[
									57.868644,
									75.60939
								],
								[
									61.170044,
									76.251883
								],
								[
									64.498368,
									76.439055
								],
								[
									66.210977,
									76.809782
								],
								[
									68.15706,
									76.939697
								],
								[
									68.852211,
									76.544811
								],
								[
									68.180573,
									76.233642
								],
								[
									64.637326,
									75.737755
								],
								[
									61.583508,
									75.260885
								],
								[
									58.477082,
									74.309056
								],
								[
									56.986786,
									73.333044
								],
								[
									55.419336,
									72.371268
								],
								[
									55.622838,
									71.540595
								],
								[
									57.535693,
									70.720464
								]
							]
						],
						[
							[
								[
									106.97013,
									76.97419
								],
								[
									107.24,
									76.48
								],
								[
									108.1538,
									76.72335
								],
								[
									111.07726,
									76.71
								],
								[
									113.33151,
									76.22224
								],
								[
									114.13417,
									75.84764
								],
								[
									113.88539,
									75.32779
								],
								[
									112.77918,
									75.03186
								],
								[
									110.15125,
									74.47673
								],
								[
									109.4,
									74.18
								],
								[
									110.64,
									74.04
								],
								[
									112.11919,
									73.78774
								],
								[
									113.01954,
									73.97693
								],
								[
									113.52958,
									73.33505
								],
								[
									113.96881,
									73.59488
								],
								[
									115.56782,
									73.75285
								],
								[
									118.77633,
									73.58772
								],
								[
									119.02,
									73.12
								],
								[
									123.20066,
									72.97122
								],
								[
									123.25777,
									73.73503
								],
								[
									125.38,
									73.56
								],
								[
									126.97644,
									73.56549
								],
								[
									128.59126,
									73.03871
								],
								[
									129.05157,
									72.39872
								],
								[
									128.46,
									71.98
								],
								[
									129.71599,
									71.19304
								],
								[
									131.28858,
									70.78699
								],
								[
									132.2535,
									71.8363
								],
								[
									133.85766,
									71.38642
								],
								[
									135.56193,
									71.65525
								],
								[
									137.49755,
									71.34763
								],
								[
									138.23409,
									71.62803
								],
								[
									139.86983,
									71.48783
								],
								[
									139.14791,
									72.41619
								],
								[
									140.46817,
									72.84941
								],
								[
									149.5,
									72.2
								],
								[
									150.35118,
									71.60643
								],
								[
									152.9689,
									70.84222
								],
								[
									157.00688,
									71.03141
								],
								[
									158.99779,
									70.86672
								],
								[
									159.83031,
									70.45324
								],
								[
									159.70866,
									69.72198
								],
								[
									160.94053,
									69.43728
								],
								[
									162.27907,
									69.64204
								],
								[
									164.05248,
									69.66823
								],
								[
									165.94037,
									69.47199
								],
								[
									167.83567,
									69.58269
								],
								[
									169.57763,
									68.6938
								],
								[
									170.81688,
									69.01363
								],
								[
									170.0082,
									69.65276
								],
								[
									170.45345,
									70.09703
								],
								[
									173.64391,
									69.81743
								],
								[
									175.72403,
									69.87725
								],
								[
									178.6,
									69.4
								],
								[
									180,
									68.963636
								],
								[
									180,
									64.979709
								],
								[
									179.99281,
									64.97433
								],
								[
									178.7072,
									64.53493
								],
								[
									177.41128,
									64.60821
								],
								[
									178.313,
									64.07593
								],
								[
									178.90825,
									63.25197
								],
								[
									179.37034,
									62.98262
								],
								[
									179.48636,
									62.56894
								],
								[
									179.22825,
									62.3041
								],
								[
									177.3643,
									62.5219
								],
								[
									174.56929,
									61.76915
								],
								[
									173.68013,
									61.65261
								],
								[
									172.15,
									60.95
								],
								[
									170.6985,
									60.33618
								],
								[
									170.33085,
									59.88177
								],
								[
									168.90046,
									60.57355
								],
								[
									166.29498,
									59.78855
								],
								[
									165.84,
									60.16
								],
								[
									164.87674,
									59.7316
								],
								[
									163.53929,
									59.86871
								],
								[
									163.21711,
									59.21101
								],
								[
									162.01733,
									58.24328
								],
								[
									162.05297,
									57.83912
								],
								[
									163.19191,
									57.61503
								],
								[
									163.05794,
									56.15924
								],
								[
									162.12958,
									56.12219
								],
								[
									161.70146,
									55.28568
								],
								[
									162.11749,
									54.85514
								],
								[
									160.36877,
									54.34433
								],
								[
									160.02173,
									53.20257
								],
								[
									158.53094,
									52.95868
								],
								[
									158.23118,
									51.94269
								],
								[
									156.78979,
									51.01105
								],
								[
									156.42,
									51.7
								],
								[
									155.99182,
									53.15895
								],
								[
									155.43366,
									55.38103
								],
								[
									155.91442,
									56.76792
								],
								[
									156.75815,
									57.3647
								],
								[
									156.81035,
									57.83204
								],
								[
									158.36433,
									58.05575
								],
								[
									160.15064,
									59.31477
								],
								[
									161.87204,
									60.343
								],
								[
									163.66969,
									61.1409
								],
								[
									164.47355,
									62.55061
								],
								[
									163.25842,
									62.46627
								],
								[
									162.65791,
									61.6425
								],
								[
									160.12148,
									60.54423
								],
								[
									159.30232,
									61.77396
								],
								[
									156.72068,
									61.43442
								],
								[
									154.21806,
									59.75818
								],
								[
									155.04375,
									59.14495
								],
								[
									152.81185,
									58.88385
								],
								[
									151.26573,
									58.78089
								],
								[
									151.33815,
									59.50396
								],
								[
									149.78371,
									59.65573
								],
								[
									148.54481,
									59.16448
								],
								[
									145.48722,
									59.33637
								],
								[
									142.19782,
									59.03998
								],
								[
									138.95848,
									57.08805
								],
								[
									135.12619,
									54.72959
								],
								[
									136.70171,
									54.60355
								],
								[
									137.19342,
									53.97732
								],
								[
									138.1647,
									53.75501
								],
								[
									138.80463,
									54.25455
								],
								[
									139.90151,
									54.18968
								],
								[
									141.34531,
									53.08957
								],
								[
									141.37923,
									52.23877
								],
								[
									140.59742,
									51.23967
								],
								[
									140.51308,
									50.04553
								],
								[
									140.06193,
									48.44671
								],
								[
									138.55472,
									46.99965
								],
								[
									138.21971,
									46.30795
								],
								[
									136.86232,
									45.1435
								],
								[
									135.51535,
									43.989
								],
								[
									134.86939,
									43.39821
								],
								[
									133.53687,
									42.81147
								],
								[
									132.90627,
									42.79849
								],
								[
									132.27807,
									43.28456
								],
								[
									130.93587,
									42.55274
								],
								[
									130.78,
									42.22
								],
								[
									130.64,
									42.395
								],
								[
									130.633866,
									42.903015
								],
								[
									131.144688,
									42.92999
								],
								[
									131.288555,
									44.11152
								],
								[
									131.02519,
									44.96796
								],
								[
									131.883454,
									45.321162
								],
								[
									133.09712,
									45.14409
								],
								[
									133.769644,
									46.116927
								],
								[
									134.11235,
									47.21248
								],
								[
									134.50081,
									47.57845
								],
								[
									135.026311,
									48.47823
								],
								[
									133.373596,
									48.183442
								],
								[
									132.50669,
									47.78896
								],
								[
									130.98726,
									47.79013
								],
								[
									130.582293,
									48.729687
								],
								[
									129.397818,
									49.4406
								],
								[
									127.6574,
									49.76027
								],
								[
									127.287456,
									50.739797
								],
								[
									126.939157,
									51.353894
								],
								[
									126.564399,
									51.784255
								],
								[
									125.946349,
									52.792799
								],
								[
									125.068211,
									53.161045
								],
								[
									123.57147,
									53.4588
								],
								[
									122.245748,
									53.431726
								],
								[
									121.003085,
									53.251401
								],
								[
									120.177089,
									52.753886
								],
								[
									120.725789,
									52.516226
								],
								[
									120.7382,
									51.96411
								],
								[
									120.18208,
									51.64355
								],
								[
									119.27939,
									50.58292
								],
								[
									119.288461,
									50.142883
								],
								[
									117.879244,
									49.510983
								],
								[
									116.678801,
									49.888531
								],
								[
									115.485695,
									49.805177
								],
								[
									114.96211,
									50.140247
								],
								[
									114.362456,
									50.248303
								],
								[
									112.89774,
									49.543565
								],
								[
									111.581231,
									49.377968
								],
								[
									110.662011,
									49.130128
								],
								[
									109.402449,
									49.292961
								],
								[
									108.475167,
									49.282548
								],
								[
									107.868176,
									49.793705
								],
								[
									106.888804,
									50.274296
								],
								[
									105.886591,
									50.406019
								],
								[
									104.62158,
									50.27532
								],
								[
									103.676545,
									50.089966
								],
								[
									102.25589,
									50.51056
								],
								[
									102.06521,
									51.25991
								],
								[
									100.88948,
									51.516856
								],
								[
									99.981732,
									51.634006
								],
								[
									98.861491,
									52.047366
								],
								[
									97.82574,
									51.010995
								],
								[
									98.231762,
									50.422401
								],
								[
									97.25976,
									49.72605
								],
								[
									95.81402,
									49.97746
								],
								[
									94.815949,
									50.013433
								],
								[
									94.147566,
									50.480537
								],
								[
									93.10421,
									50.49529
								],
								[
									92.234712,
									50.802171
								],
								[
									90.713667,
									50.331812
								],
								[
									88.805567,
									49.470521
								],
								[
									87.751264,
									49.297198
								],
								[
									87.35997,
									49.214981
								],
								[
									86.829357,
									49.826675
								],
								[
									85.54127,
									49.692859
								],
								[
									85.11556,
									50.117303
								],
								[
									84.416377,
									50.3114
								],
								[
									83.935115,
									50.889246
								],
								[
									83.383004,
									51.069183
								],
								[
									81.945986,
									50.812196
								],
								[
									80.568447,
									51.388336
								],
								[
									80.03556,
									50.864751
								],
								[
									77.800916,
									53.404415
								],
								[
									76.525179,
									54.177003
								],
								[
									76.8911,
									54.490524
								],
								[
									74.38482,
									53.54685
								],
								[
									73.425679,
									53.48981
								],
								[
									73.508516,
									54.035617
								],
								[
									72.22415,
									54.376655
								],
								[
									71.180131,
									54.133285
								],
								[
									70.865267,
									55.169734
								],
								[
									69.068167,
									55.38525
								],
								[
									68.1691,
									54.970392
								],
								[
									65.66687,
									54.60125
								],
								[
									65.178534,
									54.354228
								],
								[
									61.4366,
									54.00625
								],
								[
									60.978066,
									53.664993
								],
								[
									61.699986,
									52.979996
								],
								[
									60.739993,
									52.719986
								],
								[
									60.927269,
									52.447548
								],
								[
									59.967534,
									51.96042
								],
								[
									61.588003,
									51.272659
								],
								[
									61.337424,
									50.79907
								],
								[
									59.932807,
									50.842194
								],
								[
									59.642282,
									50.545442
								],
								[
									58.36332,
									51.06364
								],
								[
									56.77798,
									51.04355
								],
								[
									55.71694,
									50.62171
								],
								[
									54.532878,
									51.02624
								],
								[
									52.328724,
									51.718652
								],
								[
									50.766648,
									51.692762
								],
								[
									48.702382,
									50.605128
								],
								[
									48.577841,
									49.87476
								],
								[
									47.54948,
									50.454698
								],
								[
									46.751596,
									49.356006
								],
								[
									47.043672,
									49.152039
								],
								[
									46.466446,
									48.394152
								],
								[
									47.31524,
									47.71585
								],
								[
									48.05725,
									47.74377
								],
								[
									48.694734,
									47.075628
								],
								[
									48.59325,
									46.56104
								],
								[
									49.10116,
									46.39933
								],
								[
									48.64541,
									45.80629
								],
								[
									47.67591,
									45.64149
								],
								[
									46.68201,
									44.6092
								],
								[
									47.59094,
									43.66016
								],
								[
									47.49252,
									42.98658
								],
								[
									48.58437,
									41.80888
								],
								[
									47.987283,
									41.405819
								],
								[
									47.815666,
									41.151416
								],
								[
									47.373315,
									41.219732
								],
								[
									46.686071,
									41.827137
								],
								[
									46.404951,
									41.860675
								],
								[
									45.7764,
									42.09244
								],
								[
									45.470279,
									42.502781
								],
								[
									44.537623,
									42.711993
								],
								[
									43.93121,
									42.55496
								],
								[
									43.75599,
									42.74083
								],
								[
									42.3944,
									43.2203
								],
								[
									40.92219,
									43.38215
								],
								[
									40.076965,
									43.553104
								],
								[
									39.955009,
									43.434998
								],
								[
									38.68,
									44.28
								],
								[
									37.53912,
									44.65721
								],
								[
									36.67546,
									45.24469
								],
								[
									37.40317,
									45.40451
								],
								[
									38.23295,
									46.24087
								],
								[
									37.67372,
									46.63657
								],
								[
									39.14767,
									47.04475
								],
								[
									39.1212,
									47.26336
								],
								[
									38.223538,
									47.10219
								],
								[
									38.255112,
									47.5464
								],
								[
									38.77057,
									47.82562
								],
								[
									39.738278,
									47.898937
								],
								[
									39.89562,
									48.23241
								],
								[
									39.67465,
									48.78382
								],
								[
									40.080789,
									49.30743
								],
								[
									40.06904,
									49.60105
								],
								[
									38.594988,
									49.926462
								],
								[
									38.010631,
									49.915662
								],
								[
									37.39346,
									50.383953
								],
								[
									36.626168,
									50.225591
								],
								[
									35.356116,
									50.577197
								],
								[
									35.37791,
									50.77394
								],
								[
									35.022183,
									51.207572
								],
								[
									34.224816,
									51.255993
								],
								[
									34.141978,
									51.566413
								],
								[
									34.391731,
									51.768882
								],
								[
									33.7527,
									52.335075
								],
								[
									32.715761,
									52.238465
								],
								[
									32.412058,
									52.288695
								],
								[
									32.15944,
									52.06125
								],
								[
									31.78597,
									52.10168
								],
								[
									31.540018,
									52.742052
								],
								[
									31.305201,
									53.073996
								],
								[
									31.49764,
									53.16743
								],
								[
									32.304519,
									53.132726
								],
								[
									32.693643,
									53.351421
								],
								[
									32.405599,
									53.618045
								],
								[
									31.731273,
									53.794029
								],
								[
									31.791424,
									53.974639
								],
								[
									31.384472,
									54.157056
								],
								[
									30.757534,
									54.811771
								],
								[
									30.971836,
									55.081548
								],
								[
									30.873909,
									55.550976
								],
								[
									29.896294,
									55.789463
								],
								[
									29.371572,
									55.670091
								],
								[
									29.229513,
									55.918344
								],
								[
									28.176709,
									56.16913
								],
								[
									27.855282,
									56.759326
								],
								[
									27.770016,
									57.244258
								],
								[
									27.288185,
									57.474528
								],
								[
									27.716686,
									57.791899
								],
								[
									27.42015,
									58.72457
								],
								[
									28.131699,
									59.300825
								],
								[
									27.98112,
									59.47537
								],
								[
									29.1177,
									60.02805
								],
								[
									28.07,
									60.50352
								],
								[
									30.211107,
									61.780028
								],
								[
									31.139991,
									62.357693
								],
								[
									31.516092,
									62.867687
								],
								[
									30.035872,
									63.552814
								],
								[
									30.444685,
									64.204453
								],
								[
									29.54443,
									64.948672
								],
								[
									30.21765,
									65.80598
								],
								[
									29.054589,
									66.944286
								],
								[
									29.977426,
									67.698297
								],
								[
									28.445944,
									68.364613
								],
								[
									28.59193,
									69.064777
								],
								[
									29.39955,
									69.15692
								],
								[
									31.10108,
									69.55811
								],
								[
									32.13272,
									69.90595
								],
								[
									33.77547,
									69.30142
								],
								[
									36.51396,
									69.06342
								],
								[
									40.29234,
									67.9324
								],
								[
									41.05987,
									67.45713
								],
								[
									41.12595,
									66.79158
								],
								[
									40.01583,
									66.26618
								],
								[
									38.38295,
									65.99953
								],
								[
									33.91871,
									66.75961
								],
								[
									33.18444,
									66.63253
								],
								[
									34.81477,
									65.90015
								],
								[
									34.878574,
									65.436213
								],
								[
									34.94391,
									64.41437
								],
								[
									36.23129,
									64.10945
								],
								[
									37.01273,
									63.84983
								],
								[
									37.14197,
									64.33471
								],
								[
									36.539579,
									64.76446
								],
								[
									37.17604,
									65.14322
								],
								[
									39.59345,
									64.52079
								],
								[
									40.4356,
									64.76446
								],
								[
									39.7626,
									65.49682
								],
								[
									42.09309,
									66.47623
								],
								[
									43.01604,
									66.41858
								],
								[
									43.94975,
									66.06908
								],
								[
									44.53226,
									66.75634
								],
								[
									43.69839,
									67.35245
								],
								[
									44.18795,
									67.95051
								],
								[
									43.45282,
									68.57079
								],
								[
									46.25,
									68.25
								],
								[
									46.82134,
									67.68997
								],
								[
									45.55517,
									67.56652
								],
								[
									45.56202,
									67.01005
								],
								[
									46.34915,
									66.66767
								],
								[
									47.89416,
									66.88455
								],
								[
									48.13876,
									67.52238
								],
								[
									50.22766,
									67.99867
								],
								[
									53.71743,
									68.85738
								],
								[
									54.47171,
									68.80815
								],
								[
									53.48582,
									68.20131
								],
								[
									54.72628,
									68.09702
								],
								[
									55.44268,
									68.43866
								],
								[
									57.31702,
									68.46628
								],
								[
									58.802,
									68.88082
								],
								[
									59.94142,
									68.27844
								],
								[
									61.07784,
									68.94069
								],
								[
									60.03,
									69.52
								],
								[
									60.55,
									69.85
								],
								[
									63.504,
									69.54739
								],
								[
									64.888115,
									69.234835
								],
								[
									68.51216,
									68.09233
								],
								[
									69.18068,
									68.61563
								],
								[
									68.16444,
									69.14436
								],
								[
									68.13522,
									69.35649
								],
								[
									66.93008,
									69.45461
								],
								[
									67.25976,
									69.92873
								],
								[
									66.72492,
									70.70889
								],
								[
									66.69466,
									71.02897
								],
								[
									68.54006,
									71.9345
								],
								[
									69.19636,
									72.84336
								],
								[
									69.94,
									73.04
								],
								[
									72.58754,
									72.77629
								],
								[
									72.79603,
									72.22006
								],
								[
									71.84811,
									71.40898
								],
								[
									72.47011,
									71.09019
								],
								[
									72.79188,
									70.39114
								],
								[
									72.5647,
									69.02085
								],
								[
									73.66787,
									68.4079
								],
								[
									73.2387,
									67.7404
								],
								[
									71.28,
									66.32
								],
								[
									72.42301,
									66.17267
								],
								[
									72.82077,
									66.53267
								],
								[
									73.92099,
									66.78946
								],
								[
									74.18651,
									67.28429
								],
								[
									75.052,
									67.76047
								],
								[
									74.46926,
									68.32899
								],
								[
									74.93584,
									68.98918
								],
								[
									73.84236,
									69.07146
								],
								[
									73.60187,
									69.62763
								],
								[
									74.3998,
									70.63175
								],
								[
									73.1011,
									71.44717
								],
								[
									74.89082,
									72.12119
								],
								[
									74.65926,
									72.83227
								],
								[
									75.15801,
									72.85497
								],
								[
									75.68351,
									72.30056
								],
								[
									75.28898,
									71.33556
								],
								[
									76.35911,
									71.15287
								],
								[
									75.90313,
									71.87401
								],
								[
									77.57665,
									72.26717
								],
								[
									79.65202,
									72.32011
								],
								[
									81.5,
									71.75
								],
								[
									80.61071,
									72.58285
								],
								[
									80.51109,
									73.6482
								],
								[
									82.25,
									73.85
								],
								[
									84.65526,
									73.80591
								],
								[
									86.8223,
									73.93688
								],
								[
									86.00956,
									74.45967
								],
								[
									87.16682,
									75.11643
								],
								[
									88.31571,
									75.14393
								],
								[
									90.26,
									75.64
								],
								[
									92.90058,
									75.77333
								],
								[
									93.23421,
									76.0472
								],
								[
									95.86,
									76.14
								],
								[
									96.67821,
									75.91548
								],
								[
									98.92254,
									76.44689
								],
								[
									100.75967,
									76.43028
								],
								[
									101.03532,
									76.86189
								],
								[
									101.99084,
									77.28754
								],
								[
									104.3516,
									77.69792
								],
								[
									106.06664,
									77.37389
								],
								[
									104.705,
									77.1274
								],
								[
									106.97013,
									76.97419
								]
							]
						],
						[
							[
								[
									105.07547,
									78.30689
								],
								[
									99.43814,
									77.921
								],
								[
									101.2649,
									79.23399
								],
								[
									102.08635,
									79.34641
								],
								[
									102.837815,
									79.28129
								],
								[
									105.37243,
									78.71334
								],
								[
									105.07547,
									78.30689
								]
							]
						],
						[
							[
								[
									51.136187,
									80.54728
								],
								[
									49.793685,
									80.415428
								],
								[
									48.894411,
									80.339567
								],
								[
									48.754937,
									80.175468
								],
								[
									47.586119,
									80.010181
								],
								[
									46.502826,
									80.247247
								],
								[
									47.072455,
									80.559424
								],
								[
									44.846958,
									80.58981
								],
								[
									46.799139,
									80.771918
								],
								[
									48.318477,
									80.78401
								],
								[
									48.522806,
									80.514569
								],
								[
									49.09719,
									80.753986
								],
								[
									50.039768,
									80.918885
								],
								[
									51.522933,
									80.699726
								],
								[
									51.136187,
									80.54728
								]
							]
						],
						[
							[
								[
									99.93976,
									78.88094
								],
								[
									97.75794,
									78.7562
								],
								[
									94.97259,
									79.044745
								],
								[
									93.31288,
									79.4265
								],
								[
									92.5454,
									80.14379
								],
								[
									91.18107,
									80.34146
								],
								[
									93.77766,
									81.0246
								],
								[
									95.940895,
									81.2504
								],
								[
									97.88385,
									80.746975
								],
								[
									100.186655,
									79.780135
								],
								[
									99.93976,
									78.88094
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "RWA",
				"properties": {
					"name": "Rwanda"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								30.419105,
								-1.134659
							],
							[
								30.816135,
								-1.698914
							],
							[
								30.758309,
								-2.28725
							],
							[
								30.469696,
								-2.413858
							],
							[
								29.938359,
								-2.348487
							],
							[
								29.632176,
								-2.917858
							],
							[
								29.024926,
								-2.839258
							],
							[
								29.117479,
								-2.292211
							],
							[
								29.254835,
								-2.21511
							],
							[
								29.291887,
								-1.620056
							],
							[
								29.579466,
								-1.341313
							],
							[
								29.821519,
								-1.443322
							],
							[
								30.419105,
								-1.134659
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ESH",
				"properties": {
					"name": "Western Sahara"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-8.794884,
								27.120696
							],
							[
								-8.817828,
								27.656426
							],
							[
								-8.66559,
								27.656426
							],
							[
								-8.665124,
								27.589479
							],
							[
								-8.6844,
								27.395744
							],
							[
								-8.687294,
								25.881056
							],
							[
								-11.969419,
								25.933353
							],
							[
								-11.937224,
								23.374594
							],
							[
								-12.874222,
								23.284832
							],
							[
								-13.118754,
								22.77122
							],
							[
								-12.929102,
								21.327071
							],
							[
								-16.845194,
								21.333323
							],
							[
								-17.063423,
								20.999752
							],
							[
								-17.020428,
								21.42231
							],
							[
								-17.002962,
								21.420734
							],
							[
								-14.750955,
								21.5006
							],
							[
								-14.630833,
								21.86094
							],
							[
								-14.221168,
								22.310163
							],
							[
								-13.89111,
								23.691009
							],
							[
								-12.500963,
								24.770116
							],
							[
								-12.030759,
								26.030866
							],
							[
								-11.71822,
								26.104092
							],
							[
								-11.392555,
								26.883424
							],
							[
								-10.551263,
								26.990808
							],
							[
								-10.189424,
								26.860945
							],
							[
								-9.735343,
								26.860945
							],
							[
								-9.413037,
								27.088476
							],
							[
								-8.794884,
								27.120696
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SAU",
				"properties": {
					"name": "Saudi Arabia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								42.779332,
								16.347891
							],
							[
								42.649573,
								16.774635
							],
							[
								42.347989,
								17.075806
							],
							[
								42.270888,
								17.474722
							],
							[
								41.754382,
								17.833046
							],
							[
								41.221391,
								18.6716
							],
							[
								40.939341,
								19.486485
							],
							[
								40.247652,
								20.174635
							],
							[
								39.801685,
								20.338862
							],
							[
								39.139399,
								21.291905
							],
							[
								39.023696,
								21.986875
							],
							[
								39.066329,
								22.579656
							],
							[
								38.492772,
								23.688451
							],
							[
								38.02386,
								24.078686
							],
							[
								37.483635,
								24.285495
							],
							[
								37.154818,
								24.858483
							],
							[
								37.209491,
								25.084542
							],
							[
								36.931627,
								25.602959
							],
							[
								36.639604,
								25.826228
							],
							[
								36.249137,
								26.570136
							],
							[
								35.640182,
								27.37652
							],
							[
								35.130187,
								28.063352
							],
							[
								34.632336,
								28.058546
							],
							[
								34.787779,
								28.607427
							],
							[
								34.83222,
								28.957483
							],
							[
								34.956037,
								29.356555
							],
							[
								36.068941,
								29.197495
							],
							[
								36.501214,
								29.505254
							],
							[
								36.740528,
								29.865283
							],
							[
								37.503582,
								30.003776
							],
							[
								37.66812,
								30.338665
							],
							[
								37.998849,
								30.5085
							],
							[
								37.002166,
								31.508413
							],
							[
								39.004886,
								32.010217
							],
							[
								39.195468,
								32.161009
							],
							[
								40.399994,
								31.889992
							],
							[
								41.889981,
								31.190009
							],
							[
								44.709499,
								29.178891
							],
							[
								46.568713,
								29.099025
							],
							[
								47.459822,
								29.002519
							],
							[
								47.708851,
								28.526063
							],
							[
								48.416094,
								28.552004
							],
							[
								48.807595,
								27.689628
							],
							[
								49.299554,
								27.461218
							],
							[
								49.470914,
								27.109999
							],
							[
								50.152422,
								26.689663
							],
							[
								50.212935,
								26.277027
							],
							[
								50.113303,
								25.943972
							],
							[
								50.239859,
								25.60805
							],
							[
								50.527387,
								25.327808
							],
							[
								50.660557,
								24.999896
							],
							[
								50.810108,
								24.754743
							],
							[
								51.112415,
								24.556331
							],
							[
								51.389608,
								24.627386
							],
							[
								51.579519,
								24.245497
							],
							[
								51.617708,
								24.014219
							],
							[
								52.000733,
								23.001154
							],
							[
								55.006803,
								22.496948
							],
							[
								55.208341,
								22.70833
							],
							[
								55.666659,
								22.000001
							],
							[
								54.999982,
								19.999994
							],
							[
								52.00001,
								19.000003
							],
							[
								49.116672,
								18.616668
							],
							[
								48.183344,
								18.166669
							],
							[
								47.466695,
								17.116682
							],
							[
								47.000005,
								16.949999
							],
							[
								46.749994,
								17.283338
							],
							[
								46.366659,
								17.233315
							],
							[
								45.399999,
								17.333335
							],
							[
								45.216651,
								17.433329
							],
							[
								44.062613,
								17.410359
							],
							[
								43.791519,
								17.319977
							],
							[
								43.380794,
								17.579987
							],
							[
								43.115798,
								17.08844
							],
							[
								43.218375,
								16.66689
							],
							[
								42.779332,
								16.347891
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SDN",
				"properties": {
					"name": "Sudan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								33.963393,
								9.464285
							],
							[
								33.824963,
								9.484061
							],
							[
								33.842131,
								9.981915
							],
							[
								33.721959,
								10.325262
							],
							[
								33.206938,
								10.720112
							],
							[
								33.086766,
								11.441141
							],
							[
								33.206938,
								12.179338
							],
							[
								32.743419,
								12.248008
							],
							[
								32.67475,
								12.024832
							],
							[
								32.073892,
								11.97333
							],
							[
								32.314235,
								11.681484
							],
							[
								32.400072,
								11.080626
							],
							[
								31.850716,
								10.531271
							],
							[
								31.352862,
								9.810241
							],
							[
								30.837841,
								9.707237
							],
							[
								29.996639,
								10.290927
							],
							[
								29.618957,
								10.084919
							],
							[
								29.515953,
								9.793074
							],
							[
								29.000932,
								9.604232
							],
							[
								28.966597,
								9.398224
							],
							[
								27.97089,
								9.398224
							],
							[
								27.833551,
								9.604232
							],
							[
								27.112521,
								9.638567
							],
							[
								26.752006,
								9.466893
							],
							[
								26.477328,
								9.55273
							],
							[
								25.962307,
								10.136421
							],
							[
								25.790633,
								10.411099
							],
							[
								25.069604,
								10.27376
							],
							[
								24.794926,
								9.810241
							],
							[
								24.537415,
								8.917538
							],
							[
								24.194068,
								8.728696
							],
							[
								23.88698,
								8.61973
							],
							[
								23.805813,
								8.666319
							],
							[
								23.459013,
								8.954286
							],
							[
								23.394779,
								9.265068
							],
							[
								23.55725,
								9.681218
							],
							[
								23.554304,
								10.089255
							],
							[
								22.977544,
								10.714463
							],
							[
								22.864165,
								11.142395
							],
							[
								22.87622,
								11.38461
							],
							[
								22.50869,
								11.67936
							],
							[
								22.49762,
								12.26024
							],
							[
								22.28801,
								12.64605
							],
							[
								21.93681,
								12.58818
							],
							[
								22.03759,
								12.95546
							],
							[
								22.29658,
								13.37232
							],
							[
								22.18329,
								13.78648
							],
							[
								22.51202,
								14.09318
							],
							[
								22.30351,
								14.32682
							],
							[
								22.56795,
								14.94429
							],
							[
								23.02459,
								15.68072
							],
							[
								23.88689,
								15.61084
							],
							[
								23.83766,
								19.58047
							],
							[
								23.85,
								20
							],
							[
								25,
								20.00304
							],
							[
								25,
								22
							],
							[
								29.02,
								22
							],
							[
								32.9,
								22
							],
							[
								36.86623,
								22
							],
							[
								37.18872,
								21.01885
							],
							[
								36.96941,
								20.83744
							],
							[
								37.1147,
								19.80796
							],
							[
								37.48179,
								18.61409
							],
							[
								37.86276,
								18.36786
							],
							[
								38.41009,
								17.998307
							],
							[
								37.904,
								17.42754
							],
							[
								37.16747,
								17.26314
							],
							[
								36.85253,
								16.95655
							],
							[
								36.75389,
								16.29186
							],
							[
								36.32322,
								14.82249
							],
							[
								36.42951,
								14.42211
							],
							[
								36.27022,
								13.56333
							],
							[
								35.86363,
								12.57828
							],
							[
								35.26049,
								12.08286
							],
							[
								34.83163,
								11.31896
							],
							[
								34.73115,
								10.91017
							],
							[
								34.25745,
								10.63009
							],
							[
								33.96162,
								9.58358
							],
							[
								33.963393,
								9.464285
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SSD",
				"properties": {
					"name": "South Sudan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								33.963393,
								9.464285
							],
							[
								33.97498,
								8.68456
							],
							[
								33.8255,
								8.37916
							],
							[
								33.2948,
								8.35458
							],
							[
								32.95418,
								7.78497
							],
							[
								33.56829,
								7.71334
							],
							[
								34.0751,
								7.22595
							],
							[
								34.25032,
								6.82607
							],
							[
								34.70702,
								6.59422
							],
							[
								35.298007,
								5.506
							],
							[
								34.620196,
								4.847123
							],
							[
								34.005,
								4.249885
							],
							[
								33.39,
								3.79
							],
							[
								32.68642,
								3.79232
							],
							[
								31.88145,
								3.55827
							],
							[
								31.24556,
								3.7819
							],
							[
								30.83385,
								3.50917
							],
							[
								29.95349,
								4.1737
							],
							[
								29.715995,
								4.600805
							],
							[
								29.159078,
								4.389267
							],
							[
								28.696678,
								4.455077
							],
							[
								28.428994,
								4.287155
							],
							[
								27.979977,
								4.408413
							],
							[
								27.374226,
								5.233944
							],
							[
								27.213409,
								5.550953
							],
							[
								26.465909,
								5.946717
							],
							[
								26.213418,
								6.546603
							],
							[
								25.796648,
								6.979316
							],
							[
								25.124131,
								7.500085
							],
							[
								25.114932,
								7.825104
							],
							[
								24.567369,
								8.229188
							],
							[
								23.88698,
								8.61973
							],
							[
								24.194068,
								8.728696
							],
							[
								24.537415,
								8.917538
							],
							[
								24.794926,
								9.810241
							],
							[
								25.069604,
								10.27376
							],
							[
								25.790633,
								10.411099
							],
							[
								25.962307,
								10.136421
							],
							[
								26.477328,
								9.55273
							],
							[
								26.752006,
								9.466893
							],
							[
								27.112521,
								9.638567
							],
							[
								27.833551,
								9.604232
							],
							[
								27.97089,
								9.398224
							],
							[
								28.966597,
								9.398224
							],
							[
								29.000932,
								9.604232
							],
							[
								29.515953,
								9.793074
							],
							[
								29.618957,
								10.084919
							],
							[
								29.996639,
								10.290927
							],
							[
								30.837841,
								9.707237
							],
							[
								31.352862,
								9.810241
							],
							[
								31.850716,
								10.531271
							],
							[
								32.400072,
								11.080626
							],
							[
								32.314235,
								11.681484
							],
							[
								32.073892,
								11.97333
							],
							[
								32.67475,
								12.024832
							],
							[
								32.743419,
								12.248008
							],
							[
								33.206938,
								12.179338
							],
							[
								33.086766,
								11.441141
							],
							[
								33.206938,
								10.720112
							],
							[
								33.721959,
								10.325262
							],
							[
								33.842131,
								9.981915
							],
							[
								33.824963,
								9.484061
							],
							[
								33.963393,
								9.464285
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SEN",
				"properties": {
					"name": "Senegal"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-16.713729,
								13.594959
							],
							[
								-17.126107,
								14.373516
							],
							[
								-17.625043,
								14.729541
							],
							[
								-17.185173,
								14.919477
							],
							[
								-16.700706,
								15.621527
							],
							[
								-16.463098,
								16.135036
							],
							[
								-16.12069,
								16.455663
							],
							[
								-15.623666,
								16.369337
							],
							[
								-15.135737,
								16.587282
							],
							[
								-14.577348,
								16.598264
							],
							[
								-14.099521,
								16.304302
							],
							[
								-13.435738,
								16.039383
							],
							[
								-12.830658,
								15.303692
							],
							[
								-12.17075,
								14.616834
							],
							[
								-12.124887,
								13.994727
							],
							[
								-11.927716,
								13.422075
							],
							[
								-11.553398,
								13.141214
							],
							[
								-11.467899,
								12.754519
							],
							[
								-11.513943,
								12.442988
							],
							[
								-11.658301,
								12.386583
							],
							[
								-12.203565,
								12.465648
							],
							[
								-12.278599,
								12.35444
							],
							[
								-12.499051,
								12.33209
							],
							[
								-13.217818,
								12.575874
							],
							[
								-13.700476,
								12.586183
							],
							[
								-15.548477,
								12.62817
							],
							[
								-15.816574,
								12.515567
							],
							[
								-16.147717,
								12.547762
							],
							[
								-16.677452,
								12.384852
							],
							[
								-16.841525,
								13.151394
							],
							[
								-15.931296,
								13.130284
							],
							[
								-15.691001,
								13.270353
							],
							[
								-15.511813,
								13.27857
							],
							[
								-15.141163,
								13.509512
							],
							[
								-14.712197,
								13.298207
							],
							[
								-14.277702,
								13.280585
							],
							[
								-13.844963,
								13.505042
							],
							[
								-14.046992,
								13.794068
							],
							[
								-14.376714,
								13.62568
							],
							[
								-14.687031,
								13.630357
							],
							[
								-15.081735,
								13.876492
							],
							[
								-15.39877,
								13.860369
							],
							[
								-15.624596,
								13.623587
							],
							[
								-16.713729,
								13.594959
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SLB",
				"properties": {
					"name": "Solomon Islands"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									162.119025,
									-10.482719
								],
								[
									162.398646,
									-10.826367
								],
								[
									161.700032,
									-10.820011
								],
								[
									161.319797,
									-10.204751
								],
								[
									161.917383,
									-10.446701
								],
								[
									162.119025,
									-10.482719
								]
							]
						],
						[
							[
								[
									160.852229,
									-9.872937
								],
								[
									160.462588,
									-9.89521
								],
								[
									159.849447,
									-9.794027
								],
								[
									159.640003,
									-9.63998
								],
								[
									159.702945,
									-9.24295
								],
								[
									160.362956,
									-9.400304
								],
								[
									160.688518,
									-9.610162
								],
								[
									160.852229,
									-9.872937
								]
							]
						],
						[
							[
								[
									161.679982,
									-9.599982
								],
								[
									161.529397,
									-9.784312
								],
								[
									160.788253,
									-8.917543
								],
								[
									160.579997,
									-8.320009
								],
								[
									160.920028,
									-8.320009
								],
								[
									161.280006,
									-9.120011
								],
								[
									161.679982,
									-9.599982
								]
							]
						],
						[
							[
								[
									159.875027,
									-8.33732
								],
								[
									159.917402,
									-8.53829
								],
								[
									159.133677,
									-8.114181
								],
								[
									158.586114,
									-7.754824
								],
								[
									158.21115,
									-7.421872
								],
								[
									158.359978,
									-7.320018
								],
								[
									158.820001,
									-7.560003
								],
								[
									159.640003,
									-8.020027
								],
								[
									159.875027,
									-8.33732
								]
							]
						],
						[
							[
								[
									157.538426,
									-7.34782
								],
								[
									157.33942,
									-7.404767
								],
								[
									156.90203,
									-7.176874
								],
								[
									156.491358,
									-6.765943
								],
								[
									156.542828,
									-6.599338
								],
								[
									157.14,
									-7.021638
								],
								[
									157.538426,
									-7.34782
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SLE",
				"properties": {
					"name": "Sierra Leone"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-11.438779,
								6.785917
							],
							[
								-11.708195,
								6.860098
							],
							[
								-12.428099,
								7.262942
							],
							[
								-12.949049,
								7.798646
							],
							[
								-13.124025,
								8.163946
							],
							[
								-13.24655,
								8.903049
							],
							[
								-12.711958,
								9.342712
							],
							[
								-12.596719,
								9.620188
							],
							[
								-12.425929,
								9.835834
							],
							[
								-12.150338,
								9.858572
							],
							[
								-11.917277,
								10.046984
							],
							[
								-11.117481,
								10.045873
							],
							[
								-10.839152,
								9.688246
							],
							[
								-10.622395,
								9.26791
							],
							[
								-10.65477,
								8.977178
							],
							[
								-10.494315,
								8.715541
							],
							[
								-10.505477,
								8.348896
							],
							[
								-10.230094,
								8.406206
							],
							[
								-10.695595,
								7.939464
							],
							[
								-11.146704,
								7.396706
							],
							[
								-11.199802,
								7.105846
							],
							[
								-11.438779,
								6.785917
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SLV",
				"properties": {
					"name": "El Salvador"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-87.793111,
								13.38448
							],
							[
								-87.904112,
								13.149017
							],
							[
								-88.483302,
								13.163951
							],
							[
								-88.843228,
								13.259734
							],
							[
								-89.256743,
								13.458533
							],
							[
								-89.812394,
								13.520622
							],
							[
								-90.095555,
								13.735338
							],
							[
								-90.064678,
								13.88197
							],
							[
								-89.721934,
								14.134228
							],
							[
								-89.534219,
								14.244816
							],
							[
								-89.587343,
								14.362586
							],
							[
								-89.353326,
								14.424133
							],
							[
								-89.058512,
								14.340029
							],
							[
								-88.843073,
								14.140507
							],
							[
								-88.541231,
								13.980155
							],
							[
								-88.503998,
								13.845486
							],
							[
								-88.065343,
								13.964626
							],
							[
								-87.859515,
								13.893312
							],
							[
								-87.723503,
								13.78505
							],
							[
								-87.793111,
								13.38448
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "-99",
				"properties": {
					"name": "Somaliland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								48.93813,
								9.451749
							],
							[
								48.486736,
								8.837626
							],
							[
								47.78942,
								8.003
							],
							[
								46.948328,
								7.996877
							],
							[
								43.67875,
								9.18358
							],
							[
								43.296975,
								9.540477
							],
							[
								42.92812,
								10.02194
							],
							[
								42.55876,
								10.57258
							],
							[
								42.776852,
								10.926879
							],
							[
								43.145305,
								11.46204
							],
							[
								43.47066,
								11.27771
							],
							[
								43.666668,
								10.864169
							],
							[
								44.117804,
								10.445538
							],
							[
								44.614259,
								10.442205
							],
							[
								45.556941,
								10.698029
							],
							[
								46.645401,
								10.816549
							],
							[
								47.525658,
								11.127228
							],
							[
								48.021596,
								11.193064
							],
							[
								48.378784,
								11.375482
							],
							[
								48.948206,
								11.410622
							],
							[
								48.942005,
								11.394266
							],
							[
								48.938491,
								10.982327
							],
							[
								48.938233,
								9.9735
							],
							[
								48.93813,
								9.451749
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SOM",
				"properties": {
					"name": "Somalia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								49.72862,
								11.5789
							],
							[
								50.25878,
								11.67957
							],
							[
								50.73202,
								12.0219
							],
							[
								51.1112,
								12.02464
							],
							[
								51.13387,
								11.74815
							],
							[
								51.04153,
								11.16651
							],
							[
								51.04531,
								10.6409
							],
							[
								50.83418,
								10.27972
							],
							[
								50.55239,
								9.19874
							],
							[
								50.07092,
								8.08173
							],
							[
								49.4527,
								6.80466
							],
							[
								48.59455,
								5.33911
							],
							[
								47.74079,
								4.2194
							],
							[
								46.56476,
								2.85529
							],
							[
								45.56399,
								2.04576
							],
							[
								44.06815,
								1.05283
							],
							[
								43.13597,
								0.2922
							],
							[
								42.04157,
								-0.91916
							],
							[
								41.81095,
								-1.44647
							],
							[
								41.58513,
								-1.68325
							],
							[
								40.993,
								-0.85829
							],
							[
								40.98105,
								2.78452
							],
							[
								41.855083,
								3.918912
							],
							[
								42.12861,
								4.23413
							],
							[
								42.76967,
								4.25259
							],
							[
								43.66087,
								4.95755
							],
							[
								44.9636,
								5.00162
							],
							[
								47.78942,
								8.003
							],
							[
								48.486736,
								8.837626
							],
							[
								48.93813,
								9.451749
							],
							[
								48.938233,
								9.9735
							],
							[
								48.938491,
								10.982327
							],
							[
								48.942005,
								11.394266
							],
							[
								48.948205,
								11.410617
							],
							[
								49.26776,
								11.43033
							],
							[
								49.72862,
								11.5789
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SRB",
				"properties": {
					"name": "Republic of Serbia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								20.874313,
								45.416375
							],
							[
								21.483526,
								45.18117
							],
							[
								21.562023,
								44.768947
							],
							[
								22.145088,
								44.478422
							],
							[
								22.459022,
								44.702517
							],
							[
								22.705726,
								44.578003
							],
							[
								22.474008,
								44.409228
							],
							[
								22.65715,
								44.234923
							],
							[
								22.410446,
								44.008063
							],
							[
								22.500157,
								43.642814
							],
							[
								22.986019,
								43.211161
							],
							[
								22.604801,
								42.898519
							],
							[
								22.436595,
								42.580321
							],
							[
								22.545012,
								42.461362
							],
							[
								22.380526,
								42.32026
							],
							[
								21.91708,
								42.30364
							],
							[
								21.576636,
								42.245224
							],
							[
								21.54332,
								42.32025
							],
							[
								21.66292,
								42.43922
							],
							[
								21.77505,
								42.6827
							],
							[
								21.63302,
								42.67717
							],
							[
								21.43866,
								42.86255
							],
							[
								21.27421,
								42.90959
							],
							[
								21.143395,
								43.068685
							],
							[
								20.95651,
								43.13094
							],
							[
								20.81448,
								43.27205
							],
							[
								20.63508,
								43.21671
							],
							[
								20.49679,
								42.88469
							],
							[
								20.25758,
								42.81275
							],
							[
								20.3398,
								42.89852
							],
							[
								19.95857,
								43.10604
							],
							[
								19.63,
								43.21378
							],
							[
								19.48389,
								43.35229
							],
							[
								19.21852,
								43.52384
							],
							[
								19.454,
								43.5681
							],
							[
								19.59976,
								44.03847
							],
							[
								19.11761,
								44.42307
							],
							[
								19.36803,
								44.863
							],
							[
								19.00548,
								44.86023
							],
							[
								19.390476,
								45.236516
							],
							[
								19.072769,
								45.521511
							],
							[
								18.82982,
								45.90888
							],
							[
								19.596045,
								46.17173
							],
							[
								20.220192,
								46.127469
							],
							[
								20.762175,
								45.734573
							],
							[
								20.874313,
								45.416375
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SUR",
				"properties": {
					"name": "Suriname"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-57.147436,
								5.97315
							],
							[
								-55.949318,
								5.772878
							],
							[
								-55.84178,
								5.953125
							],
							[
								-55.03325,
								6.025291
							],
							[
								-53.958045,
								5.756548
							],
							[
								-54.478633,
								4.896756
							],
							[
								-54.399542,
								4.212611
							],
							[
								-54.006931,
								3.620038
							],
							[
								-54.181726,
								3.18978
							],
							[
								-54.269705,
								2.732392
							],
							[
								-54.524754,
								2.311849
							],
							[
								-55.097587,
								2.523748
							],
							[
								-55.569755,
								2.421506
							],
							[
								-55.973322,
								2.510364
							],
							[
								-56.073342,
								2.220795
							],
							[
								-55.9056,
								2.021996
							],
							[
								-55.995698,
								1.817667
							],
							[
								-56.539386,
								1.899523
							],
							[
								-57.150098,
								2.768927
							],
							[
								-57.281433,
								3.333492
							],
							[
								-57.601569,
								3.334655
							],
							[
								-58.044694,
								4.060864
							],
							[
								-57.86021,
								4.576801
							],
							[
								-57.914289,
								4.812626
							],
							[
								-57.307246,
								5.073567
							],
							[
								-57.147436,
								5.97315
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SVK",
				"properties": {
					"name": "Slovakia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								18.853144,
								49.49623
							],
							[
								18.909575,
								49.435846
							],
							[
								19.320713,
								49.571574
							],
							[
								19.825023,
								49.217125
							],
							[
								20.415839,
								49.431453
							],
							[
								20.887955,
								49.328772
							],
							[
								21.607808,
								49.470107
							],
							[
								22.558138,
								49.085738
							],
							[
								22.280842,
								48.825392
							],
							[
								22.085608,
								48.422264
							],
							[
								21.872236,
								48.319971
							],
							[
								20.801294,
								48.623854
							],
							[
								20.473562,
								48.56285
							],
							[
								20.239054,
								48.327567
							],
							[
								19.769471,
								48.202691
							],
							[
								19.661364,
								48.266615
							],
							[
								19.174365,
								48.111379
							],
							[
								18.777025,
								48.081768
							],
							[
								18.696513,
								47.880954
							],
							[
								17.857133,
								47.758429
							],
							[
								17.488473,
								47.867466
							],
							[
								16.979667,
								48.123497
							],
							[
								16.879983,
								48.470013
							],
							[
								16.960288,
								48.596982
							],
							[
								17.101985,
								48.816969
							],
							[
								17.545007,
								48.800019
							],
							[
								17.886485,
								48.903475
							],
							[
								17.913512,
								48.996493
							],
							[
								18.104973,
								49.043983
							],
							[
								18.170498,
								49.271515
							],
							[
								18.399994,
								49.315001
							],
							[
								18.554971,
								49.495015
							],
							[
								18.853144,
								49.49623
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SVN",
				"properties": {
					"name": "Slovenia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								13.806475,
								46.509306
							],
							[
								14.632472,
								46.431817
							],
							[
								15.137092,
								46.658703
							],
							[
								16.011664,
								46.683611
							],
							[
								16.202298,
								46.852386
							],
							[
								16.370505,
								46.841327
							],
							[
								16.564808,
								46.503751
							],
							[
								15.768733,
								46.238108
							],
							[
								15.67153,
								45.834154
							],
							[
								15.323954,
								45.731783
							],
							[
								15.327675,
								45.452316
							],
							[
								14.935244,
								45.471695
							],
							[
								14.595109,
								45.634941
							],
							[
								14.411968,
								45.466166
							],
							[
								13.71506,
								45.500324
							],
							[
								13.93763,
								45.591016
							],
							[
								13.69811,
								46.016778
							],
							[
								13.806475,
								46.509306
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SWE",
				"properties": {
					"name": "Sweden"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									22.183173,
									65.723741
								],
								[
									21.213517,
									65.026005
								],
								[
									21.369631,
									64.413588
								],
								[
									19.778876,
									63.609554
								],
								[
									17.847779,
									62.7494
								],
								[
									17.119555,
									61.341166
								],
								[
									17.831346,
									60.636583
								],
								[
									18.787722,
									60.081914
								],
								[
									17.869225,
									58.953766
								],
								[
									16.829185,
									58.719827
								],
								[
									16.44771,
									57.041118
								],
								[
									15.879786,
									56.104302
								],
								[
									14.666681,
									56.200885
								],
								[
									14.100721,
									55.407781
								],
								[
									12.942911,
									55.361737
								],
								[
									12.625101,
									56.30708
								],
								[
									11.787942,
									57.441817
								],
								[
									11.027369,
									58.856149
								],
								[
									11.468272,
									59.432393
								],
								[
									12.300366,
									60.117933
								],
								[
									12.631147,
									61.293572
								],
								[
									11.992064,
									61.800362
								],
								[
									11.930569,
									63.128318
								],
								[
									12.579935,
									64.066219
								],
								[
									13.571916,
									64.049114
								],
								[
									13.919905,
									64.445421
								],
								[
									13.55569,
									64.787028
								],
								[
									15.108411,
									66.193867
								],
								[
									16.108712,
									67.302456
								],
								[
									16.768879,
									68.013937
								],
								[
									17.729182,
									68.010552
								],
								[
									17.993868,
									68.567391
								],
								[
									19.87856,
									68.407194
								],
								[
									20.025269,
									69.065139
								],
								[
									20.645593,
									69.106247
								],
								[
									21.978535,
									68.616846
								],
								[
									23.539473,
									67.936009
								],
								[
									23.56588,
									66.396051
								],
								[
									23.903379,
									66.006927
								],
								[
									22.183173,
									65.723741
								]
							],
							[
								[
									17.061767,
									57.385783
								],
								[
									17.210083,
									57.326521
								],
								[
									16.430053,
									56.179196
								],
								[
									16.364135,
									56.556455
								],
								[
									17.061767,
									57.385783
								]
							],
							[
								[
									19.35791,
									57.958588
								],
								[
									18.8031,
									57.651279
								],
								[
									18.825073,
									57.444949
								],
								[
									18.995361,
									57.441993
								],
								[
									18.951416,
									57.370976
								],
								[
									18.693237,
									57.305756
								],
								[
									18.709716,
									57.204734
								],
								[
									18.462524,
									57.127295
								],
								[
									18.319702,
									56.926992
								],
								[
									18.105468,
									56.891003
								],
								[
									18.187866,
									57.109402
								],
								[
									18.072509,
									57.267163
								],
								[
									18.154907,
									57.394664
								],
								[
									18.094482,
									57.545312
								],
								[
									18.660278,
									57.929434
								],
								[
									19.039306,
									57.941098
								],
								[
									19.105224,
									57.993543
								],
								[
									19.374389,
									57.996454
								],
								[
									19.35791,
									57.958588
								]
							],
							[
								[
									20.846557,
									63.82371
								],
								[
									21.066284,
									63.829768
								],
								[
									20.9729,
									63.71567
								],
								[
									20.824584,
									63.579121
								],
								[
									20.695495,
									63.59134
								],
								[
									20.819091,
									63.714454
								],
								[
									20.799865,
									63.780059
								],
								[
									20.846557,
									63.82371
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SWZ",
				"properties": {
					"name": "Swaziland"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								32.071665,
								-26.73382
							],
							[
								31.86806,
								-27.177927
							],
							[
								31.282773,
								-27.285879
							],
							[
								30.685962,
								-26.743845
							],
							[
								30.676609,
								-26.398078
							],
							[
								30.949667,
								-26.022649
							],
							[
								31.04408,
								-25.731452
							],
							[
								31.333158,
								-25.660191
							],
							[
								31.837778,
								-25.843332
							],
							[
								31.985779,
								-26.29178
							],
							[
								32.071665,
								-26.73382
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "SYR",
				"properties": {
					"name": "Syria"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								38.792341,
								33.378686
							],
							[
								36.834062,
								32.312938
							],
							[
								35.719918,
								32.709192
							],
							[
								35.700798,
								32.716014
							],
							[
								35.836397,
								32.868123
							],
							[
								35.821101,
								33.277426
							],
							[
								36.06646,
								33.824912
							],
							[
								36.61175,
								34.201789
							],
							[
								36.448194,
								34.593935
							],
							[
								35.998403,
								34.644914
							],
							[
								35.905023,
								35.410009
							],
							[
								36.149763,
								35.821535
							],
							[
								36.41755,
								36.040617
							],
							[
								36.685389,
								36.259699
							],
							[
								36.739494,
								36.81752
							],
							[
								37.066761,
								36.623036
							],
							[
								38.167727,
								36.90121
							],
							[
								38.699891,
								36.712927
							],
							[
								39.52258,
								36.716054
							],
							[
								40.673259,
								37.091276
							],
							[
								41.212089,
								37.074352
							],
							[
								42.349591,
								37.229873
							],
							[
								41.837064,
								36.605854
							],
							[
								41.289707,
								36.358815
							],
							[
								41.383965,
								35.628317
							],
							[
								41.006159,
								34.419372
							],
							[
								38.792341,
								33.378686
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TCD",
				"properties": {
					"name": "Chad"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								14.495787,
								12.859396
							],
							[
								14.595781,
								13.330427
							],
							[
								13.954477,
								13.353449
							],
							[
								13.956699,
								13.996691
							],
							[
								13.540394,
								14.367134
							],
							[
								13.97217,
								15.68437
							],
							[
								15.247731,
								16.627306
							],
							[
								15.300441,
								17.92795
							],
							[
								15.685741,
								19.95718
							],
							[
								15.903247,
								20.387619
							],
							[
								15.487148,
								20.730415
							],
							[
								15.47106,
								21.04845
							],
							[
								15.096888,
								21.308519
							],
							[
								14.8513,
								22.86295
							],
							[
								15.86085,
								23.40972
							],
							[
								19.84926,
								21.49509
							],
							[
								23.83766,
								19.58047
							],
							[
								23.88689,
								15.61084
							],
							[
								23.02459,
								15.68072
							],
							[
								22.56795,
								14.94429
							],
							[
								22.30351,
								14.32682
							],
							[
								22.51202,
								14.09318
							],
							[
								22.18329,
								13.78648
							],
							[
								22.29658,
								13.37232
							],
							[
								22.03759,
								12.95546
							],
							[
								21.93681,
								12.58818
							],
							[
								22.28801,
								12.64605
							],
							[
								22.49762,
								12.26024
							],
							[
								22.50869,
								11.67936
							],
							[
								22.87622,
								11.38461
							],
							[
								22.864165,
								11.142395
							],
							[
								22.231129,
								10.971889
							],
							[
								21.723822,
								10.567056
							],
							[
								21.000868,
								9.475985
							],
							[
								20.059685,
								9.012706
							],
							[
								19.094008,
								9.074847
							],
							[
								18.81201,
								8.982915
							],
							[
								18.911022,
								8.630895
							],
							[
								18.389555,
								8.281304
							],
							[
								17.96493,
								7.890914
							],
							[
								16.705988,
								7.508328
							],
							[
								16.456185,
								7.734774
							],
							[
								16.290562,
								7.754307
							],
							[
								16.106232,
								7.497088
							],
							[
								15.27946,
								7.421925
							],
							[
								15.436092,
								7.692812
							],
							[
								15.120866,
								8.38215
							],
							[
								14.979996,
								8.796104
							],
							[
								14.544467,
								8.965861
							],
							[
								13.954218,
								9.549495
							],
							[
								14.171466,
								10.021378
							],
							[
								14.627201,
								9.920919
							],
							[
								14.909354,
								9.992129
							],
							[
								15.467873,
								9.982337
							],
							[
								14.923565,
								10.891325
							],
							[
								14.960152,
								11.555574
							],
							[
								14.89336,
								12.21905
							],
							[
								14.495787,
								12.859396
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TGO",
				"properties": {
					"name": "Togo"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								1.865241,
								6.142158
							],
							[
								1.060122,
								5.928837
							],
							[
								0.836931,
								6.279979
							],
							[
								0.570384,
								6.914359
							],
							[
								0.490957,
								7.411744
							],
							[
								0.712029,
								8.312465
							],
							[
								0.461192,
								8.677223
							],
							[
								0.365901,
								9.465004
							],
							[
								0.36758,
								10.191213
							],
							[
								-0.049785,
								10.706918
							],
							[
								0.023803,
								11.018682
							],
							[
								0.899563,
								10.997339
							],
							[
								0.772336,
								10.470808
							],
							[
								1.077795,
								10.175607
							],
							[
								1.425061,
								9.825395
							],
							[
								1.463043,
								9.334624
							],
							[
								1.664478,
								9.12859
							],
							[
								1.618951,
								6.832038
							],
							[
								1.865241,
								6.142158
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "THA",
				"properties": {
					"name": "Thailand"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								102.584932,
								12.186595
							],
							[
								101.687158,
								12.64574
							],
							[
								100.83181,
								12.627085
							],
							[
								100.978467,
								13.412722
							],
							[
								100.097797,
								13.406856
							],
							[
								100.018733,
								12.307001
							],
							[
								99.478921,
								10.846367
							],
							[
								99.153772,
								9.963061
							],
							[
								99.222399,
								9.239255
							],
							[
								99.873832,
								9.207862
							],
							[
								100.279647,
								8.295153
							],
							[
								100.459274,
								7.429573
							],
							[
								101.017328,
								6.856869
							],
							[
								101.623079,
								6.740622
							],
							[
								102.141187,
								6.221636
							],
							[
								101.814282,
								5.810808
							],
							[
								101.154219,
								5.691384
							],
							[
								101.075516,
								6.204867
							],
							[
								100.259596,
								6.642825
							],
							[
								100.085757,
								6.464489
							],
							[
								99.690691,
								6.848213
							],
							[
								99.519642,
								7.343454
							],
							[
								98.988253,
								7.907993
							],
							[
								98.503786,
								8.382305
							],
							[
								98.339662,
								7.794512
							],
							[
								98.150009,
								8.350007
							],
							[
								98.25915,
								8.973923
							],
							[
								98.553551,
								9.93296
							],
							[
								99.038121,
								10.960546
							],
							[
								99.587286,
								11.892763
							],
							[
								99.196354,
								12.804748
							],
							[
								99.212012,
								13.269294
							],
							[
								99.097755,
								13.827503
							],
							[
								98.430819,
								14.622028
							],
							[
								98.192074,
								15.123703
							],
							[
								98.537376,
								15.308497
							],
							[
								98.903348,
								16.177824
							],
							[
								98.493761,
								16.837836
							],
							[
								97.859123,
								17.567946
							],
							[
								97.375896,
								18.445438
							],
							[
								97.797783,
								18.62708
							],
							[
								98.253724,
								19.708203
							],
							[
								98.959676,
								19.752981
							],
							[
								99.543309,
								20.186598
							],
							[
								100.115988,
								20.41785
							],
							[
								100.548881,
								20.109238
							],
							[
								100.606294,
								19.508344
							],
							[
								101.282015,
								19.462585
							],
							[
								101.035931,
								18.408928
							],
							[
								101.059548,
								17.512497
							],
							[
								102.113592,
								18.109102
							],
							[
								102.413005,
								17.932782
							],
							[
								102.998706,
								17.961695
							],
							[
								103.200192,
								18.309632
							],
							[
								103.956477,
								18.240954
							],
							[
								104.716947,
								17.428859
							],
							[
								104.779321,
								16.441865
							],
							[
								105.589039,
								15.570316
							],
							[
								105.544338,
								14.723934
							],
							[
								105.218777,
								14.273212
							],
							[
								104.281418,
								14.416743
							],
							[
								102.988422,
								14.225721
							],
							[
								102.348099,
								13.394247
							],
							[
								102.584932,
								12.186595
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TJK",
				"properties": {
					"name": "Tajikistan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								71.014198,
								40.244366
							],
							[
								70.648019,
								39.935754
							],
							[
								69.55961,
								40.103211
							],
							[
								69.464887,
								39.526683
							],
							[
								70.549162,
								39.604198
							],
							[
								71.784694,
								39.279463
							],
							[
								73.675379,
								39.431237
							],
							[
								73.928852,
								38.505815
							],
							[
								74.257514,
								38.606507
							],
							[
								74.864816,
								38.378846
							],
							[
								74.829986,
								37.990007
							],
							[
								74.980002,
								37.41999
							],
							[
								73.948696,
								37.421566
							],
							[
								73.260056,
								37.495257
							],
							[
								72.63689,
								37.047558
							],
							[
								72.193041,
								36.948288
							],
							[
								71.844638,
								36.738171
							],
							[
								71.448693,
								37.065645
							],
							[
								71.541918,
								37.905774
							],
							[
								71.239404,
								37.953265
							],
							[
								71.348131,
								38.258905
							],
							[
								70.806821,
								38.486282
							],
							[
								70.376304,
								38.138396
							],
							[
								70.270574,
								37.735165
							],
							[
								70.116578,
								37.588223
							],
							[
								69.518785,
								37.608997
							],
							[
								69.196273,
								37.151144
							],
							[
								68.859446,
								37.344336
							],
							[
								68.135562,
								37.023115
							],
							[
								67.83,
								37.144994
							],
							[
								68.392033,
								38.157025
							],
							[
								68.176025,
								38.901553
							],
							[
								67.44222,
								39.140144
							],
							[
								67.701429,
								39.580478
							],
							[
								68.536416,
								39.533453
							],
							[
								69.011633,
								40.086158
							],
							[
								69.329495,
								40.727824
							],
							[
								70.666622,
								40.960213
							],
							[
								70.45816,
								40.496495
							],
							[
								70.601407,
								40.218527
							],
							[
								71.014198,
								40.244366
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TKM",
				"properties": {
					"name": "Turkmenistan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								61.210817,
								35.650072
							],
							[
								61.123071,
								36.491597
							],
							[
								60.377638,
								36.527383
							],
							[
								59.234762,
								37.412988
							],
							[
								58.436154,
								37.522309
							],
							[
								57.330434,
								38.029229
							],
							[
								56.619366,
								38.121394
							],
							[
								56.180375,
								37.935127
							],
							[
								55.511578,
								37.964117
							],
							[
								54.800304,
								37.392421
							],
							[
								53.921598,
								37.198918
							],
							[
								53.735511,
								37.906136
							],
							[
								53.880929,
								38.952093
							],
							[
								53.101028,
								39.290574
							],
							[
								53.357808,
								39.975286
							],
							[
								52.693973,
								40.033629
							],
							[
								52.915251,
								40.876523
							],
							[
								53.858139,
								40.631034
							],
							[
								54.736845,
								40.951015
							],
							[
								54.008311,
								41.551211
							],
							[
								53.721713,
								42.123191
							],
							[
								52.91675,
								41.868117
							],
							[
								52.814689,
								41.135371
							],
							[
								52.50246,
								41.783316
							],
							[
								52.944293,
								42.116034
							],
							[
								54.079418,
								42.324109
							],
							[
								54.755345,
								42.043971
							],
							[
								55.455251,
								41.259859
							],
							[
								55.968191,
								41.308642
							],
							[
								57.096391,
								41.32231
							],
							[
								56.932215,
								41.826026
							],
							[
								57.78653,
								42.170553
							],
							[
								58.629011,
								42.751551
							],
							[
								59.976422,
								42.223082
							],
							[
								60.083341,
								41.425146
							],
							[
								60.465953,
								41.220327
							],
							[
								61.547179,
								41.26637
							],
							[
								61.882714,
								41.084857
							],
							[
								62.37426,
								40.053886
							],
							[
								63.518015,
								39.363257
							],
							[
								64.170223,
								38.892407
							],
							[
								65.215999,
								38.402695
							],
							[
								66.54615,
								37.974685
							],
							[
								66.518607,
								37.362784
							],
							[
								66.217385,
								37.39379
							],
							[
								65.745631,
								37.661164
							],
							[
								65.588948,
								37.305217
							],
							[
								64.746105,
								37.111818
							],
							[
								64.546479,
								36.312073
							],
							[
								63.982896,
								36.007957
							],
							[
								63.193538,
								35.857166
							],
							[
								62.984662,
								35.404041
							],
							[
								62.230651,
								35.270664
							],
							[
								61.210817,
								35.650072
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TLS",
				"properties": {
					"name": "East Timor"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								124.968682,
								-8.89279
							],
							[
								125.086246,
								-8.656887
							],
							[
								125.947072,
								-8.432095
							],
							[
								126.644704,
								-8.398247
							],
							[
								126.957243,
								-8.273345
							],
							[
								127.335928,
								-8.397317
							],
							[
								126.967992,
								-8.668256
							],
							[
								125.925885,
								-9.106007
							],
							[
								125.08852,
								-9.393173
							],
							[
								125.07002,
								-9.089987
							],
							[
								124.968682,
								-8.89279
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TTO",
				"properties": {
					"name": "Trinidad and Tobago"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-61.68,
								10.76
							],
							[
								-61.105,
								10.89
							],
							[
								-60.895,
								10.855
							],
							[
								-60.935,
								10.11
							],
							[
								-61.77,
								10
							],
							[
								-61.95,
								10.09
							],
							[
								-61.66,
								10.365
							],
							[
								-61.68,
								10.76
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TUN",
				"properties": {
					"name": "Tunisia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								9.48214,
								30.307556
							],
							[
								9.055603,
								32.102692
							],
							[
								8.439103,
								32.506285
							],
							[
								8.430473,
								32.748337
							],
							[
								7.612642,
								33.344115
							],
							[
								7.524482,
								34.097376
							],
							[
								8.140981,
								34.655146
							],
							[
								8.376368,
								35.479876
							],
							[
								8.217824,
								36.433177
							],
							[
								8.420964,
								36.946427
							],
							[
								9.509994,
								37.349994
							],
							[
								10.210002,
								37.230002
							],
							[
								10.18065,
								36.724038
							],
							[
								11.028867,
								37.092103
							],
							[
								11.100026,
								36.899996
							],
							[
								10.600005,
								36.41
							],
							[
								10.593287,
								35.947444
							],
							[
								10.939519,
								35.698984
							],
							[
								10.807847,
								34.833507
							],
							[
								10.149593,
								34.330773
							],
							[
								10.339659,
								33.785742
							],
							[
								10.856836,
								33.76874
							],
							[
								11.108501,
								33.293343
							],
							[
								11.488787,
								33.136996
							],
							[
								11.432253,
								32.368903
							],
							[
								10.94479,
								32.081815
							],
							[
								10.636901,
								31.761421
							],
							[
								9.950225,
								31.37607
							],
							[
								10.056575,
								30.961831
							],
							[
								9.970017,
								30.539325
							],
							[
								9.48214,
								30.307556
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TUR",
				"properties": {
					"name": "Turkey"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									36.913127,
									41.335358
								],
								[
									38.347665,
									40.948586
								],
								[
									39.512607,
									41.102763
								],
								[
									40.373433,
									41.013673
								],
								[
									41.554084,
									41.535656
								],
								[
									42.619549,
									41.583173
								],
								[
									43.582746,
									41.092143
								],
								[
									43.752658,
									40.740201
								],
								[
									43.656436,
									40.253564
								],
								[
									44.400009,
									40.005
								],
								[
									44.79399,
									39.713003
								],
								[
									44.109225,
									39.428136
								],
								[
									44.421403,
									38.281281
								],
								[
									44.225756,
									37.971584
								],
								[
									44.772699,
									37.170445
								],
								[
									44.293452,
									37.001514
								],
								[
									43.942259,
									37.256228
								],
								[
									42.779126,
									37.385264
								],
								[
									42.349591,
									37.229873
								],
								[
									41.212089,
									37.074352
								],
								[
									40.673259,
									37.091276
								],
								[
									39.52258,
									36.716054
								],
								[
									38.699891,
									36.712927
								],
								[
									38.167727,
									36.90121
								],
								[
									37.066761,
									36.623036
								],
								[
									36.739494,
									36.81752
								],
								[
									36.685389,
									36.259699
								],
								[
									36.41755,
									36.040617
								],
								[
									36.149763,
									35.821535
								],
								[
									35.782085,
									36.274995
								],
								[
									36.160822,
									36.650606
								],
								[
									35.550936,
									36.565443
								],
								[
									34.714553,
									36.795532
								],
								[
									34.026895,
									36.21996
								],
								[
									32.509158,
									36.107564
								],
								[
									31.699595,
									36.644275
								],
								[
									30.621625,
									36.677865
								],
								[
									30.391096,
									36.262981
								],
								[
									29.699976,
									36.144357
								],
								[
									28.732903,
									36.676831
								],
								[
									27.641187,
									36.658822
								],
								[
									27.048768,
									37.653361
								],
								[
									26.318218,
									38.208133
								],
								[
									26.8047,
									38.98576
								],
								[
									26.170785,
									39.463612
								],
								[
									27.28002,
									40.420014
								],
								[
									28.819978,
									40.460011
								],
								[
									29.240004,
									41.219991
								],
								[
									31.145934,
									41.087622
								],
								[
									32.347979,
									41.736264
								],
								[
									33.513283,
									42.01896
								],
								[
									35.167704,
									42.040225
								],
								[
									36.913127,
									41.335358
								]
							]
						],
						[
							[
								[
									27.192377,
									40.690566
								],
								[
									26.358009,
									40.151994
								],
								[
									26.043351,
									40.617754
								],
								[
									26.056942,
									40.824123
								],
								[
									26.294602,
									40.936261
								],
								[
									26.604196,
									41.562115
								],
								[
									26.117042,
									41.826905
								],
								[
									27.135739,
									42.141485
								],
								[
									27.99672,
									42.007359
								],
								[
									28.115525,
									41.622886
								],
								[
									28.988443,
									41.299934
								],
								[
									28.806438,
									41.054962
								],
								[
									27.619017,
									40.999823
								],
								[
									27.192377,
									40.690566
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TWN",
				"properties": {
					"name": "Taiwan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								121.777818,
								24.394274
							],
							[
								121.175632,
								22.790857
							],
							[
								120.74708,
								21.970571
							],
							[
								120.220083,
								22.814861
							],
							[
								120.106189,
								23.556263
							],
							[
								120.69468,
								24.538451
							],
							[
								121.495044,
								25.295459
							],
							[
								121.951244,
								24.997596
							],
							[
								121.777818,
								24.394274
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "TZA",
				"properties": {
					"name": "United Republic of Tanzania"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								33.903711,
								-0.95
							],
							[
								34.07262,
								-1.05982
							],
							[
								37.69869,
								-3.09699
							],
							[
								37.7669,
								-3.67712
							],
							[
								39.20222,
								-4.67677
							],
							[
								38.74054,
								-5.90895
							],
							[
								38.79977,
								-6.47566
							],
							[
								39.44,
								-6.84
							],
							[
								39.47,
								-7.1
							],
							[
								39.19469,
								-7.7039
							],
							[
								39.25203,
								-8.00781
							],
							[
								39.18652,
								-8.48551
							],
							[
								39.53574,
								-9.11237
							],
							[
								39.9496,
								-10.0984
							],
							[
								40.31659,
								-10.3171
							],
							[
								39.521,
								-10.89688
							],
							[
								38.427557,
								-11.285202
							],
							[
								37.82764,
								-11.26879
							],
							[
								37.47129,
								-11.56876
							],
							[
								36.775151,
								-11.594537
							],
							[
								36.514082,
								-11.720938
							],
							[
								35.312398,
								-11.439146
							],
							[
								34.559989,
								-11.52002
							],
							[
								34.28,
								-10.16
							],
							[
								33.940838,
								-9.693674
							],
							[
								33.73972,
								-9.41715
							],
							[
								32.759375,
								-9.230599
							],
							[
								32.191865,
								-8.930359
							],
							[
								31.556348,
								-8.762049
							],
							[
								31.157751,
								-8.594579
							],
							[
								30.74,
								-8.34
							],
							[
								30.2,
								-7.08
							],
							[
								29.62,
								-6.52
							],
							[
								29.419993,
								-5.939999
							],
							[
								29.519987,
								-5.419979
							],
							[
								29.339998,
								-4.499983
							],
							[
								29.753512,
								-4.452389
							],
							[
								30.11632,
								-4.09012
							],
							[
								30.50554,
								-3.56858
							],
							[
								30.75224,
								-3.35931
							],
							[
								30.74301,
								-3.03431
							],
							[
								30.52766,
								-2.80762
							],
							[
								30.46967,
								-2.41383
							],
							[
								30.758309,
								-2.28725
							],
							[
								30.816135,
								-1.698914
							],
							[
								30.419105,
								-1.134659
							],
							[
								30.76986,
								-1.01455
							],
							[
								31.86617,
								-1.02736
							],
							[
								33.903711,
								-0.95
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "UGA",
				"properties": {
					"name": "Uganda"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								31.86617,
								-1.02736
							],
							[
								30.76986,
								-1.01455
							],
							[
								30.419105,
								-1.134659
							],
							[
								29.821519,
								-1.443322
							],
							[
								29.579466,
								-1.341313
							],
							[
								29.587838,
								-0.587406
							],
							[
								29.8195,
								-0.2053
							],
							[
								29.875779,
								0.59738
							],
							[
								30.086154,
								1.062313
							],
							[
								30.468508,
								1.583805
							],
							[
								30.85267,
								1.849396
							],
							[
								31.174149,
								2.204465
							],
							[
								30.77332,
								2.33989
							],
							[
								30.83385,
								3.50917
							],
							[
								31.24556,
								3.7819
							],
							[
								31.88145,
								3.55827
							],
							[
								32.68642,
								3.79232
							],
							[
								33.39,
								3.79
							],
							[
								34.005,
								4.249885
							],
							[
								34.47913,
								3.5556
							],
							[
								34.59607,
								3.05374
							],
							[
								35.03599,
								1.90584
							],
							[
								34.6721,
								1.17694
							],
							[
								34.18,
								0.515
							],
							[
								33.893569,
								0.109814
							],
							[
								33.903711,
								-0.95
							],
							[
								31.86617,
								-1.02736
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "UKR",
				"properties": {
					"name": "Ukraine"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								31.785998,
								52.101678
							],
							[
								32.159412,
								52.061267
							],
							[
								32.412058,
								52.288695
							],
							[
								32.715761,
								52.238465
							],
							[
								33.7527,
								52.335075
							],
							[
								34.391731,
								51.768882
							],
							[
								34.141978,
								51.566413
							],
							[
								34.224816,
								51.255993
							],
							[
								35.022183,
								51.207572
							],
							[
								35.377924,
								50.773955
							],
							[
								35.356116,
								50.577197
							],
							[
								36.626168,
								50.225591
							],
							[
								37.39346,
								50.383953
							],
							[
								38.010631,
								49.915662
							],
							[
								38.594988,
								49.926462
							],
							[
								40.069058,
								49.601055
							],
							[
								40.080789,
								49.30743
							],
							[
								39.674664,
								48.783818
							],
							[
								39.895632,
								48.232405
							],
							[
								39.738278,
								47.898937
							],
							[
								38.770585,
								47.825608
							],
							[
								38.255112,
								47.5464
							],
							[
								38.223538,
								47.10219
							],
							[
								37.425137,
								47.022221
							],
							[
								36.759855,
								46.6987
							],
							[
								35.823685,
								46.645964
							],
							[
								34.962342,
								46.273197
							],
							[
								35.020788,
								45.651219
							],
							[
								35.510009,
								45.409993
							],
							[
								36.529998,
								45.46999
							],
							[
								36.334713,
								45.113216
							],
							[
								35.239999,
								44.939996
							],
							[
								33.882511,
								44.361479
							],
							[
								33.326421,
								44.564877
							],
							[
								33.546924,
								45.034771
							],
							[
								32.454174,
								45.327466
							],
							[
								32.630804,
								45.519186
							],
							[
								33.588162,
								45.851569
							],
							[
								33.298567,
								46.080598
							],
							[
								31.74414,
								46.333348
							],
							[
								31.675307,
								46.706245
							],
							[
								30.748749,
								46.5831
							],
							[
								30.377609,
								46.03241
							],
							[
								29.603289,
								45.293308
							],
							[
								29.149725,
								45.464925
							],
							[
								28.679779,
								45.304031
							],
							[
								28.233554,
								45.488283
							],
							[
								28.485269,
								45.596907
							],
							[
								28.659987,
								45.939987
							],
							[
								28.933717,
								46.25883
							],
							[
								28.862972,
								46.437889
							],
							[
								29.072107,
								46.517678
							],
							[
								29.170654,
								46.379262
							],
							[
								29.759972,
								46.349988
							],
							[
								30.024659,
								46.423937
							],
							[
								29.83821,
								46.525326
							],
							[
								29.908852,
								46.674361
							],
							[
								29.559674,
								46.928583
							],
							[
								29.415135,
								47.346645
							],
							[
								29.050868,
								47.510227
							],
							[
								29.122698,
								47.849095
							],
							[
								28.670891,
								48.118149
							],
							[
								28.259547,
								48.155562
							],
							[
								27.522537,
								48.467119
							],
							[
								26.857824,
								48.368211
							],
							[
								26.619337,
								48.220726
							],
							[
								26.19745,
								48.220881
							],
							[
								25.945941,
								47.987149
							],
							[
								25.207743,
								47.891056
							],
							[
								24.866317,
								47.737526
							],
							[
								24.402056,
								47.981878
							],
							[
								23.760958,
								47.985598
							],
							[
								23.142236,
								48.096341
							],
							[
								22.710531,
								47.882194
							],
							[
								22.64082,
								48.15024
							],
							[
								22.085608,
								48.422264
							],
							[
								22.280842,
								48.825392
							],
							[
								22.558138,
								49.085738
							],
							[
								22.776419,
								49.027395
							],
							[
								22.51845,
								49.476774
							],
							[
								23.426508,
								50.308506
							],
							[
								23.922757,
								50.424881
							],
							[
								24.029986,
								50.705407
							],
							[
								23.527071,
								51.578454
							],
							[
								24.005078,
								51.617444
							],
							[
								24.553106,
								51.888461
							],
							[
								25.327788,
								51.910656
							],
							[
								26.337959,
								51.832289
							],
							[
								27.454066,
								51.592303
							],
							[
								28.241615,
								51.572227
							],
							[
								28.617613,
								51.427714
							],
							[
								28.992835,
								51.602044
							],
							[
								29.254938,
								51.368234
							],
							[
								30.157364,
								51.416138
							],
							[
								30.555117,
								51.319503
							],
							[
								30.619454,
								51.822806
							],
							[
								30.927549,
								52.042353
							],
							[
								31.785998,
								52.101678
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "URY",
				"properties": {
					"name": "Uruguay"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-57.625133,
								-30.216295
							],
							[
								-56.976026,
								-30.109686
							],
							[
								-55.973245,
								-30.883076
							],
							[
								-55.60151,
								-30.853879
							],
							[
								-54.572452,
								-31.494511
							],
							[
								-53.787952,
								-32.047243
							],
							[
								-53.209589,
								-32.727666
							],
							[
								-53.650544,
								-33.202004
							],
							[
								-53.373662,
								-33.768378
							],
							[
								-53.806426,
								-34.396815
							],
							[
								-54.935866,
								-34.952647
							],
							[
								-55.67409,
								-34.752659
							],
							[
								-56.215297,
								-34.859836
							],
							[
								-57.139685,
								-34.430456
							],
							[
								-57.817861,
								-34.462547
							],
							[
								-58.427074,
								-33.909454
							],
							[
								-58.349611,
								-33.263189
							],
							[
								-58.132648,
								-33.040567
							],
							[
								-58.14244,
								-32.044504
							],
							[
								-57.874937,
								-31.016556
							],
							[
								-57.625133,
								-30.216295
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "USA",
				"properties": {
					"name": "United States of America"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									-155.54211,
									19.08348
								],
								[
									-155.68817,
									18.91619
								],
								[
									-155.93665,
									19.05939
								],
								[
									-155.90806,
									19.33888
								],
								[
									-156.07347,
									19.70294
								],
								[
									-156.02368,
									19.81422
								],
								[
									-155.85008,
									19.97729
								],
								[
									-155.91907,
									20.17395
								],
								[
									-155.86108,
									20.26721
								],
								[
									-155.78505,
									20.2487
								],
								[
									-155.40214,
									20.07975
								],
								[
									-155.22452,
									19.99302
								],
								[
									-155.06226,
									19.8591
								],
								[
									-154.80741,
									19.50871
								],
								[
									-154.83147,
									19.45328
								],
								[
									-155.22217,
									19.23972
								],
								[
									-155.54211,
									19.08348
								]
							]
						],
						[
							[
								[
									-156.07926,
									20.64397
								],
								[
									-156.41445,
									20.57241
								],
								[
									-156.58673,
									20.783
								],
								[
									-156.70167,
									20.8643
								],
								[
									-156.71055,
									20.92676
								],
								[
									-156.61258,
									21.01249
								],
								[
									-156.25711,
									20.91745
								],
								[
									-155.99566,
									20.76404
								],
								[
									-156.07926,
									20.64397
								]
							]
						],
						[
							[
								[
									-156.75824,
									21.17684
								],
								[
									-156.78933,
									21.06873
								],
								[
									-157.32521,
									21.09777
								],
								[
									-157.25027,
									21.21958
								],
								[
									-156.75824,
									21.17684
								]
							]
						],
						[
							[
								[
									-157.65283,
									21.32217
								],
								[
									-157.70703,
									21.26442
								],
								[
									-157.7786,
									21.27729
								],
								[
									-158.12667,
									21.31244
								],
								[
									-158.2538,
									21.53919
								],
								[
									-158.29265,
									21.57912
								],
								[
									-158.0252,
									21.71696
								],
								[
									-157.94161,
									21.65272
								],
								[
									-157.65283,
									21.32217
								]
							]
						],
						[
							[
								[
									-159.34512,
									21.982
								],
								[
									-159.46372,
									21.88299
								],
								[
									-159.80051,
									22.06533
								],
								[
									-159.74877,
									22.1382
								],
								[
									-159.5962,
									22.23618
								],
								[
									-159.36569,
									22.21494
								],
								[
									-159.34512,
									21.982
								]
							]
						],
						[
							[
								[
									-94.81758,
									49.38905
								],
								[
									-94.64,
									48.84
								],
								[
									-94.32914,
									48.67074
								],
								[
									-93.63087,
									48.60926
								],
								[
									-92.61,
									48.45
								],
								[
									-91.64,
									48.14
								],
								[
									-90.83,
									48.27
								],
								[
									-89.6,
									48.01
								],
								[
									-89.272917,
									48.019808
								],
								[
									-88.378114,
									48.302918
								],
								[
									-87.439793,
									47.94
								],
								[
									-86.461991,
									47.553338
								],
								[
									-85.652363,
									47.220219
								],
								[
									-84.87608,
									46.900083
								],
								[
									-84.779238,
									46.637102
								],
								[
									-84.543749,
									46.538684
								],
								[
									-84.6049,
									46.4396
								],
								[
									-84.3367,
									46.40877
								],
								[
									-84.14212,
									46.512226
								],
								[
									-84.091851,
									46.275419
								],
								[
									-83.890765,
									46.116927
								],
								[
									-83.616131,
									46.116927
								],
								[
									-83.469551,
									45.994686
								],
								[
									-83.592851,
									45.816894
								],
								[
									-82.550925,
									45.347517
								],
								[
									-82.337763,
									44.44
								],
								[
									-82.137642,
									43.571088
								],
								[
									-82.43,
									42.98
								],
								[
									-82.9,
									42.43
								],
								[
									-83.12,
									42.08
								],
								[
									-83.142,
									41.975681
								],
								[
									-83.02981,
									41.832796
								],
								[
									-82.690089,
									41.675105
								],
								[
									-82.439278,
									41.675105
								],
								[
									-81.277747,
									42.209026
								],
								[
									-80.247448,
									42.3662
								],
								[
									-78.939362,
									42.863611
								],
								[
									-78.92,
									42.965
								],
								[
									-79.01,
									43.27
								],
								[
									-79.171674,
									43.466339
								],
								[
									-78.72028,
									43.625089
								],
								[
									-77.737885,
									43.629056
								],
								[
									-76.820034,
									43.628784
								],
								[
									-76.5,
									44.018459
								],
								[
									-76.375,
									44.09631
								],
								[
									-75.31821,
									44.81645
								],
								[
									-74.867,
									45.00048
								],
								[
									-73.34783,
									45.00738
								],
								[
									-71.50506,
									45.0082
								],
								[
									-71.405,
									45.255
								],
								[
									-71.08482,
									45.30524
								],
								[
									-70.66,
									45.46
								],
								[
									-70.305,
									45.915
								],
								[
									-69.99997,
									46.69307
								],
								[
									-69.237216,
									47.447781
								],
								[
									-68.905,
									47.185
								],
								[
									-68.23444,
									47.35486
								],
								[
									-67.79046,
									47.06636
								],
								[
									-67.79134,
									45.70281
								],
								[
									-67.13741,
									45.13753
								],
								[
									-66.96466,
									44.8097
								],
								[
									-68.03252,
									44.3252
								],
								[
									-69.06,
									43.98
								],
								[
									-70.11617,
									43.68405
								],
								[
									-70.645476,
									43.090238
								],
								[
									-70.81489,
									42.8653
								],
								[
									-70.825,
									42.335
								],
								[
									-70.495,
									41.805
								],
								[
									-70.08,
									41.78
								],
								[
									-70.185,
									42.145
								],
								[
									-69.88497,
									41.92283
								],
								[
									-69.96503,
									41.63717
								],
								[
									-70.64,
									41.475
								],
								[
									-71.12039,
									41.49445
								],
								[
									-71.86,
									41.32
								],
								[
									-72.295,
									41.27
								],
								[
									-72.87643,
									41.22065
								],
								[
									-73.71,
									40.931102
								],
								[
									-72.24126,
									41.11948
								],
								[
									-71.945,
									40.93
								],
								[
									-73.345,
									40.63
								],
								[
									-73.982,
									40.628
								],
								[
									-73.952325,
									40.75075
								],
								[
									-74.25671,
									40.47351
								],
								[
									-73.96244,
									40.42763
								],
								[
									-74.17838,
									39.70926
								],
								[
									-74.90604,
									38.93954
								],
								[
									-74.98041,
									39.1964
								],
								[
									-75.20002,
									39.24845
								],
								[
									-75.52805,
									39.4985
								],
								[
									-75.32,
									38.96
								],
								[
									-75.071835,
									38.782032
								],
								[
									-75.05673,
									38.40412
								],
								[
									-75.37747,
									38.01551
								],
								[
									-75.94023,
									37.21689
								],
								[
									-76.03127,
									37.2566
								],
								[
									-75.72205,
									37.93705
								],
								[
									-76.23287,
									38.319215
								],
								[
									-76.35,
									39.15
								],
								[
									-76.542725,
									38.717615
								],
								[
									-76.32933,
									38.08326
								],
								[
									-76.989998,
									38.239992
								],
								[
									-76.30162,
									37.917945
								],
								[
									-76.25874,
									36.9664
								],
								[
									-75.9718,
									36.89726
								],
								[
									-75.86804,
									36.55125
								],
								[
									-75.72749,
									35.55074
								],
								[
									-76.36318,
									34.80854
								],
								[
									-77.397635,
									34.51201
								],
								[
									-78.05496,
									33.92547
								],
								[
									-78.55435,
									33.86133
								],
								[
									-79.06067,
									33.49395
								],
								[
									-79.20357,
									33.15839
								],
								[
									-80.301325,
									32.509355
								],
								[
									-80.86498,
									32.0333
								],
								[
									-81.33629,
									31.44049
								],
								[
									-81.49042,
									30.72999
								],
								[
									-81.31371,
									30.03552
								],
								[
									-80.98,
									29.18
								],
								[
									-80.535585,
									28.47213
								],
								[
									-80.53,
									28.04
								],
								[
									-80.056539,
									26.88
								],
								[
									-80.088015,
									26.205765
								],
								[
									-80.13156,
									25.816775
								],
								[
									-80.38103,
									25.20616
								],
								[
									-80.68,
									25.08
								],
								[
									-81.17213,
									25.20126
								],
								[
									-81.33,
									25.64
								],
								[
									-81.71,
									25.87
								],
								[
									-82.24,
									26.73
								],
								[
									-82.70515,
									27.49504
								],
								[
									-82.85526,
									27.88624
								],
								[
									-82.65,
									28.55
								],
								[
									-82.93,
									29.1
								],
								[
									-83.70959,
									29.93656
								],
								[
									-84.1,
									30.09
								],
								[
									-85.10882,
									29.63615
								],
								[
									-85.28784,
									29.68612
								],
								[
									-85.7731,
									30.15261
								],
								[
									-86.4,
									30.4
								],
								[
									-87.53036,
									30.27433
								],
								[
									-88.41782,
									30.3849
								],
								[
									-89.18049,
									30.31598
								],
								[
									-89.593831,
									30.159994
								],
								[
									-89.413735,
									29.89419
								],
								[
									-89.43,
									29.48864
								],
								[
									-89.21767,
									29.29108
								],
								[
									-89.40823,
									29.15961
								],
								[
									-89.77928,
									29.30714
								],
								[
									-90.15463,
									29.11743
								],
								[
									-90.880225,
									29.148535
								],
								[
									-91.626785,
									29.677
								],
								[
									-92.49906,
									29.5523
								],
								[
									-93.22637,
									29.78375
								],
								[
									-93.84842,
									29.71363
								],
								[
									-94.69,
									29.48
								],
								[
									-95.60026,
									28.73863
								],
								[
									-96.59404,
									28.30748
								],
								[
									-97.14,
									27.83
								],
								[
									-97.37,
									27.38
								],
								[
									-97.38,
									26.69
								],
								[
									-97.33,
									26.21
								],
								[
									-97.14,
									25.87
								],
								[
									-97.53,
									25.84
								],
								[
									-98.24,
									26.06
								],
								[
									-99.02,
									26.37
								],
								[
									-99.3,
									26.84
								],
								[
									-99.52,
									27.54
								],
								[
									-100.11,
									28.11
								],
								[
									-100.45584,
									28.69612
								],
								[
									-100.9576,
									29.38071
								],
								[
									-101.6624,
									29.7793
								],
								[
									-102.48,
									29.76
								],
								[
									-103.11,
									28.97
								],
								[
									-103.94,
									29.27
								],
								[
									-104.45697,
									29.57196
								],
								[
									-104.70575,
									30.12173
								],
								[
									-105.03737,
									30.64402
								],
								[
									-105.63159,
									31.08383
								],
								[
									-106.1429,
									31.39995
								],
								[
									-106.50759,
									31.75452
								],
								[
									-108.24,
									31.754854
								],
								[
									-108.24194,
									31.34222
								],
								[
									-109.035,
									31.34194
								],
								[
									-111.02361,
									31.33472
								],
								[
									-113.30498,
									32.03914
								],
								[
									-114.815,
									32.52528
								],
								[
									-114.72139,
									32.72083
								],
								[
									-115.99135,
									32.61239
								],
								[
									-117.12776,
									32.53534
								],
								[
									-117.295938,
									33.046225
								],
								[
									-117.944,
									33.621236
								],
								[
									-118.410602,
									33.740909
								],
								[
									-118.519895,
									34.027782
								],
								[
									-119.081,
									34.078
								],
								[
									-119.438841,
									34.348477
								],
								[
									-120.36778,
									34.44711
								],
								[
									-120.62286,
									34.60855
								],
								[
									-120.74433,
									35.15686
								],
								[
									-121.71457,
									36.16153
								],
								[
									-122.54747,
									37.55176
								],
								[
									-122.51201,
									37.78339
								],
								[
									-122.95319,
									38.11371
								],
								[
									-123.7272,
									38.95166
								],
								[
									-123.86517,
									39.76699
								],
								[
									-124.39807,
									40.3132
								],
								[
									-124.17886,
									41.14202
								],
								[
									-124.2137,
									41.99964
								],
								[
									-124.53284,
									42.76599
								],
								[
									-124.14214,
									43.70838
								],
								[
									-124.020535,
									44.615895
								],
								[
									-123.89893,
									45.52341
								],
								[
									-124.079635,
									46.86475
								],
								[
									-124.39567,
									47.72017
								],
								[
									-124.68721,
									48.184433
								],
								[
									-124.566101,
									48.379715
								],
								[
									-123.12,
									48.04
								],
								[
									-122.58736,
									47.096
								],
								[
									-122.34,
									47.36
								],
								[
									-122.5,
									48.18
								],
								[
									-122.84,
									49
								],
								[
									-120,
									49
								],
								[
									-117.03121,
									49
								],
								[
									-116.04818,
									49
								],
								[
									-113,
									49
								],
								[
									-110.05,
									49
								],
								[
									-107.05,
									49
								],
								[
									-104.04826,
									48.99986
								],
								[
									-100.65,
									49
								],
								[
									-97.22872,
									49.0007
								],
								[
									-95.15907,
									49
								],
								[
									-95.15609,
									49.38425
								],
								[
									-94.81758,
									49.38905
								]
							]
						],
						[
							[
								[
									-153.006314,
									57.115842
								],
								[
									-154.00509,
									56.734677
								],
								[
									-154.516403,
									56.992749
								],
								[
									-154.670993,
									57.461196
								],
								[
									-153.76278,
									57.816575
								],
								[
									-153.228729,
									57.968968
								],
								[
									-152.564791,
									57.901427
								],
								[
									-152.141147,
									57.591059
								],
								[
									-153.006314,
									57.115842
								]
							]
						],
						[
							[
								[
									-165.579164,
									59.909987
								],
								[
									-166.19277,
									59.754441
								],
								[
									-166.848337,
									59.941406
								],
								[
									-167.455277,
									60.213069
								],
								[
									-166.467792,
									60.38417
								],
								[
									-165.67443,
									60.293607
								],
								[
									-165.579164,
									59.909987
								]
							]
						],
						[
							[
								[
									-171.731657,
									63.782515
								],
								[
									-171.114434,
									63.592191
								],
								[
									-170.491112,
									63.694975
								],
								[
									-169.682505,
									63.431116
								],
								[
									-168.689439,
									63.297506
								],
								[
									-168.771941,
									63.188598
								],
								[
									-169.52944,
									62.976931
								],
								[
									-170.290556,
									63.194438
								],
								[
									-170.671386,
									63.375822
								],
								[
									-171.553063,
									63.317789
								],
								[
									-171.791111,
									63.405846
								],
								[
									-171.731657,
									63.782515
								]
							]
						],
						[
							[
								[
									-155.06779,
									71.147776
								],
								[
									-154.344165,
									70.696409
								],
								[
									-153.900006,
									70.889989
								],
								[
									-152.210006,
									70.829992
								],
								[
									-152.270002,
									70.600006
								],
								[
									-150.739992,
									70.430017
								],
								[
									-149.720003,
									70.53001
								],
								[
									-147.613362,
									70.214035
								],
								[
									-145.68999,
									70.12001
								],
								[
									-144.920011,
									69.989992
								],
								[
									-143.589446,
									70.152514
								],
								[
									-142.07251,
									69.851938
								],
								[
									-140.985988,
									69.711998
								],
								[
									-140.992499,
									66.000029
								],
								[
									-140.99777,
									60.306397
								],
								[
									-140.012998,
									60.276838
								],
								[
									-139.039,
									60.000007
								],
								[
									-138.34089,
									59.56211
								],
								[
									-137.4525,
									58.905
								],
								[
									-136.47972,
									59.46389
								],
								[
									-135.47583,
									59.78778
								],
								[
									-134.945,
									59.27056
								],
								[
									-134.27111,
									58.86111
								],
								[
									-133.355549,
									58.410285
								],
								[
									-132.73042,
									57.69289
								],
								[
									-131.70781,
									56.55212
								],
								[
									-130.00778,
									55.91583
								],
								[
									-129.979994,
									55.284998
								],
								[
									-130.53611,
									54.802753
								],
								[
									-131.085818,
									55.178906
								],
								[
									-131.967211,
									55.497776
								],
								[
									-132.250011,
									56.369996
								],
								[
									-133.539181,
									57.178887
								],
								[
									-134.078063,
									58.123068
								],
								[
									-135.038211,
									58.187715
								],
								[
									-136.628062,
									58.212209
								],
								[
									-137.800006,
									58.499995
								],
								[
									-139.867787,
									59.537762
								],
								[
									-140.825274,
									59.727517
								],
								[
									-142.574444,
									60.084447
								],
								[
									-143.958881,
									59.99918
								],
								[
									-145.925557,
									60.45861
								],
								[
									-147.114374,
									60.884656
								],
								[
									-148.224306,
									60.672989
								],
								[
									-148.018066,
									59.978329
								],
								[
									-148.570823,
									59.914173
								],
								[
									-149.727858,
									59.705658
								],
								[
									-150.608243,
									59.368211
								],
								[
									-151.716393,
									59.155821
								],
								[
									-151.859433,
									59.744984
								],
								[
									-151.409719,
									60.725803
								],
								[
									-150.346941,
									61.033588
								],
								[
									-150.621111,
									61.284425
								],
								[
									-151.895839,
									60.727198
								],
								[
									-152.57833,
									60.061657
								],
								[
									-154.019172,
									59.350279
								],
								[
									-153.287511,
									58.864728
								],
								[
									-154.232492,
									58.146374
								],
								[
									-155.307491,
									57.727795
								],
								[
									-156.308335,
									57.422774
								],
								[
									-156.556097,
									56.979985
								],
								[
									-158.117217,
									56.463608
								],
								[
									-158.433321,
									55.994154
								],
								[
									-159.603327,
									55.566686
								],
								[
									-160.28972,
									55.643581
								],
								[
									-161.223048,
									55.364735
								],
								[
									-162.237766,
									55.024187
								],
								[
									-163.069447,
									54.689737
								],
								[
									-164.785569,
									54.404173
								],
								[
									-164.942226,
									54.572225
								],
								[
									-163.84834,
									55.039431
								],
								[
									-162.870001,
									55.348043
								],
								[
									-161.804175,
									55.894986
								],
								[
									-160.563605,
									56.008055
								],
								[
									-160.07056,
									56.418055
								],
								[
									-158.684443,
									57.016675
								],
								[
									-158.461097,
									57.216921
								],
								[
									-157.72277,
									57.570001
								],
								[
									-157.550274,
									58.328326
								],
								[
									-157.041675,
									58.918885
								],
								[
									-158.194731,
									58.615802
								],
								[
									-158.517218,
									58.787781
								],
								[
									-159.058606,
									58.424186
								],
								[
									-159.711667,
									58.93139
								],
								[
									-159.981289,
									58.572549
								],
								[
									-160.355271,
									59.071123
								],
								[
									-161.355003,
									58.670838
								],
								[
									-161.968894,
									58.671665
								],
								[
									-162.054987,
									59.266925
								],
								[
									-161.874171,
									59.633621
								],
								[
									-162.518059,
									59.989724
								],
								[
									-163.818341,
									59.798056
								],
								[
									-164.662218,
									60.267484
								],
								[
									-165.346388,
									60.507496
								],
								[
									-165.350832,
									61.073895
								],
								[
									-166.121379,
									61.500019
								],
								[
									-165.734452,
									62.074997
								],
								[
									-164.919179,
									62.633076
								],
								[
									-164.562508,
									63.146378
								],
								[
									-163.753332,
									63.219449
								],
								[
									-163.067224,
									63.059459
								],
								[
									-162.260555,
									63.541936
								],
								[
									-161.53445,
									63.455817
								],
								[
									-160.772507,
									63.766108
								],
								[
									-160.958335,
									64.222799
								],
								[
									-161.518068,
									64.402788
								],
								[
									-160.777778,
									64.788604
								],
								[
									-161.391926,
									64.777235
								],
								[
									-162.45305,
									64.559445
								],
								[
									-162.757786,
									64.338605
								],
								[
									-163.546394,
									64.55916
								],
								[
									-164.96083,
									64.446945
								],
								[
									-166.425288,
									64.686672
								],
								[
									-166.845004,
									65.088896
								],
								[
									-168.11056,
									65.669997
								],
								[
									-166.705271,
									66.088318
								],
								[
									-164.47471,
									66.57666
								],
								[
									-163.652512,
									66.57666
								],
								[
									-163.788602,
									66.077207
								],
								[
									-161.677774,
									66.11612
								],
								[
									-162.489715,
									66.735565
								],
								[
									-163.719717,
									67.116395
								],
								[
									-164.430991,
									67.616338
								],
								[
									-165.390287,
									68.042772
								],
								[
									-166.764441,
									68.358877
								],
								[
									-166.204707,
									68.883031
								],
								[
									-164.430811,
									68.915535
								],
								[
									-163.168614,
									69.371115
								],
								[
									-162.930566,
									69.858062
								],
								[
									-161.908897,
									70.33333
								],
								[
									-160.934797,
									70.44769
								],
								[
									-159.039176,
									70.891642
								],
								[
									-158.119723,
									70.824721
								],
								[
									-156.580825,
									71.357764
								],
								[
									-155.06779,
									71.147776
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "UZB",
				"properties": {
					"name": "Uzbekistan"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								66.518607,
								37.362784
							],
							[
								66.54615,
								37.974685
							],
							[
								65.215999,
								38.402695
							],
							[
								64.170223,
								38.892407
							],
							[
								63.518015,
								39.363257
							],
							[
								62.37426,
								40.053886
							],
							[
								61.882714,
								41.084857
							],
							[
								61.547179,
								41.26637
							],
							[
								60.465953,
								41.220327
							],
							[
								60.083341,
								41.425146
							],
							[
								59.976422,
								42.223082
							],
							[
								58.629011,
								42.751551
							],
							[
								57.78653,
								42.170553
							],
							[
								56.932215,
								41.826026
							],
							[
								57.096391,
								41.32231
							],
							[
								55.968191,
								41.308642
							],
							[
								55.928917,
								44.995858
							],
							[
								58.503127,
								45.586804
							],
							[
								58.689989,
								45.500014
							],
							[
								60.239972,
								44.784037
							],
							[
								61.05832,
								44.405817
							],
							[
								62.0133,
								43.504477
							],
							[
								63.185787,
								43.650075
							],
							[
								64.900824,
								43.728081
							],
							[
								66.098012,
								42.99766
							],
							[
								66.023392,
								41.994646
							],
							[
								66.510649,
								41.987644
							],
							[
								66.714047,
								41.168444
							],
							[
								67.985856,
								41.135991
							],
							[
								68.259896,
								40.662325
							],
							[
								68.632483,
								40.668681
							],
							[
								69.070027,
								41.384244
							],
							[
								70.388965,
								42.081308
							],
							[
								70.962315,
								42.266154
							],
							[
								71.259248,
								42.167711
							],
							[
								70.420022,
								41.519998
							],
							[
								71.157859,
								41.143587
							],
							[
								71.870115,
								41.3929
							],
							[
								73.055417,
								40.866033
							],
							[
								71.774875,
								40.145844
							],
							[
								71.014198,
								40.244366
							],
							[
								70.601407,
								40.218527
							],
							[
								70.45816,
								40.496495
							],
							[
								70.666622,
								40.960213
							],
							[
								69.329495,
								40.727824
							],
							[
								69.011633,
								40.086158
							],
							[
								68.536416,
								39.533453
							],
							[
								67.701429,
								39.580478
							],
							[
								67.44222,
								39.140144
							],
							[
								68.176025,
								38.901553
							],
							[
								68.392033,
								38.157025
							],
							[
								67.83,
								37.144994
							],
							[
								67.075782,
								37.356144
							],
							[
								66.518607,
								37.362784
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "VEN",
				"properties": {
					"name": "Venezuela"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								-71.331584,
								11.776284
							],
							[
								-71.360006,
								11.539994
							],
							[
								-71.94705,
								11.423282
							],
							[
								-71.620868,
								10.96946
							],
							[
								-71.633064,
								10.446494
							],
							[
								-72.074174,
								9.865651
							],
							[
								-71.695644,
								9.072263
							],
							[
								-71.264559,
								9.137195
							],
							[
								-71.039999,
								9.859993
							],
							[
								-71.350084,
								10.211935
							],
							[
								-71.400623,
								10.968969
							],
							[
								-70.155299,
								11.375482
							],
							[
								-70.293843,
								11.846822
							],
							[
								-69.943245,
								12.162307
							],
							[
								-69.5843,
								11.459611
							],
							[
								-68.882999,
								11.443385
							],
							[
								-68.233271,
								10.885744
							],
							[
								-68.194127,
								10.554653
							],
							[
								-67.296249,
								10.545868
							],
							[
								-66.227864,
								10.648627
							],
							[
								-65.655238,
								10.200799
							],
							[
								-64.890452,
								10.077215
							],
							[
								-64.329479,
								10.389599
							],
							[
								-64.318007,
								10.641418
							],
							[
								-63.079322,
								10.701724
							],
							[
								-61.880946,
								10.715625
							],
							[
								-62.730119,
								10.420269
							],
							[
								-62.388512,
								9.948204
							],
							[
								-61.588767,
								9.873067
							],
							[
								-60.830597,
								9.38134
							],
							[
								-60.671252,
								8.580174
							],
							[
								-60.150096,
								8.602757
							],
							[
								-59.758285,
								8.367035
							],
							[
								-60.550588,
								7.779603
							],
							[
								-60.637973,
								7.415
							],
							[
								-60.295668,
								7.043911
							],
							[
								-60.543999,
								6.856584
							],
							[
								-61.159336,
								6.696077
							],
							[
								-61.139415,
								6.234297
							],
							[
								-61.410303,
								5.959068
							],
							[
								-60.733574,
								5.200277
							],
							[
								-60.601179,
								4.918098
							],
							[
								-60.966893,
								4.536468
							],
							[
								-62.08543,
								4.162124
							],
							[
								-62.804533,
								4.006965
							],
							[
								-63.093198,
								3.770571
							],
							[
								-63.888343,
								4.02053
							],
							[
								-64.628659,
								4.148481
							],
							[
								-64.816064,
								4.056445
							],
							[
								-64.368494,
								3.79721
							],
							[
								-64.408828,
								3.126786
							],
							[
								-64.269999,
								2.497006
							],
							[
								-63.422867,
								2.411068
							],
							[
								-63.368788,
								2.2009
							],
							[
								-64.083085,
								1.916369
							],
							[
								-64.199306,
								1.492855
							],
							[
								-64.611012,
								1.328731
							],
							[
								-65.354713,
								1.095282
							],
							[
								-65.548267,
								0.789254
							],
							[
								-66.325765,
								0.724452
							],
							[
								-66.876326,
								1.253361
							],
							[
								-67.181294,
								2.250638
							],
							[
								-67.447092,
								2.600281
							],
							[
								-67.809938,
								2.820655
							],
							[
								-67.303173,
								3.318454
							],
							[
								-67.337564,
								3.542342
							],
							[
								-67.621836,
								3.839482
							],
							[
								-67.823012,
								4.503937
							],
							[
								-67.744697,
								5.221129
							],
							[
								-67.521532,
								5.55687
							],
							[
								-67.34144,
								6.095468
							],
							[
								-67.695087,
								6.267318
							],
							[
								-68.265052,
								6.153268
							],
							[
								-68.985319,
								6.206805
							],
							[
								-69.38948,
								6.099861
							],
							[
								-70.093313,
								6.960376
							],
							[
								-70.674234,
								7.087785
							],
							[
								-71.960176,
								6.991615
							],
							[
								-72.198352,
								7.340431
							],
							[
								-72.444487,
								7.423785
							],
							[
								-72.479679,
								7.632506
							],
							[
								-72.360901,
								8.002638
							],
							[
								-72.439862,
								8.405275
							],
							[
								-72.660495,
								8.625288
							],
							[
								-72.78873,
								9.085027
							],
							[
								-73.304952,
								9.152
							],
							[
								-73.027604,
								9.73677
							],
							[
								-72.905286,
								10.450344
							],
							[
								-72.614658,
								10.821975
							],
							[
								-72.227575,
								11.108702
							],
							[
								-71.973922,
								11.608672
							],
							[
								-71.331584,
								11.776284
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "VNM",
				"properties": {
					"name": "Vietnam"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								108.05018,
								21.55238
							],
							[
								106.715068,
								20.696851
							],
							[
								105.881682,
								19.75205
							],
							[
								105.662006,
								19.058165
							],
							[
								106.426817,
								18.004121
							],
							[
								107.361954,
								16.697457
							],
							[
								108.269495,
								16.079742
							],
							[
								108.877107,
								15.276691
							],
							[
								109.33527,
								13.426028
							],
							[
								109.200136,
								11.666859
							],
							[
								108.36613,
								11.008321
							],
							[
								107.220929,
								10.364484
							],
							[
								106.405113,
								9.53084
							],
							[
								105.158264,
								8.59976
							],
							[
								104.795185,
								9.241038
							],
							[
								105.076202,
								9.918491
							],
							[
								104.334335,
								10.486544
							],
							[
								105.199915,
								10.88931
							],
							[
								106.24967,
								10.961812
							],
							[
								105.810524,
								11.567615
							],
							[
								107.491403,
								12.337206
							],
							[
								107.614548,
								13.535531
							],
							[
								107.382727,
								14.202441
							],
							[
								107.564525,
								15.202173
							],
							[
								107.312706,
								15.908538
							],
							[
								106.556008,
								16.604284
							],
							[
								105.925762,
								17.485315
							],
							[
								105.094598,
								18.666975
							],
							[
								103.896532,
								19.265181
							],
							[
								104.183388,
								19.624668
							],
							[
								104.822574,
								19.886642
							],
							[
								104.435,
								20.758733
							],
							[
								103.203861,
								20.766562
							],
							[
								102.754896,
								21.675137
							],
							[
								102.170436,
								22.464753
							],
							[
								102.706992,
								22.708795
							],
							[
								103.504515,
								22.703757
							],
							[
								104.476858,
								22.81915
							],
							[
								105.329209,
								23.352063
							],
							[
								105.811247,
								22.976892
							],
							[
								106.725403,
								22.794268
							],
							[
								106.567273,
								22.218205
							],
							[
								107.04342,
								21.811899
							],
							[
								108.05018,
								21.55238
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "VUT",
				"properties": {
					"name": "Vanuatu"
				},
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [
						[
							[
								[
									167.844877,
									-16.466333
								],
								[
									167.515181,
									-16.59785
								],
								[
									167.180008,
									-16.159995
								],
								[
									167.216801,
									-15.891846
								],
								[
									167.844877,
									-16.466333
								]
							]
						],
						[
							[
								[
									167.107712,
									-14.93392
								],
								[
									167.270028,
									-15.740021
								],
								[
									167.001207,
									-15.614602
								],
								[
									166.793158,
									-15.668811
								],
								[
									166.649859,
									-15.392704
								],
								[
									166.629137,
									-14.626497
								],
								[
									167.107712,
									-14.93392
								]
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "PSE",
				"properties": {
					"name": "West Bank"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								35.545665,
								32.393992
							],
							[
								35.545252,
								31.782505
							],
							[
								35.397561,
								31.489086
							],
							[
								34.927408,
								31.353435
							],
							[
								34.970507,
								31.616778
							],
							[
								35.225892,
								31.754341
							],
							[
								34.974641,
								31.866582
							],
							[
								35.18393,
								32.532511
							],
							[
								35.545665,
								32.393992
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "YEM",
				"properties": {
					"name": "Yemen"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								53.108573,
								16.651051
							],
							[
								52.385206,
								16.382411
							],
							[
								52.191729,
								15.938433
							],
							[
								52.168165,
								15.59742
							],
							[
								51.172515,
								15.17525
							],
							[
								49.574576,
								14.708767
							],
							[
								48.679231,
								14.003202
							],
							[
								48.238947,
								13.94809
							],
							[
								47.938914,
								14.007233
							],
							[
								47.354454,
								13.59222
							],
							[
								46.717076,
								13.399699
							],
							[
								45.877593,
								13.347764
							],
							[
								45.62505,
								13.290946
							],
							[
								45.406459,
								13.026905
							],
							[
								45.144356,
								12.953938
							],
							[
								44.989533,
								12.699587
							],
							[
								44.494576,
								12.721653
							],
							[
								44.175113,
								12.58595
							],
							[
								43.482959,
								12.6368
							],
							[
								43.222871,
								13.22095
							],
							[
								43.251448,
								13.767584
							],
							[
								43.087944,
								14.06263
							],
							[
								42.892245,
								14.802249
							],
							[
								42.604873,
								15.213335
							],
							[
								42.805015,
								15.261963
							],
							[
								42.702438,
								15.718886
							],
							[
								42.823671,
								15.911742
							],
							[
								42.779332,
								16.347891
							],
							[
								43.218375,
								16.66689
							],
							[
								43.115798,
								17.08844
							],
							[
								43.380794,
								17.579987
							],
							[
								43.791519,
								17.319977
							],
							[
								44.062613,
								17.410359
							],
							[
								45.216651,
								17.433329
							],
							[
								45.399999,
								17.333335
							],
							[
								46.366659,
								17.233315
							],
							[
								46.749994,
								17.283338
							],
							[
								47.000005,
								16.949999
							],
							[
								47.466695,
								17.116682
							],
							[
								48.183344,
								18.166669
							],
							[
								49.116672,
								18.616668
							],
							[
								52.00001,
								19.000003
							],
							[
								52.782184,
								17.349742
							],
							[
								53.108573,
								16.651051
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ZAF",
				"properties": {
					"name": "South Africa"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								31.521001,
								-29.257387
							],
							[
								31.325561,
								-29.401978
							],
							[
								30.901763,
								-29.909957
							],
							[
								30.622813,
								-30.423776
							],
							[
								30.055716,
								-31.140269
							],
							[
								28.925553,
								-32.172041
							],
							[
								28.219756,
								-32.771953
							],
							[
								27.464608,
								-33.226964
							],
							[
								26.419452,
								-33.61495
							],
							[
								25.909664,
								-33.66704
							],
							[
								25.780628,
								-33.944646
							],
							[
								25.172862,
								-33.796851
							],
							[
								24.677853,
								-33.987176
							],
							[
								23.594043,
								-33.794474
							],
							[
								22.988189,
								-33.916431
							],
							[
								22.574157,
								-33.864083
							],
							[
								21.542799,
								-34.258839
							],
							[
								20.689053,
								-34.417175
							],
							[
								20.071261,
								-34.795137
							],
							[
								19.616405,
								-34.819166
							],
							[
								19.193278,
								-34.462599
							],
							[
								18.855315,
								-34.444306
							],
							[
								18.424643,
								-33.997873
							],
							[
								18.377411,
								-34.136521
							],
							[
								18.244499,
								-33.867752
							],
							[
								18.25008,
								-33.281431
							],
							[
								17.92519,
								-32.611291
							],
							[
								18.24791,
								-32.429131
							],
							[
								18.221762,
								-31.661633
							],
							[
								17.566918,
								-30.725721
							],
							[
								17.064416,
								-29.878641
							],
							[
								17.062918,
								-29.875954
							],
							[
								16.344977,
								-28.576705
							],
							[
								16.824017,
								-28.082162
							],
							[
								17.218929,
								-28.355943
							],
							[
								17.387497,
								-28.783514
							],
							[
								17.836152,
								-28.856378
							],
							[
								18.464899,
								-29.045462
							],
							[
								19.002127,
								-28.972443
							],
							[
								19.894734,
								-28.461105
							],
							[
								19.895768,
								-24.76779
							],
							[
								20.165726,
								-24.917962
							],
							[
								20.758609,
								-25.868136
							],
							[
								20.66647,
								-26.477453
							],
							[
								20.889609,
								-26.828543
							],
							[
								21.605896,
								-26.726534
							],
							[
								22.105969,
								-26.280256
							],
							[
								22.579532,
								-25.979448
							],
							[
								22.824271,
								-25.500459
							],
							[
								23.312097,
								-25.26869
							],
							[
								23.73357,
								-25.390129
							],
							[
								24.211267,
								-25.670216
							],
							[
								25.025171,
								-25.71967
							],
							[
								25.664666,
								-25.486816
							],
							[
								25.765849,
								-25.174845
							],
							[
								25.941652,
								-24.696373
							],
							[
								26.485753,
								-24.616327
							],
							[
								26.786407,
								-24.240691
							],
							[
								27.11941,
								-23.574323
							],
							[
								28.017236,
								-22.827754
							],
							[
								29.432188,
								-22.091313
							],
							[
								29.839037,
								-22.102216
							],
							[
								30.322883,
								-22.271612
							],
							[
								30.659865,
								-22.151567
							],
							[
								31.191409,
								-22.25151
							],
							[
								31.670398,
								-23.658969
							],
							[
								31.930589,
								-24.369417
							],
							[
								31.752408,
								-25.484284
							],
							[
								31.837778,
								-25.843332
							],
							[
								31.333158,
								-25.660191
							],
							[
								31.04408,
								-25.731452
							],
							[
								30.949667,
								-26.022649
							],
							[
								30.676609,
								-26.398078
							],
							[
								30.685962,
								-26.743845
							],
							[
								31.282773,
								-27.285879
							],
							[
								31.86806,
								-27.177927
							],
							[
								32.071665,
								-26.73382
							],
							[
								32.83012,
								-26.742192
							],
							[
								32.580265,
								-27.470158
							],
							[
								32.462133,
								-28.301011
							],
							[
								32.203389,
								-28.752405
							],
							[
								31.521001,
								-29.257387
							]
						],
						[
							[
								28.978263,
								-28.955597
							],
							[
								28.5417,
								-28.647502
							],
							[
								28.074338,
								-28.851469
							],
							[
								27.532511,
								-29.242711
							],
							[
								26.999262,
								-29.875954
							],
							[
								27.749397,
								-30.645106
							],
							[
								28.107205,
								-30.545732
							],
							[
								28.291069,
								-30.226217
							],
							[
								28.8484,
								-30.070051
							],
							[
								29.018415,
								-29.743766
							],
							[
								29.325166,
								-29.257387
							],
							[
								28.978263,
								-28.955597
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ZMB",
				"properties": {
					"name": "Zambia"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								32.759375,
								-9.230599
							],
							[
								33.231388,
								-9.676722
							],
							[
								33.485688,
								-10.525559
							],
							[
								33.31531,
								-10.79655
							],
							[
								33.114289,
								-11.607198
							],
							[
								33.306422,
								-12.435778
							],
							[
								32.991764,
								-12.783871
							],
							[
								32.688165,
								-13.712858
							],
							[
								33.214025,
								-13.97186
							],
							[
								30.179481,
								-14.796099
							],
							[
								30.274256,
								-15.507787
							],
							[
								29.516834,
								-15.644678
							],
							[
								28.947463,
								-16.043051
							],
							[
								28.825869,
								-16.389749
							],
							[
								28.467906,
								-16.4684
							],
							[
								27.598243,
								-17.290831
							],
							[
								27.044427,
								-17.938026
							],
							[
								26.706773,
								-17.961229
							],
							[
								26.381935,
								-17.846042
							],
							[
								25.264226,
								-17.73654
							],
							[
								25.084443,
								-17.661816
							],
							[
								25.07695,
								-17.578823
							],
							[
								24.682349,
								-17.353411
							],
							[
								24.033862,
								-17.295843
							],
							[
								23.215048,
								-17.523116
							],
							[
								22.562478,
								-16.898451
							],
							[
								21.887843,
								-16.08031
							],
							[
								21.933886,
								-12.898437
							],
							[
								24.016137,
								-12.911046
							],
							[
								23.930922,
								-12.565848
							],
							[
								24.079905,
								-12.191297
							],
							[
								23.904154,
								-11.722282
							],
							[
								24.017894,
								-11.237298
							],
							[
								23.912215,
								-10.926826
							],
							[
								24.257155,
								-10.951993
							],
							[
								24.314516,
								-11.262826
							],
							[
								24.78317,
								-11.238694
							],
							[
								25.418118,
								-11.330936
							],
							[
								25.75231,
								-11.784965
							],
							[
								26.553088,
								-11.92444
							],
							[
								27.16442,
								-11.608748
							],
							[
								27.388799,
								-12.132747
							],
							[
								28.155109,
								-12.272481
							],
							[
								28.523562,
								-12.698604
							],
							[
								28.934286,
								-13.248958
							],
							[
								29.699614,
								-13.257227
							],
							[
								29.616001,
								-12.178895
							],
							[
								29.341548,
								-12.360744
							],
							[
								28.642417,
								-11.971569
							],
							[
								28.372253,
								-11.793647
							],
							[
								28.49607,
								-10.789884
							],
							[
								28.673682,
								-9.605925
							],
							[
								28.449871,
								-9.164918
							],
							[
								28.734867,
								-8.526559
							],
							[
								29.002912,
								-8.407032
							],
							[
								30.346086,
								-8.238257
							],
							[
								30.740015,
								-8.340007
							],
							[
								31.157751,
								-8.594579
							],
							[
								31.556348,
								-8.762049
							],
							[
								32.191865,
								-8.930359
							],
							[
								32.759375,
								-9.230599
							]
						]
					]
				}
			},
			{
				"type": "Feature",
				"id": "ZWE",
				"properties": {
					"name": "Zimbabwe"
				},
				"geometry": {
					"type": "Polygon",
					"coordinates": [
						[
							[
								31.191409,
								-22.25151
							],
							[
								30.659865,
								-22.151567
							],
							[
								30.322883,
								-22.271612
							],
							[
								29.839037,
								-22.102216
							],
							[
								29.432188,
								-22.091313
							],
							[
								28.794656,
								-21.639454
							],
							[
								28.02137,
								-21.485975
							],
							[
								27.727228,
								-20.851802
							],
							[
								27.724747,
								-20.499059
							],
							[
								27.296505,
								-20.39152
							],
							[
								26.164791,
								-19.293086
							],
							[
								25.850391,
								-18.714413
							],
							[
								25.649163,
								-18.536026
							],
							[
								25.264226,
								-17.73654
							],
							[
								26.381935,
								-17.846042
							],
							[
								26.706773,
								-17.961229
							],
							[
								27.044427,
								-17.938026
							],
							[
								27.598243,
								-17.290831
							],
							[
								28.467906,
								-16.4684
							],
							[
								28.825869,
								-16.389749
							],
							[
								28.947463,
								-16.043051
							],
							[
								29.516834,
								-15.644678
							],
							[
								30.274256,
								-15.507787
							],
							[
								30.338955,
								-15.880839
							],
							[
								31.173064,
								-15.860944
							],
							[
								31.636498,
								-16.07199
							],
							[
								31.852041,
								-16.319417
							],
							[
								32.328239,
								-16.392074
							],
							[
								32.847639,
								-16.713398
							],
							[
								32.849861,
								-17.979057
							],
							[
								32.654886,
								-18.67209
							],
							[
								32.611994,
								-19.419383
							],
							[
								32.772708,
								-19.715592
							],
							[
								32.659743,
								-20.30429
							],
							[
								32.508693,
								-20.395292
							],
							[
								32.244988,
								-21.116489
							],
							[
								31.191409,
								-22.25151
							]
						]
					]
				}
			}
		]
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (svg) {
		//SVG filter for the gooey effect
		//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
		var defs = svg.append("defs");

		var filter = defs.append("filter").attr("id", "gooeyCodeFilter");

		filter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "10")
		//to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
		.attr("color-interpolation-filters", "sRGB").attr("result", "blur");
		filter.append("feColorMatrix").attr("class", "blurValues").attr("in", "blur").attr("mode", "matrix").attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -5").attr("result", "gooey");
		filter.append("feBlend").attr("in", "SourceGraphic").attr("in2", "gooey").attr("operator", "atop");
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _d3Collection = __webpack_require__(12);

	var _d3Hierarchy = __webpack_require__(22);

	var _d3Force = __webpack_require__(16);

	var computePositions = function computePositions(populations, size) {
	  var centers = (0, _d3Collection.nest)().key(function (population) {
	    return population.country;
	  }).entries(populations).map(function (country) {
	    return { name: country.key, value: 1 };
	  });

	  var root = (0, _d3Hierarchy.hierarchy)({ children: centers }).sum(function (d) {
	    return d.value;
	  });
	  var layout = (0, _d3Hierarchy.pack)().size(size);
	  layout(root);
	  var mapping = {};
	  root.children.forEach(function (d) {
	    mapping[d.data.name] = { x: d.x, y: d.y };
	  });
	  return mapping;
	};

	var svg = null;
	var nodes = null;
	var size = null;
	var populations = null;
	var cityPositions = null;

	var cluster = function cluster() {};

	cluster.init = function (_svg_, _nodes_, _populations_, _size_) {
	  svg = _svg_;
	  nodes = _nodes_;
	  size = _size_;
	  populations = _populations_;
	  cityPositions = computePositions(populations, size);

	  var labelWrapper = svg.append("g").attr("class", "labelWrapper");

	  labelWrapper.selectAll(".label").data((0, _d3Collection.entries)(cityPositions)).enter().append("text").attr("class", "label").style("opacity", 0).attr("transform", function (d) {
	    return "translate(" + d.value.x + ", " + (d.value.y - 60) + ")";
	  }).text(function (d) {
	    return d.key;
	  });

	  return cluster;
	};

	cluster.start = function () {
	  // hide map
	  svg.selectAll('.geo-path').transition().duration(3000).style('fill-opacity', 0);

	  // hide map
	  svg.selectAll('.label').transition().duration(3000).style('opacity', 1);

	  function ticked() {
	    nodes.attr('cx', function (d) {
	      return d.x;
	    }).attr('cy', function (d) {
	      return d.y;
	    });
	  }

	  var simulation = (0, _d3Force.forceSimulation)(populations).velocityDecay(0.3).force("x", function (alpha) {
	    for (var i = 0, n = populations.length, node, k = alpha * 0.1; i < n; ++i) {
	      node = populations[i];
	      node.vx -= (node.x - cityPositions[node.country].x) * k;
	      node.vy -= (node.y - cityPositions[node.country].y) * k;
	    }
	  }).force("collide", (0, _d3Force.forceCollide)().radius(function (d) {
	    return d.r + 0.5;
	  }).iterations(2)).on("tick", ticked);
	};

	module.exports = cluster;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-hierarchy/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function defaultSeparation(a, b) {
	    return a.parent === b.parent ? 1 : 2;
	  }

	  function meanX(children) {
	    return children.reduce(meanXReduce, 0) / children.length;
	  }

	  function meanXReduce(x, c) {
	    return x + c.x;
	  }

	  function maxY(children) {
	    return 1 + children.reduce(maxYReduce, 0);
	  }

	  function maxYReduce(y, c) {
	    return Math.max(y, c.y);
	  }

	  function leafLeft(node) {
	    var children;
	    while (children = node.children) node = children[0];
	    return node;
	  }

	  function leafRight(node) {
	    var children;
	    while (children = node.children) node = children[children.length - 1];
	    return node;
	  }

	  function cluster() {
	    var separation = defaultSeparation,
	        dx = 1,
	        dy = 1,
	        nodeSize = false;

	    function cluster(root) {
	      var previousNode,
	          x = 0;

	      // First walk, computing the initial x & y values.
	      root.eachAfter(function(node) {
	        var children = node.children;
	        if (children) {
	          node.x = meanX(children);
	          node.y = maxY(children);
	        } else {
	          node.x = previousNode ? x += separation(node, previousNode) : 0;
	          node.y = 0;
	          previousNode = node;
	        }
	      });

	      var left = leafLeft(root),
	          right = leafRight(root),
	          x0 = left.x - separation(left, right) / 2,
	          x1 = right.x + separation(right, left) / 2;

	      // Second walk, normalizing x & y to the desired size.
	      return root.eachAfter(nodeSize ? function(node) {
	        node.x = (node.x - root.x) * dx;
	        node.y = (root.y - node.y) * dy;
	      } : function(node) {
	        node.x = (node.x - x0) / (x1 - x0) * dx;
	        node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
	      });
	    }

	    cluster.separation = function(x) {
	      return arguments.length ? (separation = x, cluster) : separation;
	    };

	    cluster.size = function(x) {
	      return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? null : [dx, dy]);
	    };

	    cluster.nodeSize = function(x) {
	      return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], cluster) : (nodeSize ? [dx, dy] : null);
	    };

	    return cluster;
	  }

	  function node_each(callback) {
	    var node = this, current, next = [node], children, i, n;
	    do {
	      current = next.reverse(), next = [];
	      while (node = current.pop()) {
	        callback(node), children = node.children;
	        if (children) for (i = 0, n = children.length; i < n; ++i) {
	          next.push(children[i]);
	        }
	      }
	    } while (next.length);
	    return this;
	  }

	  function node_eachBefore(callback) {
	    var node = this, nodes = [node], children, i;
	    while (node = nodes.pop()) {
	      callback(node), children = node.children;
	      if (children) for (i = children.length - 1; i >= 0; --i) {
	        nodes.push(children[i]);
	      }
	    }
	    return this;
	  }

	  function node_eachAfter(callback) {
	    var node = this, nodes = [node], next = [], children, i, n;
	    while (node = nodes.pop()) {
	      next.push(node), children = node.children;
	      if (children) for (i = 0, n = children.length; i < n; ++i) {
	        nodes.push(children[i]);
	      }
	    }
	    while (node = next.pop()) {
	      callback(node);
	    }
	    return this;
	  }

	  function node_sum(value) {
	    return this.eachAfter(function(node) {
	      var sum = +value(node.data) || 0,
	          children = node.children,
	          i = children && children.length;
	      while (--i >= 0) sum += children[i].value;
	      node.value = sum;
	    });
	  }

	  function node_sort(compare) {
	    return this.eachBefore(function(node) {
	      if (node.children) {
	        node.children.sort(compare);
	      }
	    });
	  }

	  function node_path(end) {
	    var start = this,
	        ancestor = leastCommonAncestor(start, end),
	        nodes = [start];
	    while (start !== ancestor) {
	      start = start.parent;
	      nodes.push(start);
	    }
	    var k = nodes.length;
	    while (end !== ancestor) {
	      nodes.splice(k, 0, end);
	      end = end.parent;
	    }
	    return nodes;
	  }

	  function leastCommonAncestor(a, b) {
	    if (a === b) return a;
	    var aNodes = a.ancestors(),
	        bNodes = b.ancestors(),
	        c = null;
	    a = aNodes.pop();
	    b = bNodes.pop();
	    while (a === b) {
	      c = a;
	      a = aNodes.pop();
	      b = bNodes.pop();
	    }
	    return c;
	  }

	  function node_ancestors() {
	    var node = this, nodes = [node];
	    while (node = node.parent) {
	      nodes.push(node);
	    }
	    return nodes;
	  }

	  function node_descendants() {
	    var nodes = [];
	    this.each(function(node) {
	      nodes.push(node);
	    });
	    return nodes;
	  }

	  function node_leaves() {
	    var leaves = [];
	      }
	  }

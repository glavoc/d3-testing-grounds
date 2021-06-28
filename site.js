let cars = [
  {
    "color": "purple",
    "type": "bus",
    "capacity": 22
  },
  {
    "color": "purple",
    "type": "minivan",
    "capacity": 7
  },
  {
    "color": "red",
    "type": "wagon",
    "capacity": 5
  },
  {
    "color": "gray",
    "type": "sports",
    "capacity": 2
  },
  {
    "color": "blue",
    "type": "limo",
    "capacity": 5
  },
]


var width = 900
var height = 900
var margin = 50
var radius = Math.min(width, height) / 2 - margin

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];


var svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height)
  //.style("display", "block")
  //.style("margin", "auto")


var g = svg
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")


var color = d3.scaleOrdinal()
  .domain(cars)
  .range(colorArray);

// Generate the pie
var pie = d3.pie()
  .sort(null)
  .value(function (d) {
    return d.capacity
  })

// Generate the arcs
var arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius - 50);
// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.8)
  .outerRadius(radius * 0.6)

//Generate groups
var arcs = g.selectAll("arc")
  .data(pie(cars))
  .enter().append("path")
  .attr("fill", function (d, i) { return (color(i)) })
  .attr("d", arc)
  .attr('class', "arc")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut)
//.on("click", function (e, d) { alert(d.data.capacity); })

//Draw arc paths
function handleMouseOver(d, i) {  // Add interactivity
  // Specify where to put label of text
  d3.select(d.path[0]).transition()
    .attr("transform", "scale(1.4,1.4)")
}

function handleMouseOut(d, i) {
  d3.select(d.path[0]).transition()
    .attr("transform", "scale(1,1)")
}

// Add the polylines between chart and labels:
g
  .selectAll('allPolylines')
  .data(pie(cars))
  .enter()
  .append('polyline')
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 1)
  .attr('points', function (d) {
    var posA = arc.centroid(d) // line insertion in the slice
    var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
    var posC = outerArc.centroid(d); // Label position = almost the same as posB
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
    posC[0] = radius * 0.85 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
    return [posA, posB, posC]
  })


// Add the polylines between chart and labels:
g
  .selectAll('allLabels')
  .data(pie(cars))
  .enter()
  .append('text')
  .text(function (d) { console.log(d.data.type); return d.data.type })
  .attr('transform', function (d) {
    var pos = outerArc.centroid(d);
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
    return 'translate(' + pos + ')';
  })
  .style('text-anchor', function (d) {
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
    return (midangle < Math.PI ? 'start' : 'end')
  })



window.addEventListener("resize", function () {
  var targetWidth = document.documentElement.clientWidth; 
  var aspect = 1.2;
  svg.attr("width", targetWidth);
  svg.attr("height", Math.round(targetWidth / aspect));
})

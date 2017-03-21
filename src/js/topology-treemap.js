
var width = 960,
    height = 1060;
var dataNodes = getNodes();

var format = d3.format(",d");

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
        .map(function(c) { c = d3.rgb(c); c.opacity = 0.6; return c; }));

var stratify = d3.stratify()
    .parentId(function(d) { return d.parentId; });

var treemap = d3.treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  var root = stratify(dataNodes)
      .sum(function(d) { return d.value ? 1 : 0; })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(root);

  d3.select("body")
    .selectAll(".node")
    .data(root.leaves())
    .enter().append("div")
    .attr("class", "node")
    .attr("title", function(d) { return d.id; })
    .style("left", function(d) { return d.x0 + "px"; })
    .style("top", function(d) { return d.y0 + "px"; })
    // .style("width", function(d) { return d.x1 - d.x0 + "px"; })
    // .style("height", function(d) { return d.y1 - d.y0 + "px"; })
    .style("background", function(d) { while (d.depth > 1) d = d.parent; return color(d.id); })
    .append("div")
      .attr("class", "node-label")
      .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n"); });

  d3.select("body")
    .selectAll(".link")
    .data(root.links())
    .enter().append("line")
    .attr("class", "link")
    .attr("left", function(d){
      return d.source.x0 + "px"
    })
    .attr("top", function(d){
      return d.source.y0 + "px"
    })
    .attr("width", function(d){
      return d.target.x0 - d.source.x0 + "px"
    })
    .attr("height", function(d){
      return d.target.y0 - d.source.y0 + "px"
    })


function type(d) {
  d.value = +d.value;
  return d;
}
function getNodes(){
  return [
    { id: "1", value: 1, parentId: ""},
    { id: "2", value: 1, parentId: "1"},
    { id: "3", value: 1, parentId: "1"},
    { id: "4", value: 1, parentId: "1"},
    { id: "5", value: 1, parentId: "1"},
    { id: "6", value: 1, parentId: "1"},
    { id: "7", value: 1, parentId: "1"},
    { id: "8", value: 1, parentId: "1"},
    { id: "9", value: 1, parentId: "1"},
    { id: "10", value: 1, parentId: "1"},
    { id: "11", value: 1, parentId: "1"},
    { id: "12", value: 1, parentId: "1"},
    { id: "13", value: 1, parentId: "1"},
  ];
}
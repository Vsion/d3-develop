var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var format = d3.format(",d");

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var pack = d3.pack()
    .size([width, height])
    .padding(1.5);

  var classes = getClasses();
  var links = getLinks();
  var root = d3.hierarchy({children: classes, links: links})
      .sum(function(d) { return d.value; })
      .each(function(d) {
        var id = d.data.id;
        if (id) {
          //d.parent = getNode(d.data.parent, d.parent.children);
          // var id, i = id.lastIndexOf(".");
          d.id = id;
          d.package = id.slice(0, 1);
          d.class = id.slice(1);
        }
      });


  var link = svg.selectAll(".link")
    .data(getLinksData(pack(root).links(), links))
    .enter().append("line")
      .attr("class", "link")
      .attr("x1", function(d){ return d.source.x; })
      .attr("x2", function(d){ return d.target.x; })
      .attr("y1", function(d){ return d.source.y; })
      .attr("y2", function(d){ return d.target.y; })
  // var link = svg
  //     .append("g")
  //     .attr("class","links")
  //     .selectAll(".line")
  //     .data(pack(root).links())

  //     .enter()
  //     .append("line")
  //     .attr("class", "link")
  //     .attr("class", function(){

  //     })
  //     // .attr("stroke-width", function(l) { return l.width; })
  //     .attr("style", function(l) { return "stroke: #" + (l.color || "999"); })
      // .on("mouseenter", function(l){
      //   $(self.container + " img#hintImg")
      //   .attr("style", "display: block; top: " + (d3.event.clientY) + "px; left: " + (d3.event.clientX) + "px;" )
      //   .attr("data-id", l.id);
      // });


  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r/3; })
      .style("fill", function(d) { return color(d.package); });

  node.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.id; });

  node.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .selectAll("tspan")
    .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
      .text(function(d) { return d; });

  node.append("title")
      .text(function(d) { return d.id + "\n" + format(d.value); });



function getNode(nid, ns){
  var p = null, b = false;debugger
  ns.forEach(function(o, i){
    if( o.data.id == nid ){
      p = o;
      b = true;
    }
    if(b)return false;
  })
  return p;
}
function getClasses(){
  var classes = [
    { id: "1",  value: 3938, parent: "2" },
    { id: "2",  value: 3812, parent: "3" },
    { id: "3",  value: 6714, parent: "4" },
    { id: "4",  value: 743, parent: "2" },
    { id: "5",  value: 3534, parent: "3" },
    { id: "6",  value: 5731, parent: "2" },
    { id: "7",  value: 7840, parent: "3" },
    { id: "8",  value: 5914, parent: "5" },
    { id: "9",  value: 3416, parent: "6" },
  ];
  return classes;
}
function getLinks(){
  var links = [
    { id:"2", source: "1", target: "4", width: 5},
    { id:"3", source: "1", target: "5", width: 5},
    { id:"4", source: "1", target: "9", width: 5},
    { id:"5", source: "2", target: "3", width: 5},
    { id:"6", source: "2", target: "6", width: 5},
    { id:"7", source: "3", target: "7", width: 5},
    { id:"8", source: "3", target: "5", width: 5},
    { id:"9", source: "4", target: "8", width: 5},
  ];
  return links;
}
function getLinksData (rootLinks, links){
  links.forEach(function(l, i){
    //l.source l.target
    l.source = findNode(rootLinks, l.source);
    l.target = findNode(rootLinks, l.target);
  });
  return links;
}
function findNode(rootLinks, id){
  var node = null;
  rootLinks.forEach(function(rl){
    if(rl.target.id == id){
      node = rl.target;
      return false;
    }
  })
  return node;
}
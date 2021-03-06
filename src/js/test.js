var topology = (function(self, opt){
  var data = opt.columns || [];
  self.init = function(){
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(40,0)");

    var tree = d3.cluster()
        .size([height, width - 160]);

    var stratify = d3.stratify("1")
        .parentId(function(d) {
          debugger
          return d.pid;
          //return d.id.substring(0, d.id.lastIndexOf("."));
        })
        // .childId(function(d){
        //   debugger
        // });


    var root = stratify(data)
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

    tree(root);

    var link = g.selectAll(".link")
        .data(root.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
          return "M" + d.y + "," + d.x
              + "C" + (d.parent.y + 100) + "," + d.x
              + " " + (d.parent.y + 100) + "," + d.parent.x
              + " " + d.parent.y + "," + d.parent.x
              // + " " + (d.parent.y + 100) + "," + d.parent.x
              // + "C" + (d.parent.y + 100) + "," + d.x
              // + "M" + d.y + "," + d.x
        });

    var node = g.selectAll(".node")
        .data(root.descendants())
      .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", function(d) { debugger; return d.children ? -8 : 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });

  }
  return self;
})({}, opt);

$(function(){
  topology.init();
});

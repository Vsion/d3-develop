var d3_develop = (function(self, opt){
  self.size = 1;
  self.baseSize = opt.baseSize || 80;
  opt = setDefaultOpt(opt);
  function setDefaultOpt(opt){
    opt.nodes.forEach(function(d){
      if(!!!d.size){
        d.size = 1;
      }else if(self.size < d.size){
        self.size = d.size;
      }
    });
    return opt;
  }

  self.init = function(){
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-1500 * self.size))
        .force("center", d3.forceCenter(width / 2, height / 2));


    var link = svg.append("g")
        .attr("class","links")
        .selectAll("line")
        .data(opt.links)
        .enter().append("line")
        .attr("class",  function(l){
          return "link";
        })
        .attr("stroke-width", function(l) { return l.width; })
        .attr("style", function(l) { return "stroke: #" + (l.color || "999"); })
        .on("mouseenter", function(){
          d3.event.clientX
        });

    var zoom = d3.zoom()
            .scaleExtent([1,10])//用于设置最小和最大的缩放比例
            .on("zoom",function(d, i, ds){
              zoomed(d, i, ds , this)
            });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(opt.nodes)
        .enter()
        .append("svg:image")
        .attr("class", "circle")
        .attr("xlink:href", function(d){ return d.img; })

        .attr("width", function(d){ return getSize(d) })
        .attr("height", function(d){ return getSize(d) })
        .on("click", function(d, i, doms){

        })
        //.call(zoom);
        // .call(d3.drag()
        //       .on("start", dragstarted)
        //       .on("drag", dragged)
        //       .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.title; });

    simulation
        .nodes(opt.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(opt.links);

    // simulation.force("gravity", 0.05);
    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x*1; })
          .attr("y1", function(d) { return d.source.y*1; })
          .attr("x2", function(d) { return d.target.x*1; })
          .attr("y2", function(d) { return d.target.y*1; });

      node
          .attr("x", function(d) { return d.x*1 - d.size*self.baseSize/2; })
          .attr("y", function(d) { return d.y*1 - d.size*self.baseSize/2; });
    }
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    function getSize(d){
      var size = (d.size || 1) * self.baseSize;
      return size + "px";
    }
    function zoomed(d, i, ds , ele){
      var scale = d3.event.transform.k;
      var imgs = $(ele).parent().find("image");
      imgs.attr("transform", "scale(" + scale + "," + scale + ")");
    }
  }

  return self;
})({}, opt)

$(function(){
  d3_develop.init();
});
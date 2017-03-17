var d3_develop = (function(self, opt){
  self.size = 1;
  self.baseSize = opt.baseSize || 40;
  self.container = opt.container;
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
    var svg = d3.select(self.container + " svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-2000 * self.size))
        .force("center", d3.forceCenter(width / 2, height / 2));


    self.node = svg.append("g")
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
        .on("mouseenter", function(){
          $(self.container + " img#hintImg").hide();
        })

    self.node.append("title")
        .text(function(d) { return d.title; });
    self.node.append("text")
        .text(function(d) { return d.title; });

        //test.js todo
    self.link = svg.append("g")
        .attr("class","links")
        .selectAll("line")
        .data(opt.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", function(d){
          // debugger
          // return "M" + d.y + "," + d.x
          //     + "C" + (d.parent.y + 100) + "," + d.x
          //     + " " + (d.parent.y + 100) + "," + d.parent.x
          //     + " " + d.parent.y + "," + d.parent.x
              // + " " + (d.parent.y + 100) + "," + d.parent.x
              // + "C" + (d.parent.y + 100) + "," + d.x
              // + "M" + d.y + "," + d.x
        })
        // .attr("stroke-width", function(l) { return l.width; })
        // .attr("style", function(l) { return "stroke: #" + (l.color || "999"); })
        .on("mouseenter", function(l){
          $(self.container + " img#hintImg")
          .attr("style", "display: block; top: " + (d3.event.clientY) + "px; left: " + (d3.event.clientX) + "px;" )
          .attr("data-id", l.id);
        });

    simulation
        .nodes(opt.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(opt.links);

    // simulation.force("gravity", 0.05);
    function ticked() {
      self.link
          .attr("x1", function(d) { return d.source.x*1; })
          .attr("y1", function(d) { return d.source.y*1; })
          .attr("x2", function(d) { return d.target.x*1; })
          .attr("y2", function(d) { return d.target.y*1; });

      self.node
          .attr("x", function(d) { return d.x*1 - d.size*self.baseSize/2; })
          .attr("y", function(d) { return d.y*1 - d.size*self.baseSize/2; });
    }

  }
  function getSize(d){
    var size = (d.size || 1) * self.baseSize;
    return size + "px";
  }
  return self;
})({}, opt)

$(function(){
  d3_develop.init();
});
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

        //test.js todo
    self.link = svg.append("g")
        .attr("class","links")
        .selectAll("path")
        .data(opt.links)
        .enter()
        .append("path")
        .attr("class", "link")

        .attr("stroke-width", function(l) { return l.width; })
        .attr("style", function(l) { return "stroke: #" + (l.color || "999"); })
        .on("mouseenter", function(l){
          $(self.container + " img#hintImg")
          .attr("style", "display: block; top: " + (d3.event.clientY) + "px; left: " + (d3.event.clientX) + "px;" )
          .attr("data-id", l.id);
        });

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


    simulation
        .nodes(opt.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(opt.links);


    function ticked() {
      self.node
          .attr("x", function(d) {
            // console.log(d.id + ": " +d.x);
            // console.log(d.id + ": " +(d.x*1 - d.size*self.baseSize/2));
            return d.x*1 - d.size*self.baseSize/2;
          })
          .attr("y", function(d) {
            return d.y*1 - d.size*self.baseSize/2;
          });

      self.link
          .attr("x1", function(d) {
            // console.log(d.source.id + ": " +d.source.x);
            return d.source.x*1;
          })
          .attr("y1", function(d) { return d.source.y*1; })
          .attr("x2", function(d) { return d.target.x*1; })
          .attr("y2", function(d) { return d.target.y*1; })
          .attr("d", function(d){
            // debugger
            return "M100 100 A300,30 0 0,1 100,150 "
            // return "M" + d.target.y + "," + d.target.x
            //     + "Q" + d.source.y + "," + d.source.x
            //     + " " + ((d.source.x + d.target.x)/2) + "," + ((d.source.y+d.target.y)/2)
            // return "M" + d.target.y + "," + d.target.x
            //     + "C" + d.source.y + "," + d.source.x
            //     + " " + d.source.y + "," + d.target.x
            //     + " " + d.target.y + "," + d.target.x
            // return "M" + d.source.y + "," + d.source.x
            //     + "C" + (d.target.y + 100) + "," + d.source.x
            //     + " " + (d.target.y + 100) + "," + d.target.x
            //     + " " + d.target.y + "," + d.target.x

            // return "M" + (d.source.y+d.source.vy) + "," + (d.source.x+d.source.vx)
            //     + "C" + (d.target.y+d.target.vy + 100) + "," + (d.source.x+d.source.vx)
            //     + " " + (d.target.y+d.target.vy + 100) + "," + (d.target.x+d.target.vx)
            //     + " " + (d.target.y+d.target.vy) + "," + (d.target.x+d.target.vx)
          }).attr("lid", function(l){
            return l.id + ": " + l.source.id + ", " + l.target.id
          });
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
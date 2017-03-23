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
        .force("charge", d3.forceManyBody().strength(-4000 * self.size))
        .force("center", d3.forceCenter(width / 2, height / 2));

    self.link = svg.append("g")
        .attr("class","links")
        .selectAll("path")
        .data(opt.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("style", function(l) { var color = !!l.color ? "stroke: #" + (l.color || "999") + "; " : ""; return color + "stroke-width:" + l.width + "px"; })
        .on("mouseenter", function(l){
          // $(self.container + " img#hintImg")
          // .attr("style", "display: block; top: " + (d3.event.clientY) + "px; left: " + (d3.event.clientX) + "px;" )
          // .attr("data-id", l.id);
        })
        .on("click", function(l){
          setOpt(getOpt());
        })

    self.link.append("title")
        .text(function(l){ return l.id; });

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
            return d.x*1 - d.size*self.baseSize/2;
          })
          .attr("y", function(d) {
            return d.y*1 - d.size*self.baseSize/2;
          });

      self.link
          .attr("x1", function(d) {
            return d.source.x*1;
          })
          .attr("y1", function(d) { return d.source.y*1; })
          .attr("x2", function(d) { return d.target.x*1; })
          .attr("y2", function(d) { return d.target.y*1; })
          .attr("d", function(d){
            return getPath(d);
          }).attr("lid", function(l){
            return l.id + ": " + l.source.id + ", " + l.target.id
          });
    }

  }
  function getSize(d){
    var size = (d.size || 1) * self.baseSize;
    return size + "px";
  }
  function getOffsetXY(linkNum){
    // var redu = linkNum % 2 ? 1 : -1
    return 13 * linkNum// * redu;
  }
  function getOffset(linkNum){
    var redu = linkNum % 2 ? 1 : -1
    return 13 * linkNum * redu;
  }
  function getX(linkNum){
    return linkNum % 2 ? 1 : 0
  }
  function getPath(d){
    var tx =  d.target.x// - d.target.size*self.baseSize/2
    var ty =  d.target.y// - d.target.size*self.baseSize/2
    var sx =  d.source.x// - d.source.size*self.baseSize/2
    var sy =  d.source.y// - d.source.size*self.baseSize/2
    var resStr = "", num = d.linkNum;
    if(num == 1){
      resStr = "M" + tx + "," + ty
        + "L" + sx + "," + sy
    }else{
      resStr = "M" + sx + " "+ sy +" A"+getOffsetXY(d.linkNum||1)+","+getOffsetXY(d.linkNum||1)+" 0 0,"+getX(d.linkNum||1)+" " +tx+"," +ty;
    }

    // if(num != 1 ){
    //   resStr =  "M" + tx + "," + ty
    //     + "C" + (tx + getOffset(d.linkNum||1)) + "," + sy
    //     + " " + (sx + getOffset(d.linkNum||1)) + "," + sy
    //     + " " + sx + "," + sy
    // }else{
    //   resStr = "M" + tx + "," + ty
    //     + "L" + sx + "," + sy
    // }
    return resStr;
  }
  return self;
})({}, opt)

$(function(){
  d3_develop.init();
});
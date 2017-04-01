var d3_develop = (function(self, opt){
  self.size = 1;
  self.baseSize = opt.baseSize || 80;
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
    setImg();
    var svg = d3.select(self.container + " svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    // var attractForce = d3.forceManyBody().strength(200).distanceMax(400*1).distanceMin(60*1);
    // var repelForce = d3.forceManyBody().strength(-140).distanceMax(50*1).distanceMin(10*1);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-2000 * self.size).distanceMin(100).distanceMax(500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        // .force("attractForce",attractForce).force("repelForce",repelForce);;

    // opt.nodes.forEach(function(o){
    //   o.x = width / 2;
    //   o.y = height / 2;
    //   return o;
    // });

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
        .on("mouseenter", function(l){
          var top = $(self.container).parent().scrollTop();//document.querySelector(self.container).scrollHeight;
          $(self.container + " img#hintImg")
          .attr("style", "display: block; top: " + (d3.event.clientY + top) + "px; left: " + (d3.event.clientX) + "px;" )
          .attr("data-id", l.id);
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
        .attr("xlink:href", function(d){ return d.img; })

        .attr("width", function(d){ return getSize(d) })
        .attr("height", function(d){ return getSize(d) })
        .on("click", function(d, i, doms){

        })
        .on("mouseenter", function(){
          $(self.container + " img#hintImg").hide();
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
    function setImg(){
      var img = new Image()
      img.src = "src/img/hintimg.png";
      img.id="hintImg";
      $(self.container).append(img);
      $(img).on("click", function(){
        //window.location.href = "test.html";
        var id = $(this).attr("data-id");
        console.log();
        window.location.href = "topology-force.html?id=" + id;
      });
    }
  }

  return self;
})({}, opt)

$(function(){
  d3_develop.init();
});
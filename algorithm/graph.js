function drawGraph(dataset){
  dataset.edges = dataset.edges.map(e => {return {source: dataset.nodes.indexOf(e.source), target: dataset.nodes.indexOf(e.target), value: e.value}});
  dataset.nodes = dataset.nodes.map(e => {return {name: e}});

  var w = 800;
  var h = 600;
  var linkDistance=200;

  var colors = d3.scale.category10();

  $('.graph').empty();
  var svg = d3.select(".graph").append("svg").attr({"width":w,"height":h});

  var force = d3.layout.force()
      .nodes(dataset.nodes)
      .links(dataset.edges)
      .size([w,h])
      .linkDistance([linkDistance])
      .charge([-500])
      .theta(0.1)
      .gravity(0.05)
      .start();

  var edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .attr("id",function(d,i) {return d.source.name+d.target.name})
    .style("stroke","#000") //COLOR EDGE
    .style("pointer-events", "none");

  var nodes = svg.selectAll("circle")
    .data(dataset.nodes)
    .enter()
    .append("circle")
    .attr({"r":20})
    // .style("fill",function(d,i){return colors(i);})
    .style("fill", 'rgb(31, 119, 180)')
    .attr("id",function(d,i) {return d.name})
    .style("stroke", '#000')
    .style("cursor", 'pointer')
    .call(force.drag)
    .on('dblclick', function(d) { process(false, d.name);} )
    .on('mouseover', function(d) { load_edge(d.name);} )
    .on('mouseout', function(d) { load_edge();} )


  var nodelabels = svg.selectAll(".nodelabel")
     .data(dataset.nodes)
     .enter()
     .append("text")
     .attr({"x":function(d){return (d.x-5);},
            "y":function(d){return (d.y+5);},
            "class":"nodelabel",
            "stroke":"#fff"})
    .style("cursor", 'pointer')
    .style("font-size", '20px')
    .on('dblclick', function(d) { process(false, d.name);} )
    .on('mouseover', function(d) { load_edge(d.name);} )
    .on('mouseout', function(d) { load_edge();} )
     .text(function(d){return d.name;});

  var edgepaths = svg.selectAll(".edgepath")
      .data(dataset.edges)
      .enter()
      .append('path')
      .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
             'class':'edgepath',
             'fill-opacity':0,
             'stroke-opacity':0,
             'fill':'blue',
             'stroke':'red',
             'id':function(d,i) {return 'edgepath'+i}})
      .style("pointer-events", "none");

  var edgelabels = svg.selectAll(".edgelabel")
      .data(dataset.edges)
      .enter()
      .append('text')
      .style("pointer-events", "none")
      .attr({'class':'edgelabel',
             'id':function(d,i){return 'edgelabel'+i},
             'dx':80,
             'dy':-5,
             'font-size':20,
             'font-weight':'bold',
             'fill':'#000'}); //COLOR EDGE LABEL

  edgelabels.append('textPath')
      .attr('xlink:href',function(d,i) {return '#edgepath'+i})
      .style("pointer-events", "none")
      .text(function(d,i){return d.value}); //lable name


  svg.append('defs').append('marker')
      .attr({'id':'arrowhead', //'arrowhead'
             'viewBox':'-0 -5 10 10',
             'refX':25,
             'refY':0,
             //'markerUnits':'strokeWidth',
             'orient':'auto',
             'markerWidth':10,
             'markerHeight':10,
             'xoverflow':'visible'})
      .append('svg:path')
          .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
          .attr('fill', '#ccc')
          .attr('stroke','#ccc');


  force.on("tick", function(){

      edges.attr({"x1": function(d){return d.source.x;},
                  "y1": function(d){return d.source.y;},
                  "x2": function(d){return d.target.x;},
                  "y2": function(d){return d.target.y;}
      });

      nodes.attr({"cx":function(d){return d.x;},
                  "cy":function(d){return d.y;}
      });

      nodelabels.attr("x", function(d) { return d.x-5; })
                .attr("y", function(d) { return d.y+5; });

      edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                         //console.log(d)
                                         return path});

      edgelabels.attr('transform',function(d,i){
          if (d.target.x<d.source.x){
              bbox = this.getBBox();
              rx = bbox.x+bbox.width/2;
              ry = bbox.y+bbox.height/2;
              return 'rotate(180 '+rx+' '+ry+')';
              }
          else {
              return 'rotate(0)';
              }
      });
  });
}

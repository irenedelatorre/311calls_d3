d3.allTypeBar = function(){

var _dis = d3.dispatch('changetime','changetype');

  var w = 800,
    h = 600,
    m ={t:50,r:25,b:50,l:25},
    layout = d3.layout.histogram(),
    chartW = w - m.l - m.r,
    chartH = h - m.t - m.b,
    scaleX = d3.time.scale(),
    scaleY = d3.scale.linear(),
    color = "#ababab",
    timeRange = [new Date(), new Date()], //default timeRange
    interval = d3.time.day,
    valueAccessor = function(d){ return d;},
    distanceAxisY = 25,// distance margin-text,
    maxY = 12000;// ;

    brush = d3.svg.brush();
  
  function exports(_selection){
    //recompute internal variables if updated

     chartW = w - m.l - m.r,
     chartH = h - m.t - m.b,
     scaleX = d3.time.scale().range([0, chartW-distanceAxisY]).domain(timeRange),
     scaleY = d3.scale.linear().range([chartH,0]),
     axisFlag = true; // by default draw axis
     brush.x(scaleX);

        var bins = interval.range(timeRange[0],timeRange[1]);
        bins.unshift(timeRange[0]);
        bins.push(timeRange[1]);

        layout
            .range(timeRange)
            .bins(bins)
            .value(valueAccessor);

    _selection.each(draw);
  }

  function draw(d){

    var data = layout(d);
      //var maxY = d3.max(data,function(d){return d.y});
     scaleY = scaleY.domain([0,maxY]);
    //var bisect = d3.bisector(function(d){return d.x}).left;
      var dateFormat = d3.time.format('%b');

      //AXIS
      var axisX = d3.svg.axis().orient('bottom').scale(scaleX).ticks(d3.time.month).tickFormat(dateFormat),
          axisY = d3.svg.axis().orient('left').scale(scaleY).ticks(5);

      //append and update DOM
    //Step 1: does <svg> element exist? If it does, update width and height; if it doesn't, create <svg>
    var svg = d3.select(this).selectAll('svg').data([d]);

    var svgEnter = svg.enter().append('svg').attr('width',w).attr('height',h);
        svgEnter.append('g').attr('transform','translate('+(distanceAxisY+m.l)+','+ m.t+')').attr('class','axis axis-y');
        svgEnter.append('g').attr('transform','translate('+(distanceAxisY+m.l)+','+ (m.t+chartH)+')').attr('class','axis axis-x');
        svgEnter.append('g').attr('class','bars').attr('transform','translate('+(distanceAxisY+m.l)+','+m.t+')');
        svgEnter.append('g').attr('class','x brush').attr('transform','translate('+(distanceAxisY+m.l)+','+m.t+')');



      //axis
      if (axisFlag == true){
          svg.select(".axis-x").call(axisX);
          svg.select(".axis-y").call(axisY)
      }else{
          svg.select(".axis-x").empty();
          svg.select(".axis-y").empty();
      };


   //bars chart
    var bars = svg.select('.bars')
      .selectAll('.bar')
      .data(data);

   bars  
      .enter()
      .append('rect')
      .attr('class','bar');
   bars.exit().remove();

   bars
       .transition()
       .duration(1000)
       .attr('x',function(d){return scaleX(d.x)})
          .attr('y',function(d){return scaleY(d.y)})
          .attr('width',function(d){
            var time = d.x.getTime() + d.dx;
            return (scaleX(time) - scaleX(d.x))/2;

          })
          .attr('height',function(d){
           return chartH - scaleY(d.y)
       })
          .style('fill',color);

      brush
          .on('brush',brushed)
          .on('brushend',brushend);

      //brush work
      svg.select('.brush')
          .call(brush)
          .selectAll('rect')
          .attr('height',chartH);

      function brushed(){
          bars.attr('class','bar')
              .filter(function(d){
                  return d.x >= brush.extent()[0] && d.x <= brush.extent()[1];
              })
              .attr('class','bar highlight');
      }

      function brushend(){
          _dis.changetime(brush.extent());
      }
         

  }

  //Getter and setter
  exports.width = function(_v){
    if(!arguments.length) return w;
    w = _v;
    return this;
  };
  exports.height = function(_v){
    if(!arguments.length) return h;
    h = _v;
    return this;
  };
  exports.timeRange = function(_r){
    if(!arguments.length) return timeRange;
    timeRange = _r;
    return this;
  };
  exports.value = function(_v){
    if(!arguments.length) return layout.value();
    valueAccessor = _v;
    layout.value(_v);
    return this;
  };
  exports.interval = function(_b){
        //@param _b: d3.time.interval
        if(!arguments.length) return interval;
        interval = _b;
        return this;
    };
    exports.applyAxis = function(_a){
        //type _a --> boolean
        if(!arguments.length) return axisFlag;
        axisFlag = _a;
        return this;
    };
    exports.distance = function(_distanceAxisY){
        if(!arguments.length) return distanceAxisY;
        distanceAxisY = _distanceAxisY;
        return this;
    };
    exports.maxScaleY = function(_maxY){
        if(!arguments.length) return maxY;
        maxY = _maxY;
        return this;
    };
    exports.fillColor = function(_color){
        if(!arguments.length) return color;
        color = _color;
        return this;
    };
    d3.rebind(exports, _dis, 'on');

  return exports;
}
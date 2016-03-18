d3.durationSeries = function (){

    var _dis = d3.dispatch('changetype');

    //internal variables, these variables need some defualt variables which can be rewritten later
    var w =800,
        h =600,
        m ={t:50,r:25,b:50,l:25},
        chartW = w - m.l- m.r,
        chartH = h - m.t -m.b,
        distanceAxisY = 170, // distance margin-text
        valueAccessor = function(d){return d},
        neighborhoodsNames = [],
        daysRange = [0,400];
        axisFlag = true; // by default draw axis
        scaleX = d3.scale.linear().domain(daysRange).range([0, w-distanceAxisY]),
        scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([0,h]);


function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;
        daysRange = [0,400];

        scaleX = d3.scale.linear().domain(daysRange).range([0, chartW-distanceAxisY]);
        scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([0,chartH]);

    _selection.each(draw);
    }

    function draw (data){
        //AXIS
        var axisX = d3.svg.axis()
            .scale(scaleX)
            .ticks(10)
            .orient("top");

        var axisY = d3.svg.axis()
            .orient('left')
            .tickSize(-w)
            .scale(scaleY);

        //Step 1: does <svg> element exist? If it does, update width and height; if it doesn't, create <svg>
        var svg = d3.select(this).selectAll("svg").data([data]); // this = the div selected in script.js

        var svgEnter = svg.enter()
            .append('svg')
            .attr('width',w).attr('height',h);


        //2.1 axis
        svgEnter.append('g')
            .attr('class','axis axis-x')
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");

        svgEnter.append('g')
            .attr('class','axis axis-y')
            .attr("transform","translate("+(distanceAxisY-5+m.l)+","+ m.t+")");

        //axis
        if (axisFlag == true){
            svg.select(".axis-x").call(axisX);
            svg.select(".axis-y").call(axisY)
        }else{
            svg.select(".axis-x").empty();
            svg.select(".axis-y").empty();
        };


        //2.2 interval
        var interval = svg
            .append("g")
            .attr("class", "interval")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")")
            .selectAll(".dotsRange")
            .data(data);

        interval
            .enter()
            .append("line")
            .attr("class","dotsRange");

        interval.exit().remove();

        interval.transition()
            .attr("x1",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(minDuration)
            })
            .attr("x2",function(d,i){
                maxDuration = d3.max(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(maxDuration)
            })
            .attr("y1",function(d){
                return scaleY(d.key)})
            .attr("y2",function(d){
                return scaleY(d.key)});


        //2.3 MAX
        var svgDots = svg
            .append("g")
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");

        var dots1 = svgDots
            .attr("class", "dots1")
            .selectAll(".dotsMax")
            .data(data);

        dots1
            .enter()
            .append("circle")
            .attr("class","dotsMax");

        dots1.exit().remove();

        dots1.transition()
            .attr("cx",function(d,i){
                maxDuration = d3.max(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(maxDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        //2.4 MIN
        var dots2 = svgDots
            .attr("class", "dots2")
            .selectAll(".dotsMin")
            .data(data);

        dots2
            .enter()
            .append("circle")
            .attr("class","dotsMin");

        dots2.exit().remove();

        dots2.transition()
            .attr("cx",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(minDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        //2.5 mean
        dots3 = svgDots
            .attr("class", "dots3")
            .selectAll(".dotsMean")
            .data(data);

        dots3
            .enter()
            .append("circle")
            .attr("class","dotsMean");

        dots3.exit().remove();

        dots3.transition()
            .attr("cx",function(d,i){
                meanDuration = d3.mean(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(meanDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

        //2.6 median
        dots4 = svgDots
            .attr("class", "dots4")
            .selectAll(".dotsMedian")
            .data(data);

        dots4
            .enter()
            .append("circle")
            .attr("class","dotsMedian");

        dots4.exit().remove();

        dots4.transition()
            .attr("cx",function(d,i){
                medianDuration = d3.median(d.values,function(neighborhood){if (neighborhood.duration>0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(medianDuration)
            })
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5);

    }

    exports.width = function(_x){
        if(!arguments.length) return w;

        w = _x;
        return this;
    };

    exports.height = function(_h){
        if(!arguments.length) return h;
        h = _h;
        return this;
    };

    exports.distance = function(_distanceAxisY){
        if(!arguments.length) return distanceAxisY;
        distanceAxisY = _distanceAxisY;
        return this;
    };
    exports.daysDuration = function(_daysRange){
        if(!arguments.length) return daysRange;
        daysRange = _daysRange;
        return this;
    };
    exports.names = function(_neighborhoodsNames){
        if(!arguments.length) return neighborhoodsNames;
        neighborhoodsNames = _neighborhoodsNames;
        return this;
    };
    exports.applyAxis = function(_a){
        //type _a --> boolean
        if(!arguments.length) return axisFlag;
        axisFlag = _a;
        return this;
    }

    d3.rebind(exports,_dis,"on");
    return exports
};

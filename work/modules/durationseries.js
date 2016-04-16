d3.durationSeries = function (){

    var _dis = d3.dispatch('changetype');

    //internal variables, these variables need some defualt variables which can be rewritten later
    var w =800,
        h =600,
        m ={t:50,r:25,b:50,l:25},
        chartW = w - m.l- m.r,
        chartH = h - m.t -m.b,
        distanceAxisY = 200, // distance margin-text
        valueAccessor = function(d){return d},
        neighborhoodsNames = ["East Boston", "Hyde Park", "Roslindale", "Dorchester", "Greater Mattapan", "Beacon Hill", "Roxbury", "Allston / Brighton", "South End", "West Roxbury", "Mission Hill", "Fenway / Kenmore / Audubon Circle / Longwood", "Charlestown", "Downtown / Financial District", "Jamaica Plain", "South Boston / South Boston Waterfront", "Boston", "Back Bay", "Unknown", "Brighton", "Chestnut Hill"],
        daysRange = [0,600];
        axisFlag = true; // by default draw axis
        scaleX = d3.scale.linear().domain(daysRange).range([0, w-distanceAxisY]),
        scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([0,h]);


function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;
        daysRange = [0,450];

        scaleX = d3.scale.linear().domain(daysRange).range([0, chartW-distanceAxisY]);
        scaleY = d3.scale.ordinal().domain(neighborhoodsNames).rangePoints([0,chartH]);

    _selection.each(draw);
    }

    function draw (data){

        //console.log(data);
        data.forEach(function(d,i){
            var mean = d3.mean(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                return neighborhood.duration}else{return 0}
            });
            var median = d3.median(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                return neighborhood.duration}else{return 0}
            });
            var max = d3.max(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                return neighborhood.duration}else{return 0}
            });
            var min = d3.min(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                return neighborhood.duration}else{return 0}
            });

            console.log(d.key + " mean:" + mean + ", median:" + median + ", max" + max + ", min" +min );
        });


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
        var svg = d3.select(this).selectAll("svg").data([data]);

        var svgEnter = svg.enter()
                .append('svg')
                .attr('width',w).attr('height',h);

        //2.1 axis

        //space between names and dots
        var mySpace = 20;

        svgEnter.append('g')
            .attr('class','axis axis-x')
            .attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")");

        svgEnter.append('g')
            .attr('class','axis axis-y')
            .attr("transform","translate("+(distanceAxisY-mySpace+m.l)+","+ m.t+")");

        //axis
        if (axisFlag == true){
            svg.select(".axis-x").call(axisX);
            svg.select(".axis-y").call(axisY)
        }else{
            svg.select(".axis-x").empty();
            svg.select(".axis-y").empty();
        };


        svgEnter.append('g').attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")").attr('class','interval');
        svgEnter.append('g').attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")").attr('class','median');
        svgEnter.append('g').attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")").attr('class','mean');
        svgEnter.append('g').attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")").attr('class','min');
        svgEnter.append('g').attr("transform","translate("+(distanceAxisY+m.l)+","+ m.t+")").attr('class','max');


        //2.2 interval
        var interval = svg.select(".interval")
            .selectAll(".dotsRange")
            .data(data);

        interval.enter()
            .append("line")
            .attr("class","dotsRange")
            .attr("y1",function(d){
                return scaleY(d.key)})
            .attr("y2",function(d){
                return scaleY(d.key)});

        interval.exit().remove();

        interval
            .attr("y1",function(d){
                return scaleY(d.key)})
            .attr("y2",function(d){
                return scaleY(d.key)})
            .transition()
            .duration(2000)
            .attr("x1",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(minDuration)
            })
            .attr("x2",function(d,i){
                maxDuration = d3.max(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}

                });

                return scaleX(maxDuration)
            });

        //2.5 mean
        var dots3 = svg.select(".mean")
            .selectAll(".dotsMean")
            .data(data);

        dots3
            .enter()
            .append("circle")
            .attr("class","dotsMean")
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5)
            .attr("cx",function(d,i){
                meanDuration = d3.mean(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(meanDuration)
            });

        dots3.exit().remove();

        dots3
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .transition()
            .duration(1000)
            .attr("class","dotsMean")
            .attr("cx",function(d,i){
                meanDuration = d3.mean(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(meanDuration)
            });

        //2.6 median
        var dots4 = svg.select(".median")
            .selectAll(".dotsMedian")
            .data(data);

        dots4
            .enter()
            .append("circle")
            .attr("class","dotsMedian")
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5)
            .attr("cx",function(d,i){
                medianDuration = d3.median(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(medianDuration)
            });

        dots4.exit().remove();

        dots4
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .transition()
            .duration(1000)
            .attr("class","dotsMedian")
            .attr("cx",function(d,i){
                medianDuration = d3.median(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(medianDuration)
            });

        //2.4 MIN
        var dots2 = svg.select(".min")
            .selectAll(".dotsMin")
            .data(data);

        dots2.enter()
            .append("circle")
            .attr("class","dotsMin")
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .attr("r",5)
            .attr("cx",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(minDuration)
            });

        dots2.exit().remove();

        dots2
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .transition()
            .duration(1000)
            .attr("class","dotsMin")
            .attr("cx",function(d,i){
                minDuration = d3.min(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{return 0}
                });
                return scaleX(minDuration)
            });

        //2.3 MAX

        var dots1 = svg.select(".max")
            .selectAll(".dotsMax")
            .data(data);

        dots1
            .enter()
            .append("circle")
            .attr("class","dotsMax")
            .attr("r",5);

        dots1.exit().remove();

        dots1
            .attr("cy",function(d,i){
                return scaleY(d.key)
            })
            .transition()
            .duration(1000)
            .attr("class","dotsMax")
            .attr("cx",function(d,i){
                maxDuration = d3.max(d.values,function(neighborhood){if (neighborhood.duration>=0) {
                    return neighborhood.duration}else{}
                });
                return scaleX(maxDuration)

            })




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

var margin = {t:50,r:100,b:50,l:50};

var wMap1 = d3.select('#plot_map2').node().clientWidth,
    hMap1 = d3.select('#plot_map2').node().clientHeight;

var wMap2 = d3.select('#plot_map3').node().clientWidth,
    hMap2 = d3.select('#plot_map3').node().clientHeight;

var
    w1 = d3.select('.plot1').node().clientWidth,
    h1 = d3.select('.plot1').node().clientHeight;
 var
    w2 = d3.select('.plot2').node().clientWidth,
    h2 = d3.select('.plot2').node().clientHeight;


//load data
var queue = d3_queue.queue()
    //.defer(d3.json, "../data/Zoning_Subdistricts.geojson")
    .defer(d3.json, "../data/bos_neighborhoods.geojson")
    .defer(d3.csv,'../data/311__Service_Requests.csv',parse)
    .defer(d3.csv,'../data/metadata_reduced.csv',parseType)
    .await(dataloaded);

globalDispatch = d3.dispatch('changetype','pickTime', 'changetime','changetypedots');

var neighborhood_name = [];

//draw
function dataloaded(err,neighborhood,rows,types) {
    //console.log(rows)

    d3.select(".type-list").on("change", function () {
        globalDispatch.changetype(this.value);
    });

    // get the duration of each case
    rows.forEach(function (d) {
        if (+d.endTime != NaN) {
            d.duration = Math.abs(d.startTime - d.endTime) / (1000 * 60 * 60 * 24); //in days
        } else {
            //endTime = Nan are for cases that are not closed... endDate is converted to the day when we downloaded the dataset
            d.endTime = new Date ('March 23, 2016 23:59:59');
            d.duration = Math.abs(d.startTime - d.endTime) / (1000 * 60 * 60 * 24); //in days
        }

    });

    //durations study
    var mean = d3.mean(rows,function(d){if (d.duration>=0) {
        return d.duration}else{return 0}
    });
    var median = d3.median(rows,function(d){if (d.duration>=0) {
        return d.duration}else{return 0}
    });
    var max = d3.max(rows,function(d){if (d.duration>=0) {
        return d.duration}else{return 0}
    });
    var min = d3.min(rows,function(d){if (d.duration>=0) {
        return d.duration}else{return 0}
    });

    console.log("all, max:"+ max + ", min" + min + ", mean"+ mean +" median" + median)

    var data = rows;
    var calls = crossfilter(data);
    var callsByType = calls.dimension(function (d) {
        return d.type
    });
    var callsByTime = calls.dimension(function(d){return d.startTime});

    callsType = callsByType.filterAll().top(Infinity);
    //callsType.sort(function (a, b) {
    //    return a.neighbor - b.neighbor;
    //});
    //nest by type and then by neighborhood
    var nestedNeighborhood = d3.nest()
        .key(function (d) {
            return name = d.neighbor
        })
        .sortKeys(d3.ascending)
        .entries(callsType);

    var neighborhoodsNames = nestedNeighborhood.map(function (d) {return d.key});

    //barchart
    var barchart = d3.allTypeBar()
        .width(wMap2)
        .height(hMap2)
        .fillColor("rgba(165,190,196,.5)")
        .timeRange([new Date(2015,0,1),new Date(2016,0,1)])
        .value(function(d){ return d.startTime;})
        .interval(d3.time.week)
        .on('changetime',function(xy){
            //console.log(xy);
            var callsTime = callsByTime.filter([xy[0],xy[1]]).top(Infinity);

            /*   d3.select(".start-date").html(xy[0]);
             d3.select(".end-date").html(xy[1]);*/

            globalDispatch.changetypedots(callsTime); //this is t in the module
            //console.log(callsTime);
            /*   d3.select(".start-date").html(xy[0]); //add text to html element
             d3.select(".end-date").html(xy[1]);
             globalDispatch.changetypedots(xy);*/

        });

    var barPlot = d3.select('.container').select('.mappingBoston').select('#plot_map3')
        .datum(callsType)
        .call(barchart);

    //dots in map
    var color1 = "#376E7C"; //in one hour
    var color2 = "#A5BEC4"; // from one hour to 1 day
    var color3 = "#EAE3D7"; // from 1 day to the average
    var color4 = "#F3919A"; // from the average to one month
    var color5 = "#EF4553"; // from one month to one year
    var color6 = "#BC000E"; // more than one year

    var legendMap1h = d3.select("#min").append('svg')
        //.attr('width', (wMap1/6))
        .append("g")
        .attr("class", "legend");

    legendMap1h
        .append('circle')
        .attr('class', 'legendElement')
        .attr('cx',5)
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill',color1);

    legendMap1h.append("text")
        .attr('class', 'legendElement')
        .text("In one hour")
        .attr("x", 15)
        .attr('y', 10);

    var legendMap1d = d3.select("#mean").append('svg')
        //.attr('width', (wMap1/6))
        .append("g")
        .attr("class", "legend");

    legendMap1d
        .append('circle')
        .attr('class', 'legendElement')
        .attr('cx',5)
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill',color2);

    legendMap1d.append("text")
        .attr('class', 'legendElement')
        .text("From 1 to 24 hours")
        .attr("x", 15)
        .attr('y', 10);

    var legendMap12d = d3.select("#average").append('svg')
        //.attr('width', (wMap1/6))
        .append("g")
        .attr("class", "legend");

    legendMap12d
        .append('circle')
        .attr('class', 'legendElement')
        .attr('cx',5)
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill',color3);

    legendMap12d.append("text")
        .attr('class', 'legendElement')
        .text("From 1 to 12 days")
        .attr("x", 15)
        .attr('y', 10);

    var legendMap30d = d3.select("#month").append('svg')
        //.attr('width', (wMap1/6))
        .append("g")
        .attr("class", "legend");

    legendMap30d
        .append('circle')
        .attr('class', 'legendElement')
        .attr('cx',5)
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill',color4);

    legendMap30d.append("text")
        .attr('class', 'legendElement')
        .text("From 12 to 30 days")
        .attr("x", 15)
        .attr('y', 10);

    var legendMap1y = d3.select("#year").append('svg')
        //.attr('width', (wMap1/6))
        .append("g")
        .attr("class", "legend");

    legendMap1y
        .append('circle')
        .attr('class', 'legendElement')
        .attr('cx',5)
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill',color5);

    legendMap1y.append("text")
        .attr('class', 'legendElement')
        .text("From 30 to 89 days")
        .attr("x", 15)
        .attr('y', 10);

    var legendMap366 = d3.select("#mtyear").append('svg')
        //.attr('width', (wMap1/6))
        .append("g")
        .attr("class", "legend");

    legendMap366
        .append('circle')
        .attr('class', 'legendElement')
        .attr('cx',5)
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill',color6);

    legendMap366.append("text")
        .attr('class', 'legendElement')
        .text("In more than 90 days")
        .attr("x", 15)
        .attr('y', 10);


    
    
    var mapModuleDots = d3.mapDotsSeries(neighborhood)
        .width(wMap1)
        .height(hMap1)
        .scale(220000);

    d3.select(".container").select(".mappingBoston").select('#plot_map2').append('canvas')
    
    var plot_mapDots = d3.select(".container").select(".mappingBoston").select('#plot_map2')
        .datum(callsType)
        .call(mapModuleDots);

    mapModuleDots.shape(callsByTime.filterAll().top(Infinity));

    globalDispatch.on('changetypedots',function(t){
        mapModuleDots.shape(t);
    });

    //dots
    //legend
    // draw legend
    legendData = [{color: "#BC000E", dotType: "Maximum duration"}, {color: "#F3919A", dotType: "Median duration"}, {color: "#A5BEC4", dotType: "Mean duration"}, {color: "#376E7C", dotType: "Minimum duration"}];

    var legend = d3.select(".container").select('#legend1').append('svg')
        .attr('width', w1)
        .append("g")
        .attr("class", "legend")
        .selectAll('.legendElement').data(legendData).enter();

    legend
        .append('circle').attr('class', 'legendElement')
        .attr('cx', function (d, i) {
            return i * 200 + 5;
        })
        .attr('cy', 6)
        .attr('r', 5)
        .style('fill', function (d) {
            return d.color;
        });


    legend.append("text")
        .attr('class', 'legendElement')
        .text(function (d) {
            return d.dotType
        })
        .attr("x", function (d, i) {
            return 15 + (i * 200)
        })
        .attr('y', 10);

    var durationModule = d3.durationSeries()
        .width(w1)
        .height(h1)
        .distance(w1/3)
        .daysDuration([0, 450])
        .names(neighborhoodsNames);

    var plot1 = d3.select(".container").select('.plot1')
        .datum(nestedNeighborhood)
        .call(durationModule);

    //small multiples
    var plots2 = d3.select('.container').select(".neighborhoods").selectAll('.plot2')
        .data(nestedNeighborhood);

    plots2
        .enter()
        .append('div')
        .attr('class', 'plot2');

    plots2
        .each(function (d, i) {
            var timeSeries = d3.timeSeries()
                .width(w1/5)
                .height(150)
                .timeRange([new Date(2015, 0, 1), new Date(2016, 0, 1)])
                .value(function (d) {
                    return d.startTime;
                })
                .maxY(1500)
                .binSize(d3.time.week)
                .on('hover', function (t) {
                    globalDispatch.pickTime(t);
                });

            globalDispatch.on('pickTime.' + i, function (t) {
                timeSeries.showValue(t);
            });

            d3.select(this).datum(d.values)
                .call(timeSeries)
                .append('p')
                .attr("class","neighborhood-names")
                .text(d.key);

        });

    //Dispatch function
    globalDispatch.on("changetype", function (type) {
        var neighborhoodsNames = ["Allston / Brighton", "Back Bay", "Beacon Hill", "Boston", "Brighton", "Charlestown", "Chestnut Hill", "Dorchester", "Downtown / Financial District", "East Boston", "Fenway / Kenmore / Audubon Circle / Longwood", "Greater Mattapan", "Hyde Park", "Jamaica Plain", "Mission Hill", "Roslindale", "Roxbury", "South Boston / South Boston Waterfront", "South End", "Unknown", "West Roxbury"]

        callsByType.filterAll();
        if (type == "All") {
            console.log("all");
            callsType = callsByType.filterAll().top(Infinity);


        } else {
            callsType = callsByType.filter(type).top(Infinity);

        };

        var nestedNeighborhoodInDispatch = d3.nest()
            .key(function (d) {
                return name = d.neighbor
            })
            .sortKeys(d3.ascending)
            .entries(callsType);
        
        durationModule
            .names(neighborhoodsNames);

        plot1.datum(nestedNeighborhoodInDispatch)
            .call(durationModule);

        if (type == "Request for Snow Plowing" || type == "All" || type == "Missed Trash/Recycling/Yard Waste/Bulk Item") {
            var barchartInDispatch = barchart
                .maxScaleY(12000);
             var newY = 1500;
        } else {
            var barchartInDispatch = barchart
                .maxScaleY(800);

            var newY = 50;
        };

        barPlot.datum(callsType)
            .call(barchartInDispatch);

        plot_mapDots.datum(callsType)
            .call(mapModuleDots);

        mapModuleDots.shape(callsByTime.filter(type).top(Infinity));

        var plots2 = d3.select('.container').selectAll('.plot2')
            .data(nestedNeighborhoodInDispatch);


        plots2
            .each(function (d, i) {
                var timeSeries2 = d3.timeSeries()
                    .width(200).height(150)
                    .timeRange([new Date(2015, 0, 1), new Date(2016, 0, 1)])
                    .value(function (d) {
                        return d.startTime;
                    })
                    .maxY(newY)
                    .binSize(d3.time.week)
                    .on('hover', function (t) {
                        globalDispatch.pickTime(t);
                    });

                globalDispatch.on('pickTime.' + i, function (t) {
                    timeSeries2.showValue(t);
                });

                d3.select(this).datum(d.values)
                    .call(timeSeries2);
            });



    });
}

// parse data
function parse(d){

	return {
		startTime: new Date(d.OPEN_DT),
		endTime: new Date(d.CLOSED_DT),
		type: d.TYPE,
		neighbor: d.neighborhood,
        lngLat: [+d.LONGITUDE, +d.LATITUDE]
	}


}

function parseType(n){
    d3.select(".type-list") //class in the html file
        .append("option") //it has to be called this name
        .html(n.type)
        .attr("value", n.type)
}



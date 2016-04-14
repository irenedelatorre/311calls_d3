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
    callsType.sort(function (a, b) {
        return a.duration - b.duration;
    });

    //nest by type and then by neighborhood
    var nestedNeighborhood = d3.nest()
        .key(function (d) {
            return name = d.neighbor
        })
        .entries(callsType);

    var neighborhoodsNames = nestedNeighborhood.map(function (d) {
        return d.key
    });


    //barchart
    var barchart = d3.allTypeBar()
        .width(wMap2)
        .height(hMap2)
        .fillColor("rgba(178,109,90,.5)")
        .timeRange([new Date(2015,0,1),new Date(2016,0,1)])
        .value(function(d){ return d.startTime;})
        .interval(d3.time.week)
        .on('changetime',function(xy){
            console.log(xy);
            d3.select(".start-date").html(xy[0]); //add text to html element
            d3.select(".end-date").html(xy[1]);
            globalDispatch.changetypedots(xy);

        });

    var barPlot = d3.select('.container').select('.mapingBoston').select('#plot_map3')
        .datum(callsType)
        .call(barchart);

    //dots in map
    var mapModuleDots = d3.mapDotsSeries(neighborhood)
        .width(wMap1)
        .height(hMap1)
        .scale(230000);

    d3.select(".container").select(".mapingBoston").select('#plot_map2').append('canvas')


    var plot_mapDots = d3.select(".container").select(".mapingBoston").select('#plot_map2')
        .datum(callsType)
        .call(mapModuleDots);

        mapModuleDots.shape(callsByTime.filterAll().top(Infinity));

    globalDispatch.on('changetypedots',function(t){
        mapModuleDots.shape(t);
    });

    //dots
    //legend
    // draw legend
    legendData = [{color: "#ED1C24", dotType: "Maximum duration"}, {color: "#00ADDC", dotType: "Minimum duration"}, {color: "#B26D5A", dotType: "Mean duration"}, {color: "#629195", dotType: "Median duration"}];

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
                .maxY(2000)
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
        var neighborhoodsNames = ["East Boston", "Hyde Park", "Roslindale", "Dorchester", "Greater Mattapan", "Beacon Hill", "Roxbury", "Allston / Brighton", "South End", "West Roxbury", "Mission Hill", "Fenway / Kenmore / Audubon Circle / Longwood", "Charlestown", "Downtown / Financial District", "Jamaica Plain", "South Boston / South Boston Waterfront", "Boston", "Back Bay", "Unknown", "Brighton", "Chestnut Hill"];

        callsByType.filterAll();
        if ("option" == "All") {
            console.log("all");
            callsType = callsByType.filterAll().top(Infinity);
            callsType.sort(function (a, b) {
                return a.duration - b.duration;
            });
        } else {
            callsType = callsByType.filter(type).top(Infinity);
            callsType.sort(function (a, b) {
                return a.duration - b.duration;
            });
        }
        ;

        var nestedNeighborhoodInDispatch = d3.nest()
            .key(function (d) {
                return name = d.neighbor
            })
            .entries(callsType);

        durationModule
            .names(neighborhoodsNames);

        plot1.datum(nestedNeighborhoodInDispatch)
            .call(durationModule);

        if (type == "Request for Snow Plowing" || type == "All" || type == "Missed Trash/Recycling/Yard Waste/Bulk Item") {
            var barchartInDispatch = barchart
                .maxScaleY(12000);
             var newY = 1000;
        } else {
            var barchartInDispatch = barchart
                .maxScaleY(800);

            var newY = 50;
        }
        ;

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



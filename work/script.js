 var
    w1 = d3.select('.plot1').node().clientWidth,
    h1 = d3.select('.plot1').node().clientHeight;
 var
    w2 = d3.select('.plot2').node().clientWidth,
    h2 = d3.select('.plot2').node().clientHeight;

//load data
var queue = d3_queue.queue()
    .defer(d3.csv,'../data/311calls-reduced.csv',parse)
    .defer(d3.csv,'../data/metadata.csv',parseType)
    .await(dataloaded);

var globalDispatch = d3.dispatch('changetype','pickTime');

var neighborhood_name = [];

//draw
function dataloaded(err,rows,types){
    //d3.range(start,end, increment)
  
    d3.select(".type-list").on("change", function (){
        globalDispatch.changetype(this.value);
        // this = selection the user picked
        //when the user selects another option in the list, the event is called "change"
    });



    // get the duration of each case
    rows.forEach(function(d){
        if(+d.endTime != NaN){
        d.duration =  Math.abs(d.startTime - d.endTime)/(1000*60*60*24); //in days
        }else{}
    });

    //max and min duration
    console.log(rows);

    var data = rows;

    var calls = crossfilter(data);

    var callsByType = calls.dimension(function(d){return d.type});
   

    callsType = callsByType.filter("Abandoned Bicycle").top(Infinity);
    callsType.sort(function(a,b){
        return b.duration - a.duration;
    });
    console.log(callsType);


    //nest by type and then by neighborhood
    var nestedNeighborhood = d3.nest()
        .key(function(d){return name = d.neighbor})
        .entries(callsType);

    console.log(nestedNeighborhood);


    var neighborhoodsNames = nestedNeighborhood.map(function(d){return d.key});
    //console.log(neighborhoodsNames);


    //dots
    var durationModule = d3.durationSeries()
        .width(w1)
        .height(h1)
        .distance(250)
        .daysDuration([0,400])
        .names(neighborhoodsNames);



    var plot1 = d3.select(".container").select('.plot1')
        .datum(nestedNeighborhood)
        .call(durationModule);

    //Dispatch function


    globalDispatch.on("changetype", function (type){
        callsByType.filterAll();
        callsType = callsByType.filter(type).top(Infinity);

        var nestedNeighborhoodInDispatch = d3.nest()
            .key(function(d){return name = d.neighbor})
            .entries(callsType);

            console.log(nestedNeighborhoodInDispatch);

        plot1.datum(nestedNeighborhoodInDispatch)
            .call(durationModule)
    });


   
    var caseByNeighboor = d3.nest()
        .key(function(d){return d.neighbor})
        .entries(callsType);
    //console.log(caseByNeighboor)

     

    var plots2 = d3.select('.container').selectAll('.plot2')
                  .data(caseByNeighboor);

        plots2
                  .enter()
                  .append('div')
                  .attr('class','plot2')
        
        
    plots2
        .each(function(d,i){
            var timeSeries = d3.timeSeries()
                .width(200).height(200)
                .timeRange([new Date(2015,0,1),new Date(2015,11,31)])
                .value(function(d){ return d.startTime; })
                .maxY(50)
                .binSize(d3.time.week)
                .on('hover',function(t){
                    globalDispatch.pickTime(t);
                });

            globalDispatch.on('pickTime.'+i, function(t){
                timeSeries.showValue(t);
            });

            d3.select(this).datum(d.values)
                .call(timeSeries)
                .append('h2')
                .text(d.key);

        })

}

// parse data
function parse(d){


	return {
		startTime: new Date(d.OPEN_DT),
		endTime: new Date(d.CLOSED_DT),
		type: d.TYPE,
		neighbor: d.neighborhood	

	}

	
}

function parseType(n){
    d3.select(".type-list") //class in the html file
        .append("option") //it has to be called this name
        .html(n.type)
        .attr("value", n.type)
}


 
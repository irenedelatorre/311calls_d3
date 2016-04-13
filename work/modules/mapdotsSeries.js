d3.mapDotsSeries = function (neighborhoods){
    var _dis = d3.dispatch('changetype','shape');

    //internal variables, these variables need some defualt variables which can be rewritten later
    var w = 800,
        h = 550,
        m ={t:5,r:10,b:5,l:10},
        chartW = w - m.l- m.r,
        chartH = h - m.t -m.b,
        bostonLngLat = [-71.088066,42.315520],
        valueAccessor = function(d){return d},
        scale = 150000,
        timeRange = [new Date(), new Date()]; //default timeRange


    var projection = d3.geo.mercator()
        .center(bostonLngLat)
        .translate([(chartW/2),chartH/2])
        .scale(scale);
        //.rotate([0,0,90]);

    var pathMap = d3.geo.path().projection(projection);

    function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;
        _selection.each(draw);
    }

    function draw (data,i){

        var projection = d3.geo.mercator()
            .center(bostonLngLat)
            .translate([(chartW/2),(chartH/2)])
            .scale(scale);

        var canvas = d3.select(this).select('canvas')
            .attr('width',chartW)
            .attr('height',chartH)
            .attr("transform","translate("+m.l+","+ m.t+")");

        ctx = canvas.node().getContext('2d');

        path = d3.geo.path()
            .projection(projection)
            .context(ctx);

        var circle = d3.geo.circle();

        ctx.clearRect(0,0,w,h);

        ctx.lineWidth = 1;
        path(neighborhoods);
        ctx.fillStyle = '#f7f7f7';
        ctx.strokeStyle = 'white';
        ctx.fill();
        ctx.stroke();

        //console.log(data[i].values);
        var newTimeRange = crossfilter(data);
        var callsByTime = newTimeRange.dimension(function (d) {
            return d.startTime
        });


        //question!! how brush work?? and how to clear the canvas dots at the end 
        _dis.on("shape",function(t){
            //console.log("tmodule",t);
            //console.log("datamodule",data);
            ctx.clearRect(0,0,w,h);
            ctx.lineWidth = 1;
            path(neighborhoods);
            ctx.fillStyle = '#f7f7f7';
            ctx.strokeStyle = 'white';
            ctx.fill();
            ctx.stroke();

            //crossfilter --> time range is t[0] and t[t.length-1]



            if (t.length > 0){

                var endDate = t[0].startTime,
                    startDate = t[(t.length)-1].startTime;

                var callsNewTimeRange = callsByTime.filter([startDate,endDate]).top(Infinity);

            };

            //console.log(callsNewTimeRange);


            callsNewTimeRange.forEach(function (d){
                //console.log(d.duration);

                //var pointTime = (t[0].startTime).getTime();
                //var pointEndTime = (t[t.length-1].endTime).getTime();
                //var show = ((callstartTime >= pointTime) && (pointEndTime - callstartTime)/(callendTime - callstartTime) > 1) ? 1 : 0;

                var xy = projection(d.lngLat);
                var callstartTime = d.startTime.getTime();
                var callendTime = d.endTime.getTime();
                var scaleColor = d3.scale.linear().domain([0,10]).range(["rgba(0,173,220,0.05)","rgba(237,28,36,1)"]);
                var myColor = scaleColor(d.duration);
                //var myColor=("rgba(0,173,220,0.1)");

                ctx.beginPath();
                ctx.fillStyle = myColor;
                ctx.arc(xy[0],xy[1],1,0,Math.PI*2); //(x,y,r,sAngle,eAngel,counterclockwise)
                ctx.fill();

                    //console.log(show)
                    //switch(show){
                    //    case 1:{
                    //        ctx.beginPath();
                    //        ctx.fillStyle = myColor;
                    //        ctx.arc(xy[0],xy[1],1,0,Math.PI*2); //(x,y,r,sAngle,eAngel,counterclockwise)
                    //        ctx.fill();
                    //        break;
                    //    }
                    //}




            });
        });

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

    exports.bostonLngLat = function(_ll){
        if(!arguments.length) return bostonLngLat;
        bostonLngLat = _ll;
        return this;
    };
    exports.scale = function(_s){
        if(!arguments.length) return scale;
        scale = _s;
        return this;
    };
    exports.value = function(_v){
        if(!arguments.length) return layout.value();
        valueAccessor = _v;
        layout.value(_v);
        return this;
    };

    exports.timeRange = function(_r){
        if(!arguments.length) return timeRange;
        timeRange = _r;
        return this;
    };

    d3.rebind(exports,_dis,"on","shape");
    return exports
};
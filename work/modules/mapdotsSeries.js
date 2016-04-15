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


    var projection = d3.geo.albers()
        .center(bostonLngLat)
        .rotate([0,0.1])
        .translate([(chartW/2),chartH/2])
        .scale(scale);


    var pathMap = d3.geo.path().projection(projection);

    function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;
        _selection.each(draw);
    }

    function draw (data,i){

        var projection = d3.geo.albers()
            .rotate([0,0.1])
            .center(bostonLngLat)
            .translate([(chartW/2),((chartH/2)+200)])
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

        var oneHour = (1/(24*60));
        console.log(oneHour);
        var color1 = "rgba(224,255,245,0.01)";
        var color2 = "rgba(0,173,220,0.1)";
        var color3 = "rgba(98,145,149,0.1)";
        var color4 = "rgba(120,87,166,0.1)"
        var color5 = "rgba(178,109,90,0.1)";
        var color6 = "rgba(237,28,36,0.1)";
        var scaleColor = d3.scale.linear().domain([0,oneHour,12,50,200,450]).range([color2,color3,color4,color5,color6,color6]);

        var newTimeRange = crossfilter(data);
        var callsByTime = newTimeRange.dimension(function (d) {
            return d.startTime
        });

        //question!! how brush work?? and how to clear the canvas dots at the end
        _dis.on("shape",function(t){

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

            //draw every call as a dot
            callsNewTimeRange.forEach(function (d){
                var xy = projection(d.lngLat);
                var callstartTime = d.startTime.getTime();
                var callendTime = d.endTime.getTime();
                var myColor = scaleColor(d.duration);
                //var myColor = "rgba(0,173,220,1)";

                ctx.beginPath();
                ctx.fillStyle = myColor;
                ctx.arc(xy[0],xy[1],1,0,Math.PI*2); //(x,y,r,sAngle,eAngel,counterclockwise)
                ctx.fill();
            });

            //draw neighborhood names
            (neighborhoods.features).forEach(function(d){



                var nameX = path.centroid(d)[0];
                var nameY = path.centroid(d)[1];

                ctx.strokeStyle = 'white';
                ctx.lineWidth = 1;
                ctx.textAlign = "center";
                ctx.font = "14px sans-serif";
                ctx.strokeText(d.properties.Name, nameX, nameY);

                ctx.fillStyle = '#333';
                ctx.textAlign = "center";
                ctx.font = "14px sans-serif";
                ctx.fillText(d.properties.Name, nameX, nameY);
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
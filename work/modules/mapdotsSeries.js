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
        var color1 = "rgb(224,240,245)"; //in one hour
        var color2 = "rgb(142,202,201)"; // from one hour to 1 day
        var color3 = "rgb(000,173,219)"; // from 1 day to the average
        var color4 = "rgb(143,143,150)"; // from the average to one month
        var color5 = "rgb(194,106,092)"; // from one month to one year
        var color6 = "rgb(236,033,039)"; // more than one year
        //var color7 = "rgb(255,109,001)"; // more than one year

        var scaleColor = d3.scale.linear().domain([0,oneHour,1,12,30,365,450]).range([color1,color2,color3,color4,color5,color6,color6]);
        var scaleSize = d3.scale.linear().domain([0,oneHour,1,12,30,365,450]).range([1,1,1,1,1,1,1]);

        var newTimeRange = crossfilter(data);
        var callsByTime = newTimeRange.dimension(function (d) {
            return d.startTime
        });

        //question!! how brush work?? and how to clear the canvas dots at the end
        _dis.on("shape",function(t){

            ctx.clearRect(0,0,w,h);
            ctx.lineWidth = 2;
            path(neighborhoods);
            ctx.fillStyle = 'rgb(221, 223, 227)';
            ctx.strokeStyle = "rgb(221, 223, 227)";
            //ctx.fill();
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
                var mySize = scaleSize(d.duration);
                //var myColor = "rgba(0,173,220,1)";
                //var mySize = 1;
                ctx.globalAlpha=0.5;
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                ctx.lineWidth = 0.01;
                ctx.fillStyle = myColor;
                ctx.arc(xy[0],xy[1],mySize,0,Math.PI*2); //(x,y,r,sAngle,eAngel,counterclockwise)
                ctx.fill();
                //ctx.stroke();
                ctx.globalAlpha=1;

            });

            if (t.length==0 || t.length>0){
                //draw neighborhood names
                (neighborhoods.features).forEach(function(d){
                    var nameX = path.centroid(d)[0];
                    var nameY = path.centroid(d)[1];
                    ctx.strokeStyle = '#333';
                    //ctx.setLineDash([15, 5]);
                    ctx.textAlign = "left";
                    ctx.lineWidth = 0.5;
                    ctx.font = "12px sans-serif";
                    ctx.textAlign = "left";
                    ctx.fillStyle = '#333';
                    var newY = nameY-2;
                    if (d.properties.Name=="West Roxbury"){
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, 90, nameY);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(100,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Roslindale") {
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, 90, nameY);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(100,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Roxbury") {
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, 90, nameY);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(100,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Hyde Park") {
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, 90, nameY);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(100,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Mattapan") {
                        ctx.fillText(d.properties.Name, nameX-20, 560);
                        ctx.beginPath()
                        ctx.moveTo(nameX,nameY);
                        ctx.lineTo(nameX,540);
                        ctx.stroke()
                    }else if (d.properties.Name=="Dorchester") {
                        ctx.fillText(d.properties.Name, nameX-20, 560);
                        ctx.beginPath()
                        ctx.moveTo(nameX,nameY);
                        ctx.lineTo(nameX,540);
                        ctx.stroke()
                    }else if (d.properties.Name=="South Boston") {
                        ctx.fillText(d.properties.Name, nameX-20, 560);
                        ctx.beginPath()
                        ctx.moveTo(nameX,nameY);
                        ctx.lineTo(nameX,540);
                        ctx.stroke()
                    }else if (d.properties.Name=="Chinatown") {
                        ctx.fillText(d.properties.Name, nameX-90, 490);
                        ctx.beginPath()
                        ctx.moveTo(nameX,nameY);
                        ctx.lineTo(nameX-50,nameY);
                        ctx.lineTo(nameX-50,470);
                        ctx.stroke()
                    }else if (d.properties.Name=="Leather District") {
                        ctx.fillText(d.properties.Name, nameX-5, 450);
                        ctx.beginPath()
                        ctx.moveTo(nameX,nameY);
                        ctx.lineTo(nameX,430);
                        ctx.stroke()
                    }else if (d.properties.Name=="Jamaica Plain") {
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, nameX, nameY-70);
                        ctx.beginPath()
                        ctx.moveTo(nameX-20,newY);
                        ctx.lineTo(nameX-20,newY-60);
                        ctx.stroke()
                    }else if (d.properties.Name=="Mission Hill") {
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, nameX, nameY-70);
                        ctx.beginPath()
                        ctx.moveTo(nameX-15,newY);
                        ctx.lineTo(nameX-15,newY-60);
                        ctx.stroke()
                    }else if (d.properties.Name=="Fenway") {
                        ctx.fillText(d.properties.Name, nameX, nameY-70);
                        ctx.beginPath()
                        ctx.moveTo(nameX+10,newY-20);
                        ctx.lineTo(nameX+10,newY-60);
                        ctx.stroke()
                    }else if (d.properties.Name=="Bay Village") {
                        ctx.fillText(d.properties.Name, nameX-10, nameY-80);
                        ctx.beginPath()
                        ctx.moveTo(nameX+20,newY-30);
                        ctx.lineTo(nameX+20,newY-70);
                        ctx.stroke()
                    }else if (d.properties.Name=="Longwood Medical Area") {
                        var newY = 221.3;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,nameY);
                        ctx.lineTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        console.log(newY)
                        ctx.stroke()
                    }else if (d.properties.Name=="West End") {
                        var newY = 237;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        console.log(newY)
                        ctx.stroke()
                    }else if (d.properties.Name=="Back Bay") {
                        var newY = 252.7;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Beacon Hill") {
                        var newY = 268.4;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="North End") {
                        var newY = 284.1;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Downtown") {
                        var newY = 299.8;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="South End") {
                        var newY = 315.5;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="East Boston") {
                        var newY = 331.2;
                        ctx.fillText(d.properties.Name, 900, newY+2);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(890,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="South Boston Waterfront") {
                        console.log(newY)
                        ctx.fillText(d.properties.Name, 900, nameY+10);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY+10);
                        ctx.lineTo(890,newY+10);
                        ctx.stroke()
                    }else if (d.properties.Name=="Brighton") {
                        ctx.textAlign = "right";
                        ctx.fillText(d.properties.Name, nameX-90, nameY);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(nameX-80,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Allston") {
                        ctx.fillText(d.properties.Name, nameX+70, nameY);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(nameX+60,newY);
                        ctx.stroke()
                    }else if (d.properties.Name=="Charlestown") {
                        ctx.fillText(d.properties.Name, nameX, nameY-80);
                        ctx.beginPath()
                        ctx.moveTo(nameX,newY);
                        ctx.lineTo(nameX,newY-70);
                        ctx.stroke()
                    }
                    else{
                        ctx.fillText(d.properties.Name, nameX, nameY);
                    }


                });
            }
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
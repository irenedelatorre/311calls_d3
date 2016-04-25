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

        // Select old canvases to remove after fade.
        var canvas0 = d3.selectAll("canvas");

        var canvas1 = d3.select(this).insert('canvas')
            .attr('width',chartW)
            .attr('height',chartH)
            .attr("transform","translate("+m.l+","+ m.t+")")
            .style("opacity",0);

        ctx = canvas1.node().getContext('2d');
        ctx.fillStyle = "#fff";

        path = d3.geo.path()
            .projection(projection)
            .context(ctx);

        var circle = d3.geo.circle();

        ctx.clearRect(0,0,w,h);

        var oneHour = (1/(24*60));
        var color1 = "#376E7C"; //in one hour
        var color2 = "#A5BEC4"; // from one hour to 1 day
        var color3 = "#EAE3D7"; // from 1 day to the average
        var color4 = "#F3919A"; // from the average to one month
        var color5 = "#EF4553"; // from one month to one year
        var color6 = "#BC000E"; // more than one year
        //var color7 = "rgb(255,109,001)"; // more than one year

        //var scaleColor = d3.scale.linear().domain([0,oneHour,1,12,30,365,450]).range([color1,color2,color3,color4,color5,color6,color6]);
        //var scaleSize = d3.scale.linear().domain([0,oneHour,1,12,30,365,450]).range([1,1,1,1,1,1,1]);

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

            (neighborhoods.features).forEach(function(d){
                var nameX = path.centroid(d)[0];
                var nameY = path.centroid(d)[1];
                ctx.strokeStyle = '#999';
                //ctx.setLineDash([15, 5]);
                ctx.lineWidth = 0.5;
                ctx.font = "12px sans-serif";
                ctx.textAlign = "left";
                ctx.fillStyle = '#333';
                var newY = nameY-2;
                if (d.properties.Name=="West Roxbury"){
                    ctx.textAlign = "right";
                    ctx.fillText(d.properties.Name, 90, nameY);
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Roslindale") {
                    ctx.textAlign = "right";
                    ctx.fillText(d.properties.Name, 90, nameY);
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Roxbury") {
                    ctx.textAlign = "right";
                    ctx.fillText(d.properties.Name, 90, nameY);
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Hyde Park") {
                    ctx.textAlign = "right";
                    ctx.fillText(d.properties.Name, 90, nameY);
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Mattapan") {
                    ctx.fillText(d.properties.Name, nameX-20, 560);
                    ctx.beginPath()
                    ctx.moveTo(nameX,470);
                    ctx.lineTo(nameX,540);
                    ctx.stroke()
                }else if (d.properties.Name=="Dorchester") {
                    ctx.fillText(d.properties.Name, nameX-20, 560);
                    ctx.beginPath()
                    ctx.moveTo(nameX,500);
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
                    ctx.moveTo(nameX-20,newY-25);
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
                    ctx.moveTo(nameX-40,newY);
                    ctx.lineTo(nameX-80,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Allston") {
                    ctx.fillText(d.properties.Name, nameX+70, nameY);
                    ctx.beginPath()
                    ctx.moveTo(nameX+20,newY);
                    ctx.lineTo(nameX+60,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Charlestown") {
                    ctx.fillText(d.properties.Name, nameX, nameY-80);
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY-50);
                    ctx.lineTo(nameX,newY-70);
                    ctx.stroke()
                }
                else{
                    ctx.fillText(d.properties.Name, nameX, nameY);
                }


            });

            //crossfilter --> time range is t[0] and t[t.length-1]

            if (t.length > 0){

                //Crossfilter range filters selecting the objects that are the same or equal to the first value and LESS than the second one.
                // This means that the last call in our array cannot be selected if we don't change a bit the last value (adding 1 second)
                var tEndMiliseconds = Math.abs(t[0].startTime) + 1000;
                var tEndDate = new Date (tEndMiliseconds);

                var end = tEndDate,
                    start = t[(t.length)-1].startTime;

            } if (t.length ==0){
                var end = new Date ('January 01, 2015 00:00:00'),
                    start = new Date ('January 01, 2016 00:00:00');

            };

            var callsNewTimeRange = callsByTime.filter([start,end]).top(Infinity);

            var color1 = "#376E7C"; //in one hour
            var color2 = "#A5BEC4"; // from one hour to 1 day
            var color3 = "#EAE3D7"; // from 1 day to the average
            var color4 = "#F3919A"; // from the average to one month
            var color5 = "#EF4553"; // from one month to one year
            var color6 = "#BC000E"; // more than one year

            //draw every call as a dot
            callsNewTimeRange.forEach(function (d){
                var mySize = 1.5;

                if (d.duration < oneHour ) {

                    var myColor = color1; //13,374 calls
                }else if (d.duration>oneHour && d.duration<1){
                    var myColor = color2; //65.991 calls
                }else if (d.duration>1 && d.duration<12){
                    var myColor=color3 //71661 calls
                }else if (d.duration>12 && d.duration<30){
                    var myColor = color4; //20551 calls
                }else if (d.duration>30 && d.duration<90){

                    var myColor = color5; //17164 calls
                }else if (d.duration>90) {
                    //console.log("d")
                    var myColor = color6; //4542 calls
                };

                var xy = projection(d.lngLat);
                var callstartTime = d.startTime.getTime();
                var callendTime = d.endTime.getTime();
                //var myColor = scaleColor(d.duration);
                //var mySize = scaleSize(d.duration);

                ctx.globalAlpha=0.5;
                ctx.beginPath();
                ctx.fillStyle = myColor;
                ctx.arc(xy[0],xy[1],mySize,0,Math.PI*2); //(x,y,r,sAngle,eAngel,counterclockwise)
                ctx.fill();
                //ctx.stroke();
                ctx.globalAlpha=1;

            });

            canvas1.transition()
                .duration(350)
                .style("opacity", 1)
                .each("end", function() { canvas0.remove(); });



            (neighborhoods.features).forEach(function(d){
                var nameX = path.centroid(d)[0];
                var nameY = path.centroid(d)[1];
                ctx.strokeStyle = '#999';
                //ctx.setLineDash([15, 5]);
                ctx.lineWidth = 0.5;

                var newY = nameY-2;
                if (d.properties.Name=="West Roxbury"){
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Roslindale") {
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Roxbury") {
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Hyde Park") {
                    ctx.beginPath()
                    ctx.moveTo(185,newY);
                    ctx.lineTo(100,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Mattapan") {
                    ctx.beginPath()
                    ctx.moveTo(nameX,470);
                    ctx.lineTo(nameX,540);
                    ctx.stroke()
                }else if (d.properties.Name=="Dorchester") {
                    ctx.beginPath()
                    ctx.moveTo(nameX,500);
                    ctx.lineTo(nameX,540);
                    ctx.stroke()
                }else if (d.properties.Name=="South Boston") {
                    ctx.beginPath()
                    ctx.moveTo(nameX,nameY);
                    ctx.lineTo(nameX,540);
                    ctx.stroke()
                }else if (d.properties.Name=="Chinatown") {
                    ctx.beginPath()
                    ctx.moveTo(nameX,nameY);
                    ctx.lineTo(nameX-50,nameY);
                    ctx.lineTo(nameX-50,470);
                    ctx.stroke()
                }else if (d.properties.Name=="Leather District") {
                    ctx.beginPath()
                    ctx.moveTo(nameX,nameY);
                    ctx.lineTo(nameX,430);
                    ctx.stroke()
                }else if (d.properties.Name=="Jamaica Plain") {

                    ctx.beginPath()
                    ctx.moveTo(nameX-20,newY-25);
                    ctx.lineTo(nameX-20,newY-60);
                    ctx.stroke()
                }else if (d.properties.Name=="Mission Hill") {
                    ctx.beginPath()
                    ctx.moveTo(nameX-15,newY);
                    ctx.lineTo(nameX-15,newY-60);
                    ctx.stroke()
                }else if (d.properties.Name=="Fenway") {
                    ctx.beginPath()
                    ctx.moveTo(nameX+10,newY-20);
                    ctx.lineTo(nameX+10,newY-60);
                    ctx.stroke()
                }else if (d.properties.Name=="Bay Village") {
                    ctx.beginPath()
                    ctx.moveTo(nameX+20,newY-30);
                    ctx.lineTo(nameX+20,newY-70);
                    ctx.stroke()
                }else if (d.properties.Name=="Longwood Medical Area") {
                    var newY = 221.3;
                    ctx.beginPath()
                    ctx.moveTo(nameX,nameY);
                    ctx.lineTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    console.log(newY)
                    ctx.stroke()
                }else if (d.properties.Name=="West End") {
                    var newY = 237;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    console.log(newY)
                    ctx.stroke()
                }else if (d.properties.Name=="Back Bay") {
                    var newY = 252.7;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Beacon Hill") {
                    var newY = 268.4;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="North End") {
                    var newY = 284.1;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Downtown") {
                    var newY = 299.8;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="South End") {
                    var newY = 315.5;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="East Boston") {
                    var newY = 331.2;
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY);
                    ctx.lineTo(890,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="South Boston Waterfront") {
                    console.log(newY)
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY+10);
                    ctx.lineTo(890,newY+10);
                    ctx.stroke()
                }else if (d.properties.Name=="Brighton") {
                    ctx.beginPath()
                    ctx.moveTo(nameX-40,newY);
                    ctx.lineTo(nameX-80,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Allston") {
                    ctx.beginPath()
                    ctx.moveTo(nameX+20,newY);
                    ctx.lineTo(nameX+60,newY);
                    ctx.stroke()
                }else if (d.properties.Name=="Charlestown") {
                    ctx.beginPath()
                    ctx.moveTo(nameX,newY-50);
                    ctx.lineTo(nameX,newY-70);
                    ctx.stroke()
                };

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
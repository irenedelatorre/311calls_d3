d3.mapDotsSeries = function (neighborhoods){
    var _dis = d3.dispatch('changetype');

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

    var pathMap = d3.geo.path().projection(projection);

    function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;
        _selection.each(draw);
    }

    function draw (data,i){

        console.log(data);



        var projection = d3.geo.mercator()
            .center(bostonLngLat)
            .translate([(chartW/2),(chartH/2)])
            .scale(scale);


        var canvas = d3.select(this)
            .append('canvas')
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

        data.forEach(function (d){
            calls = d.values;
            var t = 0;
            for (i=0; i<calls.length; i++) {
                var xy = projection(calls[i].lngLat);
                var show = (t - calls.startTime)/(calls.endTime - calls.startTime)>1?1:(t - calls.startTime)/(calls.endTime - calls.startTime);


                ctx.beginPath();
                ctx.fillStyle = 'rgba(0,0,0,0.05)';
                ctx.arc(xy[0],xy[1],1,0,Math.PI*2);
                ctx.fill();

            }

            //t += speed;



        });

        //on open case, start drawing dots

        //on end case, remove dots

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

    d3.rebind(exports,_dis,"on");
    return exports
};

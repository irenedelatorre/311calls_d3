d3.mapSeries = function (){

    //internal variables, these variables need some defualt variables which can be rewritten later
    var w =800,
        h =400,
        //m ={t:50,r:25,b:50,l:25},
        m ={t:5,r:10,b:5,l:10},
        chartW = w - m.l- m.r,
        chartH = h - m.t -m.b,
        bostonLngLat = [-71.088066,42.315520],
        scale = 150000;

    var projection = d3.geo.mercator()
        .center(bostonLngLat)
        .translate([(chartW/2),chartH/2])
        .scale(scale);

    var pathMap = d3.geo.path().projection(projection);

    function exports (_selection){
        chartW = w - m.l- m.r;
        chartH = h - m.t -m.b;
        console.log(this)
        var projection = d3.geo.mercator()
            .center(bostonLngLat)
            .translate([(chartW/2),chartH/2])
            .scale(scale);

        var pathMap = d3.geo.path().projection(projection);

        _selection.each(draw);
    }

    function draw (data){
        //console.log(data);

        var svg = d3.select(this).selectAll("svg").data([data]);

        var svgEnter = svg.enter()
            .append('svg')
            .attr('width',w).attr('height',h);

        svgEnter.append('g')
            .attr('class','map')
            .attr("transform","translate("+m.l+","+ m.t+")");

        var map = svg.select(".map")
            .selectAll(".block-group")
            .data(data);

        map.enter()
            .append("path")
            .attr("class", "block-group")
            .attr("d", pathMap);
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

    return exports
};

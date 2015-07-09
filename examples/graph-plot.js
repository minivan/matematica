/**
 * Created by sckeedoo on 7/9/15.
 */


var WIDTH = 800;
var HEIGHT = 600;
var data = [];


function plotFunction() {

    data.length = 0;

    var expr = document.getElementById("textbox").value;
    var expr2 = expr;
    expr = expr.replace("x", "(k*0.1)", "g");
    console.log(expr);

    for (var k = -1000; k < 1000; k++) {
        data.push({"x": 0.1 * k, "y": eval(expr)  });
        //console.log( jsep(expr2));
    }

    var lineGen = d3.svg.line()
        .x( function(d){ return xScale(d.x);})
        .y( function(d){ return yScale(d.y);})
        .interpolate("basis");


    canvas.append("svg:path")
        .attr("d", lineGen(data))
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("fill", "none");

}

var canvas = d3.select("body")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

var xScale = d3.scale.linear().range([20, WIDTH - 20]).domain([-30, 30]);
var yScale = d3.scale.linear().range([20, HEIGHT - 20]).domain([30, -30]);

xAxis = d3.svg.axis()
    .scale(xScale);

yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

canvas.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + HEIGHT/2 + ")")
    .call(xAxis);

canvas.append("svg:g")
    .attr("class","x axis")
    .attr("transform", "translate(" + WIDTH/2 + ",0)")
    .call(yAxis);

var currentChar = 'e';

var functions = [];

// Creating canvas for drawing
var canvas;
var WIDTH = 800;
var HEIGHT = 600;
var xLines = 30;
var yLines = 30;
var totalPoints = 1000;

var colors = ["#000000","#480000","#D00000","#009900","#0066CC","#660000","#663366","#9900FF","#99FF33","#9966FF"
    ,"#CC0000","#FF0000","#CCFF66"
];

function MathFunction(formula){
    this.id = currentChar;
    this.formula = formula;
    this.color = colors.pop();
    document.getElementById("formula").value = "";

    this.getData = function(left,right){
        left = typeof left !== 'undefined' ? right : -xLines;
        right = typeof right !== 'undefined' ? right : xLines;
        var x,step = (right-left)/totalPoints;
        var data = [];
        for(x = left; x < right; x += step){
            data.push({'x' : x, 'y' : eval(this.formula)});
        }

        return data;
    }

    this.plot = function(){
        var lineGen = d3.svg.line()
            .x( function(d){ return xScale(d.x);})
            .y( function(d){ return yScale(d.y);})
            .interpolate("basis");

        canvas.append("svg:path")
            .attr("d", lineGen(this.getData()))
            .attr("stroke", this.color)
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .transition()
            .ease("linear")
            .duration(1000)
            .attr("id", "func-"+this.id);
    }
}

function add(){
    try {
        var formula = parseExpression(document.getElementById("formula").value);
        if(formula.length == 0)
            throw 1;
        var m = new MathFunction(formula);
        m.plot();
        functions.push(m);
        $("#functions-list").append("<tr id=\"label-func-"+ m.id+"\"><td>" + currentChar + "(x) = " + formula + "</td>" +
            "<td><a href=\"#\" class=\"btn btn-danger btn-xs\" onclick=\"deleteFunction('"+ m.id +"')\"><span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\"></span></a></td></tr>");
        refreshFunctionName();
    }catch(err) {
        console.log(err);
        $("#wrong-input").html("Expresia introdusa nu este valida :/").show();
    }
}

$(document).ready(function() {
    $("#wrong-input").hide();
    refreshFunctionName();
    $("#removeFunction").click(function(){
       $(this).parent().parent().remove();
    });
    canvas = d3.select("#div2")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g");
    drawAxis();
});

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function refreshFunctionName(){
    currentChar = nextChar(currentChar);
    switch (currentChar){
        case "x" :
            currentChar = nextChar(currentChar);
            break;
        case "z" :
            $("#input").hide();
            break;
    }
    document.getElementById("function-name").innerText = currentChar + "(x) = ";
}

function parseExpression(expr){
    //removing spaces
    return expr.replace(/ /g,"").toLowerCase();
}

// Creating scales for x and y axis

var xScale = d3.scale.linear().range([20, WIDTH - 20]).domain([-xLines, xLines]);
var yScale = d3.scale.linear().range([20, HEIGHT - 20]).domain([yLines, -yLines]);

function scaleAxisIn(){
    if(xLines >5)
        xLines-=5;
    if(yLines>5)
        yLines-=5;
    xScale = d3.scale.linear().range([20, WIDTH - 20]).domain([-xLines, xLines]);
    yScale = d3.scale.linear().range([20, HEIGHT - 20]).domain([yLines, -yLines]);
    canvas.selectAll("line").remove();
    canvas.selectAll("text").remove();
    canvas.selectAll("path").remove();

    drawAxis();
    drawFunctions();

}

function scaleAxisOut(){
    xLines+=5;
    yLines+=5;
    xScale = d3.scale.linear().range([20, WIDTH - 20]).domain([-xLines, xLines]);
    yScale = d3.scale.linear().range([20, HEIGHT - 20]).domain([yLines, -yLines]);
    canvas.selectAll("line").remove();
    canvas.selectAll("text").remove();
    canvas.selectAll("path").remove();
    drawAxis();
    drawFunctions();

}

function drawFunctions(){
    for(var i = 0; i < functions.length; i++){
        functions[i].plot();
    }
}

// Function for drawing axis
function drawAxis(){

    xAxis = d3.svg.axis()
        .scale(xScale);

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");


    xAxis2 = d3.svg.axis()
        .scale(xScale)
        .innerTickSize(-HEIGHT)
        .outerTickSize(0)
        .tickPadding(8);

    yAxis2 = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize(-WIDTH)
        .outerTickSize(0)
        .tickPadding(8);

    canvas.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + HEIGHT/2 + ")")
        .call(xAxis);

    canvas.append("svg:g")
        .attr("class","x axis")
        .attr("transform", "translate(" + WIDTH/2 + ",0)")
        .call(yAxis);

    canvas.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(xAxis2);

    canvas.append("svg:g")
        .attr("class","y axis")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(yAxis2);

}

function deleteFunction(id){
    $("#func-"+id).remove();
    $("#label-func-"+id).remove();
    functions = functions.filter(function( obj ) {
        return obj.id !== id;
    });
}
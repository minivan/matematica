var currentChar = 'e';

// Creating canvas for drawing
var canvas;


function add(){
    try {
        var formula = parseExpression(document.getElementById("formula").value);
        if(formula.length == 0)
            throw 1;
        createObject(getData(formula));
        document.getElementById("formula").value = "";
        $("#functions-list").append("<tr><td>" + currentChar + "(x) = " + formula + "</td>" +
            "<td><a href=\"#\" class=\"btn btn-danger btn-xs\" id=\"removeFunction\"><span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\"></span></a></td></tr>");
        refreshFunctionName();
    }catch(err) {
        console.log(err);
        $("#wrong-input").html("Expresia introdusa nu este valida :/").show();
    }
}

function getData(formula,left,right){

    left = typeof left !== 'undefined' ? right : -50;
    right = typeof right !== 'undefined' ? right : 50;
    var x,step = 0.1;
    var data = [];
    for(x = left; x < right; x += step){
        data.push({'x' : x, 'y' : eval(formula)});
    }

    return data;
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
            alert("Prea multe functii ati folosit");
            break;
    }
    document.getElementById("function-name").innerText = currentChar + "(x) = ";
}

function parseExpression(expr){
    //removing spaces
    return expr.replace(/ /g,"").toLowerCase();
}

var WIDTH = 800;
var HEIGHT = 600;
var xLines = 30;
var yLines = 30;
var funcObjects = [];
var string = "id";
var nr =  0;

// Function class

var Function = function(red, green, blue, data, id){
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.data = data;
    this.id = id;
};




function getExpression(){
    var expr = document.getElementById("textbox").value;

    expr = expr.replace("x", "(k*0.1)", "g");
    expr = expr.replace("sin(", "Math.sin(", "g");
    expr = expr.replace("cos(", "Math.cos(", "g");
    return expr;
}


Function.prototype.plotFunction = function(){

    /*for (var k = -1000; k < 1000; k++) {
     this.data.push({"x": 0.1 * k, "y": eval(this.expr)  });
     }*/

    var lineGen = d3.svg.line()
        .x( function(d){ return xScale(d.x);})
        .y( function(d){ return yScale(d.y);})
        .interpolate("basis");

    canvas.append("svg:path")
        .attr("d", lineGen(this.data))
        .attr("stroke", "rgb(" + this.red + "," + this.green +"," + this.blue + ")")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .transition()
        .ease("linear")
        .duration(1000)
        .attr("id", this.id);
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

    for(var i = 0; i < funcObjects.length; i++){
        funcObjects[i].plotFunction();
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


function createObject(data) {
    //var data = [];
    var r =  Math.floor(Math.random()*150);
    var g =  Math.floor(Math.random()*150);
    var b =  Math.floor(Math.random()*150);

    nr++;
    var id = string + nr;
    var func = new Function(r, g, b, data, id );

    funcObjects.push(func);
    func.plotFunction();
}

function deleteObject(){
    canvas.select("#"+funcObjects[0].id).remove();
    funcObjects.shift();
}
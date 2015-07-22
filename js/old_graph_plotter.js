var currentChar = 'e';

var functions = [];

// Creating canvas for drawing
var canvas;
var WIDTH = 600;
var HEIGHT = 600;
var xLines = 30;
var yLines = 30;
var totalPoints = 1000;

var drag = d3.behavior.drag()
    .on("dragstart", function(){
        alert("Started");
    })
    .on("drag", function(){
        alert("updated");
    })
    .on("dragend", function(){
        alert("End");
    });

var colors = ["#FF4000", "#B18904", "#38610B", "#04B486", "#045FB4", "#071418", "#9AFE2E", "#0B173B", "#7401DF",
    "#BF00FF", "#3B0B39", "#DF0174", "#610B21"
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
        var result;
        for(x = left; x < right; x += step){
            result = eval(this.formula);
            if(!isNaN(result))
                data.push({'x': x, 'y': result});
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
        var row = d3.select("#functions-list tbody")
            .append("tr")
            .attr("id","label-func-"+ m.id);
        row.append("td")
            .append("svg")
            .attr("width","20px")
            .attr("height","20px")
            .append("rect")
            .attr("width","20px")
            .attr("height","20px")
            .attr("fill", m.color);
        row.append("td").text(currentChar + "(x) = " + formula);
        row.append("td")
            .append("a")
            .attr("class","btn btn-danger btn-xs")
            .attr("onclick","deleteFunction('"+ m.id +"')")
            .append("span")
            .attr("class","glyphicon glyphicon-minus")
            .attr("aria-hidden","true");

        refreshFunctionName();
        $("#wrong-input").hide();
    }catch(err) {
        console.log(err);
        $("#wrong-input").html("Expresia introdusa nu este valida :/").show();
    }
}

$(document).ready(function() {
    $("#wrong-input").hide();
    refreshFunctionName();
    adjustSize();
});

$(window).resize(function() {
    adjustSize();
});

function drawGraph(){
    d3.select("#div2").selectAll("svg").remove();
    canvas = d3.select("#div2")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g");
    canvas.call(drag);
    xScale = d3.scale.linear().range([20, WIDTH - 20]).domain([-xLines, xLines]);
    yScale = d3.scale.linear().range([20, HEIGHT - 20]).domain([yLines, -yLines]);
    drawAxis();
    drawFunctions();
}

function adjustSize(){
    WIDTH = HEIGHT = ($("#plotting-area").width());
    drawGraph();
}

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
        .attr("transform", "translate(-1,0)")
        .call(yAxis2);

}

function deleteFunction(id){
    $("#func-"+id).remove();
    $("#label-func-"+id).remove();
    functions = functions.filter(function( obj ) {
        if(obj.id === id)
            colors.push(obj.color);
        return obj.id !== id;
    });
}
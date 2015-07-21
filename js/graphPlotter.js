var currentChar = 'e';

var functionsNames = ["f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w"];
var i = 0;
var functions = [];

// Creating canvas for drawing
var myInstance;
var fullScreen = false;

function add(){
    try {
        var formula = parseExpression(document.getElementById("formula").value);

        if(formula.length == 0)
            throw 1;
        functions.push({
            id : currentChar,
            fn : formula,
            title : currentChar + "(x)"
        });


        var row = d3.select("#functions-list tbody")
            .append("tr")
            .attr("id","label-func-"+ currentChar);
        row.append("td").text(currentChar + "(x) = " + formula);
        var actionsTD = row.append("td");

        actionsTD.append("a")
            .attr("class","btn btn-xs")
            .attr("onclick","closeGraph('"+ currentChar +"')")
            .append("span")
            .attr("class","glyphicon glyphicon-pencil")
            .attr("aria-hidden","true");

        actionsTD.append("a")
            .attr("class","btn btn-xs")
            .attr("onclick","deleteFunction('"+ currentChar +"')")
            .append("span")
            .attr("class","glyphicon glyphicon-minus")
            .attr("aria-hidden","true");

        refreshFunctionName();
        $("#wrong-input").hide();
        myInstance.refresh(functions);
        $("#formula").val("");
        checkForEmpty();
    }catch(err) {
        console.log(err);
        $("#wrong-input").html("Expresia introdusa nu este valida :/").show();
        functions.pop();
        $("#label-func-"+functionsNames[--i]).remove();


    }
}

function checkForEmpty(){
    if(functions.length == 0)
        $("#functions-list").hide();
    else
        $("#functions-list").show();
}

$(document).ready(function() {
    $("#wrong-input").hide();
    refreshFunctionName();
    myInstance = new graph();
    myInstance.plot({
        target : "#plotting-area",
        data : functions
    });
    adjustSize();
    checkForEmpty();

    $("#formula").keyup(function(event){
        if(event.keyCode == 13){
            add();
        }
    });
});

$(window).resize(function() {
    if(fullScreen)
        adjustFullScreenSize();
    else
        adjustSize();
});

function adjustSize(){
    if(myInstance != null) {
        myInstance.setSize($("#plotting-area").width(), $("#plotting-area").width()/1.5);
        myInstance.refresh(functions);
    }
}

function adjustFullScreenSize(){
    if(myInstance != null) {
        $("#fsc .full-screen-content").height($("#fsc").height() - $("#fsc .full-screen-header").height()-10);
        myInstance.setSize($("#fsc").width(),$("#fsc .full-screen-content").height());
        myInstance.refresh(functions);
    }
}

function refreshFunctionName(){
    if(functionsNames.length == 0)
        $("#input").hide();
    currentChar = functionsNames[++i];
    document.getElementById("function-name").innerText = currentChar + "(x) = ";
}

function parseExpression(expr){
    return expr.replace(/ /g,"").toLowerCase();
}

function deleteFunction(id){
    $("#label-func-"+id).remove();
    functions = functions.filter(function( obj ) {
        return obj.id !== id;
    });
    myInstance.refresh(functions);
    functionsNames.push(id);
    functionsNames = functionsNames.sort();
    checkForEmpty();
}

function closeGraph(id){
    for(i =0 ;i < functions.length;i++){
        if(functions[i].id === id){
            if(typeof functions[i].graphOptions.closed == 'undefined')
                functions[i].graphOptions = {
                    closed: true
                };
            else
                functions[i].graphOptions.closed = !functions[i].graphOptions.closed;
        }
    }
    myInstance.refresh(functions);
}

function openFullScreen(){
    fullScreen = true;
    $("#fsc").fadeIn();
    myInstance = new graph();
    myInstance.plot({
        target : "#fsc .full-screen-content",
        data : functions
    });
    adjustFullScreenSize();
}

function closeFullScreen(){
    fullScreen = false;
    $("#fsc").fadeOut();
    myInstance = new graph();
    myInstance.plot({
        target : "#plotting-area",
        data : functions
    });
    adjustSize();
}

$(document).keyup(function(e) {
    if (e.keyCode == 27 && fullScreen) {
        closeFullScreen();
    }
});


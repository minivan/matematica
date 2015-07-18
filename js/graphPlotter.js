var currentChar = 'e';

var functions = [];

// Creating canvas for drawing
var myInstance;

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
        row.append("td")
            .append("a")
            .attr("class","btn btn-danger btn-xs")
            .attr("onclick","deleteFunction('"+ currentChar +"')")
            .append("span")
            .attr("class","glyphicon glyphicon-minus")
            .attr("aria-hidden","true");

        refreshFunctionName();
        $("#wrong-input").hide();
        myInstance.refresh(functions);
        $("#formula").val("");
    }catch(err) {
        console.log(err);
        $("#wrong-input").html("Expresia introdusa nu este valida :/").show();
    }
}

$(document).ready(function() {
    $("#wrong-input").hide();
    refreshFunctionName();
    adjustSize();
    myInstance = new graph();
    myInstance.plot({
        target : "#plotting-area",
        data : functions
    });
    adjustSize();
});

$(window).resize(function() {
    adjustSize();
});

function adjustSize(){
    if(myInstance != null) {
        myInstance.setSize($("#plotting-area").width(),$("#plotting-area").width()/2);
        myInstance.refresh(functions);
    }
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
    return expr.replace(/ /g,"").toLowerCase();
}

function deleteFunction(id){
    console.log(id);
    $("#label-func-"+id).remove();
    functions = functions.filter(function( obj ) {
        return obj.id !== id;
    });
    myInstance.refresh(functions);
}

var currentChar = 'e';

function add(){
    try {
        var formula = parseExpression(document.getElementById("formula").value);
        if(formula.length == 0)
            throw 1;
        document.getElementById("formula").value = "";
        $("#functions-list").append("<tr><td>" + currentChar + "(x) = " + formula + "</td>" +
            "<td><a href=\"#\" class=\"btn btn-danger btn-xs\" id=\"removeFunction\"><span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\"></span></a></td></tr>");
        refreshFunctionName();
    }catch(err) {
        $("#wrong-input").html("Expresia introdusa nu este valida :/").show();
    }
}

$(document).ready(function() {
    $("#wrong-input").hide();
    refreshFunctionName();
    $("#removeFunction").click(function(){
       $(this).parent().parent().remove();
    });
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
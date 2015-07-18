var name;
var corectAnswers = [];
var quizAnswers = [];
var boxId = 0;

function makeQuestion(titleText,value,numberText,corect){
	var qId = numberText-1;
	var question = document.createElement("div");
	question.id = "question_"+qId;
	var quiz = document.getElementById("quiz");
	quiz.appendChild(question);	

	var qHeader = document.createElement("div");
	qHeader.className = "row";
	qHeader.id = "qHedaer";
	question.appendChild(qHeader);

	var qNumber  = document.createElement("h3");
	qNumber.appendChild(document.createTextNode("Question "+numberText));
	qNumber.className = "title";
	qNumber.id = "qNumber";
	qHeader.appendChild(qNumber);
	//QUESTION APPEND
	var answer = document.createElement("div");
	answer.className = "answer";
	qHeader.appendChild(answer);

	var icon = document.createElement("span");
	icon.className = "glyphicon glyphicon-remove";
	answer.appendChild(icon);
	
	var contant = document.createElement("div");
	contant.className = "contant";
	question.appendChild(contant);


	var row = document.createElement("div");
	row.className = "row";
	var qTitle = document.createElement("div");
	var test = document.createTextNode(titleText);
	qTitle.appendChild(test);
	qTitle.className = "text";
	row.appendChild(qTitle);

	contant.appendChild(row);
	quizAnswers[numberText-1] = [];
	corectAnswers[numberText-1] = corect;

	var nr = 1;
	var variants = document.createElement("div");
	variants.id = "qVariants";

	for(i in value){
		var div = document.createElement("div");
		div.id = "qAnswer";
		div.className = "row";
		var box = document.createElement('input');
		box.type = "checkbox";
		box.className = "css-checkbox";
		box.name = "check";
		box.value = nr;
		box.class = numberText-1;
		box.id = boxId;
		box.addEventListener('click', function(event){
	        if(!!event.target.checked == true){
	        	quizAnswers[event.target.class].push(event.target.value);
	        }
	        if(!!event.target.checked == false){
	        	quizAnswers[event.target.class] = arr_diff(quizAnswers[event.target.class],event.target.value);
	        }
		}, true);

		var label = document.createElement('label');
		label.appendChild(document.createTextNode(value[i]));
		label.htmlFor = box.id;
		label.className = "css-label";
		div.appendChild(box);
		div.appendChild(label);
		contant.appendChild(div); 
		boxId++;
		nr++;
	} 
}

function displayTest(quiz){
	$.ajax({
		url:quiz,
		dataType:"json",
		type:"get",
		cache:false,
		success: function(data){
			var header = document.getElementById("headerTitle");
			header.innerHTML = "Quiz nr."+quiz.substring(4,5);
			$(data.quiz).each(function(index,value){
				makeQuestion(value.title,value.variants,index+1,value.answer);	
			});
		}
	});
}

function setDefault(){
	console.log("default");
	name = "";
}

function startTest(names){	
	name = names;
}
displayTest(name);	

function iconPlacement(id,answer){
	var q = document.getElementById("question_"+id);
	var q1 = q.childNodes[0].childNodes[1].childNodes[0];
	if(answer){
		q1.className = "glyphicon glyphicon-ok";
	}else
	{
		q1.className = "glyphicon glyphicon-remove";
	}
}


function results()
{
	var i = 0;
	var marck = 0;
	$.ajax({
		url:name,
		dataType:"json",
		type:"get",
		cache:false,
		success: function(data){
			var score = 0;
			$(data.quiz).each(function(index,value){
				if(arr_diff(quizAnswers[i],value.answer) == 0){
					score++;
					iconPlacement(i,true);
				}else
				{
					iconPlacement(i,false);
				}
				i++;	
			});
			//console.log(score);
		}
	});	
}

function arr_diff(a1, a2){
  var a=[], diff=[];
  for(var i=0;i<a1.length;i++)
    a[a1[i]]=true;
  for(var i=0;i<a2.length;i++)
    if(a[a2[i]]) delete a[a2[i]];
    else a[a2[i]]=true;
  for(var k in a)
    diff.push(k);
  return diff;
}

function arr_intersect(a, b) {
    var d1 = {};
    var d2 = {};
    var results = [];
    for (var i = 0; i < a.length; i++) {
        d1[a[i]] = true;
    }
    for (var j = 0; j < b.length; j++) {
        d2[b[j]] = true;
    }
    for (var k in d1) {
        if (d2[k]) 
            results.push(k);
    }
    return results;
}



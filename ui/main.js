console.log('Loaded!');

var button = document.getElementById('counter');



window.onload = function(){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                    //Increment the view count
                    var count = request.responseText;
                    var span = document.getElementById('count');
                    span.innerHTML = count.toString();
            }
        }
    };
    request.open('GET', "/counter", true);
    request.send(null);   
};

var submit = document.getElementById('submit');
var ul = document.getElementById('namelist');
var names = [];

submit.onclick = function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                    //Increment the view count
                        var nameJSON = request.responseText;
                        var names = JSON.parse(nameJSON);
                        var list = "";
                        for(var i = 0; i<names.length; i++){
                            list += '<li>' + names[i] + '</li>';
                        }
                        
                        ul.innerHTML = list;
                    
            }
        }
    };
    //Requesting the name
    var name_input = document.getElementById('name');
    var name = name_input.value;
    console.log(name);
    request.open('GET', "http://balaramanmuthupandi.imad.hasura-app.io/submit?name="+name, true);
    request.send(null);
};

window.onclick = function(){
        var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                    //Increment the view count
                        var nameJSON = request.responseText;
                        var names = JSON.parse(nameJSON);
                        var list = "";
                        for(var i = 0; i<names.length; i++){
                            list += '<li>' + names[i] + '</li>';
                        }
                        
                        ul.innerHTML = list;
                    
            }
        }
    };
    //Requesting the name
    var name_input = document.getElementById('name');
    var name = name_input.value;
    console.log(name);
    request.open('GET', "http://balaramanmuthupandi.imad.hasura-app.io/submit?name="+name, true);
    request.send(null);
}
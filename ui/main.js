console.log('Loaded!');

var button = document.getElementById('counter');

var request = new XMLHttpRequest();

window.onload = function(){
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

submit.onclick = function(){
    var names = ['name1', 'name2', 'name3'];
    var list = "";
    for(var i = 0; i<names.length; i++){
        list += '<li>' + names[i] + </li>
    }
    
    ul.innerHTML = list;
};
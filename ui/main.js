console.log('Loaded!');

var button = document.getElementById('counter');
var span = document.getElementById('count');
var count = 0;

button.onclick = function(){
    count = count+1;
    span.innerHtml = count.toString();
}

console.log('Loaded!');

var button = document.getElementById('counter');
var count = 0;

button.onclick = function(){
    count = count+1;
    var span = document.getElementById('count');
    span.innerHtml = count.toString();
}

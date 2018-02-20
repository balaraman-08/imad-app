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
                    console.log(count);
            }
        }
    };
    request.open('GET', "/counter", true);
    request.send(null);   
};

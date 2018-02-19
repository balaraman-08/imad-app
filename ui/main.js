console.log('Loaded!');

var button = document.getElementById('counter');

button.onclick = function(){
    
    //Create the http request
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function(){
        if(requestraedystate === XMLHttpRequest.DONE){
            if(request.status === 200){
                    //Increment the view count
                    var count = request.responseText;
                    var span = document.getElementById('count');
                    span.innerHTML = count.toString();
                    console.log(count);
            }
        }
    }
    
    //Make the request
    request.open('GET', "http://balaramanmuthupandi.imad.hasura-app.io/", true);
    request.send(null);
}

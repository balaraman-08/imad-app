console.log('Loaded!');


var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                    
            }
        }
    };
    //Requesting the name
    var username = document.getElementById('username');
    
    request.open('GET', "http://balaramanmuthupandi.imad.hasura-app.io/login", true);
    request.send(null);
};

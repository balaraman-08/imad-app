console.log('Loaded!');


var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                alert('Login successfully');
            }
            else if(request.status === 403){
                alert('Username/password is incorrect');
            }
            else if(request.status === 500){
                alert('Something went wrong with server');
            }
        }
    };
    
    //Requesting the name
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    
    request.open('GET', "http://balaramanmuthupandi.imad.hasura-app.io/login", true);
    request.setRequestHeader('Content-Type', "application/json");
    request.send(JSON.stringify({username: username, password: password}));
};

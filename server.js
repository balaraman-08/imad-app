var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'balaramanmuthupandi',
    database: 'balaramanmuthupandi',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: 'db-balaramanmuthupandi-29892'
    
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session ({
    secret: 'SomeValue', 
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate(data) {

  var title = data.title;
  var heading  = data.heading;
  var content = data.content;

  var template = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

          <link href="/ui/style.css" rel="stylesheet" />

    </head>
    <body class = "container">

        <hr/>

        <div><a href="/">Home</a></div>

        <hr/>

      <div>
        <h3>${heading}</h3>
      </div>

      <div>
      ${content}
      </div>

    </body>
  </html>
`;

return template;

}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db', function(req, res){
    //querying the data
    pool.query('SELECT * FROM "user" where id = 1', function(err, result){
        if (err){
            res.status(500).send(err.toString());
        }
        else {
            res.send(JSON.stringify(result.rows[0].name));
        }
    });
});

//Hashing

function hash(input, salt){
    var hashedString = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2S", "10000", salt, hashedString.toString('hex')].join('$');
}

app.get('/hash/:password', function(req, res){
   var hashedPassword = hash(req.params.password, "Empty string");
   res.send(hashedPassword);
});

//Creating user with password
app.post('/create-user', function(req, res){
  var name = req.body.username;
  var password = req.body.password;
  
  var salt = crypto.randomBytes(128).toString('hex');
  var dbString = hash(password, salt);
  pool.query('INSERT INTO "user2" (username, password) VALUES ($1, $2)', [name, dbString], function(err, result){
      if(err){
          res.status(500).send(err.toString());
      }
      else{
          res.send("User created successfully: " + name);
      }
  });
   
});

app.post('/login', function(req, res){
    var name = req.body.username;
    var password = req.body.password;

    pool.query('SELECT * FROM "user2" WHERE username = $1', [name], function(err, result){
      if(err){
          console.log("Error");
          res.status(500).send(err.toString());
      }
      else{
          if (result.rows.length === 0){
              console.log("Not found");
              res.status(403).send("Username or password is incorrect");
          }
          else{
              //Matching the password
              console.log("Pass match");
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); //Cresting hash based password given at login time
              if(hashedPassword === dbString){
                  //Setting session
                  req.session.auth = {userId:  result.rows[0].id};
                  res.send("Login successful");
                  console.log('Logged in');
              }
              else{
                  console.log("Problem");
                  res.status(403).send("Username or password is incorrect");
              }
          }
          res.send("User created successfully: " + name);
      }
  });
});

//Checking session
app.get('/check-login', function(req, res){
   if (req.session && req.session.auth && req.session.auth.userId){
       res.send("Logged in" + req.session.auth.userId.toString());
   } 
   else{
       res.send("You're logged out");
   }
});

//Log out
app.get('/logout', function(req, res){
   delete req.session.auth;
   res.send("Logged out");
});

app.get('/articles/:articleName', function(req, res){
    console.log(req.params.articleName);
    pool.query('SELECT * FROM article WHERE title = $1', [req.params.articleName], function(err, result){
        if (err){
            console.log(req.params.articleName + "error");
            res.status(500).send(err.toString());
        }
        else{
            if (result.rows === 0){
                console.log(req.params.articleName + "not found error");
                res.status(404).send('Article not found');
            }
            else{
                var articledata = result.rows[0];
                res.send(createTemplate(articledata));
                console.log(req.params.articleName + "success");
            }
        }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


app.get('/ui/main.js', function(req, res){
   res.sendFile(path.join(__dirname, 'ui', 'main.js')); 
});

app.get('/ui/bala.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bala.jpg'));
});



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

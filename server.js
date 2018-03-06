var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('bodyParser');

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
    return hashedString.toString('hex');
}

app.get('/hash/:password', function(req, res){
   var hashedPassword = hash(req.params.password, "Empty string");
   res.send(hashedPassword);
});

//Creating user with password
// app.post('/create-user', function(req, res){
//   var name = req.body.username;
//   var password = req.body.password;
//   var salt = crypto.RandomBytes(128).toString('hex');
//   var dbString = hash(password, salt);
//   pool.query('INSERT INTO "user2" (username, password) VALUES ($1, $2)', [name, dbString], function(err, result){
//       if(err){
//           res.status(500).send(err.toString);
//       }
//       else{
//           res.send("User created successfully: " + name);
//       }
//   });
   
// });

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

var count = 0;

app.get('/counter', function (req, res) {
    count = count+1;
    res.send(count.toString());
});


var names = [];

app.get('/submit', function(req, res){
   
   //Getting the name
   var name = req.query.name;
   names.push(name);
   
   //Respond with JSON
   res.send(JSON.stringify(names));
    
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

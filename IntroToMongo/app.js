
var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var path = require('path');

var flash = require('express-flash');
app.use(flash());

var session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 2},
  age: {type: Number, required: true, min: 18, max:150},
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

mongoose.connect('mongodb://localhost/intro_to_mongo', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public')));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    User.find({}, function(err, users){
        res.render("index.ejs", {users: users});
    });
});

app.post("/users", function(req, res){
    console.log("POST DATA", req.body);
    var user = new User({name: req.body.name, age: req.body.age});
    user.save(function(err){
      if (err){
        console.log('Something went wrong');
        for(var key in err.errors){
          req.flash('registiration', err.errors[key].message);
          console.log('error message');
        }
      }else{
        console.log('Succesfully added a user');
          res.redirect("/");
      }
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});

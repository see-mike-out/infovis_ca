let express = require('express');
let session = require('express-session');
let mongoose = require('mongoose');
let MongoStore = require('connect-mongo')(session);
let bodyParser = require('body-parser')
let User = require('./db_models/user');
let Sample = require('./db_models/sample');
let SubSample = require('./db_models/subsample');

mongoose.connect('mongodb://localhost/infovis_ca');

let app = express();

//global variables & methods

//ends

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//authentication
app.set('is_signed', false);
app.set('is_admin', false);
app.set('who_admin', '');
app.locals.is_admin = false;
app.locals.is_signed = false;
app.locals.who_signed = '';

//layout
let handlebars = require('express-handlebars').create({ 
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//port
app.set('port', process.env.PORT || 3000);

//env
app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

//routes
app.get('/', function(req, res) {
  // if (!app.get('is_signed')) {
  //   res.render('home');
  // } else {
    let data = [];
    Sample.find({}).sort({ order: 1 }).exec(function(err, doc){
      for (d in doc) {
        let copied_doc = doc[d];
        copied_doc['I_coded'] = false;
        for (c in copied_doc.is_coded) {
          if (c.coder == app.get('who_signed')) {
            copied_doc.I_coded = true;
          }
        }
        data.push(copied_doc);
      }
      
      res.render('list', {
        samples: data,
        count: 0
      });
    });
  // }
});

app.get('/signin', function(req, res) {
  let error;
  if (!app.get('is_signed')){
    if (Object.keys(req.session).indexOf('error') >= 0){
      error = req.session.error;
      delete req.session.error; 
    }
    res.render('signin', {
      error: error
    });
  } else {
    res.redirect('/');
  }
});

app.post('/signin_process', function(req, res) {
  req.session.userId;
  if (req.body.signin_id &&
    req.body.signin_password) {
      User.authenticate(req.body.signin_id, req.body.signin_password, function(e, r){ 
        if (e) {
          req.session.error = '이용자의 이름이나 비밀번호가 부정확합니다.';
          res.redirect('/signin');
        } else {
          req.session.signedId = r.signin_id;
          req.session.userId = r._id;
          if (r.is_admin){
            req.session.is_admin = r.is_admin;
          } else {
            req.session.is_admin = false;
          }
          app.set('is_admin', req.session.is_admin);
          app.set('is_signed', true);
          app.set('who_signed', req.session.signedId);
          app.locals.is_admin = req.session.is_admin;
          app.locals.is_signed = true;
          app.locals.who_signed = req.session.signedId;
          res.redirect('/');
        }
      });
  } else {
    req.session.error = '이용자의 이름이나 비밀번호가 부정확합니다.';
    res.redirect('/signin');
  }
});

app.get('/signout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        app.set('is_signed', false);
        app.set('is_admin', false);
        app.set('who_signed', '');
        app.locals.is_admin = false;
        app.locals.is_signed = false;
        app.locals.who_signed = '';
        return res.redirect('/');
      }
    });
  }
});

app.get('/signup', function(req, res) {
  if (app.get('is_admin')){
    res.render('signup');
  } else {
    res.redirect('/')
  }
});

app.post('/signup_process', function(req, res) {
  
  if (req.body.signin_id &&
    req.body.signin_password &&
    req.body.signin_password_conf &&
    req.body.signin_password == req.body.signin_password_conf
  ) {
    let is_for_admin = (req.body.is_admin_account ? true : false);
    let userData = {
      signin_id: req.body.signin_id,
      signin_password: req.body.signin_password,
      is_admin: is_for_admin
    }
    
    User.create(userData, function (err, user) {
      if (err) {
        console.log('pass?')
        res.redirect(303, '/signup');
      } else {
        return res.redirect('/signin');
      }
    });
  } else {
    res.redirect(303, '/signup');
  }
});

app.get('/code_ent/:name', function(req, res) {
  // if (!app.get('is_signed')) {
  //   res.render('home');
  // } else {
    Sample.find({name: req.params.name}).exec(function(err, doc){
      if (err) {
        res.redirect(303, '/');
      } else {
        let subviss = [];
        for (let i = 0; i < doc[0].subvis; i++) {
          subviss.push(doc[0].name+"-"+(i+1).toString());
        }
        res.render('code_ent', {
          title: doc[0].name,
          subvis: subviss,
          url: doc[0].url
        });
      }
    });
  // }
});

app.get('/code_ind/:name', function(req, res) {
  // if (!app.get('is_signed')) {
  //   res.render('home');
  // } else {
    SubSample.find({name: req.params.name}).exec(function(err, doc){
      if (err) {
        res.redirect(303, '/');
      } else {
        res.render('code_ind', {
          title: doc[0].name,
          parentVis: doc[0].parentVis,
          url: doc[0].url
        });
      }
    });
  // }
})

app.get('/about', function(req, res) {
  res.type('text/plain');
  res.send('About: Infovis Content Analysis App')
});

//static directories
app.use(express.static(__dirname + '/public'));
app.use('/bs', express.static(__dirname + '/node_modules/bootstrap/dist'));

//route error handling
app.use(function(req, res) { //404 error
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found')
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-c to terminate...');
});
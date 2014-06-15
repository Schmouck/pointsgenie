var router = require('koa-router');

var countController = require('../src/controllers/count');
var indexController = require('../src/controllers/index');
var authController = require('../src/controllers/auth');

var secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
};

module.exports = function (app, passport) {
  // register functions
  app.use(router(app));

  app.get('/login', authController.login);
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=1'
  }));

  app.get('/user/:cip/:password', authController.createUser);

  app.get('/', function *() {
    if (this.isAuthenticated()) {
      yield indexController.index.apply(this);
    } else {
      this.redirect('/login');
    }
  });

  // secured routes
  app.get('/value', secured, countController.getCount);
  app.get('/inc', secured, countController.increment);
  app.get('/dec', secured, countController.decrement);
};



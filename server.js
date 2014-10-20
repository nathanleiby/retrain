var random = require("random-js")(); // uses the nativeMath engine

(function() {
  // ******************************** //
  // Example Data
  var categories = ["Mammal", "Reptile", "Bird"];
  var messages = [
    {
      message: "Cat",
      classification: {
        "Mammal" : .6,
        "Reptile" : .5,
        "Bird" : .4
      }
    }, {
      message: "Dog",
      classification: {
        "Mammal" : .5,
        "Reptile" : .7,
        "Bird" : .1
      }
    }
  ]

  var get_message_to_classify = function() {
    var msgIndex = random.integer(0, messages.length-1);
    console.log(msgIndex);
    return messages[msgIndex];
  }
  // ******************************** //

  var app, express;
  express = require('express');

  app = module.exports = express.createServer();
  app.configure(function() {
    app.set('port', (process.env.PORT || 5000));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', function(req, res) {
    return res.render('annotate', {
      title: 'Retrain',
      layout: false,
      locals: {
        message_to_classify: get_message_to_classify(),
        categories: categories
      }
    });
  });

  // API responsible for outputting message to classify or saving
  // a message that has been approved / recategorized by the user
  app.get('/api/message/get', function(req, res) {
    res.json(get_message_to_classify());
  });

  // app.post('/api/message/save', function(req, res) {
  //   //TODO: This will save user's reclassified data
  // });
  app.listen(process.env.PORT || 5000);

}).call(this);

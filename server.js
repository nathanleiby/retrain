var random = require("random-js")(); // uses the nativeMath engine
var quest = require("quest");
var CLASSIFIER_URL = process.env.CLASSIFIER_URL;
var util = require('util');
var urlencode = require('urlencode');


// ******************************** //
// TODO: Examples
// These methods and data must be adapted based on the
// actual classifier's API

var categories = ["Mammal", "Reptile", "Bird"];
var messages = [
  "Wild cats are best at their most feral",
  "Dogs are superior for the droopy ears",
]
var getMessageToClassify = function() {
  var msgIndex = random.integer(0, messages.length-1);
  return { "text" : messages[msgIndex] }
}

// Expected format of a classification return from current Python classifier
//              category    confidence      text
//  { "data": [ "X30", 0.29850746268656714, "WhatIsThe" ] }
//
var formatClassifierOutput = function(body) {
  var jsonBody = JSON.parse(body);
  var formatted = {
    "text": jsonBody['data'][2], // should be identical to msg
    "category": jsonBody['data'][0],
    "confidence": jsonBody['data'][1]
  };
  return formatted;
};
// ******************************** //

// Takes a message and returns it with a category label and confidence
// returns:
//  { "text" : "message_text", "category": "A12", "confidence" : 0.15 }
var classify = function(msg, cb) {
  console.log("classifying:", util.inspect(msg));
  var message_text = msg['text'];
  var full_url = CLASSIFIER_URL + urlencode(message_text);
  console.log("full_url:", full_url)
  quest(full_url, function(err, response, body) {
    if(err) {
      return cb(err);
    } else {
      var classifier_prediction = formatClassifierOutput(body);
      return cb(null, classifier_prediction);
    }
  });
};

(function() {

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
        categories: categories
      }
    });
  });

  // API responsible for outputting message to classify or saving
  // a message that has been approved / recategorized by the user
  app.get('/api/message', function(req, res) {
    // Gets a message that needs to be classified
    var message = getMessageToClassify();

    // Classifies that message
    classify(message, function(err, result) {
      console.log("Result", result);

      // If classifer fails, returns an error
      if (err) {
        res.status(400).send('Failed to get message')
      } else {
        // Return message with classifiation
        res.json(result);
      }
    });
  });

  // app.post('/api/message', function(req, res) {
  //   //TODO: This will save user's reclassified data
  // });
  app.listen(process.env.PORT || 5000);

}).call(this);

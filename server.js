var random = require("random-js")(); // uses the nativeMath engine
var request = require("quest");
var CLASSIFIER_URL = process.env.CLASSIFIER_URL;
var util = require('util');
var urlencode = require('urlencode');
var _ = require('underscore');
var fs = require('fs');

// ******************************** //
// TODO: Examples
// These methods and data must be adapted based on the
// actual classifier's API

var taxonomy = JSON.parse(fs.readFileSync('PCS_Subject_Taxonomy.json'));
top_level_keys = _.filter(_.keys(taxonomy), function(k) {
  return k.length == 1;
});
top_level_categories = _.pick(taxonomy, top_level_keys);

var categories = top_level_categories;
var messages = [
  "I'd like to teach the world to sing in perfect harmony. I'd like to hold it in my arms, and keep it company",
  "Lions and tigers and bears, oh my!",
  "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America",
]

// Hacky: maintain state of messages that we have already labeled.
// Maps from message text to human label.
var humanLabeledMessages = {};

// Expect to received a message pulled from the database that looks like:
// {
//   "activity_override3": "B20", // human label
//   "text": "This is a grant talking about something",
//   "amount": 50000,
//   "recipient_name": "etcetc",
//   "grant_year": 2007,
//   "gm_key": "etc",
//   "number_retrains": null,
//   "recipient_unit": "etcetc",
//   "recipient_key": 99987,
//   "grant_duration": 1.00,
//   "grant_key": 12345
// }
var getMessageToClassify = function(cb) {
  // var msgIndex = random.integer(0, messages.length-1);
  // return { "text" : messages[msgIndex] }

  // Get text to classify
  var get_text_options = {
    uri: CLASSIFIER_URL + "/text",
    method: "GET"
  }
  request(get_text_options, function(err, response, body) {
    if(err) {
      return cb(err);
    } else {
      var json_body = JSON.parse(body);
      var message_text = json_body['text'];
      return cb(null, message_text);
    }
  });
}

// Expected format of a classification return from current Python classifier
//  {"svm": [{"category": "X20", "confidence": 0.11, "rank" : 0, {"category": "X21", "confidence": 0.11, "rank": 1}, {"category": "T70", "confidence": 0.11, "rank": 2}, {"category": "P27", "confidence": 0.11, "rank": 3}, {"category": "P60", "confidence": 0.11, "rank": 4}, {"category": "B82", "confidence": 0.11, "rank": 5}, {"category": "S99", "confidence": 0.11, "rank": 6}, {"category": "Q30", "confidence": 0.11, "rank": 7}, {"category": "C30", "confidence": 0.11, "rank": 8}, {"category": "M25", "confidence": 0.11, "rank": 9}]}
//
var formatClassifierOutput = function(body) {
  var jsonBody = JSON.parse(body);
  return jsonBody['svm'];
};
// ******************************** //

// Takes a message and returns it with a category label and confidence
// returns:
//  { "text" : "message_text", "category": "A12", "confidence" : 0.15 }
var classify = function(message_text, cb) {
  console.log("classify()", message_text);
  var post_classify_options = {
    uri: CLASSIFIER_URL + "/classify",
    method: "POST",
    body: JSON.stringify({
      "text": message_text,
      "npredict": '10'
    }),
    headers: {'Content-Type': 'application/json'},
    // TODO: prefer to use json: true but accepted as JSON by flask server
  };

  request(post_classify_options, function(err, response, body) {
    if(err) {
      return cb(err);
    } else {
      var classifier_prediction = formatClassifierOutput(body);
      // Allow displaying a label applied by human annotators
      var human_label = null;
      if(humanLabeledMessages[message_text] !== undefined) {
        human_label = humanLabeledMessages[message_text];
      }
      classifier_prediction['human_labelled_category'] = human_label;
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
    console.log("get message");
    // Gets a message that needs to be classified
    // TODO: Async waterfall
    getMessageToClassify(function(err, message_text){
      if (err) {
        res.status(400).send('Failed to get message');
        return;
      }

      // Classifies that message
      console.log("classify message");
      classify(message_text, function(err, classifications) {
        var text_and_classifications = {
          'text' : message_text,
          'classifications' : classifications
        };

        // If classifer fails, returns an error
        if (err) {
          res.status(400).send('Failed to classify message')
          return;
        } else {
          // Return message with classifiation
          res.json(text_and_classifications);
          return;
        }
      });

    });
  });

  app.post('/api/message', function(req, res) {
    //TODO: This will save user's reclassified data
    console.log("server.js: POST to /api/message");
    var jsonBody = req.body;
    humanLabeledMessages[jsonBody['text']] = jsonBody['category'];
    res.status(200).send();
  });
  app.listen(process.env.PORT || 5000);

}).call(this);

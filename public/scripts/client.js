console.log("client.js!");


// Display current message in the UI
var _displayMessage = function(data) {
  // TODO: Set message ID in hidden field
  $("#messageText").text(data.text)
  $("#suggestedClassification").text(data.category + " : " + data.confidence);

  // TODO: update pre-selected item in the dropdown menu
  $("#messageText").text(data.text)
}

// Fetch message from api/message endpoint
var getMessage = function() {
  console.log( "GET api/message: fetching (new) text..." );
  $.get("api/message", function( data ) {
    console.log(data);
    _displayMessage(data);
  });
}

// `data` should include:
//  - id
//  - (text)
//  - classification
//  - (confidence = 1)
//  - (user who classified it)

var readMessageValuesFromUI = function() {

  // TODO: read message ID in hidden field
  // TODO: read message text (optional if ID exists)
  // TODO: read value from dropdown menu
  $("#messageText").text(data.text);
}
var postMessage = function(data) {
  $.post("api/message", data, function() {
    console.log( "POST api/message: saving a text classification..." );
  });
}

// On page ready...
$(function() {
  // Load first message
  getMessage();
  $('#container').show();

  // Setup listeners
  $('input.nextTask').click(function() {
    console.log("clicked save");
    getMessage();
  });

});


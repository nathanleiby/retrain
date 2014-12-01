// Display current message in the UI
var _displayMessage = function(data) {
  var text = data.text;
  var suggestions = data.classifications;

  // TODO: Set message ID in hidden field
  $("#messageText").text(data.text)

  // Display machine suggestion(s)
  var suggestedClassificationHtml = "";
  suggestedClassificationHtml += "<ol>";
  for (var i=0; i < suggestions.length; i++) {
    suggestedClassificationHtml += '<li>';
    suggestedClassificationHtml += suggestions[i].category;
    suggestedClassificationHtml += " (Confidence: " + suggestions[i].confidence + ")";
    suggestedClassificationHtml += '</li>';
  }
  suggestedClassificationHtml += "</ol>";
  $("#suggestedClassification").html(suggestedClassificationHtml);

  // Update pre-selected item in the dropdown menu to match most-likely machine suggestion
  var machine_suggestion = suggestions[0].category.substr(0,1); // First letter corresponds to a top_level category suggestion
  $( "#categorySelect" ).val(machine_suggestion)

  // Display human annotated category, if any
  // TODO: we don't return human label right now
  // var human_label = "";
  // if (data['human_labelled_category'] !== undefined && data['human_labelled_category'] !== null) {
  //   human_label = " (Manual label: " + data['human_labelled_category'] + ")";
  //   // Overwrite machine suggestion with human label
  //   $( "#categorySelect" ).val(data['human_labelled_category']);
  // }
  // $("#humanClassification").text(human_label);
}

// Fetch message from api/message endpoint
var getMessage = function() {
  console.log( "GET api/message: fetching (new) text..." );
  $.get("api/message", function( data ) {
    console.log("got message:", data);
    _displayMessage(data);
  });
}

// `data` should include:
//  - id
//  - (text)
//  - classification
//  - (confidence = 1)
//  - (user who classified it)

var _readMessageValuesFromUI = function() {
  // TODO: read message ID in hidden field
  // TODO: read message text (optional if ID exists)
  // TODO: read value from dropdown menu

  return {
    "text" : $("#messageText").text(),
    "category" : $( "#categorySelect" ).val(),
  };
}

var postMessage = function() {
  var data = _readMessageValuesFromUI();

  $.post("api/message", data, function() {
    console.log( "POST api/message: saving a text classification..." );
  }, "json");
}

// On page ready...
$(function() {
  // Load first message
  getMessage();
  $('#container').show();

  // Setup listeners
  $('input.nextTask').click(function() {
    console.log("clicked save");
    postMessage();
    getMessage();
  });

});


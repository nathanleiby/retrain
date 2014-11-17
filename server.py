"""
Server (API) for a "retrain-able" classifier.

Contains these abstractions, but requires user to implement

1. classifier - given text, outputs a label (possibly,
    with a confidence, or could be multiple labels/confidences)
2. text - list of strings to should be labeled
    by humans (generally, displaying suggested classifications
    that are the "best guess" by the classifier, but which may
    be confirmed or overriden by the user)
3. label - when a human provides a label to the text(2), where
    does this label get stored? (for example, it might be a
    database table mapping text_id to label_id)
4. train - given the input of new labeled data (confirmed by human
    annotator), how does the classifier retrain/improve itself?
    This might be a daily cronjob, or could be in response to
    every time newly labeled data arrives, depending on use case
    and performance of the re-training.
"""

from flask import Flask, request, json, current_app, jsonify
import json, datetime
import os

app = Flask(__name__)

@app.route('/classify', methods=['POST'])
def classify():
    """ POST with json body of {'text':'<your text>'}, returns a dict of classifications

    Example:

    $ curl -X POST -H "Content-Type: application/json" -d '{"text":"classify me!"}' localhost:9090/classify
    {
        ... // classification details
    }
    """
    j = request.get_json()
    print "post /classify", j
    c = _classify(j)
    if not c:
        return '', 400 # error
    return jsonify(**c)

def _classify(text=''):
    """ given text, returns a dict describing machine classifications.

    input: string
    output: dict (on success) or None (on error)

    For example, one might save properties such as

    {
        'svm' : {
            'category' : 'bob',
            'confidence' : .97
        },
        'svm_multiple' : {
            // etc -
        }
    }
    """
    # TODO: User implemented
    return None

@app.route('/text', methods=['GET'])
def text():
    # TODO: ALlow reading from wherever text is to be store """
    """ GET returns a json containing {'text' : '<your text>'}, to be labeled by a human """
    print "GET /text"
    text = _text()
    if not text:
        return '', 400 # error
    j = { 'text' : text }
    return jsonify(**j)

def _text():
    """ returns text to be labeled

    input: n/a
    output: string (on success) or None (on failure)
    """
    # TODO: User implemented
    return None

@app.route('/label', methods=['POST'])
def label():
    """ POST with json body, returns 200 if saved successfully

    For example, to save a text label using row ids from a database, one might write

    $ curl -X POST -H "Content-Type: application/json" -d '{"text_id":5,"label_id":19}' localhost:9090/label
    """
    j = request.get_json()
    print "POST /label", j
    if not _label(j):
        return '', 400 # error
    return ''

def _label(j={}):
    """ saves label and meta-data for text. returns True/False on success/failure.

    input: user-defined dict
    output: boolean (True on success) or None (on Failure)

    For example, one might save properties such as

    {
        // essential - mapping of text to label
        'text_id' : 5,
        'label_id' : 19,

        // optional - metadata
        'user_id' : foo,
        'timestamp' : bar,
        'model_version' : baz,
    }
    """
    # TODO: User implemented
    return None

########################################
## OPTIONAL - webhook for re-training
########################################

@app.route('/train')
def train(text = None):
    """ URL hook that initiates retraining of the classifier

    TODO: shouldn't be public - maybe this a hook is only accessible via SECRET_KEY?
    """
    if not _train():
        return '', 400
    return ''

def _train():
    """ (re)train the classifer given new labeled data

    input: n/a
    output: bool (on success) or None (on failure)
    In the _train() method, this process might look like:
        - run classifier(s) training method on all labeled data
        - output a pickle file of newly built classifer, with data in filename
        NOTE: It's probably better to do this in another process so as to not hit
        100 percent CPU in the API's process due to retraining.

    Externally, one might manage this via:
        - have a cronjob that runs daily and hits this hook to do the retraining
        - have a cronjob that runs daily (later, after retraining) and restarts the server.
            alternately use a unix utility like `inotifywait` in order to watch for file changes
            and restart... http://superuser.com/questions/181517/how-to-execute-a-command-whenever-a-file-changes
        - when the server restarts, make sure which will always read from the most recent
            classifier file (ideas: find most recent file. backup/overwrite old classifier.)
    """
    return None

if __name__ == '__main__':
    debug = os.environ.get('DEBUG', False)
    port = os.environ.get('PORT', 9090)

    app.run(host='0.0.0.0',port=port, debug=debug)

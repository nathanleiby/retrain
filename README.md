retrain
=======

Machine classifies, user gives feedback, then... retrain the machine!

## This app has two components:

1. "Human" Web UI  (`server.js`, Node)
    - UI that human annotator sees
    - communicates with API to fetch text (with suggested labels), and to write back human-added labels)
2. "Machine" Back-end (`server.py`, Python)
    - API 
    - classifier (loading, how to call it on text, exposing a simple JSON-like interface)
    - database interaction (fetch unlabeled text or save labels)

(These will likely be collapsed into one app for a simpler deploy.)

## Demo

1. "Human" WebUI - http://retrain.herokuapp.com/
2. "Machine" Backend - (not yet online)

## How to Run

### Locally

"Human" WebUI:

Make sure you have node installed, then `npm install` to get the dependencies. To run the app:

```
export CLASSIFIER_URL=<base_url_of_classifer> 
export PORT=5000 # optional, default is 5000
make start
```

"Machine" Backend:

First, install dependencies via `pip install -r requirements.txt`.

```
python server.py
```

### Deploying to Heroku

"Human" WebUI been tested on Heroku. Steps to [get started with Heroku and Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

"Machine" Backend is not yet on Heroku.

## Development

Running WebUI in Dev mode.

Recommend using [node-supervisor](https://github.com/isaacs/node-supervisor), which will auto restart the server on code changes, then running:

```
# export env vars, then start the server
supervisor -e 'js' server.js
```

Running Machine Backend in Dev mode.

```
DEBUG=True python server.py # server will automatically restart on changes
```

## Testing

Tests are run with Mocha.

```
make test
```


retrain
=======

Machine classifies, user gives feedback, then... retrain!

## Goal

The approach is to have a web app to do the training, and a few API endpoints 
that retrieve messages and user feedback.

Takes Text + Classification. Shows user the suggested classification. Allows user to correct the classification, saving this information in order to retrain the algorithm.

## Demo

- App - http://retrain.herokuapp.com/
- an API endpoint - http://retrain.herokuapp.com/api/message

## How to Run

### Locally

```
export CLASSIFIER_URL=<base_url_of_classifer> 
export PORT=5000 # optional, default is 5000
make start
```

### Deploying to Heroku

Has been tested on Heroku. Steps to [get started with Heroku and Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

## Development

Running server in Dev mode.

Recommend using [node-supervisor](https://github.com/isaacs/node-supervisor), which will auto restart the server on code changes, then running:

```
# export env vars, then start the server
supervisor -e 'js' server.js
```

## Testing

Tests are run with Mocha.

```
make test
```


retrain
=======

Machine classifies, user gives feedback, then... retrain!

## Goal

Takes Text + Classification. Shows user the suggested classification. Allows user to correct the classification, saving this information in order to retrain the algorithm.

The approach is to have a web app to do the training, and a few API endpoints 
that retrieve messages and user feedback.

## How to Run

### Locally

```
export CLASSIFIER_URL=<base_url_of_classifer>
make start
```

### Deploying to Heroku

Has been tested on Heroku. Steps to [get started with Heroku and Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

## Development

Running server in Dev mode.

Recommend using [node-supervisor](https://github.com/isaacs/node-supervisor), which will auto restart the server on code changes, then running:

```
CLASSIFIER_URL=x supervisor -e 'js|node|coffee' server.js
```

## Testing

Tests are run with Mocha.

```
make test
```


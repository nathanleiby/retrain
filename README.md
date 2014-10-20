retrain
=======

Machine classifies, user gives feedback, then... retrain

Goal

Takes Text + Classification. Shows user the suggested classification. Allows user to correct the classification, saving this information in order to retrain the algorithm.

The approach is to have a web app to do the training, and a few API endpoints that retrieve messages and user feedback.

API

- /api/message (GET)
- /api/message (POST)

Example:

- classify based on mammal - 0-1, reptile 0-1, bird 0-1
- for various input messages, classifier has following behavior 
- input: chicken -> mammal 0, reptile .5, bird .75 … guess is bird [OK]
- input: cat -> mammal .5, reptile .75, bird .6 … guess is reptile [Wrong]
- so now, we want to reclassify cat as mammal
    - will need to be able to save back updated scores (mammal 1, reptile 0, bird 0)

TBD:

- How to tell it you’re “retraining” a row? Need to have “machine" and “user” response… in case where machine response == user response, then the retraining is a no-op

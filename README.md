# TriviaQuest

Group Project 1

## Game Overview
Trivia Quest will be a multiplayer trivia game, with each round consisting of 10 multiple questions. Major points for the game:
- Each question will be timed.
- Each right answer will give points, and when the answer is correct, the player will get bonus points for their speed to answer.
- At the end of each round, a winner will be displayed with a gif.
- There will be a scoreboard tracking all scores

## Target Audience
Anyone who likes to play Trivia games and display their scores to their friends (show off).

## Problems to address
Allowing multiple people to play the same game without having to leave their house and go to a bar for Trivia Night. 

## Primary Goal
Allow people across multiple locations to play the same trivia game at the same time.

## Story Examples
- As a user, I want a place to log into and play a trivia game against other, remote, players.
- As a user, while playing, I want to see a running list of scores for the other players.
- As a user, I want to be able to use FB to log into the game and come back later to the same score.

## Under the hood
- Multiplayer. Up to 10 players per round
- Question count: 10
- Timer per question
- Random Category (display on page once selected)
- On answer click: Note if the selection is correct/incorrect, but nothing else, do not display correct answer. This allows for repeatability
- User Auth: FB
- Pulling questions from Trivia API
- Point System (possibly based on time/order/moment.js)
- UI: This where all scores are placed
- Display Name - Do not allow numbers
- Display FB Avatar
- Use Firebase to keep track of scores/players
- Chat integrated with Firebase

## If time allows
- Vote for next Category
- Level: Top 3 players do a sudden death
- Send Invite to other players
- Waiting room if the game is in progress
- Store key for future games
- Background changes by IP address
- Text to Speech button (Google API?), build so text readers read the questions and answers, then the player answers with 1-4


## APIs
Text-to-Speech: https://cloud.google.com/speech-to-text/?gclid=Cj0KCQiAn4PkBRCDARIsAGHmH3cCkX6ErgDlJPIDQGRdDK395U8tZ2LqJIeO3boru2LIxL3ITnQmmlwaAvOcEALw_wcB
Option: Text to Speech: https://responsivevoice.org/

Trivia Questions: https://opentdb.com/api_config.php

FB Auth: https://auth0.com/docs/connections/social/facebook

Date API: https://date-fns.org/

## Work Distribution

Damon:
UI
Styling
Text Chat Integration (w/Firebase)

Mohsen:
Text-to-Speech
Facebook Authentication

Parker:
Trivia Question Logic

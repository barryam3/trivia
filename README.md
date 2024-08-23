# Trivia

by Barry McNamara (barryam3@alum.mit.edu)

## About

This app is designed as a tool to play Jeopardy-style trivia games in real
life. It displays questions and tracks scores, but it is not intended to be
an online game in itself.

## Running the App

1. clone the repo
2. install dependencies (`npm i`)
3. `npm run build`
4. `npm start`
5. app should be live at `localhost:8080`

## Using the App

_Disclaimer: This app was created solely for personal use by its creator. Ease
of use has occasionally been sacrificed in favor of ease of implementation,
leading to some things being less intuitive than they would be if this app had
been designed with distribution in mind. The app also may have bugs, like any
application you download from the internet._

1. Head to `localhost:8080/init` to create a game. Uid is a unique identifier
   for your game which will be used in the url. Contestant names is a list of names
   separated by commas. For the other three boxes, copy in the text from the files
   in the folder `q_and_a` (or pass in your own text in the same format--open the
   file in Excel and edit it).
2. Load the pages `localhost:8080/game/{uid}/board?leader=true` and
   `localhost:8080/game/{uid}/board?leader=false` replacing `{uid}` with the
   uid you chose. The leader page allows you to click between questions and
   change the display. The follower page automatically updates based on the
   actions taken in the leader.

## Fonts

This app is intended to be used with the Korinna font. However, the font is not
included as I do not have the right to distribute it. Backup fonts are defined
in case you do not have the font installed.

## Random Features

This app automatically randomizes the locations of the daily doubles
(universally at random, even though in the TV show the probability distribution
isn't even). To simulate time, the game also randomly skips the last n questions
asked in a round, with the probability of skipping n questions being roughly
1/2^(n+1). This wouldn't be too hard to disable if you don't like it.

## About the Questions

Questions are included for demonstration purposes. These questions were written
by myself (Barry McNamara) for a trivia game I ran with some friends using this
app, which went rather well. They are fairly general and high-quality (if I do
say so myself), but I make no guarantees that they are now or will remain
accurate. Feel free to use this app and my questions for whatever you like,
just credit me. If you have a good time, I'd love to hear about it.

## Development

Use `npm run dev` to host the app at `localhost:3000` with live updating when you edit the frontend.

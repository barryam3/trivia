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
5. app should be live at `localhost:3000`

## Using the App

_Disclaimer: This app was created solely for personal use by its creator. Ease
of use has occasionally been sacrificed in favor of ease of implementation,
leading to some things being less intuitive than they would be if this app had
been designed with distribution in mind. The app also may have bugs, like any
application you download from the internet._

1. Head to `localhost:3000/init` to create a game. Uid is a unique identifier
   for your game which will be used in the url. Contestant names is a list of names
   separated by commas. For the other three boxes, copy in the text from the files
   in the folder `q_and_a` (or pass in your own text in the same format--open the
   file in Excel and edit it).
2. The pages `localhost:3000/game/{uid}/1?leader=true` and
   `localhost:3000/game/{uid}/1` will automatically open replacing the `{uid}`
   with the uid you chose. The leader page allows you to click between
   questions and change the display. The follower page automatically updates
   based on the actions taken in the leader.

## Input Format

The expected format for the Jeopardy and Double Jeopardy rounds is a CSV file.

```
Category1,Category2
Cat1Question1,Cat2Question2
Cat1Answer1,Cat2Answer1
```

### Daily Doubles

Daily Doubles are questions prefixed by `[DD]: `.

### Media

Links to image, audio, and video files are automatically detected by their
file extensions. These create multi-part questions, where text is displayed
before and/or after the media.

### Teams

An optional list of teams can be given. If given, contestants are divided into
teams.

**At this time, only two-team games are supported.** The first half of
contestants (rounded up) are on the first team, and the second half (rounded
down) are on the second team. Contestant scores are tracked individually but
rolled up into a team score.

**At this time, team games do not support the Jeopardy! board.** Instead,
questions are presented in order, asking all questions in a category in order,
then moving on to the next category.

## Fonts

This app is intended to be used with the Korinna and "Swiss 921 BT" fonts.
However, the font is not included as I do not have the right to distribute
it. Backup fonts are defined in case you do not have the font installed.

## Buzzers

This application supports a serial connection to an external lockout buzzer
system. 

I use a pair of Rolls GS76RL Game Show Buzzer System units connected to an
Arduino Mega via DB9 to DuPont cables. The Arduino runs a very simple program
that just reports when GPIO pin states change. See
[my Arduino Real All GPIO Pins gist](https://gist.github.com/barryam3/8d584e33b63830d70d650c0be64dbf01)
for the code I'm using on the Arduino. I'm using pins 38-52 (even) for
contestants 1-8 and pins 39-53 (odd) for contestants 9-16, but this is
configurable on the `/config` page. In theory you could connect any serial
device that sends the same JSON messages.

Once you have everything wired up, click the button in the top right of the
screen on the host view to connect. If everything is set up properly, the app
will show which contestant is buzzed in.

## About the Questions

Questions are included for demonstration purposes. These questions were written
by myself (Barry McNamara) for a trivia game I ran with some friends using this
app, which went rather well. They are fairly general and high-quality (if I do
say so myself), but I make no guarantees that they are now or will remain
accurate. Feel free to use this app and my questions for whatever you like,
just credit me. If you have a good time, I'd love to hear about it.

Jeopardy on TV is a game of Answers and Questions i.e. the host says "The first
USn President" and the contestant says "Who's Washington?" This app uses
Questions and Answers terminology i.e. the strings called questions are
displayed before the strings called answers. But there's no restrictions on the
text, just "The first US President" would be the "question" and "Who's
Washington" would be the "answer."

## Development

Use `npm run dev` to host the app at `localhost:3000` with live updating when you edit the frontend.

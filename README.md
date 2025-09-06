# Trivia

by Barry McNamara (barryam3@alum.mit.edu)

## About

This app is designed as a tool to play Jeopardy-style trivia games in real
life. It displays questions and tracks scores, but it is not intended to be
an online game in itself.

## Running the App

The app is hosted at [trivia.barryam3.com](https://trivia.barryam3.com).

To build and run it yourself:

1. clone the repo
2. install dependencies (`npm i`)
3. `npm run build`
4. `npm start`

## Using the App

_Disclaimer: This app was created solely for personal use by its creator. Ease
of use has occasionally been sacrificed in favor of ease of implementation,
leading to some things being less intuitive than they would be if this app had
been designed with distribution in mind. The app also may have bugs, like any
application you download from the internet._

### Creating a game

Head to [trivia.barryam3.com/init](https://trivia.barryam3.com/init) to create a game.

#### Game Configuration Fields

When creating a new game, you'll need to fill out the following fields:

##### **uid** (Required)
A unique identifier for your game that will be used in the URL. This should be a short, memorable string (e.g., "mygame2024", "trivia-night"). The game will be accessible at `/game/{uid}`.

##### **Game Title** (Default: "Jeopardy!")
The display name for your trivia game. This appears at the top of the game interface and helps identify the game.

##### **Contestant Names .csv**
A comma-separated list of contestant names (e.g., "Alice,Bob,Charlie,Diana"). These names will appear on the scoreboard and be used for buzzer identification if you have a physical buzzer system connected.

##### **Teams .csv** (Optional)
A comma-separated list of team names (e.g., "Team A, Team B"). If provided, contestants will be automatically divided into teams:
- The first half of contestants (rounded up) are assigned to the first team
- The second half (rounded down) are assigned to the second team
- Individual scores are tracked but rolled up into team scores
- **Note:** Only two teams are supported.

##### **Single Jeopardy .csv**
The questions and answers for the first round. Copy the content from `q_and_a/single.csv` or create your own in the same format. See the [Input Format](#input-format) section for details on the expected CSV structure.

##### **Double Jeopardy .csv**
The questions and answers for the second round. Copy the content from `q_and_a/double.csv` or create your own in the same format. Questions in this round are typically worth double the points of Single Jeopardy questions.

##### **Final Jeopardy .txt**
The final question for the game. Copy the content from `q_and_a/final.txt` or create your own. This is typically a single, challenging question that all contestants answer simultaneously.

##### **Auto-advance (do not show board between questions)**
When checked, the game will automatically advance to the next question without showing the game board between questions. This creates a more streamlined experience but removes the traditional Jeopardy board navigation.

##### **Enable Dynamic Scores (show only buzzed-in scores)**
When enabled, only the scores of contestants who have buzzed in will be displayed during question answering. This creates a more focused view and can reduce visual clutter during gameplay.

##### **Penalties**
Controls how incorrect answers are penalized:
- **Scaling**: Penalty amount scales with question value (traditional Jeopardy style)
- **Flat**: Fixed penalty amount regardless of question value, equal to the lowest question value.

##### **Score Unit**
Determines the currency/unit displayed with scores:
- **Dollars ($)**: Traditional Jeopardy format with dollar signs
- **Points**: Simple point-based scoring without currency symbols

##### **Scorekeeping Webhook** (Optional)
A webhook URL for external score tracking. If provided, score updates will be sent to this endpoint, allowing integration with external systems or databases.

**Webhook Request Format:**
The webhook receives POST requests with `Content-Type: text/plain;charset=utf-8` containing a JSON array of score updates. Each score update has the following structure:

```json
[
  {
    "contestant": "Alice",
    "round": "mygame2024",
    "category": 3,
    "question": 2,
    "correct": true,
    "score": 400
  }
]
```

**Field Descriptions:**
- `contestant`: Name of the contestant who answered
- `round`: The game UID (not the round number)
- `category`: Category number (continues across rounds - Single Jeopardy categories are 0-5, Double Jeopardy categories are 6-11)
- `question`: Question number (1-indexed, unlike the internal 0-indexed system)
- `correct`: Boolean indicating if the answer was correct
- `score`: Point change (positive for correct, negative for incorrect)

**Important Notes:**
- Failed webhook requests are queued and retried on the next score update
- The webhook ignores the traditional Single/Double Jeopardy round distinction
  - Instead, category numbers are continuous across all rounds
- Questions are 1-indexed in webhook data (but 0-indexed internally)

##### **Lowest question value**
Sets the base point value for the easiest questions (typically the top row). All other question values are calculated as multiples of this value. For example, with a multiplier of 200:
- Row 1: 200 points
- Row 2: 400 points  
- Row 3: 600 points
- Row 4: 800 points
- Row 5: 1000 points

After creating a game, the pages `localhost:3000/game/{uid}/1?leader=true` and
`localhost:3000/game/{uid}/1` will automatically open replacing the `{uid}`
with the uid you chose. The leader page allows you to click between
questions and change the display. The follower page automatically updates
based on the actions taken in the leader.

#### Input Format

The expected format for the Jeopardy and Double Jeopardy rounds is a CSV file.

```
Category1,Category2
Cat1Question1,Cat2Question2
Cat1Answer1,Cat2Answer1
```

##### Daily Doubles

Daily Doubles are questions prefixed by `[DD]: `.

##### Media

Links to image, audio, and video files are automatically detected by their
file extensions. These create multi-part questions, where text is displayed
before and/or after the media.

##### Teams

An optional list of teams can be given. If given, contestants are divided into
teams.

**At this time, only two-team games are supported.** The first half of
contestants (rounded up) are on the first team, and the second half (rounded
down) are on the second team. Contestant scores are tracked individually but
rolled up into a team score.

### Running a game

The app has two views: a "leader" view can always see the question answer, and has
controls for advancing through questions and scorekeeping. The other follower view
progressively reveals the question, then the answer.

Controls on the leader view are done via buttons. You can also press spacebar to
advance the question.

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

The app is treated as the source of truth for the game, not the buzzer system.
Therefore, contestants cannot buzz in until you dismiss buzzes in the app i.e.
there is no name on the screen. If the buzzer system reports another buzz while
the app still has someone buzzed in, the new contestant name will appear in red,
indicating they were out of turn.

When [Buzzers](#buzzers) are enabled, you can use the following additional hotkeys:
- R = buzzed-in contestant is right (reveal answer and add points, then dismiss buzzes)
- W = buzzed-in contestant is wrong (dismiss their buzz and subtract points)
- D = dismiss buzzes once buzzer system resets
- X = force-dismiss buzzes (in case of de-synchronization)

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

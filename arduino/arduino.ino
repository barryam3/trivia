// Trivia buzzer state transmitter for Arduino Mega 2560.
//
// The browser expects a fixed-width, newline-delimited ASCII frame. Character
// i represents digital pin i: '0' is LOW/active and '1' is HIGH/inactive.
// Pins 0 and 1 are reserved for the USB serial connection and are represented
// by constant '1' placeholders so the character indexes match pin numbers.

static const unsigned long BAUD_RATE = 115200;
static const unsigned long HEARTBEAT_INTERVAL_MS = 1000;
static const uint8_t FIRST_READABLE_PIN = 2;

static int previousStates[NUM_DIGITAL_PINS];
static unsigned long lastSnapshotAt = 0;

void printSnapshot() {
  for (uint8_t pin = 0; pin < NUM_DIGITAL_PINS; pin++) {
    int state = pin < FIRST_READABLE_PIN ? HIGH : digitalRead(pin);
    Serial.write(state == LOW ? '0' : '1');
    previousStates[pin] = state;
  }
  Serial.write('\n');
  lastSnapshotAt = millis();
}

bool readablePinChanged() {
  for (uint8_t pin = FIRST_READABLE_PIN; pin < NUM_DIGITAL_PINS; pin++) {
    if (digitalRead(pin) != previousStates[pin]) return true;
  }
  return false;
}

void setup() {
  Serial.begin(BAUD_RATE);

  // The buzzer inputs are active-low and use the Mega's internal pull-ups.
  for (uint8_t pin = FIRST_READABLE_PIN; pin < NUM_DIGITAL_PINS; pin++) {
    pinMode(pin, INPUT_PULLUP);
    previousStates[pin] = -1;
  }
  previousStates[0] = HIGH;
  previousStates[1] = HIGH;

  // Send the initial complete state immediately after startup.
  printSnapshot();
}

void loop() {
  if (
    readablePinChanged() ||
    millis() - lastSnapshotAt >= HEARTBEAT_INTERVAL_MS
  ) {
    printSnapshot();
  }
}

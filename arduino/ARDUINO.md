# Build and deploy the buzzer firmware

The sketch in this directory is for an Arduino Mega 2560 connected to the
buzzer system. It sends one complete pin-state frame per line over the Mega's
USB connection at 115200 baud. The application expects the character at index
`i` to represent digital pin `i`; `0` is active/low and `1` is inactive/high.

## Windows

While I use WSL for developing the app on Windows I found it easier to use
Windows directly to build and deploy the Arduino sketch.

### Prerequisites

Install the Windows build of Arduino CLI from the [official installation
page](https://arduino.github.io/arduino-cli/dev/installation/), then open a
new PowerShell window and run:

```powershell
arduino-cli core update-index
arduino-cli core install arduino:avr
```

### WSL usage

For a one-command deployment from the repository's WSL Bash terminal:

```sh
./arduino/deploy.sh
```

The script discovers the single Windows serial port, compiles this directory
for `arduino:avr:mega`, and uploads with verification. It assumes the Windows
CLI and the AVR core prerequisites above are already installed.


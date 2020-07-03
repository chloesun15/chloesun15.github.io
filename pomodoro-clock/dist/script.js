// create Presentational component
class Presentational extends React.Component {
  constructor(props) {
    super(props);

    // set state
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      display: "25:00",
      min: 25,
      sec: 0,
      newSession: true,
      on: false,
      type: "session" };


    this.handleReset = this.handleReset.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.timerOn = this.timerOn.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.handleBreak = this.handleBreak.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
  }

// clears any running clock, any audio, and resets to original state
  handleReset() {
    clearInterval(this.timerID);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    this.setState({ breakLength: 5, sessionLength: 25, min: 25, sec: 0, newSession: true, on: false, type: "session" }, () => {this.setDisplay();});
  }

// when a break begins, change type to break, update timer values, and then turn timer on
  handleBreak() {
    this.setState(state => ({ type: "break", min: state.breakLength, sec: 0 }), () => {this.timerOn();});
  }

  timerOn() {
    this.setDisplay();

    // clear any previous timer
    clearInterval(this.timerID);

    // calls function to decrease timer values every second
    // saves interval to a local component variable
    this.timerID = setInterval(() => {
      this.decrementTimer();
    }, 1000);
  }


  decrementTimer() {
    // gets current minutes and seconds
    var min = this.state.min;
    var sec = this.state.sec;

    // decrease seconds
    if (sec > 0) {
      sec--;
    } else {

    // if 00 seconds, then subtract a minute and set seconds to 59
      sec = 59;
      min--;
    }

    // update state with new timer values, and set new display
    this.setState({ min: min, sec: sec });
    this.setDisplay();

    // if the timer runs out,then we play audio and stop timer
    if (min == 0 & sec == 0) {
      this.setState({ min: min, sec: sec });
      this.setDisplay();
      this.audioBeep.play();
      clearInterval(this.timerID);

      // waits one second and then switches our session type
      setTimeout(this.handleSwitch, 1000);
    }
  }


// checks to see if we need a break or work session, and calls the appropriate function
  handleSwitch() {
    if (this.state.type == "session") {
      this.handleBreak();
    } else {
      this.setState({ type: "session", newSession: true }, () => {this.handleStart();});
    }
  }

// uses current timer values to create a string for the display
  setDisplay() {
    var min = String(this.state.min);
    var sec = String(this.state.sec);

    // if minute or seconds are 1 digit, then we add a 0 in front
    if (min.length == 1) {
      min = "0" + min;
    }
    if (sec.length == 1) {
      sec = "0" + sec;
    }
    this.setState({ display: min + ":" + sec });
  }

  handleStart() {
    // if this is a new session, then we set timer values to session length and then start timer
    if (this.state.newSession == true) {
      this.setState(state => ({ min: state.sessionLength, sec: 0, newSession: false }), () => {this.timerOn();});
    } else {

    // if it is not a new session, we keep the current timer values and start timer
      this.timerOn();
    }
  }

// this function is called by pressing the pause/play button
  handleStartStop() {

  //if the timer is on, then we stop it
    if (this.state.on == true) {
      clearInterval(this.timerID);
      this.setState({ on: false });
    } else {

  // if the timer is not on, then we call handleStart() to evaluate what to do next
      this.setState({ on: true });
      this.handleStart();
    }
  }

// function that handles click for the increment and decrement length buttons
  handleClick(event) {
    var id = event.target.id;

    // cycling through the different button ids and updating state accordingly
    switch (id) {
      case "break-decrement":
        if (this.state.breakLength > 1) {
          this.setState(state => ({ breakLength: state.breakLength - 1 }), () => {this.setDisplay();});
        }
        break;

      case "break-increment":
        if (this.state.breakLength < 60) {
          this.setState(state => ({ breakLength: state.breakLength + 1 }), () => {this.setDisplay();});
        }
        break;

      case "session-decrement":
        if (this.state.sessionLength > 1) {
          this.setState(state => ({ sessionLength: state.sessionLength - 1 }), () => {this.setDisplay();});
        }
        break;

      case "session-increment":
        if (this.state.sessionLength < 60) {
          this.setState(state => ({ sessionLength: state.sessionLength + 1 }), () => {this.setDisplay();});
        }
        break;}

    // if we are in a new session, then update timer values with new session values
    if (this.state.newSession == true) {
      this.setState(state => ({ min: state.sessionLength, sec: 0 }));}
    this.setDisplay();
  }

// html elements to render
  render() {
    return (
      React.createElement("div", { id: "main" },
      React.createElement("div", { id: "break-container" },
      React.createElement("h2", { id: "break-label" }, " break length "),
      React.createElement("h3", { id: "break-length" }, " ", this.state.breakLength, " "),
      React.createElement("div", { id: "button-container" },
      React.createElement("button", { id: "break-decrement", onClick: this.handleClick }, " \u25BC "),
      React.createElement("button", { id: "break-increment", onClick: this.handleClick }, " \u25B2 "))),


      React.createElement("div", { id: "session-container" },
      React.createElement("h2", { id: "session-label" }, " session length "),
      React.createElement("h3", { id: "session-length" }, " ", this.state.sessionLength),
      React.createElement("div", { id: "button-container" },
      React.createElement("button", { id: "session-decrement", onClick: this.handleClick }, " \u25BC "),
      React.createElement("button", { id: "session-increment", onClick: this.handleClick }, " \u25B2 "))),


      React.createElement("div", { id: "timer-container" },
      React.createElement("h2", { id: "timer-label" }, " ", this.state.type, " "),
      React.createElement("div", { id: "time-left" },
      this.state.display),

      React.createElement("audio", { id: "beep",
        src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav",
        ref: audio => {this.audioBeep = audio;} }),

      React.createElement("div", { id: "controls" },
      React.createElement("button", { onClick: this.handleStartStop, id: "start_stop" }, " ", this.state.on == true ? "⏸︎" : "⏵︎"),
      React.createElement("button", { id: "reset", onClick: this.handleReset }, " reset ")))));



  }}


// parent App component
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement(Presentational, null)));

  }}

// render App
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
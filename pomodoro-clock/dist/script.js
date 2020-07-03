class Presentational extends React.Component {
  constructor(props) {
    super(props);

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

  handleReset() {
    clearInterval(this.timerID);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    this.setState({ breakLength: 5, sessionLength: 25, min: 25, sec: 0, newSession: true, on: false, type: "session" }, () => {this.setDisplay();});
  }

  handleBreak() {
    console.log(this.state);
    this.setState(state => ({ type: "break", min: state.breakLength, sec: 0 }), () => {this.timerOn();});
  }

  timerOn() {
    this.setDisplay();
    clearInterval(this.timerID);
    this.timerID = setInterval(() => {
      this.decrementTimer();
    }, 1000);
  }

  decrementTimer() {
    var min = this.state.min;
    var sec = this.state.sec;
    if (sec > 0) {
      sec--;
    } else {
      sec = 59;
      min--;
    }
    this.setState({ min: min, sec: sec });
    this.setDisplay();
    if (min == 0 & sec == 0) {
      this.setState({ min: min, sec: sec });
      this.setDisplay();
      this.audioBeep.play();
      clearInterval(this.timerID);
      setTimeout(this.handleSwitch, 1000);
    }
  }

  handleSwitch() {
    if (this.state.type == "session") {
      this.handleBreak();
    } else {
      this.setState({ type: "session", newSession: true }, () => {this.handleStart();});
    }
  }

  setDisplay() {
    var min = String(this.state.min);
    var sec = String(this.state.sec);
    if (min.length == 1) {
      min = "0" + min;
    }
    if (sec.length == 1) {
      sec = "0" + sec;
    }
    this.setState({ display: min + ":" + sec });
  }

  handleStart() {
    console.log(this.state);
    if (this.state.newSession == true) {
      this.setState(state => ({ min: state.sessionLength, sec: 0, newSession: false }), () => {this.timerOn();});
    } else {
      this.timerOn();
    }
  }

  handleStartStop() {
    console.log(this.state.on);
    if (this.state.on == true) {
      clearInterval(this.timerID);
      this.setState({ on: false });
    } else {
      this.setState({ on: true });
      this.handleStart();
    }
  }

  handleClick(event) {
    var id = event.target.id;
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

    if (this.state.newSession == true) {
      this.setState(state => ({ min: state.sessionLength, sec: 0 }));}
    this.setDisplay();
  }

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



class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement(Presentational, null)));

  }}


ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
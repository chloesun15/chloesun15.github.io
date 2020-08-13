//React component for break and session length parts of clock (top)
const LengthDisplay = props => {
  return React.createElement("div", { id: `${props.type}-container` },
  React.createElement("h2", { id: `${props.type}-label` }, props.type, " length "),
  React.createElement("h3", { id: `${props.type}-length` }, " ", props.length, " "),
  React.createElement("div", { id: "button-container" },

  // Buttons to edit the length of break/sesion
  React.createElement("button", { id: `${props.type}-decrement`, onClick: props.onClick }, " \u25BC "),
  React.createElement("button", { id: `${props.type}-increment`, onClick: props.onClick }, " \u25B2 ")));

};

//React component for timer part of clock (bottom)

const Timer = props => {
  return (
    React.createElement("div", { id: "timer-container" },
    React.createElement("h2", { id: "timer-label" }, " ", props.type, " "),
    React.createElement("div", { id: "time-left" }, " ", props.display),

   	// Buttons to handle user start and reset
    React.createElement("div", { id: "controls" },
    React.createElement("button", { onClick: props.handleStartStop, id: "start_stop" }, " ", props.on == true ? "⏸︎" : "⏵︎"),
    React.createElement("button", { id: "reset", onClick: props.handleReset }, " reset "))));



};


//Container component
class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

   	  //Length of break
      breakLength: 5,

      //Length of session
      sessionLength: 25,

      //Current display
      display: "25:00",

      //Minutes on display
      min: 25,

      //Seconds on display
      sec: 0,

      //Bool for whether this is a new session or an ongoing session (needed for pause button to function)
      newSession: true,

      //Bool for whether the clock is running or not
      on: false,

      //Currently session or break 
      type: "session" };


    //Binding functions
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

  // Resets the clock 
  handleReset() {
  	//Stop the current timer and resets audio 
    clearInterval(this.timerID);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;

    //Resets state to default values, then reset the display after
    this.setState({ breakLength: 5, sessionLength: 25, min: 25, sec: 0, newSession: true, on: false, type: "session" }, () => {this.setDisplay();});
  }

  // Change the clock to a break state
  handleBreak() {
    console.log(this.state);

    // Set type to break, reset time to user's inputted break length, then start timer
    this.setState(state => ({ type: "break", min: state.breakLength, sec: 0 }), () => {this.timerOn();});
  }

  // Starts the timer
  timerOn() {

  	// Calls function to set the display
    this.setDisplay();

    //Clears current timer
    clearInterval(this.timerID);

    // Starts timer again by calling decrement function every second
    this.timerID = setInterval(() => {
      this.decrementTimer();
    }, 1000);
  }

  // Decrement funtion, enables timer to count down
  decrementTimer() {

  	// Sets state minutes and second to local variables
    var min = this.state.min;
    var sec = this.state.sec;

    // Count down time 
    if (sec > 0) {
      sec--;
    } else {
      sec = 59;
      min--;
    }

    // Updating state after each change, and updating display
    this.setState({ min: min, sec: sec });
    this.setDisplay();

    //Case for when timer runs out
    if (min == 0 & sec == 0) {

      // Set timer and display to 00:00
      this.setState({ min: min, sec: sec });
      this.setDisplay();

      //Play audio
      this.audioBeep.play();

      //Clear timer and then wait 1 second before switching to new break/session
      clearInterval(this.timerID);
      setTimeout(this.handleSwitch, 1000);
    }
  }


  // Changes from session to break and vice versa
  handleSwitch() {
    if (this.state.type == "session") {
      this.handleBreak();
    } else {

      // If the current state is break, then we change to session and set newSession to true
      this.setState({ type: "session", newSession: true }, () => {this.handleStart();});
    }
  }

  // Sets the visual clock display
  setDisplay() {

  	// Change minutes and second to strings
    var min = String(this.state.min);
    var sec = String(this.state.sec);

    // Changing the string values to fit MM:SS
    if (min.length == 1) {
      min = "0" + min;
    }
    if (sec.length == 1) {
      sec = "0" + sec;
    }

    // Update display value with MM:SS time
    this.setState({ display: min + ":" + sec });
  }

  // Starting a session
  handleStart() {
    console.log(this.state);

    // If this is a new session, then we set the min/sec, change newSession to false, and turn on timer
    // Separate cases for new vs old sessions so users cannot change session length after starting a session
    if (this.state.newSession == true) {
      this.setState(state => ({ min: state.sessionLength, sec: 0, newSession: false }), () => {this.timerOn();});
    } else {

   	//Otherwise, simply turn the timer on without editing min/sec
      this.timerOn();
    }
  }

  // Function is called when pause/play is hit
  handleStartStop() {
    console.log(this.state.on);

    //If the timer is already on, then we stop the timer and update state
    if (this.state.on == true) {
      clearInterval(this.timerID);
      this.setState({ on: false });

    //If timer is off, we start the timer and update state
    } else {
      this.setState({ on: true });
      this.handleStart();
    }
  }

  //Function called when the up/down arrows are pressed to edit session/break length
  handleClick(event) {

  	// Read and perform action based on button id
    var id = event.target.id;
    switch (id) {
   	  // Decrease break length, cannot set length below 1
      case "break-decrement":
        if (this.state.breakLength > 1) {
          this.setState(state => ({ breakLength: state.breakLength - 1 }), () => {this.setDisplay();});
        }
        break;
      // Increase break length, cannot set length above 60
      case "break-increment":
        if (this.state.breakLength < 60) {
          this.setState(state => ({ breakLength: state.breakLength + 1 }), () => {this.setDisplay();});
        }
        break;
      // Decrease session length, cannot set length below 1
      case "session-decrement":
        if (this.state.sessionLength > 1) {
          this.setState(state => ({ sessionLength: state.sessionLength - 1 }), () => {this.setDisplay();});
        }
        break;
      // Increase session length, cannot set length above 60
      case "session-increment":
        if (this.state.sessionLength < 60) {
          this.setState(state => ({ sessionLength: state.sessionLength + 1 }), () => {this.setDisplay();});
        }
        break;}

    // If this is a new session, then we update the state and set display (prevents display from being changed while session is active)
    if (this.state.newSession == true) {
      this.setState(state => ({ min: state.sessionLength, sec: 0 }));}
    this.setDisplay();
  }

  //Render function

  render() {
    return (
      React.createElement("div", { id: "main" },

      // Two components for break and session length at top of clock
      React.createElement(LengthDisplay, { type: "break", length: this.state.breakLength, onClick: this.handleClick }),
      React.createElement(LengthDisplay, { type: "session", length: this.state.sessionLength, onClick: this.handleClick }),
      

      // Timer component for bottom of clock
      React.createElement(Timer, { type: this.state.type, display: this.state.display, handleStartStop: this.handleStartStop, handleReset: this.handleReset, on: this.state.on }),
     

      // Audio element that functions will refer back to as this.audioBeep
      React.createElement("audio", { id: "beep",
        src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav",
        ref: audio => {this.audioBeep = audio;} })));


  }}


// App component
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement(Container, null)));

  }}

//Render App to DOM
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
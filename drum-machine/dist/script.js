const { combineReducers, createStore } = Redux;
const { connect, Provider } = ReactRedux;

const myDrums = [
{ name: "Heater 1", id: "drumq", text: "Q", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
{ name: "Heater 2", id: "drumw", text: "W", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
{ name: "Heater 3", id: "drume", text: "E", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
{ name: "Heater 4", id: "druma", text: "A", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
{ name: "Clap", id: "drums", text: "S", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
{ name: "Open HH", id: "drumd", text: "D", src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
{ name: "Kick n' Hat", id: "drumz", text: "Z", src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
{ name: "Kick", id: "drumx", text: "X", src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
{ name: "Closed HH", id: "drumc", text: "C", src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" }];


const drumReducer = function () {
  return myDrums;
};

const store = createStore(drumReducer);


class Presentational extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlay = this.handlePlay.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.state = {
      display: "",
      volume: 50 };

  }

  handlePlay(event) {
    this.playAudio(event.target.innerText);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event) {
    var key = event.keyCode;
    var id = String.fromCharCode(96 <= key && key <= 105 ? key - 48 : key).toUpperCase();
    if (document.getElementById(id) !== null) {
      this.playAudio(id);
    }
  }

  playAudio(id) {
    var audio = document.getElementById(id);
    console.log(this.state.volume);
    audio.volume = this.state.volume / 100;
    audio.play();

    this.setState({
      display: audio.dataset.display });

  }

  handleVolume(event) {
    this.setState({
      volume: event.target.value });

  }

  render() {
    return React.createElement("div", { id: "drum-machine" },
    React.createElement("div", { id: "display" },
    React.createElement("div", { id: "content-container" }, React.createElement("h1", { id: "content" }, this.state.display)),

    React.createElement("div", { id: "volume-bar" }, React.createElement("i", { class: "fas fa-volume-off" }), React.createElement("input", { type: "range", min: "0", max: "100", value: this.state.volume, class: "slider", id: "volume", onChange: this.handleVolume }), React.createElement("i", { class: "fas fa-volume-up" }))),
    this.props.drums.map(drum => React.createElement("button", { onClick: this.handlePlay, class: "drum-pad", id: drum.id }, React.createElement("audio", { "data-display": drum.name, class: "clip", id: drum.text, src: drum.src }), drum.text)));

  }}


function mapStateToProps(state) {
  return { drums: state };
}

const Container = ReactRedux.connect(mapStateToProps, null)(
Presentational);

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement(Container, null)));

  }}


ReactDOM.render(React.createElement(App, null), document.getElementById("App"));
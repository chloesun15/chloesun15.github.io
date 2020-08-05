function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /* quote API from https://forum.freecodecamp.org/t/free-api-inspirational-quotes-json-with-code-examples/311373 
                                                                                                                                                                                                           
                                                                                                                                                                                                           Project created for Free Code Camp challenge
                                                                                                                                                                                                           */

var myQuotes = [];
fetch("https://type.fit/api/quotes").

then(function (response) {
  return response.json();
}).
then(function (data) {
  myQuotes = data;

  const { combineReducers, createStore } = Redux;
  const { connect, Provider } = ReactRedux;

  const QuoteReducer = function () {
    return myQuotes;
  };

  const store = createStore(QuoteReducer);

  class Presentational extends React.Component {



    constructor(props) {
      super(props);_defineProperty(this, "getRandom", num => {return Math.floor(Math.random() * num);});
      this.state = {
        quote: "Welcome to the Random Quote Generator.",
        author: "Click 'New Quote' to start!" };


      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      var newIndex = this.getRandom(this.props.quotes.length);
      while (newIndex == this.state.index) {
        console.log(newIndex);
        newIndex = this.getRandom(this.props.quotes.length);
      }
      var quote = this.props.quotes[newIndex].text;
      var author = this.props.quotes[newIndex].author == null ? "Unknown" : this.props.quotes[newIndex].author;
      this.setState({
        quote: quote,
        author: author });

    }

    componentDidMount() {
      setTimeout(function () {
        document.getElementById("quote-box").style.opacity = 1;
      }, 700);
    }

    render() {
      return (
        React.createElement("div", { id: "quote-box" },
        React.createElement("div", { id: "text" }, this.state.quote),

        React.createElement("div", { id: "author" }, " - ", this.state.author),
        React.createElement("button", { id: "new-quote", onClick: this.handleClick }, " New Quote "),
        React.createElement("button", { id: "tweet-button" }, React.createElement("a", { id: "tweet-quote", href: `https://twitter.com/intent/tweet?text=${this.state.quote} - ${!this.state.author ? this.state.quote : this.state.author}`, target: "_blank" }, "Tweet"))));


    }}


  function mapStateToProps(state) {
    return { quotes: state };
  }

  const Container = ReactRedux.connect(mapStateToProps, null)(Presentational);

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
});
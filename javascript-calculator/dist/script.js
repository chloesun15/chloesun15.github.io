// importing redux and react functions
const { combineReducers, createStore } = Redux;
const { connect, Provider } = ReactRedux;

// declaring variables
const digitWarning = "MAX DIGITS REACHED";
const myNumbers = [
{ id: "zero", text: "0", value: 0 },
{ id: "one", text: "1", value: 1 },
{ id: "two", text: "2", value: 2 },
{ id: "three", text: "3", value: 3 },
{ id: "four", text: "4", value: 4 },
{ id: "five", text: "5", value: 5 },
{ id: "six", text: "6", value: 6 },
{ id: "seven", text: "7", value: 7 },
{ id: "eight", text: "8", value: 8 },
{ id: "nine", text: "9", value: 9 },
{ id: "decimal", text: ".", value: "." }];

const myOperators = [
{ id: "equals", text: "=" },
{ id: "add", text: "+" },
{ id: "subtract", text: "-" },
{ id: "multiply", text: "*" },
{ id: "divide", text: "/" },
{ id: "clear", text: "A/C" }];


// creating reducers and combining into root reducer
const numberReducer = function () {
  return myNumbers;
};
const operatorReducer = function () {
  return myOperators;
};

rootReducer = combineReducers(
{ numbers: numberReducer, operators: operatorReducer });

// create store
store = createStore(rootReducer);


// child component with all my html elements
class Presentational extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "0",
      equation: "0",
      sum: 0 };


    this.handleOperatorClick = this.handleOperatorClick.bind(this);
    this.handleNumberClick = this.handleNumberClick.bind(this);
    this.handleEquation = this.handleEquation.bind(this);
    this.checkLastIndex = this.checkLastIndex.bind(this);
    this.checkLastTwoIndices = this.checkLastTwoIndices.bind(this);
    this.maxDigits = this.maxDigits.bind(this);
    this.checkNumbers = this.checkNumbers.bind(this);
  }

  handleNumberClick(event) {
    // limit the length of the numbers that can be placed on the screen, for simplicity + aesthetic reasons
    if (this.state.display.length >= 18 && this.state.display != digitWarning && !this.checkLastIndex(this.state.equation)) {
      this.maxDigits();
      // if number length is below max, then we call a function that will evaluate the number click
    } else if (this.state.display != digitWarning) {
      this.checkNumbers(event);
    }
  }


  maxDigits() {
    // displays warning if maximum digits are hit for .7s

    var myDisplay = this.state.display;
    this.setState({ display: digitWarning });

    timeout = setTimeout(() => this.setState({ display: myDisplay }), 700);
    clearTimeout(timeout);
  }

  checkNumbers(event) {
    event.persist();
    this.setState((state) =>
    // if display is 0 (a.k.a new calculator equation), we replace it with the new digit
    state.display == "0" ?
    { display: event.target.value, equation: event.target.value } :

    // if a user is trying to enter a decimal in a number that already has one, we do not change the display
    this.checkStringForDecimal(state.display) && event.target.value == "." ?
    { display: state.display, equation: state.equation } :

    // if the last input was an operator, we replace the previous number with the start of a new number
    this.checkLastIndex(state.equation) ?
    { display: event.target.value, equation: state.equation.concat(event.target.value) } :

    // otherwise concat the new digit to the existing number in the display and equation
    { display: state.display.concat(event.target.value), equation: state.equation.concat(event.target.value) });
  }

  // uses regex to cheeck if decimal exists in string
  checkStringForDecimal(string) {
    return /\./.test(string);
  }

  // checks for operators in string, unless given different parameter
  checkLastIndex(string, arr = ["+", "-", "/", "*"]) {
    for (var i = 0; i < arr.length; i++) {
      if (string[string.length - 1] == arr[i]) {
        return true;
      }
    }
    return false;
  }

  handleOperatorClick(event) {
    var operator = event.target.innerText;
    // if equal sign is clicked, then call a function which will return the sum
    if (event.target.id == "equals") {
      this.handleEquation();
    } else {
      this.setState((state) =>
      // if clear was clicked, then we clear the display and the equation 
      operator == "A/C" ?
      { display: "0", equation: "0" } :

      // for minus, we concat unless there are multiple '-' in a row 
      operator == "-" && !this.checkLastIndex(this.state.equation, ["-"]) ?
      { equation: state.equation.concat(operator) } :

      // if there are two operators in a row, we delete both and add the new one
      this.checkLastTwoIndices(state.equation) ?
      { equation: state.equation.slice(0, -2).concat(operator) } :

      // if  last index is a non-minus operator, then we remove it and replace with new operator
      this.checkLastIndex(state.equation, ["+", "*", "/"]) ?
      { equation: state.equation.slice(0, -1).concat(operator) } :

      // adds operator if none of the other conditions are fulfilled
      { equation: state.equation.concat(operator) });
    }

  }

  // checks last two indices for elements in arr, if none given checkLastIndex will default to operators
  checkLastTwoIndices(string, arr) {
    return this.checkLastIndex(string, arr) && this.checkLastIndex(string.slice(0, -1), arr);
  }

  // solves the current equation
  handleEquation() {
    var equation = this.state.equation;

    // if the last index in element is a operator, get rid of it
    if (this.checkLastIndex(equation)) {
      equation = equation.slice(0, -1);
    }

    // use eval to sum equation
    var sum = eval(equation);

    // if sum is too long, we put it in exponential form
    if (String(sum).length > 18) {
      sum = sum.toExponential(7);
    }

    // update display and equation
    this.setState({
      display: String(sum),
      equation: String(sum) });

  }

  // render html contents
  render() {
    return (
      React.createElement("div", { id: "main" },





      React.createElement("div", { id: "equation-holder" }, React.createElement("div", { id: "equation" }, this.state.equation)),
      React.createElement("div", { id: "display" }, React.createElement("div", { id: "display-content" }, this.state.display)),


      this.props.numbers.map(num => React.createElement("button", {
        class: "number",
        id: num.id,
        value: num.value,
        onClick: this.handleNumberClick },
      num.text)),

      this.props.operators.map(o => React.createElement("button", {
        class: "operator",
        id: o.id,
        onClick: this.handleOperatorClick },
      o.text))));


  }}


// create two props. numbers is the array of number objects, operators is array of operators objects
function mapStateToProps(state) {
  return { numbers: state.numbers, operators: state.operators };
}

// create container to connect props to Presentational component
const Container = ReactRedux.connect(mapStateToProps, null)(Presentational);

// parent App component 
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement(Container, null)));

  }}


// render App component
ReactDOM.render(React.createElement(App, null), document.getElementById("app"));
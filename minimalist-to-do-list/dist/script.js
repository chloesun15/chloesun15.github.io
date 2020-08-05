const { combineReducers, createStore } = Redux;
const { connect, Provider } = ReactRedux;

const NEW = 'NEW';
const DELETE = 'DELETE';
function createNew(text) {
  return {
    type: 'NEW',
    text };

}

function deleteItem(key) {
  return {
    type: DELETE,
    key };

}

const ToDoReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW':
      return [...state, { text: action.text }];
    case 'DELETE':
      var newState = [...state];
      newState.splice(action.key, 1);
      return newState;
    default:
      return state;}

};

const store = createStore(ToDoReducer);

class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleChange(event) {
    this.setState({
      input: event.target.value });

  }
  handleSubmit() {
    if (this.state.input.trim() != "") {this.props.createToDo(this.state.input);}
    this.setState({
      input: "" });

  }

  keyPressed(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSubmit();
    }}

  handleDelete(id) {
    console.log("handling Delete!");
    this.props.deleteToDo(id);
  }

  render() {
    return (
      React.createElement("div", { id: "body" },
      React.createElement("h1", { id: "title" }, " what do i need to do today?"),
      React.createElement("div", { id: "main" },
      React.createElement("div", { id: "input-area" },
      React.createElement("h2", null, " let me think... "),
      React.createElement("textarea", { id: "text", value: this.state.input, onChange: this.handleChange, onKeyPress: this.keyPressed, placeholder: "...what's one thing i have to do today?" }),
      React.createElement("button", { id: "submit", onClick: this.handleSubmit }, " add to list ")),

      React.createElement("div", { id: "list-div" },
      React.createElement("h2", null, " my to-do list "),
      React.createElement("ul", null,
      this.props.todos.map((todo, i) => {
        return (
          React.createElement("li", { onClick: () => this.handleDelete(i), key: i }, " ", todo.text, " "));
      }))))));

  }}


function mapStateToProps(state) {
  return { todos: state };
}

function mapDispatchToProps(dispatch) {
  return { createToDo: function (text) {
      dispatch(createNew(text));
    },
    deleteToDo: function (key) {
      dispatch(deleteItem(key));
    } };
}

const Container = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Presentational);

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
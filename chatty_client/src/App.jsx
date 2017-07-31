import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx'
//import Message from 'Message.jsx'
import MessageList from './MessageList.jsx'



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      inChat: 1,
      notification: ["New Chat"],
      currentUser: {
        name: "Anonymous"
      }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
      ]
    }
  }


 notification(message) {
    this.socket.send(JSON.stringify(
      {
        type: "notification",
        username: this.state.currentUser.name,
        content:  message
    }))
  }

  newUser() {
    let newMessage = {
      type: "newUser",
      username: this.state.currentUser.name,
    }
    this.socket.send(JSON.stringify(newMessage))
    console.log("Sending new user..")
  }


  newMessage(event) {
    if(event.keyCode === 13) {
      console.log("Something changed...")
      let newMessage = {
        type: "message",
        username: this.state.currentUser.name,
        content:  event.target.value
      }
      this.socket.send(JSON.stringify(newMessage))

      } else if (event.type === "blur") {
       this.notification(`${this.state.currentUser.name} changed their name to ${event.target.value}`)
      this.state.currentUser.name = event.target.value
      console.log(this.state)
      }
    }

  componentDidMount() {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://localhost:3001");
    console.log("Connected to Server");

    this.socket.onopen = () => {
      this.notification(`${this.state.currentUser.name} has joined the chat`)
      this.newUser()
     }

    this.socket.onmessage = (event)  => {
      let newMessage =  JSON.parse(event.data)
      switch(newMessage["type"]){
        case "message":
          this.setState({
            "messages": this.state.messages.concat(newMessage)
          });
          break;
        case "notification":
          this.setState({
              "notification": this.state.notification.concat(newMessage.content)
            });
          console.log(this.state)
          break;
        case "inChat":
          this.state.inChat = newMessage.inChat
          break;
      }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <p className="inChat">  {this.state.inChat} users online </p>
        </nav>
        <MessageList messages={this.state.messages} notification={this.state.notification}/>
        <ChatBar currentUser={this.state.currentUser} newMessage={this.newMessage.bind(this)} />
      </div>
    );
  }
}

export default App;



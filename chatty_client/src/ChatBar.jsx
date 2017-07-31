import React, {Component} from 'react';

class ChatBar extends Component {
 constructor(props) {
    super(props);
    this.state = {defaultValue: this.props.currentUser.name };
  }

render() {
    return (
      <footer className="chatbar">
        <input onBlur = {this.props.newMessage}className="chatbar-username" placeholder={this.state.defaultValue} />
        <input onKeyUp = {this.props.newMessage} className="chatbar-message" placeholder="Type a message and hit ENTER"/>
      </footer>
  )}
}

export default ChatBar;

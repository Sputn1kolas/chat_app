import React, {Component} from 'react';
import Message from './Message.jsx';
// state in parent

class MessageList extends Component {
  render() {
    return (
      <main className="messages">
        {this.props.messages.map(function(x , i) {
          return <Message key={i} message={x} />
          })
        }


      <div className="message system">
        {this.props.notification.map(function(x, i) {
          return <div key={i} className="notification"> {x} </div>
        })}
      </div>


    </main>
    )
  }
}

export default MessageList;


import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from '../Message/Message';

import './Chatbox.css';

const Chatbox = ({ messages, username }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} username={username}/></div>)}
  </ScrollToBottom>
);

export default Chatbox;
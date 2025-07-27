import React from 'react';

const MessageBubble = ({ message, windowColor }) => {
  if (message.sender === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl text-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
          message.sender === 'user'
            ? 'bg-gray-700 text-gray-100 rounded-br-none'
            : `bg-gradient-to-r ${windowColor} text-white rounded-bl-none`
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        {message.timestamp && (
          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-300' : 'text-white text-opacity-70'}`}>
            {message.timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
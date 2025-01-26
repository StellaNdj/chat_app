import { formatDistance } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { newMessage } from '../endpoints';

const ConversationSpace = ({ conversation, handleClose }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState(conversation.messages)
  const [formData, setFormData] = useState({
    participants: conversation.other_user.id,
    content: '',
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const roomName = conversation.id;
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    // Incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);
      
      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    // Handle websocket errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error.message || error);
    };

    // Close websocket connection on unmount
    return () => {
      ws.close();
    };
  }, [conversation.id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await newMessage({token, participants: [formData.participants], content: formData.content});

    // Send messages via WebSocket
    if(socket && formData.content.trim() !== "") {
      socket.send(
        JSON.stringify({

          message: formData.content,
          sender: user[0].id,
        })
      )
    }

    // Clear input field
    setFormData({...formData, content: ''});
  }

  return(
    <>
      <div>
        <div className='border-b border-gray-300 flex'>
          <button onClick={handleClose}><XMarkIcon className='size-4' /> </button>
          <h3 className='font-bold'>{conversation.other_user.username}</h3>
        </div>
        <>
          {messages.map((message) =>
            <div key={message.id} className={`grid ${message.sender === user[0].id ? 'justify-end' : 'justify-start'}`} >
              <p className={ `rounded-lg m-4 mb-1 p-2 w-fit ${message.sender === user[0].id ? 'bg-blue-600 text-right' : 'bg-gray-300'}`}>{message.content}</p>
              <p className='text-xs text-gray-300 mx-4 '>
                {formatDistance(new Date(message.timestamp), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              name='content'
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value})}
              placeholder='Type your message here...'
              required
              className='bg-gray-300 border p-1 rounded-lg w-80'
            />
            <button className='main-bg p-1 rounded-lg'>
              <PaperAirplaneIcon className='size-6 cursor-pointer'/>
            </button>
          </form>
        </>
      </div>
    </>
  )
}

export default ConversationSpace;

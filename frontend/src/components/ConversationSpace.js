import { formatDistance } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { publicProfiles } from '../endpoints';

const ConversationSpace = ({ conversation, handleClose }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState(conversation?.messages || []);
  const [formData, setFormData] = useState({
    participants: conversation?.other_user?.id || conversation?.id,
    content: '',
  });
  const [socket, setSocket] = useState(null);
  const [profile, setProfile] = useState();


  const getProfile = async ({token}) => {
    const data = await publicProfiles({token: token, username: conversation.other_user.username});
    setProfile(data);
    console.log(data);
  }

  useEffect(() => {
    setMessages(conversation.messages);
    getProfile({token})
  }, [conversation, token]);

  useEffect(() => {
    const roomName = conversation.id;
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);
    setSocket(ws);

    // Incoming messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      if (data.content) {
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
        {!profile ? <p>Loading...</p> :
          <div className='border-b border-gray-300 flex p-2'>
            <button onClick={handleClose}><XMarkIcon className='size-4'/> </button>
            <img src={`http://localhost:8000/api${profile.image_url}`} alt='Profile pic' className='w-10 h-10 rounded-full object-cover shadow-sm'/>
            <div className='mx-2'>
              <h3 className='font-bold'>{profile.username}</h3>
              {profile.is_online ? <p className='text-xs text-green-600'>online</p> : <p className='text-xs text-gray-500'>offline</p>}
            </div>
          </div>
        }
        <>
          <div className='overflow-y-auto h-80  p-2 space-y-4'>
            {messages.map((message) =>
              <div key={message.id} className={`grid ${message.sender === user[0].id ? 'justify-end' : 'justify-start'}`} >
                <p className={ `rounded-lg m-4 mb-1 p-2 w-fit ${message.sender === user[0].id ? 'bg-blue-600 text-right' : 'bg-gray-400'}`}>{message.content}</p>
                <p className={`text-xs text-gray-300 mx-4 ${message.sender === user[0].id ? 'text-end' : 'text-start'}`}>
                  {formatDistance(new Date(message.timestamp), new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            )}
          </div>

          <div className='sticky bottom-0 p-2 border-t'>
            <form onSubmit={handleSubmit} className='flex justify-between'>
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
          </div>
        </>
      </div>
    </>
  )
}

export default ConversationSpace;

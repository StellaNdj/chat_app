import { formatDistance } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { newMessage, publicProfiles } from '../endpoints';

const ConversationSpace = ({ conversation, handleClose, newUser, setSelectedConversation }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState(conversation?.messages || []);
  const [formData, setFormData] = useState({
    participants: newUser ? [newUser.id] : conversation?.id,
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
    if (conversation) {
      setMessages(conversation.messages);
      getProfile({ token });
      const roomName = conversation.id;
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/?token=${token}`);
      setSocket(ws);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      return () => ws.close();
    }
  }, [conversation, token]);


  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!formData.content.trim()) return;

    if (newUser) {
      // Start a new conversation by sending the first message
      const response = await newMessage({ token, participants: [newUser.id], content: formData.content });

      if (response.conversation) {
        setSelectedConversation(response.conversation);
        setMessages([response.content]);
      }
    } else if (socket) {
      socket.send(JSON.stringify({ message: formData.content, sender: user[0].id }));
    }

    setFormData({ ...formData, content: '' });
  }

  return (
    <div>
      {!profile && newUser ? (
        <div className="border-b p-2">
          <h3 className="font-bold">{newUser.username}</h3>
        </div>
      ) : (
        <div className="border-b flex p-2">
          <button onClick={handleClose}><XMarkIcon className="size-4" /></button>
          <img src={`http://localhost:8000/api${profile?.image_url}`} className="w-10 h-10 rounded-full object-cover shadow-sm" alt='Profile pic' />
          <div className='mx-2' >
            <h3 className="font-bold">{profile?.username}</h3>
            {profile?.is_online ? <p className='text-xs text-green-600'>online</p> : <p className='text-xs text-gray-600'>offline</p>}
          </div>
        </div>
      )}

      <div className="h-80 p-2 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`grid ${message.sender === user[0].id ? "justify-end" : "justify-start"}`}>
            <p className={`rounded-lg p-2 w-fit ${message.sender === user[0].id ? "bg-blue-600 text-right" : "bg-gray-400"}`}>
              {message.content}
            </p>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 p-2 border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            name="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Type your message..."
            className="border p-1 rounded-lg w-80"
          />
          <button className="p-1 bg-blue-600 text-white rounded-lg">
            <PaperAirplaneIcon className="size-6 cursor-pointer" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConversationSpace;

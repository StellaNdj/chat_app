import { formatDistance } from 'date-fns';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ConversationSpace = ({conversation, handleClose}) => {
  const { user } = useContext(AuthContext);

  return(
    <>
      <div>
        <div className='border-b border-gray-300 flex'>
          <button onClick={handleClose}><XMarkIcon className='size-4' /> </button>
          <h3 className='font-bold'>{conversation.other_user}</h3>
        </div>
        <>
          {conversation.messages.map((message) =>
            <div key={message.id} className={`grid ${message.sender === user[0].id ? 'justify-end' : 'justify-start'}`} >
              <p className={ `rounded-lg m-4 mb-1 p-2 w-fit ${message.sender === user[0].id ? 'bg-blue-600 text-right' : 'bg-gray-300'}`}>{message.content}</p>
              <p className='text-xs text-gray-300 mx-4 '>
                {formatDistance(new Date(conversation.last_message.timestamp), new Date(), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )}
        </>
      </div>
    </>
  )
}

export default ConversationSpace;

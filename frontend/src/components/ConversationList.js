import { formatDistance } from 'date-fns';

const ConversationList = ({conversations, onConversationSelect}) => {
  return(
    <>
      {conversations.map((conversation, index) =>
        <div key={conversation.id} className={`pb-4 ${index !== conversations.length - 1 ? 'border-b border-gray-300' : ''}`} onClick={() => onConversationSelect(conversation)}>
          <div className="flex justify-between">
            <h4 className="font-bold">{conversation.other_user}</h4>
            <p className='text-sm text-gray-400'>{formatDistance(new Date(conversation.last_message.timestamp), new Date(), {
              addSuffix: true,
            })}</p>
          </div>
          <p className='text-sm text-gray-500'>{conversation.last_message.content}</p>
        </div>
      )}
    </>
  )
}

export default ConversationList;

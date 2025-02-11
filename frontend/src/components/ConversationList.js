import { formatDistance } from 'date-fns';

const ConversationList = ({conversations, onConversationSelect}) => {
  return(
    <>
      {conversations.map((conversation, index) =>
        <div key={conversation.id} className={`pb-4 cursor-pointer flex`} onClick={() => onConversationSelect(conversation)}>
          {conversation.user_images.map((image) =>
            <div key={image.user_id}>
              <img src={image ? `http://localhost:8000/api${image.image_url}` : "http://localhost:8000/api/media/default.png"} alt='Profile pic' className="w-10 h-10 rounded-full object-cover shadow-sm"/>
            </div>
          )}
          <div>
            <div className="flex justify-between">
              {conversation.name? <h4 className="font-bold">{conversation.name}</h4> : <h4 className="font-bold">{conversation.other_user.map((user) => user.username)}</h4> }
              <p className='text-sm text-gray-400'>{conversation.last_message?.timestamp
                ? formatDistance(new Date(conversation.last_message.timestamp), new Date(), { addSuffix: true })
                : "Now"}</p>
            </div>
            <p className='text-sm text-gray-500'>{conversation.last_message.content}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default ConversationList;

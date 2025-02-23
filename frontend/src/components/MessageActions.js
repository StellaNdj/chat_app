import { useEffect, useRef, useState } from "react";
import { FaceSmileIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";


const MessageActions = ({ messageId, handleReaction, onDelete }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef(null);
  const reactionRef = useRef(null);

  const reactions = ["❤️", "😂", "👍", "🔥", "😢", "👀"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setShowActions(false);
      }

      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowReactions(false);
      }
    }

    if (showActions || showReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }

  }, [showActions, showReactions])

  return (
    <div className="flex">
      {/* Action button */}
      <div className="relative" ref={actionRef}>
        <button onClick={() => setShowActions(!showActions)} className="relative group">
          <EllipsisVerticalIcon className="size-4 hover:bg-gray-200 rounded-full"/>
        </button>

        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          Plus
        </span>

        {showActions && (
          <div className="absolute bottom-full right-1/2 bg-gray-500 p-2 rounded-lg">
            <button onClick={() => onDelete(messageId)} className="flex items-center rounded-lg hover:bg-gray-400">
              <TrashIcon className="size-4 text-red-600"/><p className='text-red-600 ml-2'>Delete</p>
            </button>
          </div>
        )}
      </div>


      {/* Reaction button */}
      <div className="relative" ref={reactionRef}>
        <button onClick={() => setShowReactions(!showReactions)} className="relative group">
          <FaceSmileIcon className="size-4 hover:bg-gray-200 rounded-full"/>
        </button>

        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          React
        </span>

        {showReactions && (
          <div className="flex absolute bottom-full right-1/2 bg-gray-500 p-2 rounded-lg">
            {reactions.map((emoji, index) => (
              <button key={index} onClick={() => handleReaction(messageId, emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default MessageActions;

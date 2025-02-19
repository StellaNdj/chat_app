import { useState } from "react";
import { FaceSmileIcon, EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";


const MessageActions = ({ messageId, onReact, onDelete }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const reactions = ["❤️", "😂", "👍", "🔥", "😢", "👀"];

  return (
    <div>
      {/* Reaction button */}
      <button onClick={() => setShowReactions(!showReactions)}>
        <FaceSmileIcon className="size-4"/>
      </button>

      {showReactions && (
        <div className="">
          {reactions.map((emoji, index) => (
            <button key={index} onClick={() => onReact(messageId, emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Action button */}
      <button onClick={() => setShowActions(!showActions)}>
        <EllipsisVerticalIcon className="size-4"/>
      </button>

      {showActions && (
        <div className="">
          <button onClick={() => onDelete(messageId)} className="">
            <TrashIcon className="size-4"/>
          </button>
        </div>
      )}
    </div>
  )
}

export default MessageActions;

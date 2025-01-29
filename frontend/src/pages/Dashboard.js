import { useContext, useEffect, useState } from "react";
import ConversationList from "../components/ConversationList";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations } from "../endpoints";
import ConversationSpace from "../components/ConversationSpace";

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const { token } = useContext(AuthContext);
  const [selectedConversation, setSelectedConversation] = useState();
  const [conversationOpen, setConversationOpen] = useState(false);

  console.log(token);
  
  const fetchConversationData = async () => {
    const conversationData = await getConversations({token});
    setConversations(conversationData);
  };

  useEffect(() => {
    fetchConversationData();
  }, [])

  const handleConversationSelected = (conversation) => {
    setSelectedConversation(conversation);
    setConversationOpen(true);
  }

  const handleClose = () => {
    setConversationOpen(false);
  }

  return(
    <>
      <div className="flex justify-around ">
        {/* Navbar section */}
        <Navbar/>

        {/* Contacts */}
        <div className={`basis-1/3 section rounded-lg p-4 m-4`}>
          <ConversationList
            conversations={conversations}
            onConversationSelect={handleConversationSelected}
          />
        </div>

        {/* Message / Conversation Space */}
        <div className="flex-grow section rounded-lg p-4 m-4 dash-height">
          {conversationOpen ? (
            <ConversationSpace conversation={selectedConversation} handleClose={handleClose} />
          ) : (

            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </>
  )
}

export default Dashboard;

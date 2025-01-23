import { useContext, useEffect, useState } from "react";
import ConversationList from "../components/ConversationList";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations } from "../endpoints";

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const { token } = useContext(AuthContext);
  const [selectedConversation, setSelectedConversation] = useState();

  useEffect(() => {
    const fetchConversationData = async () => {
      console.log(token);
      const conversationData = await getConversations({token});
      setConversations(conversationData);
    };
    fetchConversationData();
  }, [])

  const handleConversationSelected = (conversation) => {
    setSelectedConversation(conversation);
    console.log('Selected convo:', conversation);
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

        {/* Message / Conversation */}
        <div className="flex-grow section rounded-lg p-4 m-4">

        </div>
      </div>
    </>
  )
}

export default Dashboard;

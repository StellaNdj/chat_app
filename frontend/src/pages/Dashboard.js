import { useContext, useEffect, useState } from "react";
import ConversationList from "../components/ConversationList";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations, search } from "../endpoints";
import ConversationSpace from "../components/ConversationSpace";
import SearchBar from "../components/SearchBar";

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const { token } = useContext(AuthContext);
  const [selectedConversation, setSelectedConversation] = useState();
  const [conversationOpen, setConversationOpen] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);

  console.log(token);

  const fetchConversationData = async () => {
    const conversationData = await getConversations({token});
    setConversations(conversationData);
  };

  useEffect(() => {
    fetchConversationData();
  }, [selectedConversation])

  const handleConversationSelected = (conversation) => {
    setSelectedConversation(conversation);
    setConversationOpen(true);
  }

  const handleClose = () => {
    setConversationOpen(false);
  }

  const handleUserSelected = (user) => {
    if (user.type === 'conversation') {
      setSelectedConversation(user.conversation);
    } else if (user.type === 'new_user') {
      setSearchedUser(user.user);
      setSelectedConversation(null);
    }
    setConversationOpen(true);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-around h-screen">
        <div className="w-28 md:w-28 lg:w-28 h-full fixed md:relative flex-shrink-0">
          {/* Navbar section */}
          <Navbar />
        </div>

        <div className="">
          {/* Contacts List - Show only if no conversation is open on small screens */}
          <div className={` h-full md:basis-1/3 bx-sx p-4 ${conversationOpen ? 'hidden md:block' : 'block'}`}>
            <SearchBar onUserSelect={setSearchedUser} />
            <ConversationList
              conversations={conversations}
              onConversationSelect={handleConversationSelected}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-around flex-grow">
          {/* Message / Conversation Space - Show only when a conversation is selected on small screens */}
          <div className={`w-full md:flex-grow  ${conversationOpen ? 'block' : 'hidden'} md:block`}>
            {conversationOpen ? (
              <ConversationSpace
                conversation={selectedConversation}
                handleClose={handleClose}
                newUser={searchedUser}
                setSelectedConversation={setSelectedConversation}
                setConversations={setConversations}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

import { useContext, useEffect, useState } from "react";
import ConversationList from "../components/ConversationList";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import { getConversations, search } from "../endpoints";
import ConversationSpace from "../components/ConversationSpace";
import SearchBar from "../components/SearchBar";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const { token } = useContext(AuthContext);
  const [selectedConversation, setSelectedConversation] = useState();
  const [conversationOpen, setConversationOpen] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showList, setShowList] = useState(true);

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
      {/* Mobile Navigation Overlay */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsNavOpen(false)}
        ></div>
      )}

      <div className="flex h-screen relative">

        {/* Navbar - Always visible on desktop, toggled on mobile */}
        <div className={`fixed md:relative w-28 shadow-md h-full z-30 transition-transform transform ${isNavOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <Navbar />
        </div>

        {/* Mobile Menu Button */}
        <button className="absolute top-4 left-4 md:hidden z-30" onClick={() => setIsNavOpen(true)}>
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Main Content Wrapper */}
        <div className="flex flex-grow overflow-hidden md:space-x-4">

          {/* Conversations List - Always visible on desktop, toggle on mobile */}
          <div className={`w-full md:w-1/3 p-4 shadow-md md:flex flex-col ${!showList ? "hidden md:flex" : "block"}`}>
            <SearchBar onUserSelect={setSearchedUser} />
            <ConversationList
              conversations={conversations}
              onConversationSelect={(conversation) => {
                handleConversationSelected(conversation);
                setShowList(false); // Hide list and show chat on mobile
              }}
            />
          </div>

          {/* Chat Space - Always visible on desktop, toggle on mobile */}
          <div className={`w-full md:flex-grow p-4 shadow-md  ${showList ? "hidden md:flex" : "block"}`}>
            {conversationOpen ? (
              <ConversationSpace
                conversation={selectedConversation}
                handleClose={() => {
                  handleClose();
                  setShowList(true); // Return to conversation list on mobile
                }}
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

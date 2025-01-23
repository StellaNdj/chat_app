import Contact from "../components/Contact";
import Conversation from "../components/Conversation";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return(
    <>
      <div className="flex justify-around ">
        {/* Navbar section */}
        <Navbar/>

        {/* Contacts */}
        <Contact/>

        {/* Message / Conversation */}
        <Conversation/>
      </div>
    </>
  )
}

export default Dashboard;

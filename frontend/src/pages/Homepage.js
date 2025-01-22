import { Link } from "react-router-dom";

const Homepage = () => {

  return (
    <div className="flex">
      <div className="flex flex-col justify-center p-10">
        <div className="flex align-baseline mb-8">
          <img src='/chat_icon.png' alt='chat-icon' className="w-8"/>
          <h1 className="text-center font-bold text-3xl ml-4">Chatty</h1>
        </div>

        <p className="text-lg">Send messages to all your friends through our chat app.</p>
        <Link to='/login' className="text-lg border border-black p-4 mt-4 w-28">Join now</Link>
      </div>

      <img src='/chat_mu.png' alt='home-img' className="w-1/2"/>

    </div>
  )
}

export default Homepage;

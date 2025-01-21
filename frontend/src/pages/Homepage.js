import { Link } from "react-router-dom";

const Homepage = () => {

  return (
    <div className="flex flex-col justify-center p-10">
      <h1 className="text-center font-bold text-2xl">Chatty</h1>
      <p className="text-center">Join our chat app right now!</p>
      <Link to='/login'>Join now</Link>
    </div>
  )
}

export default Homepage;

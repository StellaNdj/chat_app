import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { ArrowLeftEndOnRectangleIcon, ChatBubbleOvalLeftEllipsisIcon, Cog6ToothIcon, HomeIcon, MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return(
    <>
      <nav className="main-bg h-full bx-sx">
        <Link to='/'><HomeIcon className="size-12 cursor-pointer p-2"/></Link>
        <div>
          <button onClick={toggleTheme}>
            {darkMode ? <SunIcon className="size-12 cursor-pointer p-2"/>: <MoonIcon className="size-12 cursor-pointer p-2"/>}
          </button>
        </div>
        <div>
          <Link to='/profile'><UserCircleIcon className="size-12 cursor-pointer p-2"/></Link>
          <p className="text-center">{user[0].username}</p>
        </div>
        <Link to='/dashboard'><ChatBubbleOvalLeftEllipsisIcon className="size-12 cursor-pointer p-2"/></Link>
        <Cog6ToothIcon className="size-12 cursor-pointer p-2"/>
        <button onClick={() => logout()}>
          <ArrowLeftEndOnRectangleIcon className="size-12 cursor-pointer p-2"/>
        </button>
      </nav>
    </>
  )
}
export default Navbar;

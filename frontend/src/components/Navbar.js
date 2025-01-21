import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const {darkMode, toggleTheme} = useContext(ThemeContext);
  return(
    <>
      <nav>
        <div>
          <button onClick={toggleTheme}>Switch to {darkMode ? 'light': 'dark'} </button>
        </div>
        <div>
          <p>Hey {user.username}</p>
          <button onClick={() => logout()}>Sign out</button>
        </div>
      </nav>
    </>
  )
}
export default Navbar;

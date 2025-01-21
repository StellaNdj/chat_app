import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} >
        <div>
          <label>Username</label>
          <input
            name='username'
            value={formData.username}
            placeholder="Ex: Gin"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </>
  )
}

export default Login;

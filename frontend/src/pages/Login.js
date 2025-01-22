import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Button from "../components/Button";

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
      <div>
        <h1 className="text-4xl bg-blue-950 text-white p-4">Login</h1>
        <div className="flex justify-center m-8">
          <form onSubmit={handleSubmit} >

            <div>
              <label className="block font-medium text-gray-900 text-lg">Username</label>
              <input
                name='username'
                value={formData.username}
                placeholder="Ex: Gin"
                onChange={handleChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 text-lg">Password</label>
              <input
                name='password'
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black rounded-lg"
              />
            </div>

            <div className="flex justify-center my-4">
              <Button type={'submit'} text={'Login'}/>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-600">You don't have an account yet? <Link to='/register' className="hover:underline">Register</Link> </p>

      </div>
    </>
  )
}

export default Login;

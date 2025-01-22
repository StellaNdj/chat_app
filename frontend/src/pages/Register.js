import { useState } from 'react';
import { Link } from 'react-router-dom'
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <div>
        <h1 className="text-4xl bg-blue-950 text-white p-4">Register</h1>
        <div className="flex justify-center m-8">
          <form onSubmit={handleSubmit} >

            <div>
              <label className="block font-medium text-gray-900 text-lg">Username</label>
              <input
                name='username'
                value={formData.username}
                placeholder="Ex: greatest_sorcerer"
                onChange={handleChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 text-lg">First name</label>
              <input
                name='first_name'
                value={formData.first_name}
                placeholder="Ex: Gojo"
                onChange={handleChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 text-lg">Last name</label>
              <input
                name='last_name'
                value={formData.last_name}
                placeholder="Ex: Satoru"
                onChange={handleChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 text-lg">Email</label>
              <input
                name='email'
                value={formData.email}
                placeholder="Ex: gojo@jjk.com"
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
              <Button type='submit' text='Register'/>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-600">Already have an account? <Link to='/login' className="hover:underline">Log in</Link> </p>

      </div>
    </>
  )
}

export default Register;

import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [userFormData, setUserFormData] = useState({
    username: user[0]?.username || "",
    first_name: user[0]?.first_name || "",
    last_name: user[0]?.last_name || "",
    email: user[0]?.email || "",
  })

  const handleInfoChange = (e) => {
    const {name, value} = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleInfoSubmit = (e) => {
    e.preventDefault();

  }

  const [profileFormData, setProfileFormData] = useState(

  )

  if (!user) return <div>Loading...</div>

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Navbar section */}
      <div className="w-28 md:w-28 lg:w-28 h-full fixed md:relative flex-shrink-0">
        <Navbar/>
      </div>

      <div>
        {/* Edit profile */}
        <h2 className='font-bold'>Edit your profile</h2>
        <form>
          <input type='file' accept="image/*"/>
          <button type='submit'>Update</button>
        </form>

        {/* Edit user infos */}
        <h2 className='font-bold'>Edit your infos</h2>
        <form onSubmit={handleInfoSubmit}>
        <div className="font-medium text-lg flex w-full m-2">
              <label className="mx-8 w-28" >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={userFormData.username}
                onChange={handleInfoChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black"
              />
            </div>

            <div className="font-medium text-lg flex w-full m-2">
              <label className="mx-8 w-28" >
                First Name
              </label>
                <input
                  type="text"
                  name="first_name"
                  value={userFormData.first_name}
                  onChange={handleInfoChange}
                  required
                  className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black"
                />
            </div>

            <div className="font-medium text-lg flex w-full m-2">
              <label className="mx-8 w-28" >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={userFormData.last_name}
                onChange={handleInfoChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black"
              />
            </div>

            <div className="font-medium text-lg flex w-full m-2">
              <label className="mx-8 w-28">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userFormData.email}
                onChange={handleInfoChange}
                required
                className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6 border border-black"
              />
            </div>
            <button>Update infos</button>
        </form>
      </div>

    </div>
  )
}

export default Profile

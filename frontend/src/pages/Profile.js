import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from '../components/Navbar';
import { privateProfile, updateUserInfos } from "../endpoints";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: user[0]?.username || "",
    first_name: user[0]?.first_name || "",
    last_name: user[0]?.last_name || "",
    email: user[0]?.email || "",
  });

  const handleInfoChange = (e) => {
    const {name, value} = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleInfoSubmit = async (e) => {
    e.preventDefault();

    const response = await updateUserInfos({token: token, userId: user[0]?.id, formData: userFormData})
    if (response) {
      console.log('Here is the response:', response);
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    const formData = new FormData()
    if (file) formData.append('image', file)
  }

  const fetchProfilePic = async () => {
    const response = await privateProfile({token: token});
    console.log(response.image_url);
    setImageUrl(response.image_url);
  }

  useEffect(() => {
    fetchProfilePic();
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Navbar section */}
      <div className="w-28 md:w-28 lg:w-28 h-full fixed md:relative flex-shrink-0">
        <Navbar/>
      </div>

      <div className="m-10">
        <div className="my-4">
          {/* Edit profile */}
          <img src={`http://localhost:8000/api${imageUrl}`} alt='Profile pic' className="w-24 h-24 rounded-full object-cover shadow-sm"/>
          <h2 className='font-bold text-lg'>Edit your profile pic</h2>
          <form>
            <div className="font-medium text-lg flex w-full m-2">
              <input type='file' onChange={handleFileChange} accept="image/*"/>
            </div>
            <button type='submit' className='btn'>Update profile pic</button>
          </form>
        </div>

        <div className="my-4">
          {/* Edit user infos */}
          <h2 className='font-bold text-lg'>Edit your infos</h2>
          <form onSubmit={handleInfoSubmit}>
          <div className="font-medium text-lg flex w-full m-2">
                <label className="mr-8 w-28" >
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
                <label className="mr-8 w-28" >
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
                <label className="mr-8 w-28" >
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
                <label className="mr-8 w-28">
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
              <button type='submit' className='btn'>Update infos</button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Profile

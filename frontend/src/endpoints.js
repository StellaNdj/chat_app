import axios from 'axios';

// API endpoints

// API root
const APIroot = 'http://localhost:8000/api';


// Register a new user
export const register = async ({ username, first_name, last_name, email, password }) => {
  try {
    const response = await axios.post(`${APIroot}/register/`,
      {username, last_name, first_name, email, password}
    );
    const loginResponse = await loginUser({username, password});
    return { registration: response.data, token: loginResponse }
  } catch (error) {
    console.log('Error while registering and logging in the user', error);
  }
}

// Login an existing user
export const loginUser = async ({ username, password }) => {
  try {
    const response = await axios.post(`${APIroot}/token/`,
      {username, password}
    );
    return response.data;
  } catch (error) {
    console.log('Error while generating token via login', error);
  }
}

// Retrieve user details
export const userDetails = async ({token}) => {
  try {
    const response = await axios.get(`${APIroot}/user/`,
      {
        headers : {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error while retrieving user details', error)
  }
}

// Get the user conversations
export const getConversations = async ({token}) => {
  try {
    const response = await axios.get(`${APIroot}/conversations/`,
      {
        headers : {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log('Error while retrieving conversations', error)
  }
}

// Send a new message
export const newMessage = async ({token, participants, content}) => {

  try {
    const response = await axios.post(`${APIroot}/messages/`,
      { participants, content },
      {
        headers : {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.log('Error while sending a new message', error)
  }
}

// Get the logged in user profile
export const privateProfile = async ({token}) => {
  try {
    const response = await axios.get(`${APIroot}/profile/`,
      {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.log('Error while fetching the private profile')
  }
}

// Get the public profiles
export const publicProfiles = async ({token, username}) => {
  try {
    const response = await axios.get(`${APIroot}/public_profile/?username=${username}`,
      {
        headers : {
          'Authorization' : `Bearer ${token}`
        }
      }
    );
    return response.data[0];
  } catch (error) {
    console.log('Error while fetching user profile', error)
  }
}

// Search by username
export const search = async ({token, username}) => {
  try {
    const response = await axios.get(`${APIroot}/search/?q=${username}`,
      {
        headers : {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('Error while searching', error)
  }
}

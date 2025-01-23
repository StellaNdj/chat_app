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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log('Error while retrieving conversations', error)
  }
}

/*
 * The Api.js file represents the configuration for Axios.
 */
import axios from "axios";

// Configure axios
export default axios.create({
  // Initialize the Axios Base URL as the Backend URL from the environment
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // See (https://stackoverflow.com/questions/57305141/react-django-rest-framework-session-is-not-persisting-working)
  withCredentials: true,
});

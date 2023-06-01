/*
 * The Api.js file represents the configuration for Axios.
 */
import axios from "axios";

// Retrieve the Backend URL from the environment and initialize Axios with it
export default axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

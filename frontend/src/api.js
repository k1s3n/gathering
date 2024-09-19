import axios from 'axios';

const API = axios.create({
  baseURL: 'http://backend-server:4000',
  
});

export default API;
 
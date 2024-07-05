import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/', 
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
  }
});

export default axiosInstance;

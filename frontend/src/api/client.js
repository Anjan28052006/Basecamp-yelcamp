import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
    baseURL,
    withCredentials: true,
});

export function apiErrorMessage(err) {
    return err?.response?.data?.message || err?.message || 'Something went wrong';
}

export default client;

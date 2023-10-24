import axios from 'axios';

const AxiosIntance = () => {
    const axiosIntance = axios.create({
        baseURL: 'https://api-graduation-project.vercel.app/'
    });
    axiosIntance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err),
    );
    return axiosIntance;
}

export default AxiosIntance;
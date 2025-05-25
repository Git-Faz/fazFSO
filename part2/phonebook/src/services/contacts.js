import axios from "axios";

const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    const req = axios.get(baseUrl);
    return req.then(response => response.data)
}

const add = (contactInfo) =>{
    const req = axios.post(baseUrl,contactInfo)
    return req.then(response => response.data)
}

const  remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, contactInfo) => {
    const req = axios.put(`${baseUrl}/${id}`, contactInfo)
    return req.then(response => response.data)
}
export default {getAll, add, remove, update};
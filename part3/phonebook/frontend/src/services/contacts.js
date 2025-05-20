import axios from "axios";

const baseUrl = '/api/persons';

const getAll = () => {
    const req = axios.get(baseUrl);
    return req.then(response => response.data)
}

const add = (contactInfo) =>{
    const req = axios.post(baseUrl,contactInfo)
    return req.then(response => response.data)
}

const  remove = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`)
    return req.then(response => response.data)
}

const update = (id, contactInfo) => {
    const req = axios.put(`${baseUrl}/${id}`, contactInfo)
    return req.then(response => response.data)
}
export default {getAll, add, remove, update};
import axios from "axios";

const Api = axios.create({
	baseURL: "http://localhost:5045",
	withCredentials: true
})

export default Api
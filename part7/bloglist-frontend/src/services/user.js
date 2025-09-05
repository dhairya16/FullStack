import axios from 'axios'
const baseUrl = '/api/users'

// let token = null

// const setToken = (newToken) => {
//   token = `Bearer ${newToken}`
// }

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

// const create = async (blogData) => {
//   const config = {
//     headers: { Authorization: token },
//   }
//   const response = await axios.post(baseUrl, blogData, config)
//   return response.data
// }

// const update = async (blogData) => {
//   const config = {
//     headers: { Authorization: token },
//   }
//   const url = `${baseUrl}/${blogData.id}`
//   const response = await axios.put(url, blogData, config)
//   return response.data
// }

// const deleteBlog = async (id) => {
//   const config = {
//     headers: { Authorization: token },
//   }
//   const url = `${baseUrl}/${id}`
//   const response = await axios.delete(url, config)
//   return response.data
// }

export default { getAll }

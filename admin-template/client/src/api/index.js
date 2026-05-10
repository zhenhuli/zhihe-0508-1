import request from '@/utils/request'

export const login = (data) => request.post('/auth/login', data)
export const getProfile = () => request.get('/auth/profile')
export const updateProfile = (data) => request.put('/auth/profile', data)
export const updatePassword = (data) => request.put('/auth/password', data)
export const getMenus = () => request.get('/auth/menus')

export const getUsers = (params) => request.get('/users', { params })
export const getUser = (id) => request.get(`/users/${id}`)
export const createUser = (data) => request.post('/users', data)
export const updateUser = (id, data) => request.put(`/users/${id}`, data)
export const deleteUser = (id) => request.delete(`/users/${id}`)

export const getProducts = (params) => request.get('/products', { params })
export const getProduct = (id) => request.get(`/products/${id}`)
export const createProduct = (data) => request.post('/products', data)
export const updateProduct = (id, data) => request.put(`/products/${id}`, data)
export const deleteProduct = (id) => request.delete(`/products/${id}`)

export const getOrders = (params) => request.get('/orders', { params })
export const getOrder = (id) => request.get(`/orders/${id}`)
export const createOrder = (data) => request.post('/orders', data)
export const updateOrder = (id, data) => request.put(`/orders/${id}`, data)
export const deleteOrder = (id) => request.delete(`/orders/${id}`)

export const getLogs = (params) => request.get('/logs', { params })
export const search = (keyword) => request.get('/search', { params: { keyword } })

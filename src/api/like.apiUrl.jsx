import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getLikeAPI = (params) => axios.get(API_URL.LIKE, { params });

export const toggleLikeAPI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(API_URL.TOGGLE_LIKE, params, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
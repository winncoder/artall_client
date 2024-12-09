import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getFollowAPI = (params) => {
	return axios.get(API_URL.FOLLOW, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const toggleFollowAPI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(API_URL.TOGGLE_FOLLOW, params, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				'ngrok-skip-browser-warning': 'true',
			},
		});
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteFollowAPI = (followId) => {
	const access_token = localStorage.getItem('access_token');
	const url = `${API_URL.FOLLOW}/${followId}`;
	console.log('Request URL:', url); // Log URL trước khi thực hiện request

	try {
		const response = axios.delete(url, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				'ngrok-skip-browser-warning': 'true',
			},
		});
		return response;
	} catch (error) {
		console.log('Error:', error);
		throw error;
	}
};

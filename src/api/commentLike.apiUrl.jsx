import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getCommentLikeAPI = (params) =>
	axios.get(API_URL.COMMENTLIKE, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});

export const toggleCommentLikeAPI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(API_URL.TOGGLE_COMMENTLIKE, params, {
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

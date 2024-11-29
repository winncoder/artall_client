import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getCommentLikeAPI = (params) =>
	axios.get(API_URL.COMMENTLIKE, { params });

export const toggleCommentLikeAPI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(API_URL.TOGGLE_COMMENTLIKE, params, {
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

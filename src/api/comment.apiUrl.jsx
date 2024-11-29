import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getCommentAPI = (params, access_token) => {
	return axios.get(API_URL.COMMENT, {
		params,
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
};

export const postCommentAPI = (params) => {
	const formData = new FormData();

	for (const key in params) {
		if (key === 'mediaPath') {
			params.mediaPath.forEach((file) => formData.append('mediaPath', file));
		} else {
			formData.append(key, params[key]);
		}
	}

	try {
		const response = axios.post(API_URL.COMMENT, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const patchCommentAPI = (commentId, params) => {
	const access_token = localStorage.getItem('access_token');
	const formData = new FormData();
	for (const key in params) {
		if (key === 'mediaPath') {
			params.mediaPath.forEach((file) => formData.append('mediaPath', file));
		} else {
			formData.append(key, params[key]);
		}
	}
	try {
		const response = axios.patch(`${API_URL.COMMENT}/${commentId}`, formData, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'multipart/form-data',
			},
		});
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteCommentAPI = (commentId) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.delete(`${API_URL.COMMENT}/${commentId}`, {
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

import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getPostsAPI = (params, access_token) => {
	return axios.get(API_URL.POST, {
		params,
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
};

export const getTotalPostsAPI = (params, access_token) => {
	return axios.get(`${API_URL.POST}/total`, {
		params,
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
};

export const getPostsDeletedAPI = (params, access_token) => {
	return axios.get(`${API_URL.POST}/deleted`, {
		params,
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
};

export const getRandomPostsAPI = (params, access_token) => {
	return axios.get(API_URL.RANDOM_POST, {
		params,
		headers: {
			Authorization: `Bearer ${access_token}`,
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const getPostDetailAPI = (postId, access_token) => {
	return axios.get(`${API_URL.POST}/${postId}`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
};

export const postPostAPI = (params) => {
	const formData = new FormData();

	for (const key in params) {
		if (key === 'mediaPath') {
			params.mediaPath.forEach((file) => formData.append('mediaPath', file));
		} else {
			formData.append(key, params[key]);
		}
	}

	try {
		const response = axios.post(API_URL.POST, formData, {
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

export const patchPostAPI = (postId, params) => {
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
		const response = axios.patch(`${API_URL.POST}/${postId}`, formData, {
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

export const deletePostAPI = (postId) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.delete(`${API_URL.POST}/${postId}`, {
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

export const postRestorePostAPI = (postId) => {
	try {
		const response = axios.post(`${API_URL.POST}/${postId}/restore`);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

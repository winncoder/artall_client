import axios from 'axios';
import { API_URL } from '../constants/constant';

// USER
export const getUsersAPI = (params) => {
	return axios.get(`${API_URL.USER}`, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const getTotalUsersAPI = (params) => {
	return axios.get(`${API_URL.USERINFO}/total`, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const getUsersDeletedAPI = (params) => {
	return axios.get(`${API_URL.USER}/deleted`, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const getUserDetailAPI = (userId) => {
	return axios.get(`${API_URL.USER}/${userId}`, {
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const postUserApI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(API_URL.REGISTER, params, {
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

// USER INFO
export const getUsersInfoAPI = (params) => {
	return axios.get(API_URL.USERINFO, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const getSuggestedUsersAPI = (params) => {
	return axios.get(API_URL.SUGGESTED, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true', // Thêm header này
		},
	});
};

export const getUserInfoDetailAPI = (userId) => {
	return axios.get(`${API_URL.USERINFO}/${userId}`, {
		headers: {
			'ngrok-skip-browser-warning': 'true', // Thêm header này
		},
	});
};

export const patchUserInfoAPI = (userId, params) => {
	const access_token = localStorage.getItem('access_token');
	const formData = new FormData();

	console.log('Params before appending to FormData:', params);
	for (const key in params) {
		if (key === 'profilePicture') {
			formData.append('profilePicture', params.profilePicture);
		} else {
			formData.append(key, params[key]);
		}
	}
	try {
		const response = axios.patch(`${API_URL.USERINFO}/${userId}`, formData, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'multipart/form-data',
				'ngrok-skip-browser-warning': 'true',
			},
		});
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteUserInfoAPI = (userId) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.delete(`${API_URL.USERINFO}/${userId}`, {
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

// USER PROFILE
export const patchUserProfileAPI = (userProfileId, params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.patch(
			`${API_URL.USERPROFILE}/${userProfileId}`,
			params,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
					'ngrok-skip-browser-warning': 'true',
				},
			},
		);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getUserDemographicsAPI = (params) => {
	return axios.get(`${API_URL.USERPROFILE}/demographics`, {
		params,
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const postRestoreUserAPI = (userId) => {
	try {
		const response = axios.post(
			`http://localhost:3001/api/user-info/${userId}/restore`,
			{
				headers: {
					'ngrok-skip-browser-warning': 'true',
				},
			},
		);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

import axios from 'axios';
import { API_URL } from '../constants/constant';

// USER
export const getUsersAPI = (params) => {
	return axios.get(`${API_URL.USER}`, { params });
};

export const getTotalUsersAPI = (params) => {
	return axios.get(`${API_URL.USERINFO}/total`, { params });
};

export const getUsersDeletedAPI = (params) => {
	return axios.get(`${API_URL.USER}/deleted`, { params });
};

export const getUserDetailAPI = (userId) => {
	return axios.get(`${API_URL.USER}/${userId}`);
};

export const postUserApI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(API_URL.REGISTER, params, {
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

//USER INFO
export const getUsersInfoAPI = (params) => {
	return axios.get(API_URL.USERINFO, { params });
};

export const getSuggestedUsersAPI = (params) => {
	return axios.get(API_URL.SUGGESTED, { params });
};

export const getUserInfoDetailAPI = (userId) => {
	return axios.get(`${API_URL.USERINFO}/${userId}`);
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
	return axios.get(`${API_URL.USERPROFILE}/demographics`, { params });
};

import axios from 'axios';
import { API_URL } from '../constants/constant';

export const getDonationsAPI = (params, access_token) => {
	return axios.get(API_URL.DONATION, {
		params,
		headers: {
			Authorization: `Bearer ${access_token}`,
			'ngrok-skip-browser-warning': 'true',
		},
	});
};

export const postPaymentAPI = (params) => {
	const access_token = localStorage.getItem('access_token');
	try {
		const response = axios.post(
			`http://localhost:3002/api/donation/payment`,
			params,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
					'ngrok-skip-browser-warning': 'true',
				},
			},
		);
		console.log('responseURL', response);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getDonationStatusAPI = (app_trans_id, amount, userId, postId) => {
	return axios.get(
		`http://localhost:3002/api/donation/order-status/${app_trans_id}`,
		{
			params: {
				amount,
				userId,
				postId,
			},
		},
	);
};

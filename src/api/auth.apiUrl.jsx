import axios from 'axios';
import { API_URL } from '../constants/constant';

export const postAuthAPI = (params) =>
	axios.post(`${API_URL.AUTH}/login`, params, {
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});

export const postAuthGoogleAPI = (params) =>
	axios.get(API_URL.AUTH_GOOGLE, params, {
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});

export const postForgotPassAPI = (params) =>
	axios.post(`${API_URL.AUTH}/forgot-password`, params, {
		headers: {
			'ngrok-skip-browser-warning': 'true',
		},
	});

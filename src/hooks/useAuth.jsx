import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/queryKey';
import { postAuthAPI, postForgotPassAPI } from '../api/auth.apiUrl';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

export const usePostAuth = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (auth) => postAuthAPI(auth),
		onSuccess: (data) => {
			message.success('Login success');
			localStorage.setItem('access_token', data.data.access_token);
			const access_token = localStorage.getItem('access_token');
			const role = jwtDecode(access_token).role;
			switch (role) {
				case 'user': {
					navigate('/');
					break;
				}
				case 'admin': {
					navigate('/admin');
					break;
				}
				default: {
					navigate('/guest');
					break;
				}
			}
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AUTH] });
		},
		onError: (error) => {
			if (error.response && error.response.status === 401) {
				message.error('Wrong username or password');
			} else {
				message.error('An error occurred. Please try again later.');
			}
		},
	});
};

export const useForgotPass = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (forgotPassword) => postForgotPassAPI(forgotPassword),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.AUTH] });
			console.log('Send mail to reset password success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useCheckAuthentication = () => {
	const navigate = useNavigate();
	const access_token = localStorage.getItem('access_token');
	useEffect(() => {
		if (access_token) {
			const decodedToken = jwtDecode(access_token);
			switch (decodedToken.role) {
				case 'user': {
					navigate('/');
					break;
				}
				default: {
					navigate('/guest');
					break;
				}
			}
		}
	}, [access_token, navigate]);
};

export const useCheckAuthorization = (role) => {
	const navigate = useNavigate();
	const access_token = localStorage.getItem('access_token');
	useEffect(() => {
		if (!access_token) {
			console.log('No token');
			navigate('/guest');
		} else {
			const decodedToken = jwtDecode(access_token);
			const tokenRole = decodedToken.role;
			if (role !== tokenRole) {
				console.log('Wrong token');
				navigate('/403');
			}
		}
	}, [access_token, navigate, role]);
};

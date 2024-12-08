import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getDonationsAPI,
	postPaymentAPI,
	getDonationStatusAPI,
} from '../api/donation.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';

export const useGetDonations = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [QUERY_KEY.DONATION, params.page, params.take, params.postId],
		queryFn: async () => {
			const { data } = await getDonationsAPI(params, access_token);
			return data;
		},
	});
};

export const useGetDonationStatus = (app_trans_id, amount, userId, postId) => {
	return useQuery({
		queryKey: [QUERY_KEY.DONATION_STATUS, app_trans_id, amount, userId, postId],
		queryFn: async () => {
			const { data } = await getDonationStatusAPI(
				app_trans_id,
				amount,
				userId,
				postId,
			);
			console.log('data', data);
			return data;
		},
	});
};

export const usePaymentZaloPay = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (donate) => postPaymentAPI(donate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PAYMENT] });
			console.log('Donating');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

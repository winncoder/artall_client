import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getLikeAPI, toggleLikeAPI } from '../api/like.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';

export const useGetLikes = (params) => {
	return useQuery({
		queryKey: [QUERY_KEY.LIKE, params.page, params.take, params.post],
		queryFn: async () => {
			const { data } = await getLikeAPI(params);
			return data;
		},
	});
};

export const useToggleLike = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (toggleLike) => toggleLikeAPI(toggleLike),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LIKE] });
			console.log('Toggle Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

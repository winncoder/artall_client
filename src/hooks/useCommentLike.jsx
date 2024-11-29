import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getCommentLikeAPI,
	toggleCommentLikeAPI,
} from '../api/commentLike.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';

export const useGetCommentLikes = (params) => {
	return useQuery({
		queryKey: [QUERY_KEY.LIKECOMMENT, params.page, params.take, params.comment],
		queryFn: async () => {
			const { data } = await getCommentLikeAPI(params);
			return data;
		},
	});
};

export const useToggleCommentLike = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (toggleCommentLike) => toggleCommentLikeAPI(toggleCommentLike),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LIKECOMMENT] });
			console.log('Toggle Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

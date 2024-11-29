import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getFollowAPI,
	toggleFollowAPI,
	deleteFollowAPI,
} from '../api/follow.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';

export const useGetFollows = (params) => {
	return useQuery({
		queryKey: [
			QUERY_KEY.FOLLOW,
			params.page,
			params.take,
			params.follower,
			params.following,
			params.followerUsername,
			params.followingUsername,
		],
		queryFn: async () => {
			const { data } = await getFollowAPI(params);
			return data;
		},
	});
};

export const useToggleFollow = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (toggleFollow) => toggleFollowAPI(toggleFollow),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FOLLOW] });
			console.log('Toggle Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useDeleteFollow = (id) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: () => deleteFollowAPI(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FOLLOW] });
			console.log('Delete Success');
		},
		onError: ({ response }) => {
			console.log(response);
		},
	});
	return mutation;
};

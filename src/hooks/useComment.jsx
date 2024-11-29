import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getCommentAPI,
	postCommentAPI,
	patchCommentAPI,
	deleteCommentAPI,
} from '../api/comment.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';

export const useGetComments = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [QUERY_KEY.COMMENT, params.page, params.take, params.postId],
		queryFn: async () => {
			const { data } = await getCommentAPI(params, access_token);
			return data;
		},
	});
};

export const useCreateComment = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (createComment) => postCommentAPI(createComment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COMMENT] });
			console.log('Create Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useUpdateComment = (commentId) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (updateComment) => patchCommentAPI(commentId, updateComment),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.POST] });
			console.log('Update Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useDeleteComment = (id) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: () => deleteCommentAPI(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.COMMENT] });
			console.log('Delete Success');
		},
		onError: ({ response }) => {
			console.log(response);
		},
	});
	return mutation;
};

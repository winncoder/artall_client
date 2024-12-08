import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getPostsAPI,
	getTotalPostsAPI,
	getRandomPostsAPI,
	getPostDetailAPI,
	postPostAPI,
	patchPostAPI,
	deletePostAPI,
	getPostsDeletedAPI,
	postRestorePostAPI,
} from '../api/post.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';
import { useContext } from 'react';
import { PostContext } from '../components/context/PostContext';

export const useGetPostTotal = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [QUERY_KEY.POST, params?.period],
		queryFn: async () => {
			try {
				const { data } = await getTotalPostsAPI(params, access_token);
				return data;
			} catch (error) {
				console.log(error);
			}
		},
	});
};

export const useGetPosts = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [
			QUERY_KEY.POST,
			params?.page,
			params?.take,
			params?.content,
			params?.userIdProfile,
		],
		queryFn: async () => {
			try {
				const { data } = await getPostsAPI(params, access_token);
				return data;
			} catch (error) {
				console.log(error);
			}
		},
	});
};

export const useGetPostsDeleted = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [
			QUERY_KEY.POST_DELETED,
			params?.page,
			params?.take,
			params?.content,
		],
		queryFn: async () => {
			const { data } = await getPostsDeletedAPI(params, access_token);
			return data;
		},
	});
};

export const useGetRandomPosts = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [QUERY_KEY.POST, params?.page, params?.take],
		queryFn: async () => {
			const { data } = await getRandomPostsAPI(params, access_token);
			return data;
		},
	});
};

export const useGetPostDetail = (id) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [QUERY_KEY.POST, id],
		queryFn: async () => {
			const { data } = await getPostDetailAPI(id, access_token);
			return data;
		},
	});
};

export const useCreatePost = () => {
	const { addPost } = useContext(PostContext);
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (createPost) => postPostAPI(createPost),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.POST] });
			console.log('Create Success: ', data);
			addPost(data.data);
			return data;
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useUpdatePost = (postId) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (updatePost) => patchPostAPI(postId, updatePost),
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

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (id) => deletePostAPI(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.POST] });
			console.log('Delete Success');
		},
		onError: ({ response }) => {
			console.log(response);
		},
	});

	return mutation;
};

export const useRestorePost = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({ postId }) => postRestorePostAPI(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.POST_RESTORE] });
			console.log('Restore Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

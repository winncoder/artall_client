import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
	getUsersAPI,
	getTotalUsersAPI,
	getUsersDeletedAPI,
	getUsersInfoAPI,
	getSuggestedUsersAPI,
	postUserApI,
	getUserInfoDetailAPI,
	deleteUserInfoAPI,
	getUserDetailAPI,
	patchUserInfoAPI,
	patchUserProfileAPI,
	getUserDemographicsAPI,
	postRestoreUserAPI,
} from '../api/user.apiUrl';
import { QUERY_KEY } from '../constants/queryKey';

// USER
export const useGetUserTotal = (params) => {
	return useQuery({
		queryKey: [QUERY_KEY.USER, params?.period],
		queryFn: async () => {
			const { data } = await getTotalUsersAPI(params);
			return data;
		},
	});
};

export const useGetUsers = (params) => {
	return useQuery({
		queryKey: [QUERY_KEY.USER, params?.page, params?.take, params?.username],
		queryFn: async () => {
			const { data } = await getUsersAPI(params);
			return data;
		},
	});
};

export const useGetUsersDeleted = (params) => {
	const access_token = localStorage.getItem('access_token');
	return useQuery({
		queryKey: [
			QUERY_KEY.POST_DELETED,
			params?.page,
			params?.take,
			params?.username,
		],
		queryFn: async () => {
			const { data } = await getUsersDeletedAPI(params, access_token);
			return data;
		},
	});
};

export const useGetUsersDetal = (id) => {
	return useQuery({
		queryKey: [QUERY_KEY.USER, id],
		queryFn: async () => {
			const { data } = await getUserDetailAPI(id);
			return data;
		},
	});
};

export const useRegisterUser = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (createUser) => postUserApI(createUser),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
			console.log('Create Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

// USER INFO
export const useGetUsersInfo = (params) => {
	return useQuery({
		queryKey: [
			QUERY_KEY.USERINFO,
			params?.page,
			params?.take,
			params?.username,
		],
		queryFn: async () => {
			const { data } = await getUsersInfoAPI(params);
			return data;
		},
	});
};

export const useGetSuggestedUsers = (params) => {
	return useQuery({
		queryKey: [QUERY_KEY.USERINFO, params?.page, params?.take],
		queryFn: async () => {
			const { data } = await getSuggestedUsersAPI(params);
			return data;
		},
	});
};

export const useGetUsersInfoDetal = (id) => {
	return useQuery({
		queryKey: [QUERY_KEY.USERINFO, id],
		queryFn: async () => {
			const { data } = await getUserInfoDetailAPI(id);
			return data;
		},
	});
};

export const useUpdateUserInfo = (userInfoId) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (updateUserInfo) =>
			patchUserInfoAPI(userInfoId, updateUserInfo),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERINFO] });
			console.log('Update Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useDeleteUserInfo = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (id) => deleteUserInfoAPI(id),
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

// USER PROFILE
export const useUpdateUserProfile = (userProfileId) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (updateUserProfile) =>
			patchUserProfileAPI(userProfileId, updateUserProfile),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERPROFILE] });
			console.log('Update Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

export const useGetUserDemographics = (params) => {
	return useQuery({
		queryKey: [QUERY_KEY.USER_DEMOGRAPHIC],
		queryFn: async () => {
			const { data } = await getUserDemographicsAPI(params);
			return data;
		},
	});
};

export const useRestoreUser = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({ userId }) => postRestoreUserAPI(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_RESTORE] });
			console.log('Restore Success');
		},
		onError: (response) => {
			console.log(response);
		},
	});
	return mutation;
};

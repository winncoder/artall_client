import { Outlet } from 'react-router-dom';
import UserLayout from '../components/layout/UserLayout';
import UserHome from '../pages/user/UserHome';
import UserProfile from '../pages/user/profile/UserProfile';
import UpdateUserProfile from '../pages/user/profile/update/UpdateUserProfile';
import UpdateUserPassword from '../pages/user/profile/update/UpdateUserPassword';
import ListMessage from '../pages/user/message/list/ListMessage';
import PostDetail from '../pages/user/post/detail/PostDetail';
import ZaloStatus from '../pages/user/donate/status/ZaloStatus';

const UserRouter = [
	{
		path: '',
		element: <Outlet />,
		children: [
			{
				element: <UserLayout />,
				children: [
					{
						path: '',
						element: <UserHome />,
					},
					{
						path: 'profile/:userId',
						element: <UserProfile />,
					},
					{
						path: 'profile/edit',
						element: <UpdateUserProfile />,
					},
					{
						path: 'profile/change-password',
						element: <UpdateUserPassword />,
					},
					{
						path: 'message',
						element: <ListMessage />,
					},
					{
						path: 'post/:postId',
						element: <PostDetail />,
					},
					{
						path: 'zalo/status',
						element: <ZaloStatus />,
					},
				],
			},
		],
	},
];

export default UserRouter;

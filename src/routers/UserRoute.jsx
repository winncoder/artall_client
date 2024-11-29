import { Outlet } from 'react-router-dom';
import UserLayout from '../components/layout/UserLayout';
import UserHome from '../pages/user/UserHome';
import UserProfile from '../pages/user/profile/UserProfile';
import UpdateUserProfile from '../pages/user/profile/update/UpdateUserProfile';
import UpdateUserPassword from '../pages/user/profile/update/UpdateUserPassword';
import ListMessage from '../pages/user/message/list/ListMessage';

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
				],
			},
		],
	},
];

export default UserRouter;

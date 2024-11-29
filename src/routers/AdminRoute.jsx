import { Outlet } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ListAccount from '../pages/admin/account/list/ListAccount';
import ListPost from '../pages/admin/post/list/ListPost';
import UpdateAccount from '../pages/admin/account/update/UpdateAccount';

const AdminRouter = [
	{
		path: '',
		element: <Outlet />,
		children: [
			{
				element: <AdminLayout />,
				children: [
					{
						path: '',
						element: <AdminDashboard />,
					},
					{
						path: 'account',
						element: <ListAccount />,
					},
					{
						path: 'post',
						element: <ListPost />,
					},
					{
						path: 'account/:id',
						element: <UpdateAccount />,
					},
				],
			},
		],
	},
];

export default AdminRouter;

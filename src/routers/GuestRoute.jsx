import { Outlet } from 'react-router-dom';
import GuestLayout from '../components/layout/GuestLayout';
import GuestHome from '../pages/guest/GuestHome';

const GuestRouter = [
	{
		element: <Outlet />,
		children: [
			{
				element: <GuestLayout />,
				children: [
					{
						path: '',
						element: <GuestHome />,
					},
				],
			},
		],
	},
];

export default GuestRouter;

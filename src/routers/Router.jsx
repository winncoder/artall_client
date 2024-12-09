import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import ForgotPass from '../pages/forgotPass/forgot/ForgotPass';
import ResetPass from '../pages/forgotPass/reset/ResetPass';
import UserRouter from './UserRoute';
import GuestRouter from './GuestRoute';
import Error404 from '../pages/error/Error404';
import Error401 from '../pages/error/Error401';
import Error403 from '../pages/error/Error403';
import AdminRouter from './AdminRoute';

const Router = createBrowserRouter([
	{
		path: '',
		errorElement: <Error404 />,
		children: [
			{
				path: '',
				children: [...UserRouter],
			},
			{
				path: 'admin',
				children: [...AdminRouter],
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'signup',
				element: <Register />,
			},
			{
				path: 'forgot-password',
				element: <ForgotPass />,
			},
			{
				path: 'reset-password',
				element: <ResetPass />,
			},
			{
				path: '401',
				element: <Error401 />,
			},
			{
				path: '403',
				element: <Error403 />,
			},
		],
	},
]);

export default Router;

import LoginPage from '../pages/login/Login';
import HomePage from '../pages/home/Home';
import { createBrowserRouter } from 'react-router-dom';
const Router = createBrowserRouter([
	{
		path: '',
		// errorElement: <Error404 />,
		children: [
			{
				path: '',
				element: <HomePage />,
			},
			{
				path: 'login',
				element: <LoginPage />,
			},
		],
	},
]);

export default Router;

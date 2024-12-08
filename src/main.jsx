import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import axios from 'axios';
import Router from './routers/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './Main.css';

const queryClient = new QueryClient();

axios.defaults.baseURL =
	'https://57d8-2402-800-6294-490a-60b6-14fb-fa90-9eaa.ngrok-free.app/api/';

ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<Suspense fallback={<div>Loading...</div>}>
			<RouterProvider router={Router} />
		</Suspense>
	</QueryClientProvider>,
);

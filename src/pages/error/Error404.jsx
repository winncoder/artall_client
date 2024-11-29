import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function Error404() {
	const navigate = useNavigate();

	const handleBackHome = () => {
		navigate('/');
	};

	return (
		<Result
			style={{
				height: '100vh',
				width: '100vw',
				position: 'fixed',
				top: 0,
				left: 0,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
			icon={
				<img
					src="https://www.dpmarketingcommunications.com/wp-content/uploads/2016/11/404-Page-Featured-Image.png"
					style={{ width: '50%', height: 'auto' }}
					alt="Error 404"
				/>
			}
			subTitle="Sorry, the page you visited does not exist."
			extra={<Button onClick={handleBackHome}>Back Home</Button>}
		/>
	);
}

export default Error404;

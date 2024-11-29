import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function Error401() {
	const navigate = useNavigate();

	const handleBackHome = () => {
		navigate('/login');
	};

	return (
		<Result
			style={{
				height: '100vh',
				width: '100vw',
				position: 'fixed',
				top: 0,
				left: 0,
				backgroundColor: '#E5F6FE',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
			icon={
				<img
					src="https://res.cloudinary.com/detqcm2nt/image/upload/v1713031807/error_xvfmg1.png"
					alt="Error 401"
				/>
			}
			subTitle="Sorry, you are not logged in to your account."
			extra={<Button onClick={handleBackHome}>Back Login</Button>}
		/>
	);
}

export default Error401;

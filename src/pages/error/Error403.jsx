import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function Error403() {
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
				backgroundColor: '#FFF3EC',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
			icon={
				<img
					src="https://res.cloudinary.com/detqcm2nt/image/upload/v1713032483/error3_basdxy.png"
					alt="Error 403"
				/>
			}
			subTitle="Sorry, you do not have permission to access this page."
			extra={<Button onClick={handleBackHome}>Back Home</Button>}
		/>
	);
}

export default Error403;

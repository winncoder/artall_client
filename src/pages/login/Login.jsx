import './Login.css';
import { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Button } from 'antd';
import { useCheckAuthentication, usePostAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../../components/loading/loadingbar/LoadingBar';

const { Title } = Typography;

function LoginPage() {
	const navigate = useNavigate();
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');

		if (token) {
			localStorage.setItem('access_token', token);
			navigate('/');
		}
	}, [navigate]);

	const [user, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const { mutate: userLogin } = usePostAuth();
	useCheckAuthentication();

	const handleLogin = () => {
		setIsLoading(true);
		console.log('Username:', user.username);
		console.log('Password:', user.password);

		userLogin({
			...user,
		}).finally(() => {
			setIsLoading(false);
		});
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	const handleSignUpRedirect = () => {
		navigate('/signup');
	};

	const handleForgotPassRedirect = () => {
		navigate('/forgot-password');
	};

	return (
		<>
			<LoadingBar isLoading={isLoading} />
			<Row
				className="Row"
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Row className="background-image"></Row>
					<Title level={2}>Login with your account</Title>

					<Row gutter={[0, 10]} className="Row">
						<Col span={24} style={{ textAlign: 'center', marginBottom: '1px' }}>
							<Input
								id="username"
								value={user.username}
								onChange={(e) => setUser({ ...user, username: e.target.value })}
								onKeyPress={handleKeyPress}
								placeholder="Enter your Username"
								style={{
									width: '100%',
									maxWidth: '350px',
									padding: '15px',
									marginBottom: '10px',
									boxSizing: 'border-box',
									border: '1px solid #ccc',
									borderRadius: '10px',
									opacity: '0.8',
								}}
							/>
						</Col>

						<Col
							span={24}
							style={{
								textAlign: 'center',
								marginBottom: '-10px',
								marginTop: '-10px',
							}}
						>
							<Input
								type="password"
								id="password"
								value={user.password}
								onChange={(e) => setUser({ ...user, password: e.target.value })}
								placeholder="Enter your Password"
								style={{
									width: '100%',
									maxWidth: '350px',
									padding: '15px',
									marginBottom: '10px',
									boxSizing: 'border-box',
									border: '1px solid #ccc',
									borderRadius: '10px',
									opacity: '0.8',
								}}
							/>
						</Col>

						<Col
							span={24}
							style={{
								marginBottom: '2px',
								textAlign: 'center',
								position: 'relative',
							}}
						>
							<Button
								type="primary"
								onClick={handleLogin}
								style={{
									width: '100%',
									maxWidth: '350px',
									padding: '20px',
									boxSizing: 'border-box',
									backgroundColor: '#1677ff',
									color: 'white',
									border: 'none',
									borderRadius: '10px',
									cursor: 'pointer',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									position: 'relative',
									fontFamily: 'Poppins',
								}}
							>
								Login
							</Button>
						</Col>

						{/* Google Login Button */}
						<Col span={24}>
							<Button
								onClick={() => {
									window.location.href =
										'http://localhost:5000/api/auth/google/login';
								}}
								style={{
									width: '100%',
									maxWidth: '350px',
									padding: '20px',
									boxSizing: 'border-box',
									backgroundColor: '#262626',
									color: 'white',
									border: 'none',
									borderRadius: '10px',
									cursor: 'pointer',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									position: 'relative',
									fontFamily: 'Poppins',
								}}
							>
								<span
									dangerouslySetInnerHTML={{
										__html: `<svg width="20px" height="20px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" fill="#4285F4"><g><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>`,
									}}
									style={{ marginRight: '10px' }}
								></span>
								Continue with Google
							</Button>
						</Col>

						<Col span={24} style={{ marginTop: '10px' }}>
							<Typography.Text>
								<span
									onClick={handleForgotPassRedirect}
									style={{
										cursor: 'pointer',
										textDecoration: 'none',
										fontFamily: 'Poppins',
										fontWeight: '400',
									}}
								>
									Forgot password?
								</span>
							</Typography.Text>
						</Col>

						<Col span={24} style={{ marginTop: '10px' }}>
							<Typography.Text
								style={{ fontFamily: 'Poppins', fontWeight: '400' }}
							>
								Dont&apos;t have an account?{' '}
								<span
									onClick={handleSignUpRedirect}
									style={{
										color: '#007bff',
										cursor: 'pointer',
										textDecoration: 'none',
										fontFamily: 'Poppins',
										fontWeight: '500',
									}}
								>
									Sign up?
								</span>
							</Typography.Text>
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
}

export default LoginPage;

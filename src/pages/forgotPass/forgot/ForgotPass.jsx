import './ForgotPass.css';
import { useState } from 'react';
import { Row, Col, Typography, Input, Button, message, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useForgotPass } from '../../../hooks/useAuth';

const { Title } = Typography;

function ForgotPassPage() {
	const navigate = useNavigate();
	const { mutate: sendForgotPass } = useForgotPass();
	const [formForgotPass] = Form.useForm();
	const [username, setUsername] = useState('');

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};

	const handleForgotPass = async () => {
		try {
			await sendForgotPass({
				username: username,
			});
			message.success('Send forgot password notificate successfully');
			formForgotPass.resetFields();
			navigate('/login');
		} catch (error) {
			console.log(error);
			message.error('Failed to send forgot password notificate');
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleForgotPass();
		}
	};

	const handleSignUpRedirect = () => {
		navigate('/signup');
	};

	return (
		<Row
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Col span={24} style={{ textAlign: 'center' }}>
				<Title level={2}>Trouble logging in?</Title>
				<p style={{ marginBottom: '20px', color: '#8e8e8e' }}>
					Enter your username and we will <br /> send you a link to reset your
					password
				</p>
				<Form
					form={formForgotPass}
					layout="vertical"
					onFinish={handleForgotPass}
					style={{
						backgroundColor: '#ffffff',
						borderRadius: '10px',
						maxWidth: '400px',
						width: '100%',
						margin: '0 auto',
					}}
					className="register-form"
				>
					<Form.Item name="username">
						<Input
							onChange={handleUsernameChange}
							onKeyPress={handleKeyPress}
							placeholder="Enter your Username"
							style={{
								width: '100%',
								maxWidth: '350px',
								padding: '15px',
								boxSizing: 'border-box',
								border: '1px solid #ccc',
								borderRadius: '10px',
								opacity: '0.8',
							}}
						/>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Send
						</Button>
					</Form.Item>
				</Form>
				<Col span={24} style={{ marginTop: '10px' }}>
					<Typography.Text>
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
			</Col>
		</Row>
	);
}

export default ForgotPassPage;

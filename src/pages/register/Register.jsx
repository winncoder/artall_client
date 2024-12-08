import './Register.css';
import { useState } from 'react';
import {
	Row,
	Col,
	Typography,
	Input,
	Button,
	message,
	Form,
	DatePicker,
} from 'antd';
import { useRegisterUser } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const dateFormat = 'YYYY-MM-DD';

function RegisterPage() {
	const navigate = useNavigate();
	const { mutate: userRegister } = useRegisterUser();
	const [formRegister] = Form.useForm();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [birthDate, setBirthDate] = useState(null);

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	};
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const handleBirthDateChange = (date) => {
		setBirthDate(date ? date.format('YYYY-MM-DD') : null);
	};

	const handleRegister = async () => {
		try {
			await userRegister({
				username: username,
				password: password,
				email: email,
				birthDate: birthDate,
			});
			message.success('Register successfully');
			formRegister.resetFields();
			navigate('/login');
		} catch (error) {
			console.log(error);
			message.error('Failed to register');
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleRegister();
		}
	};

	const handleSignInRedirect = () => {
		navigate('/login'); // Chuyển hướng tới trang đăng ký
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
				<Row className="background-image"></Row>
				<Title level={2}>Register your account</Title>
				<Form
					form={formRegister}
					layout="vertical"
					onFinish={handleRegister}
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
					<Form.Item name="password">
						<Input.Password
							onChange={handlePasswordChange}
							placeholder="Enter your Password"
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
					<Form.Item name="email">
						<Input
							type="email"
							onChange={handleEmailChange}
							placeholder="Enter your Email"
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
					<Form.Item name="birthday">
						<DatePicker
							format={dateFormat}
							onChange={handleBirthDateChange}
							placeholder="Select your Birthday"
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
							Join with us
						</Button>
					</Form.Item>
				</Form>
				<Col span={24} style={{ marginTop: '10px' }}>
					<Typography.Text>
						Have an account?{' '}
						<span
							onClick={handleSignInRedirect}
							style={{
								color: '#007bff',
								cursor: 'pointer',
								textDecoration: 'none',
								fontFamily: 'Poppins',
								fontWeight: '500',
							}}
						>
							Log in
						</span>
					</Typography.Text>
				</Col>
			</Col>
		</Row>
	);
}

export default RegisterPage;

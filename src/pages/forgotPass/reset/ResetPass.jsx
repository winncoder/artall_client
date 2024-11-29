// import './ForgotPass.css'
import { useState } from 'react';
import { Row, Col, Typography, Input, Button, message, Form } from 'antd';
import { useUpdateUserProfile } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const { Title } = Typography;

function ResetPassPage() {
	const navigate = useNavigate();
	const params = new URLSearchParams(location.search);
	const token = params.get('token');
	const decoded = jwtDecode(token);
	const userProfileId = decoded.userProfileId;

	const { mutate: updateUserProfile } = useUpdateUserProfile(userProfileId);
	const [formResetPass] = Form.useForm();
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setconfirmPassword] = useState('');

	const handleNewPasswordChange = (e) => {
		setNewPassword(e.target.value);
	};
	const handleConfirmPasswordChange = (e) => {
		setconfirmPassword(e.target.value);
	};

	const handleRegister = async () => {
		try {
			if (newPassword !== confirmPassword) {
				message.error('New password and confirm password do not match');
				return;
			}
			await updateUserProfile({
				password: newPassword,
				userProfileId: userProfileId,
			});
			message.success('Password updated successfully');
			formResetPass.resetFields();
			navigate('/login');
		} catch (error) {
			console.log(error);
			message.error('Failed to update password');
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleRegister();
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
				<Title level={2}>Reset password</Title>
				<p style={{ marginBottom: '20px', color: '#8e8e8e' }}>
					{' '}
					Enter your new password
				</p>
				<Form
					form={formResetPass}
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
					<Form.Item name="newPassword">
						<Input.Password
							iconRender={(visible) =>
								visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
							}
							onChange={handleNewPasswordChange}
							onKeyPress={handleKeyPress}
							placeholder="Enter your new password"
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
					<Form.Item name="confirmPassword">
						<Input.Password
							iconRender={(visible) =>
								visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
							}
							onChange={handleConfirmPasswordChange}
							onKeyPress={handleKeyPress}
							placeholder="Enter your confirm password"
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
							Update
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

export default ResetPassPage;

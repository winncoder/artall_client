import './UpdateUserProfile.css';
import { Form, Input, Button, Avatar, message } from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useState } from 'react';
import { useGetUsersDetal } from '../../../../hooks/useUser';
import { useUpdateUserProfile } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';

const UpdateUserPassword = () => {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: user } = useGetUsersDetal(userId);

	const [formUpdate] = Form.useForm();

	const userProfileId = user?.userProfile?.id;
	const { mutate: updateUserProfile } = useUpdateUserProfile(userProfileId);
	const [password, setPassword] = useState();
	const [currentPassword, setCurrentPassword] = useState('');

	const handleCurrentPasswordChange = (e) => {
		setCurrentPassword(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleUserPasswordUpdateOk = async () => {
		try {
			if (currentPassword !== user?.userProfile?.password) {
				message.error('Current password is incorrect');
				return;
			}
			await updateUserProfile({
				password: password,
				userProfileId: userProfileId,
			});
			message.success('Password updated successfully');
			formUpdate.resetFields();
		} catch (error) {
			console.log(error);
			message.error('Failed to update password');
		}
	};

	return (
		<div className="update-user-profile">
			<h1 className="edit-profile-title">Change password</h1>
			<div className="profile-header">
				<Avatar
					className="profile-photo"
					size={60}
					src={user?.profilePicture}
				/>
				<div className="profile-info">
					<span className="username">{user?.username}</span>
					<span className="full-name">{user?.userProfile.fullName}</span>
				</div>
			</div>

			<Form
				form={formUpdate}
				layout="vertical"
				onFinish={handleUserPasswordUpdateOk}
				className="user-profile-form"
			>
				<Form.Item name="current" label="Current Password">
					<Input.Password
						placeholder="Current Password"
						onChange={handleCurrentPasswordChange}
						iconRender={(visible) =>
							visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
						}
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>

				<Form.Item name="new-password" label="New Password">
					<Input.Password
						placeholder="New Password"
						onChange={handlePasswordChange}
						iconRender={(visible) =>
							visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
						}
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default UpdateUserPassword;

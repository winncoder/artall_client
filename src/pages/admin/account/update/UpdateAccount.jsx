// import './UpdateUserProfile.css';
import {
	Form,
	Input,
	Button,
	Select,
	Avatar,
	message,
	Upload,
	Modal,
	DatePicker,
} from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useGetUsersDetal } from '../../../../hooks/useUser';
import { useState, useEffect } from 'react';
import {
	useUpdateUserProfile,
	useUpdateUserInfo,
} from '../../../../hooks/useUser';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

const UpdateAccount = () => {
	useCheckAuthorization('admin');

	const { id: userId } = useParams();
	const { data: user } = useGetUsersDetal(userId);

	const [formUpdate] = Form.useForm();

	useEffect(() => {
		if (user) {
			setProfilePicture(user.profilePicture);
			formUpdate.setFieldsValue({
				fullName: user.userProfile?.fullName,
				gender: user.userProfile?.gender,
				email: user.userProfile?.email,
				website: user.userProfile?.website,
				socialLink: user.userProfile?.socialLinks,
				location: user.userProfile?.location,
				bio: user.userProfile?.bio,
				phoneNumber: user.userProfile?.phoneNumber,
				birthday: dayjs(user.userProfile?.birthDate),
			});
		}
	}, [user, formUpdate]);

	// UPDATE USER INFO
	const { mutate: updateUserInfo } = useUpdateUserInfo(userId);
	const [profilePicture, setProfilePicture] = useState(
		user?.profilePicture || '',
	);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [previewProfilePicture, setPreviewProfilePicture] = useState(
		user?.profilePicture || '',
	);

	const handleUploadProfilePicture = (info) => {
		setProfilePicture(info.file);
		const file = info.file?.originFileObj;

		if (file) {
			const fileType = file.type;
			const validImageTypes = [
				'image/jpeg',
				'image/png',
				'image/jpg',
				'image/gif',
			];

			if (validImageTypes.includes(fileType)) {
				const reader = new FileReader();

				reader.onload = (e) => {
					setPreviewProfilePicture(e.target.result);
				};

				reader.readAsDataURL(file);
				setProfilePicture(file);
			} else {
				message.error('Invalid file type. Please upload an image.');
				console.error('Invalid file type selected', fileType);
			}
		} else {
			message.error('No file selected');
			console.error('No file selected');
		}
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleModalOk = async () => {
		try {
			const res = await updateUserInfo({
				profilePicture: profilePicture,
				userInfoId: userId,
			});

			console.log(res);

			const newProfilePictureUrl = URL.createObjectURL(profilePicture);
			setProfilePicture(newProfilePictureUrl);

			message.success('Profile photo updated successfully');
			setIsModalVisible(false);
			formUpdate.resetFields();
		} catch (error) {
			console.log(error);
			message.error('Failed to update Profile photo');
		}
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
	};

	// UPDATE USER PROFILE
	const userProfileId = user?.userProfile?.id;
	const { mutate: updateUserProfile } = useUpdateUserProfile(userProfileId);
	const [fullName, setFullName] = useState();
	const [gender, setGender] = useState();
	const [email, setEmail] = useState();
	const [birthDate, setBirthDate] = useState();
	const [website, setWebsite] = useState();
	const [socialLink, setSocialLink] = useState();
	const [location, setLocation] = useState();
	const [bio, setBio] = useState();
	const [phoneNumber, setPhoneNumber] = useState();

	const handleFullNameChange = (e) => {
		setFullName(e.target.value);
	};
	const handleGenderChange = (value) => {
		setGender(value);
	};
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};
	const handleBirthDateChange = (date) => {
		setBirthDate(date ? date.format('YYYY-MM-DD') : null);
	};
	const handleWebsiteChange = (e) => {
		setWebsite(e.target.value);
	};
	const handleSocialLinkChange = (e) => {
		setSocialLink(e.target.value);
	};
	const handleLocationChange = (e) => {
		setLocation(e.target.value);
	};
	const handleBioChange = (e) => {
		setBio(e.target.value);
	};
	const handlePhoneNumberChange = (e) => {
		setPhoneNumber(e.target.value);
	};

	const handleUserProfileUpdateOk = async () => {
		try {
			await updateUserProfile({
				fullName: fullName,
				gender: gender,
				email: email,
				birthDate: birthDate,
				website: website,
				socialLinks: socialLink,
				location: location,
				bio: bio,
				phoneNumber: phoneNumber,
				userProfileId: userProfileId,
			});
			message.success('Profile updated successfully');
		} catch (error) {
			console.log(error);
			message.error('Failed to update Profile');
		}
	};

	return (
		<div className="update-user-profile">
			<h1 className="edit-profile-title">Edit profile</h1>
			<div className="profile-header">
				<Avatar className="profile-photo" size={60} src={profilePicture} />
				<div className="profile-info">
					<span className="username">{user?.username}</span>
					<span className="full-name">{user?.userProfile?.fullName}</span>
				</div>
				<Button
					type="primary"
					className="change-photo-button"
					onClick={showModal}
				>
					Change photo
				</Button>
				<Modal
					className="upload-profile-photo-modal"
					open={isModalVisible}
					onCancel={handleModalCancel}
					closeIcon={false}
					footer={null}
					style={{
						top: 150,
						padding: 0,
						backgroundColor: '#f6f6f6',
						borderRadius: '10px',
					}}
				>
					<div className="modal-navbar">
						<Button onClick={handleModalCancel} type="text">
							Cancel
						</Button>
						<div className="title-list-modal">Update avatar</div>
						<Button
							onClick={handleModalOk}
							type="text"
							style={{ fontWeight: '500', color: '#1890ff' }}
						>
							Done
						</Button>
					</div>
					{previewProfilePicture && (
						<img
							src={previewProfilePicture}
							alt="Profile Preview"
							style={{
								width: '100%',
								maxHeight: '200px',
								objectFit: 'contain',
							}}
						/>
					)}
					<Upload
						maxCount={1}
						showUploadList={false}
						beforeUpload={(file) => {
							const validImageTypes = [
								'image/jpeg',
								'image/png',
								'image/jpg',
								'image/gif',
							]; // Allowed file types
							if (!validImageTypes.includes(file.type)) {
								message.error('Invalid file type. Please upload an image.');
								return Upload.LIST_IGNORE; // Reject the file
							}
							return true; // Accept the file
						}}
						onChange={handleUploadProfilePicture}
						className="upload-button"
					>
						<Button className="select-ava-btn">
							{' '}
							<span>Select Photo</span>
						</Button>
					</Upload>
				</Modal>
			</div>

			<Form
				form={formUpdate}
				layout="vertical"
				onFinish={handleUserProfileUpdateOk}
				className="user-profile-form"
			>
				<Form.Item name="fullName" label="Full name">
					<Input
						placeholder="Full name"
						onChange={handleFullNameChange}
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="gender" label="Gender">
					<Select placeholder="Select Gender" onChange={handleGenderChange}>
						<Option value="male">Male</Option>
						<Option value="female">Female</Option>
						<Option value="other">Other</Option>
					</Select>
				</Form.Item>
				<Form.Item name="email" label="Email">
					<Input
						onChange={handleEmailChange}
						placeholder="Email"
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="phoneNumber" label="Phone number">
					<Input
						onChange={handlePhoneNumberChange}
						placeholder="Phone number"
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="birthday" label="Birthday">
					<DatePicker
						maxDate={dayjs('2025-10-31', dateFormat)}
						onChange={handleBirthDateChange}
						placeholder="Birthday"
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="website" label="Website">
					<Input
						onChange={handleWebsiteChange}
						placeholder="Website"
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="socialLink" label="Social link">
					<Input
						onChange={handleSocialLinkChange}
						placeholder="Social links"
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="location" label="Location">
					<Input
						onChange={handleLocationChange}
						placeholder="Location"
						style={{
							borderRadius: '10px',
							padding: '10px',
						}}
					/>
				</Form.Item>
				<Form.Item name="bio" label="Bio">
					<Input.TextArea
						onChange={handleBioChange}
						maxLength={150}
						placeholder="Bio"
						autoSize={{ minRows: 1, maxRows: 5 }}
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

export default UpdateAccount;

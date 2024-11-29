import './UserProfile.css';
import { Avatar, Button, Typography, Divider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { useGetUsersDetal } from '../../../hooks/useUser';
import { useParams } from 'react-router-dom';
import ProfileSkeleton from '../../../components/loading/skeletonLoader/ProfileSkeleton';
import { useState } from 'react';
import ListFollower from '../../user/follow/list/ListFollower';
import ListFollowing from '../../user/follow/list/ListFollowing';
import ToggleFollow from '../../user/follow/toggle/ToggleFollow';

const { Text } = Typography;

function UserProfile() {
	const access_token = localStorage.getItem('access_token');
	const myUserId = jwtDecode(access_token).sub;

	const { userId } = useParams();

	const { data: user, isLoading } = useGetUsersDetal(userId);

	const [isListFollowerVisible, setIsListFollowerVisible] = useState(false);
	const [isListFollowingVisible, setIsListFollowingVisible] = useState(false);

	return (
		<div className="user-profile-container">
			{isLoading ? (
				<ProfileSkeleton />
			) : user ? (
				<div className="header">
					<Avatar
						className="profile-avatar"
						size={150}
						src={user?.profilePicture}
					/>
					<div className="user-info">
						<div className="username-section">
							<a className="username">{user?.username}</a>
							{myUserId === userId ? (
								// Nếu myUserId trùng với userId, hiển thị các nút chỉnh sửa
								<>
									<Button
										href={`/profile/edit`}
										className="edit-profile-button"
									>
										Edit profile
									</Button>
									<Button
										href={`/profile/change-password`}
										className="edit-profile-button"
									>
										Edit password
									</Button>
								</>
							) : (
								<>
									<ToggleFollow followingId={user?.id} followerId={myUserId} />
									<Button className="edit-profile-button">Message</Button>
								</>
							)}
							<SettingOutlined
								className="settings-icon"
								style={{ fontSize: '20px' }}
								onClick={() => {
									console.log('Settings clicked');
								}} // Thay đổi theo logic của bạn
							/>
						</div>
						<div className="user-stats">
							<span>
								<strong style={{ fontWeight: '600' }}>{user?.postCount}</strong>{' '}
								posts
							</span>
							<span
								onClick={() => {
									setIsListFollowerVisible(true);
								}}
								style={{ cursor: 'pointer' }}
							>
								<strong style={{ fontWeight: '600' }}>
									{user?.followerCount}
								</strong>{' '}
								followers
							</span>
							<ListFollower
								isListFollowerModalOpen={isListFollowerVisible}
								setIsListFollowerModalOpen={setIsListFollowerVisible}
							/>
							<span
								onClick={() => {
									setIsListFollowingVisible(true);
								}}
								style={{ cursor: 'pointer', marginLeft: '15px' }}
							>
								<strong style={{ fontWeight: '600' }}>
									{user?.followingCount}
								</strong>{' '}
								following
							</span>
							<ListFollowing
								isListFollowingModalOpen={isListFollowingVisible}
								setIsListFollowingModalOpen={setIsListFollowingVisible}
							/>
						</div>
						<Text className="real-name">{user?.userProfile?.fullName}</Text>
						<Text className="bio-user">{user?.userProfile?.bio}</Text>
					</div>
				</div>
			) : (
				<div>No user found.</div>
			)}
			<Divider
				style={{
					padding: '0',
					margin: '50px 0 10px 0',
					border: '1px solid #f0f0f0',
				}}
			/>
			<div className="tabs">
				<Button type="text" className="tab-button active">
					Posts
				</Button>
				<Button type="text" className="tab-button">
					Saved
				</Button>
				<Button type="text" className="tab-button">
					Tagged
				</Button>
			</div>
		</div>
	);
}

export default UserProfile;

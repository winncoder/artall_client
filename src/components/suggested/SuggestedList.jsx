import './SuggestedList.css';
import { Avatar, Button, Card, List } from 'antd';
import { useGetUsersInfoDetal } from '../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { useCheckAuthorization } from '../../hooks/useAuth';
import { useState } from 'react';
import { useGetSuggestedUsers } from '../../hooks/useUser';

function SuggestedList() {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);

	const [table, setTable] = useState({
		page: 1,
		take: 5,
	});

	const paginationOptions = {
		page: table.page,
		take: table.take,
	};
	const { data: suggestedUsers } = useGetSuggestedUsers(paginationOptions);

	return (
		<div className="suggested-list-container">
			{/* Current user section */}
			<div className="current-user">
				{userInfo && userInfo.profilePicture && (
					<a href={`/profile/${userInfo.id}`} className="current-user-username">
						<Avatar src={userInfo.profilePicture} size={40} />
					</a>
				)}
				<div className="current-user-info">
					{userInfo && userInfo.username && (
						<a
							href={`/profile/${userInfo.id}`}
							className="current-user-username"
						>
							{userInfo.username}
						</a>
					)}
				</div>
				<Button type="link" className="switch-button">
					Switch
				</Button>
			</div>
			{/* Suggested users section */}
			<Card
				title="Suggested for you"
				extra={
					<a href="#" className="see-all">
						See All
					</a>
				}
				className="suggested-list-card"
			>
				<div className="user-suggested-list">
					{suggestedUsers?.data.length > 0 ? (
						suggestedUsers?.data.map((user) => (
							<div className="follower-item" key={user.id}>
								<a href={`/profile/${user.id}`}>
									<Avatar
										size={40}
										className="follower-avatar"
										src={user.profilePicture}
									/>
								</a>
								<div className="follower-info">
									<a
										href={`/profile/${user.id}`}
										className="suggested-username"
									>
										{user.username}
									</a>
									<div className="description-wrapper">
										<span className="suggested-description">
											{user.followerCount} users have followed
										</span>
									</div>
								</div>
								<Button type="link" className="follow-button">
									Follow
								</Button>
							</div>
						))
					) : (
						<p>Not found</p>
					)}
				</div>
			</Card>

			{/* Footer section */}
			<div className="footer">© 2024 ARTALL FROM WINNCODER</div>
		</div>
	);
}

export default SuggestedList;

import './ListFollower.css';
import { useState, useEffect } from 'react';
import { Modal, Avatar, Input, Spin } from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { SearchOutlined } from '@ant-design/icons';
import { useGetFollows } from '../../../../hooks/useFollow';
import { useParams } from 'react-router-dom';
import ToggleFollow from '../toggle/ToggleFollow';
import { jwtDecode } from 'jwt-decode';
import CommentSkeletonLoader from '../../../../components/loading//skeletonLoader/CommentSkeleton';

function ListFollower({ isListFollowerModalOpen, setIsListFollowerModalOpen }) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const myUserId = jwtDecode(access_token).sub;
	const { userId } = useParams();
	const following = userId;

	const [table, setTable] = useState({
		page: 1,
		take: 10,
	});
	const [followerUsername, setFollowerUsername] = useState('');

	const [followsData, setFollowsData] = useState([]);

	const handleSearchByUsername = (value) => {
		setFollowerUsername(value);
		setTable((prev) => ({
			...prev,
			page: 1,
		}));
	};

	const paginationOptions = {
		page: table.page,
		take: table.take,
		following: following,
		followerUsername: followerUsername,
	};

	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const { data: follows, isLoading } = useGetFollows(paginationOptions);

	const handleLoadMoreFollowers = () => {
		if (follows?.meta.hasNextPage) {
			setIsLoadingMore(true);
			setTable((prev) => ({
				...prev,
				page: prev.page + 1,
			}));
		}
	};

	useEffect(() => {
		if (follows?.data) {
			if (table.page === 1) {
				setFollowsData(follows.data); // Nếu trang là 1, gán lại toàn bộ dữ liệu
			} else {
				setFollowsData((prev) => [...prev, ...follows.data]); // Nếu không phải trang 1, thêm dữ liệu mới vào cuối
			}
			setIsLoadingMore(false); // Dừng trạng thái loading khi có dữ liệu mới
		}
	}, [follows, table.page]);

	const handlePostCreateCancel = () => {
		setIsListFollowerModalOpen(false);
	};

	return (
		<Modal
			className="list-follow-modal"
			open={isListFollowerModalOpen}
			onCancel={handlePostCreateCancel}
			closeIcon={false}
			footer={null}
		>
			<div className="modal-navbar">
				<div className="title-list-modal">Followers</div>
				<img
					src="https://res.cloudinary.com/dekmn1kko/image/upload/v1730823890/icon/close-icon-black.png"
					alt="Close"
					className="close-icon"
					onClick={handlePostCreateCancel}
				/>
			</div>
			<div>
				<div className="search-container">
					<Input
						placeholder="Search"
						prefix={
							<SearchOutlined style={{ color: '#888', marginRight: '5px' }} />
						}
						className="search-input"
						value={followerUsername}
						onChange={(e) => handleSearchByUsername(e.target.value)}
					/>
				</div>
				<div className="follower-list">
					{followsData?.length > 0 ? (
						followsData.map((follow) => (
							<div className="follower-item" key={follow.id}>
								<a href={`/profile/${follow.followerId}`}>
									<Avatar
										size={40}
										className="follower-avatar"
										src={follow.follower.profilePicture}
									/>
								</a>
								<div className="follower-info">
									<a
										href={`/profile/${follow.followerId}`}
										className="follower-username"
									>
										{follow.follower.username}
									</a>
								</div>
								<ToggleFollow
									followingId={follow.followerId}
									followerId={myUserId}
								/>
							</div>
						))
					) : (
						<p>Not found</p>
					)}

					{isLoading ? (
						<div style={{ textAlign: 'center', marginTop: '20px' }}>
							<CommentSkeletonLoader />
						</div>
					) : (
						follows?.meta.hasNextPage && (
							<div
								style={{
									textAlign: 'center',
									marginTop: '10px',
									cursor: 'pointer',
								}}
								onClick={handleLoadMoreFollowers}
							>
								{isLoadingMore ? (
									<Spin />
								) : (
									<img
										src="https://res.cloudinary.com/dekmn1kko/image/upload/v1730176010/icon/add-icon.png"
										alt="Load More"
										style={{ width: '24px', height: '24px' }}
									/>
								)}
							</div>
						)
					)}
				</div>
			</div>
		</Modal>
	);
}

export default ListFollower;

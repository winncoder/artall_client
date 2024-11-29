import './PostDetail.css';
import { useState } from 'react';
import { Modal, Avatar, Button, Carousel, Image, Card, message } from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { PropTypes } from 'prop-types';
import { EllipsisOutlined } from '@ant-design/icons';
import CommentDetail from '../../comment/list/ListComment';
import { useDeletePost } from '../../../../hooks/usePost';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';

// eslint-disable-next-line react/prop-types
function PostDetail({ isPostDetailModalOpen, setIsPostDetailModalOpen, post }) {
	useCheckAuthorization('admin');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);
	const postId = post?.key;

	const [isLoadingBar, setIsLoadingBar] = useState(false);
	const handlePostDetailCancel = () => {
		setIsPostDetailModalOpen(false);
	};

	const [isPostOptionVisible, setIsPostOptionVisible] = useState(false);
	const showPostModal = () => {
		setIsPostOptionVisible(true);
	};

	const handlePostModalClose = () => {
		setIsPostOptionVisible(false);
	};

	const { mutate: deletePost } = useDeletePost();
	const handleDeletePost = () => {
		if (!postId) {
			message.error('Post ID is not defined');
			return;
		}

		setIsLoadingBar(true);
		deletePost(postId, {
			onSuccess: () => {
				setIsLoadingBar(false);
				console.log(`Post with ID ${postId} deleted successfully`);
				setIsPostDetailModalOpen(false);
			},
			onError: (error) => {
				console.error('Error deleting post:', error);
				setIsLoadingBar(false);
			},
		});
		handlePostModalClose();
	};

	return (
		<>
			<Modal
				className="post-detail-modal"
				open={isPostDetailModalOpen}
				onCancel={handlePostDetailCancel}
				destroyOnClose={true}
				forceRender={true}
				footer={null}
				closeIcon={false}
				style={{
					top: 50,
					padding: 0,
					backgroundColor: '#f6f6f6',
					borderRadius: '10px',
				}}
			>
				<LoadingBar isLoading={isLoadingBar} />
				<div
					className="post-detail-container"
					style={{ display: 'flex', height: '510px' }}
				>
					{/* Left side for image */}
					<div
						className="post-detail-image"
						style={{ flex: 2, display: 'flex' }}
					>
						{post && post.mediaPath && post.mediaPath.length > 1 ? (
							<Carousel
								afterChange={() => window.dispatchEvent(new Event('resize'))}
								arrows
								dots={{ className: 'custom-carousel-dots' }}
							>
								{post.mediaPath.map((image, index) => (
									<Image
										key={index}
										className="detail-card-image"
										alt={`Post image ${index + 1}`}
										src={image}
									/>
								))}
							</Carousel>
						) : post && post.mediaPath && post.mediaPath.length === 1 ? (
							<Image
								src={post.mediaPath[0]}
								alt="Post content"
								className="detail-card-image"
							/>
						) : (
							<p>No images available</p>
						)}
					</div>

					{/* Right side for user info and content */}
					<div
						className="post-detail-content"
						style={{
							flex: 2,
							backgroundColor: '#fff',
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						{/* User Info Section */}
						<div
							className="user-info-cmt"
							style={{ display: 'flex', alignItems: 'center' }}
						>
							{post && post?.userInfo.profilePicture && (
								<Avatar
									src={post?.userInfo.profilePicture}
									style={{ marginRight: '10px' }}
								/>
							)}
							<div>
								{userInfo && userInfo.username && (
									<div className="username-post-detail">
										{post?.userInfo.username}
									</div>
								)}
							</div>

							{/* Icon Button to Open Modal */}
							<Button
								icon={<EllipsisOutlined />}
								shape="circle"
								style={{
									border: 'none',
									fontSize: '20px',
									cursor: 'pointer',
									position: 'absolute',
									right: '20px',
									top: '6%',
									transform: 'translateY(-50%)',
								}}
								onClick={showPostModal}
							/>
						</div>
						{/* Modal Component */}
						<Modal
							visible={isPostOptionVisible}
							onCancel={handlePostModalClose}
							footer={null}
							closeIcon={null}
							className="post-option-modal"
							centered
						>
							<div style={{ textAlign: 'center' }}>
								<div
									style={{
										color: 'red',
										fontWeight: '600',
										padding: '10px 0',
										cursor: 'pointer',
										borderBottom: '1px solid #f0f0f0',
									}}
									onClick={() => handleDeletePost()}
								>
									Delete
								</div>
								<div
									style={{
										padding: '12px 0',
										cursor: 'pointer',
										borderBottom: '1px solid #f0f0f0',
									}}
									onClick={() => console.log('About this account clicked')}
								>
									About this account
								</div>
								<div
									style={{
										padding: '12px 0',
										cursor: 'pointer',
									}}
									onClick={() => handlePostModalClose()}
								>
									Cancel
								</div>
							</div>
						</Modal>

						{/* Content and Comments Section */}
						<div
							className="comment-detail-section"
							style={{
								maxHeight: '600px',
								overflowY: 'auto',
								scrollbarWidth: 'none',
								msOverflowStyle: 'none',
							}}
						>
							<div style={{ paddingRight: '10px' }}>
								{/* Content */}
								<Card style={{ marginBottom: 16 }}>
									<div style={{ display: 'flex' }}>
										<div>
											<Avatar
												src={post?.userInfo.profilePicture}
												alt={post?.userInfo.username}
												style={{ marginRight: '10px' }}
												className="comment-avatar"
											/>
										</div>
										<div>
											<span style={{ fontWeight: '600', marginRight: '5px' }}>
												{post?.userInfo.username}
											</span>
											<span style={{ fontWeight: '400' }}>{post?.content}</span>
										</div>
									</div>
								</Card>

								{/* Comments */}
								<CommentDetail
									postId={postId}
									isPostDetailModalOpen={isPostDetailModalOpen}
								/>
							</div>
						</div>

						{/* Reaction section */}
						<div className="react-section">
							<div style={{ padding: '10px' }}>
								{/* Likes */}
								<p style={{ fontWeight: '600' }}>
									{post?.likeCount != null
										? `${post.likeCount} ${post.likeCount === 1 ? 'like' : 'likes'}`
										: '0 likes'}
								</p>
								{/* Thời gian đăng bài */}
								{post?.createdAt && (
									<p style={{ fontSize: '12px', color: 'gray' }}>
										Posted on {new Date(post?.createdAt).toLocaleDateString()}
									</p>
								)}

								{post?.updatedAt && (
									<p style={{ fontSize: '12px', color: 'gray' }}>
										Updated on {new Date(post?.updatedAt).toLocaleDateString()}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
}

PostDetail.propTypes = {
	post: PropTypes.shape({
		mediaPath: PropTypes.arrayOf(PropTypes.string),
		id: PropTypes.string,
		content: PropTypes.string,
		likeCount: PropTypes.number,
		isLiked: PropTypes.bool,
	}).isRequired,
};

export default PostDetail;

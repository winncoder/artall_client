import './PostModal.css';
import { useState } from 'react';
import { Modal, Avatar, Button, Carousel, Image, Card } from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { PropTypes } from 'prop-types';
import { EllipsisOutlined } from '@ant-design/icons';
import CreateCmtPostDetail from '../../comment/create/CreateCmtPostDetail';
import CommentUpdate from '../../comment/update/UpdateComment';
import DeletePost from '../delete/DeletePost';
import UpdatePost from '../update/UpdatePost';
import ToggleLike from '../../like/toggle/ToggleLike';

// eslint-disable-next-line react/prop-types
function PostModal({
	isPostDetailModalOpen,
	setIsPostDetailModalOpen,
	setAllPosts,
	post,
}) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);
	const postId = post?.id;

	// loading bar
	const [isLoading, setIsLoading] = useState(false);
	const [isUpdateVisible, setIsUpdateVisible] = useState(false);
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

	const handleDeleteSuccess = (postId) => {
		setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
		handlePostModalClose();
		setIsLoading(false);
		handlePostDetailCancel();
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
									onClick={() => console.log('Block clicked')}
								>
									Block
								</div>
								<div
									style={{
										color: 'red',
										fontWeight: '600',
										padding: '10px 0',
										cursor: 'pointer',
										borderBottom: '1px solid #f0f0f0',
									}}
									onClick={() => console.log('Unfollow clicked')}
								>
									Unfollow
								</div>
								{userId === post?.userId && (
									<>
										<div
											style={{
												padding: '12px 0',
												cursor: 'pointer',
												borderBottom: '1px solid #f0f0f0',
											}}
											onClick={() => {
												setIsUpdateVisible(true);
												handlePostModalClose();
											}}
										>
											Edit
										</div>
										<DeletePost
											postId={post?.id}
											onDeleteSuccess={handleDeleteSuccess}
											setLoading={setIsLoading}
										/>
									</>
								)}
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
						{/* Modal for Update Post */}
						<UpdatePost
							isUpdatePostModalOpen={isUpdateVisible}
							setIsUpdatePostModalOpen={setIsUpdateVisible}
							post={post}
						/>

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
								<CommentUpdate
									postId={postId}
									isPostDetailModalOpen={isPostDetailModalOpen}
								/>
							</div>
						</div>

						{/* Reaction section */}
						<div className="react-section">
							<div
								style={{
									marginTop: 'auto',
									display: 'flex',
									padding: '10px 10px 0 10px',
								}}
							>
								{/* Like Icon */}
								<ToggleLike
									postId={post?.id}
									userId={userId}
									isLiked={post?.isLiked}
								/>

								{/* Comment Icon */}
								<Button
									style={{
										marginRight: 10,
										background: 'none',
										border: 'none',
										padding: 0,
										cursor: 'pointer',
									}}
								>
									<img
										src="https://res.cloudinary.com/dekmn1kko/image/upload/v1727257104/icon/comment-icon.png"
										alt="Comment"
										style={{
											width: '27px',
											height: '27px',
											opacity: 0.8,
											transition: 'opacity 0.3s ease',
										}}
										onMouseEnter={(e) => (e.target.style.opacity = 0.5)}
										onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
									/>
								</Button>

								{/* Share Icon */}
								<Button
									style={{
										background: 'none',
										border: 'none',
										padding: 0,
										cursor: 'pointer',
									}}
								>
									<img
										src="https://res.cloudinary.com/dekmn1kko/image/upload/v1732977639/icon/donate-icon.png"
										alt="Share"
										style={{
											width: '27px',
											height: '27px',
											opacity: 0.8,
											transition: 'opacity 0.3s ease',
										}}
										onMouseEnter={(e) => (e.target.style.opacity = 0.5)}
										onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
									/>
								</Button>
							</div>

							<div style={{ padding: '10px' }}>
								{/* Likes */}
								<p style={{ fontWeight: '600' }}>
									{post?.likeCount
										? `${post.likeCount} ${post.likeCount === 1 ? 'like' : 'likes'}`
										: 'Be the first to like this'}
								</p>

								{/* Thời gian đăng bài */}
								{post?.createdAt && (
									<p style={{ fontSize: '12px', color: 'gray' }}>
										Posted on {new Date(post?.createdAt).toLocaleDateString()}
									</p>
								)}
							</div>

							{/* Comment Input Box */}
							{postId && <CreateCmtPostDetail postId={postId} />}
						</div>
						{/* Reaction Icons */}
					</div>
				</div>
			</Modal>
		</>
	);
}

PostModal.propTypes = {
	post: PropTypes.shape({
		mediaPath: PropTypes.arrayOf(PropTypes.string),
		id: PropTypes.string,
		content: PropTypes.string,
		likeCount: PropTypes.number,
		isLiked: PropTypes.bool,
	}).isRequired,
};

export default PostModal;

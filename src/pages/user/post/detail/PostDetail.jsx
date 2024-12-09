import { useState } from 'react';
import {
	Modal,
	Avatar,
	Button,
	Carousel,
	Image,
	Card,
	Row,
	Col,
	Divider,
	Spin,
} from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetPostDetail } from '../../../../hooks/usePost';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { PropTypes } from 'prop-types';
import { EllipsisOutlined } from '@ant-design/icons';
import CreateCmtPostDetail from '../../comment/create/CreateCmtPostDetail';
import CommentUpdateDetail from '../../comment/update/UpdateCommentDetail';
import DeletePost from '../delete/DeletePost';
import UpdatePost from '../update/UpdatePost';
import ToggleLike from '../../like/toggle/ToggleLike';
import { useParams } from 'react-router-dom';
import CreateDonate from '../../donate/create/CreateDonate';
import ListPProfile from '../../post/listPProfile/ListPProfile';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';

// eslint-disable-next-line react/prop-types
function PostDetail() {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const { postId } = useParams();
	const userId = jwtDecode(access_token).sub;
	const { data: post, isLoading } = useGetPostDetail(postId);
	const { data: userInfo } = useGetUsersInfoDetal(userId);
	console.log('post', post);
	// loading bar
	const [isLoadingBar, setIsLoadingBar] = useState(false);
	const [isUpdateVisible, setIsUpdateVisible] = useState(false);
	const navigate = useNavigate();

	const handleDeleteSuccess = () => {
		setIsLoadingBar(false);
		handlePostModalClose();
		navigate(`/`);
	};

	const [isPostOptionVisible, setIsPostOptionVisible] = useState(false);
	const showPostModal = () => {
		setIsPostOptionVisible(true);
	};

	const handlePostModalClose = () => {
		setIsPostOptionVisible(false);
	};

	const [isCreateDonateModalVisible, setIsCreateDonateModalVisible] =
		useState(false);

	return (
		<>
			<Row
				className="post-detail-row"
				style={{ justifyContent: 'center' }}
				justify="center"
				gutter={[16]}
			>
				<LoadingBar isLoading={isLoadingBar} />
				<Col lg={18}>
					<div
						className="post-detail-container"
						style={{
							display: 'flex',
							height: '510px',
							border: '1px solid #ececec',
							marginTop: '50px',
						}}
					>
						{/* Left side for image */}
						<div
							className="post-detail-image"
							style={{ flex: 2, display: 'flex' }}
						>
							{isLoading ? (
								<Spin size="large" />
							) : post && post.mediaPath && post.mediaPath.length > 1 ? (
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
										top: '80px',
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
												setLoading={setIsLoadingBar}
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
												<span style={{ fontWeight: '400' }}>
													{post?.content}
												</span>
											</div>
										</div>
									</Card>

									{/* Comments */}
									<CommentUpdateDetail
										postId={postId}
										isPostDetailModalOpen={false}
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

									{/* Donate Icon */}
									<Button
										style={{
											marginLeft: 'auto',
											background: 'none',
											border: 'none',
											padding: 0,
											cursor: 'pointer',
										}}
										onClick={() => setIsCreateDonateModalVisible(true)}
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
									<CreateDonate
										postId={post?.id}
										isCreateDonateModalOpen={isCreateDonateModalVisible}
										setIsCreateDonateModalOpen={setIsCreateDonateModalVisible}
									/>
								</div>

								<div style={{ padding: '10px' }}>
									<div
										style={{ display: 'flex', justifyContent: 'space-between' }}
									>
										{/* Likes */}
										<p style={{ fontWeight: '600' }}>
											{post?.likeCount
												? `${post.likeCount} ${post.likeCount === 1 ? 'like' : 'likes'}`
												: 'Be the first to like this'}
										</p>
										{/* Donate */}
										<p style={{ fontWeight: '600' }}>
											{post?.totalDonation?.toLocaleString('vi-VN')} VND
										</p>
									</div>

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
						</div>
					</div>

					<Divider
						style={{
							padding: '0',
							margin: '50px 0 10px 0',
							border: '1px solid #f5f5f5',
						}}
					/>
					<p className="more-post-title">
						More posts from{' '}
						<strong>{post?.userInfo?.username || 'unknown user'}</strong>
					</p>
					<ListPProfile userId={post?.userId} />
				</Col>
			</Row>
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

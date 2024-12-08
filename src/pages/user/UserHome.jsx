import './UserHome.css';
import {
	Row,
	Col,
	Card,
	Image,
	Avatar,
	Carousel,
	Button,
	Menu,
	Dropdown,
	Modal,
} from 'antd';
import { EllipsisOutlined, DownOutlined } from '@ant-design/icons';
import { useState, useEffect, useContext } from 'react';
import SuggestedList from '../../components/suggested/SuggestedList';
import { useGetRandomPosts } from '../../hooks/usePost';
import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostSkeletonLoader from '../../components/loading/skeletonLoader/PostSkeleton';
import PostModal from './post/modal/PostModal';
import UpdatePost from './post/update/UpdatePost';
import CreateCmt from './comment/create/CreateCmt';
import DeletePost from './post/delete/DeletePost';
import LoadingBar from '../../components/loading/loadingbar/LoadingBar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ToggleLike from './like/toggle/ToggleLike';
import { PostContext } from '../../components/context/PostContext';
import { formatDistanceToNow } from 'date-fns';
import CreateDonate from './donate/create/CreateDonate';

function UserHome() {
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;

	const [selectedFeed, setSelectedFeed] = useState('For you');
	const [isPostOptionVisible, setIsPostOptionVisible] = useState(false);
	const [isPostModalVisible, setIsPostModalVisible] = useState(false);
	const [isCreateDonateModalVisible, setIsCreateDonateModalVisible] =
		useState(false);

	const [isUpdateVisible, setIsUpdateVisible] = useState(false);

	const [isLoadingBar, setIsLoadingBar] = useState(false);

	const [table, setTable] = useState({
		page: 1,
		take: 10,
	});

	const paginationOptions = {
		page: table.page,
		take: table.take,
	};

	const { allPosts, setAllPosts } = useContext(PostContext);
	const { data: post } = useGetRandomPosts(paginationOptions);
	// const [allPosts, setAllPosts] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [selectedPost, setSelectedPost] = useState(null);
	console.log('selectedPost', selectedPost);

	useEffect(() => {
		if (post) {
			setAllPosts((prevPosts) => [...prevPosts, ...post.data]);
			if (post.data.length === 0 || post.data.length < table.take) {
				setHasMore(false);
			}
		}
	}, [post, table.take]);

	const fetchMoreData = () => {
		setTable((prevTable) => ({
			...prevTable,
			page: prevTable.page + 1,
		}));
	};

	const feedMenu = (
		<Menu onClick={(e) => setSelectedFeed(e.key)}>
			<Menu.Item key="For you">For you</Menu.Item>
			<Menu.Item key="Liked">Liked</Menu.Item>
			<Menu.Item key="Following">Following</Menu.Item>
		</Menu>
	);

	// Function to handle the visibility of the modal
	const showPostModal = () => {
		setIsPostOptionVisible(true);
	};

	const handlePostModalClose = () => {
		setIsPostOptionVisible(false);
	};

	const handleDeleteSuccess = (postId) => {
		setAllPosts((prevPosts) => prevPosts.filter((post) => post?.id !== postId));
		handlePostModalClose();
		setIsLoadingBar(false);
	};

	const navigate = useNavigate();

	const handleNavigate = (userId) => {
		if (userId) {
			navigate(`/profile/${userId}`);
		} else {
			console.error('User ID is not provided');
		}
	};

	const handleLikeToggle = (postId, isLiked) => {
		setAllPosts((prevPosts) =>
			prevPosts.map((post) =>
				post.id === postId
					? {
							...post,
							isLiked: !isLiked,
							likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
						}
					: post,
			),
		);
	};

	const getLikeCountText = (likeCount) => {
		if (likeCount === 0) {
			return 'Be the first to like this';
		} else {
			return `${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`;
		}
	};

	const getCommentCountText = (commentCount) => {
		if (commentCount === 1) {
			return `View ${commentCount} comment`;
		} else {
			return `View all ${commentCount} comments`;
		}
	};

	const getRelativeTime = (date) => {
		if (!date) return '';

		const utcDate = new Date(date);
		const localDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

		return formatDistanceToNow(localDate, { addSuffix: true });
	};

	return (
		<Row
			style={{ justifyContent: 'center', padding: '24px 100px', margin: '0px' }}
			gutter={[16, 16]}
		>
			<Col
				xs={24}
				lg={13}
				style={{ paddingLeft: '40px', paddingRight: '40px' }}
			>
				{/* Dropdown and Create Post Box */}
				<div className="dropdown-container">
					<span className="dropdown-text">{selectedFeed}</span>
					<Dropdown overlay={feedMenu} trigger={['click']}>
						<DownOutlined className="dropdown-arrow" />
					</Dropdown>
				</div>

				{/* Existing Post Data */}
				<LoadingBar isLoading={isLoadingBar} />
				<InfiniteScroll
					dataLength={allPosts?.length}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={
						<>
							<PostSkeletonLoader />
						</>
					}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>There are currently no post.</b>
						</p>
					}
				>
					{allPosts?.length > 0 ? (
						allPosts?.map((post) => (
							<LazyLoad key={post?.id} height={200} offset={100}>
								<Card key={post?.id} style={{ marginBottom: 16 }}>
									{/* Avatar - Username - CreateDate - Icon Button */}
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											marginBottom: '10px',
										}}
									>
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<Avatar
												src={post?.userInfo?.profilePicture}
												style={{ marginRight: 15 }}
											/>
											<div>
												<a
													href={`/profile/${post.userInfo.id}`}
													style={{ color: 'black', fontWeight: '600' }}
												>
													{post?.userInfo?.username}
												</a>
												<span
													style={{
														color: 'gray',
														fontSize: '12px',
														marginLeft: 8,
													}}
												>
													• {getRelativeTime(post?.createdAt)}
												</span>
											</div>
										</div>
										{/* Icon Button to Open Modal */}
										<Button
											icon={<EllipsisOutlined />}
											shape="circle"
											style={{ border: 'none', boxShadow: 'none' }}
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
												onClick={() => {
													navigate(`/post/${post.id}`);
												}}
											>
												Go to post
											</div>
											<div
												style={{
													padding: '12px 0',
													cursor: 'pointer',
													borderBottom: '1px solid #f0f0f0',
												}}
												onClick={() => {
													handleNavigate(post?.userInfo?.id);
													handlePostModalClose();
												}}
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

									{/* Image Carousel */}
									{post?.mediaPath?.length > 1 ? (
										<Carousel
											arrows
											dots={{ className: 'custom-carousel-dots' }}
										>
											{post?.mediaPath?.map((image, index) => (
												<Image
													key={index}
													className="card-image"
													alt={`Post image ${index + 1}`}
													src={image}
												/>
											))}
										</Carousel>
									) : (
										<Image
											className="card-image"
											alt={post?.content}
											src={post?.mediaPath?.[0]}
										/>
									)}

									{/* Reaction Icons */}
									<div style={{ marginTop: '10px', display: 'flex' }}>
										{/* Like Icon */}
										<ToggleLike
											postId={post?.id}
											userId={userId}
											isLiked={post?.isLiked}
											onLikeToggle={handleLikeToggle}
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
											onClick={() => {
												setSelectedPost(post);
												setIsPostModalVisible(true);
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

									<div
										style={{ display: 'flex', justifyContent: 'space-between' }}
									>
										{/* Likes */}
										<p style={{ fontWeight: '600', margin: '10px 0' }}>
											{getLikeCountText(post?.likeCount)}
										</p>
										{/* Donate */}
										<p style={{ fontWeight: '600', margin: '10px 0' }}>
											{post?.totalDonation?.toLocaleString('vi-VN')} VND
										</p>
									</div>

									{/* Username - Caption */}
									<p>
										<span style={{ fontWeight: '600' }}>
											{post?.userInfo?.username}
										</span>{' '}
										{post?.content}
									</p>

									{/* View all comments */}
									<a
										style={{
											color: 'gray',
											fontSize: '14px',
											display: post?.commentCount > 0 ? 'block' : 'none',
										}}
										href="javascript:void(0);" // Loại bỏ điều hướng URL
										onClick={() => {
											setSelectedPost(post);
											setIsPostModalVisible(true);
										}}
									>
										{getCommentCountText(post?.commentCount)}
									</a>

									{/* Comment Input Box */}
									<CreateCmt postId={post?.id} />
								</Card>
							</LazyLoad>
						))
					) : (
						<PostSkeletonLoader />
					)}
				</InfiniteScroll>

				{/* Modal for Update Post */}
				<UpdatePost
					isUpdatePostModalOpen={isUpdateVisible}
					setIsUpdatePostModalOpen={setIsUpdateVisible}
					post={selectedPost}
				/>

				{/* Modal for Post Detail */}
				<PostModal
					isPostDetailModalOpen={isPostModalVisible}
					setIsPostDetailModalOpen={setIsPostModalVisible}
					setAllPosts={setAllPosts}
					post={selectedPost}
				/>
			</Col>

			{/* Sider Right Section */}
			<Col xs={24} lg={8} style={{ paddingLeft: '25px' }}>
				<SuggestedList />
			</Col>
		</Row>
	);
}

export default UserHome;

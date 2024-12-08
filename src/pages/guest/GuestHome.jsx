import {
	Row,
	Col,
	Card,
	Image,
	Avatar,
	Carousel,
	Button,
	Input,
	Menu,
	Dropdown,
	Empty,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect } from 'react';
import '../user/UserHome.css';
import SuggestedList from '../../components/suggested/SuggestedList';
import { useGetRandomPosts } from '../../hooks/usePost';
import LazyLoad from 'react-lazyload';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostSkeletonLoader from '../../components/loading/skeletonLoader/PostSkeleton';

const { TextArea } = Input;

function GuestHome() {
	const [menuVisible, setMenuVisible] = useState(false);
	const [comments, setComments] = useState({}); // State để lưu trữ comment cho từng post
	const [showEmojiPicker, setShowEmojiPicker] = useState({});

	const [table, setTable] = useState({
		page: 1,
		take: 2,
	});

	const paginationOptions = {
		page: table.page,
		take: table.take,
	};

	const { data: post } = useGetRandomPosts(paginationOptions);
	const [allPosts, setAllPosts] = useState([]);
	console.log('allPosts:', allPosts);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		if (post) {
			setAllPosts((prevPosts) => [...prevPosts, ...post.data]);

			// Kiểm tra xem đã tải hết tất cả bài viết hay chưa
			if (post.data.length === 0 || post.data.length < table.take) {
				setHasMore(false); // Không còn dữ liệu để tải thêm
			}
		}
	}, [post, table.take]);

	const fetchMoreData = () => {
		setTable((prevTable) => ({
			...prevTable,
			page: prevTable.page + 1, // Tăng số trang để tải thêm bài viết
		}));
	};

	const [likedPosts, setLikedPosts] = useState({});
	const handleLikeClick = (postId) => {
		setLikedPosts((prevLikedPosts) => ({
			...prevLikedPosts,
			[postId]: !prevLikedPosts[postId],
		}));
	};

	const handleEmojiClick = (event, emojiObject, postId) => {
		if (emojiObject) {
			setComments((prevComments) => ({
				...prevComments,
				[postId]: (prevComments[postId] || '') + emojiObject.emoji,
			}));
		}
		setShowEmojiPicker((prev) => ({ ...prev, [postId]: false }));
	};

	const handleInputChange = (e, postId) => {
		const { value } = e.target;
		setComments((prevComments) => ({
			...prevComments,
			[postId]: value,
		}));
	};

	const toggleEmojiPicker = (postId) => {
		setShowEmojiPicker((prev) => ({
			...prev,
			[postId]: !prev[postId],
		}));
	};

	const handlePostComment = (postId) => {
		if (comments[postId] && comments[postId].trim() !== '') {
			console.log(`Comment posted for post ${postId}:`, comments[postId]);
			setComments((prevComments) => ({
				...prevComments,
				[postId]: '',
			}));
		}
	};

	return (
		<Row style={{ justifyContent: 'center' }} gutter={[16, 16]}>
			<Col
				xs={24}
				lg={13}
				style={{ paddingLeft: '40px', paddingRight: '40px' }}
			>
				{/* Dropdown and Create Post Box */}
				<div className="dropdown-container">
					<span className="dropdown-text">For Guest</span>
				</div>

				{/* Existing Post Data */}
				<InfiniteScroll
					dataLength={allPosts.length}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={
						<>
							<PostSkeletonLoader /> {/* Hiển thị loader là SkeletonPost */}
							{/* Có thể hiển thị nhiều loader */}
						</>
					}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>There are currently no posts.</b>
						</p>
					}
				>
					{allPosts.length > 0 ? (
						allPosts.map((post) => (
							<LazyLoad key={post.id} height={200} offset={100}>
								<Card key={post.id} hoverable style={{ marginBottom: 16 }}>
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
												src={post.userInfo.profilePicture}
												style={{ marginRight: 15 }}
											/>
											<div>
												<a
													href={`/profile/${post.userInfo.username}`}
													style={{ color: 'black', fontWeight: '600' }}
												>
													{post.userInfo.username}
												</a>
												<span
													style={{
														color: 'gray',
														fontSize: '12px',
														marginLeft: 8,
													}}
												>
													• {post.createdAt}
												</span>
											</div>
										</div>
										{/* Dropdown Icon Button */}
										<Dropdown
											overlay={
												<Menu>
													<Menu.Item key="1">Copy link</Menu.Item>
													<Menu.Item key="2">About this account</Menu.Item>
													<Menu.Item key="3">Cancel</Menu.Item>
												</Menu>
											}
											trigger={['click']}
											visible={menuVisible}
											onVisibleChange={setMenuVisible}
										>
											<Button
												icon={<EllipsisOutlined />}
												shape="circle"
												style={{ border: 'none', boxShadow: 'none' }}
											/>
										</Dropdown>
									</div>

									{/* Image Carousel */}
									{post.mediaPath.length > 1 ? (
										<Carousel
											arrows
											dots={{ className: 'custom-carousel-dots' }}
										>
											{post.mediaPath.map((image, index) => (
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
											alt={post.content}
											src={post.mediaPath[0]}
										/>
									)}

									{/* Reaction Icons */}
									<div style={{ marginTop: '10px', display: 'flex' }}>
										{/* Like Icon */}
										<Button
											onClick={() => handleLikeClick(post.id)}
											style={{
												marginRight: 10,
												background: 'none',
												border: 'none',
												padding: 0,
												cursor: 'pointer',
											}}
										>
											<img
												src={
													likedPosts[post.id]
														? 'https://res.cloudinary.com/dekmn1kko/image/upload/v1727255659/icon/liked-op1-icon.png'
														: 'https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/notification-icon.png'
												}
												alt="Like"
												style={{
													width: '29px',
													height: '29px',
													opacity: likedPosts[post.id] ? 1 : 0.8,
													transition: 'opacity 0.3s ease',
												}}
												onMouseEnter={(e) => (e.target.style.opacity = 0.5)}
												onMouseLeave={(e) =>
													(e.target.style.opacity = likedPosts[post.id]
														? 1
														: 0.8)
												}
											/>
										</Button>

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

									{/* Likes */}
									<p style={{ fontWeight: '600', margin: '10px 0' }}>
										{post.likeCount === 0
											? 'Be the first to like this'
											: `${post.likeCount} ${post.likeCount === 1 ? 'like' : 'likes'}`}
									</p>

									{/* Username - Caption */}
									<p>
										<span style={{ fontWeight: '600' }}>
											{post.userInfo.username}
										</span>{' '}
										{post.content}
									</p>

									{/* View all comments */}
									<a
										style={{
											color: 'gray',
											fontSize: '14px',
											display: post.commentsCount > 0 ? 'block' : 'none',
										}}
										href={`/post/${post.id}`}
									>
										View all {post.commentsCount} comments
									</a>

									{/* Comment Input Box */}
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											borderBottom: '1px solid #dbdbdb',
											paddingTop: '5px',
										}}
									>
										<TextArea
											placeholder="Add a comment..."
											value={comments[post.id] || ''}
											onChange={(e) => handleInputChange(e, post.id)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													handlePostComment(post.id);
												}
											}}
											style={{
												flex: 1,
												border: 'none',
												outline: 'none',
												boxShadow: 'none',
												padding: '20px 0 0 0',
												fontSize: '14px',
												minHeight: '30px',
												height: '30px',
											}}
											autoSize={{ minRows: 2, maxRows: 6 }}
										/>
										{comments[post.id] && (
											<Button
												type="link"
												style={{
													color: '#0095f6',
													padding: 0,
													fontSize: '14px',
													fontWeight: '500',
												}}
												onClick={() => handlePostComment(post.id)}
											>
												Post
											</Button>
										)}
										<button
											onClick={() => toggleEmojiPicker(post.id)}
											style={{
												background: 'none',
												border: 'none',
												marginLeft: '10px',
												padding: 0,
												cursor: 'pointer',
											}}
										>
											<img
												src="https://res.cloudinary.com/dekmn1kko/image/upload/v1727253993/icon/smile-icon.png"
												alt="Emoji Picker"
												style={{ width: '20px', height: '20px' }}
											/>
										</button>
										{showEmojiPicker[post.id] && (
											<div style={{ position: 'absolute', zIndex: 10 }}>
												<EmojiPicker
													onEmojiClick={(e, emojiObject) =>
														handleEmojiClick(e, emojiObject, post.id)
													}
												/>
											</div>
										)}
									</div>
								</Card>
							</LazyLoad>
						))
					) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					)}
				</InfiniteScroll>
			</Col>

			{/* Sider Right Section */}
			<Col xs={24} lg={8} style={{ paddingLeft: '25px' }}>
				<SuggestedList />
			</Col>
		</Row>
	);
}

export default GuestHome;

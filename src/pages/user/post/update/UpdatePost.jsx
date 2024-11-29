import './UpdatePost.css';
import { useState, useEffect } from 'react';
import {
	Modal,
	Avatar,
	Button,
	Carousel,
	message,
	Image,
	Form,
	Input,
} from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import { PropTypes } from 'prop-types';
import { useUpdatePost } from '../../../../hooks/usePost';
import EmojiPicker from 'emoji-picker-react';

const { TextArea } = Input;

function UpdatePost({ isUpdatePostModalOpen, setIsUpdatePostModalOpen, post }) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);
	const postId = post?.id;

	const handleUpdatePostCancel = () => {
		setIsUpdatePostModalOpen(false);
	};

	const [content, setContent] = useState(post?.content || '');
	const [fileMediaPathList, setfileMediaPathList] = useState([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);

	const [formUpdate] = Form.useForm();
	const { mutate: updatePost } = useUpdatePost(postId);

	useEffect(() => {
		if (isUpdatePostModalOpen) {
			setContent(post?.content || '');
		}
	}, [isUpdatePostModalOpen, post]);

	const handleUploadMediaPath = (info) => {
		setfileMediaPathList(info.fileList);
	};

	const handleContentChange = (e) => {
		setContent(e.target.value);
	};

	const toggleEmojiPicker = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	const handleEmojiClick = (event, emojiObject) => {
		if (emojiObject) {
			setContent((prevContent) => prevContent + emojiObject.emoji);
		}
		setShowEmojiPicker(false);
	};

	const handlePostUpdateOk = async () => {
		try {
			if (!content || content.trim() === '') {
				message.error('Please enter content');
				return;
			}
			const mediaPath = fileMediaPathList.map((item) => item.originFileObj);

			await updatePost({
				content: content,
				mediaPath: mediaPath,
				userId: userId,
			});
			message.success('Post updated successfully');
			formUpdate.resetFields();
			setContent('');
			setfileMediaPathList([]);
			setIsUpdatePostModalOpen(false);
		} catch (error) {
			console.log(error);
			message.error('Failed to update Post');
		}
	};

	return (
		<>
			<Modal
				className="post-update-modal"
				open={isUpdatePostModalOpen}
				onOk={handlePostUpdateOk}
				onCancel={handleUpdatePostCancel}
				destroyOnClose={true}
				forceRender={true}
				closeIcon={false}
				footer={null}
				style={{
					top: 50,
					padding: 0,
					backgroundColor: '#f6f6f6',
					borderRadius: '10px',
				}}
			>
				{/* Navbar với nút Cancel, tiêu đề, và nút Done */}
				<div className="modal-navbar">
					<Button onClick={handleUpdatePostCancel} type="text">
						Cancel
					</Button>
					<div className="title-modal-navbar">Edit info</div>
					<Button
						onClick={handlePostUpdateOk}
						type="text"
						style={{ fontWeight: '500', color: '#1890ff' }}
					>
						Done
					</Button>
				</div>
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
						<Form name="updatePost" layout="vertical" form={formUpdate}>
							<div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
								<div style={{ flex: 1 }}>
									{userInfo && (
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												marginBottom: '10px',
											}}
										>
											{userInfo.profilePicture && (
												<Avatar
													src={userInfo.profilePicture}
													style={{ marginRight: '10px' }}
												/>
											)}
											{userInfo.username && (
												<div style={{ color: 'black', fontWeight: '600' }}>
													{userInfo.username}
												</div>
											)}
										</div>
									)}

									<TextArea
										rows={10}
										placeholder="Enter your content..."
										value={content}
										onChange={handleContentChange}
										style={{
											marginBottom: '10px',
											padding: '0',
											border: 'none',
											outline: 'none',
											boxShadow: 'none',
											marginTop: '10px',
										}}
										autoSize={{ minRows: 1, maxRows: 15 }}
									/>
									<div
										className="item-content"
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											marginTop: '10px',
										}}
									>
										<button
											onClick={toggleEmojiPicker}
											className="emoji-picker-button"
										>
											<img
												src="https://res.cloudinary.com/dekmn1kko/image/upload/v1727253993/icon/smile-icon.png"
												alt="Emoji Picker"
												style={{ width: '20px', height: '20px' }}
											/>
										</button>

										{showEmojiPicker && (
											<div style={{ position: 'absolute', zIndex: 10 }}>
												<EmojiPicker onEmojiClick={handleEmojiClick} />
											</div>
										)}

										<span style={{ fontSize: '14px', color: '#999' }}>
											{content.length}/2000
										</span>
									</div>
								</div>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		</>
	);
}

UpdatePost.propTypes = {
	post: PropTypes.shape({
		mediaPath: PropTypes.arrayOf(PropTypes.string),
		id: PropTypes.string,
		content: PropTypes.string,
		likeCount: PropTypes.number,
	}).isRequired,
};

export default UpdatePost;

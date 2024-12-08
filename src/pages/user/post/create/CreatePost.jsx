import './CreatePost.css';
import { useState } from 'react';
import {
	Modal,
	Upload,
	Button,
	Avatar,
	Input,
	message,
	Form,
	Image,
	Carousel,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import { useCreatePost } from '../../../../hooks/usePost';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { useGetUsersInfoDetal } from '../../../../hooks/useUser';
import { jwtDecode } from 'jwt-decode';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';

const { TextArea } = Input;
const { Item } = Form;

// eslint-disable-next-line react/prop-types
function CreatePost({ isCreatePostModalOpen, setIsCreatePostModalOpen }) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;
	const { data: userInfo } = useGetUsersInfoDetal(userId);

	const [content, setContent] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [fileMediaPathList, setfileMediaPathList] = useState([]);
	const handleContentChange = (e) => {
		setContent(e.target.value);
	};

	const handlePostCreateCancel = () => {
		setIsCreatePostModalOpen(false);
	};

	const [formCreate] = Form.useForm();
	const { mutate: createPost } = useCreatePost();
	const [isLoadingBar, setIsLoadingBar] = useState(false);

	const handleUploadMediaPath = (info) => {
		setfileMediaPathList(info.fileList);
	};

	const handlePostCreateOk = async () => {
		try {
			if (!content.trim()) {
				message.error('Please enter content');
				return;
			}
			const mediaPath = fileMediaPathList.map((item) => item.originFileObj);

			setIsLoadingBar(true);
			console.log('isLoading', mediaPath);

			// Gọi trực tiếp createPost
			await new Promise((resolve, reject) => {
				createPost(
					{
						content,
						mediaPath,
						userId: userId,
					},
					{
						onSuccess: resolve,
						onError: reject,
					},
				);
			});

			// Sau khi tạo bài viết thành công
			message.success('Post created successfully');
			setContent('');
			setfileMediaPathList([]);
		} catch (error) {
			console.error(error);
			message.error('Failed to create Post');
		} finally {
			setIsLoadingBar(false);
			setIsCreatePostModalOpen(false);
		}
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

	return (
		<>
			<Modal
				className="post-create-modal"
				open={isCreatePostModalOpen}
				onOk={handlePostCreateOk}
				onCancel={handlePostCreateCancel}
				closeIcon={false}
				footer={null}
			>
				<LoadingBar isLoading={isLoadingBar} />
				<div className="modal-navbar">
					<Button onClick={handlePostCreateCancel} type="text">
						Cancel
					</Button>
					<div className="title-modal-navbar">Create new post</div>
					<Button
						onClick={handlePostCreateOk}
						type="text"
						style={{ fontWeight: '500', color: '#1890ff' }}
					>
						Done
					</Button>
				</div>
				<Form name="createPost" layout="vertical" form={formCreate}>
					<div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
						<div style={{ flex: 1 }}>
							{fileMediaPathList.length === 0 && (
								<Item name="fileImage" className="file-image-post">
									<Upload.Dragger
										multiple
										name="media"
										beforeUpload={() => false}
										fileList={fileMediaPathList}
										onChange={handleUploadMediaPath}
										className="upload-dragger-post"
									>
										<p className="ant-upload-drag-icon">
											<UploadOutlined
												style={{ fontSize: '48px', color: '#1890ff' }}
											/>
										</p>
										<p className="ant-upload-text">
											Drag and drop photos or videos here
										</p>
										<Button className="select-img-post-btn">
											Upload Image
										</Button>
									</Upload.Dragger>
								</Item>
							)}

							{fileMediaPathList.length > 0 && (
								<div className="post-create-image">
									<Carousel
										afterChange={() =>
											window.dispatchEvent(new Event('resize'))
										}
										arrows
										dots={{ className: 'custom-carousel-dots' }}
									>
										{fileMediaPathList.map((file) => (
											<div key={file.uid}>
												<Image
													src={URL.createObjectURL(file.originFileObj)}
													alt="preview"
													maxWidth={100}
													style={{ marginBottom: '10px', objectFit: 'cover' }}
												/>
											</div>
										))}
									</Carousel>
								</div>
							)}
						</div>

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
								rows={6}
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
								autoSize={{ minRows: 1, maxRows: 10 }}
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

							{fileMediaPathList.length > 0 && (
								<div>
									<Upload
										multiple
										name="media"
										beforeUpload={() => false}
										fileList={fileMediaPathList}
										onChange={(info) => setfileMediaPathList(info.fileList)}
										showUploadList={{ showRemoveIcon: true }}
									>
										<Button className="select-more-img-post-btn">
											More Images
										</Button>
									</Upload>
								</div>
							)}
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
}

export default CreatePost;

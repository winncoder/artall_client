import './CreateCmt.css';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button, Input, Form, message } from 'antd';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useCreateComment } from '../../../../hooks/useComment';

const { TextArea } = Input;

function CreateCmt({ postId }) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;

	const [comment, setComment] = useState({});
	const [showEmojiPicker, setShowEmojiPicker] = useState({});

	const handleInputChange = (e, postId) => {
		const { value } = e.target;
		setComment((prevComments) => ({
			...prevComments,
			[postId]: value,
		}));
	};

	const handleEmojiClick = (event, emojiObject, postId) => {
		if (emojiObject) {
			setComment((prevComments) => ({
				...prevComments,
				[postId]: (prevComments[postId] || '') + emojiObject.emoji,
			}));
		}
		setShowEmojiPicker((prev) => ({ ...prev, [postId]: false }));
	};
	const toggleEmojiPicker = (postId) => {
		setShowEmojiPicker((prev) => ({
			...prev,
			[postId]: !prev[postId],
		}));
	};

	const [formCreate] = Form.useForm();
	const { mutate: createComment } = useCreateComment();

	const handleCommentCreateOk = async () => {
		try {
			const content = comment[postId];
			if (!content || content.trim() === '') {
				message.error('Please enter content');
				return;
			}

			createComment({
				content: content,
				userId: userId,
				postId: postId,
			});
			message.success('Comment created successfully');
			setComment((prevComments) => ({
				...prevComments,
				[postId]: '',
			}));
		} catch (error) {
			console.log(error);
			message.error('Failed to create comment');
		}
	};

	return (
		<>
			<Form name="createComment" layout="vertical" form={formCreate}>
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
						value={comment[postId] || ''}
						onChange={(e) => handleInputChange(e, postId)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								if (comment[postId] && comment[postId].trim() !== '') {
									handleCommentCreateOk(postId);
								} else {
									message.warning('Please enter content before posting.');
								}
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
					{comment[postId] && (
						<Button
							type="link"
							style={{
								color: '#0095f6',
								padding: 0,
								fontSize: '14px',
								fontWeight: '500',
							}}
							onClick={() => handleCommentCreateOk(postId)}
						>
							Post
						</Button>
					)}
					<button
						onClick={() => toggleEmojiPicker(postId)}
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
					{showEmojiPicker[postId] && (
						<div style={{ position: 'absolute', zIndex: 10 }}>
							<EmojiPicker
								onEmojiClick={(e, emojiObject) =>
									handleEmojiClick(e, emojiObject, postId)
								}
							/>
						</div>
					)}
				</div>
			</Form>
		</>
	);
}

export default CreateCmt;

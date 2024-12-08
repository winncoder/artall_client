import './UpdateComment.css';
import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Avatar, Card, Input, message, Form } from 'antd';
import CommentSkeletonLoader from '../../../../components/loading/skeletonLoader/CommentSkeleton';
import { useGetComments } from '../../../../hooks/useComment';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { useUpdateComment } from '../../../../hooks/useComment';
import EmojiPicker from 'emoji-picker-react';
import DeleteComment from '../delete/DeleteComment';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';
import ToggleCommentLike from '../../commentLike/toggle/ToggleCommentLike';

const { TextArea } = Input;

function CommentUpdateDetail({ postId }) {
	useCheckAuthorization('user');
	const access_token = localStorage.getItem('access_token');
	const userId = jwtDecode(access_token).sub;

	// COMMENT SECTION
	const [table, setTable] = useState({
		page: 1,
		take: 5,
	});

	const paginationOptions = {
		page: table.page,
		take: table.take,
		postId: postId,
	};

	console.log('paginationOptions', paginationOptions);

	const [commentsByPost, setCommentsByPost] = useState({});
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const { data: comment, isLoading } = useGetComments(paginationOptions);

	console.log('comment', comment);
	useEffect(() => {
		if (comment) {
			setCommentsByPost((prevCommentsByPost) => {
				const uniqueComments = new Map(
					(prevCommentsByPost[postId] || []).map((c) => [c.id, c]),
				);
				comment.data.forEach((c) => uniqueComments.set(c.id, c));

				setIsLoadingMore(false);

				return {
					...prevCommentsByPost,
					[postId]: Array.from(uniqueComments.values()),
				};
			});
		}
	}, [comment, postId, table.page]);

	const handleLoadMoreComments = () => {
		setIsLoadingMore(true);
		setTable((prevTable) => ({
			...prevTable,
			page: prevTable.page + 1,
		}));
	};

	// useEffect(() => {
	// 	if (isPostDetailModalOpen) {
	// 		setTable({ page: 1, take: 5 });
	// 	} else {
	// 		setCommentsByPost((prevCommentsByPost) => ({
	// 			...prevCommentsByPost,
	// 			[postId]: [],
	// 		}));
	// 		setTable({ page: 1, take: 5 });
	// 	}
	// }, [postId, isPostDetailModalOpen]);

	const [editingCommentId, setEditingCommentId] = useState(null);
	const [editedContent, setEditedContent] = useState('');

	const [formUpdate] = Form.useForm();
	const { mutate: updateComment } = useUpdateComment(editingCommentId);
	const [fileMediaPathList, setfileMediaPathList] = useState([]);
	const handleUploadMediaPath = (info) => {
		setfileMediaPathList(info.fileList);
	};

	const handleEditComment = (commentId, content) => {
		setEditingCommentId(commentId);
		setEditedContent(content);
	};

	const [isLoadingBar, setIsLoadingBar] = useState(false);
	const handleDeleteSuccess = (commentId) => {
		setCommentsByPost((prevCommentsByPost) => {
			const updatedComments = (prevCommentsByPost[postId] || []).filter(
				(comment) => comment.id !== commentId,
			);
			return {
				...prevCommentsByPost,
				[postId]: updatedComments,
			};
		});
		setIsLoadingBar(false);
	};

	const handleCancelEdit = () => {
		setEditingCommentId(null);
		setEditedContent('');
	};

	const handleCommentUpdateOk = async () => {
		try {
			if (!editedContent || editedContent.trim() === '') {
				message.error('Please enter content');
				return;
			}
			const mediaPath = fileMediaPathList.map((item) => item.originFileObj);

			await updateComment({
				content: editedContent,
				mediaPath: mediaPath,
				userId: userId,
			});

			setCommentsByPost((prevCommentsByPost) => {
				const updatedComments = (prevCommentsByPost[postId] || []).map(
					(comment) =>
						comment.id === editingCommentId
							? { ...comment, content: editedContent, mediaPath: mediaPath }
							: comment,
				);

				return {
					...prevCommentsByPost,
					[postId]: updatedComments,
				};
			});

			message.success('Comment updated successfully');
			formUpdate.resetFields();
			setEditingCommentId(null);
			setfileMediaPathList([]);
			setEditedContent('');
		} catch (error) {
			console.log(error);
			message.error('Failed to update Post');
		}
	};

	const [showEmojiPicker, setShowEmojiPicker] = useState({});
	const handleEmojiClick = (event, emojiObject, postId) => {
		if (emojiObject && emojiObject.emoji) {
			setEditedContent((prevContent) => prevContent + emojiObject.emoji);
		}
		setShowEmojiPicker((prev) => ({ ...prev, [postId]: false }));
	};
	const toggleEmojiPicker = (postId) => {
		setShowEmojiPicker((prev) => ({
			...prev,
			[postId]: !prev[postId],
		}));
	};

	return (
		<>
			<LoadingBar isLoading={isLoadingBar} />
			<div
				className="comments-section"
				style={{ overflow: 'hidden', marginTop: '10px', zIndex: 1 }}
			>
				{comment?.data.length > 0 ? (
					comment?.data.map((comment) => (
						<Card
							key={comment?.id}
							style={{ marginBottom: 16, position: 'relative' }}
						>
							{/* Skeleton loading cho từng comment */}
							{isLoading && !isLoadingMore ? (
								<CommentSkeletonLoader />
							) : (
								<div style={{ display: 'flex' }}>
									<div>
										<Avatar
											src={comment.user.profilePicture}
											alt={comment.user.username}
											style={{ marginRight: '10px' }}
										/>
									</div>
									<div style={{ flex: 1, marginRight: '25px' }}>
										<div>
											<span style={{ fontWeight: '600', marginRight: '5px' }}>
												{comment.user.username}
											</span>
											{editingCommentId === comment.id ? (
												<Form
													name="updateComment"
													layout="vertical"
													form={formUpdate}
												>
													<div
														style={{
															border: '1px solid #d9d9d9',
															borderRadius: '7px',
															padding: '10px',
															display: 'flex',
															alignItems: 'flex-start',
														}}
													>
														<TextArea
															value={editedContent}
															onChange={(e) => setEditedContent(e.target.value)}
															rows="2"
															style={{
																border: 'none',
																outline: 'none',
																boxShadow: 'none',
																padding: '0',
															}}
															autoSize={{ minRows: 1, maxRows: 15 }}
														/>
														<button
															onClick={() => toggleEmojiPicker(postId)}
															style={{
																background: 'none',
																border: 'none',
																marginLeft: '10px',
																padding: 0,
																cursor: 'pointer',
																paddingTop: '1px',
															}}
														>
															<img
																src="https://res.cloudinary.com/dekmn1kko/image/upload/v1727253993/icon/smile-icon.png"
																alt="Emoji Picker"
																style={{
																	width: '20px',
																	height: '20px',
																	scale: '80%',
																}}
															/>
														</button>
														{showEmojiPicker[postId] && (
															<div
																style={{
																	position: 'absolute',
																	top: '0%',
																	left: 0,
																	zIndex: 1000, // Đảm bảo khung Emoji hiển thị phía trên
																}}
															>
																<EmojiPicker
																	onEmojiClick={(e, emojiObject) =>
																		handleEmojiClick(e, emojiObject, postId)
																	}
																/>
															</div>
														)}
													</div>
												</Form>
											) : (
												<span style={{ fontWeight: '400' }}>
													{comment.content}
												</span>
											)}
										</div>
										{/* Thời gian tạo và số lượt thích */}
										<div className="comment-meta">
											<span>
												{new Date(comment.createdAt).toLocaleDateString()}
											</span>
											{comment.likeCount > 0 && (
												<span style={{ margin: '0 10px' }}>
													{comment.likeCount} like
													{comment.likeCount > 1 ? 's' : ''}
												</span>
											)}

											{/* Hiển thị "Edit" nếu userId === comment.userId */}
											{userId === comment.userId && (
												<>
													{editingCommentId === comment.id ? (
														<>
															<span
																onClick={() =>
																	handleCommentUpdateOk(comment.id)
																}
																style={{
																	marginLeft: '10px',
																	cursor: 'pointer',
																	color: '#1890ff',
																	fontWeight: '500',
																}}
															>
																Save
															</span>
															<span
																onClick={handleCancelEdit}
																style={{
																	marginLeft: '10px',
																	cursor: 'pointer',
																	color: '#ff4d4f',
																	fontWeight: '500',
																}}
															>
																Cancel
															</span>
														</>
													) : (
														<>
															<span
																onClick={() =>
																	handleEditComment(comment.id, comment.content)
																}
																style={{
																	marginLeft: '10px',
																	cursor: 'pointer',
																	color: '#1890ff',
																	fontWeight: '500',
																}}
															>
																Edit
															</span>
															<DeleteComment
																commentId={comment.id}
																onDeleteSuccess={handleDeleteSuccess}
																setLoading={setIsLoadingBar}
															/>
														</>
													)}
												</>
											)}
										</div>
									</div>

									{/* Small Like Button */}
									<ToggleCommentLike
										commentId={comment?.id}
										userId={userId}
										isLiked={comment?.isLiked}
									/>
								</div>
							)}
						</Card>
					))
				) : (
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						No comments yet.
					</div>
				)}

				{/* Load More Icon */}
				{comment?.meta.hasNextPage && (
					<div
						style={{
							textAlign: 'center',
							marginTop: '10px',
							cursor: 'pointer',
						}}
						onClick={handleLoadMoreComments}
					>
						{isLoadingMore ? (
							<p> Loading </p>
						) : (
							<img
								src="https://res.cloudinary.com/dekmn1kko/image/upload/v1730176010/icon/add-icon.png"
								alt="Load More"
								style={{ width: '24px', height: '24px' }}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
}

CommentUpdateDetail.propTypes = {
	postId: PropTypes.string.isRequired,
	isPostDetailModalOpen: PropTypes.bool.isRequired,
};

export default CommentUpdateDetail;

// import './UpdateComment.css';
import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Avatar, Card } from 'antd';
import CommentSkeletonLoader from '../../../../components/loading/skeletonLoader/CommentSkeleton';
import { useGetComments } from '../../../../hooks/useComment';
import { useCheckAuthorization } from '../../../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';

import DeleteComment from '../../../user/comment/delete/DeleteComment';
import LoadingBar from '../../../../components/loading/loadingbar/LoadingBar';

function CommentDetail({ postId, isPostDetailModalOpen }) {
	useCheckAuthorization('admin');
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

	const [commentsByPost, setCommentsByPost] = useState({});
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const {
		data: comment,
		isLoading,
		refetch,
	} = useGetComments(paginationOptions);

	useEffect(() => {
		if (isPostDetailModalOpen) {
			refetch();
		}
	}, [isPostDetailModalOpen, refetch]);

	useEffect(() => {
		if (comment && isPostDetailModalOpen) {
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
	}, [comment, isPostDetailModalOpen, postId, table.page]);

	const handleLoadMoreComments = () => {
		setIsLoadingMore(true);
		setTable((prevTable) => ({
			...prevTable,
			page: prevTable.page + 1,
		}));
	};

	useEffect(() => {
		if (isPostDetailModalOpen) {
			setTable({ page: 1, take: 5 });
		} else {
			setCommentsByPost((prevCommentsByPost) => ({
				...prevCommentsByPost,
				[postId]: [],
			}));
			setTable({ page: 1, take: 5 });
		}
	}, [postId, isPostDetailModalOpen]);

	const displayedComments = isPostDetailModalOpen
		? commentsByPost[postId] || []
		: null;

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

	return (
		<>
			<LoadingBar isLoading={isLoadingBar} />
			<div
				className="comments-section"
				style={{ overflow: 'hidden', marginTop: '10px', zIndex: 1 }}
			>
				{/* Kiểm tra trạng thái API */}
				{isLoading ? (
					<CommentSkeletonLoader /> // Hiển thị loader khi đang tải dữ liệu
				) : displayedComments && displayedComments.length > 0 ? (
					// Hiển thị danh sách comment nếu có
					displayedComments.map((comment) => (
						<Card
							key={comment?.id}
							style={{ marginBottom: 16, position: 'relative' }}
						>
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
										<span style={{ fontWeight: '400' }}>{comment.content}</span>
									</div>
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
										<DeleteComment
											commentId={comment.id}
											onDeleteSuccess={handleDeleteSuccess}
											setLoading={setIsLoadingBar}
										/>
									</div>
								</div>
							</div>
						</Card>
					))
				) : (
					// Hiển thị thông báo rỗng nếu không có comment
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						No comments yet.
					</div>
				)}

				{/* Load More Icon */}
				{comment?.meta?.hasNextPage && (
					<div
						style={{
							textAlign: 'center',
							marginTop: '10px',
							cursor: 'pointer',
						}}
						onClick={handleLoadMoreComments}
					>
						{isLoadingMore ? (
							<p>Loading...</p>
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

CommentDetail.propTypes = {
	postId: PropTypes.string.isRequired,
	isPostDetailModalOpen: PropTypes.bool.isRequired,
};

export default CommentDetail;

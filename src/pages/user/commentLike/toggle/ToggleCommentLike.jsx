import { Button, message } from 'antd';
import { useToggleCommentLike } from '../../../../hooks/useCommentLike';
import { useState } from 'react';

function ToggleCommentLike({
	commentId,
	userId,
	isLiked: initialIsCommentLiked,
}) {
	const { mutate: toggleCommentLike } = useToggleCommentLike();
	const [isLoading, setIsLoading] = useState(false);
	const [isLiked, setIsLiked] = useState(initialIsCommentLiked);

	console.log('commentId', commentId);
	console.log('userId', userId);
	console.log('isLiked', isLiked);
	console.log('initialIsCommentLiked', initialIsCommentLiked);

	const handleLikeToggle = async () => {
		setIsLoading(true);
		try {
			await toggleCommentLike({ commentId, userId });
			setIsLiked(!isLiked);
			message.success('Toggled successfully');
		} catch (error) {
			console.error(error);
			message.error('Failed to toggle like');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleLikeToggle}
			style={{
				background: 'none',
				border: 'none',
				padding: 0,
				cursor: 'pointer',
				position: 'absolute',
				right: '0px',
				top: '40%',
				transform: 'translateY(-50%)',
			}}
			loading={isLoading}
		>
			<img
				src={
					!isLiked
						? 'https://res.cloudinary.com/dekmn1kko/image/upload/v1727255659/icon/liked-op1-icon.png'
						: 'https://res.cloudinary.com/dekmn1kko/image/upload/v1726859749/icon/notification-icon.png'
				}
				alt="Like"
				style={{
					width: '18px',
					height: '18px',
					opacity: isLiked ? 1 : 0.8,
					transition: 'opacity 0.3s ease',
				}}
				onMouseEnter={(e) => (e.target.style.opacity = 0.5)}
				onMouseLeave={(e) => (e.target.style.opacity = isLiked ? 1 : 0.8)}
			/>
		</Button>
	);
}

export default ToggleCommentLike;

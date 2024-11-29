import { useDeleteComment } from '../../../../hooks/useComment';

function DeleteComment({ commentId, onDeleteSuccess, setLoading }) {
	const { mutate: deleteComment } = useDeleteComment(commentId);

	const handleDeleteComment = () => {
		setLoading(true);
		deleteComment(null, {
			onSuccess: () => {
				onDeleteSuccess(commentId);
			},
			onError: (error) => {
				console.error(error);
				setLoading(false);
			},
		});
	};

	return (
		<span
			onClick={handleDeleteComment}
			style={{
				marginLeft: '10px',
				cursor: 'pointer',
				color: '#ff4d4f',
				fontWeight: '500',
			}}
		>
			Delete
		</span>
	);
}

export default DeleteComment;

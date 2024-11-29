import { Button, message } from 'antd';
import { useToggleFollow } from '../../../../hooks/useFollow';
import { useGetFollows } from '../../../../hooks/useFollow';
import { useEffect, useState } from 'react';

function ToggleFollower({ followerId, followingId }) {
	// FOLLOW
	const { mutate: toggleFollow } = useToggleFollow();

	const [isFollowing, setIsFollowing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const body = {
		follower: followerId,
		following: followingId,
	};
	const { data: followStatus } = useGetFollows(body);
	useEffect(() => {
		if (followStatus?.data.length > 0) {
			setIsFollowing(true);
		} else {
			setIsFollowing(false);
		}
	}, [followStatus]);

	const handleFollowToggle = async () => {
		setIsLoading(true);
		try {
			await toggleFollow({
				followingId: followingId,
				followerId: followerId,
			});
			setIsFollowing(!isFollowing);
			message.success('Toggled successfully');
		} catch (error) {
			console.error(error);
			message.error('Failed to toggle follow');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{!isFollowing ? (
				<Button
					className="follow-button"
					onClick={handleFollowToggle}
					loading={isLoading}
				>
					Follow
				</Button>
			) : (
				<Button
					className="unfollow-button"
					onClick={handleFollowToggle}
					loading={isLoading}
				>
					Unfollow
				</Button>
			)}
		</>
	);
}

export default ToggleFollower;

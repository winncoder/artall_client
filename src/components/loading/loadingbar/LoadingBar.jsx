import { useState, useEffect } from 'react';
import './LoadingBar.css';

function LoadingBar({ isLoading }) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let interval;
		if (isLoading) {
			setProgress(0);
			interval = setInterval(() => {
				setProgress((prevProgress) =>
					prevProgress >= 100 ? 0 : prevProgress + 1,
				);
			}, 20);
		} else {
			setProgress(100);
			setTimeout(() => setProgress(0), 500);
		}

		return () => clearInterval(interval);
	}, [isLoading]);

	return (
		<div className="loading-bar-container">
			<div
				className="loading-bar"
				style={{
					width: `${progress}%`,
					opacity: isLoading ? 1 : 0,
				}}
			></div>
		</div>
	);
}

export default LoadingBar;

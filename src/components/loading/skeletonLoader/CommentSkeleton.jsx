import ContentLoader from 'react-content-loader';

const CommentSkeletonLoader = (props) => (
	<ContentLoader viewBox="0 0 250 237.5" height={237.5} width={250} {...props}>
		<circle cx="35.1" cy="36.6" r="20.65" />
		<rect x="64.95" y="14.75" width="62.75" height="8.5" />
		<rect x="64.95" y="32.35" width="148" height="8.5" />
		<rect x="64.95" y="48.9" width="126.75" height="8.5" />
		<rect x="64.95" y="66.15" width="106.25" height="8.5" />

		<circle cx="35.35" cy="121.75" r="20.65" />
		<rect x="65.2" y="100" width="62.75" height="8.5" />
		<rect x="65.2" y="117.5" width="148" height="8.5" />
		<rect x="65.2" y="134.1" width="126.75" height="8.5" />
		<rect x="65.2" y="151.3" width="106.25" height="8.5" />
	</ContentLoader>
);

export default CommentSkeletonLoader;

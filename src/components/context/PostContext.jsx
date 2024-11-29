import { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
	const [allPosts, setAllPosts] = useState([]);

	const addPost = (newPost) => {
		setAllPosts((prevPosts) => [newPost, ...prevPosts]);
		console.log('allPosts', allPosts);
	};

	return (
		<PostContext.Provider value={{ allPosts, setAllPosts, addPost }}>
			{children}
		</PostContext.Provider>
	);
};

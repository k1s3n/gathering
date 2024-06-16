import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const UserPosts = () => {
  const { posts, postCount, latestPost, fetchUserPosts } = useAuth();

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  if (!posts) {
    return <div>Loading posts...</div>;
  }

  return (
    <div>
      <h3>User Posts</h3>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.description}</p>
            <p>{new Date(post.date).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
      <p>Total Posts: {postCount}</p>
      {latestPost && (
        <div>
          <h4>Latest Post</h4>
          <p>{latestPost.title}</p>
          <p>{latestPost.description}</p>
          <p>{new Date(latestPost.date).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default UserPosts;

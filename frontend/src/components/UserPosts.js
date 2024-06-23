import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const UserPosts = () => {
  const { posts, postCount, latestPost, fetchUserPosts, userInfo } = useAuth();

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  if (!posts) {
    return <div>Loading posts...</div>;
  }

  return (
    <div style={{marginLeft: '20px'}}>
      <p style={{fontWeight: 'bold'}}>Total Posts: {postCount}</p>
      {latestPost && (
        <div>
          <h3> Latest Post</h3>
          <p>{latestPost.title}</p>
          <p>{latestPost.description}</p>
          <p>{new Date(latestPost.date).toLocaleDateString()}</p>
        </div>
      )}
      -----------
      <h3> All Posts</h3>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.location}</p>
            <p>{post.description}</p>
            <p>{new Date(post.date).toLocaleDateString()}</p>
            ---------------------
          </div>
        ))
      ) : (
        <p>You have not created any events go to create event</p>
      )}
    </div>
  );
};

export default UserPosts;

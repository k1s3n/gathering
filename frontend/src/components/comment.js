import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import API from '../api';

const Comment = ({ eventId }) => {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await API.get(`/comments/${eventId}`);
      const sortedComments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sortedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await API.post(`/comments`, { eventId, text: newComment }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setNewComment('');
        fetchComments();
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section">
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <p>{new Date(comment.createdAt).toLocaleDateString()} / {comment.user.username}: {comment.text}</p>
            </div>
          ))}
          <form onSubmit={handleCommentSubmit}>
            <input 
              type="text" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              placeholder="Write a comment..." 
              required 
            />
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Comment;

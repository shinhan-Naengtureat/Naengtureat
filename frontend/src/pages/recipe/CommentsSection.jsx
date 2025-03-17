// CommentsSection.jsx
import React from "react";
import { FaRegComment } from "react-icons/fa";

function CommentsSection({ 
  comments, 
  commentInput, 
  setCommentInput, 
  showSubmitButton, 
  setShowSubmitButton, 
  handleCommentSubmit 
}) {
  return (
    <div className="comment-section">
      <h2>레시피 댓글</h2>
      {comments && comments.length > 0 ? (
        comments.map((comment, idx) => (
          <div className="comment-box" key={comment.id || idx}>
            <div className="comment-header">
              <span className="comment-user">{comment.memberName}</span>
              <span className="comment-date">{/* 날짜 표시 추가 가능 */}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))
      ) : (
        <p>댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      )}

      <div className="comment-input-container">
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력해주세요."
          onFocus={() => setShowSubmitButton(true)}
          onBlur={() => {
            if (!commentInput.trim()) setShowSubmitButton(false);
          }}
        />
        {showSubmitButton && (
          <button className="comment-submit-button" onClick={handleCommentSubmit}>
            댓글등록
          </button>
        )}
      </div>
      <FaRegComment
        className="icon"
        title="댓글 보기"
        onClick={() => {
          const commentSection = document.querySelector(".comment-section");
          if (commentSection) {
            commentSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
    </div>
  );
}

export default CommentsSection;

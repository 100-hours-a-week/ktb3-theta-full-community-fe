import { useParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../contexts/useUser";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { usePageRouter } from "../hooks/usePageRouter";
import formatDate from "../utils/formatDate";
import { useFetchArticle, useDeleteArticle } from "../features/articles/hooks";
import { useFetchComments, useCreateComment, useUpdateComment, useDeleteComment } from "../features/comments/hooks";
import { useCreateLike, useDeleteLike, useFetchLike } from "../features/likes/hooks";
import Modal from "../components/common/Modal";
import PostCover from "../features/articles/components/PostCover";
import ActionMenu from "../components/common/ActionMenu";
import CommentForm from "../features/comments/components/CommentForm";
import CommentList from "../features/comments/components/CommentList";
import styles from "./ArticleDetail.module.css";

const icons = {
  heart: "/assets/images/heart.svg",
  heartFill: "/assets/images/heart-fill.svg",
  bookmark: "/assets/images/bookmark.svg",
  eye: "/assets/images/eye.svg",
};

function ArticleDetail() {
  const { articleId } = useParams();
  const { user } = useUser();
  const { goToArticleEdit, goToHome } = usePageRouter();

  const { data: articleData, isPending: isArticlePending } = useFetchArticle(articleId);
  const { data: likeData } = useFetchLike(articleId);

  const { mutate: deleteArticle } = useDeleteArticle();

  const { mutate: createComment } = useCreateComment(articleId);
  const { mutate: updateComment } = useUpdateComment(articleId);
  const { mutate: deleteComment } = useDeleteComment(articleId);

  const { mutate: createLike } = useCreateLike();
  const { mutate: deleteLike } = useDeleteLike();

  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const [commentDeleteId, setCommentDeleteId] = useState(null);
  const [isCommentDeleteOpen, setCommentDeleteOpen] = useState(false);

  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  const {
    data: commentsData,
    isPending: isCommentsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchComments(articleId);
  const commentItems =
    commentsData?.pages?.flatMap((page) => (page?.result?.comments ? page.result.comments : [])) ?? [];
  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 1.0 }
  );

  const handleDeleteArticle = () => setDeleteOpen(true);
  const handleConfirmDeleteArticle = () =>
    deleteArticle(articleId, {
      onSuccess: () => {
        setDeleteOpen(false);
        goToHome();
      },
      onSettled: () => setDeleteOpen(false),
    });
  const handleCancelDeleteArticle = () => setDeleteOpen(false);

  const handleEditComment = (comment) => {
    setEditingComment({ comment_id: comment.comment_id, content: comment.content });
    setCommentContent(comment.content ?? "");
  };

  const handleDeleteComment = (comment) => {
    setCommentDeleteId(comment.comment_id);
    setCommentDeleteOpen(true);
  };

  const handleConfirmDeleteComment = () =>
    deleteComment(commentDeleteId, {
      onSettled: () => {
        setCommentDeleteId(null);
        setCommentDeleteOpen(false);
      },
    });

  const handleCancelDeleteComment = () => {
    setCommentDeleteId(null);
    setCommentDeleteOpen(false);
  };

  const handleSubmitComment = ({ content }) => {
    if (editingComment) {
      updateComment(
        { commentId: editingComment.comment_id, payload: { content } },
        {
          onSuccess: () => {
            setEditingComment(null);
            setCommentContent("");
          },
        }
      );
    } else {
      createComment(
        { content },
        {
          onSuccess: () => setCommentContent(""),
        }
      );
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setCommentContent("");
  };

  const canEditArticle =
    user?.user_id &&
    articleData?.result?.writtenBy?.user_id &&
    String(user?.user_id) === String(articleData?.result?.writtenBy?.user_id);

  const handleToggleLike = () => {
    if (!articleId) return;
    if (likeData?.result?.is_liked ?? false) {
      deleteLike(articleId);
    } else {
      createLike(articleId);
    }
  };

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        {isArticlePending ? (
          <div> Loading... </div>
        ) : (
          <>
            <header>
              <h1 className={styles.title}>{articleData?.result?.title}</h1>
              <div className={styles.meta}>
                <div className={styles.metaDetails}>
                  <div className={styles.author}>
                    <span className={styles.avatar}>
                      {articleData?.result?.writtenBy?.profile_image ? (
                        <img src={articleData?.result?.writtenBy?.profile_image} />
                      ) : null}
                    </span>
                    <span className={styles.name}>{articleData?.result?.writtenBy?.nickname}</span>
                  </div>
                  <time className={styles.time}>{formatDate(articleData?.result?.createdAt)}</time>
                  <div className={styles.viewCount}>
                    <img src={icons.eye} />
                    <span>{articleData?.result?.viewCount}</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button className={styles.statButton} onClick={handleToggleLike}>
                    <img src={likeData?.result?.is_liked ?? false ? icons.heartFill : icons.heart} />
                    <span>{likeData?.result?.like_count ?? articleData?.result?.likeCount}</span>
                  </button>
                  <button className={styles.statButton}>
                    <img src={icons.bookmark} />
                  </button>
                  {canEditArticle && (
                    <ActionMenu
                      items={[
                        { label: "수정", click: () => goToArticleEdit(articleId) },
                        { label: "삭제", click: handleDeleteArticle },
                      ]}
                    />
                  )}
                </div>
              </div>
            </header>

            <hr className={styles.divider} />

            <PostCover src={articleData?.result?.article_image} />

            <article className={styles.body}>
              <p>{articleData?.result?.content}</p>
            </article>

            <hr className={styles.divider} />

            <CommentForm
              commentCount={articleData?.result?.commentCount || 0}
              value={commentContent}
              isEditing={!!editingComment}
              onChange={setCommentContent}
              onSubmit={handleSubmitComment}
              onCancel={handleCancelEditComment}
            />

            {isCommentsPending ? (
              <div> Loading... </div>
            ) : (
              <>
                <CommentList
                  items={commentItems}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  canModify={(comment) => {
                    return (
                      user?.user_id &&
                      comment?.writtenBy?.user_id &&
                      String(user?.user_id) === String(comment?.writtenBy?.user_id)
                    );
                  }}
                  lastItemRef={hasNextPage ? loadMoreRef : undefined}
                />
                {isFetchingNextPage && <div>Loading...</div>}
              </>
            )}
          </>
        )}
      </main>
      {isDeleteOpen && (
        <Modal
          title="게시글을 삭제하시겠습니까?"
          message="삭제 후 복구할 수 없습니다."
          onConfirm={handleConfirmDeleteArticle}
          onCancel={handleCancelDeleteArticle}
        />
      )}
      {isCommentDeleteOpen && (
        <Modal
          title="댓글을 삭제하시겠습니까?"
          message="삭제 후 복구할 수 없습니다."
          onConfirm={handleConfirmDeleteComment}
          onCancel={handleCancelDeleteComment}
        />
      )}
    </div>
  );
}

export default ArticleDetail;

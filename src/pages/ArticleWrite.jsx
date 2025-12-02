import ArticleForm from "../features/articles/components/ArticleForm";
import { useCreateArticle } from "../features/articles/hooks";
import { usePageRouter } from "../hooks/usePageRouter";

function ArticleWrite() {
  const { mutate: createArticle } = useCreateArticle();
  const { goToArticleDetail, goBack } = usePageRouter();

  const handleSubmit = ({ payload, imageFile }) => {
    createArticle(
      { payload, imageFile },
      {
        onSuccess: (data) => {
          const newId = data?.result?.article_id || data?.result?.articleId || data?.article_id || data?.articleId;
          if (newId) {
            goToArticleDetail(newId);
          }
        },
      }
    );
  };

  return (
    <ArticleForm
      mode="create"
      submitLabel="작성"
      cancelLabel="취소"
      onSubmit={handleSubmit}
      onCancel={goBack}
    />
  );
}

export default ArticleWrite;

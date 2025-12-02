import { useParams } from "react-router-dom";
import ArticleForm from "../features/articles/components/ArticleForm";
import { useFetchArticle, useUpdateArticle } from "../features/articles/hooks";
import { usePageRouter } from "../hooks/usePageRouter";

function ArticleEdit() {
  const { articleId } = useParams();
  const { goToArticleDetail, goBack } = usePageRouter();
  const { data: articleData, isPending } = useFetchArticle(articleId);
  const { mutate: updateArticle } = useUpdateArticle();

  if (isPending) return <div>Loading...</div>;

  const initialValues = {
    theme: articleData?.result?.theme ?? "",
    title: articleData?.result?.title ?? "",
    content: articleData?.result?.content ?? "",
    imageSrc: articleData?.result?.article_image ?? "",
  };

  const handleSubmit = ({ payload, imageFile }) => {
    updateArticle(
      { articleId, payload, imageFile },
      {
        onSuccess: () => {
          goToArticleDetail(articleId);
        },
      }
    );
  };

  return (
    <ArticleForm
      mode="edit"
      submitLabel="수정"
      cancelLabel="취소"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={goBack}
    />
  );
}

export default ArticleEdit;

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment, updateComment, deleteComment } from "../../api/comments";
import { showToast } from "../../lib/toast";

export function useFetchComments(articleId) {
  return useInfiniteQuery({
    queryKey: ["comments", articleId],
    queryFn: ({ pageParam = 1 }) => fetchComments(articleId, { page: pageParam, size: 7 }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.currentPage + 1 : undefined;
    },
    enabled: !!articleId,
    initialPageParam: 1,
  });
}

export function useCreateComment(articleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createComment(articleId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["comments", articleId] });
      await queryClient.cancelQueries({ queryKey: ["article", articleId] });

      const prevComments = queryClient.getQueryData(["comments", articleId]);
      const prevArticle = queryClient.getQueryData(["article", articleId]);

      const optimisticComment = {
        comment_id: `temp-${Date.now()}`,
        content: payload?.content ?? "",
        writtenBy: { nickname: "작성 중" },
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(["comments", articleId], (old) => {
        if (!old?.pages?.length) {
          return {
            pages: [
              {
                result: { comments: [optimisticComment] },
              },
            ],
            pageParams: [1],
          };
        }
        const [firstPage, ...restPages] = old.pages;
        const nextFirstPage = {
          ...firstPage,
          result: {
            ...(firstPage?.result || {}),
            comments: [optimisticComment, ...(firstPage?.result?.comments || [])],
          },
        };
        return { ...old, pages: [nextFirstPage, ...restPages] };
      });

      queryClient.setQueryData(["article", articleId], (old) => {
        if (!old) return old;
        const currentCount =
          old?.result?.commentCount ?? old?.result?.comment_count ?? old?.commentCount ?? old?.comment_count ?? 0;
        const nextCount = currentCount + 1;
        return {
          ...old,
          result: { ...(old?.result || {}), commentCount: nextCount, comment_count: nextCount },
          commentCount: nextCount,
          comment_count: nextCount,
        };
      });

      return { prevComments, prevArticle };
    },
    onError: (_error, _payload, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", articleId], context.prevComments);
      }
      if (context?.prevArticle) {
        queryClient.setQueryData(["article", articleId], context.prevArticle);
      }
      showToast("댓글 등록에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
    },
    onSuccess: () => {
      showToast("댓글이 등록되었습니다.", { type: "info" });
    },
  });
}

export function useUpdateComment(articleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, payload }) => updateComment(articleId, commentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      queryClient.invalidateQueries({ queryKey: ["comment", variables.commentId] });
      showToast("댓글이 수정되었습니다.", { type: "info" });
    },
    onError: () => {
      showToast("댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
  });
}

export function useDeleteComment(articleId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteComment(articleId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["comments", articleId] });
      await queryClient.cancelQueries({ queryKey: ["article", articleId] });

      const prevComments = queryClient.getQueryData(["comments", articleId]);
      const prevArticle = queryClient.getQueryData(["article", articleId]);

      // optimistic comments removal
      queryClient.setQueryData(["comments", articleId], (old) => {
        if (!old?.pages) return old;
        const pages = old.pages.map((page) => {
          if (!page?.result?.comments) return page;
          return {
            ...page,
            result: {
              ...page.result,
              comments: page.result.comments.filter((c) => c.comment_id !== commentId),
            },
          };
        });
        return { ...old, pages };
      });

      // optimistic comment count decrement
      queryClient.setQueryData(["article", articleId], (old) => {
        if (!old) return old;
        const currentCount =
          old?.result?.commentCount ?? old?.result?.comment_count ?? old?.commentCount ?? old?.comment_count ?? 0;
        const nextCount = Math.max(0, currentCount - 1);
        return {
          ...old,
          result: { ...(old?.result || {}), commentCount: nextCount, comment_count: nextCount },
          commentCount: nextCount,
          comment_count: nextCount,
        };
      });

      return { prevComments, prevArticle };
    },
    onError: (_error, commentId, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", articleId], context.prevComments);
      }
      if (context?.prevArticle) {
        queryClient.setQueryData(["article", articleId], context.prevArticle);
      }
      showToast("댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
    onSettled: (_data, _error, commentId) => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
    },
    onSuccess: () => {
      showToast("댓글 삭제 완료", { type: "info" });
    },
  });
}

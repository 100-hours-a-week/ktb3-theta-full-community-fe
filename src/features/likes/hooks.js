import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLike, createLike, deleteLike } from "../../api/likes";
import { showToast } from "../../lib/toast";

export function useFetchLike(articleId) {
  return useQuery({
    queryKey: ["like", articleId],
    queryFn: () => fetchLike(articleId),
    enabled: !!articleId,
    onError: () => {
      showToast("좋아요 수 조회를 실패하였습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
    },
  });
}

export function useCreateLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId) => createLike(articleId),
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey: ["like", articleId] });
      const prevLike = queryClient.getQueryData(["like", articleId]);
      queryClient.setQueryData(["like", articleId], (old) => {
        return {
          ...(old || {}),
          result: {
            ...(old?.result || {}),
            is_liked: !old?.result?.is_liked,
            like_count: Math.max(0, old?.result?.like_count + 1),
          },
        };
      });
      return { prevLike };
    },
    onError: (_error, articleId, context) => {
      if (context?.prevLike) {
        queryClient.setQueryData(["like", articleId], context.prevLike);
      }
    },
    onSettled: (_data, _error, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["like", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useDeleteLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId) => deleteLike(articleId),
    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey: ["like", articleId] });
      const prevLike = queryClient.getQueryData(["like", articleId]);
      queryClient.setQueryData(["like", articleId], (old) => {
        return {
          ...(old || {}),
          result: {
            ...(old?.result || {}),
            is_liked: !old?.result?.is_liked,
            like_count: Math.max(0, old?.result?.like_count - 1),
          },
        };
      });
      return { prevLike };
    },
    onError: (_error, articleId, context) => {
      if (context?.prevLike) {
        queryClient.setQueryData(["like", articleId], context.prevLike);
      }
    },
    onSettled: (_data, _error, articleId) => {
      queryClient.invalidateQueries({ queryKey: ["like", articleId] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

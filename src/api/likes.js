import { client } from "./client";

// GET /articles/{articleId}/likes
export async function fetchLike(articleId) {
  const response = await client.get(`/articles/${articleId}/likes`);
  return response.data;
}

// POST /articles/{articleId}/likes
export async function createLike(articleId) {
  const response = await client.post(`/articles/${articleId}/likes`);
  return response.data;
}

// DELETE /articles/{articleId}/likes
export async function deleteLike(articleId) {
  const response = await client.delete(`/articles/${articleId}/likes`);
  return response.data;
}

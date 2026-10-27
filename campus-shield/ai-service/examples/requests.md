# Example requests (outputs depend on the model weights in use)

```bash
curl localhost:8000/health

curl -F image=@found.jpg localhost:8000/extract-features

# One query image vs several candidate images
curl -F query_image=@found.jpg -F candidate_images=@lost_a.jpg -F candidate_images=@lost_b.jpg \
     localhost:8000/compare

# Match against stored embeddings (what the Node backend calls)
curl -X POST localhost:8000/match -H 'Content-Type: application/json' -d '{
  "query_item_id": "found_101",
  "query_embedding": [0.1, 0.2, 0.3],
  "query_model_version": "resnet50-imagenet-v1",
  "candidates": [
    {"lost_item_id": "lost_205", "embedding": [0.1, 0.25, 0.3], "model_version": "resnet50-imagenet-v1"}
  ],
  "top_k": 5
}'
```
The 3-number embeddings only illustrate the shape; real embeddings have 2048 values.

## Node.js (Express backend) sketch, Node 18+

```js
// 1) embedding for an uploaded image buffer
const form = new FormData();
form.append("image", new Blob([buffer], { type: mime }), "item.jpg");
const { embedding, model_version } =
  await (await fetch(`${AI_URL}/extract-features`, { method: "POST", body: form })).json();

// 2) found item: load active lost items from MongoDB, then
const result = await (await fetch(`${AI_URL}/match`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query_item_id: String(foundId), query_embedding: embedding, query_model_version: model_version,
    candidates: lost.map(l => ({ lost_item_id: String(l._id), embedding: l.embedding,
                                 model_version: l.embeddingModelVersion })),
    top_k: 5, threshold: CONFIGURED_THRESHOLD,   // chosen from evaluation
  }),
})).json();

// 3) join result.matches with item records, save match documents, enforce authorization.
```

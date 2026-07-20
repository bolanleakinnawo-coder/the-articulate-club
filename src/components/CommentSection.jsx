import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function CommentSection() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [comments, setComments] = useState([]);

  const handlePost = () => {
    if (!name.trim() || !comment.trim()) return;

    if (editingId) {
      setComments((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, name, comment } : item,
        ),
      );

      setEditingId(null);
    } else {
      setComments([
        {
          id: Date.now(),
          name,
          comment,
        },
        ...comments,
      ]);
    }

    setName("");
    setComment("");
  };

  const handleDelete = (id) => {
    setComments(comments.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setName(item.name);
    setComment(item.comment);
    setEditingId(item.id);
  };

  return (
    <section className="comment-section">
      <div className="comment-container">
        <p className="comment-eyebrow">JOIN THE CONVERSATION</p>

        <h2>Leave an Encouraging Word</h2>

        <div className="comment-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="comment-row">
            <input
              type="text"
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button onClick={handlePost}>{editingId ? "Save" : "Post"}</button>
          </div>
        </div>

        <div className="comments">
          {comments.map((item) => (
            <div className="comment-item" key={item.id}>
              <div className="avatar">{item.name.charAt(0).toUpperCase()}</div>

              <div className="comment-body">
                <div className="comment-top">
                  <h4>{item.name}</h4>

                  <div className="comment-icons">
                    <button onClick={() => handleEdit(item)}>
                      <Pencil size={16} />
                    </button>

                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p>{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

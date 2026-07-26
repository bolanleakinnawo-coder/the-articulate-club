import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, update, remove } from "firebase/database";

export default function Admin() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const storiesRef = ref(db, "communityWall");

    return onValue(storiesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setStories([]);
        return;
      }

      const list = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setStories(list);
    });
  }, []);

  const pendingStories = stories.filter((story) => !story.approved);
  const approvedStories = stories.filter((story) => story.approved);

  const approveStory = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this story?\n\nIt will immediately appear on the Community Wall.",
    );

    if (!confirmApprove) return;

    await update(ref(db, `communityWall/${id}`), {
      approved: true,
    });

    alert("Story approved successfully.");
  };

  const hideStory = async (id) => {
    const confirmHide = window.confirm(
      "Hide this story from the Community Wall?\n\nYou can approve it again later.",
    );

    if (!confirmHide) return;

    await update(ref(db, `communityWall/${id}`), {
      approved: false,
    });

    alert("Story hidden.");
  };

  const deleteStory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this story?\n\nThis action cannot be undone.",
    );

    if (!confirmDelete) return;

    await remove(ref(db, `communityWall/${id}`));

    alert("Story deleted.");
  };

  return (
    <section className="admin-page">
      <div className="admin-container">
        <h1>Community Wall Dashboard</h1>

        {/* Pending */}

        <div className="admin-section">
          <h2>Pending ({pendingStories.length})</h2>

          {pendingStories.length === 0 ? (
            <p className="admin-empty">No pending submissions.</p>
          ) : (
            pendingStories.map((story) => (
              <div className="admin-card" key={story.id}>
                <div className="admin-avatar">
                  {story.name.charAt(0).toUpperCase()}
                </div>

                <div className="admin-content">
                  <h3>{story.name}</h3>

                  <p>{story.story}</p>

                  <div className="admin-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => approveStory(story.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteStory(story.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Approved */}

        <div className="admin-section">
          <h2>Approved ({approvedStories.length})</h2>

          {approvedStories.length === 0 ? (
            <p className="admin-empty">No approved stories.</p>
          ) : (
            approvedStories.map((story) => (
              <div className="admin-card" key={story.id}>
                <div className="admin-avatar">
                  {story.name.charAt(0).toUpperCase()}
                </div>

                <div className="admin-content">
                  <h3>{story.name}</h3>

                  <p>{story.story}</p>

                  <div className="admin-buttons">
                    <button
                      className="hide-btn"
                      onClick={() => hideStory(story.id)}
                    >
                      Hide
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteStory(story.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

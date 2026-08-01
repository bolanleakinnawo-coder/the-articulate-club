import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, update, remove } from "firebase/database";

export default function Admin() {
  const [stories, setStories] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [activeTab, setActiveTab] = useState("testimonials");
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

  useEffect(() => {
    const waitlistRef = ref(db, "waitlist");

    return onValue(waitlistRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setWaitlist([]);
        return;
      }

      const list = Object.entries(data)
        .map(([id, value]) => ({
          id,
          ...value,
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      setWaitlist(list);
    });
  }, []);

  const deleteWaitlist = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this waitlist member?\n\nThis action cannot be undone.",
    );

    if (!confirmDelete) return;

    await remove(ref(db, `waitlist/${id}`));

    alert("Waitlist member deleted.");
  };

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
        <div className="admin-tabs">
          <button
            className={
              activeTab === "testimonials" ? "tab-btn active" : "tab-btn"
            }
            onClick={() => setActiveTab("testimonials")}
          >
            Testimonials ({stories.length})
          </button>

          <button
            className={activeTab === "waitlist" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("waitlist")}
          >
            Waitlist ({waitlist.length})
          </button>
        </div>

        {activeTab === "testimonials" && (
          <>
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
          </>
        )}
      </div>

      {activeTab === "waitlist" && (
        <div className="admin-section">
          <h2>Academy Waitlist ({waitlist.length})</h2>

          {waitlist.length === 0 ? (
            <p className="admin-empty">No one has joined the waitlist yet.</p>
          ) : (
            waitlist.map((person) => (
              <div className="admin-card" key={person.id}>
                <div className="admin-avatar">
                  {person.name.charAt(0).toUpperCase()}
                </div>

                <div className="admin-content">
                  <h3>{person.name}</h3>

                  <p>
                    <strong>Email:</strong> {person.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {person.phone}
                  </p>

                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(person.createdAt).toLocaleString()}
                  </p>

                  <div className="admin-buttons">
                    <button
                      className="delete-btn"
                      onClick={() => deleteWaitlist(person.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

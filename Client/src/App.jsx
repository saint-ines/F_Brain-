import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  // Exemple de posts statiques avec commentaires et likes en local state
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alice Dupont",
      content: "Salut tout le monde, bienvenue sur F_BRAIN !",
      likes: 3,
      comments: [
        { id: 1, author: "Bob", text: "Super post !" },
        { id: 2, author: "Clara", text: "Bienvenue Alice !" },
      ],
    },
    {
      id: 2,
      author: "Bob Martin",
      content: "Quelqu’un a essayé le nouveau tutoriel React ?",
      likes: 1,
      comments: [],
    },
  ]);

  const [commentInputs, setCommentInputs] = useState({});

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: Date.now(), author: user.name, text },
              ],
            }
          : post
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  if (isLoading) return <div style={styles.loading}>Chargement...</div>;

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <h1 style={styles.logo}>F_BRAIN</h1>
        <button style={styles.loginButton} onClick={() => loginWithRedirect()}>
          Se connecter
        </button>
        <button
          style={{ ...styles.loginButton, backgroundColor: "#28a745" }}
          onClick={() => loginWithRedirect({ screen_hint: "signup" })}
        >
          Créer un utilisateur
        </button>
      </div>
    );
  }

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logo}>F_BRAIN</div>
        <div style={styles.profileInfo}>
          <span style={{ marginRight: 10 }}>Bonjour, {user.name}</span>
          <button
            style={styles.logoutButton}
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {posts.map((post) => (
          <div key={post.id} style={styles.post}>
            <strong>{post.author}</strong>
            <p>{post.content}</p>
            <div style={styles.postActions}>
              <button
                style={styles.likeButton}
                onClick={() => handleLike(post.id)}
              >
                👍 {post.likes}
              </button>
            </div>
            <div style={styles.commentsSection}>
              <h4>Commentaires</h4>
              {post.comments.length === 0 && <p>Aucun commentaire</p>}
              {post.comments.map((c) => (
                <p key={c.id}>
                  <strong>{c.author}</strong>: {c.text}
                </p>
              ))}
              <input
                type="text"
                placeholder="Ajouter un commentaire"
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                style={styles.commentInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment(post.id);
                }}
              />
              <button
                style={styles.addCommentButton}
                onClick={() => handleAddComment(post.id)}
              >
                Envoyer
              </button>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

const styles = {
  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    fontFamily: "'Open Sans', sans-serif",
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 320,
    margin: "80px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 12,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    alignItems: "center",
    fontFamily: "'Open Sans', sans-serif",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#28a745",
    fontFamily: "'Open Sans', sans-serif",
    marginBottom: 24,
  },
  loginButton: {
    padding: "10px 25px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    marginBottom: 12,
    width: "100%",
    maxWidth: 200,
    transition: "background-color 0.3s ease",
  },
  header: {
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    borderBottom: "1px solid #ddd",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "'Open Sans', sans-serif",
    zIndex: 10,
  },
  profileInfo: {
    display: "flex",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  main: {
    maxWidth: 600,
    margin: "20px auto",
    fontFamily: "'Open Sans', sans-serif",
  },
  post: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 24,
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  postActions: {
    marginTop: 8,
  },
  likeButton: {
    cursor: "pointer",
    backgroundColor: "#e7f3ff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    fontSize: 14,
  },
  commentsSection: {
    marginTop: 15,
    borderTop: "1px solid #eee",
    paddingTop: 10,
  },
  commentInput: {
    width: "calc(100% - 90px)",
    padding: "6px 8px",
    marginRight: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  addCommentButton: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};

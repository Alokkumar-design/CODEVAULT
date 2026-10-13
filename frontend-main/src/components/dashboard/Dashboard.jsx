import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Star state map: { [repoId]: { starred: boolean, count: number } }
  const [stars, setStars] = useState({});

  // New Repository Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState("");

  const languageColors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    React: "#61dafb",
    Go: "#00ADD8",
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "mock-user";

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`
        );
        const data = await response.json();
        const repos = data.repositories || [];
        setRepositories(repos);

        // Initialize star counts
        const initialStars = {};
        repos.forEach((r, idx) => {
          initialStars[r._id] = {
            starred: idx === 0,
            count: (idx + 1) * 7,
            lang: idx === 1 ? "Python" : idx === 2 ? "TypeScript" : "JavaScript",
          };
        });
        setStars(initialStars);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  // Toggle Star
  const handleToggleStar = (repoId) => {
    setStars((prev) => {
      const current = prev[repoId] || { starred: false, count: 0 };
      const nextStarred = !current.starred;
      return {
        ...prev,
        [repoId]: {
          ...current,
          starred: nextStarred,
          count: nextStarred ? current.count + 1 : Math.max(0, current.count - 1),
        },
      };
    });
  };

  // Handle Create Repository
  const handleCreateRepo = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:3002/repo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          visibility: true,
        }),
      });

      const data = await response.json();
      if (data.repository) {
        setRepositories([data.repository, ...repositories]);
        setStars((prev) => ({
          ...prev,
          [data.repository._id]: {
            starred: false,
            count: 0,
            lang: language,
          },
        }));
      }
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating repository:", err);
      alert("Failed to create repository");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Repository
  const handleDeleteRepo = async (repoId) => {
    if (!window.confirm("Are you sure you want to delete this repository?")) {
      return;
    }

    try {
      await fetch(`http://localhost:3002/repo/delete/${repoId}`, {
        method: "DELETE",
      });
      setRepositories(repositories.filter((repo) => repo._id !== repoId));
    } catch (err) {
      console.error("Error deleting repository:", err);
    }
  };

  const copyToClipboard = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(""), 2000);
  };

  return (
    <>
      <Navbar />
      <section id="dashboard">
        {/* Left Sidebar */}
        <aside>
          {/* User Bio Card */}
          <div className="user-card">
            <div className="user-card-avatar">👨‍💻</div>
            <h3 className="user-card-name">Alok Kumar</h3>
            <div className="user-card-handle">@alokkumar</div>
            <div className="user-card-badge">PRO DEVELOPER</div>
            <div className="user-card-stats">
              <div className="stat-item">
                <div className="num">{repositories.length}</div>
                <div className="label">Repos</div>
              </div>
              <div className="stat-item">
                <div className="num">42</div>
                <div className="label">Followers</div>
              </div>
              <div className="stat-item">
                <div className="num">19</div>
                <div className="label">Following</div>
              </div>
            </div>
          </div>

          {/* Suggested Repositories */}
          <div className="dashboard-sidebar">
            <h3>Explore Repositories</h3>
            {suggestedRepositories.map((repo) => (
              <div className="sidebar-repo-item" key={repo._id}>
                <div className="name">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
                  </svg>
                  {repo.name}
                </div>
                <div className="desc">{repo.description || "Open source project."}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main Repositories Feed */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <div className="dashboard-header-title">
              <h2>Repositories</h2>
              <span className="count-pill">{searchResults.length}</span>
            </div>
            <button
              className="btn-new-repo"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM7.75 3.5a.75.75 0 0 0-1.5 0v1.75H4.5a.75.75 0 0 0 0 1.5h1.75v1.75a.75.75 0 0 0 1.5 0V6.75h1.75a.75.75 0 0 0 0-1.5H7.75Z"></path>
              </svg>
              New
            </button>
          </div>

          {/* Interactive Create Form */}
          {showCreateForm && (
            <form className="create-repo-form" onSubmit={handleCreateRepo}>
              <h3>
                <span>Create a new repository</span>
              </h3>
              <div className="form-group">
                <label>Repository name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. awesome-portfolio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What is this repository for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Primary Language</label>
                <select
                  className="form-input"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="Go">Go</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-new-repo"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create repository"}
                </button>
              </div>
            </form>
          )}

          {/* Search Bar */}
          <div className="search-filter-row">
            <div className="search-box-wrapper">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Repository Cards */}
          {searchResults.length > 0 ? (
            searchResults.map((repo) => {
              const repoMeta = stars[repo._id] || {
                starred: false,
                count: 5,
                lang: "JavaScript",
              };
              const dotColor = languageColors[repoMeta.lang] || "#f1e05a";

              return (
                <div className="repo-card" key={repo._id}>
                  <div className="repo-info">
                    <div className="repo-header-line">
                      <a href="#repo" className="repo-name-link">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
                        </svg>
                        {repo.name}
                      </a>
                      <span className="visibility-tag">
                        {repo.visibility !== false ? "Public" : "Private"}
                      </span>
                    </div>

                    <p className="repo-desc">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="repo-metadata">
                      <span className="lang-tag">
                        <span
                          className="lang-dot"
                          style={{ backgroundColor: dotColor }}
                        ></span>
                        {repoMeta.lang || "JavaScript"}
                      </span>

                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-.878-4.435.75.75 0 0 0-.622.74v.073a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V1.687a.75.75 0 0 0-.622-.74A2.25 2.25 0 1 0 5 5.372Z"></path>
                        </svg>
                        {repoMeta.count}
                      </span>

                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>

                  <div className="repo-actions-right">
                    <button
                      className={`btn-star ${repoMeta.starred ? "starred" : ""}`}
                      onClick={() => handleToggleStar(repo._id)}
                      title="Star this repository"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill={repoMeta.starred ? "#e3b341" : "currentColor"}>
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                      </svg>
                      {repoMeta.starred ? "Starred" : "Star"}
                    </button>

                    <button
                      className="btn-delete-repo"
                      title="Delete repository"
                      onClick={() => handleDeleteRepo(repo._id)}
                    >
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a2.25 2.25 0 0 0 2.24 2.025h1.208a2.25 2.25 0 0 0 2.24-2.025l.66-6.6a.75.75 0 0 0-1.492-.15l-.66 6.6a.75.75 0 0 1-.748.675H7.396a.75.75 0 0 1-.748-.675l-.66-6.6a.75.75 0 0 0-1.492.15Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#8b949e", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>
              No repositories found matching "{searchQuery}".
            </p>
          )}
        </main>

        {/* Right Sidebar - CLI Cheat Sheet */}
        <aside className="cli-card">
          <h3>
            <span>Git CLI Cheat Sheet</span>
          </h3>
          <p style={{ fontSize: "12px", color: "#8b949e", margin: "0 0 14px 0" }}>
            Commands to run in your local project folder:
          </p>

          <div
            className="cli-command-item"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard("node index.js init")}
            title="Click to copy"
          >
            <div>
              <code>node index.js init</code>
              <div className="desc">Initialize .apnaGit</div>
            </div>
            <span>{copiedCmd === "node index.js init" ? "✅" : "📋"}</span>
          </div>

          <div
            className="cli-command-item"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard("node index.js add file.txt")}
            title="Click to copy"
          >
            <div>
              <code>node index.js add &lt;file&gt;</code>
              <div className="desc">Stage file for commit</div>
            </div>
            <span>{copiedCmd === "node index.js add file.txt" ? "✅" : "📋"}</span>
          </div>

          <div
            className="cli-command-item"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard('node index.js commit "My update"')}
            title="Click to copy"
          >
            <div>
              <code>node index.js commit &lt;msg&gt;</code>
              <div className="desc">Save snapshot with UUID</div>
            </div>
            <span>{copiedCmd === 'node index.js commit "My update"' ? "✅" : "📋"}</span>
          </div>

          <div
            className="cli-command-item"
            style={{ cursor: "pointer" }}
            onClick={() => copyToClipboard("node index.js revert <commitID>")}
            title="Click to copy"
          >
            <div>
              <code>node index.js revert &lt;id&gt;</code>
              <div className="desc">Time travel to past files</div>
            </div>
            <span>{copiedCmd === "node index.js revert <commitID>" ? "✅" : "📋"}</span>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;

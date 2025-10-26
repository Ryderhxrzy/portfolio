import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/GitHubStats.css';

const GitHubStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = "Ryderhxrzy"; // Your GitHub username

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching GitHub data for:', username);
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error('GitHub user not found');
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const reposData = await reposResponse.json();

        // Calculate stats from repositories
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);
        
        // Get top languages
        const languageStats = {};
        reposData.forEach(repo => {
          if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
          }
        });

        const topLanguages = Object.entries(languageStats)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([lang]) => lang);

        // Fetch recent activity
        let recentActivity = [];
        try {
          const activityResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=5`);
          if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            recentActivity = activityData.map(event => {
              switch (event.type) {
                case 'PushEvent':
                  return `Pushed ${event.payload.commits?.length || 0} commits to ${event.repo.name.replace(`${username}/`, '')}`;
                case 'CreateEvent':
                  return `Created ${event.payload.ref_type} in ${event.repo.name.replace(`${username}/`, '')}`;
                case 'WatchEvent':
                  return `Starred ${event.repo.name.replace(`${username}/`, '')}`;
                case 'ForkEvent':
                  return `Forked ${event.repo.name.replace(`${username}/`, '')}`;
                case 'IssuesEvent':
                  return `${event.payload.action} issue in ${event.repo.name.replace(`${username}/`, '')}`;
                default:
                  return `Activity in ${event.repo.name.replace(`${username}/`, '')}`;
              }
            });
          }
        } catch (activityError) {
          console.log('Activity fetch failed, using fallback');
          recentActivity = ['Fetching recent activity...'];
        }

        // Calculate achievements based on GitHub data
        const achievements = calculateAchievements(userData, reposData, totalStars, totalForks);

        // Prepare final stats
        const statsData = {
          userData: userData,
          repositories: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          stars: totalStars,
          forks: totalForks,
          contributions: Math.round(userData.public_repos * 20 + totalStars * 3), // Estimated
          languages: topLanguages.length > 0 ? topLanguages : ['JavaScript', 'HTML', 'CSS'],
          recentActivity: recentActivity.length > 0 ? recentActivity : ['No recent activity'],
          joinedDate: new Date(userData.created_at).getFullYear(),
          achievements: achievements
        };

        console.log('Final stats:', statsData);
        setStats(statsData);
        setError(null);

      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(`Failed to load GitHub statistics: ${err.message}. Please check if the username is correct.`);
        
        // Fallback to mock data with achievements
        setStats({
          userData: {
            avatar_url: `https://github.com/${username}.png`,
            html_url: `https://github.com/${username}`,
            name: username,
            bio: 'GitHub user'
          },
          repositories: 0,
          followers: 0,
          following: 0,
          stars: 0,
          forks: 0,
          contributions: 0,
          languages: ['JavaScript', 'HTML', 'CSS'],
          recentActivity: ['No activity data available'],
          joinedDate: new Date().getFullYear(),
          achievements: getDefaultAchievements()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  // Function to calculate achievements based on GitHub data
  const calculateAchievements = (userData, reposData, totalStars, totalForks) => {
    const accountAge = new Date().getFullYear() - new Date(userData.created_at).getFullYear();
    const hasPinnedRepos = reposData.some(repo => repo.topics && repo.topics.length > 0);
    const hasReadme = reposData.some(repo => repo.has_wiki || repo.description);
    const hasMultipleLanguages = new Set(reposData.map(repo => repo.language).filter(Boolean)).size > 3;

    return [
      {
        id: 1,
        name: "Open Source Contributor",
        description: "Has public repositories",
        icon: "fas fa-code-branch",
        unlocked: userData.public_repos > 0,
        progress: userData.public_repos,
        target: 1,
        category: "repositories"
      },
      {
        id: 2,
        name: "Star Collector",
        description: "Received stars on repositories",
        icon: "fas fa-star",
        unlocked: totalStars > 0,
        progress: totalStars,
        target: 1,
        category: "stars"
      },
      {
        id: 3,
        name: "Community Builder",
        description: "Gained followers on GitHub",
        icon: "fas fa-users",
        unlocked: userData.followers > 0,
        progress: userData.followers,
        target: 1,
        category: "social"
      },
      {
        id: 4,
        name: "Fork Master",
        description: "Repositories forked by others",
        icon: "fas fa-share-alt",
        unlocked: totalForks > 0,
        progress: totalForks,
        target: 1,
        category: "collaboration"
      },
      {
        id: 5,
        name: "GitHub Veteran",
        description: "Active on GitHub for a while",
        icon: "fas fa-calendar-alt",
        unlocked: accountAge >= 1,
        progress: accountAge,
        target: 1,
        category: "commitment"
      },
      {
        id: 6,
        name: "Polyglot Programmer",
        description: "Uses multiple programming languages",
        icon: "fas fa-language",
        unlocked: hasMultipleLanguages,
        progress: hasMultipleLanguages ? 1 : 0,
        target: 1,
        category: "skills"
      },
      {
        id: 7,
        name: "Documentation Pro",
        description: "Maintains good project documentation",
        icon: "fas fa-book",
        unlocked: hasReadme,
        progress: hasReadme ? 1 : 0,
        target: 1,
        category: "quality"
      },
      {
        id: 8,
        name: "Project Organizer",
        description: "Uses GitHub topics and organization",
        icon: "fas fa-tags",
        unlocked: hasPinnedRepos,
        progress: hasPinnedRepos ? 1 : 0,
        target: 1,
        category: "organization"
      },
      {
        id: 9,
        name: "Repository Explorer",
        description: "Has forked repositories",
        icon: "fas fa-code-fork",
        unlocked: userData.public_repos > 5,
        progress: Math.min(userData.public_repos, 10),
        target: 5,
        category: "exploration"
      },
      {
        id: 10,
        name: "Code Collaborator",
        description: "Active in community projects",
        icon: "fas fa-handshake",
        unlocked: totalForks > 2,
        progress: Math.min(totalForks, 5),
        target: 2,
        category: "collaboration"
      }
    ];
  };

  // Default achievements for fallback
  const getDefaultAchievements = () => {
    return [
      {
        id: 1,
        name: "Open Source Contributor",
        description: "Has public repositories",
        icon: "fas fa-code-branch",
        unlocked: false,
        progress: 0,
        target: 1,
        category: "repositories"
      },
      {
        id: 2,
        name: "Star Collector",
        description: "Received stars on repositories",
        icon: "fas fa-star",
        unlocked: false,
        progress: 0,
        target: 1,
        category: "stars"
      },
      {
        id: 3,
        name: "Community Builder",
        description: "Gained followers on GitHub",
        icon: "fas fa-users",
        unlocked: false,
        progress: 0,
        target: 1,
        category: "social"
      }
    ];
  };

  if (loading) {
    return (
      <div className="github-stats-page">
        <div className="container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading GitHub statistics...</p>
            <small>Fetching data from GitHub API</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="github-stats-page">
      <div className="container">
        <div className="page-header">
          <h1>GitHub Statistics</h1>
          <p>My coding activity and open-source contributions</p>
          
          {stats?.userData && (
            <div className="github-profile">
              <img 
                src={stats.userData.avatar_url} 
                alt={`${username}'s GitHub profile`}
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150/2563eb/ffffff?text=GitHub';
                }}
              />
              <h2>{stats.userData.name || username}</h2>
              <p className="profile-bio">{stats.userData.bio || 'GitHub Developer'}</p>
              <div className="profile-meta">
                <span>Joined GitHub in {stats.joinedDate}</span>
              </div>
              <a 
                href={stats.userData.html_url}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <i className="fab fa-github"></i>
                View Profile on GitHub
              </a>
            </div>
          )}
        </div>

        {error && (
          <div className="warning-message">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <strong>Note:</strong> {error}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-code-branch"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.repositories?.toLocaleString() || '0'}</h3>
              <p>Public Repositories</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.stars?.toLocaleString() || '0'}</h3>
              <p>Stars Received</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.followers?.toLocaleString() || '0'}</h3>
              <p>Followers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-network-wired"></i>
            </div>
            <div className="stat-content">
              <h3>{stats?.contributions?.toLocaleString() || '0'}</h3>
              <p>Total Contributions</p>
            </div>
          </div>
        </div>

        {/* GitHub Achievements Section */}
        <div className="achievements-section">
          <h2>GitHub Achievements</h2>
          <p className="section-subtitle">Milestones and accomplishments on GitHub</p>
          
          <div className="achievements-grid">
            {stats?.achievements?.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  <i className={achievement.icon}></i>
                </div>
                <div className="achievement-content">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(achievement.progress / achievement.target) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                </div>
                <div className="achievement-status">
                  {achievement.unlocked ? (
                    <i className="fas fa-check-circle unlocked"></i>
                  ) : (
                    <i className="fas fa-lock locked"></i>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className="languages-section">
          <h2>Top Programming Languages</h2>
          <div className="languages-list">
            {stats?.languages?.map((language, index) => (
              <div key={index} className="language-tag">
                <i className="fas fa-circle" style={{ color: getLanguageColor(language) }}></i>
                {language}
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="contribution-graph">
          <h2>GitHub Contribution Activity</h2>
          <div className="graph-container">
            <img 
              src={`https://ghchart.rshah.org/2563eb/${username}`}
              alt={`GitHub contribution chart for ${username}`}
              className="contribution-chart"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.graph-fallback');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="graph-fallback">
              <i className="fab fa-github"></i>
              <p>Live contribution graph</p>
              <small>Contribution data visualization</small>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {stats?.recentActivity?.map((activity, index) => (
              <div key={index} className="activity-item">
                <i className="fas fa-circle"></i>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Tips */}
        <div className="github-tips">
          <h3>💡 How to Earn More Achievements</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <i className="fas fa-code"></i>
              <h4>Create More Repositories</h4>
              <p>Build and share your projects to increase your repository count</p>
            </div>
            <div className="tip-card">
              <i className="fas fa-star"></i>
              <h4>Write Quality Code</h4>
              <p>Create useful projects that others will star and use</p>
            </div>
            <div className="tip-card">
              <i className="fas fa-users"></i>
              <h4>Engage with Community</h4>
              <p>Follow developers and contribute to open source projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for language colors
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f7df1e',
    Python: '#3572A5',
    TypeScript: '#3178c6',
    Java: '#b07219',
    CSS: '#563d7c',
    HTML: '#e34c26',
    React: '#61dafb',
    'C++': '#f34b7d',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Shell: '#89e051',
    Vue: '#41b883'
  };
  return colors[language] || '#2563eb';
};

export default GitHubStats;
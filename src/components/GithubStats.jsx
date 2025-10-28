import React, { useState, useEffect } from 'react';
import './styles/GitHubStats.css';

const GitHubStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const username = "Ryderhxrzy"; // Your GitHub username

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    // Calculate PR-related stats for PullShark
    const totalPRs = reposData.reduce((acc, repo) => acc + (repo.open_issues_count || 0), 0);
    const hasMergedPRs = reposData.some(repo => repo.has_issues);
    
    // Calculate collaboration stats for Pair Extraordinaire
    const hasCollaborativeRepos = reposData.some(repo => repo.has_projects || repo.has_wiki);
    const forkCount = reposData.filter(repo => repo.fork).length;

    return [
      // Existing achievements...
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

      // GitHub-style achievements (simulated)
      {
        id: 11,
        name: "Pull Shark",
        description: "2 pull requests merged",
        icon: "fas fa-code-merge",
        unlocked: hasMergedPRs || userData.public_repos >= 2,
        progress: hasMergedPRs ? 2 : Math.min(userData.public_repos, 2),
        target: 2,
        category: "collaboration",
        githubOfficial: true,
        color: "#2DA44E"
      },
      {
        id: 12,
        name: "Pair Extraordinaire",
        description: "Co-authored commits",
        icon: "fas fa-people-arrows",
        unlocked: hasCollaborativeRepos || forkCount > 0,
        progress: hasCollaborativeRepos ? 1 : 0,
        target: 1,
        category: "collaboration",
        githubOfficial: true,
        color: "#8250DF"
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

  // Get responsive contribution graph URL based on screen size
  const getContributionGraphUrl = () => {
    if (windowWidth < 768) {
      return `https://ghchart.rshah.org/2563eb/${username}`; // Standard size for mobile
    } else if (windowWidth < 1024) {
      return `https://ghchart.rshah.org/2563eb/${username}`; // Standard size for tablet
    } else {
      return `https://ghchart.rshah.org/2563eb/${username}`; // Standard size for desktop
    }
  };

  // Filter achievements by category
  const filteredAchievements = stats?.achievements?.filter(achievement => 
    activeCategory === 'all' || achievement.category === activeCategory
  ) || [];

  // Get unique categories for filters
  const categories = stats?.achievements ? 
    ['all', ...new Set(stats.achievements.map(a => a.category))] : ['all'];

  // Calculate achievement stats
  const totalAchievements = stats?.achievements?.length || 0;
  const unlockedAchievements = stats?.achievements?.filter(a => a.unlocked).length || 0;
  const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

  if (loading) {
    return (
      <div className="github-stats-component">
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
    <div className="github-stats-component">
      <div className="page-header">
        <h2>GitHub Statistics</h2>
        <p>My coding activity and open-source contributions</p>
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

      {/* Contribution Graph - Made Responsive */}
      <div className="contribution-graph">
        <h3>GitHub Contribution Activity</h3>
        <div className="graph-container">
          <img 
            src={getContributionGraphUrl()}
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
        <div className="graph-legend">
          <div className="legend-item">
            <span className="legend-color less"></span>
            <span>Less</span>
          </div>
          <div className="legend-item">
            <span className="legend-color more"></span>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="languages-section">
        <h3>Top Programming Languages</h3>
        <div className="languages-list">
          {stats?.languages?.map((language, index) => (
            <div key={index} className="language-tag">
              <i className="fas fa-circle" style={{ color: getLanguageColor(language) }}></i>
              {language}
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Achievements Section */}
      <div className="achievements-section">
        <h3>GitHub Achievements</h3>
        <p className="section-subtitle">Milestones and accomplishments on GitHub</p>
        
        {/* Achievement Summary */}
        <div className="achievement-summary">
          <div className="summary-item">
            <span className="summary-number">{unlockedAchievements}</span>
            <span className="summary-label">Unlocked</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{totalAchievements}</span>
            <span className="summary-label">Total</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{Math.round(completionRate)}%</span>
            <span className="summary-label">Completion</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="achievement-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-filter ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="achievements-grid">
          {filteredAchievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${
                achievement.githubOfficial ? 'github-official' : ''
              }`}
              style={{
                '--achievement-color': achievement.color,
                '--achievement-light': achievement.color ? `${achievement.color}20` : undefined
              }}
            >
              {achievement.githubOfficial && (
                <div className="achievement-badge">GitHub</div>
              )}
              
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
                        width: `${(achievement.progress / achievement.target) * 100}%`,
                        backgroundColor: achievement.color
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

      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="activity-item">
              <i className="fas fa-circle"></i>
              <span>{activity}</span>
            </div>
          ))}
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
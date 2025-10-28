export const personalInfo = {
  name: "Jhay-R Cervantes",
  title: "Full Stack Developer",
  aka: "Ryder Hxrzy",
  email: "jhayrcervantes0981@gmail.com",
  phone: "+(+63) 969-597-2435",
  location: "Manila, Philippines",
  about: "I'm a passionate full-stack developer with expertise in MERN stack and various programming languages. As a 4th year Computer Science student and freelance developer since 2023, I combine academic knowledge with practical experience to deliver high-quality web solutions.",
  skills: [
    "HTML", "CSS", "JavaScript", "MERN Stack", "MySQL",
    "MSSQL", "PostgreSQL", "Java", "C#", "C++", "Python",
    "Visual Basic", "XAMPP", "GitHub", "Git", "Photoshop",
    "Vector Art", "Filmora", "CapCut"
  ],
  socialLinks: {
    github: "https://github.com/Ryderhxrzy",
    linkedin: "https://linkedin.com/in/jhayrcervantes",
    twitter: "https://twitter.com/jhayrcervantes"
  }
};

/**
 * fetchGitHubRepositories - Fetches pinned repositories from GitHub
 */
export const fetchGitHubRepositories = async (username = 'Ryderhxrzy', options = {}) => {
  // Use environment variable or default to localhost:4000
  const serverBase = options.serverBase || 
    (typeof import.meta !== 'undefined' ? import.meta.env.VITE_APP_API_BASE : '') || 
    'http://localhost:4000';
  
  try {
    console.log('Fetching from:', `${serverBase}/api/github/pinned?username=${username}`);
    
    const response = await fetch(`${serverBase}/api/github/pinned?username=${username}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Failed to fetch repositories');
    }
    
    console.log(`Successfully fetched ${data.repos?.length || 0} repositories`);
    return data.repos || [];
    
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    
    // Return fallback data
    return getFallbackProjects(username);
  }
};

/**
 * Fallback projects in case the API fails
 */
const getFallbackProjects = (username) => {
  return [
    {
      id: 'fallback-1',
      title: 'TechnoAI-ReactJS',
      description: 'MERN stack AI helper UI with modern React features',
      githubUrl: `https://github.com/${username}/TechnoAI-ReactJS`,
      liveUrl: null,
      stars: 12,
      forks: 3,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      updated_at: new Date().toISOString(),
      topics: ['react', 'mern', 'ai', 'javascript'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      image: `https://opengraph.githubassets.com/1/${username}/TechnoAI-ReactJS`,
      isPinned: true
    },
    {
      id: 'fallback-2',
      title: 'Portfolio',
      description: 'Modern responsive portfolio website built with React',
      githubUrl: `https://github.com/${username}/portfolio`,
      liveUrl: null,
      stars: 8,
      forks: 2,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      topics: ['react', 'portfolio', 'responsive', 'modern'],
      technologies: ['React', 'CSS3', 'JavaScript'],
      image: `https://opengraph.githubassets.com/1/${username}/portfolio`,
      isPinned: true
    },
    {
      id: 'fallback-3',
      title: 'E-Commerce-App',
      description: 'Full-stack e-commerce application with payment integration',
      githubUrl: `https://github.com/${username}/E-Commerce-App`,
      liveUrl: null,
      stars: 15,
      forks: 5,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      topics: ['ecommerce', 'mern', 'payment', 'fullstack'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: `https://opengraph.githubassets.com/1/${username}/E-Commerce-App`,
      isPinned: true
    }
  ];
};
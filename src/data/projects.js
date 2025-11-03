export const personalInfo = {
  name: "Jhay-R Cervantes",
  title: "Full Stack Developer",
  aka: "Ryder Hxrzy",
  email: "jhayrcervantes0981@gmail.com",
  phone: "(+63) 969-597-2435",
  location: "Manila, Philippines",
  about: "I'm a passionate full-stack developer and creative vector artist with a strong foundation in both technology and design. As a 4th-year Information Technology student and freelance developer since 2023, I specialize in various programming languages. I enjoy building modern web applications and creating engaging cartoon artworks that blend creativity with functionality.",
  skills: [
    "HTML", "CSS", "JavaScript", "MERN Stack", "MySQL",
    "MSSQL", "PostgreSQL", "Java", "C#", "C++", "Python",
    "Visual Basic", "XAMPP", "Git", "GitHub", "Photoshop",
    "Vector Art", "Cartoon Illustration", "Filmora", "CapCut"
  ],
  socialLinks: {
    github: "https://github.com/Ryderhxrzy",
    linkedin: "https://linkedin.com/in/jhayrcervantes",
    facebook: "https://www.facebook.com/jhayr.cervantes.351"
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
 * fetchCertificates - Fetches certificates from GitHub repository
 */
export const fetchCertificates = async (username = 'Ryderhxrzy') => {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${username}/certificates/main/data/certificates.json`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch certificates: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.certificates?.length || 0} certificates`);
    return data.certificates || [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    // Return fallback certificates
    return getFallbackCertificates(username);
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
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
      updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      topics: ['ecommerce', 'mern', 'payment', 'fullstack'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: `https://opengraph.githubassets.com/1/${username}/E-Commerce-App`,
      isPinned: true
    }
  ];
};

/**
 * Fallback certificates in case the fetch fails
 */
const getFallbackCertificates = (username) => {
  return [
    {
      id: 'cert-fallback-1',
      title: 'Web Development Bootcamp',
      issuer: 'Udemy',
      date: '2024-01-15',
      description: 'Complete full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB',
      image: `https://raw.githubusercontent.com/${username}/certificates/main/images/certificate-1.jpg`,
      certificateUrl: 'https://www.udemy.com/certificate/sample/',
      tags: ['Web Development', 'Full Stack', 'JavaScript', 'React', 'Node.js'],
      credentialId: 'UC-SAMPLE123'
    },
    {
      id: 'cert-fallback-2',
      title: 'JavaScript Algorithms',
      issuer: 'freeCodeCamp',
      date: '2023-11-20',
      description: 'JavaScript algorithms and data structures certification',
      image: `https://raw.githubusercontent.com/${username}/certificates/main/images/certificate-2.jpg`,
      certificateUrl: 'https://www.freecodecamp.org/certification/sample',
      tags: ['JavaScript', 'Algorithms', 'Data Structures'],
      credentialId: 'FCCAMP-JS123'
    },
    {
      id: 'cert-fallback-3',
      title: 'Responsive Web Design',
      issuer: 'freeCodeCamp',
      date: '2023-09-10',
      description: 'Responsive web design certification covering HTML5, CSS3, and modern design principles',
      image: `https://raw.githubusercontent.com/${username}/certificates/main/images/certificate-3.jpg`,
      certificateUrl: 'https://www.freecodecamp.org/certification/sample',
      tags: ['HTML', 'CSS', 'Responsive Design', 'Web Design'],
      credentialId: 'FCCAMP-RWD456'
    }
  ];
};
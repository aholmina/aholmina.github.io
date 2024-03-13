document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');
    const homeLink = document.getElementById('home');
    const aboutLink = document.getElementById('about');
    const contactLink = document.getElementById('contact');
  
    // Dummy data for pages
    const pages = {
      home: { title: 'Home', content: 'Transform your Image, Transform Your Life' },
      about: { title: 'About', content: 'Learn more about us.' },
      contact: { title: 'Contact', content: 'Contact us for inquiries.' }
    };
  
    // Function to load page content
    function loadPageContent(pageId) {
      const page = pages[pageId];
      contentDiv.innerHTML = `<div><h1>${page.title}</h1><p>${page.content}</p></div>`;
    }
  
    // Event listeners for page navigation
    homeLink.addEventListener('click', function (event) {
      event.preventDefault();
      loadPageContent('home');
    });
  
    aboutLink.addEventListener('click', function (event) {
      event.preventDefault();
      loadPageContent('about');
    });
  
    contactLink.addEventListener('click', function (event) {
      event.preventDefault();
      loadPageContent('contact');
    });
  
    // Load initial page content
    loadPageContent('home');
  });


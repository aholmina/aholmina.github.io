document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const userContainer = document.getElementById('user');
    const spinner = document.querySelector('.spinner');
  
    generateBtn.addEventListener('click', fetchUser);
  
    async function fetchUser() {
      // Show spinner and disable button
      spinner.classList.remove('hidden');
      generateBtn.disabled = true;
  
      try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
  
        // Set background color based on gender
        document.body.style.backgroundColor = user.gender === 'female' ? 'purple' : 'blue';
  
        // Display user information
        userContainer.innerHTML = `
          <div class="flex justify-center">
            <img src="${user.picture.large}" alt="User" class="rounded-full">
          </div>
          <div class="text-center mt-4">
            <p class="text-xl font-bold">${user.name.first} ${user.name.last}</p>
            <p class="text-sm">${user.email}</p>
            <p class="text-sm">${user.location.city}, ${user.location.country}</p>
            <p class="text-sm">${user.phone}</p>
          </div>
        `;
      } catch (error) {
        console.error('Error fetching user:', error);
        userContainer.innerHTML = '<p class="text-center">Error fetching user. Please try again.</p>';
      } finally {
        // Hide spinner and enable button
        spinner.classList.add('hidden');
        generateBtn.disabled = false;
      }
    }
  });
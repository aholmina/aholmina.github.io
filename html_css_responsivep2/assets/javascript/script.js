
function handleSearch(event) {
    event.preventDefault(); 
  
    
    var searchTerm = document .getElementById('searchInput').value.toLowerCase();
    var itemsToSearch = document.querySelectorAll('.searchable'); 
  
    itemsToSearch.forEach(function(item) {
      
      var text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
    
        item.style.display = 'block';
      } else {
        
        item.style.display = 'none';
      }
    });
  }
  
  document.getElementById('searchForm').addEventListener('submit', handleSearch);
  
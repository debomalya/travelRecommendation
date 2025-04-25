// Function to handle search and display recommendations
async function handleSearch() {
  let searchInput = document.getElementById('search').value;
  if (!searchInput.trim()) {
    document.getElementById('results').textContent = 'Please enter a search term';
    return;
  }

  try {
    let response = await fetch('travel_recommendation_api.json');
    let data = await response.json();

    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear existing results

    let keyword = searchInput.toLowerCase().trim();
    let matchedItems = [];

    if (keyword.includes('beach')) {
      matchedItems = data.beaches;
    } else if (keyword.includes('temple')) {
      matchedItems = data.temples;
    } else {
      // Check country and cities
      data.countries.forEach(country => {
        if (keyword.includes(country.name.toLowerCase())) {
          matchedItems.push(...country.cities);
        } else {
          country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(keyword) || keyword.includes(city.name.toLowerCase())) {
              matchedItems.push(city);
            }
          });
        }
      });
    }

    if (matchedItems.length > 0) {
      resultsContainer.style.display = 'flex'; // Show results container
      matchedItems.forEach(place => {
        let card = document.createElement('div');
        card.classList.add('card');

        let image = document.createElement('img');
        image.src = place.imageUrl;
        image.alt = place.name;

        let name = document.createElement('h3');
        name.textContent = place.name;

        let description = document.createElement('p');
        description.textContent = place.description;

        // Add Visit button
        let visitBtn = document.createElement('button');
        visitBtn.className = 'visit-btn';
        visitBtn.textContent = 'Visit';
        if (place.url) {
          visitBtn.onclick = () => window.open(place.url, '_blank');
        } else {
          visitBtn.disabled = true;
        }

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(visitBtn);
        resultsContainer.appendChild(card);
      });
    } else {
      resultsContainer.style.display = 'flex'; // Show container for message
      resultsContainer.textContent = 'No recommendations found for your search.';
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
}

// Function to clear search results
function clearResults() {
  let resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'none'; // Hide results container
  document.getElementById('search').value = '';
}
  
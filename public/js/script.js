const socket = io();

if(navigator.geolocation){
  navigator.geolocation.watchPosition((position)=>{
    const{latitude, longitude} =  position.coords;
    socket.emit("send-location" , {latitude,longitude});
  }),(error)=>{
    console.error(error);
  },
  {
    enableHighAccuracy: true,
    timeout:5000,
    maximumAge:0
  }


}

const map = L.map("map").setView([0,0] , 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution : "SLV Dwarka Apartment, 76, Baba Nagar, Baglur Near SLV Defence Bangalore Karnataka 560064"
  
}).addTo(map)


const markers = {};

socket.on("receive-location" , (data)=>{
  const {id , latitude , longitude} = data;
  map.setView([latitude , longitude] , 16);
  if(markers[id]){
    markers[id].setLatLng([latitude,longitude]);
  }
  else{
    markers[id] = L.marker([latitude , longitude]).addTo(map);
  }
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

function searchLocation(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        
        // Center map on the searched location
        map.setView([lat, lon], 10);
        
        // Add a marker for the searched location
        const searchMarker = L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<b>${location.display_name}</b>`);
        
        // Marker will stay on the map permanently
      } else {
        alert('Location not found. Please try a different search term.');
      }
    })
    .catch(error => {
      console.error('Error searching location:', error);
      alert('Error searching for location. Please try again.');
    });
}

// Search on button click
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchLocation(query);
  }
});

// Search on Enter key press
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      searchLocation(query);
    }
  }
});
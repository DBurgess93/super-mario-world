let map;
let polylines = [];
let totalDistance = 0;
const distancesContainer = document.getElementById('distances');
const totalDistanceContainer = document.getElementById('totalDistances');
let isDrawing = false;
let currentPolyline;

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(document.getElementById('map'), {
    center: { lat: -34.92889390968822, lng: 138.49628233355094 },
    zoom: 14,
    mapId: '2e40f4c01b12cb97',
    draggable: true,
    gestureHandling: 'auto',
  });

  // Listener for clicks on the map
  map.addListener('click', function (e) {
    e.stop();
    if (!isDrawing) {
      // First click: Start drawing
      startDrawing(e.latLng);
    } else {
      // Second click: Stop drawing
      stopDrawing();
    }
  });
}

function startDrawing(startPoint) {
  isDrawing = true;
  currentPolyline = new google.maps.Polyline({
    map: map,
    path: [startPoint],
    editable: false,
    clickable: false,
  });
  map.addListener('mousemove', extendPolyline);
}

// Function to extend the polyline as the mouse moves
function extendPolyline(e) {
  if (isDrawing && currentPolyline) {
    const path = currentPolyline.getPath();
    path.push(e.latLng);
    updateCurrentDistance(); // Update the distance for the current drawing
  }
}

function updateCurrentDistance() {
  const path = currentPolyline.getPath();
  let polylineDistance = 0;

  if (path.getLength() > 1) {
    // Start from the second point
    for (let j = 1; j < path.getLength(); j++) {
      const previousPoint = path.getAt(j - 1);
      const currentPoint = path.getAt(j);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPoint, currentPoint);
      polylineDistance += distance;
    }
  }

  // Update only the current distance display, not the total distance for all polylines
  totalDistanceContainer.innerHTML = `Current Distance: ${polylineDistance.toFixed(2)} meters`;
}

function stopDrawing() {
  isDrawing = false;
  polylines.push(currentPolyline);
  updateTotalDistances(); // Update the total distances after finalizing a polyline
  google.maps.event.clearListeners(map, 'mousemove');
}

function updateTotalDistances() {
  totalDistance = 0; // Reset total distance
  distancesContainer.innerHTML = ''; // Clear previous data

  // Iterate over all polylines to calculate total distance
  polylines.forEach((polyline, i) => {
    const path = polyline.getPath();
    let polylineDistance = 0;

    for (let j = 1; j < path.getLength(); j++) {
      const previousPoint = path.getAt(j - 1);
      const currentPoint = path.getAt(j);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPoint, currentPoint);
      polylineDistance += distance; // Add to the polyline's total distance
    }

    totalDistance += polylineDistance; // Add to the total distance of all polylines
    distancesContainer.innerHTML += `Polyline ${i + 1}: ${polylineDistance.toFixed(2)} meters<br>`; // Display each polyline's distance
  });

  // Update the total distance container
  totalDistanceContainer.innerHTML = `Total Distance: ${totalDistance.toFixed(2)} meters`;
}

initMap();

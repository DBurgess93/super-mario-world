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
      startDrawing(e.latLng);
    } else {
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

// Extend the polyline as the mouse moves
function extendPolyline(e) {
  if (isDrawing && currentPolyline) {
    const path = currentPolyline.getPath();
    path.push(e.latLng);
    updateCurrentDistance();
  }
}

function updateCurrentDistance() {
  const path = currentPolyline.getPath();
  let polylineDistance = 0;

  if (path.getLength() > 1) {
    for (let j = 1; j < path.getLength(); j++) {
      const previousPoint = path.getAt(j - 1);
      const currentPoint = path.getAt(j);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPoint, currentPoint);
      polylineDistance += distance;
    }
  }

  totalDistanceContainer.innerHTML = `Current Distance: ${polylineDistance.toFixed(2)} meters`;
}

function stopDrawing() {
  isDrawing = false;
  polylines.push(currentPolyline);
  updateTotalDistances();
  google.maps.event.clearListeners(map, 'mousemove');
}

function updateTotalDistances() {
  totalDistance = 0;
  distancesContainer.innerHTML = '';

  polylines.forEach((polyline, i) => {
    const path = polyline.getPath();
    let polylineDistance = 0;

    for (let j = 1; j < path.getLength(); j++) {
      const previousPoint = path.getAt(j - 1);
      const currentPoint = path.getAt(j);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPoint, currentPoint);
      polylineDistance += distance;
    }

    totalDistance += polylineDistance;
    distancesContainer.innerHTML += `Polyline ${i + 1}: ${polylineDistance.toFixed(2)} meters<br>`;
  });

  totalDistanceContainer.innerHTML = `Total Distance: ${totalDistance.toFixed(2)} meters`;
}

initMap();

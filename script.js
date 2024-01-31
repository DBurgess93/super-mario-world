let poly;
let map;
let polylines = [];
let totalDistance = 0;
const distancesContainer = document.getElementById('distances');
const totalDistanceContainer = document.getElementById('totalDistances');
let drawingManager;
let currentPolyline;

async function initMap() {
  const { Map, MVCArray } = await google.maps.importLibrary('maps');
  map = new Map(document.getElementById('map'), {
    center: { lat: -34.92889390968822, lng: 138.49628233355094 },
    zoom: 14,
    mapId: '2e40f4c01b12cb97',
  });

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
    },
    polylineOptions: {
      editable: true,
    },
  });

  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
      const polyline = event.overlay;
      polylines.push(polyline);

      const path = polyline.getPath();

      google.maps.event.addListener(path, 'insert_at', function (index) {
        console.log(`Point inserted at index ${index}`);
        updateDistances();
      });
      google.maps.event.addListener(path, 'set_at', function (index) {
        console.log(`Point set at index ${index}`);
        updateDistances();
      });

      updateDistances();

      currentPolyline = null;
      isDrawing = false;
      drawingManager.setDrawingMode(null);
    }
  });

  google.maps.event.addListener(map, 'mousedown', function (e) {
    if (!isDrawing) {
      currentPolyline = new google.maps.Polyline({
        map: map,
        path: new google.maps.MVCArray(),
        editable: false,
      });
      isDrawing = true;
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    }
  });

  google.maps.event.addListener(map, 'mousemove', function (e) {
    if (isDrawing) {
      const path = currentPolyline.getPath();
      path.push(e.latLng);
      updateDistances();
    }
  });
}

function updateDistances() {
  distancesContainer.innerHTML = '';
  totalDistance = 0;

  for (let i = 0; i < polylines.length; i++) {
    const polyline = polylines[i];
    const path = polyline.getPath();

    for (let j = 1; j < path.getLength(); j++) {
      const previousPoint = path.getAt(j - 1);
      const currentPoint = path.getAt(j);

      const distance = google.maps.geometry.spherical.computeDistanceBetween(previousPoint, currentPoint);

      distancesContainer.innerHTML += `Segment ${j}: ${distance.toFixed(2)} meters<br>`;
      totalDistance += distance;
    }
  }

  totalDistanceContainer.innerHTML = `Total Distance: ${totalDistance.toFixed(2)} meters`;
}

window.initMap = initMap;

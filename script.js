let poly;
let map;
let polylines = [];
let totalDistance = 0;
const distancesContainer = document.getElementById('distances');
const totalDistanceContainer = document.getElementById('totalDistances');

async function initMap() {
  const { Map, MVCArray } = await google.maps.importLibrary("maps")
  map = new Map(document.getElementById('map'), {
    center: { lat: -34.92889390968822, lng: 138.49628233355094 },
    zoom: 14,
    mapId: '2e40f4c01b12cb97',
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE,
      ],
    },
    markerOptions: {
      icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      animation: google.maps.Animation.DROP
    },
    circleOptions: {
      fillColor: "#ffff00",
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1,
    },
  });

  drawingManager.setMap(map);

  let currentPolyline;

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    if (event.type === google.maps.drawing.OverlayType.POLYLINE) {
      const polyline = event.overlay;
      polylines.push(polyline);

      const path = polyline.getPath();

      google.maps.event.addListener(path, 'insert_at', function (index) {
        console.log(`Point inserted at index ${index}`)
        updateDistances()
      })
      google.maps.event.addListener(path, 'set_at', function (index) {
        console.log(`Point set at index ${index}`)
        updateDistances()
      })

      updateDistances();

      currentPolyline = new google.maps.Polyline({
        map: map,
        path: new google.maps.MVCArray()
      })

      google.maps.event.addListener(map, 'click', function (e) {
        currentPolyline.getPath().push(e.latLng)
        updateDistances()
      })
    }
  });
}

function updateDistances() {
  distancesContainer.innerHTML = '';
  totalDistance = 0;

  console.log("update distances triggered")

  for (let i = 0; i < polylines.length; i++) {
    const polyline = polylines[i];
    const path = polyline.getPath();

    console.log(`Path ${i}:`, path.getArray().map(point => ({ lat: point.lat(), lng: point.lng() })));

    for (let j = 1; j < path.getLength(); j++) {
      const previousPoint = path.getAt(j - 1);
      const currentPoint = path.getAt(j);

      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        previousPoint,
        currentPoint
      );

      distancesContainer.innerHTML += `Segment ${j}: ${distance.toFixed(2)} meters<br>`;
      totalDistance += distance;
    }
  }

  totalDistanceContainer.innerHTML = `Total Distance: ${totalDistance.toFixed(2)} meters`;
}
window.initMap = initMap;

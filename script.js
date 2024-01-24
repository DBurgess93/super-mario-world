function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.90294429051486, lng: 138.7020212174254 },
    zoom: 18,
    mapId: '2e40f4c01b12cb97',
    mapTypeControl: false,
    fullScreenControl: false,
    streetViewControl: false,
  });

  const runPathcoordinates = [
    { lat: -34.90294429051486, lng: 138.7020212174254 },
    { lat: -34.90339260817647, lng: 138.70585938930034 },
    { lat: -34.90392677070563, lng: 138.70383562594807 },
    { lat: -34.90294429051486, lng: 138.7020212174254 }
  ]

  const runPath = new google.maps.Polyline({
    path: runPathcoordinates,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });
  runPath.setMap(map);


  // -34.90294429051486, 138.7020212174254
  // -34.90339260817647, 138.70585938930034
  // -34.90392677070563, 138.70383562594807

  // const markers = [
  //   [
  //     "Castle",
  //     -34.90294429051486,
  //     138.7020212174254,
  //     "castle.svg",
  //     38,
  //     31,
  //     1000
  //   ],
  //   [
  //     "Ghost House",
  //     -34.90339260817647,
  //     138.70585938930034,
  //     "ghosthouse.svg",
  //     38,
  //     31,
  //     2000
  //   ],
  //   [
  //     "Weird Hill",
  //     -34.90392677070563,
  //     138.70383562594807,
  //     "hills_with_eyes.svg",
  //     38,
  //     31,
  //     3000
  //   ]
  //   [
  //     "Pointy Boi",
  //     34.668562013820164,
  //     135.43130168128872,
  //     "pointer.svg",
  //     38,
  //     31,
  //     4000
  //   ],
  //   [
  //     "Star lol",
  //     34.668454379776044,
  //     135.43036814960806,
  //     "star.svg",
  //     38,
  //     31,
  //     5000
  //   ],
  // ];
};

for (let i = 0; i < markers.length; i++) {
  const currMarker = markers[i];
  // const markerDrop = [1000, 2000, 3000, 4000, 5000, 6000]

  const marker = new google.maps.Marker({
    position: { lat: currMarker[1], lng: currMarker[2] },
    map,
    title: currMarker[0],
    icon: {
      url: currMarker[3],
      scaledSize: new google.maps.Size(currMarker[4], currMarker[5])
    },
    animation: google.maps.Animation.DROP,
  });

  const infowindow = new google.maps.InfoWindow({
    content: currMarker[0],
  })

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

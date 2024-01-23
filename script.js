function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.66817453060681, lng: 135.43063861205758 },
    zoom: 18,
    mapId: '8d852c5e8f97aefd',
    mapTypeControl: false,
    fullScreenControl: false,
    streetViewControl: false,
  });

  const markers = [
    [
      "Castle",
      34.6671845551553,
      135.43111955414685,
      "castle.svg",
      38,
      31
    ],
    [
      "Ghost House",
      34.66747131570158,
      135.42967890659148,
      "ghosthouse.svg",
      38,
      31
    ],
    [
      "Weird Hill",
      34.66803101784564,
      135.43232245892088,
      "hills_with_eyes.svg",
      38,
      31
    ],
    [
      "Pointy Boi",
      34.668562013820164,
      135.43130168128872,
      "pointer.svg",
      38,
      31
    ],
    [
      "Star lol",
      34.668454379776044,
      135.43036814960806,
      "star.svg",
      38,
      31
    ],
  ];

  for (let i = 0; i < markers.length; i++) {
    const currMarker = markers[i];
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


}

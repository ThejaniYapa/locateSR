/*
demo- 
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map: google.maps.Map, infoWindow: google.maps.InfoWindow;
let markers: google.maps.Marker[] = [];
let latlng:google.maps.LatLng

function initMap(): void {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 7.5270786, lng: 79.86124 },
    zoom: 10,
  });

  infoWindow = new google.maps.InfoWindow({position: map.getCenter()});

  let bannerWindow = new google.maps.InfoWindow({
    content: "Click the map to get Latitude and Longitude",
    //position: { lat: 7.5270786, lng: 79.86124 },
    position: map.getCenter(),
  });
  bannerWindow.open(map);

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Your Location";
  submitButton.classList.add("custom-map-control-button");

  const markerButton = document.createElement("button");
  markerButton.textContent = "Mark the Location";
  markerButton.classList.add("custom-map-control-button");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(markerButton);

  map.addListener("click", (mapsMouseEvent) => {
    //marker.setMap(null);
    setMapOnAll(null);
    bannerWindow.close();
    bannerWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng,});
    bannerWindow.setContent(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
    bannerWindow.open({map,shouldFocus: false,});
    placeMarkerAndPanTo(mapsMouseEvent.latLng, map);
  });

  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          //currentLoc= new google.maps.LatLng(-34.397, 150.644),
          infoWindow.close();
          infoWindow.setContent("Location found: "+ pos.lat+"," +pos.lng);
          infoWindow.setPosition(pos)
          infoWindow.open({map,shouldFocus: false,});
          map.setCenter(pos);
          const marker = new google.maps.Marker({position: pos,map: map,});
          markers.push(marker);
          //placeMarkerAndPanTo(pos, map);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter()!);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter()!);
    }
  });

  submitButton.addEventListener("click", () => {
    infoWindow.setContent("Location found...");
    infoWindow.open(map);
  });

  markerButton.addEventListener("click", () => {
    //infoWindow.setPosition();
    infoWindow.setContent("Location found...");
    infoWindow.open(map);
  });

}

function handleLocationError(
  browserHasGeolocation: boolean,
  infoWindow: google.maps.InfoWindow,
  pos: google.maps.LatLng
) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  const marker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
  markers.push(marker);
}
export { initMap };


// Sets the map on all markers in the array.
function setMapOnAll(map: google.maps.Map | null) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  markers = [];
}
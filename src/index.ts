/*
demo- 
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";
import axios, { AxiosResponse } from 'axios';
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
    streetViewControl: false,
    mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: ["roadmap", "terrain"],}
  });

  //infoWindow = new google.maps.InfoWindow({position: map.getCenter()});

  let bannerWindow = new google.maps.InfoWindow({
    content: "Click the map to get Latitude and Longitude",
    position: map.getCenter(),
    pixelOffset: new google.maps.Size(0,-40),
  });
  bannerWindow.open(map);

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Your Location";
  submitButton.classList.add("custom-map-control-button");

  //const markerButton = document.createElement("button");
  //markerButton.textContent = "Mark the Location";
  //markerButton.classList.add("custom-map-control-button");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(submitButton);
  
  //map.controls[google.maps.ControlPosition.TOP_CENTER].push(markerButton);

  map.addListener("click", (mapsMouseEvent) => {
    //marker.setMap(null);
    setMapOnAll(null);
    bannerWindow.close();
    bannerWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng,});
    bannerWindow.setContent(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
    bannerWindow.open({map,shouldFocus: true,});
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
          map.setCenter(pos);
          bannerWindow.close();
          bannerWindow.setContent("Location found: "+ pos.lat+"," +pos.lng);
          bannerWindow.setPosition(pos)
          bannerWindow.open({map,shouldFocus: true});
          setMapOnAll(null);
          const marker = new google.maps.Marker({position: pos,map: map,draggable:true});
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
    bannerWindow.setContent("Location found...");
    bannerWindow.open(map);
    console.log(markers[0].getPosition()?.toJSON());
    var markloc:JSON=<JSON><unknown>{lat:markers[0].getPosition()?.lat().toString(),lng:markers[0].getPosition()?.lng().toString(),msisdn:'773337702'};
    console.log(markloc);
    const res=getapi(markloc);
    console.log(res);
    
    //bannerWindow.setContent(Promise.resolve(4));
  });

  //markerButton.addEventListener("click", () => {
  //  //infoWindow.setPosition();
  //  bannerWindow.setContent("Location found...");
  //  bannerWindow.open(map);
  //});

}

function handleLocationError(
  browserHasGeolocation: boolean,
  bannerWindow: google.maps.InfoWindow,
  pos: google.maps.LatLng
) {
  bannerWindow.setPosition(pos);
  bannerWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  bannerWindow.open(map);
}

function placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  const marker = new google.maps.Marker({
    position: latLng,
    map: map,
    draggable:true,
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
/*
async function getapi ( query: object ): Promise<object> {
  //const url = new URL('http://localhost:6060/postTest');
  const url = new URL('http://localhost:6060/posts/1');
  //url.search = new URLSearchParams( query ).toString();
  const headers = {
      //"x-api-key": "[insert-your-api-key]",
      //"x-api-secret": "[insert-your-api-secret]",
      //"x-rapidapi-host": "crypto-asset-market-data-unified-apis-for-professionals.p.rapidapi.com",
      //"x-rapidapi-key": "REPLACE_THIS_WITH_YOUR_KEY",
  };
  
  const response = await fetch( url.toString(), {headers} );
  return await response.json();
};
const query = {
  id: "1"
};
//(async () => {
//  const data = await getapi( query );
//  console.log(data)
//})()
*/

async function getapi  (body:JSON) {
  let response: AxiosResponse = await axios.post(`http://localhost:6060/postTest`, {
        body
    });
  return response.data;
}

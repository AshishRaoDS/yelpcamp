mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: yescampground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(yescampground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${yescampground.title}</h3><p>${yescampground.location}</p>`
    )
  )
  .addTo(map);

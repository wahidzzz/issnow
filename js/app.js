var earth;
function init() {
  earth = new WE.map("earth_div");

  WE.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    earth
  );
  earth.setView([21.7679, 78.8718], 2);
  callIssNow(earth);
}

function callIssNow(earth) {
  axios
    .get("http://api.open-notify.org/iss-now.json")
    .then(function (res) {
      // handle success
      var markIcon = document.getElementsByClassName("we-pm-icon");
      while (markIcon.length > 0) markIcon[0].remove();
      //   console.log(res["data"]["iss_position"]);
      var lat = res["data"]["iss_position"]["latitude"];
      var lng = res["data"]["iss_position"]["longitude"];
      // console.log(parseFloat(lat), parseFloat(lng));

      //   var marker = WE.marker([parseFloat(lat), parseFloat(lng)]).addTo(earth);
      var issLat = parseFloat(lat);
      var issLng = parseFloat(lng);
      var marker = WE.marker(
        [issLat, issLng],
        "../assets/issicon.png",
        50,
        30
      ).addTo(earth);

      // Start a simple rotation animation
      // var before = null;
      // requestAnimationFrame(function animate(now) {
      //   var c = earth.getPosition();
      //   var elapsed = before ? now - before : 0;
      //   before = now;
      //   earth.setCenter([c[0], c[1] + 0.1 * (elapsed / 100)]);
      //   requestAnimationFrame(animate);
      //   console.log(now);
      //   console.log(before);
      // });

      marker.bindPopup("<b>Hey</b><br>I am international space station<br />", {
        maxWidth: 150,
        closeButton: true,
      });
      // .openPopup();

      earth.setView([issLat, issLng], Math.round(earth.getZoom()));
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
// setInterval(function () {
//   callIssNow(earth);
// }, 3000);

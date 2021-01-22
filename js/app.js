function callIssNow() {
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
      var earth = new WE.map("earth_div");

      WE.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        earth
      );

      //   var marker = WE.marker([parseFloat(lat), parseFloat(lng)]).addTo(earth);
      var issLat = parseFloat(lat);
      var issLng = parseFloat(lng);
      var marker = WE.marker(
        [issLat, issLng],
        "../assets/iss.png",
        120,
        120
      ).addTo(earth);

      marker.bindPopup("<b>Hey</b><br>I am international space station<br />", {
        maxWidth: 150,
        closeButton: true,
      });
      // .openPopup();

      earth.setView([issLat, issLng], 3);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
setInterval(function () {
  callIssNow();
  // console.log("Hello");
}, 3000);

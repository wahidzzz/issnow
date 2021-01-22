function callIssNow() {
  axios
    .get("http://api.open-notify.org/iss-now.json")
    .then(function (res) {
      // handle success
      //   console.log(res["data"]["iss_position"]);
      var lat = res["data"]["iss_position"]["latitude"];
      var lng = res["data"]["iss_position"]["longitude"];
      console.log(lat, lng);
      var earth = new WE.map("earth_div");

      WE.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        earth
      );

      //   var marker = WE.marker([parseFloat(lat), parseFloat(lng)]).addTo(earth);
      var yesOne = 51.5;
      var yesTwo = -0.09;
      var marker = WE.marker([yesOne, yesTwo]).addTo(earth);

      marker
        .bindPopup("<b>Hello world!</b><br>I am a popup.<br />", {
          maxWidth: 150,
          closeButton: true,
        })
        .openPopup();

      var markerCustom = WE.marker(
        [50, -9],
        "/img/logo-webglearth-white-100.png",
        100,
        24
      ).addTo(earth);

      earth.setView([51.505, 0], 3);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

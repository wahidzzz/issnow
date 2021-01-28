var earth;

// Current People in Space http://api.open-notify.org/astros.json
// Passing position http://api.open-notify.org/iss-pass.json?lat=LAT&lon=LON
// Predcition example http://api.open-notify.org/iss-pass.json?lat=45.0&lon=-122.3&alt=20&n=5

function init() {
  getNumPeople();
  getLocation();
  // document.getElementById("darkSwitch").checked = false;
  earth = new WE.map("earth_div");
  // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  // dark theme :"https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=P96ofHivGNVZ2xp6Umna"

  WE.tileLayer(
    "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=P96ofHivGNVZ2xp6Umna"
  ).addTo(earth);
  earth.setView([21.7679, 78.8718], 3);
  callIssNow(earth);
}

function callIssNow(earth) {
  axios
    .get("http://api.open-notify.org/iss-now.json")
    .then(function (res) {
      // handle success
      // console.log(res);
      var markIcon = document.getElementsByClassName("we-pm-icon");
      while (markIcon.length > 0) markIcon[0].remove();
      //   console.log(res["data"]["iss_position"]);
      var lat = res["data"]["iss_position"]["latitude"];
      var lng = res["data"]["iss_position"]["longitude"];
      // console.log(parseFloat(lat), parseFloat(lng));

      //   var marker = WE.marker([parseFloat(lat), parseFloat(lng)]).addTo(earth);
      var issLat = parseFloat(lat);
      var issLng = parseFloat(lng);
      var marker = WE.marker([issLat, issLng]).addTo(earth);

      // Start a simple rotation animation

      var before = null;
      requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before ? now - before : 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1 * (elapsed / 100)]);
        requestAnimationFrame(animate);
        // console.log(now);
        // console.log(before);
      });

      marker.bindPopup(
        "<b>Hey 🤖,</b><br>I am international space station 🛰️<br />",
        {
          maxWidth: 150,
          closeButton: true,
        }
      );
      // .openPopup();

      earth.setView([issLat, issLng], Math.round(earth.getZoom()));
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
function getNumPeople() {
  var dataRow = `<table style="width:100%;padding:.5rem;border-collapse: separate;
  border-spacing: 0 1rem;">
  <tr>
    <th style="position: absolute;top:1rem;left:1rem;">People In Space</th>
    <th style="position: absolute;top:1rem;right:1rem;"><a href="#" onclick="closeModalPop()">❌</a></th>
  </tr>
  <tr>
    <th style="text-align: left;">Name</th>
    <th style="text-align: left;">Craft</th>
  </tr>`;
  axios
    .get("http://api.open-notify.org/astros.json")
    .then(function (res) {
      let totalPeople = res.data.people.length;
      for (let i = 0; i < totalPeople; i++) {
        dataRow += `<tr>
        <td>${res.data.people[i].name}</td>
        <td>${res.data.people[i].craft}</td>
      </tr>`;
      }
      dataRow += `</table>`;
      document.getElementById("pipDiv").innerHTML += dataRow;
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function geoSuccess(position) {
  var passTime = document.getElementById("pass-time");
  var passRow = `<table style="width:100%;padding:.5rem;border-collapse: separate;
  border-spacing: 0 .6rem;">`;
  console.log(new Date(1611851339 * 1000).toLocaleString());
  var lat = parseFloat(position.coords.latitude);
  var lng = parseFloat(position.coords.longitude);
  var myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin", "*");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    "http://api.open-notify.org/iss-pass.json?lat=19.0181&lon=72.8625",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  // let config = {
  //   method: "get",
  //   url: "http://api.open-notify.org/iss-pass.json?lat=19.0181&lon=72.8625&",
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //     "Content-Type": "text/html",
  //   },
  // };

  // axios(config)
  //   .then((response) => {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}
function geoError() {
  console.log("Geocoder failed.");
}
function speakerClick() {
  var speak = document.getElementById("speaker");

  var audio = document.getElementById("player");
  audio.volume = 0.1;

  if (audio.paused) {
    audio.play();
    speak.style.backgroundColor = "#121212";
  } else {
    audio.pause();
    speak.style.backgroundColor = "#242424";
  }
  audio.addEventListener(
    "ended",
    function () {
      this.currentTime = 0;
      this.play();
    },
    false
  );
}
// setInterval(function () {
//   callIssNow(earth);
// }, 3000);

function openTab(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

var earth;
var Test = {
  message: "success",
  request: {
    altitude: 100,
    datetime: 1611859715,
    latitude: 19.0181,
    longitude: 72.8625,
    passes: 5,
  },
  response: [
    {
      duration: 414,
      risetime: 1611862903,
    },
    {
      duration: 596,
      risetime: 1611905101,
    },
    {
      duration: 587,
      risetime: 1611910906,
    },
    {
      duration: 622,
      risetime: 1611940571,
    },
  ],
};

// Current People in Space http://api.open-notify.org/astros.json
// Passing position http://api.open-notify.org/iss-pass.json?lat=LAT&lon=LON
// Predcition example http://api.open-notify.org/iss-pass.json?lat=45.0&lon=-122.3&alt=20&n=5

function init() {
  var counter = 0;
  var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange
      ? "orientationchange"
      : "resize";

  window.addEventListener(
    orientationEvent,
    function () {
      if (!counter) {
        openModalPop("warnMsg");
        counter++;
      }
    },
    false
  );
  getNumPeople();
  getLocation();
  getNasaApod();
  // document.getElementById("darkSwitch").checked = false;
  earth = new WE.map("earth_div");
  // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  // dark theme :"https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=P96ofHivGNVZ2xp6Umna"

  WE.tileLayer(
    "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=P96ofHivGNVZ2xp6Umna"
  ).addTo(earth);
  earth.setView([21.7679, 78.8718], 2);
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
      var issLat = parseFloat(lat);
      var issLng = parseFloat(lng);

      var detailsTab = document.getElementById("details");

      var currentdate = new Date();
      var lastCalledDate =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

      // https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en

      var issData = `<table style="width:100%;padding:.5rem;border-collapse: separate;
      border-spacing: 0 .6rem;">
      <tr>
          <td>Speed 🚀</td>
          <td>~27,600 km/h</td>
        </tr>
        <tr>
          <td>Lat,Lng 📍 </td>
          <td>${lat + ", " + lng}</td>
        </tr>
        <tr>
          <td>Last Sync ✔️</td>
          <td>${lastCalledDate}</td>
        </tr>
      </table>`;

      detailsTab.innerHTML = issData;

      // Start a simple rotation animation

      // var before = null;
      // requestAnimationFrame(function animate(now) {
      //   var c = earth.getPosition();
      //   var elapsed = before ? now - before : 0;
      //   before = now;
      //   earth.setCenter([c[0], c[1] + 0.1 * (elapsed / 100)]);
      //   requestAnimationFrame(animate);
      //   // console.log(now);
      //   // console.log(before);
      // });
      var marker = WE.marker([issLat, issLng]).addTo(earth);

      marker.bindPopup(
        "<b>Hey 🤖,</b><br>I am international space station 🛰️<br />",
        {
          maxWidth: 150,
          closeButton: true,
        }
      );
      // .openPopup();

      earth.setView([issLat, issLng], Math.round(earth.getZoom()));
      // marker.closePopup();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  // addMarker(earth);
}
function getNumPeople() {
  var dataRow = `<table style="width:100%;padding:.5rem;border-collapse: separate;
  border-spacing: 0 1rem;">
  <tr>
    <th style="position: absolute;top:1rem;left:1rem;">People In Space</th>
    <th style="position: absolute;top:1rem;right:1rem;"><a href="#" onclick="closeModalPop('pipDiv')">❌</a></th>
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
  border-spacing: 0 .3rem;">`;
  var lat = parseFloat(position.coords.latitude);
  var lng = parseFloat(position.coords.longitude);
  console.log(lat, lng);
  let config = {
    method: "get",
    url: `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lng}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/html",
    },
  };

  axios(config)
    .then((res) => {
      // // console.log(res);
      // res = !res || res.isEmpty() ? Test : res;
      // console.log(res);
      res["response"].forEach((dataR) => {
        var date = new Date(dataR["risetime"] * 1000).toLocaleString();
        passRow += ` <tr>
        <td>${date}</td>
      </tr>`;
      });
      passRow += "</table>";
      // console.log(passRow);
      passTime.innerHTML += passRow;
    })
    .catch((error) => {
      passRow += "<tr><td>IST/Demo Data</td></tr>";

      Test["response"].forEach((dataR) => {
        var date = new Date(dataR["risetime"] * 1000).toLocaleString();
        passRow += ` <tr>
        <td>${date}</td>
      </tr>`;
      });
      passRow += "</table>";
      passTime.innerHTML += passRow;
      console.log(error);
    });
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
// function addMarker(earth) {
//   earth.on("click", function (e) {
//     e.preventDefault();
//     // console.log(e.latlng.lat + ", " + e.latlng.lng);
//     var marker = WE.marker([e.latlng.lat, e.latlng.lng]).addTo(earth);

//     marker.bindPopup("Hello World", {
//       maxWidth: 150,
//       closeButton: true,
//     });
//     return marker;
//   });
// }

function getNasaApod() {
  axios
    .get(
      "https://api.nasa.gov/planetary/apod?api_key=lrBdjfSktWU53ziTLIiFweAjRzAkGokSHfhmJwRf"
    )
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
}
// setInterval(function () {
//   callIssNow(earth);
// }, 3000);

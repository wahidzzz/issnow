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
var trackIss;
var issIcon = document.getElementsByClassName("we-pm-icon");
//adding polygons

// var options = {
//   color: "#f00",
//   opacity: 1,
//   fillColor: "#ff0000",
//   fillOpacity: 1,
//   weight: 2,
// };
// var polygonB = WE.polygon(
//   [
//     [50, 3],
//     [51, 2.5],
//     [50.5, 4.5],
//   ],
//   options
// ).addTo(earth);
//disabling Warnings
console.log = function () {};
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
    false,
  );
  trackISS();
  getNumPeople();
  getLocation();
  getNasaApod();

  earth = new WE.map("earth_div");
  // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

  WE.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    earth,
  );
  earth.setView([21.7679, 78.8718], 2);

  callIssNow(earth);
}

function callIssNow(earth) {
  axios
    .get("http://api.open-notify.org/iss-now.json")
    .then(function (res) {
      // handle success
      console.log(res);

      // var markIcon = document.getElementsByClassName("we-pm-icon");
      while (issIcon.length > 0) issIcon[0].parentElement.remove();
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

      var marker = WE.marker([issLat, issLng]).addTo(earth);

      marker.bindPopup(
        "<b>Hey 🤖,</b><br>I am international space station 🛰️<br />",
        {
          maxWidth: 150,
          closeButton: true,
        },
      );
      // .openPopup();
      earth.panTo([issLat, issLng], { heading: 90, tilt: 25, duration: 1 });
      // earth.setView([issLat, issLng], Math.round(earth.getZoom()));
      // marker.closePopup();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  // addMarker(earth);
}
function getNumPeople() {
  closeModalPop("apodDiv");
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
  // console.log(lat, lng);
  let config = {
    method: "get",
    url: `https://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lng}`,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
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
    false,
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
  closeModalPop("pipDiv");
  var apodData = document.getElementById("apodDiv");
  apodData.innerHTML = `<table style="width:100%;padding:.5rem;border-collapse: separate;
  border-spacing: 0 1rem;">
      <tr>
        <th style="position: absolute;top:1rem;left:1rem;">NASA Astronomy Picture of the Day</th>
        <th style="position: absolute;top:1rem;right:1rem;"><a href="#" onclick="closeModalPop('apodDiv')">❌</a></th>
      </tr>`;
  axios
    .get(
      "https://api.nasa.gov/planetary/apod?api_key=lrBdjfSktWU53ziTLIiFweAjRzAkGokSHfhmJwRf",
    )
    .then(function (res) {
      console.log(res);
      var image = res.data.url;
      var title = res.data.title;
      var copy = res.data.copyright;
      var date = res.data.date;
      var mediaType = res.data.media_type;
      if (mediaType === "video") {
        apodData.innerHTML += `
        <tr>
          <td><a href="#" onclick="createLightBox('${image}','${title}','${copy}','${date}','${mediaType}')">
                <iframe src="${image}" alt="NASA APOD" width="350" height="350" style="width: 95%;height: 90%;" controls></iframe>
              </a>
          </td>
        </tr>
      </table>`;
      } else {
        apodData.innerHTML += `
        <tr>
          <td><a href="#" onclick="createLightBox('${image}','${title}','${copy}','${date}')">
                <img src="${image}" alt="NASA APOD" width="350" height="350" style="width: 95%;height: 90%;"/>
              </a>
          </td>
        </tr>
       
      </table>`;
      }
    })
    .catch(function (err) {
      console.log(err);
      apodData.innerHTML +=
        "<tr><h3>Sorry, Could'nt Connect to NASA 😔</h3></tr></table>";
    });
}
function createLightBox(image, title, copy, date, mediaType) {
  closeModalPop("apodDiv");
  var instance;
  if (mediaType === "video") {
    instance = basicLightbox.create(`
    <div style="padding:1rem;">
      <h3 style="color:white;padding:.5rem;">${title}</h3>
      <iframe src="${image}" alt="NASA APOD" width="350" height="350" style="width: 95%;height: 90%;" controls></iframe>
      <div style="color:white;">
        <p>&copy; ${copy}</p><p>${date}</p><p><a href='https://apod.nasa.gov/apod/astropix.html' target='_blank'><u>Visit NASA ></u></a></p>
      </div>
    </div>`);
  } else {
    instance = basicLightbox.create(`
    <div style="padding:1rem;">
      <h3 style="color:white;padding:.5rem;">${title}</h3>
      <img src="${image}" width="800" height="600" style="width: 90%;height:90%;">
      <div style="color:white;">
        <p>&copy; ${copy}</p><p>${date}</p><p><a href='https://apod.nasa.gov/apod/astropix.html' target='_blank'><u>Visit NASA ></u></a></p>
      </div>
    </div>`);
  }

  instance.show();
}
function trackISS() {
  if (document.getElementById("track-iss").checked) {
    trackIss = setInterval(function () {
      callIssNow(earth);
    }, 3000);
  } else if (document.getElementById("animate-earth").checked) {
    clearInterval(trackIss);

    var before = null;
    requestAnimationFrame(function animate(now) {
      if (document.getElementById("track-iss").checked) {
        return false;
      } else {
        var c = earth.getPosition();
        var elapsed = before ? now - before : 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1 * (elapsed / 30)]);
        requestAnimationFrame(animate);
      }
    });
  } else {
    console.log("Beep Bop, Do Dee De Do ! I am robot 🤖");
  }
}

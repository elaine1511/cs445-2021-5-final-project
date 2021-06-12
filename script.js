
window.onload = function loginPage() {
  const loginTemplate = `
  <div>
  <h1>Please Login</h1> 
  Username<input type="text" value="mwp" id="username"> <br>
  Password<input type="text" value="123456" id="password"> <br>
  <button id="loginbtn">Login</button>
  </div>`
  let demo = document.getElementById("outlet");
  demo.innerHTML = loginTemplate;

  history.pushState(null, null, "login");

  document.getElementById("loginbtn").addEventListener("click", getUserInputs);

  function getUserInputs() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    fetchLoginToken();

    function fetchLoginToken() {
      const data = {
        username: username,
        password: password
      }
      fetch('https://shrouded-badlands-76458.herokuapp.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          let token = data.token;
          if (token.status) {
            fetchAnimation(token);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    animation();

    function animation(token) {
      const animationTemplate = `
      <div>
      <h2>Welcome all from</h2> <br>
      <textarea id="animation" cols="30" rows="10"></textarea> <br>
      <button id="refresh">Refresh Animation</button>
      <button id="logout">Logout</button>
      </div>`

      demo.innerHTML = animationTemplate;
      history.pushState(null, null, "animation");

      function fetchAnimation() {
        fetch('https://shrouded-badlands-76458.herokuapp.com/api/animation', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.text())
          .then(frames =>
            framesArr = frames.split("=====")
          );
      }

      function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const mapApiKey = 'iM4KPZV5Hiuqwa0pzkgf591Y0dTcnaJ1';

        fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=${mapApiKey}&location=
        ${latitude}, ${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
          .then(location => location.json())
          .then(address => {
            const street = address.results[0].locations[0].street;
            const city = address.results[0].locations[0].adminArea5;
            const state = address.results[0].locations[0].adminArea3;
            const zipcode = address.results[0].locations[0].postalCode;
            const country = address.results[0].locations[0].adminArea1;
            document.querySelector("h2").innerHTML += `${street} ,${city}
          ,${state} ,${zipcode} , ${country}`;
          }
          );
      }

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          demo.innerHTML = "Geolocation is not supported by this browser.";
        }
      }

      getLocation();

      document.getElementById('refresh').addEventListener('click', function () {
        clearInterval();
        window.onload();
      });

      document.getElementById('logout').addEventListener('click', function () {
        clearInterval();
        fetchLoginToken();
      });
    }

  }

}







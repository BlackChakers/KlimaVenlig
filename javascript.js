const login = document.querySelector('#login');
const swiperData = document.querySelector("#swiper_inhold");
/* Your web app's Firebase configuration */
var firebaseConfig = {
  apiKey: "AIzaSyB_EiBaJSyhjivzzflywmE6OD6x-vcnvEE",
  authDomain: "klimavenlig-bc722.firebaseapp.com",
  databaseURL: "https://klimavenlig-bc722.firebaseio.com",
  projectId: "klimavenlig-bc722",
  storageBucket: "klimavenlig-bc722.appspot.com",
  messagingSenderId: "539725362242",
  appId: "1:539725362242:web:dd5381ae81e2113defa9db"
};



/* // Initialize Firebase */
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
var getDb = firebase.firestore();

//download data
var email;
var password;
//opretter nybruger/tjekker om der er en bruger allerede
var userID;
var elforbrug
var transportbil
var fødevarer
var goderservices
var co2sum
var procentel
var procenttransportbil
var procentfødevarer
var procentgoderservices


login.addEventListener('submit', (e) => {
  e.preventDefault();
  // getDb.collection('users').add({
  //   familienavn: login.fname.value
  // });
  email = login['email'].value;
  password = login['pass'].value;
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user);
    userID = cred.user.uid;
    Swiper_Display();
  }).catch(function (error) {
    //Handle Errors here.

    firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {
      console.log("Logged ind som: " + cred)
      userID = cred.user.uid;
      
      var ref = getDb.collection("users").doc(cred.user.uid);

      document.getElementById("bottom-menu").style.display = "block";
      ref.get().then(function (doc) {
        if (doc.exists) {
          document.getElementById("fname").value = doc.data().familienavn;
          document.getElementById("El").value = doc.data().elregning;

          document.getElementById("KmPrUge").value = doc.data().KmPrUge;
          document.getElementById("kml").value = doc.data().KML;
          document.getElementById("Kød").value = doc.data().KrMadKød;
          document.getElementById("Frugt").value = doc.data().KrMadFrugt;
          document.getElementById("Bagværk").value = doc.data().KrBagværk;
          document.getElementById("Mejeri").value = doc.data().KrMejeri;
          document.getElementById("SpiseUde").value = doc.data().SpiseUde;
          document.getElementById("Andet").value = doc.data().Andet;
          document.getElementById("Shopping").value = doc.data().Shopping;
          document.getElementById("Møbler").value = doc.data().Møbler;
          console.log("data:", doc.data().Andet);
        } else {
          console.log("Fejl");
        }

        var elemissionsfactor = 1.37;
        var emissionsgreenhousegasses = 1.0526315;
        var kødemission = 1452;
        var frugtemission = 1176;
        var bagværkemission = 741;
        var mejeriemission = 1911;
        var andetemission = 467;
        var spiseudeemission = 368;
        var tøjemission = 436;
        var møbleremission = 459;
        var pundtilkg = 2.2046;

        elforbrug = (((doc.data().elregning / 2.25) * elemissionsfactor) / pundtilkg)/3;
        transportbil = ((((doc.data().KmPrUge * 52) / doc.data().KML) * 19.4 * emissionsgreenhousegasses) * 4) / pundtilkg;
        fødevarer = ((+doc.data().KrMadKød * kødemission) + (+doc.data().KrMadFrugt * frugtemission) + (+doc.data().KrBagværk * bagværkemission) + (+doc.data().KrMejeri * mejeriemission) + (+doc.data().SpiseUde * spiseudeemission) + (+doc.data().Andet * andetemission)) * 0.001
        goderservices = ((+doc.data().Shopping + +doc.data().Møbler) * (tøjemission + møbleremission)) * 0.001;
        co2sum = elforbrug + transportbil + fødevarer + goderservices;
        procentel = (elforbrug / co2sum) * 100;
        procenttransportbil = (transportbil / co2sum) * 100;
        procentfødevarer = (fødevarer / co2sum) * 100;
        procentgoderservices = (goderservices / co2sum) * 100;
        total = procentel + procenttransportbil + procentfødevarer + procentgoderservices;
        document.getElementById("husholdningsenergiProcent").textContent = Math.round(procentel) + " %";
        document.getElementById("transportProcent").textContent = Math.round(procenttransportbil) + " %";
        document.getElementById("fødevarerProcent").textContent = Math.round(procentfødevarer) + " %";
        document.getElementById("goderOgservicesProcent").textContent = Math.round(procentgoderservices) + " %";
        document.getElementById("tranMængde").textContent = Math.round(transportbil) + " kg";
        document.getElementById("husMængde").textContent = Math.round(elforbrug) + " kg";
        document.getElementById("fødeMængde").textContent = Math.round(fødevarer) + " kg";
        document.getElementById("godeMængde").textContent = Math.round(goderservices) + " kg";
        localStorage.setItem('userID', userID);
        
        statsData();

      }).catch(function (error) {
        console.log("Fejl", error);
      });

      getData();
    });
    firebase.auth().onAuthStateChanged(function (user) {

      if (user) {
        console.log("Bruger: " + user.email);
        console.log(user)
      } else {
        getDb.collection('users').onSnapshot(snapshot => {
          console.log("Ingen bruger")
        }), err => {
          console.log(err.message)
        }
      }
    })
  })
})
function updateData() {
  var fname = document.getElementById("fname").value;
  var El = document.getElementById("El").value;
  var KmPrUge = document.getElementById("KmPrUge").value;
  var kml = document.getElementById("kml").value;
  var Kød = document.getElementById("Kød").value;
  var Frugt = document.getElementById("Frugt").value;
  var Bagværk = document.getElementById("Bagværk").value;
  var Mejeri = document.getElementById("Mejeri").value;
  var sspiseude = document.getElementById("SpiseUde").value;
  var Andet = document.getElementById("Andet").value;
  var Shopping = document.getElementById("Shopping").value;
  var Møbler = document.getElementById("Møbler").value;

  var elemissionsfactor = 1.37;
  var emissionsgreenhousegasses = 1.0526315;
  var kødemission = 1452;
  var frugtemission = 1176;
  var bagværkemission = 741;
  var mejeriemission = 1911;
  var andetemission = 467;
  var spiseudeemission = 368;
  var tøjemission = 436;
  var møbleremission = 459;
  var pundtilkg = 2.2046;

  elforbrug = (((El / 2.25) * elemissionsfactor) / pundtilkg)/3;
  transportbil = ((((KmPrUge * 52) / kml) * 19.4 * emissionsgreenhousegasses) * 4) / pundtilkg;
  fødevarer = ((+Kød * kødemission) + (+Frugt * frugtemission) + (+Bagværk * bagværkemission) + (+Mejeri * mejeriemission) + (+sspiseude * spiseudeemission) + (+Andet * andetemission)) * 0.001
  goderservices = ((+Shopping + +Møbler) * (tøjemission + møbleremission)) * 0.001;
  co2sum = elforbrug + transportbil + fødevarer + goderservices;
  procentel = (elforbrug / co2sum) * 100;
  procenttransportbil = (transportbil / co2sum) * 100;
  procentfødevarer = (fødevarer / co2sum) * 100;
  procentgoderservices = (goderservices / co2sum) * 100;
  total = procentel + procenttransportbil + procentfødevarer + procentgoderservices
  document.getElementById("bottom-menu").style.display = "block";
  document.getElementById("husholdningsenergiProcent").textContent = Math.round(procentel) + " %";
  document.getElementById("transportProcent").textContent = Math.round(procenttransportbil) + " %";
  document.getElementById("fødevarerProcent").textContent = Math.round(procentfødevarer) + " %";
  document.getElementById("goderOgservicesProcent").textContent = Math.round(procentgoderservices) + " %";
  document.getElementById("tranMængde").textContent = Math.round(transportbil) + " kg";
  document.getElementById("husMængde").textContent = Math.round(elforbrug) + " kg";
  document.getElementById("fødeMængde").textContent = Math.round(fødevarer) + " kg";
  document.getElementById("godeMængde").textContent = Math.round(goderservices) + " kg";
  const getPage = window.location.search;
  var userId = getPage.substr(getPage.length - 1);
  
  console.log(getPage)
  console.log(userId)

  getData();
  statsData();

  return getDb.collection('users').doc(userID).set({
    familienavn: fname,
    elregning: El,
    KmPrUge: KmPrUge,
    KML: kml,
    KrMadKød: Kød,
    KrMadFrugt: Frugt,
    KrBagværk: Bagværk,
    KrMejeri: Mejeri,
    SpiseUde: sspiseude,
    Andet: Andet,
    Shopping: Shopping,
    Møbler: Møbler,

  })

}

function getData() {
  document.getElementById("login").style.display = "none";
  document.getElementById("hovedmenu").style.display = "inline";
  document.getElementById("Swiper_body").style.display = "none";
  document.getElementById("body_background").style.backgroundImage = "url('images/Homeinfo.png')";
}

function tilføjdata() {
  Swiper_Display()
  document.getElementById("bottom-menu").style.display = "none";
  document.getElementById("tilføj").style.display = "none";
}

//Swiper

function Swiper_Display() {
  document.getElementById("Swiper_body").style.display = "inline";
  document.getElementById("login").style.display = "none";
  document.getElementById("body_background").style.backgroundImage = "url('images/Baggrundinfo.png')";

  var myPlugin = {
    name: 'debugger',
    params: {
      debugger: false,
    },
    on: {
      init: function () {
        if (!this.params.debugger) return;
        console.log('init');
      },
      click: function (e) {
        if (!this.params.debugger) return;
        console.log('click');
      },
      tap: function (e) {
        if (!this.params.debugger) return;
        console.log('tap');
      },
      doubleTap: function (e) {
        if (!this.params.debugger) return;
        console.log('doubleTap');
      },
      sliderMove: function (e) {
        if (!this.params.debugger) return;
        console.log('sliderMove');
      },
      slideChange: function () {
        if (!this.params.debugger) return;
        console.log('slideChange', this.previousIndex, '->', this.activeIndex);

      },
      slideChangeTransitionStart: function () {
        if (!this.params.debugger) return;
        console.log('slideChangeTransitionStart');
      },
      slideChangeTransitionEnd: function () {
        if (!this.params.debugger) return;
        console.log('slideChangeTransitionEnd');
      },
      transitionStart: function () {
        if (!this.params.debugger) return;
        console.log('transitionStart');
      },
      transitionEnd: function () {
        if (!this.params.debugger) return;
        console.log('transitionEnd');
      },
      fromEdge: function () {
        if (!this.params.debugger) return;
        console.log('fromEdge');
      },
      reachBeginning: function () {
        if (!this.params.debugger) return;
        console.log('reachBeginning');
      },
      reachEnd: function () {
        if (!this.params.debugger) return;
        console.log('reachEnd');
      },
    },
  };

  // Install Plugin To Swiper
  Swiper.use(myPlugin);

  // Init Swiper
  var swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // Enable debugger
    debugger: true,
  });
}
function statsPage() {
  document.getElementById("hovedmenu").style.display = "none";
  document.getElementById("statsPage").style.display = "inline";
  document.getElementById("tilføj").style.display = "none";
}
// STATS SCRIPT
function statsData() {
  var config = {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [
          procentel,
          procenttransportbil,
          procentfødevarer,
          procentgoderservices,
        ],
        backgroundColor: [
          window.chartColors.Husholdningsenergi,
          window.chartColors.Transport,
          window.chartColors.Fødevarer,
          window.chartColors.Goder_og_Services,
        ],
        borderWidth: [
          0,
          0,
          0,
          0,
        ],
        label: 'Dataset 1'
      }],
      labels: [
        'Husholdningsenergi',
        'Transport',
        'Fødevarer',
        'Goder & Services',

      ]
    },

    options: {
      responsive: true,
      legend: {
        position: 'bottom',
        labels: {
          fontColor: 'white',
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },

    }
  };


  var ctx = document.getElementById('chart-area').getContext('2d');
  window.myDoughnut = new Chart(ctx, config);


}
var colorNames = Object.keys(window.chartColors);

function skifttekstinfo() {
  if (document.getElementById("brødtekstinfo").style.visibility = "hidden") {
    document.getElementById("brødtekstinfo").style.visibility = "visible";
    document.getElementById("brødtekstmål").style.visibility = "hidden";
    document.getElementById("brødteksttips").style.visibility = "hidden";
    document.getElementById("labelinfo").style.opacity = "100%";
    document.getElementById("labelmål").style.opacity = "30%";
    document.getElementById("labeltips").style.opacity = "30%";
    document.getElementById("dotinfo").style.visibility = "visible";
    document.getElementById("dotmål").style.visibility = "hidden";
    document.getElementById("dottips").style.visibility = "hidden";
  }
}
function skifttekstmål() {
  if (document.getElementById("brødtekstmål").style.visibility = "hidden") {
    document.getElementById("brødtekstinfo").style.visibility = "hidden";
    document.getElementById("brødtekstmål").style.visibility = "visible";
    document.getElementById("brødteksttips").style.visibility = "hidden";
    document.getElementById("labelinfo").style.opacity = "30%";
    document.getElementById("labelmål").style.opacity = "100%";
    document.getElementById("labeltips").style.opacity = "30%";
    document.getElementById("dotinfo").style.visibility = "hidden";
    document.getElementById("dotmål").style.visibility = "visible";
    document.getElementById("dottips").style.visibility = "hidden";
  }
}
function skiftteksttips() {
  if (document.getElementById("brødteksttips").style.visibility = "hidden") {
    document.getElementById("brødtekstinfo").style.visibility = "hidden";
    document.getElementById("brødtekstmål").style.visibility = "hidden";
    document.getElementById("brødteksttips").style.visibility = "visible";
    document.getElementById("labelinfo").style.opacity = "30%";
    document.getElementById("labelmål").style.opacity = "30%";
    document.getElementById("labeltips").style.opacity = "100%";
    document.getElementById("dotinfo").style.visibility = "hidden";
    document.getElementById("dotmål").style.visibility = "hidden";
    document.getElementById("dottips").style.visibility = "visible";
  }
}

$("#menuknapper").on("click", function (e) {
  console.log(e.target.id)
  $("#" + (e.target.id)).toggleClass("rykikon-click");
});
function vistekstinfo() {
  if (document.getElementById("tekstinfo").style.animationPlayState = "paused") {
    document.getElementById("tekstinfo").style.animationPlayState = "running";
  }
  document.getElementById("tilføj").style.display = "none";
  document.getElementById("hovedmenu").style.display = "block";
  document.getElementById("statsPage").style.display = "none";
}
function vistekststats() {
  if (document.getElementById("tekststats").style.animationPlayState = "paused") {
    document.getElementById("tekststats").style.animationPlayState = "running";
  }
  statsPage();

}
function visteksttilføj() {
  if (document.getElementById("teksttilføj").style.animationPlayState = "paused") {
    document.getElementById("teksttilføj").style.animationPlayState = "running";
  }
  document.getElementById("tilføj").style.display = "block";
  document.getElementById("hovedmenu").style.display = "none";
  document.getElementById("statsPage").style.display = "none";
}

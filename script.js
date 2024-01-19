const myWeatherBtn = document.querySelector("#my-weather-button");
const searchWeatherBtn = document.querySelector("#search-button");
const searchBox = document.querySelector("#search-box");
const locationBox = document.querySelector("#location-box");
const homeWeatherPage = document.querySelector("#home-weather-page");
const loadingpage = document.querySelector(".loading-page");

// tab switch
let currentWeather = myWeatherBtn;
let API_KEY = "3a928395607ae4107b44dc6ec857d39e";
getFromSessionStorage();


// async function fetchapi(){
//     let response = await fetch("")
// }

// let api = "https://api.openweathermap.org/data/2.5/weather?q=Seoni&appid=3a928395607ae4107b44dc6ec857d39e";
// async function getapi(){
//     let response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Seoni&appid=3a928395607ae4107b44dc6ec857d39e");
//     let data = response.json();
//     console.log(data);
// }
// getapi();

myWeatherBtn.classList.add("active");


myWeatherBtn.addEventListener("click", (e)=>{
    switchtab(myWeatherBtn);
})

searchWeatherBtn.addEventListener("click",() =>{
    switchtab(searchWeatherBtn);
})


// btn switch
function switchtab(change){
   if(currentWeather === change){
    return;
   }
   else{
    currentWeather.classList.remove("active");
    currentWeather = change;
    change.classList.add("active");
    
    
    // ye wali condition me search wale ko dkhra h agr active contain krra hoga to 
    // mtlb ye h ki my weather wala tab khula hoga jo else case me jaega
   if(!searchWeatherBtn.classList.contains("active")){
    homeWeatherPage.classList.remove("active");
      searchBox.classList.remove("active");
      
      locationBox.classList.remove("active");
    //   homeWeatherPage.classList.add("active");
    
    getFromSessionStorage();
      
   }
   else{
    // my tab me jaenge jo phle search box or home page wale dono ko hi remove krna padega
    searchBox.classList.add("active");
    homeWeatherPage.classList.remove("active");
    locationBox.classList.remove("active");
    // ab current location ke coordinates check krenge phle se save h ya nikalna pdega
    console.log("chalra h hai");
   }
}


}



// ye check krega coordinates available h ya ni 
// ni to leke aaega
function getFromSessionStorage(){
   
    const localcoordinates = sessionStorage.getItem("value");
    // console.log("location box active place",localcoordinates);
    // console.log(localcoordinates);
    if(!localcoordinates){
        locationBox.classList.add("active");
        fetchMyWeatherInfo(localcoordinates);
    }
    else{
        console.log("second box");
        const coordinates = JSON.parse(localcoordinates);
        fetchMyWeatherInfo(coordinates);
        
       
        
    }
}



async function fetchMyWeatherInfo(coordinates){
    console.log("coordinates",coordinates);
         const {lat,lon} = coordinates;
         console.log(lat,lon);

        locationBox.classList.remove("active");
        loadingpage.classList.add("active");
        // lat=22.088233000000002;
        // lon=79.551533;
        try{
            console.log("fetching data");
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
           
            let data = await response.json();
            
            loadingpage.classList.remove("active");
            
            homeWeatherPage.classList.add("active");
        
            renderWeatherInfo(data);
           
        }

        catch{
            loadingpage.classList.remove("active");
            alert("unable to fetch data");
        }
}

function renderWeatherInfo(weatherinfo){
    
    const cityname = document.querySelector("[cityname]");
    const countryicon = document.querySelector("[country-Icon]");
    const datadesc = document.querySelector("[data-desc]");
    const weathericon = document.querySelector("[weather-icon]");
    const temperature = document.querySelector("[temp]");
    const windspeed = document.querySelector("[wind-speed]");
    const humidity = document.querySelector("[humidity]");
    const cloud = document.querySelector("[cloud]");


    // fetch value from api for weather info and put it in html element
    cityname.innerHTML = weatherinfo?.name;
    // countryicon.src = `https://flagcdn.com/144x188/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    
    countryicon.src = `https://flagcdn.com/192x144/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    datadesc.innerHTML = weatherinfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temperature.innerHTML = weatherinfo?.main?.temp + `${"°C"}`;
    cloud.innerHTML = weatherinfo?.clouds?.all;
    windspeed.innerHTML = weatherinfo?.wind?.speed;
    humidity.innerHTML = weatherinfo?.main?.humidity;


}


// grand access wala button
const button = document.querySelector("[grant-access]");
button.addEventListener("click", getlocation);


// get location wala function

function getlocation(){
    // geolocation api
    // agr geolocation available ho
    if(navigator.geolocation){
        
           navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
   alert("Geolocation is not available");
    }
}

function showposition(position){
    
    const usercoordinates ={
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    }
    

    sessionStorage.setItem("usercoordinates",JSON.stringify("usercoordinates"));
    fetchMyWeatherInfo(usercoordinates);
}




// userinput se fetch

const input = document.querySelector("#data-search-input");
const inputbutton = document.querySelector("#input-button");

// input.addEventListener("submit", (e)=>{
//     e.preventDefault();
// })
inputbutton.addEventListener("click",function (e){
    e.preventDefault();
    let cityname = input.value;
    console.log(cityname);
    if(cityname == ''){
        return;
    }
    else{
        searchWeatherByCity(cityname);
    }
});



// const inputform = document.querySelector("#inputform");
// inputform.addEventListener("submit", (e)=>{
//     e.preventDefault();
//     let cityname = input.value;

//     if(cityname == ''){
//         return;
//     }
//     else{
//         searchWeatherByCity(cityname);
//     }
// })


async function searchWeatherByCity(city){
     loadingpage.classList.add("active");
     homeWeatherPage.classList.remove("active");
     locationBox.classList.remove("active");
     try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data  = await response.json();
        console.log(data);
        locationBox.classList.remove("active");
        loadingpage.classList.remove("active");
        homeWeatherPage.classList.add("active");
        renderWeatherInfo(data);
     }
     catch(e){
        alert("unable to fetch data");
        
     }
}
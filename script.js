// const apikey = "4112440673a248cda1d72538241003";
const apikey = "88ea22abd5c84c0b807152931240704";
const apiUrl = "https://api.weatherapi.com/v1/forecast.json?key=";

const arrayvalue = ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"];

const maincontent = document.getElementById("main-content");
const errorcontent = document.getElementById("error-content");
const waitLoc = document.getElementById("target")

const temp = document.getElementById("temp");
const text = document.getElementById("text");
const icon = document.getElementById("icon");
const currentcity = document.getElementById("currentcity");
const currentdate = document.getElementById("currentdate");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const gust = document.getElementById("gust");
const feel = document.getElementById("feel");
const speed = document.getElementById("speed");

const searchbar = document.getElementById("searchbar");
const searchbtn = document.getElementById("searchbtn");

const hourly_display = document.getElementById("hourly_display");
const multi_forcast = document.getElementById("Multi-forcast");

let isCelsius = true;
const unitToggle = document.getElementById("unitToggle");
const unitLabel = document.getElementById("unitLabel");
let currentTempC = 0;
let feelsLikeC = 0;

// New elements for scrolling
const scrollLeftBtn = document.getElementById("scrollLeftBtn");
const scrollRightBtn = document.getElementById("scrollRightBtn");


async function checkWeather(City){
    try {
        const response = await fetch(apiUrl + apikey + "&q=" + City +"&days=6");
        const data = await response.json();

            waitLoc.style.display="block";
            errorcontent.style.display="none";
            maincontent.style.display="none";


        setTimeout(() => {
            errorcontent.style.display="none";
            waitLoc.style.display="none";
            maincontent.style.display="block";
            if(!data.current){
                errorcontent.style.display="block";
                waitLoc.style.display= "none";
                maincontent.style.display="none";
            }

            temp.innerText=data.current.temp_c + "°c";
            text.innerHTML=data.current.condition.text;
            icon.style.display='block';
            icon.src=data.current.condition.icon;

            const D = new Date();
            currentcity.innerText=data.location.name + ", " + data.location.region + ", " + data.location.country;
            currentdate.innerHTML=data.current.last_updated.split(" ")[0] +  " ," + arrayvalue[D.getDay()] +"<br>"+  " Update At: " +  data.current.last_updated.split(" ")[1] ;

            sunrise.innerText=data.forecast.forecastday[0].astro.sunrise;
            sunset.innerText=data.forecast.forecastday[0].astro.sunset;

            pressure.innerText=data.current.pressure_mb + " hPa";
            humidity.innerText=data.current.humidity + "%"
            visibility.innerText= data.current.vis_km + " KM"
            feel.innerText=data.current.feelslike_c + '°c';
            gust.innerText=data.current.gust_kph + 'Km/hr';
            speed.innerText=data.current.wind_kph + 'Km/hr';

            // Store current temperatures for unit conversion
            currentTempC = data.current.temp_c;
            feelsLikeC = data.current.feelslike_c;
            updateTemperatureDisplay(); // Update display with current unit

            console.log(data);
            hourly_display.innerHTML="";
            var hourly_data = data.forecast.forecastday[0].hour;
            hourly_data.map((data)=>{
                const temporary = document.createElement(`div`);
                temporary.innerHTML=`<div class="contain-hourly-data-child color2 vertical-align">
                <img src="${data.condition.icon}" alt="" height="100" width="100">
                <h2>${data.condition.text}</h2>
                <h2>${data.temp_c} &deg;c</h2>
                <h2 id="date&time">${data.time.split(' ')[1]}</h2>
                <h5>Chance of Rain : <span id="rain">${data.chance_of_rain}</span></h5>
                <h5>Chance of Snow : <span id="snow">${data.chance_of_snow}</span></h5>
                </div>`;
                hourly_display.appendChild(temporary);
            })
            multi_forcast.innerHTML="";
            var multi_data = data.forecast.forecastday;
            multi_data.map((data)=>{
                const temporary = document.createElement(`div`);
                temporary.innerHTML=`<div class="flex justify-content mt-1">
                <p>${
                (window.screen.width>370)?
                data.date.slice(8,10)+'-'+data.date.slice(5,7)+'-'+data.date.slice(0,4):data.date.slice(8,10)+'-'+data.date.slice(5,7)}</p>
                <div class="img-temp flex">
                <p>${(window.screen.width>425 && window.screen.width<1380)?
                    data.day.condition.text:data.day.condition.text.slice(0,15)+'...'
                }</p>
                <img src="${data.day.condition.icon}" alt="abc" width="30" height="30">
                </div>
                </div>`
                multi_forcast.appendChild(temporary);
            })
        }, 1000);

    }catch(err) {
        console.log(err)
    }
}

searchbar.addEventListener("keypress", function (e){
    if (e.key === "Enter"){
        checkWeather(searchbar.value);
        searchbar.value="";
    }
})

searchbtn.addEventListener('click',()=>{
    checkWeather(searchbar.value);
    searchbar.value="";
})

function fetchlocation(){
    checkWeather("Thiruparankundram");
}

checkWeather("madurai");

function updateTemperatureDisplay() {
    if (isCelsius) {
        temp.innerText = `${currentTempC}°C`;
        feel.innerText = `${feelsLikeC}°C`;
        unitLabel.innerText = "C °"; // Updated label for Celsius
    } else {
        const tempF = (currentTempC * 9/5 + 32).toFixed(1);
        const feelF = (feelsLikeC * 9/5 + 32).toFixed(1);
        temp.innerText = `${tempF}°F`;
        feel.innerText = `${feelF}°F`;
        unitLabel.innerText = "F °"; // Updated label for Fahrenheit
    }
}

unitToggle.addEventListener("change", () => {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
});

// Event listeners for scroll buttons
scrollLeftBtn.addEventListener('click', () => {
    hourly_display.scrollBy({
        left: -hourly_display.offsetWidth / 2, // Scroll half the visible width
        behavior: 'smooth'
    });
});

scrollRightBtn.addEventListener('click', () => {
    hourly_display.scrollBy({
        left: hourly_display.offsetWidth / 2, // Scroll half the visible width
        behavior: 'smooth'
    });
});

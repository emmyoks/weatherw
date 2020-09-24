$(document).ready(function(){
    let date = formartDate(new Date())
    
    // time and date formarting
    $(".date").text(date.d)
    $(".time").text(date.t)
    $(".current-year").text(date.y)

    function formartDate(rawdate){
        // let rawdate = rawdate;
        let dateObj = {
            weekDay: rawdate.getDay(),
            month: rawdate.getMonth(),
            day: String(rawdate.getUTCDate()).padStart(2,0),
            year: rawdate.getFullYear(),
            hour: rawdate.getHours(),
            minute: String(rawdate.getMinutes()).padStart(2,0)
        }
        let monthList = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
        let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let date = weekDays[dateObj.weekDay]+" " + dateObj.day +" "+ monthList[dateObj.month] +" "+ dateObj.year;
        let time = function(){
            let hr,m;
            if(dateObj.hour > 12 || dateObj.hour < 1){
               hr= Math.abs(dateObj.hour - 12);
               m = "PM";
               if(dateObj.hour < 1) m = "AM";
            }
             else{
                hr= dateObj.hour;
                m = "AM";
                if(dateObj.hour ===12) m = "PM";
            }
            return hr + ":" + dateObj.minute +" "+ m 
        }()
        return {d:date,t:time,y:dateObj.year}
    }
    const key='23e99d389b359c68610491b7375742b8' ;
    let userCity;
    
   $(".weather-card").ready(()=>{
    navigator.geolocation.getCurrentPosition( pos => {
        let lati = pos.coords.latitude;
        let long = pos.coords.longitude;

        axios.get('https://api.openweathermap.org/data/2.5/weather',{
            params:{lat:lati, lon:long,units:'metric',appid:key}
        })
        .then(res=>{
            setupUi(res)
        })
        .catch(err=> foundErr(err))
    });
   })

    $(document).keypress(e=>{
        if(e.keyCode === 13){
            getW()
        }
    })

    $(".get-w").click(()=>{
       getW()
    })

    function getW(){
        userCity = $(".city").val();
        $(".logo").show()
        getWeather()
    }

    function getWeather(){
        axios.get('https://api.openweathermap.org/data/2.5/weather',{
            params:{q:userCity,units:'metric',appid:key}
        })
        .then(res=>{
            setupUi(res)
        })
        .catch(err=> foundErr(err))

    }

    function setupUi(res){
        $(".error").remove();
        userCity = res.data.name;
        $(".city").val(userCity)
        $(".weather-text").text(`${res.data.weather[0].description}
         in ${userCity}.`);
        $(".weather-icon").html(`<img class="icon"src="https://api.openweathermap.org/img/w/${res.data.weather[0].icon}.png">`);
        $(".temp").html(`${Math.round(res.data.main.temp)}<sub>c</sub> 
        <p>feels like ${res.data.main.feels_like}<sub>c</sub></p>`);
        if(res.data.main.temp >=30 ){
            $(".temp").css("color","#ff5555")
        }
        let sunrise = new Date(Number(res.data.sys.sunrise + '360'));
        let sunset = new Date(Number(res.data.sys.sunset + '360'));
        $(".rise-time").text(`${formartDate(sunrise).t}`);
        $(".set-time").text(`${formartDate(sunset).t}`);
        // more info
        $(".lat").text(res.data.coord.lat);
        $(".lon").text(res.data.coord.lon);
        $(".hum").text(res.data.main.humidity);
        $(".pres").text(res.data.main.pressure);
        $(".seal").text(res.data.main.sea_level);
        $(".grol").text(res.data.main.grnd_level);
        $(".winds").text(res.data.wind.deg);
        $(".windd").text(res.data.wind.speed);

        $(".weather-card").show();
        $(".logo").hide()
    }

    let error;
    function foundErr(err){
        $(".weather-card").hide();
        $(".logo").hide()
        if(error) return;
        error=true;
        let errMsg = "<div style='padding-top:50px;' class='error'><h3 style='color:#ff5555;'>An Error Occured</h3> <p> Make sure you entered a valid city and check your internet connection.</p><p>Reload and try again.</p></div>"
        // $(".weather-card").show();
        $(errMsg).insertAfter(".weather-card");
    }
})

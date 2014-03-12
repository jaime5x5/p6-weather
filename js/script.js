$(document).ready(function () {
    var address = "Spokane, WA"
    showLocation(address, "2497646");
$('#search').submit( function(e) {
        e.preventDefault();
        weatherGeocode('weatherLocation','weatherList');
    });

    function showLocation(address,woeid) {

        $('#weatherReport').empty();

        $('#weatherReport').weatherfeed([woeid],{
            unit: 'f',
            image: true,
            country: false,
            highlow: true,
            wind: true,
            humidity: true,
            visibility: false,
            sunrise: true,
            sunset: true,
            forecast: true,
            link: false,
            woeid: true
        });
    }

    function weatherGeocode(search,weatherList) {

        var status;
        var results;
        var html = '';
        var msg = '';

        // Set document elements
        var search = document.getElementById(search).value;
        var weatherList = document.getElementById(weatherList);
        if (search) {

            document.getElementById("weatherList").innerHTML = '';

            // Cache results for an hour to prevent overuse
            now = new Date();

            // Create Yahoo Weather feed API address
            var query = 'select * from geo.places where text="'+ search +'"';
            var api = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(query) +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json&callback=?';

            // Send request
            $.ajax({
                type: 'GET',
                url: api,
                dataType: 'json',
                success: function(data) {

                    if (data.query.count > 0 ) {                        

                        html = '<span>'+ data.query.count +' location';

                        if (data.query.count > 1) html = html + 's';
                        html = html + ' found:</span><ul>';

                        // List multiple returns
                        if (data.query.count > 1) {
                            for (var i=0; i< 2; i++) {
                                html = html + '<li>'+ _getWeatherAddress(data.query.results.place[i]) +'</li>';
                            }
                        } else {
                            html = html + '<li>'+ _getWeatherAddress(data.query.results.place) +'</li>';
                        }
    
                        html = html + '</ul>';

                        // output.innerHTML = html;
                        document.getElementById("weatherList").innerHTML = html;

                        // Bind callback links
                        $("a.weatherAddress").unbind('click');
                        $("a.weatherAddress").click(function(e) {
                            e.preventDefault();

                            var address = $(this).text();
                            var weoid = $(this).attr('rel');

                            showLocation(address,weoid);
                        }); 

                    } else {
                        document.getElementById("weatherList").innerHTML = 'The location could not be found';
                    }
                },
                error: function(data) {
                    document.getElementById("weatherList").innerHTML = 'An error has occurred';
                }
            });

        } else {

            // No search given
            // var address = "Spokane, WA"
            // showLocation(address, "2497646");
            document.getElementById("weatherList").innerHTML = 'Please enter a location or partial address'; 

        }
        // var address = "Spokane, WA"
        // showLocation(address, "2497646");
    }

    function _getWeatherAddress(data) {

        // Get address
        var address = data.name;
        if (data.admin2) address += ', ' + data.admin2.content;
        if (data.admin1) address += ', ' + data.admin1.content;
        address += ', ' + data.country.content;

        // Get WEOID
        var woeid = data.woeid;

        return '<a class="weatherAddress" href="#" rel="'+ woeid +'" title="Click to see a weather report">'+ address +'</a> <small>('+ woeid +')</small>';
        }

    });
             // $('#weather').weatherfeed(['2497646'],{
             //    unit: 'f',
             //    image: true,
             //    country: false,
             //    highlow: true,
             //    wind: true,
             //    humidity: true,
             //    visibility: false,
             //    sunrise: true,
             //    sunset: true,
             //    forecast: true,
             //    link: false,
             //    woeid: true
             //  });

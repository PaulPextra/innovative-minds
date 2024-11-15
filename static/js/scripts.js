window.onload = function() {
    // Get the login and signup buttons
    var loginBtn = document.getElementById('login-btn');
    var signupBtn = document.getElementById('signup-btn');
    var logoutBtn = document.getElementById('logout-btn');

    // Check if the user is logged in by reading the value from the hidden input
    var isUserLoggedIn = document.getElementById('login-status').value;
    console.log(isUserLoggedIn);
    // If user is logged in (isUserLoggedIn == 'true'), hide login and signup buttons, and show logout button
    if (isUserLoggedIn === 'true') {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';  // Show logout button when logged in
    } else {
        // If user is not logged in (isUserLoggedIn == 'false'), show login and signup buttons, and hide logout button
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';  // Hide logout button when logged out
    }

    // Student-Form Submit Operation
    $('#student-form').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission behavior

        // Create FormData object to handle form data including files
        let formData = new FormData(this);

        $.ajax({
            url: '/portal/students/form',
            type: 'POST',
            data: formData,
            processData: false,  // Prevent jQuery from processing the data
            contentType: false,  // Ensure the correct content type (multipart/form-data)
            success: function(data) {
                if (data.status === "success") {
                    window.location.href = '/application/confirmation';
                } else {
                    console.log(data.message);
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    // Search-Form Submit Operation
    $('#search-form').submit(function(event) {
        event.preventDefault();  // Prevent default form submission
        
        let name = $('#search-name').val();
        let status = $('#search-status').val();
        let gender = $('#search-gender').val();
        let greScore = $('#search-greScore').val();
        
        // Ensure at least one search field is filled
        if (name === '' && status === '' && gender === '' && greScore === '') {
            alert('Please enter at least one search criterion');
            return;
        }
        
        $.ajax({
            url: '/admin/dashboard',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                'name': name,
                'status': status,
                'gender': gender,
                'greScore': greScore
            }),
            contentType: 'application/json; charset=UTF-8',
            success: function(data) {
                if (data) {
                    location.reload()
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    // Change Status Form
    $("select.change-status").change(function() {
        var status = $(this).children("option:selected").val();
        var id = $(this).attr('id')
        
        $.ajax({
            url: '/portal/students/'+ id,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                'status': status
            }),
            contentType: 'application/json, charset=UTF-8',
            success: function(data) {
                if(data) {
                    location.reload()
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
}

// State-City Operation
function populate(state, city) {
    var state = document.getElementById(state);
    var city = document.getElementById(city);

    city.innerHTML = "";
    var cityArray = [];

    if (state.value == "California") {
        var cityArray = [
            "Los Angeles",
            "San Francisco",
            "San Diego",
            "Sacramento",
            "San Jose",
            "Fresno",
            "Oakland",
            "Long Beach",
            "Bakersfield",
            "Anaheim"
        ];
    }
    else if (state.value == "Texas") {
        var cityArray = [
            "Houston",
            "San Antonio",
            "Dallas",
            "Austin",
            "Fort Worth",
            "El Paso",
            "Arlington",
            "Corpus Christi",
            "Plano",
            "Lubbock",
            "Prairie View"
        ];
    }
    else if (state.value == "Florida") {
        var cityArray = [
            "Miami",
            "Orlando",
            "Tampa",
            "Jacksonville",
            "St. Petersburg",
            "Fort Lauderdale",
            "Tallahassee",
            "Gainesville",
            "Sarasota",
            "Pensacola"
        ];
    }
    else if (state.value == "New York") {
        var cityArray = [
            "New York City",
            "Buffalo",
            "Rochester",
            "Yonkers",
            "Syracuse",
            "Albany",
            "New Rochelle",
            "Mount Vernon",
            "Schenectady",
            "Utica"
        ];
    }
    else if (state.value == "Illinois") {
        var cityArray = [
            "Chicago",
            "Aurora",
            "Naperville",
            "Joliet",
            "Rockford",
            "Springfield",
            "Elgin",
            "Peoria",
            "Champaign",
            "Waukegan"
        ];
    }
    else if (state.value == "Pennsylvania") {
        var cityArray = [
            "Philadelphia",
            "Pittsburgh",
            "Allentown",
            "Erie",
            "Reading",
            "Scranton",
            "Lancaster",
            "Bethlehem",
            "Harrisburg",
            "Altoona"
        ];
    }
    else if (state.value == "Ohio") {
        var cityArray = [
            "Columbus",
            "Cleveland",
            "Cincinnati",
            "Toledo",
            "Akron",
            "Dayton",
            "Parma",
            "Canton",
            "Youngstown",
            "Lorain"
        ];
    }
    else if (state.value == "Georgia") {
        var cityArray = [
            "Atlanta",
            "Augusta",
            "Columbus",
            "Macon",
            "Savannah",
            "Athens",
            "Sandy Springs",
            "Roswell",
            "Johns Creek",
            "Albany"
        ];
    }
    else if (state.value == "North Carolina") {
        var cityArray = [
            "Charlotte",
            "Raleigh",
            "Greensboro",
            "Durham",
            "Winston-Salem",
            "Fayetteville",
            "Cary",
            "Wilmington",
            "High Point",
            "Asheville"
        ];
    }
    else if (state.value == "Michigan") {
        var cityArray = [
            "Detroit",
            "Grand Rapids",
            "Warren",
            "Sterling Heights",
            "Ann Arbor",
            "Lansing",
            "Flint",
            "Dearborn",
            "Livonia",
            "Troy"
        ];
    }
    else if (state.value == "New Jersey") {
        var cityArray = [
            "Newark",
            "Jersey City",
            "Paterson",
            "Elizabeth",
            "Edison",
            "Woodbridge",
            "Lakewood",
            "Toms River",
            "Hamilton",
            "Trenton"
        ];
    }
    else if (state.value == "Virginia") {
        var cityArray = [
            "Virginia Beach",
            "Norfolk",
            "Chesapeake",
            "Richmond",
            "Newport News",
            "Alexandria",
            "Hampton",
            "Roanoke",
            "Portsmouth",
            "Suffolk"
        ];
    }
    else if (state.value == "Washington") {
        var cityArray = [
            "Seattle",
            "Spokane",
            "Tacoma",
            "Vancouver",
            "Bellevue",
            "Kent",
            "Everett",
            "Renton",
            "Yakima",
            "Bellingham"
        ];
    }
    else if (state.value == "Arizona") {
        var cityArray = [
            "Phoenix",
            "Tucson",
            "Mesa",
            "Chandler",
            "Scottsdale",
            "Glendale",
            "Gilbert",
            "Tempe",
            "Peoria",
            "Surprise"
        ];
    }
    else if (state.value == "Massachusetts") {
        var cityArray = [
            "Boston",
            "Worcester",
            "Springfield",
            "Cambridge",
            "Lowell",
            "Brockton",
            "New Bedford",
            "Quincy",
            "Lynn",
            "Fall River"
        ];
    }
    else if (state.value == "Tennessee") {
        var cityArray = [
            "Nashville",
            "Memphis",
            "Knoxville",
            "Chattanooga",
            "Clarksville",
            "Murfreesboro",
            "Franklin",
            "Jackson",
            "Johnson City",
            "Bartlett"
        ];
    }
    else if (state.value == "Indiana") {
        var cityArray = [
            "Indianapolis",
            "Fort Wayne",
            "Evansville",
            "South Bend",
            "Carmel",
            "Fishers",
            "Bloomington",
            "Hammond",
            "Gary",
            "Lafayette"
        ];
    }
    else if (state.value == "Missouri") {
        var cityArray = [
            "Kansas City",
            "St. Louis",
            "Springfield",
            "Columbia",
            "Independence",
            "Lee's Summit",
            "O'Fallon",
            "St. Joseph",
            "St. Charles",
            "Blue Springs"
        ];
    }
    else if (state.value == "Maryland") {
        var cityArray = [
            "Baltimore",
            "Frederick",
            "Rockville",
            "Gaithersburg",
            "Bowie",
            "Hagerstown",
            "Annapolis",
            "College Park",
            "Salisbury",
            "Greenbelt"
        ];
    }
    else if (state.value == "Wisconsin") {
        var cityArray = [
            "Milwaukee",
            "Madison",
            "Green Bay",
            "Kenosha",
            "Racine",
            "Appleton",
            "Waukesha",
            "Oshkosh",
            "Eau Claire",
            "Janesville"
        ];
    }                                        
    else if(state.value == "Colorado") {
        var cityArray = [
            "Denver",
            "Colorado Springs",
            "Aurora",
            "Fort Collins",
            "Lakewood",
            "Thornton",
            "Arvada",
            "Westminster",
            "Pueblo",
            "Centennial"
        ];
    }
    else if(state.value == "Minnesota") {
        var cityArray = [
            "Minneapolis",
            "St. Paul",
            "Rochester",
            "Duluth",
            "Bloomington",
            "Brooklyn Park",
            "Plymouth",
            "St. Cloud",
            "Maple Grove",
            "Woodbury"
        ];
    }
    else if(state.value == "South Carolina") {
        var cityArray = [
            "Charleston",
            "Columbia",
            "North Charleston",
            "Mount Pleasant",
            "Rock Hill",
            "Greenville",
            "Summerville",
            "Sumter",
            "Goose Creek",
            "Hilton Head Island"
        ];
    }
    else if(state.value == "Alabama") {
        var cityArray = [
            "Birmingham",
            "Montgomery",
            "Mobile",
            "Huntsville",
            "Tuscaloosa",
            "Hoover",
            "Auburn",
            "Decatur",
            "Dothan",
            "Madison"
        ];
    }
    else if(state.value == "Louisiana") {
        var cityArray = [
            "New Orleans",
            "Baton Rouge",
            "Shreveport",
            "Lafayette",
            "Lake Charles",
            "Kenner",
            "Bossier City",
            "Monroe",
            "Alexandria",
            "Houma"
        ];
    }
    else if(state.value == "Kentucky") {
        var cityArray = [
            "Louisville",
            "Lexington",
            "Bowling Green",
            "Owensboro",
            "Covington",
            "Richmond",
            "Georgetown",
            "Florence",
            "Hopkinsville",
            "Nicholasville"
        ];
    }
    else if(state.value == "Oregon") {
        var cityArray = [
            "Portland",
            "Salem",
            "Eugene",
            "Gresham",
            "Hillsboro",
            "Beaverton",
            "Bend",
            "Medford",
            "Springfield",
            "Corvallis"
        ];
    }
    else if(state.value == "Oklahoma") {
        var cityArray = [
            "Oklahoma City",
            "Tulsa",
            "Norman",
            "Broken Arrow",
            "Lawton",
            "Edmond",
            "Moore",
            "Midwest City",
            "Enid",
            "Stillwater"
        ];
    }
    else if(state.value == "Connecticut") {
        var cityArray = [
            "Bridgeport",
            "New Haven",
            "Stamford",
            "Hartford",
            "Waterbury",
            "Norwalk",
            "Danbury",
            "New Britain",
            "Bristol",
            "Meriden"
        ];
    }
    else if(state.value == "Iowa") {
        var cityArray = [
            "Des Moines",
            "Cedar Rapids",
            "Davenport",
            "Sioux City",
            "Iowa City",
            "Waterloo",
            "Ames",
            "West Des Moines",
            "Council Bluffs",
            "Dubuque"
        ];
    }
    else if(state.value == "Utah") {
        var cityArray = [
            "Salt Lake City",
            "West Valley City",
            "Provo",
            "West Jordan",
            "Orem",
            "Sandy",
            "Ogden",
            "St. George",
            "Layton",
            "Taylorsville"
        ];
    }
    else if(state.value == "Nevada") {
        var cityArray = [
            "Las Vegas",
            "Henderson",
            "Reno",
            "North Las Vegas",
            "Sparks",
            "Carson City",
            "Elko",
            "Mesquite",
            "Boulder City",
            "Fallon"
        ];
    }
    else if(state.value == "Arkansas") {
        var cityArray = [
            "Little Rock",
            "Fort Smith",
            "Fayetteville",
            "Springdale",
            "Jonesboro",
            "Rogers",
            "Conway",
            "North Little Rock",
            "Bentonville",
            "Pine Bluff"
        ];
    }
    else if(state.value == "Mississippi") {
        var cityArray = [
            "Jackson",
            "Gulfport",
            "Southaven",
            "Hattiesburg",
            "Biloxi",
            "Meridian",
            "Tupelo",
            "Olive Branch",
            "Greenville",
            "Horn Lake"
        ];
    }
    else if(state.value == "Kansas") {
        var cityArray = [
            "Wichita",
            "Overland Park",
            "Kansas City",
            "Olathe",
            "Topeka",
            "Lawrence",
            "Shawnee",
            "Manhattan",
            "Lenexa",
            "Salina"
        ];
    }
    else if(state.value == "New Mexico") {
        var cityArray = [
            "Albuquerque",
            "Las Cruces",
            "Rio Rancho",
            "Santa Fe",
            "Roswell",
            "Farmington",
            "Clovis",
            "Hobbs",
            "Carlsbad",
            "Gallup"
        ];
    }
    else if(state.value == "Nebraska") {
        var cityArray = [
            "Omaha",
            "Lincoln",
            "Bellevue",
            "Grand Island",
            "Kearney",
            "Fremont",
            "Hastings",
            "North Platte",
            "Norfolk",
            "Columbus"
        ];
    }
    else if(state.value == "West Virginia") {
        var cityArray = [
            "Charleston",
            "Huntington",
            "Morgantown",
            "Parkersburg",
            "Wheeling",
            "Weirton",
            "Fairmont",
            "Martinsburg",
            "Beckley",
            "Clarksburg"
        ];
    }
    else if(state.value == "Idaho") {
        var cityArray = [
            "Boise",
            "Meridian",
            "Nampa",
            "Idaho Falls",
            "Pocatello",
            "Caldwell",
            "Coeur d'Alene",
            "Twin Falls",
            "Lewiston",
            "Post Falls"
        ];
    }
    else if(state.value == "Hawaii") {
        var cityArray = [
            "Honolulu",
            "Pearl City",
            "Hilo",
            "Kailua",
            "Waipahu",
            "Kaneohe",
            "Mililani Town",
            "Kahului",
            "Ewa Gentry",
            "Kihei"
        ];
    }
    else if(state.value == "Maine") {
        var cityArray = [
            "Portland",
            "Lewiston",
            "Bangor",
            "South Portland",
            "Auburn",
            "Biddeford",
            "Sanford",
            "Saco",
            "Augusta",
            "Westbrook"
        ];
    }
    else if(state.value == "New Hampshire") {
        var cityArray = [
            "Manchester",
            "Nashua",
            "Concord",
            "Derry",
            "Dover",
            "Rochester",
            "Keene",
            "Portsmouth",
            "Laconia",
            "Claremont"
        ];
    }
    else if(state.value == "Montana") {
        var cityArray = [
            "Billings",
            "Missoula",
            "Great Falls",
            "Bozeman",
            "Butte",
            "Helena",
            "Kalispell",
            "Havre",
            "Anaconda",
            "Miles City"
        ];
    }
    else if(state.value == "Rhode Island") {
        var cityArray = [
            "Providence",
            "Warwick",
            "Cranston",
            "Pawtucket",
            "East Providence",
            "Woonsocket",
            "Newport",
            "Central Falls",
            "Westerly",
            "North Kingstown"
        ];
    }
    else if(state.value == "Delaware") {
        var cityArray = [
            "Wilmington",
            "Dover",
            "Newark",
            "Middletown",
            "Smyrna",
            "Milford",
            "Seaford",
            "Georgetown",
            "Elsmere",
            "New Castle"
        ];
    }
    else if(state.value == "South Dakota") {
        var cityArray = [
            "Sioux Falls",
            "Rapid City",
            "Aberdeen",
            "Brookings",
            "Watertown",
            "Mitchell",
            "Yankton",
            "Huron",
            "Vermillion",
            "Pierre"
        ];
    }
    else if(state.value == "North Dakota") {
        var cityArray = [
            "Fargo",
            "Bismarck",
            "Grand Forks",
            "Minot",
            "West Fargo",
            "Williston",
            "Dickinson",
            "Mandan",
            "Jamestown",
            "Wahpeton"
        ];
    }
    else if(state.value == "Alaska") {
        var cityArray = [
            "Anchorage",
            "Juneau",
            "Fairbanks",
            "Wasilla",
            "Sitka",
            "Ketchikan",
            "Kenai",
            "Palmer",
            "Kodiak",
            "Bethel"
        ];
    }
    else if(state.value == "Vermont") {
        var cityArray = [
            "Burlington",
            "South Burlington",
            "Rutland",
            "Barre",
            "Montpelier",
            "Winooski",
            "St. Albans",
            "Newport",
            "Essex Junction",
            "Vergennes"
        ];
    }
    else if(state.value == "Wyoming") {
        var cityArray = [
            "Cheyenne",
            "Casper",
            "Laramie",
            "Gillette",
            "Rock Springs",
            "Sheridan",
            "Green River",
            "Evanston",
            "Riverton",
            "Jackson"
        ];
    }
    
    

    cityArray.forEach(function(cities) {
        var newOption = document.createElement("option");
        newOption.value = cities;
        newOption.innerHTML = cities;
        city.options.add(newOption);
    });
}

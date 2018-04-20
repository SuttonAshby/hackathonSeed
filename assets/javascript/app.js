var app = {
    userID: undefined, //holds current user ID
    currentImg: undefined, //holds current image ID
    rating: undefined, //holds rating of current image 1 is like 0 is dislike
    galleryArr: [111, 116, 155, 161, 201, 204, 226, 244, 265, 283, 299], //the current galleries we are using
    galleryURL: "https://hackathon.philamuseum.org/api/v0/collection/object/location?api_token=2PLQ58sNUwpwizfOqiEuK13NLXcxBjOaMIQ9933Iw4MYWkhEtrsJskEDqmFo&name=",
    imageURL: "https://hackathon.philamuseum.org/api/v0/collection/object?api_token=2PLQ58sNUwpwizfOqiEuK13NLXcxBjOaMIQ9933Iw4MYWkhEtrsJskEDqmFo&query=",
    currentGallery: undefined, //current gallery
    config: {
        apiKey: "AIzaSyAz1ehL5MqmPsNdUJjt3qL2vYHV_YNErM8",
        databaseURL: "https://hackathonseed.firebaseio.com/",
    },
    initialize: function () {

        $("#newUser").on("click", app.newUser) //reloads page
        $(".choice").on("click", app.choice) //like or dislike buttons

        //initializes firebase, connections and disconnect
        firebase.initializeApp(app.config);
        database = firebase.database()

        var connectionsRef = database.ref("/connections")
        var connectedRef = database.ref(".info/connected")

        connectedRef.on("value", function (snap) {
            if (snap.val()) {
                var con = connectionsRef.push(true)
                con.onDisconnect().remove()
            }
        })

        app.newID() //gets new ID
        app.getGallery() //gets first gallery
    },
    newID: function () {
        //generates a random five digit user ID. DOES NOT check if it has been used before
        app.userID = Math.floor(Math.random() * 90000) + 10000;
    },
    getImage: function () {
        //gets new gallery if the current one is used up
        if (app.currentGallery.length === 0) {
            app.getGallery()
        } else {
            app.currentImg = app.currentGallery[0]
            app.currentGallery.shift()
            $.ajax({
                url: app.imageURL + app.currentImg,
                method: "GET"
            }).then(function (response) {
                $("#imgDisplay").attr("src", response.Image)
            })
        }
    },
    getGallery: function () {
        //gets a gallery randomly
        if (app.galleryArr.length > 0) {
            var randNum = Math.floor(Math.random() * app.galleryArr.length)
            var randGallery = app.galleryArr[randNum]
            app.galleryArr.splice(randNum, 1)
            $.ajax({
                url: app.galleryURL + randGallery,
                method: "GET"
            }).then(function (response) {
                console.log("successful call")
                app.currentGallery = response.ObjectIDs
                console.log(app.currentGallery)
                app.getImage()
            })
        } else {
            app.userID = null;
            app.currentImg = null;
            app.rating = null;
            $("#imgDisplay").attr("src", "assets/images/hackSeedTY.png")
        }
    },
    choice: function () {
        //user rating set and pushed to firebase
        if (app.userID !== null) {
            if ($(this).attr("id") === "like") {
                app.rating = 1;
            } else {
                app.rating = 0;
            }
            database.ref("Dataset").push({
                user: app.userID,
                objectID: app.currentImg,
                rating: app.rating
            })
            //gets next image
            app.getImage()
        }

    },
    newUser: function () {
        //reloads page for a new user
        location.reload();
    }
}

app.initialize()
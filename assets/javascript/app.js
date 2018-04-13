var app = {
    userID: undefined,
    currentImg: undefined,
    rating: undefined,
    galleryArr: [111, 116, 155, 161, 201, 204, 226, 244, 265, 283, 299],
    galleryURL: "https://hackathon.philamuseum.org/api/v0/collection/object/location?api_token=2PLQ58sNUwpwizfOqiEuK13NLXcxBjOaMIQ9933Iw4MYWkhEtrsJskEDqmFo&name=",
    imageURL: "https://hackathon.philamuseum.org/api/v0/collection/object?api_token=2PLQ58sNUwpwizfOqiEuK13NLXcxBjOaMIQ9933Iw4MYWkhEtrsJskEDqmFo&query=",
    currentGallery: undefined,
    config: {
        apiKey: "AIzaSyAz1ehL5MqmPsNdUJjt3qL2vYHV_YNErM8",
        databaseURL: "https://hackathonseed.firebaseio.com/",
    },
    initialize: function () {

        $("#newUser").on("click", app.newUser)
        $(".choice").on("click", app.choice)

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

        app.newID()
        console.log(app.userID)
        app.getGallery()
    },
    newID: function () {
        app.userID = Math.floor(Math.random() * 90000) + 10000;
    },
    getImage: function () {

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
    },
    choice: function () {
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

        app.getImage()

    },
    newUser: function () {
        location.reload();
    }
}

app.initialize()
var app = {
    userID: undefined,
    currentImg: undefined,
    rating: undefined,
    galleryArr: [111, 116, 155, 161, 201, 204, 226, 244, 265, 283, 299],
    galleryURL: "https://hackathon.philamuseum.org/api/v0/collection/object/location?api_token=2PLQ58sNUwpwizfOqiEuK13NLXcxBjOaMIQ9933Iw4MYWkhEtrsJskEDqmFo&name=",
    imageURL: "https://hackathon.philamuseum.org/api/v0/collection/object?api_token=2PLQ58sNUwpwizfOqiEuK13NLXcxBjOaMIQ9933Iw4MYWkhEtrsJskEDqmFo&query=",
    currentGallery: undefined,
    initialize: function () {
        app.newID()
        console.log(app.userID)
        app.getGallery()
    },
    newID: function () {
        app.userID = Math.floor(Math.random() * 90000) + 10000;
    },
    getImage: function () {
        app.currentImg = app.currentGallery[0]
        app.currentGallery.shift()
        $.ajax({
            url: app.imageURL + app.currentImg,
            method: "GET"
        }).then(function (response) {
            $("#imgDisplay").attr("src", response.Image)
        })
    },
    getGallery: function () {
        var randGallery = app.galleryArr[Math.floor(Math.random() * app.galleryArr.length)]
        $.ajax({
            url: app.galleryURL + randGallery,
            method: "GET"
        }).then(function (response) {
            console.log("successful call")
            app.currentGallery = response.ObjectIDs
            console.log(app.currentGallery)
            app.getImage()
        })
    }
}

app.initialize()
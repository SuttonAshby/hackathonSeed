var app = {
    userID: undefined,
    currentImg: undefined,
    rating: undefined,
    initialize: function(){

    },
    newID: function(){
        app.UserID = Math.floor(Math.random()*90000) + 10000;
    }
}
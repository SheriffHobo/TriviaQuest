$(function() {

    $(".title-letter").hover(function(){
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var color = "rgb("+r+","+g+","+b+")"
        $(this).css("color", color);
    });

});
var rootRef = firebase.database().ref();
var urlRef = rootRef.child("users");
urlRef.on("value", function(snapshot) {
  $("#usersScoreBoard").html("");
  snapshot.forEach(function(child) {
    var userInfo = child.val();

    var displayName = userInfo.displayName;
    var profileImg = userInfo.profile_picture;
    var userPoints = userInfo.userPoints;
    $("#usersScoreBoard").append(`
    <div class="row ml-1 float-left">
        <div class="col-2 text-center mt-3 mb-1"><img src='${profileImg}' class="rounded-circle playerScores"/></div>
        <div class="col-6 text-center mt-3 mb-1">${displayName}</div>
        <div class="col-4 text-center mt-3 mb-1">${userPoints}</div>
    </div>
    `);
  });
});


  

let isMute = false;
isHardMute = false;
function sayText(myText)
{
    if(!isMute){
        responsiveVoice.speak(myText, "US English Male", {pitch: 2});
    }
    else{
        responsiveVoice.cancel();
        if(responsiveVoice.isPlaying()) {
            responsiveVoice.cancel();
        }
    }
}
function muteVoice(mType){
    if (mType == 'hard'){
        isHardMute = true;
    }
    isMute = true;
    responsiveVoice.cancel();
    console.log('mute');
}
function unMuteVoice(umType){
    if (umType == 'hard'){
        isHardMute = false;
        console.log('Hard unMute');
    }
    isMute = false;
    console.log('Soft unMute');
}
document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }
    var key = event.key || event.keyCode;
    if (key === 'Alt' || key === 18) {
        muteVoice('hard');  
    }
    if (key === 'Shift' || key === 16) {
        unMuteVoice('hard');  
    }
    if (key === 'Enter' || key === 13) {
        console.log("Enter pressed");
        $("#newGameBtn").click();
    }
});
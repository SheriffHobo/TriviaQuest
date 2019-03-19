let correctAnsw=0;
let incorrectAnsw=0;
let unanswered=0;
let qNumber = 0 ;
let timeCounter = 30;
let interval_15 = 0;
let isEndOfGame = false;
let newGameIndex = 0;
let questionArr = [];
let questions_correct_answer = "";
var categoriesArray = [];
$("#newGameBtn").on('click',function(){
    muteVoice('soft');
    $("#newGameBtn").addClass('d-none');
    $("#stopGameBtn").removeClass('d-none');
    $("#thetrivia").removeClass('d-none');
    if(!isHardMute){
        unMuteVoice('soft');
    }
    startGame();
});
$("#stopGameBtn").on('click',function(){
    window.location.reload();
});

function startGame() {
    correctAnsw=0;
    incorrectAnsw=0;
    unanswered=0;
    qNumber = 0 ;
    timeCounter = 30;
    interval_15 = 0;
    isEndOfGame = false;
    newGameIndex = 0;
    questionArr = [];
    questions_correct_answer = "";
    categoriesArray = [];
    //console.log(categoriesArray)

    randomquestionGenerate(Math.floor(Math.random() * 10) + 9, 10);
    fetch("https://opentdb.com/api_category.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var categoriesRaw = data.trivia_categories;
            categoriesArray.push(categoriesRaw);
            categoriesRaw.forEach(function(categoriesList) {
                categoriesArray.push(categoriesList);
            })
        });

    function randomquestionGenerate(id, length) {
        
        var db = "https://opentdb.com/api.php?";
        var query = db + "amount=" + length + "&category=" + id + "&type=multiple";
        var fetchInit = {
            credentials: "same-origin"
        }
    
        fetch(query, fetchInit)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                createQuestions(data.results);
                //console.log(data.results);
            })
    };
function createQuestions(questions) {
            

    function showQ(){
        let qNumberX = questions[qNumber].question;
        //console.log(qNumberX);
        let showQuestionNum = qNumber + 1;
        let sayQuestion = "Question " + showQuestionNum + ": " + qNumberX;

        if(!isHardMute){
            unMuteVoice('soft');
        } 
        sayText(sayQuestion, "US English Male", {pitch: 2});
        $('#questionId').html(sayQuestion);
        $('.radio').show();
        $( "#answ1" ).prop( "checked", false );
        $( "#answ2" ).prop( "checked", false );
        $( "#answ3" ).prop( "checked", false );
        $( "#answ4" ).prop( "checked", false );
        
        questionArr [0] = questions[qNumber].incorrect_answers[0];
        questionArr [1] = questions[qNumber].incorrect_answers[1];
        questionArr [2] = questions[qNumber].incorrect_answers[2];
        questionArr [3] = questions[qNumber].correct_answer;
        questions_correct_answer = questions[qNumber].correct_answer;
        questionArr.sort();

        sayText(questionArr[0], "US English Female", {pitch: 2});
        $('#answ1').get(0).nextSibling.textContent = questionArr[0];

        sayText(questionArr[1], "US English Female", {pitch: 2});
        $('#answ2').get(0).nextSibling.textContent = questionArr[1];

        sayText(questionArr[2], "US English Female", {pitch: 2});
        $('#answ3').get(0).nextSibling.textContent = questionArr[2];

        sayText(questionArr[3], "US English Female", {pitch: 2});
        $('#answ4').get(0).nextSibling.textContent = questionArr[3];

    }
    ////////////////////////////////////////////////////////////////
    //showing topic category
     //console.log("questions");
    $("#topic").html(`Catagory: ${questions[qNumber].category}`);

    function nextQuestion(){

        timeCounter = 30;
        newGameIndex = 0;
        if(qNumber < 10){
            showQ(qNumber);
            qNumber++;
        }else{
            isEndOfGame = true;
            clearInterval(interval_15);
            $("#showTimer").html("");
            $('.radio').hide();

            if(!isHardMute){
                unMuteVoice('soft');
            } 
            sayText("Completed! Let's see the result");

            $('#questionId').html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Completed! Let's see the result");
            sayText("Correct answers: "+ correctAnsw);
            $('#questionId').append('<br><p>The Correct answers: '+ correctAnsw + '</p>');
            sayText("The Incorrect answers: " + incorrectAnsw);
            $('#questionId').append('<p>The Incorrect answers: '+ incorrectAnsw + '</p>');
            sayText("The Unanswered: "+ unanswered);
            $('#questionId').append('<p>The Unanswered: '+ unanswered + '</p><br>');

            let userPointsCalculate = correctAnsw*10 - incorrectAnsw;
            sayText("Your Score: "+ userPointsCalculate);
            
            // send the result to firebase database            
            firebase.auth().onAuthStateChanged((userPointLog) => {
                if (userPointLog) {
                  userId = userPointLog.uid;
                  displayName = userPointLog.displayName;
                  imageUrl = userPointLog.photoURL;

                  function writeUserData(userId, displayName, imageUrl) {
                    firebase.database().ref('users/' + userId).set({
                      displayName: displayName,
                      profile_picture : imageUrl,
                      userPoints: userPointsCalculate
                    });
                  }
                  writeUserData(userId, displayName, imageUrl);
                   // show score board
                        //moved to script.js
                   // end score board
                }
              });
            
            interval_15 = setInterval(function(){
                if(timeCounter>=0){
                    
                    $("#showTimer").html("Be ready for new game in: " + timeCounter + " Seconds");
                    timeCounter --;
                    newGameIndex ++;
                    if(newGameIndex == 16){
                        clearInterval(interval_15);
                        window.location.reload();
                    }
                }
                
            }, 1000);
            
        }
        
        
    }
    function newGame(){
        correctAnsw=0;
        incorrectAnsw=0;
        unanswered=0;
        qNumber = 0 ;
        timeCounter = 30;
        interval_15 = 0;
        isEndOfGame = false; 
        run();
    }
    function run()
    {
        $("#showTimer").html("");
        nextQuestion();
        if(!isEndOfGame)
        {
        //speak
            
            interval_15 = setInterval(function(){
                if(timeCounter>=0){
                    
                    $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                    timeCounter --;
                }
                else{
                    
                    unansweredFunc(qNumber);
                    clearInterval(interval_15);
                }
                
            }, 1000);
        }
    }
    $('input:radio[name="optradio"]').click(
        function(){
            
            muteVoice('soft');
            if(!isHardMute){
                unMuteVoice('soft');
            } 
            clearInterval(interval_15);
            $("#showTimer").html("");
            if ($(this).is(':checked')) {
                if($(this).get(0).nextSibling.textContent == questions_correct_answer) // correct answer is selected
                {
                    correctAnswer();
                    sayText("Correct!");
                }
                else{ // incorrect answer is selected
                    incorrectAnswer();
                    sayText("Incorrect!");
                }
            }
    });
    function correctAnswer(){
        
        $("#showTimer").html("");
        $('.radio').hide();
        correctAnsw++;
        $('#questionId').html("Correct!");
        $('#answ1').get(0).nextSibling.textContent = '';
        $('#answ2').get(0).nextSibling.textContent = '';
        $('#answ3').get(0).nextSibling.textContent = '';
        $('#answ4').get(0).nextSibling.textContent = '';    

        timeCounter = 3;
        let interval3_co = setInterval(function(){
            if(timeCounter>0)
            {
                $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                timeCounter--;
            }
            else{
                clearInterval(interval3_co);
                run();
            }
        }, 1000);
        
    }
    function incorrectAnswer(){
        
        $("#showTimer").html("");
        $('.radio').hide();
        incorrectAnsw++;
        $('#questionId').html("Incorrect!");
        $('#answ1').get(0).nextSibling.textContent = '';
        $('#answ2').get(0).nextSibling.textContent = '';
        $('#answ3').get(0).nextSibling.textContent = '';
        $('#answ4').get(0).nextSibling.textContent = '';   
        timeCounter = 3; 
        let interval3_in = setInterval(function(){
            if(timeCounter>0)
            {
                $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                timeCounter--;
            }
            else{
                clearInterval(interval3_in);
                run();
            }
        }, 1000);
        
    }
    function unansweredFunc(qNumber1){
        $("#showTimer").html("");
        $('.radio').hide();
        unanswered++;
        $('#questionId').html("You did not select and answer.");
        $('#answ1').get(0).nextSibling.textContent = '';
        $('#answ2').get(0).nextSibling.textContent = '';
        $('#answ3').get(0).nextSibling.textContent = '';
        $('#answ4').get(0).nextSibling.textContent = '';    
        timeCounter = 3;
        let interval3_un = setInterval(function(){
            if(timeCounter>0)
            {
                $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                timeCounter--;
            }
            else{
                clearInterval(interval3_un);
                run();
            }
        }, 1000);
        sayText("Not answered!");
    }
    run();
    function radioBtnClick(radioId){
        muteVoice('soft');
        if(!isHardMute){
            unMuteVoice('soft');
        } 
        clearInterval(interval_15);
        $("#showTimer").html("");
        if ($(radioId).is(':checked')) {
            if($(radioId).get(0).nextSibling.textContent == questions_correct_answer) // correct answer is selected
            {
                correctAnswer();
                sayText("Correct!");
            }
            else{ // incorrect answer is selected
                incorrectAnswer();
                sayText("Incorrect!");
            }
        } 
    }  

    var langs =
    [['Afrikaans', ['af-ZA']],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Deutsch', ['de-DE']],
    ['English', ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-US', 'United States']],
    ['Español', ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']],
    ['Euskara', ['eu-ES']],
    ['Français', ['fr-FR']],
    ['Galego', ['gl-ES']],
    ['Hrvatski', ['hr_HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']],
    ['Magyar', ['hu-HU']],
    ['Nederlands', ['nl-NL']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']],
    ['Română', ['ro-RO']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Türkçe', ['tr-TR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['한국어', ['ko-KR']],
    ['中文', ['cmn-Hans-CN', '普通话 (中国大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)']],
    ['日本語', ['ja-JP']],
    ['Lingua latīna', ['la']]];

for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 6;
updateCountry();
select_dialect.selectedIndex = 6;
showInfo('info_start');

function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
        showInfo('info_speak_now');
        start_img.src = 'mic-animate.gif';
    };

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            start_img.src = 'mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'mic.gif';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);

            let userSpeakAnswer = $("#final_span").text();
            console.log("final_span= "  + userSpeakAnswer);
            if (userSpeakAnswer == "One" || userSpeakAnswer == "Number one" || userSpeakAnswer == "1" || userSpeakAnswer == "38") {
                console.log("Number one");
                $("#answ1").click();
                radioBtnClick("#answ1"); 

            } else if (userSpeakAnswer == "Two" || userSpeakAnswer == "Number two" || userSpeakAnswer == "2" || userSpeakAnswer == "39") {
                $("#answ2").click();
                console.log("Number two");
                radioBtnClick("#answ2"); 

            } else if (userSpeakAnswer == "Three" || userSpeakAnswer == "Number three" || userSpeakAnswer == "3" || userSpeakAnswer == "40") {
                console.log("Number three");
                $("#answ3").click();
                radioBtnClick("#answ3");
                

            } if (userSpeakAnswer == "Four" || userSpeakAnswer == "Number for" || userSpeakAnswer == "Number Four" || userSpeakAnswer == "4" || userSpeakAnswer == "37") {
                console.log("Number four");
                $("#answ4").click();
                radioBtnClick("#answ4");
            }
        
        }
        if (create_email) {
            create_email = false;
            createEmail();
        }
    };

    recognition.onresult = function (event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }
    };
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) { return m.toUpperCase(); });
}

function createEmail() {
    var n = final_transcript.indexOf('\n');
    if (n < 0 || n >= 80) {
        n = 40 + final_transcript.substring(40).indexOf(' ');
    }
    var subject = encodeURI(final_transcript.substring(0, n));
    var body = encodeURI(final_transcript.substring(n + 1));
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
}

function copyButton() {
    if (recognizing) {
        recognizing = false;
        recognition.stop();
    }
    copy_button.style.display = 'none';
    copy_info.style.display = 'inline-block';
    showInfo('');
}

function emailButton() {
    if (recognizing) {
        create_email = true;
        recognizing = false;
        recognition.stop();
    } else {
        createEmail();
    }
    email_button.style.display = 'none';
    email_info.style.display = 'inline-block';
    showInfo('');
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'mic-slash.gif';
    showInfo('info_allow');
    showButtons('none');
    start_timestamp = event.timeStamp;
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

var current_style;
function showButtons(style) {
    if (style == current_style) {
        return;
    }
    current_style = style;
    copy_button.style.display = style;
    email_button.style.display = style;
    copy_info.style.display = 'none';
    email_info.style.display = 'none';
}
// get key code
document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === 'Escape' || key === 'Esc' || key === 27) {
        
        startButton(event);
    }
    // Arrow keys
    if (key == "ArrowUp" || key == "38") {
        console.log("Number one");
        $("#answ1").click();
        radioBtnClick("#answ1"); 

    } else if (key == "ArrowRight" || key == "39") {
        $("#answ2").click();
        console.log("Number two");
        radioBtnClick("#answ2"); 

    } else if (key == "ArrowDown" || key == "40") {
        console.log("Number three");
        $("#answ3").click();
        radioBtnClick("#answ3");
        

    } if (key == "ArrowLeft" || key == "37") {
        console.log("Number four");
        $("#answ4").click();
        radioBtnClick("#answ4");
    }

});
// end of speechToText

    }// end of logic
}
(function(){
        // set login and signup btns
        $('#openSignup').on('click',function(){
            $("#loginCloseBtn").click();
        });
        $('#openLoginModal').on('click',function(){
            $("#openModal").click();
        });    
        // get values for Auth
        const loginEmail = document.getElementById("loginInputEmail1");
        const loginPassword = document.getElementById("loginInputPassword1");

        const signupEmail = document.getElementById("signupInputEmail1");
        const signupPassword = document.getElementById("signupInputPassword1");
        const signupDisplayName = document.getElementById("signupDisplayName");

        const btnSignUp = document.getElementById("btnSignUp");
        const btnLogin = document.getElementById("btnLogin");
        const btnSignOut = document.getElementById("emailSignOut");
        const facebookSignOut = document.getElementById("facebookSignOut");
        
        // login event
        btnLogin.addEventListener('click', e => {
            const email = loginEmail.value;
            const pass = loginPassword.value;
            const auth = firebase.auth();
            const promise = auth.signInWithEmailAndPassword(email, pass);
            promise
            .then(function() {
                // Update successful.
                
                var userLogin = firebase.auth().currentUser;
                    $("#userDisplayName").html(userLogin.displayName);
                    $("#playerPic").html(`<img src='https://raw.githubusercontent.com/SheriffHobo/TriviaQuest/master/assets/images/userPic.png' class='imgProfile rounded-circle' id='userChatPic' />`); 
                    btnSignOut.classList.remove('d-none');
                    document.location.reload();
                    $("#signupCloseBtn").click();
                    $("#loginCloseBtn").click();
                   
                }).catch( e => $("#errLoginMessage").text("Try with correct info or Sign Up as new user!"));

        });

        // SignUp event
        btnSignUp.addEventListener('click', e => {
            const userEmail = signupEmail.value;
            const userPass = signupPassword.value;

            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(userEmail, userPass);
            promise
                .then(function(){
                    // Update user's profile
                    const userSignupDisplayName = signupDisplayName.value;
                    // console.log("usdn= "+userSignupDisplayName);

                    var user = firebase.auth().currentUser;
                    user.updateProfile({
                        displayName: userSignupDisplayName
                        }).then(function() {
                        // Update successful.
                            $("#userDisplayName").html(user.displayName);
                            $("#playerPic").html(`<img src='https://raw.githubusercontent.com/SheriffHobo/TriviaQuest/master/assets/images/userPic.png' class='imgProfile rounded-circle' id='userChatPic' />`); 
                            
                            btnSignOut.classList.remove('d-none');
                            document.location.reload();
                            
                        }).catch(function(error) {
                            // console.log(error);
                        });
                })
                .catch(e => $("#errSignUpMessage").text("Something is wrong, Please try again!"));
            
        });
        // Sign out event
        btnSignOut.addEventListener('click', e => {
            firebase.auth().signOut();
            // console.log('logged out');
            btnSignOut.classList.add('d-none');

        });
        
        // Login by FaceBook  /////////////////////////////////////////
    $("#fbLoginFunc").on('click',function(){
        // console.log("123");
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // $("#playerPic").html("<img src='" + user.photoURL + "' class='imgProfile rounded-circle' id='userChatPic' />");
            $("#playerPic").html(`<img src='${user.photoURL}' class='imgProfile rounded-circle' /> `); 
            $("#userDisplayName").html(user.displayName);
            facebookSignOut.classList.remove('d-none');
            btnSignOut.classList.add('d-none');

            $("#signupCloseBtn").click();
            $("#loginCloseBtn").click();
            console.log(user);
            document.location.reload();
            
          }).catch(function(error) {
            facebookSignOut.classList.add('d-none');
            btnSignOut.classList.add('d-none');
            // Handle Errors here.
            var errorCode = error.code;
            // console.log(errorCode);
            var errorMessage = error.message;
            // console.log(errorMessage);
            // The email of the user's account used.
            var email = error.email;
            // console.log("The email of the user's account used" + email);
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // console.log(credential);
            // ...
          });
    });
    $("#facebookSignOut").on('click',function(){
          firebase.auth().signOut().then(function() {
            // Sign-out successful.
            $("#playerPic").html("");
            $("#userDisplayName").html("");
            facebookSignOut.classList.add('d-none');
            btnSignOut.classList.add('d-none');
          }).catch(function(error) {
            // An error happened.
          });
    });

    // Add realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            // introducing speech
            sayText(`Welcome to TriviaQuest! You have 30 Seconds for each question to answer. and there is 3 seconds between each question.
        You can disable voice with pressing Alt, or enable it with pressing Shift on your keyboard. 
        To answer the question you can use arrow keys, up for 1, right for 2, bottm for 3 and left for four. 
        Also you can talk to computer by pressing Escape key, and send the answer by pressing Escape key again. To start a new game press Enter!`);

            // close the modals
            $("#signupCloseBtn").click();
            $("#loginCloseBtn").click();
            $("#userDisplayName").html(firebaseUser.displayName);
            $("#playerPic").html(`<img src='https://raw.githubusercontent.com/SheriffHobo/TriviaQuest/master/assets/images/userPic.png' class='imgProfile rounded-circle' id='userChatPic' />`); 
            // current user score
            userId = firebaseUser.uid;
            console.log("userId is = "+userId);
            firebase.database().ref('/users/' + userId).on("value", function(snapshot){
                var currentUserInfo = "";
                snapshot.forEach(function(child) {
                    currentUserInfo = child.val();
                });
                $("#userScore").html(`<span class="align-middle">Your Score: ${currentUserInfo}</span>`);
            });
            ////////////// 

            //console.log(firebaseUser.photoURL);
            if(firebaseUser.photoURL != null){
                btnSignOut.classList.add('d-none');
                facebookSignOut.classList.remove('d-none');
                $("#playerPic").html(`<img src='${firebaseUser.photoURL}' class='imgProfile rounded-circle'/>&nbsp;&nbsp;${firebaseUser.displayName}`).attr('value', `${firebaseUser.displayName}`);
            }
            else{
                // console.log("logged in already by email");
                btnSignOut.classList.remove('d-none');
                facebookSignOut.classList.add('d-none');
                
            }
            // show score board
                    //moved to script.js
                // end score board
        }
        else
        {
            $("#userDisplayName").html("");
            $("#playerPic").html("");
            btnSignOut.classList.add('d-none');
            facebookSignOut.classList.add('d-none');
            $("#openModal").click();
            console.log('not logged in yet');
            responsiveVoice.cancel();
            $("#thetrivia").html("");
        }

    });
    

}());

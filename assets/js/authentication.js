// DECALRING GLOBAL VARIABLE
var currentUserKey = '';


// LOG IN
function SignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}

// AFTER LOG IN AUTHENTICATION
function onFirebaseStateChanged() {
    firebase.auth().onAuthStateChanged(onStateChanged);
}

// AFTER LOG IN WORK DOING
function onStateChanged(user) {
    if (user) {

        // PUTTING USER DATA IN DB
        var userProfile = { email: '', name: '', photo: '' };
        userProfile.email = firebase.auth().currentUser.email;
        userProfile.name = firebase.auth().currentUser.displayName;
        userProfile.photo = firebase.auth().currentUser.photoURL;

        var db = firebase.database().ref('users');
        var flag = false;

        db.on('value', function(users) {
            users.forEach(function(data) {
                var user = data.val();
                if (user.email === userProfile.email) {
                    currentUserKey = data.key;
                    flag = true;
                }
            });
            if (flag === false) {
                firebase.database().ref('users').push(userProfile, callback);
            } else {
                return false;
            }
        });



        document.getElementById("login-page-id-of-app").style.display = "none";
        document.getElementById("main-content-of-messenger-app").style.display = "block";
        document.getElementById("header-image-of-main-page").src = firebase.auth().currentUser.photoURL;
        document.getElementById("header-image-of-main-page").alt = firebase.auth().currentUser.displayName;
        document.getElementById("header-image-of-registered-user-section").src = firebase.auth().currentUser.photoURL;
        document.getElementById("header-image-of-registered-user-section").alt = firebase.auth().currentUser.displayName;
        LoadChatList();
    } else {
        document.getElementById("login-page-id-of-app").style.display = "block";
        document.getElementById("main-content-of-messenger-app").style.display = "none";
        document.getElementById("header-image-of-main-page").src = "";
        document.getElementById("header-image-of-main-page").alt = "";
        document.getElementById("header-image-of-registered-user-section").src = "";
        document.getElementById("header-image-of-registered-user-section").alt = "";
    }
}

// Sign Out
function SignOut() {
    document.getElementById("login-page-id-of-app").style.display = "block";
    document.getElementById("main-content-of-messenger-app").style.display = "none";
    document.getElementById("all-users-registered-in-our-messenger").style.display = "none";
    firebase.auth().signOut();
}


// Callback ERROS
function callback(error) {
    if (error) {
        console.log(error);
    } else {
        console.log("User Added To Database Successfully.");
    }
}


// CALLING ACTION
onFirebaseStateChanged();
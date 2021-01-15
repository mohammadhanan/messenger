function Users() {
    document.getElementById("main-page-of-our-messenger").style.display = "none";
    document.getElementById("chat-section-of-app-in-messenger").style.display = "none";
    document.getElementById("all-users-registered-in-our-messenger").style.display = "block";
    document.getElementById("id-of-friends-list-in-messenger-2").innerHTML = "";
    PopulateAllUsersFoundedInDatabase();
}


function PopulateAllUsersFoundedInDatabase() {
    var db = firebase.database().ref('users');
    var lst = '';

    db.on('value', function(users) {
        users.forEach(function(data) {
            var user = data.val();
            if (user.email === firebase.auth().currentUser.email) {} else {
                lst += `<li style="margin-left: 0.5rem;">
                <div class="list-contents">
                    <div class="name-with-image">
                        <div>
                            <img src="${user.photo}" alt="${user.name}">
                        </div>
                        <div>
                            <small>${user.name}</small>
                        </div>
                    </div>
                    <div class="icon-of-chat-in-user" onclick="StartChat('${data.key}', '${user.name}','${user.photo}')">
                        <i class='bx bx-message-rounded'></i>
                    </div>
                </div>
            </li>`;
            }
        });
        document.getElementById("id-of-friends-list-in-messenger-2").innerHTML += lst;
    });

}
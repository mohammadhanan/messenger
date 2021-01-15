var chatKey = '';
var li_data = '';
var friends_lists = {};
var user_name_chat = "";

// WITH REGISTERED USERS
function StartChat(key, name, photo) {

    var friendList = { friendID: key, userID: currentUserKey };

    var db = firebase.database().ref('connection_list');
    var flag = false;
    db.on("value", function(connections) {
        connections.forEach(function(data) {
            var user = data.val();
            if ((user.friendID === friendList.friendID && user.userID === friendList.userID) || (user.userID === friendList.friendID && user.friendID === friendList.userID)) {
                flag = true;
                chatKey = data.key;
            }

        });

        if (flag === false) {
            chatKey = firebase.database().ref('connection_list').push(friendList, function(error) {
                if (error) {

                } else {
                    document.getElementById("all-users-registered-in-our-messenger").style.display = "none";
                    document.getElementById('chat-section-of-app-in-messenger').style.display = "block";
                    ShowResults(key, name, photo);
                }
            }).getKey();
        } else {
            document.getElementById("all-users-registered-in-our-messenger").style.display = "none";
            document.getElementById('chat-section-of-app-in-messenger').style.display = "block";
            ShowResults(key, name, photo);
        }
        document.getElementById('chat').innerHTML = "";
        // Displaying Previous Messages
        LoadPreviousMessages(chatKey);

    });
}

// WITH MAIN PAGE
function StartChat_2(key, name, photo) {

    var friendList = { friendID: key, userID: currentUserKey };

    var db = firebase.database().ref('connection_list');
    var flag = false;
    db.on("value", function(connections) {
        connections.forEach(function(data) {
            var user = data.val();
            if ((user.friendID === friendList.friendID && user.userID === friendList.userID) || (user.userID === friendList.friendID && user.friendID === friendList.userID)) {
                flag = true;
                chatKey = data.key;
            }

        });

        if (flag === false) {
            chatKey = firebase.database().ref('connection_list').push(friendList, function(error) {
                if (error) {

                } else {
                    document.getElementById("main-page-of-our-messenger").style.display = "none";
                    document.getElementById("all-users-registered-in-our-messenger").style.display = "none";
                    document.getElementById('chat-section-of-app-in-messenger').style.display = "block";
                    ShowResults(key, name, photo);
                }
            }).getKey();
        } else {
            document.getElementById("main-page-of-our-messenger").style.display = "none";
            document.getElementById("all-users-registered-in-our-messenger").style.display = "none";
            document.getElementById('chat-section-of-app-in-messenger').style.display = "block";
            ShowResults(key, name, photo);
        }
        document.getElementById('chat').innerHTML = "";
        // Displaying Previous Messages
        LoadPreviousMessages(chatKey);
    });
}

function ShowResults(key, name, photo) {
    document.getElementById("chat-with-user-name-of-messenger").textContent = name;
    document.getElementById("chat-with-user-image-of-messenger").src = photo;
    document.getElementById("chat-with-user-image-of-messenger").alt = name;
}

// CHATTING START HERE
document.getElementById("message-send-box-messenger").addEventListener("keydown", function(key) {
    if (key.which == 13) {
        var TEXT = document.getElementById('message-send-box-messenger').value;
        var DATE = new Date().toLocaleString();
        var chatMessage = {
            userID: currentUserKey,
            msg: TEXT,
            datetime: DATE
        }
        if (TEXT === "") {
            return false;
        } else {
            firebase.database().ref("ChatMessage").child(chatKey).push(chatMessage, function(error) {});
        }
    } else {
        return false;
    }
});




// Loading Recent ChatList
function LoadChatList() {
    var db = firebase.database().ref('connection_list');
    db.on('value', function(lists) {
        document.getElementById("list-of-users-with-friends").innerHTML = "";
        lists.forEach(function(data) {
            var lst = data.val();
            var friendKey = '';
            if (lst.friendID === currentUserKey) {
                friendKey = lst.userID;
            } else if (lst.userID === currentUserKey) {
                friendKey = lst.friendID;
            } else {}

            if (friendKey !== "") {
                firebase.database().ref('users').child(friendKey).on('value', function(data) {
                    var user = data.val();
                    friends_lists[data.key] = [data.key, user.name, user.photo]
                });
            }
        });
        for (var key in friends_lists) {
            li_data += `<li>
                <div class="list-contents">
                    <div class="name-with-image">
                        <div>
                            <img src="${friends_lists[key][2]}" alt="${friends_lists[key][1]}">
                        </div>
                        <div class="user-front-page-details-main">
                            <small>${friends_lists[key][1]}</small>
                            <span style="font-size: 11px; padding-left: 10px; color: gray;">Last Message</span>
                        </div>
                    </div>
                    <div class="icon-of-chat-in-user" onclick="StartChat_2('${friends_lists[key][0]}', '${friends_lists[key][1]}','${friends_lists[key][2]}');">
                        <i class='bx bx-message-rounded'></i>
                    </div>
                </div>
            </li>`;
        }
        document.getElementById("list-of-users-with-friends").innerHTML += li_data;

    });
}

// Loading Previous Messages
function LoadPreviousMessages(ChatKey) {
    var db = firebase.database().ref('ChatMessage').child(ChatKey);
    db.on('value', function(chats) {
        var message = '';
        chats.forEach(function(data) {
            var chat = data.val();
            firebase.database().ref('users').child(chat.userID).on('value', function(user_data) {
                var user = user_data.val();
                user_name_chat = user.name;
            })
            if (chat.userID !== currentUserKey) {
                message += `<li class="you">
                <div class="entete">
                    <span class="status green"></span>
                    <h2>${user_name_chat}</h2>
                    <h3>${chat.datetime}</h3>
                </div>
                <div class="message">
                ${chat.msg}
                </div>
            </li>`;
            } else {
                message += `<li class="me">
                    <div class="entete">
                        <h3>${chat.datetime}</h3>
                        <h2>${firebase.auth().currentUser.displayName}</h2>
                            <span class="status blue"></span>
                        </div>
                        <div class="message">
                        ${chat.msg}
                    </div>
                </li>`;
            }
        });
        document.getElementById('chat').innerHTML = message;
        document.getElementById('message-send-box-messenger').value = '';
        document.getElementById('message-send-box-messenger').focus();
        document.getElementById("chat").scrollTo(0, document.getElementById("chat").clientHeight);
    });
}
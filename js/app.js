if (!localStorage.getItem("user")) {
    window.location.href = "./login.html"
}

const ownAvatar = document.getElementById("ownAvatar")
const circleAvatar = document.getElementById("circleAvatar")
const chatUserAvatar = document.getElementById("chatUserAvatar")
const chatUserName = document.getElementById("chatUserName")
const centerUserName = document.getElementById("centerUserName")
const userInfoName = document.getElementById("userInfoName")
const userInfoBottomName = document.getElementById("userInfoBottomName")
const userTel = document.getElementById("userTel")
const logoutBtn = document.getElementById("logoutBtn")
const loggedInUser = JSON.parse(localStorage.getItem("user"))
const userId = loggedInUser.id
fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users/${userId}`)
  .then((res) => res.json())
  .then((user) => {
    if (user.avatar) {
      ownAvatar.src = user.avatar;
      userInfoName.textContent = user.username;
      userInfoBottomName.innerHTML = `@${user?.username}`;
      userTel.textContent = user.phoneNum;
    }
  })
  .catch((err) => {
    console.error(err);
  });

const sidebarUsers = document.getElementById("sidebarUsers")
const chatBox = document.getElementById("chatBox")

fetch("https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users")
  .then((res) => res.json())
  .then((res) => {
    res.forEach((value) => {
      if (value.id === userId) {
        return;
      }

      let leftUserDiv = document.createElement("div");
      leftUserDiv.classList.add("leftUserDiv");
      leftUserDiv.id = value.id;
      leftUserDiv.innerHTML = `
                <div class="flex flex-no-wrap items-center pr-3 rounded-lg cursor-pointer mt-200 bg-[#172e46] py-65 "
                    style="padding-top: 0.65rem; padding-bottom: 0.65rem">
                    <div class="flex justify-between w-full">
                        <div class="flex justify-between w-full">
                            <div class="relative flex items-center justify-center w-12 h-12 ml-2 mr-3 rounded-full">
                                <!-- User's avatar -->
                                <img class="object-cover w-12 h-12 rounded-full" src="${value?.avatar}" alt=""/>
                                <div class="absolute bottom-0 right-0 flex items-center justify-center bg-white rounded-full"
                                    style="width: 0.80rem; height: 0.80rem">
                                    <div class="bg-green-500 rounded-full w-[0.6rem] h-[0.6rem]"></div>
                                </div>
                            </div>
                            <div class="items-center flex justify-between flex-1">
                                <div class="flex flex-col gap-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <!-- Username -->
                                        <h2 class="text-sm font-semibold text-white" id="chatUserName">${value?.username}</h2>
                                    </div>
                                    <div class="flex text-[#cfcfcf] justify-between text-sm leading-none truncate">
                                        <span>Send message</span>
                                    </div>
                                </div>
                                <i class='bx bx-check-double text-[20px] text-white'></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      sidebarUsers.append(leftUserDiv);
    });

    const leftUserBox = document.querySelectorAll(".leftUserDiv");
    leftUserBox.forEach((userDiv) => {
      userDiv.addEventListener("click", (e) => {
        const clickedUserId = e.currentTarget.id;
        const clickedUser = res.find((user) => user.id === clickedUserId);

        // new chat -----
        let newChatDiv = document.createElement("div");
        newChatDiv.classList.add("newChatDiv");

        newChatDiv.innerHTML = `
                        <!-- Center top -->
                          
                        <div class="z-20 relative flex justify-between items-center w-full p-3 bg-[#17212b] border-b border-[#00000065]">

                            <div class="flex justify-start items-center gap-[10px]">
                                <!-- User avatar -->
                                <div class="w-[40px] h-[40px] overflow-hidden rounded-full cursor-pointer">
                                    <img id="circleAvatar" src="${clickedUser?.avatar}" alt=""/>
                                </div>
                                <!-- User name -->
                                <div class="flex flex-col justify-center flex-1 overflow-hidden cursor-pointer">
                                    <h1 class="overflow-hidden text-base font-medium leading-tight text-white whitespace-no-wrap">
                                        ${clickedUser?.username}
                                    </h1>
                              
                                </div>
                            </div>

                            <div class="flex justify-center items-center gap-[20px]">
                                <i class="bx bx-search text-[20px] text-white cursor-pointer"></i>
                                <i class='bx bx-dots-vertical-rounded text-[20px] text-white cursor-pointer'></i>
                            </div>
                        </div>

                        <!-- Messages -->
                        <div id="messageBox" class="bg-[#0e1621] h-full flex relative flex-col overflow-x-hidden overflow-y-scroll pb-[100px]"></div>

                        <!-- Text input -->
                        <form id="messageForm" class="absolute bg-[#17212b] bottom-0 bg-gray-200x flex items-center w-full p-2">
                            <input id="messageText" type="text" required class="w-full py-2 px-[10px] pr-[50px] text-sm bg-transparent placeholder-gray-500 text-white" style="border-radius: 25px" placeholder="Write a message...">
                            <span class="absolute inset-y-0 right-0 flex items-center pr-6">
                                <button type="submit" class="text-[#2b5278]">
                                    <i class='bx bxs-send text-[25px]'></i>
                                </button>
                            </span>
                        </form>
                    `;

        chatBox.innerHTML = "";
        chatBox.append(newChatDiv);

        const messageForm = document.getElementById("messageForm");
        const messageText = document.getElementById("messageText");
        const typing = document.getElementById("typing");

        let typingTimeout;
        messageText.addEventListener("keyup", () => {
          typing.textContent = "typing...";
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
            typing.textContent = "online";
          }, 1000);
        });

        // Send new message
        messageForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const currentTime = new Date();
          const newMessage = {
            message: messageText.value.trim(),
            time: currentTime,
            senderId: userId,
            receiverId: clickedUserId,
          };

          fetch("https://676b9e09bc36a202bb851c2c.mockapi.io/n17/message", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
          })
            .then((res) => res.json())
            .then(() => {
              messageText.value = "";
              showMessages();
            })
            .catch((err) => console.log(err));
        });

        const messageBox = document.getElementById("messageBox");
        let lastMessageId = 0;

        function showMessages() {
          fetch("https://676b9e09bc36a202bb851c2c.mockapi.io/n17/message")
            .then((res) => res.json())
            .then((messages) => {
              const filteredMessages = messages.filter(
                (e) =>
                  (e.senderId == userId && e.receiverId == clickedUserId) ||
                  (e.senderId == clickedUserId && e.receiverId == userId)
              );

              filteredMessages.forEach((value) => {
                if (value.id > lastMessageId) {
                  const messageTimeFormat = new Date(
                    value.time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23",
                  });

                  let messageP = document.createElement("p");
                  if (value.senderId == clickedUserId) {
                    messageP.classList.add("otherMessage");
                    messageP.id = value.id;
                  } else {
                    messageP.classList.add("ownMessage");
                    messageP.id = value.id;
                  }
                  messageP.innerHTML = `
                                            ${value.message}
                                            <span class="${
                                              value.senderId == clickedUserId
                                                ? "ownMessageTime"
                                                : "otherMessageTime"
                                            }">${messageTimeFormat}</span>
                                        `;
                  messageBox.appendChild(messageP);


                
                }
              });
            });
        }

      });
    });
  });

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user")
    location.reload()
})

// edit profile info

const editForm = document.getElementById("editForm")
const editAvatarImg = document.getElementById("editAvatarImg")
const editAvatarCurrentImg = document.getElementById("editAvatarCurrentImg")
const editName = document.getElementById("editName")
const editPhone = document.getElementById("editPhone")
const editPassword = document.getElementById("editPassword")

const editPencil = document.getElementById("editBtn")
const editFormDisplay = document.getElementById("editFormDisplay")
const closeEditForm = document.querySelectorAll(".closeEditBtn")

editPencil.addEventListener("click", () => {
    editFormDisplay.style.display = "flex"

    fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users/${userId}`)
      .then((res) => res.json())
      .then((res) => {
        editAvatarCurrentImg.src = res.avatar;
        editName.value = res.username;
        editPhone.value = res.phoneNum;
        editPassword.value = res.password;
      })
      .catch((err) => console.log(err));
})

// change src immediately
editAvatarImg.addEventListener("change", () => {
    const file = editAvatarImg.files[0]
    const reader = new FileReader()
    reader.onload = function (event) {
        editAvatarCurrentImg.src = event.target.result
    }
    reader.readAsDataURL(file)
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const file = editAvatarImg.files[0]
    let avatarUrl = editAvatarCurrentImg.src

    if (file) {
        const reader = new FileReader()
        reader.onload = function (event) {
            avatarUrl = event.target.result
            updateUser(avatarUrl)
        }
        reader.readAsDataURL(file)
    } else {
        updateUser(avatarUrl)
    }
})

function updateUser(avatar) {
    fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatar,
        username: editName.value.trim(),
        password: editPassword.value.trim(),
        phoneNum: editPhone.value.trim(),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        editAvatarCurrentImg.src = avatar;
        location.reload();
      })
      .catch((err) => console.log(err));
}

closeEditForm.forEach((el) => {
    el.addEventListener("click", () => {
        editFormDisplay.style.display = "none"
    })
})

// delete avatar img
const showAvatarImg = document.getElementById("showAvatarImg")
const currentAvatarImg = document.getElementById("currentAvatarImg")
const avatarImgDiv = document.getElementById("avatarImgDiv")
const closeAvatarImgDiv = document.getElementById("closeAvatarImgDiv")
const deleteAvatarImgBtn = document.getElementById("deleteAvatarImgBtn")

showAvatarImg.addEventListener("click", () => {
    avatarImgDiv.style.display = "flex"
    fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users/${userId}`)
      .then((res) => res.json())
      .then((res) => {
        currentAvatarImg.src = res.avatar;
      })
      .catch((err) => console.log(err));
})

closeAvatarImgDiv.addEventListener("click", () => {
    avatarImgDiv.style.display = "none"
})

deleteAvatarImgBtn.addEventListener("click", () => {
    const defaultAvatarUrl =
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"

    fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: defaultAvatarUrl,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.avatar === defaultAvatarUrl) {
          alert("Avatar successfully deleted");
          currentAvatarImg.src = defaultAvatarUrl;
          location.reload();
        }
      })
      .catch((err) => console.log(err));
})

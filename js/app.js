// Redirect to login if user is not logged in
if (!localStorage.getItem("user")) {
  window.location.href = "./login.html";
}

const ownAvatar = document.getElementById("ownAvatar");
const circleAvatar = document.getElementById("circleAvatar");
const chatUserAvatar = document.getElementById("chatUserAvatar");
const chatUserName = document.getElementById("chatUserName");
const centerUserName = document.getElementById("centerUserName");
const userInfoName = document.getElementById("userInfoName");
const userInfoBottomName = document.getElementById("userInfoBottomName");
const userTel = document.getElementById("userTel");
const logoutBtn = document.getElementById("logoutBtn");
const loggedInUser = JSON.parse(localStorage.getItem("user"));
const userId = loggedInUser.id;

// Get user data
fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users/${userId}`)
  .then((res) => res.json())
  .then((user) => {
    if (user.avatar) {
      ownAvatar.src = user.avatar;
      userInfoName.textContent = user.username;
      userInfoBottomName.innerHTML = `@${user.username}`;
      userTel.textContent = user.phoneNum;
    }
  })
  .catch((err) => console.error(err));

// Sidebar users list
const sidebarUsers = document.getElementById("sidebarUsers");
const chatBox = document.getElementById("chatBox");

function showUsersSidebar(value) {
  let leftUserDiv = document.createElement("div");
  leftUserDiv.classList.add("leftUserDiv");
  leftUserDiv.id = value.id;

  leftUserDiv.innerHTML = `
        <div class="flex flex-no-wrap items-center pr-3 rounded-lg cursor-pointer mt-200 bg-[#172e46] py-65"
          style="padding-top: 0.65rem; padding-bottom: 0.65rem">
          <div class="flex justify-between w-full">
            <div class="flex justify-between w-full">
              <div class="relative flex items-center justify-center w-12 h-12 ml-2 mr-3 rounded-full">
                <img class="object-cover w-12 h-12 rounded-full" src="${value?.avatar}" alt=""/>
                <div class="absolute bottom-0 right-0 flex items-center justify-center bg-white rounded-full"
                  style="width: 0.80rem; height: 0.80rem">
                  <div class="bg-green-500 rounded-full w-[0.6rem] h-[0.6rem]"></div>
                </div>
              </div>
              <div class="items-center flex justify-between flex-1">
                <div class="flex flex-col gap-0">
                  <div class="flex justify-between items-center mb-1">
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
}
function getUser() {
  fetch("https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users")
    .then((res) => res.json())
    .then((res) => {
      res.forEach((value) => {
        if (value.id === userId) return;

        showUsersSidebar(value);
      });

      const leftUserBox = document.querySelectorAll(".leftUserDiv");
      leftUserBox.forEach((userDiv) => {
        console.log(userDiv, "userd");

        userDiv.addEventListener("click", (e) => {
          const clickedUserId = e.currentTarget.id;
          const clickedUser = res.find((user) => user.id === clickedUserId);

          // New chat window
          let newChatDiv = document.createElement("div");
          newChatDiv.classList.add("newChatDiv");

          newChatDiv.innerHTML = `
          <div class="z-20 relative flex justify-between items-center w-full p-3 bg-[#17212b] border-b border-[#00000065]">
            <div class="flex justify-start items-center gap-[10px]">
              <div class="w-[40px] h-[40px] overflow-hidden rounded-full cursor-pointer">
                <img id="circleAvatar" src="${clickedUser?.avatar}" alt=""/>
              </div>
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
          <div id="messageBox" class="bg-[#0e1621] h-full flex relative flex-col overflow-x-hidden overflow-y-scroll pb-[100px]"></div>
          <form id="messageForm" class="absolute bg-[#17212b] bottom-0 bg-gray-200x flex items-center w-full p-2">
            <input id="messageText" type="text" required class="w-full py-2 px-[10px] pr-[50px] text-sm bg-transparent placeholder-gray-500 text-white" style="border-radius: 25px" placeholder="Write a message...">
            <span class="absolute inset-y-0 right-0 flex items-center pr-6">
              <button id="mesFormBtn" type="submit" class="text-[#2b5278]">
                <i class='bx bxs-send text-[25px]'></i>
              </button>
            </span>
          </form>
        `;

          chatBox.innerHTML = "";
          chatBox.append(newChatDiv);

          const messageForm = document.getElementById("messageForm");
          const messageText = document.getElementById("messageText");
          const messageBox = document.getElementById("messageBox");
          const mesFormBtn = document.getElementById("mesFormBtn");

          messageForm.addEventListener("submit", (e) => {
            mesFormBtn.disabled = true;
            setTimeout(() => {
              mesFormBtn.disabled = false;
              messageForm.reset();
            }, 1000);
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
              .catch((err) => console.error(err));
          });

          // Display messages
          function showMessages() {
            fetch("https://676b9e09bc36a202bb851c2c.mockapi.io/n17/message")
              .then((res) => res.json())
              .then((messages) => {
                messageBox.innerHTML = "";
                const filteredMessages = messages.filter(
                  (e) =>
                    (e.senderId === userId && e.receiverId === clickedUserId) ||
                    (e.senderId === clickedUserId && e.receiverId === userId)
                );

                filteredMessages.forEach((value) => {
                  const messageTimeFormat = new Date(
                    value.time
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23",
                  });

                  let messageP = document.createElement("p");
                  if (value.senderId === clickedUserId) {
                    messageP.classList.add("otherMessage");
                    messageP.id = value.id;
                  } else {
                    messageP.classList.add("ownMessage");
                    messageP.id = value.id;
                  }
                  messageP.innerHTML = `
                  ${value.message}
                  <span class="${
                    value.senderId === clickedUserId
                      ? "ownMessageTime"
                      : "otherMessageTime"
                  }">${messageTimeFormat}</span>
                `;

                  // Create Edit and Delete icons
                  const editIcon = document.createElement("i");
                  editIcon.classList.add("bx", "bx-edit", "edit-icon");

                  const deleteIcon = document.createElement("i");
                  deleteIcon.classList.add("bx", "bx-trash", "delete-icon");

                  // Append icons to message
                  messageP.appendChild(editIcon);
                  messageP.appendChild(deleteIcon);

                  messageBox.appendChild(messageP);

                  // Edit icon click handler
                  editIcon.addEventListener("click", () => {
                    const newMessage = prompt(
                      "Xabarni tahrirlash:",
                      value.message
                    );
                    if (newMessage !== null) {
                      // Update message
                      fetch(
                        `https://676b9e09bc36a202bb851c2c.mockapi.io/n17/message/${value.id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ message: newMessage }),
                        }
                      )
                        .then(() => showMessages())
                        .catch((err) => console.error(err));
                    }
                  });

                  // Delete icon click handler
                  deleteIcon.addEventListener("click", () => {
                    if (confirm("Xabar o'chirilsinmi?")) {
                      fetch(
                        `https://676b9e09bc36a202bb851c2c.mockapi.io/n17/message/${value.id}`,
                        {
                          method: "DELETE",
                        }
                      )
                        .then(() => showMessages())
                        .catch((err) => console.error(err));
                    }
                  });
                });
              })
              .catch((err) => console.error(err));
          }

          showMessages();
        });
      });
    });
}

getUser();

//search
function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const searchInput = document.getElementById("searchInput");

const fetchAndFilterUsers = () => {
  console.log("keyup");

  fetch(`https://676b9e09bc36a202bb851c2c.mockapi.io/n17/users`)
    .then((response) => response.json())
    .then((data) => {
      if (searchInput.value == "") {
        sidebarUsers.innerHTML = "";
        getUser();
      } else if (searchInput.value != "") {
        sidebarUsers.innerHTML = "";

        data.forEach((value) => {
          if (
            value.username
              .toLowerCase()
              .includes(searchInput.value.toLowerCase())
          ) {
            showUsersSidebar(value);

          }
        });
      } else {
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
};

searchInput.addEventListener("keyup", fetchAndFilterUsers);

// Logout handler
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  location.reload();
});

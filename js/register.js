const form = document.getElementById("registerForm")
const username = document.getElementById("username")
const password = document.getElementById("password")
const phone = document.getElementById("phone")


// regex phone num
phone.addEventListener("input", () => {
    let input = phone.value.replace(/\D/g, "");

    if (!input.startsWith("998")) {
        input = "998" + input;
    }
    input = input.slice(0, 12);

    let formatted = "+998";
    if (input.length > 3) formatted += `(${input.slice(3, 5)}`;
    if (input.length > 5) formatted += `)-${input.slice(5, 8)}`;
    if (input.length > 8) formatted += `-${input.slice(8, 10)}`;
    if (input.length > 10) formatted += `-${input.slice(10, 12)}`;

    phone.value = formatted;
});



form.addEventListener("submit", (e) => {
    e.preventDefault()

    const userData = {
        username: username.value.trim(),
        password: password.value.trim(),
        phoneNum: phone.value.trim(),
        avatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    }

    fetch("https://6784a0ac1ec630ca33a4f300.mockapi.io/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((res) => res.json())
        .then(() => {
            window.location.href = "./login.html"
        })
        .catch((err) => console.log(err))
})

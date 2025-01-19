const form = document.getElementById("registerForm")
const username = document.getElementById("username")
const password = document.getElementById("password")

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const userName = username.value.trim()
    const pass = password.value.trim()

    fetch("https://6784a0ac1ec630ca33a4f300.mockapi.io/users")
        .then((res) => res.json())
        .then((res) => {
            const user = res.find(
                (e) => e.username == userName && e.password == pass
            )

            if(user) {
                localStorage.setItem("user", JSON.stringify(user))
                window.location.href = "./index.html"
            }else {
                username.style.borderColor = "red"
                password.style.borderColor = "red"
            }
        })
        .catch((err) => console.log(err))
})

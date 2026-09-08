/* Get users */

function getUsers() {
    return JSON.parse(
        localStorage.getItem("users") || "[]"
    );
}


/* Hash password */

async function hashPassword(password) {

    const data = new TextEncoder().encode(password);

    const hash = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


/* Register */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            const username =
                document.getElementById("username").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirm =
                document.getElementById("confirmPassword").value;

            const msg =
                document.getElementById("registerMsg");


            if (!username || !email || !password || !confirm) {
                msg.textContent = "Please fill all fields.";
                return;
            }

            if (password.length < 8 || !/\d/.test(password)) {
                msg.textContent =
                    "Password must be 8+ characters and contain a number.";
                return;
            }

            if (password !== confirm) {
                msg.textContent =
                    "Passwords do not match.";
                return;
            }


            const users = getUsers();

            if (users.some(user =>
                user.username.toLowerCase() === username.toLowerCase() ||
                user.email.toLowerCase() === email.toLowerCase()
            )) {
                msg.textContent =
                    "Username or email already exists.";
                return;
            }


            const passwordHash =
                await hashPassword(password);


            users.push({
                username,
                email,
                passwordHash
            });


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            msg.style.color = "#198754";
            msg.textContent =
                "Registration successful!";


            setTimeout(() => {
                location.href = "index.html";
            }, 1000);
        }
    );
}


/* Login */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            const loginUser =
                document.getElementById("loginUser").value.trim();

            const password =
                document.getElementById("loginPass").value;

            const msg =
                document.getElementById("loginMsg");


            if (!loginUser || !password) {
                msg.textContent =
                    "Please enter all fields.";
                return;
            }


            const hash =
                await hashPassword(password);

            const user =
                getUsers().find(user =>
                    (
                        user.username.toLowerCase() ===
                        loginUser.toLowerCase() ||
                        user.email.toLowerCase() ===
                        loginUser.toLowerCase()
                    ) &&
                    user.passwordHash === hash
                );


            if (!user) {
                msg.textContent =
                    "Invalid username or password.";
                return;
            }


            sessionStorage.setItem(
                "session",
                JSON.stringify({
                    username: user.username,
                    email: user.email
                })
            );


            location.href = "dashboard.html";
        }
    );
}


/* Dashboard protection */

if (document.getElementById("userName")) {

    const session =
        JSON.parse(
            sessionStorage.getItem("session")
        );


    if (!session) {

        location.href = "index.html";

    } else {

        document.getElementById("userName")
            .textContent = session.username;

        document.getElementById("userEmail")
            .textContent = session.email;
    }
}


/* Logout */

const logout =
    document.getElementById("logout");

if (logout) {

    logout.addEventListener("click", function() {

        sessionStorage.removeItem("session");

        location.href = "index.html";

    });
}
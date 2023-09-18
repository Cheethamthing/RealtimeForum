import { setSessionCookie } from "./cookie.js"

const container = document.getElementById("container")
let html = `
		<form id="login-form">
			<div>
				<h1>Login to Forum</h1>
			</div>
			<div class="container">
				<label for="username"><b>Username</b></label>
				<input
					type="text"
					placeholder="Enter Username"
					name="username"
					required
					id="username"
				/>
				<br />
				<p>
					<label for="password"><b>Password</b></label>
					<input
						type="password"
						placeholder="Enter Password"
						name="psw"
						required
						id="password"
					/>
					<br />
					<button type="submit">Login</button>
					<label>
						<input type="checkbox" checked="checked" name="remember" />
						Remember me
					</label>
				</p>
			</div>

			<div class="container" style="background-color: #f1f1f1">
				<button type="button" class="cancelbtn">Cancel</button>
				<span class="psw">
					Forgot
					<a href="#">password?</a>
				</span>
			</div>
		</form>
 `
container.innerHTML = html

const loginForm = document.getElementById("login-form")
loginForm.addEventListener("submit", function (event) {
	event.preventDefault()

	const userName = document.getElementById("username").value
	const password = document.getElementById("password").value

	console.log(userName, password)

	fetch("http://localhost:8080/login", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username: userName,
			password: password,
		}),
	})
		.then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				throw new Error("POST request failed!")
			}
		})
		.then((data) => {
			console.log(data)
			setSessionCookie()
		})
		.catch((error) => {
			console.log(error)
		})
})
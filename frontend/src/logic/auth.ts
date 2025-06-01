let currentUser: string | null = null;

export function initializeAuth() {
	const loginBtn = document.getElementById("loginBtn")!;
	const signupBtn = document.getElementById("signupBtn")!;
	const logoutBtn = document.getElementById("logoutBtn")!;

	loginBtn.addEventListener("click", () => showAuthForm("login"));
	signupBtn.addEventListener("click", () => showAuthForm("signup"));
	logoutBtn.addEventListener("click", () => {
		currentUser = null;
		updateNav();
	});

	updateNav();
}

function updateNav() {
	const userDisplay = document.getElementById("currentUser")!;
	const loginBtn = document.getElementById("loginBtn")!;
	const signupBtn = document.getElementById("signupBtn")!;
	const logoutBtn = document.getElementById("logoutBtn")!;

	if (currentUser) {
		userDisplay.textContent = `👋 Welcome, ${currentUser}`;
		loginBtn.style.display = "none";
		signupBtn.style.display = "none";
		logoutBtn.style.display = "inline-block";
	} else {
		userDisplay.textContent = "Not signed in";
		loginBtn.style.display = "inline-block";
		signupBtn.style.display = "inline-block";
		logoutBtn.style.display = "none";
	}
}

function showAuthForm(mode: "login" | "signup") {
	const modal = document.createElement("div");
	modal.className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50";

	const formBox = document.createElement("div");
	formBox.className = "bg-white rounded-lg p-6 max-w-sm w-full shadow-md text-black";

	const isSignup = mode === "signup";

	const title = document.createElement("h2");
	title.className = "text-xl font-bold mb-4";
	title.textContent = isSignup ? "Signup" : "Login";

	const form = document.createElement("form");
	form.id = "authForm";
	form.className = "space-y-4";

	const usernameInput = document.createElement("input");
	usernameInput.id = "authUsername";
	usernameInput.className = "w-full p-2 border rounded";
	usernameInput.placeholder = "Username";
	usernameInput.type = "text";
	form.appendChild(usernameInput);

	if (isSignup) {
		const emailInput = document.createElement("input");
		emailInput.id = "authEmail";
		emailInput.className = "w-full p-2 border rounded";
		emailInput.placeholder = "Email";
		emailInput.type = "email";
		form.appendChild(emailInput);
	}

	const passwordInput = document.createElement("input");
	passwordInput.id = "authPassword";
	passwordInput.className = "w-full p-2 border rounded";
	passwordInput.placeholder = "Password";
	passwordInput.type = "password";
	form.appendChild(passwordInput);

	if (isSignup) {
		const confirmInput = document.createElement("input");
		confirmInput.id = "authConfirm";
		confirmInput.className = "w-full p-2 border rounded";
		confirmInput.placeholder = "Repeat Password";
		confirmInput.type = "password";
		form.appendChild(confirmInput);
	}

	const errorText = document.createElement("p");
	errorText.id = "authError";
	errorText.className = "text-red-600 text-sm hidden";
	form.appendChild(errorText);

	const buttonsDiv = document.createElement("div");
	buttonsDiv.className = "flex justify-between pt-2";

	const submitBtn = document.createElement("button");
	submitBtn.type = "submit";
	submitBtn.className = "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded";
	submitBtn.textContent = isSignup ? "Signup" : "Login";

	const cancelBtn = document.createElement("button");
	cancelBtn.type = "button";
	cancelBtn.className = "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded";
	cancelBtn.textContent = "Cancel";

	buttonsDiv.appendChild(submitBtn);
	buttonsDiv.appendChild(cancelBtn);
	form.appendChild(buttonsDiv);

	formBox.appendChild(title);
	formBox.appendChild(form);
	modal.appendChild(formBox);
	document.body.appendChild(modal);

	cancelBtn.addEventListener("click", () => modal.remove());

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const username = (document.getElementById("authUsername") as HTMLInputElement).value.trim();
		const password = (document.getElementById("authPassword") as HTMLInputElement).value.trim();
		const email = isSignup
			? (document.getElementById("authEmail") as HTMLInputElement).value.trim()
			: "";
		const confirm = isSignup
			? (document.getElementById("authConfirm") as HTMLInputElement).value.trim()
			: "";

		if (!username || !password || (isSignup && (!email || !confirm))) {
			showError("Please fill in all fields");
			return;
		}
		if (isSignup && password !== confirm) {
			showError("Passwords do not match");
			return;
		}
		if (isSignup && !validateEmail(email)) {
			showError("Invalid email address");
			return;
		}

		const endpoint = isSignup ? "/register" : "/login";
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password, ...(isSignup ? { email } : {}) }),
			});

			const data = await res.json();
			if (!res.ok) {
				showError(data.error || "Authentication failed");
				return;
			}

			currentUser = data.username;
			updateNav();
			modal.remove();
		} catch (err) {
			console.error("Auth request failed:", err);
			showError("Failed to connect to server");
		}
	});

	function showError(msg: string) {
		errorText.textContent = msg;
		errorText.classList.remove("hidden");
	}
}

function validateEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

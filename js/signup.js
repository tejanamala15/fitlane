function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

const signupForm = document.getElementById("signup");

const saveUser = async (user, pwd, name) => {
	await db
		.collection("users")
		.doc(user)
		.set({
			user: user,
			pwd: pwd,
		})
		.then(() => {
			console.log("User ready!");
		});

	await db
		.collection("info")
		.doc(user)
		.set({
			user: user,
			name: name,
		})
		.then(() => {
			console.log("Lista la info!");
		});
};


const findUser = (user, pwd, name, cent) => {
	let flag = cent;
	var newWindow = false;
	const collectionRef = db.collection("users");
	try {
		const response = collectionRef.where("user", "==", user).onSnapshot(async (snapshot) => {
			if (snapshot.docs.length === 0 && flag) {
				saveUser(user, pwd, name);
				flag = false;
				document.getElementById("name").value = "";
				document.getElementById("user").value = "";
				document.getElementById("pwd").value = "";

				
				await new Promise((r) => setTimeout(r, 2000));
				window.location.replace(window.location.href.slice(0, window.location.href.indexOf("signup.html")) + "form.html?user=" + user);
			} else if (snapshot.docs.length > 0 && flag) {
				alert("Email address is already registered. Please log in.");
				flag = false;
			}
		});
	} catch (error) {
		console.log(error);
	}
};

signupForm.addEventListener("click", async (e) => {
	e.preventDefault();
	const name = document.getElementById("name").value;
	const user = document.getElementById("user").value;
	const pwd = document.getElementById("pwd").value;
	if (name != "" && user != "" && pwd != "") {
		if (validateEmail(user)) {
			if (pwd.length < 8) {
				alert("The password must have at least 8 characters.");
			} else {
				findUser(user.toLowerCase(), pwd, name, true);
			}
		} else {
			alert("Please enter a valid email.");
		}
	} else {
		alert("Please fill out required fields.");
	}
});

document.getElementById("pwd").addEventListener("keyup", (e) => {
	if (e.keyCode === 13) {
		event.preventDefault();
		signupForm.click();
	}
});

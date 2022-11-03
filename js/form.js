let url = new URL(window.location.href);


if (user === null) {
	window.location.replace(window.location.href.slice(0, window.location.href.indexOf("form.html")) + "signup.html");
}

const findUsers = async (user, cent) => {
	let flag = cent;
	const collectionRef = db.collection("users");
	try {
		const response = await collectionRef.where("user", "==", user).onSnapshot((snapshot) => {
			if (snapshot.docs.length === 0 && flag) {
				flag = false;
				window.location.replace(window.location.href.slice(0, window.location.href.indexOf("form.html")) + "signup.html");
			}
		});
	} catch (error) {
		console.log(error);
	}
};

const isFilledBirth = (user, cent) => {
	var queryUserBirth = db.collection("info").where("user", "==", user);
	let flag = cent;
	queryUserBirth.get().then((snapshot) => {
		snapshot.forEach((doc) => {
			if (doc.data().birth !== undefined) {
				window.location.replace(window.location.href.slice(0, window.location.href.indexOf("form.html")) + "signup.html");
			}
		});
	});
};

findUsers(user, true);
isFilledBirth(user, true);

const saveForm = document.getElementById("save");

const updateUserInfo = async (user, weight, height, gender, birth) => {
	birth = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate() + 1);
	birth = firebase.firestore.Timestamp.fromDate(birth);

	let date = new Date();
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	await db
		.collection("info")
		.doc(user)
		.update({
			height: height,
			gender: gender,
			birth: birth,
			weights: [
				{
					date: firebase.firestore.Timestamp.fromDate(date),
					weight: weight,
				},
			],
			online: true,
		})
		.then(() => {
			console.log("User data ready!");
		});
};

saveForm.addEventListener("click", async (e) => {
	e.preventDefault();
	var weight = document.getElementById("weight").value;
	var height = document.getElementById("height").value;
	var gender = document.getElementById("gender").value;
	var birth = document.getElementById("birth").value; 
	

	if (weight != "" && height != "" && gender != "n" && birth != "") {
		weight = parseFloat(weight);
		height = parseFloat(height);
		birth = new Date(birth);

		if (birth < new Date()) {
			if (isNaN(weight) || isNaN(height)) {
				alert("Please recheck entered height and weight.");
			} else if (weight < 0 || height < 0) {
				alert("Please recheck entered height and weight.");
			} else if (weight < 25 || weight > 600) {
				alert("Please enter a valid weight.");
			} else if (height < 100 || height > 300) {
				alert("Please enter a valid height.");
			} else {
				
				console.log("You're in!");
				updateUserInfo(user, weight, height, gender, birth);
		
				await new Promise((r) => setTimeout(r, 1000));
	
				window.location.replace(window.location.href.slice(0, window.location.href.indexOf("form.html")) + "dashboard.html?user=" + user);
			}
		} else {
			alert("Please enter a valid date of birth.");
		}
	} else {
		alert("Please fill in required fields.");
	}
});



document.getElementById("go-to-settings").addEventListener("click", (e) => {
	document.getElementById("settings").style.display = "flex";
});



document.getElementById("close-settings").addEventListener("click", (e) => {
	document.getElementById("settings").style.display = "none";
});



document.getElementById("settings").addEventListener("click", (e) => {
	if (!document.getElementById("settings").firstElementChild.contains(e.target)) {
		document.getElementById("close-settings").click();
	}
});


document.getElementById("save-settings").addEventListener("click", async (e) => {

	let newName = nameElement.value,
		newBirth = new Date(birthElement.value),
		newSex = sexElement.value,
		newHeight = parseFloat(heightElement.value),
		oldPass = oldPassElement.value,
		newPass = newPassElement.value,
		newPass2 = newPassElement2.value;

	let validUpdate = 0;
	newBirth.setDate(newBirth.getDate() + 1);

	if (newName !== "") validUpdate++;
	else alert("Please enter a valid name.");

	if (newBirth < new Date()) validUpdate++;
	else alert("Please enter a valid date.");

	if (!isNaN(newHeight) && newHeight > 0) {
		if (newHeight >= 100 && newHeight <= 300) validUpdate++;
		else alert("Please enter a valid height.");
	} else alert("Please enter a valid height.");

	if (validUpdate == 3) {
		await db
			.collection("info")
			.doc(user)
			.update({
				name: newName,
				birth: firebase.firestore.Timestamp.fromDate(newBirth),
				gender: newSex,
				height: newHeight,
			})
			.then(() => {
				if (oldPass.length !== 0 || newPass.length !== 0 || newPass2.length !== 0) {
					changePassword(oldPass, newPass, newPass2);
				} else {
					drawDashboard(email);
					document.getElementById("settings").style.display = "none";
				}
			});
	}
});


const changePassword = async (oldPass, newPass, newPass2) => {
	let query = db.collection("users").where("user", "==", user);

	query.get().then((querySnapshot) => {
		querySnapshot.forEach(async (doc) => {
			if (doc.data().pwd === oldPass) {
				if (newPass === newPass2) {
					if (newPass.length >= 8) {
						await db
							.collection("users")
							.doc(user)
							.update({pwd: newPass})
							.then(() => {
								drawDashboard(email);
								document.getElementById("settings").style.display = "none";
							});
					} else {
						alert("Password must be 8 or more characters.");
					}
				} else {
					alert("Passwords don't match.");
				}
			} else {
				alert("The password you entered is incorrect. Please try again.");
			}
		});
	});
};



const updateWeightDate = (user, dateToFind, newWeight, cent) => {
	var queryFindDate = db.collection("info").where("user", "==", user);
	let flag = cent;
	queryFindDate.get().then((snapshot) => {
		snapshot.forEach(async (doc) => {
			if (flag) {
				let weights = doc.data().weights;

				weights = weights.map((element) => {
					return {
						date: element.date.toDate(),
						weight: element.weight,
					};
				});

				
				let objectDate = weights.find(
					(element) => element.date.getFullYear() === dateToFind.getFullYear() && element.date.getMonth() === dateToFind.getMonth() && element.date.getDate() === dateToFind.getDate() + 1
				);
				let newDate = new Date(dateToFind);
				newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1); 

			

				if (objectDate === undefined) {
					newDate = firebase.firestore.Timestamp.fromDate(newDate);
					await db
						.collection("info")
						.doc(user)
						.update({
							weights: firebase.firestore.FieldValue.arrayUnion({
								date: newDate,
								weight: newWeight,
							}),
						});
				} else {
		
					objectDate.date = firebase.firestore.Timestamp.fromDate(newDate);

					await db
						.collection("info")
						.doc(user)
						.update({
							weights: firebase.firestore.FieldValue.arrayRemove(objectDate),
						});

					await new Promise((r) => setTimeout(r, 1500));

					await db
						.collection("info")
						.doc(user)
						.update({
							weights: firebase.firestore.FieldValue.arrayUnion({
								date: objectDate.date,
								weight: newWeight,
							}),
						});

					await new Promise((r) => setTimeout(r, 1500));
				}
				drawDashboard(email);
				document.getElementById("add-weight").style.display = "none";
				flag = false;
			}
		});
	});
};



document.getElementById("go-to-add-weight").addEventListener("click", (e) => {
	document.getElementById("add-weight").style.display = "flex";
});



document.getElementById("close-add-weight").addEventListener("click", (e) => {
	document.getElementById("add-weight").style.display = "none";
});



document.getElementById("add-weight").addEventListener("click", (e) => {
	if (!document.getElementById("add-weight").firstElementChild.contains(e.target)) {
		document.getElementById("close-add-weight").click();
	}
});



document.getElementById("save-weight").addEventListener("click", async (e) => {
	let newDate = new Date(document.getElementById("date").value),
		newWeight = parseFloat(weight.value),
		validUpdate = 0;

	if (newDate <= new Date()) validUpdate++;
	else alert("Please enter a valid date.");

	if (!isNaN(newWeight)) {
		if (newWeight >= 25 && newWeight <= 600) validUpdate++;
		else alert("Please enter a valid weight.");
	} else alert("Please enter a valid weight.");

	if (validUpdate == 2) updateWeightDate(user, newDate, newWeight, true);
});



document.getElementById("weight").addEventListener("keyup", (e) => {
	if (e.keyCode === 13) {
		event.preventDefault();
		document.getElementById("save-weight").click();
	}
});

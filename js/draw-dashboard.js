let url = new URL(window.location.href);
var email = url.searchParams.get("user");


if (email === null) {
	window.location.replace(window.location.href.slice(0, window.location.href.indexOf("dashboard.html")) + "signup.html");
}

let nameTitleElement = document.getElementById("name-title"),
	emailTitleElement = document.getElementById("email-title");


let nameElement = document.getElementById("name"),
	birthElement = document.getElementById("birth"),
	sexElement = document.getElementById("sex"),
	heightElement = document.getElementById("height"),
	oldPassElement = document.getElementById("old-pass"),
	newPassElement = document.getElementById("new-pass"),
	newPassElement2 = document.getElementById("new-pass-2");


let dateElement = document.getElementById("date"),
	weightElement = document.getElementById("weight");


let weightCardElement = document.getElementById("weight-card"),
	targetWeightElement = document.getElementById("target-weight"),
	imcCardElement = document.getElementById("imc-card"),
	imcLevelElement = document.getElementById("imc-level"),
	muscleElement = document.getElementById("muscle"),
	waterElement = document.getElementById("water");


const IMCLevelNames = ["Under weight", "Normal", "Overweight", "obese", "Extremely obese"],
	IMCLevelColors = ["#0274d1", "#1dc233", "#e69900", "#e65800", "#d10202"];

const drawDashboard = async (email) => {
	// Data from Firebase
	var queryDataUser = await db.collection("info").where("user", "==", email);
	queryDataUser.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			let name = doc.data().name,
				birth = doc.data().birth.toDate(),
				sex = doc.data().gender,
				height = doc.data().height,
				weights = doc.data().weights;

			weights = weights.map((element) => {
				return {
					date: element.date.toDate(),
					weight: element.weight,
				};
			});

			weights = weights.sort((a, b) => a.date - b.date);

		
			let birthDate = `${birth.getFullYear()}-${format(birth.getMonth() + 1)}-${format(birth.getDate())}`,
				age = Math.floor((new Date() - birth) * 3.2 * 10 ** -11);

			
			let dates = weights.map((wd) => wd.date);
			weights = weights.map((wd) => wd.weight);
			let nWeight = weights.length,
				weight = weights[nWeight - 1],
				targetWeight = 25 * (height / 100) ** 2;

	
			let IMCs = weights.map((w) => getIMC(w, height).toFixed(2)),
				IMC = IMCs[nWeight - 1],
				targetIMC = 25,
				IMCLevel = getIMCLevel(IMC);

			
			let muscles = weights.map((w) => getMuscle(w, height, sex).toFixed(0)),
				muscle = muscles[nWeight - 1];

	
			let waters = weights.map((w) => getWater(w, height, age).toFixed(0)),
				water = waters[nWeight - 1];

			nameTitleElement.innerHTML = name;
			emailTitleElement.innerHTML = email;

			nameElement.value = name;
			birthElement.value = birthDate;
			sexElement.value = sex;
			heightElement.value = height;
			oldPassElement.value = "";
			newPassElement.value = "";
			newPassElement2.value = "";

		
			today = new Date();
			dateElement.value = `${today.getFullYear()}-${format(today.getMonth() + 1)}-${format(today.getDate())}`;
			weightElement.value = weight;

			weightCardElement.innerHTML = weight + "Kg";
			targetWeightElement.innerHTML = "Weight goal: " + Math.floor(targetWeight) + "Kg";
			imcCardElement.innerHTML = IMC;
			imcLevelElement.innerHTML = IMCLevelNames[IMCLevel];
			imcLevelElement.style.backgroundColor = IMCLevelColors[IMCLevel];
			muscleElement.innerHTML = muscle + "%";
			waterElement.innerHTML = water + "%";

			
			drawWeight(dates, weights, targetWeight);
			drawIMC(dates, IMCs, targetIMC);
			drawMuscleAndWater(dates, muscles, waters);
		});
	});
};

drawDashboard(email);



document.getElementById("burger").addEventListener("click", () => {
	document.getElementById("burger").style.display = "none";
	document.getElementById("desk-header").style.display = "flex";
	document.getElementById("desk-header").style.position = "absolute";
	document.getElementById("desk-header").style.top = "0px";
	document.getElementById("desk-header").style.width = "300px";
});



document.getElementById("close-header").addEventListener("click", () => {
	document.getElementById("burger").style.display = "block";
	document.getElementById("desk-header").style.display = "none";
});

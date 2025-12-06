import { prismaClient } from "../src/prismaClient";
import bcrypt from "bcrypt";

async function createTestUser(email: string, password: string, isVerified: boolean) {
	// Create a password object for the test user
	const salt = await bcrypt.genSalt();
	const passwordHash = await bcrypt.hash(password, salt);
	const passObj = await prismaClient.password.create({ data: { passwordHash: passwordHash } });

	// Create a user with the email and password
	const testUser = await prismaClient.user.create({
		data: {
			name: "TestUser",
			email: email,
			password: { connect: { passwordId: passObj.passwordId } },
			emailVerified: isVerified,
		},
		include: { password: true },
	});

	return testUser;
}

async function loginTest() {
	const EMAIL_VERIFIED = "verified@ilstu.edu";
	const EMAIL_UNVERIFIED = "unverified@ilstu.edu";
	const PASSWORD = "testPassword";

	// Create temporary users for testing
	await prismaClient.user.deleteMany({ where: { email: { in: [EMAIL_VERIFIED, EMAIL_UNVERIFIED] } } });
	await createTestUser(EMAIL_VERIFIED, PASSWORD, true);
	await createTestUser(EMAIL_UNVERIFIED, PASSWORD, false);

	// Start tests
	let isTestPased = true;
	console.log("----- Testing Login API Call -----\n");
	console.log("----- Verified user, wrong email, and correct password -----");

	let response = await fetch("http://localhost:3000/api/user/login", {
		method: "POST",
		body: JSON.stringify({ email: "WrongEmail", password: PASSWORD }),
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		console.log("Test successful, login declined. Status: ", response.status);
	} else {
		console.log("Test failed, login accepted. Status: ", response.status);
		isTestPased = false;
	}

	console.log("\n----- Verified user, correct email, and wrong password -----");

	response = await fetch("http://localhost:3000/api/user/login", {
		method: "POST",
		body: JSON.stringify({ email: EMAIL_VERIFIED, password: "WrongPassword" }),
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		console.log("Test successful, login declined. Status: ", response.status);
	} else {
		console.log("Test failed, login accepted. Status: ", response.status);
		isTestPased = false;
	}

	console.log("\n----- Unverified user, correct email, and correct password -----");

	response = await fetch("http://localhost:3000/api/user/login", {
		method: "POST",
		body: JSON.stringify({ email: EMAIL_UNVERIFIED, password: PASSWORD }),
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		console.log("Test successful, login declined. Status: ", response.status);
	} else {
		console.log("Test failed, login accepted. Status: ", response.status);
		isTestPased = false;
	}

	console.log("\n----- Verified user, correct email, and correct password -----");

	response = await fetch("http://localhost:3000/api/user/login", {
		method: "POST",
		body: JSON.stringify({ email: EMAIL_VERIFIED, password: PASSWORD }),
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		console.log("Test successful, login accepted. Status: ", response.status);
	} else {
		console.log("Test failed, login declined. Status: ", response.status);
		isTestPased = false;
	}

	// Clean up test users
	await prismaClient.user.deleteMany({ where: { email: { in: [EMAIL_VERIFIED, EMAIL_UNVERIFIED] } } });
}

loginTest();

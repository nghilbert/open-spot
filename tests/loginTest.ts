import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient();

async function createTestUser(email: string, password: string, isVerified: boolean) {
	// Create a password object for the test user
	const salt = await bcrypt.genSalt();
	const passwordHash = await bcrypt.hash(password, salt);
	const passObj = await prismaClient.password.create({
		data: {
			passwordHash: passwordHash,
		},
	});

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

	await createTestUser(EMAIL_VERIFIED, PASSWORD, true);
	await createTestUser(EMAIL_UNVERIFIED, PASSWORD, false);

	let isTestPased = true;
	console.log("----- Testing Login -----\n");

	console.log("----- Verified user, wrong email and correct password -----\n");

	let response = await fetch("/api/user/login", {
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

	console.log("----- Verified user, correct email and wrong password -----\n");

	response = await fetch("/api/user/login", {
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

	console.log("----- Unverified user, correct email and correct password -----\n");

	response = await fetch("/api/user/login", {
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

	console.log("----- Verified user, correct email and correct password -----\n");

	response = await fetch("/api/user/login", {
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
}

loginTest();

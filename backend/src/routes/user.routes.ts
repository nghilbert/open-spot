// User testing routes
app.post("/api/user/create", async (req, res) => {
	// Create a user with the account manager
	let data = req.body;
	let name: string = data.name;
	let email: string = data.email;
	let password: string = data.password;

	if (await accountController.createAccount(email, password, name)) {
		// Successful creation
		res.status(200).redirect("/");
	} else {
		// Send an error
		res.status(400).end();
	}
});

app.post("/api/user/login", async (req, res) => {
	// Ask the account manager to log the user in
	let data = req.body;
	let email: string = data.email;
	let password: string = data.password;

	if (!email || !password) {
		return res.status(400).json({ error: "Missing email or password" });
	}

	let sessionToken = await loginController.login(email, password);

	if (sessionToken) {
		// Successful creation
		res.cookie("session", sessionToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
		});

		res.status(200).end();
	} else {
		// Send an error
		res.status(400).end();
	}
});

app.post("/api/user/logout", requireAuth, async (req, res) => {
	// Ask the account manager to log the user out
	const sessionToken = (req as any).cookies?.session;

	if (sessionToken) {
		// Successful
		accountController.logout(sessionToken);
		res.status(200).end();
	} else {
		// Send an error
		res.status(400).end();
	}
});

app.post("/api/user/exists", async (req, res) => {
	// Ask the account manager to log the user in
	let data = req.body;
	let email: string = data.email;

	let exists = await accountController.emailExists(email);

	if (exists) {
		// Successful creation
		res.status(200).end();
	} else {
		// Send an error
		res.status(400).end();
	}
});

app.get("/api/user/name", requireAuth, async (req, res) => {
	// Ask the account manager to log the user in
	res.end((req as AuthenticatedRequest).user.name);
});

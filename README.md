# Open Spot

## MVC Diagram

![MVC Diagram](./readme-images/MVC-diagram.png)

## About our project

Open Spot is an application designed to help students at Illinois State University locate available parking and bike spots on campus. This project is in active development, and this README provides an overview for users and developers contributing to the app.

## Table of Contents

- [Project Overview](#project-overview)
- [Features in Development](#features-in-development)
- [Code Structure](#code-structure)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Project Overview

Open Spot aims to streamline the process of finding open parking and bike spots for Illinois State University students. Users can create accounts, log in, manage profiles, and save favorite spots for quick access. The project is in its early stages, and we welcome contributions to help build a robust and user-friendly application.

## Getting Started

To set up the project locally for development:

## Connecting to github:

in terminal,
#Generate a new SSH key pair using:
ssh-keygen -t ed25519 -C "your_email@example.com"
Press Enter to save the key in the default location
Optionally, enter a strong passphrase when prompted for added security.

#Copy the Public SSH Key:

- Navigate to the directory where your SSH key was saved (e.g., ~/.ssh/).
- Open the public key file (e.g., id_ed25519.pub or id_rsa.pub) with a text editor.
- Copy the entire content of the file, including ssh-ed25519

# Add the Public Key to GitLab:

- Log in to your GitLab account.
- Click on your avatar in the upper-right corner and select "Edit profile" or "Settings".
- In the left sidebar, select "SSH Keys".
- Click "Add new key".
- Paste the copied public key into the "Key" field.
- Provide a descriptive "Title" for the key (e.g., "Open Spot").
- Click "Add key".

## Set Up the Environment:

- Install git by following this guide: https://github.com/git-guides/install-git
- Install Node.js here: https://nodejs.org/en/download
- Install Visual Studio Code: https://code.visualstudio.com/download
- inside VS Code Extensions install Git Graph, GitLens Inspect, and Prisma.

# Clone the Repository:

git clone https://github.com/nghilbert/open-spot

## Contributing

To contribute:

Create a feature or bug-fix branch (git checkout -b feature/your-feature-name).
Commit changes with clear, concise messages. (git commit -m "update you are making.")
Push your branch to origin (git push origin feature/your-feature-name).
Submit a pull request with a detailed description of your changes.

Please follow the existing code style and include comments for clarity. For major changes, open an issue first to discuss your ideas.

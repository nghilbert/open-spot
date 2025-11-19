# Open Spot

- [MVC Diagram](#mvc-diagram)
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## MVC Diagram

![MVC Diagram](./readme-images/MVC-diagram.png)

The diagram above shows the Model-View-Controller architecture for our project.

1. Presentation Layer (View)

   - Index is the launch page

2. Business Layer (Controller)

3. Data layer (Data Layer)

## Project Overview

Open Spot aims to streamline the process of finding open parking and bike spots for Illinois State University students. Users can create accounts, log in, manage profiles, and save favorite spots for quick access. The project is in its early stages, and we welcome contributions to help build a robust and user-friendly application.

## Getting Started

### Connecting to github:

In a terminal, generate a new SSH key pair using:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Then, press Enter to save the key in the default location.
Optionally, enter a strong passphrase when prompted for added security.

### Copy the Public SSH Key:

- Navigate to the directory where your SSH key was saved (e.g., ~/.ssh/).
- Open the public key file (e.g., id_ed25519.pub or id_rsa.pub) with a text editor.
- Copy the entire content of the file, including ssh-ed25519

### Add the Public Key to GitLab:

- Log in to your GitLab account.
- Click on your avatar in the upper-right corner and select "Edit profile" or "Settings".
- In the left sidebar, select "SSH Keys".
- Click "Add new key".
- Paste the copied public key into the "Key" field.
- Provide a descriptive "Title" for the key (e.g., "Open Spot").
- Click "Add key".

### Set Up the Environment:

- Install Git: https://github.com/git-guides/install-git
- Install Node.js: https://nodejs.org/en/download
- Install Visual Studio Code: https://code.visualstudio.com/download

### Clone the Repository:

```bash
git clone https://github.com/nghilbert/open-spot
```

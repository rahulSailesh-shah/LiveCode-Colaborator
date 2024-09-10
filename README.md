# LiveCode Collaborator

LiveCode Collaborator is an online JavaScript coding IDE with real-time collaboration features. It allows multiple users to develop and execute code together in shared coding rooms, leveraging the power of WebSockets and WebRTC for seamless real-time interactions.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)

## Features

- **Real-time Collaboration**: Multiple users can code together in the same workspace simultaneously.
- **JavaScript IDE**: Full-featured integrated development environment for JavaScript.
- **Code Execution**: Run JavaScript code directly in the browser.
- **Shared Coding Rooms**: Create or join coding rooms for collaborative projects.
- **WebSocket Communication**: Ensures low-latency updates between collaborators.
- **WebRTC Integration**: Enables peer-to-peer data exchange for improved performance.

## Installation

To set up LiveCode Collaborator locally, follow these steps:

Clone the repository

```
git clone https://github.com/rahulSailesh-shah/LiveCode-Colaborator
```

Navigate to the project directory

```
cd LiveCode-Colaborator
```

Install dependencies

```
npm install
```

Start the development server

```
npm run dev
```

## Usage

1. Open your web browser and navigate to `http://localhost:5173`
2. Create a new coding room or join an existing one using a shared room ID.
3. Start coding! Your changes will be visible to all participants in real-time.
4. Use the "Run" button to execute the JavaScript code and see the output.

## Technology Stack

- **Frontend**: React.js.
- **Backend**: Node.js with Express.js
- **Real-time Communication**: WebSockets (Socket.io) and WebRTC
- **Code Execution**: Sandboxed JavaScript execution environment
- **Database**: MongoDB for storing user data and coding room information

## Contributing

We welcome contributions to LiveCode Collaborator! If you'd like to contribute, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

# Messaging Application Frontend

This is the frontend for a messaging application project that I'm working on with Michael Rothkopf and Mohnish Pothineni. It is an [Expo](https://expo.dev) (React Native) app written in TypeScript.

For the backend, please see [tdcdhe corresponding repository](https://github.com/michaelrothkopf/messaging-application-u26-backend) and my fork
version (https://github.com/Avi702/avneet-michael-messaging-backend)

## About the Application

The app lets a user register an account, log in, find other users, start direct or group chats, and send messages in real time.

### Features

- **Authentication** with JWT access and refresh tokens, stored securely on the device with `expo-secure-store`. The access token is refreshed automatically when it expires.
- **Profile** viewing and editing, including a display name and bio. Private fields (email and birth date) are only ever visible to the account owner.
- **User search** by display name, with results updating as you type.
- **Chats**, either direct (two people) or group. Group owners can rename the chat.
- **Live messaging** over socket.IO, so new messages appear without refreshing.

### Structure

Routing is file based via [expo-router](https://docs.expo.dev/router/introduction); every file in `src/app` is a route.

| Path | Purpose |
| --- | --- |
| `src/app/_layout.tsx` | Root layout; wraps the app in the authentication provider |
| `src/app/Authentication/AuthContext.tsx` | Global auth state, token storage and refresh, and the `authFetch` helper |
| `src/app/Authentication/LogIn.tsx` | Log in screen |
| `src/app/Authentication/SignUp.tsx` | Registration screen |
| `src/app/(tabs)/index.tsx` | Conversation list |
| `src/app/(tabs)/Profile.tsx` | The logged in user's profile |
| `src/app/message/[id].tsx` | A single chat, including the socket connection |
| `src/app/message/FindUsers.tsx` | User search and new chat creation |
| `src/components/` | Shared components (`Chat`, `UserCard`, `ViewContent`) |

### Talking to the Backend

Every locked route is called through `authFetch` from the authentication context. It attaches the access token, and if the backend replies `401` it refreshes the token once and retries the request, so a session does not break after the access token expires.

The chat screen connects to socket.IO separately, passing a token that has been validated (and refreshed if needed) beforehand.

## Get Started

### Environment Variables

Before starting the app, you must copy the `.env.example` file into `.env.local` and edit the options.

The options are as follows:

#### EXPO_PUBLIC_API_URL (required)

The base URL of the backend, with no trailing slash, for example `http://localhost:3000`.

Expo only exposes variables that begin with `EXPO_PUBLIC_`, so the name must be kept exactly. Note that this value is bundled into the app and is therefore visible to anyone who inspects it, so no secrets belong here.

The correct host depends on where the app is running:

| Target | Value |
| --- | --- |
| iOS simulator | `http://localhost:3000` |
| Web | `http://localhost:3000` |
| Android emulator | `http://10.0.2.2:3000` |
| A physical device | `http://<your computer's LAN IP>:3000` |

Environment variables are read when the bundler starts, so restart it after changing them.

## Running the App

The backend must be running and reachable at `EXPO_PUBLIC_API_URL` first.

### 1. Install modules

Run the following command to install the modules:
```bash
npm install
```

### 2. Start the app

Run the following command to start the development server:
```bash
npm start
```

From there you can open the app on a simulator, an emulator, or a physical device through Expo Go.

To open a target directly, run one of:
```bash
npm run ios
npm run android
npm run web
```

If a change to the environment or to a dependency does not seem to apply, restart with the cache cleared:
```bash
npx expo start -c
```

## Linting

To lint the code, run:
```bash
npm run lint
```

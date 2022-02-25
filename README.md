# House Chat JS

house-chat-js is the official JavaScript client for House Studio, a service for building chat applications.

## Installation

### Install with NPM

```bash
npm install house-chat
```

### Install with Yarn

```bash
yarn add house-chat
```

## Usage

### create client

```typescript
import { HouseChat } from 'house-chat';

const loginParams = {
  login_random_secret: 'YOUR_LOGIN_RANDOM_SECRET',
  signature: 'YOUR_SIGNATURE',
  wallet_address: 'YOUR_WALLTE_ADDRESS',
  appid: 'YOUR_APPID',
};

// create client
const client = HouseChat.getInstance(loginParams);
// or
const client = HouseChat.getInstance('YOUR_ACCESS_TOKEN');
```

### create room

```typescript
const room = client.createRoom();
```

### create message

```typescript
const message = client.createMessage();
```

### create user

```typescript
const user = client.createUser();
```

### utils function

```typescript
import { login, register, getLoginRandomSecret } from 'house-chat';

const data = await register();

const data = await getLoginRandomSecret();

const data = await login();
```

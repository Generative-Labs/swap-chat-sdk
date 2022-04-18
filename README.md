# Web3MQ JS

web3MQ-js is the official JavaScript client for House Studio, a service for building chat applications.

## Installation

### Install with NPM

```bash
npm install web3MQ
```

### Install with Yarn

```bash
yarn add web3MQ
```

## Usage

### create client

```typescript
import { web3MQ } from 'web3MQ';

const loginParams = {
  login_random_secret: 'YOUR_LOGIN_RANDOM_SECRET',
  signature: 'YOUR_SIGNATURE',
  wallet_address: 'YOUR_WALLTE_ADDRESS',
  appid: 'YOUR_APPID',
};

// create client
const client = web3MQ.getInstance(loginParams);
// or
const client = web3MQ.getInstance('YOUR_ACCESS_TOKEN');
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
import { login, register, getLoginRandomSecret } from 'web3MQ';

const data = await register();

const data = await getLoginRandomSecret();

const data = await login();
```

# HotPotato - Farcaster Game

A hot potato game for Farcaster users where players can pass a potato to each other. Each potato expires after 24 hours, and users earn points based on their game performance.

## Features

- Track user high scores and potato counts
- Pass potatoes between users with 24-hour expiration
- Store sender and receiver information for each potato
- Check if a user has an active potato

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

You can use the provided Makefile to deploy the HotPotato contract:

```shell
# Deploy to local Anvil chain
$ make deploy-anvil

# Deploy to Sepolia testnet
$ make deploy-sepolia

# Deploy to Mainnet
$ make deploy-mainnet
```

### Environment Setup

Before deploying, copy the sample.env file to .env and fill in your values:

```shell
$ cp sample.env .env
$ nano .env  # Edit with your preferred editor
```

Make sure to set:
- RPC URLs for the networks you want to deploy to
- Your private key for deployment
- Etherscan API key for contract verification

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

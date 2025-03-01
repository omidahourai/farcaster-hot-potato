ENV_FILE ?= .env.local

# Load environment variables from the correct .env file
ifneq (,$(wildcard $(ENV_FILE)))
    include $(ENV_FILE)
    export $(shell sed 's/=.*//' $(ENV_FILE))
endif

.PHONY: all test clean deploy

all: clean install build

# Clean the repo
clean:
	@forge clean

# Install dependencies
install:
	@forge install

# Build the project
build:
	@forge build

# Run tests
test:
	@forge test

# Deploy to Anvil for local testing
deploy:
	@forge script script/Deploy.s.sol:Deploy --rpc-url $(RPC_URL) --private-key $(DEPLOYER_PRIVATE_KEY) --broadcast

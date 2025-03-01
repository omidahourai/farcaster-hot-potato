import sdk from '@farcaster/frame-sdk';
import { SwitchChainError, fromHex, getAddress, numberToHex } from 'viem';
import { ChainNotConfiguredError, createConnector } from 'wagmi';

frameConnector.type = 'frameConnector' as const;

export function frameConnector() {
  let connected = true;

  return createConnector<typeof sdk.wallet.ethProvider>((config) => ({
    id: 'farcaster',
    name: 'Farcaster Wallet',
    type: frameConnector.type,

    async setup() {
      this.connect({ chainId: config.chains[0].id });
    },
    async connect({ chainId } = {}) {
      try {
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          throw new Error('Provider not initialized');
        }
        console.log(provider.request({ method: 'eth_requestAccounts' }));

        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });
        if (!accounts) {
          throw new Error('Failed to get accounts');
        }
        console.log(accounts);

        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain!({ chainId });
          currentChainId = chain.id;
        }

        connected = true;

        return {
          accounts: accounts.map((x) => getAddress(x)),
          chainId: currentChainId,
        };
      } catch (error) {
        console.error('Error connecting to provider:', error);
        throw error;
      }
    },
    async disconnect() {
      connected = false;
    },
    async getAccounts() {
      if (!connected) throw new Error('Not connected');
      const provider = await this.getProvider();
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      return accounts.map((x) => getAddress(x));
    },
    async getChainId() {
      const provider = await this.getProvider();
      const hexChainId = await provider.request({ method: 'eth_chainId' });
      return fromHex(hexChainId, 'number');
    },
    async isAuthorized() {
      if (!connected) {
        return false;
      }

      const accounts = await this.getAccounts();
      return !!accounts.length;
    },
    async switchChain({ chainId }) {
      try {
        const provider = await this.getProvider();
        const chain = config.chains.find((x) => x.id === chainId);
        if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: numberToHex(chainId) }],
          });
        } catch (switchError) {
          // If the chain is not recognized, add it first
          if (switchError as any) {
            console.log(chain);
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: numberToHex(chainId),
                  chainName: chain.name,
                  nativeCurrency: chain.nativeCurrency,
                  rpcUrls: chain.rpcUrls.default.http, // Ensure rpcUrls is an array of strings
                },
              ],
            });
            // Retry switching the chain
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: numberToHex(chainId) }],
            });
          } else {
            throw switchError;
          }
        }
        return chain;
      } catch (error) {
        console.error('Error switching chain:', error);
        throw error;
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit('change', { chainId });
    },
    async onDisconnect() {
      config.emitter.emit('disconnect');
      connected = false;
    },
    async getProvider() {
      try {
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          throw new Error('Provider not initialized');
        }
        return provider;
      } catch (error) {
        console.error('Error getting provider:', error);
        throw error;
      }
    },
  }));
}
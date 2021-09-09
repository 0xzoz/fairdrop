import chainName from './chainName';

export const DRAWER_WIDTH = 240;

export const NETWORK_MAINNET = chainName(1);
export const NETWORK_RINKEBY = chainName(4);
export const INCENTIVE_START_TIME = 1630934283; // 1629189007;
export const INCENTIVE_END_TIME = 1631539083; // 1630398607;

export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
  4: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
};

export const UNISWAP_V3_STAKER: Record<string, string> = {
  4: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  1: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
};

export const STAKING_REWARDS_CONTRACT: Record<string, string> = {
  4: '0x8eE36E719529Df01CA9F6098e4c637471F184D6D',
  1: '0x947FD45244f389e9F97f36B41F30104211c7e5Fc',
  100: '0x5dD57Da40e6866C9FcC34F4b6DDC89F1BA740DfE',
};

export const WETH: Record<string, string> = {
  4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
};

export const BRIGHT: Record<string, string> = {
  4: '0x779ec783bbEec9350B3EfB8BeC775C6379f5E218',
  1: '0x5dd57da40e6866c9fcc34f4b6ddc89f1ba740dfe',
  100: '0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E',
};

export const UNISWAP_V2_LP_POOL: Record<string, string> = {
  4: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
  1: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735',
  100: '0x0907239acfe1d0cfc7f960fc7651e946bb34a7b0',
};

export const UNISWAP_V3_LP_POOL: Record<string, string> = {
  4: '0x17472be087c2ae35ac8a9fc2a31ff9617ae2609a',
  1: '0x5705ae6e3BF74608543a248b9E87e297d36a2aA9',
};

export const INCENTIVE_REFUNDEE_ADDRESS: Record<string, string> = {
  4: '0x7e3c105c83166737da77942240378e786842eb1d',
  1: '0x693FB04d603D800fA9456a02564bA060dA8939fc',
};

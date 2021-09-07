import { useCallback, useState } from 'react';
import { utils, BigNumber } from 'ethers';
import { useWallet } from '../contexts/wallet';
import { useContracts } from '../contexts/contracts';
import { useNotifications } from '../contexts/notifications';
import { useERC20Tokens } from '../contexts/erc20Tokens';

const approveValue = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

export function useV2Staking(tokenId?: number) {
  const { tx } = useNotifications();
  const { walletAddress } = useWallet();
  const { stakingRewardsContract } = useContracts();
  const { uniV2LpToken } = useERC20Tokens();

  const [isWorking, setIsWorking] = useState<string | null>(null);

  const approve = useCallback(
    async (next: () => void) => {
      if (!(uniV2LpToken?.contract && stakingRewardsContract)) return;

      try {
        setIsWorking('Approving...');
        await tx('Approving...', 'Approved!', () =>
          uniV2LpToken?.contract.approve(
            stakingRewardsContract.address,
            approveValue
          )
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, uniV2LpToken, tx]
  );

  const stake = useCallback(
    async (value: BigNumber, next: () => void) => {
      if (
        !uniV2LpToken?.contract ||
        !stakingRewardsContract ||
        !walletAddress ||
        !uniV2LpToken?.balance ||
        value.isZero()
      )
        return;

      try {
        console.log('trying here');
        setIsWorking('Staking...');
        const stakerAllowance = await uniV2LpToken.contract?.allowance(
          walletAddress,
          stakingRewardsContract.address
        );

        // check if allowance is greater and value to stake is less than balance
        if (stakerAllowance.gte(value) && value.lte(uniV2LpToken.balance)) {
          await tx('Staking...', 'Staked!', () =>
            stakingRewardsContract.stake(value)
          );
        }

        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [uniV2LpToken, stakingRewardsContract, tx, walletAddress]
  );

  const withdraw = useCallback(
    async (value: BigNumber, next: () => void) => {
      if (!stakingRewardsContract || !walletAddress || value.isZero()) return;

      const stakedBalance = await stakingRewardsContract.balanceOf(
        walletAddress
      );

      try {
        setIsWorking('Unstaking...');
        if (value.lte(stakedBalance)) {
          await tx('Unstaking...', 'Unstaked!', () =>
            stakingRewardsContract.withdraw(value)
          );
        }
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, tx, walletAddress]
  );

  const exit = useCallback(
    async (next: () => void) => {
      if (!stakingRewardsContract || !walletAddress) return;

      try {
        setIsWorking('Unstaking...');
        await tx('Unstaking...', 'Unstaked!', () =>
          stakingRewardsContract.exit()
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [stakingRewardsContract, tx, walletAddress]
  );

  const harvest = useCallback(
    async (next: () => void) => {
      if (!stakingRewardsContract || !walletAddress) return;
      try {
        setIsWorking('Harvesting...');

        await tx('Harvesting...', 'Harvested!', () =>
          stakingRewardsContract.getReward()
        );
        next();
      } catch (e) {
        console.warn(e);
      } finally {
        setIsWorking(null);
      }
    },
    [walletAddress, stakingRewardsContract, tx]
  );

  return {
    isWorking,
    approve,
    stake,
    exit,
    harvest,
    withdraw,
  };
}

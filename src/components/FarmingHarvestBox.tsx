import { FC, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { BigNumber as BigNumberEthers, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useWallet } from '../contexts/wallet';
import { useV2Staking } from '../hooks/useV2Staking';
import { useContracts } from '../contexts/contracts';
import { LiquidityPosition } from '../utils/types';
import { FARM } from '../utils/types';

const INTERVAL = 30000;

export const SubsHarvestBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();
  const { stakingRewardsContract } = useContracts();
  const { isWorking, harvest } = useV2Staking();
  const [rewardBalance, setRewardBalance] = useState<string>('0.0');
  const [event, setEvent] = useState<number>(0);

  const checkForRewards = useCallback(() => {
    if (!walletAddress || !stakingRewardsContract) return;
    console.log('event', event);

    const load = async () => {
      try {
        const balance = await stakingRewardsContract.earned(walletAddress);
        setRewardBalance(utils.formatUnits(balance, 18).slice(0, 12));
      } catch {}
    };
    load();
  }, [walletAddress, stakingRewardsContract, event]);

  const handleHarvest = useCallback(() => {
    return harvest(() => {
      checkForRewards();
    });
  }, [checkForRewards, harvest]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForRewards();
    }, INTERVAL);
    checkForRewards();
    return () => {
      clearInterval(interval);
    };
  }, [checkForRewards]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;

    const updateEvent = (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        setEvent((e) => e + 1);
      }
    };
    const subscribe = () => {
      if (!stakingRewardsContract) return () => {};
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      stakingRewardsContract.on(stakeEvent, updateEvent);
      stakingRewardsContract.on(withdrawnEvent, updateEvent);

      return () => {
        stakingRewardsContract.off(stakeEvent, updateEvent);
        stakingRewardsContract.off(withdrawnEvent, updateEvent);
      };
    };
    return subscribe();
  }, [walletAddress, stakingRewardsContract]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance}</Typography>
      </Box>
      <Box>
        <Button variant={'contained'} onClick={handleHarvest}>
          {isWorking ? isWorking : 'Harvest'}
        </Button>
      </Box>
    </>
  );
};

export const HoneyHarvestBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();
  const { stakingRewardsContract } = useContracts();
  const { isWorking, harvest } = useV2Staking();
  const [rewardBalance, setRewardBalance] = useState<string>('0');
  const [event, setEvent] = useState<number>(0);

  const checkForRewards = useCallback(() => {
    if (!walletAddress || !stakingRewardsContract) return;
    console.log('event', event);
    const load = async () => {
      try {
        const balance = await stakingRewardsContract.earned(walletAddress);
        setRewardBalance(utils.formatUnits(balance, 18).slice(0, 12));
      } catch {}
    };
    load();
  }, [walletAddress, stakingRewardsContract, event]);

  const handleHarvest = useCallback(() => {
    return harvest(() => {
      checkForRewards();
    });
  }, [checkForRewards, harvest]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForRewards();
    }, INTERVAL);
    checkForRewards();
    return () => {
      clearInterval(interval);
    };
  }, [checkForRewards]);

  useEffect(() => {
    if (!walletAddress || !stakingRewardsContract) return;

    const updateEvent = (address: string) => {
      if (address.toLowerCase() === walletAddress.toLowerCase()) {
        setEvent((e) => e + 1);
      }
    };
    const subscribe = () => {
      if (!stakingRewardsContract) return () => {};
      const stakeEvent = stakingRewardsContract.filters.Staked();
      const withdrawnEvent = stakingRewardsContract.filters.Withdrawn();
      stakingRewardsContract.on(stakeEvent, updateEvent);
      stakingRewardsContract.on(withdrawnEvent, updateEvent);

      return () => {
        stakingRewardsContract.off(stakeEvent, updateEvent);
        stakingRewardsContract.off(withdrawnEvent, updateEvent);
      };
    };
    return subscribe();
  }, [walletAddress, stakingRewardsContract]);

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>{rewardBalance}</Typography>
      </Box>
      <Box>
        <Button variant={'contained'} onClick={handleHarvest}>
          {isWorking ? isWorking : 'Harvest'}
        </Button>
      </Box>
    </>
  );
};

export const UniswapV3HarvestBox: FC = () => {
  const classes = useStyles();
  const { walletAddress } = useWallet();

  return (
    <>
      <Box>
        <Typography className={classes.subheader}>$BRIGHT Earned:</Typography>
        <Typography>0</Typography>
      </Box>
      <Box>
        <Button variant={'contained'}>Harvest</Button>
      </Box>
    </>
  );
};

interface FarmingHarvestBoxProps {
  farm: FARM;
}

export const FarmingHarvestBox = ({ farm }: FarmingHarvestBoxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3HarvestBox />;
    }
    case 'SUBS': {
      return <SubsHarvestBox />;
    }
    case 'HONEY': {
      return <HoneyHarvestBox />;
    }
    default: {
      return null;
    }
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subheader: {
      fontWeight: 'bold',
      fontSize: 14,
    },
  })
);

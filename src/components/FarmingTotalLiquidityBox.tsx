import { FC, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { BigNumber as BigNumberEthers, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import { Button, Box, Fab, Typography, Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useWallet } from '../contexts/wallet';
import { useV3Liquidity } from '../contexts/erc721Nfts';
import { useERC20Tokens } from '../contexts/erc20Tokens';
import { useContracts } from '../contexts/contracts';
import { useStakingRewardsInfo } from '../hooks/useStakingRewardsInfo';
import { FARM } from '../utils/types';
import { sleep } from '../utils/promise';

export const SubsLpBox: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Box
        className={classes.totalLiquidityBox}
        width="50%"
        borderColor={'rgba(0, 0, 0, 0.12)'}
        py={1}
      >
        <Box>
          <Box fontSize={12} fontWeight="bold">
            Total Liquidity
          </Box>
          <Box fontSize={12}>$125,271</Box>
        </Box>
      </Box>
      <Box className={classes.lpLinkBox} py={1}>
        <Link
          underline="always"
          className={classes.lpLink}
          href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x61CEAc48136d6782DBD83c09f51E23514D12470a"
          target="_blank"
          rel="noopener"
        >
          Get SUBS
        </Link>
      </Box>
    </>
  );
};

export const HoneyLpBox: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.totalLiquidityBox} width="50%" py={1}>
        <Box>
          <Box fontSize={12} fontWeight="bold">
            Total Liquidity
          </Box>
          <Box fontSize={12}>$125,271</Box>
        </Box>
      </Box>
      <Box className={classes.lpLinkBox} py={1}>
        <Link
          underline="always"
          className={classes.lpLink}
          href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x61CEAc48136d6782DBD83c09f51E23514D12470a"
          target="_blank"
          rel="noopener"
        >
          Get LP Token
        </Link>
      </Box>
    </>
  );
};

export const UniswapV3LpBox: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Box
        className={classes.totalLiquidityBox}
        width="50%"
        borderColor={'rgba(0, 0, 0, 0.12)'}
        py={1}
      >
        <Box>
          <Box fontSize={12} fontWeight="bold">
            Total Liquidity
          </Box>
          <Box fontSize={12}>$125,271</Box>
        </Box>
      </Box>
      <Box className={classes.lpLinkBox} py={1}>
        <Link
          underline="always"
          className={classes.lpLink}
          href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x61CEAc48136d6782DBD83c09f51E23514D12470a"
          target="_blank"
          rel="noopener"
        >
          Get NFT Position
        </Link>
      </Box>
    </>
  );
};

interface FarmingTotalLiquidityBoxProps {
  farm: FARM;
}

export const FarmingTotalLiquidityBox = ({
  farm,
}: FarmingTotalLiquidityBoxProps) => {
  switch (farm) {
    case 'UNISWAP': {
      return <UniswapV3LpBox />;
    }
    case 'SUBS': {
      return <SubsLpBox />;
    }
    case 'HONEY': {
      return <HoneyLpBox />;
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
    totalLiquidityBox: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    lpLinkBox: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    lpLink: {
      color: 'black',
      fontSize: '12px',
      fontWeight: 'bold',
    },
  })
);

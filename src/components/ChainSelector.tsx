import React, {useContext, useState} from 'react'
import {
    Box, Button, ButtonGroup, Grid, Hidden, Typography
} from '@material-ui/core'
import chainName from '../utils/chainName'
import ChainSelectorWizard from './ChainSelectorWizard'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {EthersProviderContext} from './ProviderContext'
import {intervalToDuration} from 'date-fns'
import formatDuration from 'date-fns/formatDuration'
import {RegistrationInfo} from '../utils/api'
import boxes from '../images/boxes.svg'
import {Alert} from '@material-ui/lab'
import BinarySlider from './BinarySlider'
import {mainnetChainId, xDaiChainId} from '../utils/chainIds'
import HashDisplay from './HashDisplay'

interface ChainSelectorProps {
    address: string
    currentChainId: number
    setChainId: (newChainId: number) => any
    registrationInfo: RegistrationInfo
}

const ChainSelector = ({address, currentChainId, setChainId, registrationInfo}: ChainSelectorProps) => {
    const classNames = useStyles()
    const {wallet, onboardApi, walletAddress} = useContext(EthersProviderContext)
    const [showWizard, setShowWizard] = useState(false)
    const [sliderValue, setSliderValue] = useState<0|1>((currentChainId === mainnetChainId) ? 0 : 1)

    const handleOpenWizard = async () => {
        // wallet connected?
        if (!wallet) {
            await onboardApi?.walletSelect()
        }
        // wallet address matching?
        if (walletAddress !== address) {
            console.log(`Wrong address ${walletAddress} - should be ${address}`)
            return
        }
        // wallet ready?
        const ready = await onboardApi?.walletCheck()
        if (ready) {
            setShowWizard(true)
        } else {
            console.log(`Failed walletcheck!`)
        }
    }

    const handleCloseWizard = (selectedChainId: number) => {
        console.log(`User selected chain ${chainName(selectedChainId)} (${selectedChainId})`)
        setShowWizard(false)
        if (selectedChainId !== currentChainId) {
            setChainId(selectedChainId)
        }
        // set slider
        setSliderValue((selectedChainId === mainnetChainId) ? 0 : 1)
    }

    const handleBinarySliderChange = (newValue:0|1) => {
        console.log(`Slider changed to ${newValue}`)
        // set slider
        setSliderValue(newValue)
        handleOpenWizard()
    }

    // user can only choose between MainNet and xDai
    let otherChainId: number
    if (currentChainId === mainnetChainId) {
        otherChainId = xDaiChainId
    } else {
        otherChainId = mainnetChainId
    }

    const remainingTicks = registrationInfo.currentRegistrationEnd - Date.now()
    if (remainingTicks < 0) {
        console.log(`Current registration phase has ended. Nothing can be changed at the moment`)
        return null
    }
    const duration = intervalToDuration({start: Date.now(), end: registrationInfo.nextClaimStart})
    console.log(`Duration: ${formatDuration(duration)}`)
    const durationString = formatDuration(duration, {format: ['days', 'hours', 'minutes']})
    return (<>
            <Grid container alignItems={'center'} spacing={10}>
                <Grid item container direction={'column'} sm={9} md={6}>
                    <Typography className={classNames.paragraph} align={'left'} variant={'h4'}>
                        Select your preferred chain to receive $BRIGHT
                    </Typography>
                    {(walletAddress === address) &&
                        <Box className={classNames.sliderContainer}>
                        <BinarySlider value={sliderValue} setValue={handleBinarySliderChange} label0={chainName(mainnetChainId)} label1={chainName(xDaiChainId)}/>
                    </Box>}
                    {(walletAddress !== address) && <Alert severity={'warning'} className={classNames.alert}>
                      You need to connect with address <strong><HashDisplay hash={address} type={'address'}/></strong> in order to change the payout chain.
                    </Alert> }
                    <Box className={classNames.infoBox}>
                        <Typography variant={'h6'}>Payout Chain Info</Typography>
                        <Typography variant={'body1'}>
                            Note that change of payout chain will take effect for the next claim period, starting
                 in approximately <strong>{durationString}</strong>.
                        </Typography>
                        <Typography variant={'body1'}>
                            All unclaimed $BRIGHT will carry over to the next period and be available on
                            the selected chain.
                        </Typography>
                    </Box>
                </Grid>
                <Hidden xsDown>
                    <Grid item sm={3} md={6}>
                        <img src={boxes} width={'100%'} alt={'boxes'}/>
                    </Grid>
                </Hidden>
            </Grid>
            {showWizard && <ChainSelectorWizard onClose={handleCloseWizard} open={true} address={address}
                                                currentChainId={currentChainId} desiredChainId={otherChainId}/>}
        </>)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    paragraph: {
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2),
            margin: theme.spacing(1)
        },
    },
    alert: {
        borderRadius: 5,
        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(1)
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3)
        }
    },
    button: {
        color: 'white'
    },
    infoBox: {
        background: 'rgba(196, 196, 196, 0.25)', //'#C4C4C4',
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2),
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(2)
        },
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
            marginLeft: theme.spacing(3),
            marginTop: theme.spacing(4)
        }
    },
    sliderContainer: {
        marginLeft: theme.spacing(3),
    }
}),)

export default ChainSelector

import React, { useContext } from 'react';
import { Button, Grid } from '@material-ui/core';
import { ethers } from 'ethers';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { EthersProviderContext } from './ProviderContext';

interface AddressFormData {
  address: string;
}

interface AddressFormProps {
  initialValues: AddressFormData;
  setAddress: (address: string) => any;
}

const AddressForm = ({ initialValues, setAddress }: AddressFormProps) => {
  const classNames = useStyles();
  const { onboardApi, walletAddress } = useContext(EthersProviderContext);

  const onSubmit = (values: AddressFormData) => {
    console.log(`Submitting ${values.address}`);
    // make sure to have a checksummed address before storing
    setAddress(ethers.utils.getAddress(values.address));
  };

  const validate = (values: AddressFormData) => {
    console.log(`Validating...`);
    if (!values.address) {
      return { address: 'Enter an Ethereum address.' };
    }
    try {
      ethers.utils.getAddress(values.address);
    } catch (e) {
      return { address: 'Not a valid Ethereum address.' };
    }
    // no errors
    return {};
  };

  return (
    <Form
      mutators={{
        importWalletAddress: async (args, state, utils) => {
          console.log(`Mutator called, wallet address is ${walletAddress}`);
          if (walletAddress && walletAddress !== '') {
            utils.changeValue(state, 'address', () => walletAddress);
          } else {
            console.log(`Connecting wallet...`);
            const selected = await onboardApi?.walletSelect();
            if (selected) {
              await onboardApi?.walletCheck();
            }
          }
        },
      }}
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ form, handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container xs={12} spacing={0} alignItems={'flex-start'}>
            <Grid item xs={8}>
              <TextField
                id="address"
                type="text"
                name="address"
                className={classNames.addressTextField}
                InputProps={{
                  classes: {
                    input: classNames.addressInput,
                  },
                }}
                variant="outlined"
                label="Address"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                className={classNames.Btn}
                type="submit"
                variant={'contained'}
                color={'primary'}
                disabled={submitting}
                size="large"
                disableElevation={true}
                fullWidth={true}
              >
                Check Address
              </Button>
            </Grid>

            {/* <Button
                                  className={classNames.Btn}
                                  onClick={form.mutators.importWalletAddress}
                                  variant={'outlined'}>
                                  Use Wallet Address
                              </Button> */}
          </Grid>
        </form>
      )}
    />
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addressTextField: {
      // borderTopLeftRadius: '35px',
      // borderTopRightRadius: '35px',
    },
    addressInput: {
      [theme.breakpoints.up('md')]: {
        fontSize: 'large',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 14,
      },
      background: 'white',
      paddingRight: '52px',
    },
    Btn: {
      [theme.breakpoints.up('md')]: {
        padding: '16.5px 0',
      },
      [theme.breakpoints.down('md')]: {
        padding: '16px 0',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '15px 0',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '14px 0',
      },
      // width: '100%',
      marginLeft: '-51px',
      borderRadius: 50,
    },
  })
);

export default AddressForm;

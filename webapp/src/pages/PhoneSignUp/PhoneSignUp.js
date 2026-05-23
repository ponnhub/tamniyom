import { useTheme } from "@emotion/react";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CustomPaper from "components/CustomPaper";

import liff from '@line/liff';
import { getApp } from "firebase/app"

// v9 compat packages are API compatible with v8 code
// import firebase from 'firebase/app';
// import 'firebase/auth';

import { getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import Page from "material-ui-shell/lib/containers/Page";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useMenu } from 'material-ui-shell/lib/providers/Menu'
import { useNavigate, useLocation } from 'react-router-dom'
import {fetch} from 'whatwg-fetch'

const PhoneSignUp = ({ redirectTo = '/my_account' }) => {

    const app = getApp()
    const intl = useIntl()
    const navigate = useNavigate()
    const theme = useTheme()
    const [phoneNumber, setphoneNumber] = useState('+66912345678');
    const [pageTitle, setPageTitle] = useState('Sign up');
    const firebaseAuth = getAuth()
    const { auth, setAuth } = useAuth()
    const { toggleThis } = useMenu()
    let location = useLocation()

    useEffect(() => {      

        console.log('in useEffect');
        onAuthStateChanged(firebaseAuth, function(user) {

            if (!auth.isAuthenticated) {
                firebaseAuth.signOut()
            }
            if (user) {
              // User is signed in.
              var uid = user.uid;
              var email = user.email;
              var photoURL = user.photoURL;
              var phoneNumber = user.phoneNumber;
              var isAnonymous = user.isAnonymous;
              var displayName = user.displayName;
              var providerData = user.providerData;
              var emailVerified = user.emailVerified;



            }
            updateSignInButtonUI();
            updateSignInFormUI();
            updateSignOutButtonUI();
            updateSignedInUserStatusUI();
            updateVerificationCodeFormUI();

            document.getElementById('sign-out-button').addEventListener('click', onSignOutClick);
            document.getElementById('phone-number').addEventListener('keyup', updateSignInButtonUI);
            document.getElementById('phone-number').addEventListener('change', updateSignInButtonUI);
            document.getElementById('verification-code').addEventListener('keyup', updateVerifyCodeButtonUI);
            document.getElementById('verification-code').addEventListener('change', updateVerifyCodeButtonUI);
            document.getElementById('verification-code-form').addEventListener('submit', onVerifyCodeSubmit);
            document.getElementById('cancel-verify-code-button').addEventListener('click', cancelVerification);
            document.getElementById('sign-in-button').addEventListener('click', onSignInSubmit);

            window.recaptchaVerifier = window.recaptchaVerifier  || new RecaptchaVerifier('sign-in-button', {
              'size': 'invisible',
              'callback': function(response) {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log(response);
                onSignInSubmit();
              }
            }, firebaseAuth);

            window.recaptchaVerifier.render().then(function(widgetId) {
              window.recaptchaWidgetId = widgetId;
              updateSignInButtonUI();
            });

          });


    });

    const authenticate = (user) => {
        setAuth({ isAuthenticated: true, ...user })
        toggleThis('isAuthMenuOpen', false)

        let from = new URLSearchParams(location.search).get('from')

        if (from) {
          navigate(from, { replace: true })
        } else {
          navigate(redirectTo, { replace: true })
        }
      }

  /**
   * Function called when clicking the Login/Logout button.
   */
   function onSignInSubmit() {
    if (isPhoneNumberValid()) {
        console.log('signingIn');
      window.signingIn = true;
      updateSignInButtonUI();
      var phoneNumber = getPhoneNumberFromUserInput();
      console.log(phoneNumber);
      var appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            window.signingIn = false;
            updateSignInButtonUI();
            updateVerificationCodeFormUI();
            updateVerifyCodeButtonUI();
            updateSignInFormUI();

          }).catch(function (error) {
            // Error; SMS not sent
            console.error('Error during signInWithPhoneNumber', error);
            window.alert('Error during signInWithPhoneNumber:\n\n'
                + error.code + '\n\n' + error.message);
            window.signingIn = false;
            updateSignInFormUI();
            updateSignInButtonUI();
          });
    }
  }

  /**
   * Function called when clicking the "Verify Code" button.
   */
  function onVerifyCodeSubmit(e) {
    e.preventDefault();
    if (!!getCodeFromUserInput()) {
      window.verifyingCode = true;
      updateVerifyCodeButtonUI();
      var code = getCodeFromUserInput();
      window.confirmationResult.confirm(code).then(async function (result) {
        // User signed in successfully.
        var user = result.user;
        window.verifyingCode = false;
        window.confirmationResult = null;
        var lineProfile = await liff.getProfile()

        user = { ...user, lineProfile: lineProfile}

        await fetch(window.location.href.includes('ngrok') ? 'https://e573-27-55-86-69.ap.ngrok.io/tamniyombot65-eafd4/us-central1/firebasehook/phoneuser' : '/phoneuser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          })
          .then(res => {
              if (res.status === 200) {
                console.log(JSON.stringify(res));
                console.log(`user saved`);
                updateVerificationCodeFormUI();
                }
            })
            .then(_ => authenticate(user))
          .catch(err => window.alert(err))

      }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        console.error('Error while checking the verification code', error);
        window.alert('Error while checking the verification code:\n\n'
            + error.code + '\n\n' + error.message);
        window.verifyingCode = false;
        updateSignInButtonUI();
        updateVerifyCodeButtonUI();
      });
    }
  }

  /**
   * Cancels the verification code input.
   */
  function cancelVerification(e) {
    e.preventDefault();
    window.confirmationResult = null;
    updateVerificationCodeFormUI();
    updateSignInFormUI();
  }

  /**
   * Signs out the user when the sign-out button is clicked.
   */
  function onSignOutClick() {
    firebaseAuth.signOut();
  }

  /**
   * Reads the verification code from the user input.
   */
  function getCodeFromUserInput() {
    return document.getElementById('verification-code').value;
  }

  /**
   * Reads the phone number from the user input.
   */
  function getPhoneNumberFromUserInput() {
    return document.getElementById('phone-number').value;
  }

  /**
   * Returns true if the phone number is valid.
   */
  function isPhoneNumberValid() {
    var pattern = /^\+[0-9\s\-\(\)]+$/;
    var phoneNumber = getPhoneNumberFromUserInput();
    return phoneNumber.search(pattern) !== -1;
  }

  /**
   * Re-initializes the ReCaptacha widget.
   */
  function resetReCaptcha() {
      console.log('checking recaptcha');
    if (typeof window.recaptchaVerifier  !== 'undefined'
        && typeof window.recaptchaWidgetId !== 'undefined') {

            console.log('resetting recaptcha');
        window.recaptchaVerifier.clear() //.reset(window.recaptchaWidgetId);
    }
  }

  /**
   * Updates the Sign-in button state depending on ReCAptcha and form values state.
   */
  function updateSignInButtonUI() {
    document.getElementById('sign-in-button').disabled =
        !isPhoneNumberValid()
        || !!window.signingIn;
  }

  /**
   * Updates the Verify-code button state depending on form values state.
   */
  function updateVerifyCodeButtonUI() {
    document.getElementById('verify-code-button').disabled =
        !!window.verifyingCode
        || !getCodeFromUserInput();
  }

  /**
   * Updates the state of the Sign-in form.
   */
  function updateSignInFormUI() {
    if (firebaseAuth.currentUser || window.confirmationResult) {
      document.getElementById('sign-in-form').style.display = 'none';
    } else {
      resetReCaptcha();
      document.getElementById('sign-in-form').style.display = 'block';
    }
  }

  /**
   * Updates the state of the Verify code form.
   */
  function updateVerificationCodeFormUI() {
    if (!firebaseAuth.currentUser && window.confirmationResult) {
      document.getElementById('verification-code-form').style.display = 'block';
    } else {
      document.getElementById('verification-code-form').style.display = 'none';
    }
  }

  /**
   * Updates the state of the Sign out button.
   */
  function updateSignOutButtonUI() {
    if (firebaseAuth.currentUser) {
        setPageTitle('Welcome')
      document.getElementById('sign-out-button').style.display = 'block';
    } else {
      document.getElementById('sign-out-button').style.display = 'none';
    }
  }

  /**
   * Updates the Signed in user status panel.
   */
  function updateSignedInUserStatusUI() {
    var user = firebaseAuth.currentUser;
    if (user) {
      document.getElementById('sign-in-status').textContent = 'Signed in';
      document.getElementById('account-details').textContent = JSON.stringify(user, null, '  ');
    } else {
      document.getElementById('sign-in-status').textContent = 'Signed out';
      document.getElementById('account-details').textContent = 'null';
    }
  }

    return (<Page
        pageTitle={pageTitle}
        onBackClick={() => {
          navigate(-1)
        }}
      >
        <CustomPaper elevation={6}>
          <div
            className={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: `100%`,
            }}
          >

        <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >

            <Typography component="h1" variant="h5">
              {pageTitle}
            </Typography>

            <Avatar
              alt="VTD Logo"
              src="assets/images/cropped-logo2.png"
              sx={{ width: 56, height: 72 }}
              variant="square"
            />
          </Box>

            <form
            id="sign-in-form"
              style={{ marginTop: theme.spacing(1) }}
              noValidate
            >
              <TextField
                value={phoneNumber}
                onInput={(e) => setphoneNumber(e.target.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phone-number"
                label={intl.formatMessage({
                  id: 'phoneNumber',
                  defaultMessage: 'Phone Number',
                })}
                name="phoneNumber"
                autoFocus
              />

              <Button
                id="sign-in-button"
                type="button"
                fullWidth
                
                variant="contained"
                color="primary"
                style={{ margin: theme.spacing(3, 0, 2) }}
              >
                {intl.formatMessage({ id: 'sign_up', defaultMessage: 'Send OTP' })}
              </Button>

              <span id="sign-in-status">Unknown</span>

            </form>
            <Button
                id="sign-out-button"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: theme.spacing(3, 0, 2) }}
              >
                {intl.formatMessage({ id: 'sign_out', defaultMessage: 'Sign Out' })}
              </Button>
            <form
            id="verification-code-form"
            >
                <TextField
                    id="verification-code"
                ></TextField>
                <Button
                    id="verify-code-button"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: theme.spacing(3, 0, 2) }}
                  >
                    {intl.formatMessage({ id: 'verify_code', defaultMessage: 'Verify Code' })}
                  </Button>
                  <Button
                    id="cancel-verify-code-button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: theme.spacing(3, 0, 2) }}
                  >
                    {intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
                  </Button>
                </form>

          </div>
        </CustomPaper>

        <Typography id="account-details" variant="caption" display="block" gutterBottom / >

      </Page>
  );
}

export default PhoneSignUp

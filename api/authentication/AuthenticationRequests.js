import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GoogleSigninCredentials} from '../../credentials/CloudCredentials/GoogleCloud';
import auth from '@react-native-firebase/auth';
import {databaseLinks} from '../../credentials/firebaseCredentials/FirebaseDatabaseLinks';
import {apiRequest} from '../global/BaseApiRequestes';

export const loginWithGoogle = async () => {
  try {
    const hasGoogleSignIn = GoogleSignin.hasPlayServices();
    const googleSignInOptions = GoogleSignin.configure({
      iosClientId: GoogleSigninCredentials.IOS_CLIENT_ID,
      webClientId: GoogleSigninCredentials.WEB_CLIENT_ID,
      offlineAccess: true,
    });
    const response = await GoogleSignin.signIn(googleSignInOptions);
    if (!response) {
      return {
        isError: true,
        error: 'noResponse',
      };
    }
    const credential = auth.GoogleAuthProvider.credential(response.idToken);
    const fireResponse = await auth().signInWithCredential(credential);
    const objectToReturn = {
      email: fireResponse.email,
      isNewUser: fireResponse.additionalUserInfo.isNewUser,
      emailVerified: fireResponse.user.emailVerified,
      firstName: fireResponse.additionalUserInfo.profile.given_name,
      lastName: fireResponse.additionalUserInfo.profile.family_name,
    };
    return {
      isError: false,
      response: {...objectToReturn},
    };
  } catch (error) {
    console.log('-----error');
    console.log(error.code);
    return {
      isError: true,
      error,
    };
  }
};

export const loginWithEmail = async userDetails => {
  console.log('-----userDetails');
  console.log(userDetails);
  try {
    const fireResponse = await auth().signInWithEmailAndPassword(
      userDetails.email,
      userDetails.password,
    );
    console.log('-----fireResponse');
    console.log(fireResponse);
    const objectToReturn = {
      email: userDetails.email,
      emailVerified: fireResponse.user.emailVerified,
      // varification,
    };
    return {
      isError: false,
      response: {...objectToReturn},
    };
  } catch (error) {
    console.log('-----error');
    console.log(error.code);
    return {
      isError: true,
      error: error.code,
    };
  }
};

export const sendOtp = async number => {
  console.log('number in sendOtp api');
  console.log(number);
  try {
    const fireResponse = await auth().signInWithPhoneNumber(number);

    return {
      isError: false,
      response: fireResponse,
    };
  } catch (error) {
    console.log('-----error----');
    console.log(error.code);
    return {
      isError: true,
      error: error.code,
    };
  }
};

// adityat.tagline@gmail.com

export const signinToFirebase = async userDetails => {
  console.log('userDetails---');
  console.log(userDetails);
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${userDetails.phone}.json`;
    const res = await apiRequest(url, 'GET');
    if (!res.isError) {
      return {
        isError: true,
        error: 'phone/already-registered',
      };
    }
    if (!!res.isError && res.error != 'noData') {
      return {
        isError: true,
        error: res.error,
      };
    }

    const sendOtpCode = await sendOtp('+91' + userDetails.phone);
    if (sendOtpCode.isError) {
      return {
        isError: true,
        error: sendOtpCode.error,
      };
    }

    const createUser = await auth().createUserWithEmailAndPassword(
      userDetails.email,
      userDetails.password,
    );
    console.log('createUser');
    console.log(createUser);

    const fireSignInResponse = await auth().signInWithEmailAndPassword(
      userDetails.email,
      userDetails.password,
    );

    const addUser = await apiRequest(url, 'POST', {
      phone: userDetails.phone,
      email: userDetails.email,
    });

    if (addUser.isError) {
      return {
        isError: true,
        error: addUser.error,
      };
    }

    const objectToReturn = {
      email: userDetails.email,
      password: userDetails.password,
      phone: userDetails.phone,
      sendOtpCode,
      // uid: fireResponse.user.uid,
      // varification,
    };

    return {
      isError: false,
      response: {...objectToReturn},
    };
  } catch (error) {
    console.log('error---asdasdasdasdasd');
    console.log(error);
    return {
      isError: true,
      error: error.code,
    };
  }
};

export const addUserToDatabase = async userDetails => {
  try {
    const url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${userDetails.phone}.json`;
    const storeToDatabase = apiRequest(url, 'POST', {...userDetails});
    return {
      isError: false,
      response: storeToDatabase,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const logoutFromAuth = async () => {
  try {
    const logoutResponse = await auth().signOut();
    return {
      isError: false,
      response: logoutResponse,
    };
  } catch (error) {
    return {
      isError: true,
      error: error.code,
    };
  }
};

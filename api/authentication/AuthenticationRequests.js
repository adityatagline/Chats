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
    console.log(fireResponse);

    let username = fireResponse.user.email
      .replaceAll('-', '---')
      .replaceAll('.', '-')
      .replaceAll('@', '--');
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    const user = await apiRequest(url, 'GET');

    // console.log('\n\nuser');
    // console.log(user);

    if (!!user.error && user.error != 'noData') {
      return {
        isError: true,
        error: user.error,
      };
    }

    if (user.isError && user.error == 'noData') {
      const sendUser = await apiRequest(url, 'PUT', {
        email: fireResponse.user.email,
        username: username,
        isNewUser: true,
        profilePhoto: !!fireResponse.user.photoURL
          ? fireResponse.user.photoURL
          : '',
      });
      if (!!sendUser.isError) {
        return {
          isError: true,
          error: sendUser.error,
        };
      }
    }

    let objectToReturn = {
      email: fireResponse.user.email,
      isNewUser: !!user.isError && user.error == 'noData' ? true : false,
      emailVerified: fireResponse.user.emailVerified,
      firstName: fireResponse.additionalUserInfo.profile.given_name,
      lastName: fireResponse.additionalUserInfo.profile.family_name,
      username,
    };

    if (!user.isError) {
      objectToReturn = {
        ...objectToReturn,
        ...user.data,
        profilePhoto: !!fireResponse.user.photoURL
          ? fireResponse.user.photoURL
          : '',
      };
    }

    // console.log('\n\nobjectToReturn');
    // console.log(objectToReturn);

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

export const loginWithEmail = async userDetails => {
  console.log('-----userDetails');
  console.log(userDetails);
  try {
    const fireResponse = await auth().signInWithEmailAndPassword(
      userDetails.email,
      userDetails.password,
    );
    let username = fireResponse.user.email
      .replaceAll('-', '---')
      .replaceAll('.', '-')
      .replaceAll('@', '--');
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    const getUserStatus = await apiRequest(url, 'GET');
    if (getUserStatus.isError && getUserStatus.error != 'noData') {
      return {
        isError: true,
        error: getUserStatus.error,
      };
    }

    let objectToReturn = {
      email: userDetails.email,
      emailVerified: fireResponse.user.emailVerified,
      username,
      // varification,
    };
    if (!getUserStatus.isError) {
      objectToReturn = {
        ...objectToReturn,
        ...getUserStatus.data,
      };
    }
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
    console.log('fireResponse   - - - - -');
    console.log(fireResponse);
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

    const addUser = await apiRequest(url, 'PUT', {
      phone: userDetails.phone,
      email: userDetails.email,
    });
    if (addUser.isError) {
      return {
        isError: true,
        error: addUser.error,
      };
    }

    let username = userDetails.email
      .replaceAll('-', '---')
      .replaceAll('.', '-')
      .replaceAll('@', '--');

    console.log(username);
    url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    const addUserCredentials = await apiRequest(url, 'PUT', {
      phone: userDetails.phone,
      email: userDetails.email,
      phoneVerified: false,
    });

    if (addUserCredentials.isError) {
      return {
        isError: true,
        error: addUserCredentials.error,
      };
    }

    const objectToReturn = {
      email: userDetails.email,
      password: userDetails.password,
      phone: userDetails.phone,
      sendOtpCode,
      username,
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

export const verifyTheUser = async userDetails => {
  try {
    const url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${userDetails.username}/phoneVerified.json`;
    const url2 = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${userDetails.username}/isNewUser.json`;
    const storeToDatabase = apiRequest(url, 'PUT', true);
    const storeToDatabase2 = apiRequest(url2, 'PUT', true);

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

export const addUserToDatabase = async (username, userDetails) => {
  try {
    const url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    const storeToDatabase = await apiRequest(url, 'PUT', {...userDetails});
    return {
      isError: false,
      response: storeToDatabase.data,
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

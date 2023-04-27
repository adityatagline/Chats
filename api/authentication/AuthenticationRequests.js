import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GoogleSigninCredentials} from '../../credentials/CloudCredentials/GoogleCloud';
import auth from '@react-native-firebase/auth';
import {databaseLinks} from '../../credentials/firebaseCredentials/FirebaseDatabaseLinks';
import {apiRequest} from '../global/BaseApiRequestes';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // console.log(fireResponse);

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
        profilePhotoObject: !!fireResponse.user.photoURL
          ? {uri: fireResponse.user.photoURL}
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
      email: !user.isError ? user.data?.email : fireResponse.user.email,
      isNewUser: !!user.isError && user.error == 'noData' ? true : false,
      emailVerified: !user.isError
        ? user.data?.emailVerified
        : fireResponse.user.emailVerified,
      firstName: !user.isError
        ? user.data?.firstName
        : fireResponse.additionalUserInfo.profile.given_name,
      lastName: !user.isError
        ? user.data?.lastName
        : fireResponse.additionalUserInfo.profile.family_name,
      username: !user.isError ? user.data?.username : username,
    };

    if (!user.isError) {
      objectToReturn = {
        ...objectToReturn,
        ...user.data,
        profilePhotoObject: !!fireResponse.user.photoURL
          ? {uri: fireResponse.user.photoURL}
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
    // console.log('-----error');
    // console.log(error.code);
    return {
      isError: true,
      error: error.code,
    };
  }
};

export const loginWithPhone = async userDetails => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${userDetails.phone}.json`;
    // console.log({url});
    let userCred = await apiRequest(url, 'GET');
    if (!!userCred.isError) {
      return userCred.error == 'noData'
        ? {
            ...userCred,
            error: 'auth/noData',
          }
        : {
            ...userCred,
          };
    }
    // console.log({userCred});

    const fireResponse = await auth().signInWithEmailAndPassword(
      userCred.data.email,
      userDetails.password,
    );
    // console.log({fireResponse});

    url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${userCred.data.username}.json`;

    const getUserStatus = await apiRequest(url, 'GET');

    if (!!getUserStatus.isError) {
      return {
        isError: true,
        response: getUserStatus.error,
      };
    }
    let tokenArray = !!getUserStatus?.data?.token
      ? getUserStatus?.data?.token
      : [];
    let tokenStored = await AsyncStorage.getItem('chatsToken');
    if (!!tokenStored) {
      tokenArray = tokenArray.filter(item => item != tokenStored);
    }

    const sendToken = await apiRequest(url, 'PUT', {
      ...getUserStatus.data,
      token: [tokenStored, ...tokenArray],
    });

    // console.log('running last');
    // console.log({
    //   returns: {
    //     isError: false,
    //     response: {...getUserStatus.data, username: userCred.data.username},
    //   },
    // });

    return {
      isError: false,
      response: {...getUserStatus.data, username: userCred.data.username},
    };
  } catch (error) {
    console.log('-----error');
    console.log(error);
    return {
      isError: true,
      error: error.code,
    };
  }
};

export const sendOtp = async number => {
  // console.log('number in sendOtp api');
  // console.log(number);
  try {
    const fireResponse = await auth().signInWithPhoneNumber(number);

    return {
      isError: false,
      response: fireResponse,
    };
  } catch (error) {
    // console.log('-----error----');
    // console.log(error.code);
    return {
      isError: true,
      error: error.code,
    };
  }
};

// adityat.tagline@gmail.com

export const signinToFirebase = async userDetails => {
  let username = userDetails.email
    .replaceAll('-', '---')
    .replaceAll('.', '-')
    .replaceAll('@', '--');
  // console.log('userDetails---');
  // console.log(userDetails);
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
    // console.log('createUser');
    // console.log(createUser);

    const fireSignInResponse = await auth().signInWithEmailAndPassword(
      userDetails.email,
      userDetails.password,
    );

    const addUser = await apiRequest(url, 'PUT', {
      phone: userDetails.phone,
      email: userDetails.email,
      username,
    });
    if (addUser.isError) {
      return {
        isError: true,
        error: addUser.error,
      };
    }

    // console.log(username);
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
      sendOtpCode: sendOtpCode.response,
      username,
      // uid: fireResponse.user.uid,
      // varification,
    };

    return {
      isError: false,
      response: {...objectToReturn},
    };
  } catch (error) {
    // console.log('error---asdasdasdasdasd');
    // console.log(error);
    return {
      isError: true,
      error: error.code,
    };
  }
};

export const checkForExistingUser = async userDetails => {
  // console.log('userDetails---');
  // console.log(userDetails);
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${userDetails.phone}.json`;
    const res = await apiRequest(url, 'GET');
    const username = res.data.username;
    url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    const res2 = await apiRequest(url, 'GET');

    return {
      isError: false,
      response: {phoneVerified: res2.data.phoneVerified},
    };
  } catch (error) {
    // console.log('error---asdasdasdasdasd');
    // console.log(error);
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

export const addUserToDatabase = async (
  olduserName,
  newUserName,
  userDetails,
) => {
  try {
    const oldurl = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${olduserName}.json`;
    const oldReference = await apiRequest(oldurl, 'GET');
    // console.log({oldReference, userDetails});
    let {username, ...otherProps} = {
      ...oldReference.data,
      ...userDetails,
    };

    const newurl = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${newUserName}.json`;
    const storeToDatabase = await apiRequest(newurl, 'PUT', {
      ...otherProps,
    });
    const deleteUser = await apiRequest(oldurl, 'DELETE');
    const credUrl = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${userDetails.phone}.json`;
    const creds = await apiRequest(credUrl, 'GET');

    if (!!creds.isError && creds.error != 'noData') {
      return {
        isError: true,
        error,
      };
    }
    if (!!creds.data) {
      const putTocredetial = await apiRequest(credUrl, 'PUT', {
        ...creds.data,
        username: newUserName,
      });
    }
    return {
      isError: false,
      response: {...storeToDatabase.data, username: newUserName},
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

export const checkUserName = async userName => {
  try {
    const checkDb = await apiRequest(
      `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${userName}.json`,
      'GET',
    );
    // console.log({checkDb});
    return checkDb;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const updateProfileOnFirebase = async (data, username) => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    let updateRes = await apiRequest(url, 'PUT', {...data});
    if (!!updateRes.isError) {
      return {
        ...updateRes,
      };
    }
    return {
      isError: false,
      data: updateRes.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const getPublicCredential = async phone => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${phone}.json`;
    let response = await apiRequest(url, 'GET');
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const logoutUserFromDB = async username => {
  try {
    let response = await auth().signOut();
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
    let removeToken = await apiRequest(url, 'GET');
    console.log({url, removeToken});
    if (!!removeToken.isError) {
      console.log({logoutEr: removeToken});
      return removeToken;
    }

    let tokenArray = !!removeToken?.data?.token ? removeToken?.data?.token : [];
    let tokenStored = await AsyncStorage.getItem('chatsToken');
    if (!!tokenStored) {
      tokenArray = tokenArray.filter(item => item != tokenStored);
    }
    removeToken = await apiRequest(url, 'PUT', {
      ...removeToken.data,
      token: tokenArray,
    });
    if (!!removeToken.isError) {
      console.log({logoutEr2: removeToken});
      return removeToken;
    }
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const changePassword = async email => {
  try {
    const resetRes = await auth().sendPasswordResetEmail(
      'adityat.tagline@gmail.com',
    );
    return {
      isError: false,
      data: resetRes,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const getTokens = async username => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}/token.json`;
    let response = await apiRequest(url, 'GET');
    return response;
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

import {databaseLinks} from '../../credentials/firebaseCredentials/FirebaseDatabaseLinks';
import {apiRequest} from '../global/BaseApiRequestes';

export const getUserHomepageChats = async username => {
  try {
    let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/userHomepageChats/${username}.json`;
    const response = await apiRequest(url, 'GET');
    if (response.isError) {
      return {
        isError: true,
        error: response.error,
      };
    }
    return {
      isError: false,
      response: response.data,
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const checkForUserInRecord = async contactArray => {
  // console.log('runnin');
  let contactArrayToReturn = [];
  try {
    for (let i = 0; i < contactArray.length; i++) {
      let phonenumbers = contactArray[i].phoneNumbers;
      let contact = contactArray[i];
      // console.log({contact});
      // console.log({phonenumbersher: phonenumbers});
      if (!phonenumbers) {
        continue;
      }
      for (let j = 0; j < phonenumbers.length; j++) {
        let phonenumber = phonenumbers[j].number.replaceAll(' ', '');
        phonenumber = phonenumber.replaceAll('(', '');
        phonenumber = phonenumber.replaceAll(')', '');
        phonenumber = phonenumber.replaceAll('-', '');
        phonenumber = phonenumber.replaceAll('+', '');
        if (!phonenumber) {
          continue;
        }
        phonenumber = phonenumber.slice(
          phonenumber.length - 10,
          phonenumber.length,
        );
        // console.log({phonenumberFinal: phonenumber});
        let url = `${databaseLinks.REALTIME_DATBASE_ROOT}/credentials/${phonenumber}.json`;
        const response = await apiRequest(url, 'GET');
        if (response.isError && response.error !== 'noData') {
          return {
            isError: true,
            error: response.error,
          };
        }
        if (!response.isError) {
          let username = response.data.email
            .replaceAll('-', '---')
            .replaceAll('.', '-')
            .replaceAll('@', '--');
          url = `${databaseLinks.REALTIME_DATBASE_ROOT}/users/${username}.json`;
          const response2 = await apiRequest(url, 'GET');
          if (response2.isError && response2.error !== 'noData') {
            return {
              isError: true,
              error: response2.error,
            };
          }
          if (!response2.isError) {
            contactArrayToReturn.push({
              email: response2.data.email,
              firstName: response2.data.firstName,
              lastName: response2.data.lastName,
              phone: response2.data.phone,
              profilePhoto: !!response2.data.profilePhoto
                ? response2.data.profilePhoto
                : '',
              contactName: `${
                !!contact.givenName ? contact.givenName : ' - '
              } ${!!contact.familyName ? contact.familyName : ' - '}`,
            });
          }
        }
      }
    }

    return {
      isError: false,
      users: [...contactArrayToReturn],
    };
  } catch (error) {
    return {
      isError: true,
      error,
    };
  }
};

export const apiRequest = async (url, method, data, myHeaders) => {
  try {
    let headers;

    if (!myHeaders) {
      headers = new Headers();
      headers.append('Content-Type', 'application/json');
    } else {
      headers = {...myHeaders};
    }

    const raw = JSON.stringify(data);
    let requestOptions = {
      method: !!method ? method : 'GET',
      headers: headers,
      body: method == 'GET' ? null : raw,
      redirect: 'follow',
    };

    const response = await fetch(`${url}`, requestOptions);
    const responsedata = await response.json();

    if (!responsedata) {
      return {
        isError: true,
        error: 'noData',
      };
    }
    return {
      isError: false,
      data: responsedata,
    };
  } catch (error) {
    // console.log('error-aksjdksa');
    // console.log(error);
    return {
      isError: true,
      error: error.toString(),
    };
  }
};

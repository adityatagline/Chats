export async function sendmsg(sendertoken, title, subtitle, body) {
  if (!sendertoken) {
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAApP2aARY:APA91bE31LobefkHzMifyB2uUUtiFS6iSJnHzT3Lb2X6GkVrIIvjNS0XHJmrjDQ_IR1oKi-HOH3w77Fi4kfFKaikUcYbqsgvpk2qXIWZ1Q_uOpbPWzhQ8gk_ZneCLr6-mtkySmgMHs23',
  );

  var raw = JSON.stringify({
    data: {},
    to: sendertoken,
    notification: {
      title,
      subtitle,
      body,
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  await fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    // .then(result => console.log(result))
    .catch(error => console.log('error', error));
  // console.log("\n\n\n\nrun complete of fetch request\n\n\n\n");
}

export function sendgpmsg(tokenArray, title, subtitle, data, body) {
  try {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'key=AAAApP2aARY:APA91bE31LobefkHzMifyB2uUUtiFS6iSJnHzT3Lb2X6GkVrIIvjNS0XHJmrjDQ_IR1oKi-HOH3w77Fi4kfFKaikUcYbqsgvpk2qXIWZ1Q_uOpbPWzhQ8gk_ZneCLr6-mtkySmgMHs23',
    );

    function getraws(devicetoken) {
      return JSON.stringify({
        data: !!data ? data : {},
        to: devicetoken,
        notification: {
          title,
          subtitle,
          body,
          vibrate: 1,
          sound: 1,
          show_in_foreground: true,
          priority: 'high',
          content_available: true,
        },
      });
    }

    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };

    let reqarr = [];

    for (let i = 0; i < tokenArray.length; i++) {
      if (!tokenArray[i]) {
        continue;
      }
      reqarr.push(
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: myHeaders,
          body: getraws(tokenArray[i]),
          redirect: 'follow',
        })
          .then(response => response.text())
          // .then(result => console.log("result of"+i+"th req\n"+result))
          .catch(error => console.log('error in ' + i + 'th req', error)),
      );
    }

    let allfetches = Promise.all(reqarr).then(
      succ => {
        console.log({succ});
      },
      rejj => {
        console.log({rejj});
      },
    );
  } catch (error) {
    console.log({errorInNoti: error});
  }
}

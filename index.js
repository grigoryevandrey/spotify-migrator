const axios = require('axios');

const accessToken = process.env.ACCESS_TOKEN;

const getToken = async () => {
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      grant_type: 'client_credentials',
    },
    method: 'POST',
  };

  try {
    const response = await axios(options);

    return response?.data?.access_token;
  } catch (e) {
    throw new Error(
      `Can not get token, error: ${e?.response?.data?.error}, status: ${e?.response?.status}`,
    );
  }
};

const getSongsFromPlaylist = async () => {
  const options = {
    url: 'https://api.spotify.com/v1/playlists/6L5dRyWN6YWGJU2UFFntgP/tracks?offset=1000&limit=100',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await axios(options);

  console.log(Object.keys(response?.data));
  console.log(response?.data?.items?.length);
  console.log(response?.data?.items[0]);
  // console.log(response?.data?.items);
};

const getPlaylists = async () => {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=20',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await axios(options);

  console.log(response.data.items.length);
  return response.data.items;
  console.log(Object.keys(response.data));
  console.log(response.data.items);
};

const processing = async () => {
  // const token = await getToken();

  const playlists = await getPlaylists();

  console.log(playlists);

  // const songs = await getSongsFromPlaylist();
};

processing();

// request.post(authOptions, function (error, response, body) {
//   if (!error && response.statusCode === 200) {
//     // use the access token to access the Spotify Web API
//     const token = body.access_token;
//     const options = {
//       url: 'https://api.spotify.com/v1/users/fe28bu2f6fe2ymuqy0vb6wez0',
//       headers: {
//         Authorization: 'Bearer ' + token,
//       },
//       json: true,
//     };

//     request.get(options, function (error, response, body) {
//       console.log(body);

//       const options = {
//         url: 'https://api.spotify.com/v1/me/albums',
//         headers: {
//           Authorization:
//             'Bearer ' +
//             'BQB4wAjVcp0CEdW_l0o6Cq9qYoYVN7qQ7AlWUtfBeRUajwPC9mWV2SbmnfV4HTQHASMqdKVp85',
//         },
//         json: true,
//       };

//       request.get(options, (err, res, body) => {
//         console.log(body);
//       });
//     });
//   }
// });

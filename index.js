const fs = require('fs');
const axios = require('axios');

const accessToken = process.env.ACCESS_TOKEN;

const handleAsyncOperation = async (options) => {
  try {
    const response = await axios(options);

    return response?.data;
  } catch (e) {
    throw new Error(
      `Can not fetch url ${options?.url}, error: ${JSON.stringify(
        e?.response?.data?.error,
      )}, status: ${e?.response?.status}`,
    );
  }
};

const getSongs = async (playlistId, offset = 0) => {
  const options = {
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=100`,
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await handleAsyncOperation(options);

  return response?.items?.map((song) => {
    Reflect.deleteProperty(song.track.album, 'available_markets');
    Reflect.deleteProperty(song.track, 'available_markets');

    return song;
  });
};

const extractSongsFromPlaylist = async (playlistId) => {
  let songs = await getSongs(playlistId);

  let offset = 100;

  const totalSongs = [...songs];

  while (songs.length > 0) {
    songs = await getSongs(playlistId, offset);

    offset += 100;

    totalSongs.push(...songs);
  }

  return totalSongs;
};

const getPlaylists = async () => {
  const options = {
    url: 'https://api.spotify.com/v1/me/playlists?limit=50',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await handleAsyncOperation(options);

  return response?.items;
};

const fetchSavedTracks = async (offset = 0) => {
  const options = {
    url: `https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`,
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const response = await handleAsyncOperation(options);

  return response?.items?.map((song) => {
    Reflect.deleteProperty(song.track.album, 'available_markets');
    Reflect.deleteProperty(song.track, 'available_markets');

    return song;
  });
};

const getSavedTracks = async () => {
  let songs = await fetchSavedTracks();
  let offset = 50;

  const totalSongs = [...songs];

  while (songs.length > 0) {
    songs = await fetchSavedTracks(offset);

    offset += 50;

    totalSongs.push(...songs);
  }

  return totalSongs;
};

const processing = async () => {
  const library = {};

  const playlists = await getPlaylists();

  for (const playlist of playlists) {
    const { name, id } = playlist;

    console.log(`Extracting playlist ${name}...\n`);

    const songs = await extractSongsFromPlaylist(id);

    const key = `${name}_${id}`.replace(/[ +-]/gim, '_');

    library[key] = songs;

    console.log(
      `Extracted ${songs?.length || 0} songs from ${name} playlist.\n`,
    );
  }

  const savedTracks = await getSavedTracks();

  console.log(`Extracted ${savedTracks.length} songs from Liked tracks.`);

  library.Liked_Tracks = savedTracks;

  for (key in library) {
    const formatted = JSON.stringify(library[key]);
    const path = `${__dirname}/extracted/${key}_${Date.now()}.json`;

    fs.writeFile(path, formatted, (err) => {
      if (err) {
        console.error(err);
        console.error('Error writing result...');
      }
    });
  }
};

processing();

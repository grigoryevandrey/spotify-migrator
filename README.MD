# Spotify migration

Service that extracts data from Spotify to JSON, using Spotify API

## Usage

To use this service you need to have [Node.js](https://nodejs.org/en/) installed.

1. Clone this repository
2. Run `npm install` in the project folder
3. Generate your access token [here](https://developer.spotify.com/console/get-current-user-playlists/), usining "Get Token" button at the middle center of the page.
4. Set your access token to an environment variable `export ACCESS_TOKEN=<token>`
5. Run `npm start`
6. After completion, you will have all your albums exported in JSON into `./extracted` folder.

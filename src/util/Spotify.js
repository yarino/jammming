const client_id = 'd8bb9014d02b45fbadf489c7c867fcdc';
const spotifyAuthBaseURI = 'https://accounts.spotify.com/authorize';
const redirectURI = 'http://jammming-playlists.surge.sh'; 
//const redirectURI = 'http://localhost:3000/';

const spotifyAPIURIBase = 'https://api.spotify.com/v1/'

let access_token;

const Spotify = { //general Spotify const that holds the methods to call

    getAccessToken(){ //method to get the access token out from the url
        if(access_token){ //checks if access token already generated if yes - returns it
            return access_token;
        }

        const matchAccessToken = window.location.href.match(/access_token=([^&]*)/); //retrieve the access token from the url
        const matchTokenExpires = window.location.href.match(/expires_in=([^&]*)/); //retrive the expiry of the token from the url

        if(matchAccessToken && matchTokenExpires) { //checks if got both the access token and token expiry
            access_token = matchAccessToken[1];
            const expiry = Number(matchTokenExpires[1]);
            window.setTimeout(() => access_token = '', expiry * 1000);
            window.history.pushState('Access Token', null, '/');
            return access_token;
        } else { // if didnt get the token and expiry sets the authorize link with all the params and calls it in the url to retrieve them
            const spotifyAuthorizeURI = `${spotifyAuthBaseURI}?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = spotifyAuthorizeURI;
        }
    },

    search(userTerm){ //process the request of search with the search term passed from the user
        const accessToken = Spotify.getAccessToken(); //gets the token using the previous method
        const searchRequest = `https://api.spotify.com/v1/search?type=track&q=${userTerm}`; //base request link to retrieve search term

        return fetch(searchRequest,{ //calls a fetch function that will request spotify for the tracks with that search term
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => { //return a promise json with the tracks for the search term
            return response.json();
        }).then(jsonResponse => { //decide what to do with json
            if (!jsonResponse.tracks) { //if json returns with no tracks object return empty array
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({ //if got the tracks break out the object elements below
                id: track.id,
                name:track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });

    },

    savePlaylist(playlistName, trackUris) { //saves the playlist in the user's spotify account
        if (!playlistName || !trackUris.length) { //checks if there's no playlist name or there are no tracks - return nothing
            return;
        }

        const accessToken = Spotify.getAccessToken(); //retrieve the access token
        const headers = { Authorization: `Bearer ${accessToken}` } //sets header for use in fetch calls 
        let userId; //sets userID 

        return fetch(`${spotifyAPIURIBase}me`, {headers: headers} //calls a fetch GET function to get the userid of the active user
            ).then(response => response.json()
            ).then(jsonResponse => { //saves the json result and extract the id from it into the userId variable
            userId = jsonResponse.id;
            return fetch(`${spotifyAPIURIBase}users/${userId}/playlists`, { //calls a fetch POST function to the users account to post the playlist into the account
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`${spotifyAPIURIBase}users/${userId}/playlists/${playlistId}/tracks`, { //calls a fetch POST function to insert the tracks selected into the playlist saved to the user account
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                });
            });
        });
    }
}

export default Spotify;
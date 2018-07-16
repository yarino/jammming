import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
    constructor(props){
        super(props);

        //sets the initial states
        this.state = {
            searchResults: [],
            playlistName: `New Playlist`,
            playlistTracks: []

        };

        //set binding for this on methods
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    
    addTrack(track){ // check if the song is in the playlist tracks if not it will add it
        if(this.state.playlistTracks.findIndex(_track => _track.id === track.id) === -1) {
            let tracks = this.state.playlistTracks
            tracks.push(track);
            this.setState({playlistTracks: tracks})
        }
    }

    removeTrack(track){ //removes Track from playlist
        const trackIndex = this.state.playlistTracks.findIndex(_track => _track.id === track.id);
        if(trackIndex > -1) {
            let tracks = this.state.playlistTracks;
            tracks.splice(trackIndex,1);
            this.setState({playlistTracks: tracks})
        }
    }

    updatePlaylistName(name){ // updates the playlist name
        this.setState({playlistName: name});
    }

    savePlaylist() { //saves playlists created 
        const trackUris = this.state.playlistTracks.map(track => track.uri)
        Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
          this.setState(
            {
              playlistName: 'New Playlist',
              playlistTracks: []
            })
        })
      }

    search(searchTerm) { // process the search term from the user input into spotify request
        Spotify.search(searchTerm).then(tracks => {
          this.setState({
            searchResults: tracks
          })
        });
    }

    render(){ //renders the app that calls additional components
        return(
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                        <SearchBar onSearch={this.search} />
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                        <Playlist playlistTracks={this.state.playlistTracks} 
                                  playlistName={this.state.playlistName}  
                                  onRemove={this.removeTrack}
                                  onNameChange = {this.updatePlaylistName}
                                  onSave = {this.savePlaylist}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
import React from 'react';
import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component{
    constructor(props){ //constructor binding and passing props
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    handleNameChange(event){ //handles event listener for name change
        this.props.onNameChange(event.target.value); 
    }

    render(){ //renders the playlist components and calls additional components
        return(
            <div className="Playlist">

            <input defaultValue="New Playlist" onChange={this.handleNameChange}/> 
                 <TrackList tracks={this.props.playlistTracks} 
                            onRemove={this.props.onRemove} 
                            isRemoval={true}/> 
            <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        )
    }
}

export default Playlist;
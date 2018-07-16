import React from 'react';
import './Track.css';

class Track extends React.Component{
    constructor(props) { //constructor binding, states and passing props
        super(props);

        this.removeTrack = this.removeTrack.bind(this);
        this.addTrack = this.addTrack.bind(this);
    }
    
    removeTrack(){ //removes the track from the playlist
        this.props.onRemove(this.props.track);
    }
    
    addTrack(){ //adds the track to the playlist
        this.props.onAdd(this.props.track)
    }

    renderAction(){ //checks if track is in playlist or results to put the right symbol
        if(this.props.onAdd){
            return <a className='Track-action' onClick={this.addTrack}>+</a>
        } 
            
            return <a className='Track-action' onClick={this.removeTrack}>-</a>
    }
    
    render(){ //renders the track component that loads the different tracks
        return(
            <div className="Track">
            <div className="Track-information">
                 <h3>{this.props.track.name}</h3>
                <p>{this.props.track.artist} | {this.props.track.album}</p> 
            </div>
            {this.renderAction()}
            </div>
        )
    }
}

export default Track;
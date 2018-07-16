import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) { //constructor binding, states and passing props
        super(props);

        this.state = { //sets initial search term to blank
            searchTerm: ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search(){ //method that pass the searchterm forward
        this.props.onSearch(this.state.searchTerm);
    }

    handleTermChange(event){ //handles event listerner for change in search term
        this.setState({searchTerm: event.target.value})
    }

    render(){ //renders the searchbar componenets
        return(
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
                <a onClick={this.search}>SEARCH</a>
            </div>
        )
    }
}

export default SearchBar;
import React, {Component} from 'react';
import Votes from './components/votes';

const VOTINGAPP_ENDPOINT = process.env.REACT_APP_VOTINGAPP_ENDPOINT
if (!VOTINGAPP_ENDPOINT) {
    console.warn('REACT_APP_VOTINGAPP_ENDPOINT environment variable is not set. Votes will not be loaded or saved. Set this variable in your .env file.');
}
class App extends Component {

    state = {
        votes: []
    };

    loadVotes() {
        fetch(VOTINGAPP_ENDPOINT + '/api/getvotes')
            .then(res => res.json())
            .then((data) => {
                this.setState({ votes: Array.isArray(data) ? data : [] });
                console.log(data);
            })
            .catch(console.log)
    }

    vote(restaurant) {
        console.log('I voted ' + restaurant);
        if (!VOTINGAPP_ENDPOINT) {
            return;
        }
        fetch(VOTINGAPP_ENDPOINT + '/api/' + restaurant)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch(console.log)
        this.loadVotes();
    }

    render() {
        return (
            <>
            <Votes votes={this.state.votes} />
            {!VOTINGAPP_ENDPOINT && (
                <p>No voting API configured. Set REACT_APP_VOTINGAPP_ENDPOINT to load and save votes.</p>
            )}
            <div>
                <button className="btn btn-primary" type='button' onClick={() => this.vote('chipotle')}>
                Chipotle
                </button>
                <button className="btn btn-primary" type='button' onClick={() => this.vote('outback')}>
                Outback
                </button>
                <button className="btn btn-primary" type='button' onClick={() => this.vote('ihop')}>
                IHOP
                </button>
                <button className="btn btn-primary" type='button' onClick={() => this.vote('bucadibeppo')}>
                Buca di Beppo
                </button>
            </div>
            </>
        )
    }

    componentDidMount() {
        if (VOTINGAPP_ENDPOINT) {
            this.loadVotes();
        }
    }

}

export default App;

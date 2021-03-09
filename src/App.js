import React, {Component} from 'react';
import Votes from './components/votes';

const VOTINGAPP_ENDPOINT = process.env.REACT_APP_VOTINGAPP_ENDPOINT
if (!VOTINGAPP_ENDPOINT) {
    console.error('REACT_APP_VOTINGAPP_ENDPOINT environment variable is not set. Please set this variable in your .env file.');
    process.exit(1);
}
class App extends Component {

    vote(restaurant) {
        fetch(VOTINGAPP_ENDPOINT + '/api/' + restaurant)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
            });
        fetch(VOTINGAPP_ENDPOINT + '/api/getvotes')
            .then(res => res.json())
            .then((data) => {
                this.setState({ votes: data });
            })
        console.log('I voted ' + restaurant);
    }

    render() {
        return (
            <>
            <Votes votes={this.state.votes} />
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

    state = {
        votes: []
    };

    componentDidMount() {
        fetch(VOTINGAPP_ENDPOINT + '/api/getvotes')
            .then(res => res.json())
            .then((data) => {
                this.setState({ votes: data });
                console.log(data);
            })
            .catch(console.log)

    }

}

export default App;

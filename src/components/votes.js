import React from 'react'

const Votes = ({votes}) => {
    return (
        <div>
            <center><h1>Votes</h1></center>
            {votes.map((vote) => (
                <div className="card" key={vote.name}>
                    <div className="card-body">
                        <h5 className="card-title">{vote.name}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{vote.value}</h6>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Votes

import React from 'react'

const Votes = ({votes}) => {
    return (
        <div>
            <center><h1>Votes</h1></center>
            {votes.map((vote) => (
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">{vote.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{vote.value}</h6>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Votes
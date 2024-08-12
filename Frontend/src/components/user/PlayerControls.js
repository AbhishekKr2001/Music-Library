import React from 'react';

const PlayerControls = () => {
    return (
        <div className="d-flex flex-wrap justify-content-center align-items-center  p-2">

            <button className="btn btn-primary m-1" style={{ padding: '5px 10px' }}>Play</button>
            <button className="btn btn-danger m-1" style={{ padding: '5px 10px' }}>Stop</button>
            <button className="btn btn-warning m-1" style={{ padding: '5px 10px' }}>Repeat</button>
            <button className="btn btn-info m-1" style={{ padding: '5px 10px' }}>Shuffle</button>

        </div>
    );
}

export default PlayerControls;

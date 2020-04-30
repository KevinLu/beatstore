import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';

function BeatPage(props) {
    const beatUrl = props.match.params.beatUrl;
    const [Beat, setBeat] = useState([]);

    useEffect(() => {
        Axios.get(`/api/beat/beats_by_url?url=${beatUrl}&type=single`)
        .then(response => {
             setBeat(response.data[0]); // only set 1 beat
        });
    }, []);

    return (
        <div>
            BeatPage
        </div>
    );
}

export default withRouter(BeatPage)

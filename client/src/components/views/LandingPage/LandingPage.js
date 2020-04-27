import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { message } from 'antd';

function LandingPage() {

    const [Beats, setBeats] = useState([]);

    useEffect(() => {
        Axios.post('/api/beat/getBeats')
            .then(response => {
                if (response.data.success) {
                    setBeats(response.data.beats)
                    console.log(response.data.beats)
                } else {
                    message.error('Failed to fetch beats.')
                }
            })
    }, []);

    return (
        <>

        </>
    );
}

export default LandingPage

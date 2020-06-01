import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export const AudioContext = React.createContext();

export const AudioContextProvider = (props) => {
    const [IsLoading, setIsLoading] = useState(true);
    const [Playlist, setPlaylist] = useState([]);
    const [CurrentAudio, setCurrentAudio] = useState(new Audio());

    const getBeats = () => {
        Axios.post('/api/beat/getBeats', { skip: 0, limit: 8 })
            .then(response => {
                setIsLoading(true);
                if (response.data.success) {
                    console.log(response)
                    response.data.beats.forEach((beat, index) => {
                        Playlist[index] = {
                            _id: beat._id,
                            title: beat.title,
                            tags: beat.tags,
                            producer: beat.producer.username,
                            price: beat.price,
                            url: beat.url,
                            image: beat.artwork[0],
                            audio: beat.previewAudio[0],
                            length: beat.length,
                            bpm: beat.bpm,
                            isPlaying: false,
                            isPaused: false,
                            index: index
                        }
                    });
                }
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getBeats();
    }, [])

    return (
        <AudioContext.Provider value={{ isLoading: [IsLoading, setIsLoading], playlist: [Playlist, setPlaylist], audio: [CurrentAudio, setCurrentAudio] }}>
            {props.children}
        </AudioContext.Provider>
    );
}

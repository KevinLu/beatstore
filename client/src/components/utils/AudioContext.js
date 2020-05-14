import React, { useState } from 'react';

export const AudioContext = React.createContext();

export const AudioContextProvider = (props) => {
    const [Show, setShow] = useState(false);
    const [Playlist, setPlaylist] = useState([
        {
            _id: "null",
            title: "null",
            producer: "null",
            price: 0,
            url: "",
            image: 'https://via.placeholder.com/70',
            audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            isPlaying: false,
            isPaused: false
        }]
    );
    const [Index, setIndex] = useState(0);
    const [CurrentAudio, setCurrentAudio] = useState(new Audio());

    return (
        <AudioContext.Provider value={{ show: [Show, setShow], playlist: [Playlist, setPlaylist], index: [Index, setIndex], audio: [CurrentAudio, setCurrentAudio] }}>
            {props.children}
        </AudioContext.Provider>
    );
}

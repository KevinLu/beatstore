import React, { useState } from 'react';

export const AudioContext = React.createContext();

export const AudioContextProvider = (props) => {
    const [Playlist, setPlaylist] = useState([
        {
            title: "Despacito",
            producer: "Luis Fonsi",
            image: 'http://res.cloudinary.com/alick/image/upload/v1502689731/Despacito_uvolhp.jpg',
            audio: 'http://res.cloudinary.com/alick/video/upload/v1502689683/Luis_Fonsi_-_Despacito_ft._Daddy_Yankee_uyvqw9.mp3',
            isPlaying: false,
            isPaused: false
        }]
    );
    const [Index, setIndex] = useState(0);

    return (
        <AudioContext.Provider value={{ playlist: [Playlist, setPlaylist], index: [Index, setIndex] }}>
            {props.children}
        </AudioContext.Provider>
    );
}

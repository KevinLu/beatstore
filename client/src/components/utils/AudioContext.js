import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export const AudioContext = React.createContext();

export const AudioContextProvider = (props) => {
    const [IsLoading, setIsLoading] = useState(true);
    const [Playlist, setPlaylist] = useState([]);
    const [CurrentAudio, setCurrentAudio] = useState(new Audio());

    return (
        <AudioContext.Provider value={{ isLoading: [IsLoading, setIsLoading], playlist: [Playlist, setPlaylist], audio: [CurrentAudio, setCurrentAudio] }}>
            {props.children}
        </AudioContext.Provider>
    );
}

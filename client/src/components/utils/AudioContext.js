import React from 'react';

export const AudioContext = React.createContext();

export const AudioContextProvider = (props) => {
    let audio = new Audio();

    return (
        <AudioContext.Provider value={audio}>
            {props.children}
        </AudioContext.Provider>
    );
}

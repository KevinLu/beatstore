import React from 'react';

export const AudioContext = React.createContext();

export const AudioContextProvider = (props) => {
    let audio = new Audio();
    audio.crossOrigin = "anonymous";
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let src = audioCtx.createMediaElementSource(audio);
    src.connect(audioCtx.destination);

    return (
        <AudioContext.Provider value={{audio, audioCtx, src}}>
            {props.children}
        </AudioContext.Provider>
    );
}

import React, {useEffect, useContext} from 'react';
import {AudioContext} from "../../utils/AudioContext";
import {Box} from '@chakra-ui/react';

function AudioVisualizer() {
    let {audio, audioCtx, src} = useContext(AudioContext);
    let analyser = audioCtx.createAnalyser();
    let canvas = React.createRef();
    let canvasContainer = React.createRef();
    let canvasCtx = null;

    const startViz = () => {
        src.connect(analyser);
        src.connect(audioCtx.destination);
        analyser.fftSize = 1024;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        let barWidth = (canvas.current.width / bufferLength);

        canvas.current.width = canvasContainer.current.clientWidth - 20;

        canvasCtx.clearRect(0, 0, canvas.current.width, canvas.current.height);

        draw();

        function draw() {
            if (canvas.current) {
                requestAnimationFrame(draw);
                if (!audio.paused) {
                    let bar = 0;
                    analyser.getByteFrequencyData(dataArray);
                    canvasCtx.clearRect(0, 0, canvas.current.width, canvas.current.height);

                    for (let i = 0; i < bufferLength; i++) {
                        let barHeight = Math.max(dataArray[i] / 3 - 20, 1);
                        canvasCtx.fillStyle = "#4299e1";
                        canvasCtx.fillRect(bar, canvas.current.height - barHeight, barWidth, barHeight);
                        bar += barWidth + 4;
                    }
                }
            }
        }
    }

    function resizeCanvas() {
        if (canvasCtx) {
            canvas.current.width = canvasContainer.current.clientWidth;
            canvasCtx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        }
    }

    useEffect(() => {
        if (canvas.current && canvasContainer.current) {
            canvasCtx = canvas.current.getContext('2d');
            window.addEventListener('resize', resizeCanvas, false);
            startViz();
        }
        return () => {
            window.removeEventListener('resize', resizeCanvas, false);
        };
    }, [canvas]);

    return (
        <Box w="100%" margin="2em auto 2em" ref={canvasContainer}>
            <canvas ref={canvas} height="80px" />
        </Box>
    );
}

export default AudioVisualizer;

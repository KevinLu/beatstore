import React, {useState, useEffect} from 'react';
import SearchBox from './Sections/SearchBox';
import {Link} from 'react-router-dom';
import {Box, Button} from "@chakra-ui/core";
import BeatList from '../BeatList/BeatList';
import Axios from 'axios';

function LandingPage() {
    const [Playlist, setPlaylist] = useState([]);

    const getBeats = () => {
        Axios.post('/api/beat/getBeats', {skip: 0, limit: 8})
            .then(response => {
                if (response.data.success) {
                    let newPlaylist = [];
                    response.data.beats.forEach((beat, index) => {
                        newPlaylist[index] = {
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
                        };
                    });
                    setPlaylist(newPlaylist);
                }
            });
    };

    const Search = () => {
        return (
            <Box width={["400px", "450px", "600px", "700px"]} margin="auto auto 15em">
                <SearchBox placeholder="Search for a vibe" width={["400px", "450px", "600px", "700px"]} />
            </Box>
        );
    }

    useEffect(() => {
        getBeats();
    }, []);

    const PageContents = () => {
        return (
            <Box m="5em 1em 5em 1em">
                <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                    {Playlist.length === 0 ? <></> : <Search />}
                    <BeatList query="ALL" />
                    <Box display="flex" justifyContent="center" mt={10}>
                        <Button as={Link} to="/beats" variantColor="blue">BROWSE ALL</Button>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <PageContents />
    );
}

export default LandingPage

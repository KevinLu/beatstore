import React from 'react';
import SearchBox from './SearchBox';
import {Link} from 'react-router-dom';
import {Box, Button} from "@chakra-ui/react";
import BeatList from '../BeatList/BeatList';
import Licenses from '../Licenses/Licenses';
import AudioVisualizer from '../AudioVisualizer/AudioVisualizer';

function LandingPage() {
    const Search = () => {
        return (
            <Box width={["400px", "450px", "600px", "700px"]} margin="auto">
                <SearchBox placeholder="Search for a vibe" width={["400px", "450px", "600px", "700px"]} />
            </Box>
        );
    }

    return (
        <Box m="5em 1em 5em 1em">
            <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                <Search />
                <AudioVisualizer />
                <BeatList query="ALL" limit={10} />
                <Box display="flex" justifyContent="center" my={10}>
                    <Button as={Link} to="/beats" colorScheme="blue">BROWSE ALL</Button>
                </Box>
                <Licenses />
            </Box>
        </Box>
    );
}

export default LandingPage

import React from 'react';
import SearchBox from './Sections/SearchBox';
import {Link} from 'react-router-dom';
import {Box, Button} from "@chakra-ui/core";
import BeatList from '../BeatList/BeatList';

const PageContents = () => {
    return (
        <Box m="5em 1em 5em 1em">
            <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                <Box width={["400px", "450px", "600px", "700px"]} margin="auto auto 15em">
                    <SearchBox placeholder="Search for a vibe" width={["400px", "450px", "600px", "700px"]} />
                </Box>
                <BeatList />
                <Box display="flex" justifyContent="center" mt={10}>
                    <Button as={Link} to="/beats" variantColor="blue">BROWSE ALL</Button>
                </Box>
            </Box>
        </Box>
    );
}

function LandingPage() {
    return (
        <PageContents />
    );
}

export default LandingPage

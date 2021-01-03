import React, {useState, useEffect} from 'react';
import {Box, Heading} from "@chakra-ui/react";
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import BeatList from '../BeatList/BeatList';

function SearchResultsPage() {
    const location = useLocation();
    const [Query, setQuery] = useState("");

    useEffect(() => {
        const params = queryString.parse(location.search);
        if (params.search_keyword) {
            setQuery(params.search_keyword);
        } else {
            setQuery("ALL");
        }
    }, [location.search]);

    return (
        <div>
            <Box m="5em 1em 5em 1em">
                <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                    {Query !== "ALL" ?
                    <Heading textAlign="center" mb="2em">SEARCH: {Query}</Heading> :
                    <Heading textAlign="center" mb="2em">BEATS</Heading>}
                    <BeatList query={Query} />
                </Box>
            </Box>
        </div>
    );
}

export default SearchResultsPage;

import React, {useState, useEffect} from 'react';
import {Box, Heading} from "@chakra-ui/react";
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import BeatList from '../BeatList/BeatList';
import SearchBar from './SearchBar';

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

    const Search = () => {
        return (
            <Box width={["400px", "450px", "600px", "700px"]} margin="auto auto 4rem">
                <SearchBar
                    value={Query !== "ALL" ? Query : ""}
                    placeholder="Search for a vibe"
                    width={["400px", "450px", "600px", "700px"]} />
            </Box>
        );
    }

    return (
        <div>
            <Box m="5em 1em 5em 1em">
                <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                    {Query !== "ALL" ?
                        <Heading textAlign="center" mb="2rem">SEARCH: {Query}</Heading> :
                        <Heading textAlign="center" mb="2rem">BEATS</Heading>}
                    <Search />
                    <BeatList query={Query} limit={50} />
                </Box>
            </Box>
        </div>
    );
}

export default SearchResultsPage;

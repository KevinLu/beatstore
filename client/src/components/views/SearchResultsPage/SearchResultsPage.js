import React, {useState, useEffect} from 'react';
import {
    Box,
    Grid,
    Text,
    Heading,
    List,
    ListItem,
    ListIcon,
    Button,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Tag,
    TagLabel,
    TagIcon,
    Stack,
    Flex,
    useToast
} from "@chakra-ui/core";
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import BeatList from '../BeatList/BeatList';

function SearchResultsPage() {
    const location = useLocation();
    const [Query, setQuery] = useState("");

    useEffect(() => {
        const params = queryString.parse(location.search);
        setQuery(params.search_keyword);
    }, [location.search]);

    return (
        <div>
            <Box m="5em 1em 5em 1em">
                <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                    <Heading textAlign="center" mb="2em">BEATS</Heading>
                    <BeatList query={Query} />
                </Box>
            </Box>
        </div>
    );
}

export default SearchResultsPage;

import React, { useState, useEffect } from 'react';
import {
    Text,
    List,
    ListItem,
    ListIcon,
    Button,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    useToast
} from "@chakra-ui/core";
import { IoMdMusicalNote } from 'react-icons/io'
import Axios from 'axios';

function SearchBox(props) {
    const ReactDOM = require('react-dom');
    const [Beats, setBeats] = useState([]);
    const [SearchTerms, setSearchTerms] = useState("");
    const [SearchFocused, setSearchFocused] = useState(false);
    const toast = useToast();
    const searchInput = React.createRef();

    const handleChange = (event) => {
        setSearchTerms(event.currentTarget.value);
        props.refreshFunction(event.currentTarget.value);
        const variables = {
            skip: 0,
            limit: 3,
            searchTerm: SearchTerms
        }
        getBeats(variables);
    }

    const handleFocus = () => {
        setSearchFocused(false);
    }

    const handleBlur = () => {
        setSearchFocused(true);
    }

    const getBeats = (variables) => {
        Axios.post('/api/beat/getBeats', variables)
            .then(response => {
                setTimeout(() => {
                    if (response.data.success) {
                        if (response.data.beats.length >= Beats.length || response.data.beats.length === 0) {
                            setBeats(response.data.beats)
                        }
                    } else {
                        toast({
                            position: "bottom",
                            title: "An error occurred.",
                            description: "Unable to load beats.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                }, 100);
            });
    };

    const showSearchResults = Beats.map((beat, index) => {
        if (!SearchFocused) {
            return (
                <ListItem display="flex" mt={5} mb={5}>
                    <ListIcon icon={IoMdMusicalNote} color="blue.500" size="25px" ml={3} />
                    <Text fontSize="md" fontWeight="600" color="black">{beat.title}</Text>
                </ListItem>
            );
        }
    });

    return (
        <div>
            <InputGroup>
                <InputLeftElement children={<Icon name="search" color="gray.300" />} />
                <Input onFocus={handleFocus} onBlur={handleBlur} ref={searchInput} color="black" fontWeight="600" size="lg" id="search" placeholder={props.placeholder} onChange={handleChange} />
                <InputRightElement width="4.5rem">
                    <Button variantColor="blue">
                        SEARCH
                    </Button>
                </InputRightElement>
            </InputGroup>
            <List mt={5} border="1px solid" borderRadius="0.25rem" borderColor="gray.200">
                {showSearchResults}
            </List>
        </div>
    )
}

export default SearchBox

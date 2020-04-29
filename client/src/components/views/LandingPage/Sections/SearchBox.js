import React, { useState } from 'react';
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
import { IoMdMusicalNote } from 'react-icons/io';
import styled from '@emotion/styled';
import Axios from 'axios';

const SearchResult = styled.div`
  &:hover {
    background: #EDF2F7;
  }
`

function SearchBox(props) {
    const [Beats, setBeats] = useState([]);
    const [SearchTerms, setSearchTerms] = useState("");
    const [SearchFocused, setSearchFocused] = useState(false);
    const [ListBorder, setListBorder] = useState("0px solid");
    const toast = useToast();
    const searchInput = React.createRef();

    const handleChange = (event) => {
        setSearchTerms(event.currentTarget.value);
        const variables = {
            skip: 0,
            limit: 3,
            searchTerm: SearchTerms
        }
        getBeats(variables);
    }

    const handleFocus = () => {
        setSearchFocused(true);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setSearchFocused(false);
        }, 200);
    }

    const getBeats = (variables) => {
        Axios.post('/api/beat/getBeats', variables)
            .then(response => {
                setTimeout(() => {
                    if (response.data.success) {
                        if (response.data.beats.length >= Beats.length || response.data.beats.length === 0) {
                            setBeats(response.data.beats)
                            setListBorder("1px solid")
                        } else {
                            setListBorder("0px solid")
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
                }, 1);
            });
    };

    const showSearchResults = Beats.map((beat, index) => {
        if (SearchFocused) {
            return (
                <SearchResult key={index}>
                    <ListItem display="flex" pt={3} pb={3}>
                        <ListIcon icon={IoMdMusicalNote} color="blue.500" size="25px" ml={3} />
                        <Text fontSize="md" fontWeight="600" color="black">{beat.title}</Text>
                    </ListItem>
                </SearchResult>
            );
        }
    });

    return (
        <div>
            <InputGroup>
                <InputLeftElement children={<Icon name="search" color="gray.300" />} />
                <Input onFocus={handleFocus} onBlur={handleBlur} color="black" fontWeight="600" size="lg" id="search" placeholder={props.placeholder} onChange={handleChange} />
                <InputRightElement width="4.5rem">
                    <Button variantColor="blue">
                        SEARCH
                    </Button>
                </InputRightElement>
            </InputGroup>
            {Beats.length !== 0 && SearchFocused ?
                <List mt={5} border="1px solid" borderRadius="0.25rem" borderColor="gray.200" position="absolute" width={props.width}>
                    {showSearchResults}
                </List> :
                <List mt={5} border="0px solid" borderRadius="0.25rem" borderColor="gray.200" position="absolute" width={props.width}>
                    {showSearchResults}
                </List>
            }
        </div>
    )
}

export default SearchBox

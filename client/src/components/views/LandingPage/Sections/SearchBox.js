import React, {useState} from 'react';
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
    Tag,
    TagLabel,
    TagIcon,
    Stack,
    Flex,
    useToast
} from "@chakra-ui/core";
import {IoMdMusicalNote, IoIosMore} from 'react-icons/io';
import {FaHashtag} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import styled from '@emotion/styled';
import Axios from 'axios';

const SearchResult = styled.div`
  background: white;
  &:hover {
    background: #EDF2F7;
  }
`
const CancelToken = Axios.CancelToken;
let source = CancelToken.source();
let MAX_SUGGESTIONS = 3;
let MAX_SEARCH = 100;

// TODO: enable this?
let searchTerms = "";

function SearchBox(props) {
    const [Beats, setBeats] = useState([]);
    const [SearchFocused, setSearchFocused] = useState(false);
    const toast = useToast();

    const handleChange = (event) => {
        const variables = {
            skip: 0,
            limit: MAX_SEARCH,
            searchTerm: event.currentTarget.value
        }
        getBeats(variables);
        searchTerms = event.currentTarget.value;
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
        source && source.cancel('Operation canceled due to new request.');
        source = Axios.CancelToken.source();

        Axios.post(
            '/api/beat/getBeats',
            variables,
            {
                cancelToken: source.token
            })
            .then(response => {
                console.log(CancelToken)
                setTimeout(() => {
                    if (response.data.success) {
                        if (response.data.beats.length >= Beats.length || response.data.beats.length === 0) {
                            setBeats(response.data.beats);
                        }
                    } else {
                        toast({
                            position: "bottom",
                            title: "An error occurred.",
                            description: "Unable to search for beats.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                }, 1);
            })
            .catch(error => {
                if (Axios.isCancel(error)) console.log("cancelled");
            });
    };

    const showSearchResults = Beats.slice(0, MAX_SUGGESTIONS).map((beat, index) => {
        if (SearchFocused) {
            return (
                <Link to={`/beat/${beat.url}`}>
                    <SearchResult key={index}>
                        <ListItem display="flex" pt={3} pb={3} justifyContent="space-between">
                            <Flex ml={3}>
                                <ListIcon icon={IoMdMusicalNote} color="blue.500" size="25px" />
                                <Text fontSize="md" fontWeight="600" color="black">{beat.title}</Text>
                            </Flex>
                            {/* SHOW ALL TAGS IN SEARCH RESULT ON DESKTOP */}
                            <Stack spacing={2} isInline display={{base: "none", md: "initial"}} mr={3}>
                                {beat.tags.map((tag, i) => (
                                    <Tag size="md" key={i} variantColor="blue">
                                        <TagIcon as={FaHashtag} size="13px" />
                                        <TagLabel lineHeight="2em" mt="-0.14em" maxWidth={{base: "5ch", md: "6ch", lg: "8ch"}}>
                                            {tag}
                                        </TagLabel>
                                    </Tag>
                                ))}
                            </Stack>
                            {/* TODO: enable this? SHOW ONLY 1 RELEVANT TAG ON MOBILE */}
                            {/* <Stack spacing={2} isInline display={{base: "initial", md: "none"}} mr={3}>
                                {beat.tags.map((tag, i) => {
                                    console.log(searchTerms.includes(tag));
                                    if (searchTerms.includes(tag)) {
                                        return (
                                            <Tag size="md" key={i} variantColor="blue">
                                                <TagIcon as={FaHashtag} size="13px" />
                                                <TagLabel lineHeight="2em" maxWidth={{base: "5ch", md: "6ch", lg: "8ch"}}>{tag}</TagLabel>
                                            </Tag>
                                        )
                                    }
                                })}
                            </Stack> */}
                        </ListItem>
                    </SearchResult>
                </Link>
            );
        }
    });

    return (
        <div>
            <InputGroup>
                <InputLeftElement children={<Icon name="search" color="gray.300" />} />
                <Input onFocus={handleFocus}
                    onBlur={handleBlur}
                    color="black"
                    fontWeight="600"
                    size="lg"
                    id="search"
                    placeholder={props.placeholder}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-autocomplete="none"
                    type="search" />
                <InputRightElement width="4.5rem">
                    <Button variantColor="blue">
                        SEARCH
                    </Button>
                </InputRightElement>
            </InputGroup>
            {Beats.length !== 0 && SearchFocused ?
                <List mt={2} border="1px solid" borderRadius="0.25rem" borderColor="gray.200" position="absolute" width={props.width}>
                    {showSearchResults}
                    {Beats.length > MAX_SUGGESTIONS ?
                        <Link to={`/beats?search_keyword=${searchTerms}`}>
                            <SearchResult key="last">
                                <ListItem display="flex" p={3}>
                                    <ListIcon icon={IoIosMore} color="blue.800" size="25px" />
                                    <Text fontSize="md" fontWeight="600" color="black">Explore all {Beats.length} beats...</Text>
                                </ListItem>
                            </SearchResult>
                        </Link>
                        :
                        <></>
                    }
                </List> :
                <></>
            }
        </div>
    )
}

export default SearchBox

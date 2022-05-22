import React, {useState, useCallback} from 'react';
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
    TagLeftIcon,
    Stack,
    Flex,
    useToast,
    useColorModeValue,
    SlideFade
} from "@chakra-ui/react";
import {IoMdMusicalNote, IoIosMore, IoMdSearch} from 'react-icons/io';
import {FaHashtag} from 'react-icons/fa';
import {Link, withRouter} from 'react-router-dom';
import Axios from 'axios';
import debounce from '../../utils/debounce';

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

    const ListItemColor = useColorModeValue('white', 'gray.700');
    const ListItemBorderColor = useColorModeValue('gray.100', 'gray.600');

    const handleChange = (event) => {
        if (event.currentTarget.value !== "") {
            const variables = {
                skip: 0,
                limit: MAX_SEARCH,
                searchTerm: event.currentTarget.value
            }
            debounceGetBeats(variables);
            searchTerms = event.currentTarget.value;
        }
    }

    const handleFocus = () => {
        setSearchFocused(true);
    }

    const handleBlur = () => {
        setTimeout(() => {
            setSearchFocused(false);
        }, 200);
    }

    const handleSearch = () => {
        if (searchTerms) {
            props.history.push(`/beats?search_keyword=${searchTerms}`);
        }
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
                if (Axios.isCancel(error)) console.log("Search request cancelled.");
            });
    };

    const debounceGetBeats = useCallback(debounce(getBeats, 600), []);

    const showSearchResults = Beats.slice(0, MAX_SUGGESTIONS).map((beat, index) => {
        return (
            <Link to={`/beat/${beat.url}`} key={index}>
                <ListItem display="flex" bgColor={ListItemColor} pt={3} pb={3} justifyContent="space-between">
                    <Flex ml={3}>
                        <ListIcon as={IoMdMusicalNote} color="blue.500" boxSize="25px" />
                        <Text fontSize="md" fontWeight="600">{beat.title}</Text>
                    </Flex>
                    {/* SHOW ALL TAGS IN SEARCH RESULT ON DESKTOP */}
                    <Stack spacing={2} isInline display={{base: "none", md: "initial"}} mr={3}>
                        {beat.tags.map((tag, i) => (
                            <Tag size="md" key={i} colorScheme="blue">
                                <TagLeftIcon as={FaHashtag} boxSize="13px" />
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
                                        <Tag size="md" key={i} colorScheme="blue">
                                            <TagLeftIcon as={FaHashtag} boxSize="13px" />
                                            <TagLabel lineHeight="2em" maxWidth={{base: "5ch", md: "6ch", lg: "8ch"}}>{tag}</TagLabel>
                                        </Tag>
                                    )
                                }
                            })}
                        </Stack> */}
                </ListItem>
            </Link>
        );
    });

    return (
        <div>
            <InputGroup size="lg">
                <InputLeftElement fontSize="1.75em" pointerEvents="none" children={<Icon as={IoMdSearch} color="gray.300" />} />
                <Input onFocus={handleFocus}
                    onBlur={handleBlur}
                    fontWeight="600"
                    id="search"
                    placeholder={props.placeholder}
                    onChange={handleChange}
                    autoComplete="off"
                    aria-autocomplete="none"
                    type="search" />
                <InputRightElement width="5.75rem" p="0">
                    <Button h="100%" w="100%" onClick={handleSearch} colorScheme="blue">
                        SEARCH
                    </Button>
                </InputRightElement>
            </InputGroup>
            {Beats.length !== 0 ?
                <SlideFade in={SearchFocused} offsetY="20px">
                    <List boxShadow="md" mt={2} bgColor={ListItemColor} border="1px solid" borderRadius="0.25rem" borderColor={ListItemBorderColor} position="absolute" width={props.width}>
                        {showSearchResults}
                        {Beats.length > MAX_SUGGESTIONS ?
                            <Link to={`/beats?search_keyword=${searchTerms}`} key="last">
                                <ListItem display="flex" p={3} bgColor={ListItemColor}>
                                    <ListIcon as={IoIosMore} color="blue.800" boxSize="25px" />
                                    <Text fontSize="md" fontWeight="600">Explore all {Beats.length} beats...</Text>
                                </ListItem>
                            </Link> : null
                        }
                    </List>
                </SlideFade> : null
            }
        </div>
    )
}

export default withRouter(SearchBox)

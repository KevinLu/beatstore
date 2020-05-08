import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAnonUser, loginAnonUser } from '../../../_actions/user_actions';
import { addToCart } from '../../../_actions/user_actions';
import SearchBox from './Sections/SearchBox';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Text,
    Skeleton,
    Grid,
    Box,
    Stack,
    IconButton,
    Button,
    ButtonGroup,
    useToast,
    Tag,
    TagLabel,
    TagIcon,
    Image,
    Divider,
    Heading
} from "@chakra-ui/core";
import { FaHashtag, FaCartPlus } from 'react-icons/fa';

const ListHeading = ({ children, displayBreakpoints }) => (
    <Box w="100%" h="10" display={displayBreakpoints}>
        <Text fontWeight="600" fontSize="sm" color="gray.900" letterSpacing="2px">{children}</Text>
    </Box>
);

const ListText = ({ children, displayBreakpoints }) => (
    <Box w="100%" h="10" mt="0.6em" display={displayBreakpoints}>
        <Text fontWeight="600" fontSize="md" color="black">{children}</Text>
    </Box>
);

const secondsToTime = (e) => {
    var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
        s = Math.floor(e % 60).toString().padStart(2, '0');

    return m + ':' + s;
}

function LandingPage(props) {

    const [Beats, setBeats] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8); // only load first 8 beats
    const [Count, setCount] = useState(0); // used to check if we allow load more
    const [IsLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const getBeats = (variables) => {
        setIsLoading(true);
        Axios.post('/api/beat/getBeats', variables)
            .then(response => {
                if (response.data.success) {
                    setCount(response.data.count)
                    setBeats(Beats.concat(response.data.beats))
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
                setIsLoading(false);
            });
    };

    const user = useSelector(state => state.user);

    const createAnonymousUser = () => {
        let dataToSubmit = {
            email: Date.now() + "@anonymous.user",
            password: "anonymous",
            name: "anon",
            lastname: "ymous",
            image: `https://www.gravatar.com/avatar/00000000000000000000000000000000`,
            isAnonymous: true
        };

        dispatch(registerAnonUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
                window.localStorage.setItem('userId', response.payload.userId);
                window.localStorage.setItem('isAnonymous', true);
                loginAnonymousUser(response.payload.userId);
            } else {
                toast({
                    position: "bottom",
                    title: "An error occurred.",
                    description: "Unable to generate session id. Please try again or use another browser.",
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                })
            }
        });
    };

    const loginAnonymousUser = (userId) => {
        let dataToSubmit = {
            id: userId,
            password: "anonymous"
        };

        dispatch(loginAnonUser(dataToSubmit)).then(response => {
            if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                window.localStorage.setItem('isAnonymous', true);
                window.location.reload();
            } else {
                toast({
                    position: "bottom",
                    title: "An error occurred.",
                    description: "Could not auto login.",
                    status: "error",
                    duration: 10000,
                    isClosable: true,
                })
            }
        });
    };

    // Load the beats & generate anonymous userId
    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
        getBeats(variables);
        if (window.localStorage.getItem('userId') === null) { // if local storage doesn't exist
            createAnonymousUser();
        } else if (window.localStorage.getItem('isAnonymous') === true) { // login the anonymous user
            loginAnonymousUser(window.localStorage.getItem('userId'));
        }
    }, []);

    const dispatch = useDispatch();

    const addToCartHandler = (beatId) => {
        dispatch(addToCart(beatId));
    }

    // Render the beats in a list
    const renderListItems = Beats.map((beat, index) => {
        return (
            <Box key={index} maxWidth={["480px", "768px", "992px", "1166px"]} margin="auto">
                <Grid templateColumns={{ base: "1fr 3fr 4fr", md: "1fr 4fr 6fr 4fr", lg: "1fr 5fr 1fr 1fr 5fr 3fr" }} gap={6}>
                    <Image borderRadius="3px" size="44px" src={`http://localhost:5000/${beat.images[0]}`}></Image>

                    <ListText><Link to={`/beat/${beat.url}`}>{beat.title}</Link></ListText>

                    <ListText displayBreakpoints={{ base: "none", lg: "initial" }}>{secondsToTime(beat.bpm)}</ListText>

                    <ListText displayBreakpoints={{ base: "none", lg: "initial" }}>{beat.bpm}</ListText>

                    <Stack spacing={2} isInline display={{ base: "none", md: "initial" }} mt="0.45em">
                        {beat.tags.map((tag, i) => (
                            <Tag size="md" key={i} variantColor="blue">
                                <TagIcon as={FaHashtag} size="13px" />
                                <TagLabel lineHeight="2em" mt="-0.1em" maxWidth={{ base: "5ch", md: "6ch", lg: "8ch" }}>{tag}</TagLabel>
                            </Tag>
                        ))}
                    </Stack>

                    <ButtonGroup spacing={2} ml="auto">
                        <IconButton
                            variant="outline"
                            variantColor="blue"
                            aria-label="Free download"
                            icon="download"
                        />

                        <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid" onClick={() => addToCartHandler(beat._id)}>
                            ${beat.price}
                        </Button>
                    </ButtonGroup>

                </Grid>
                {index !== (Beats.length - 1) ? // adds divider between list items
                    <Divider /> :
                    <></>
                }
            </Box>
        );
    });

    const loadMore = () => {
        let skipItems = Skip + Limit;

        if (Count < Limit) {
            toast({
                position: "bottom",
                title: "All beats loaded.",
                description: "Couldn't find any more beats to load.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            })
        } else {
            const variables = {
                skip: skipItems,
                limit: Limit
            }
            getBeats(variables);
            setSkip(skipItems);
        }
    }

    const PageContents = () => {
        return (
            <Box m="5em 1em 5em 1em">
                <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                    <Box width={["400px", "450px", "600px", "700px"]} margin="auto auto 15em">
                        <SearchBox placeholder="Search for a vibe" width={["400px", "450px", "600px", "700px"]} />
                    </Box>
                    <Box>
                        <Grid templateColumns={{ base: "1fr 3fr 4fr", md: "1fr 4fr 6fr 4fr", lg: "1fr 5fr 1fr 1fr 5fr 3fr" }} gap={6}>
                            <div></div>
                            <ListHeading displayBreakpoints={{ base: "none", md: "initial" }}>TITLE</ListHeading>
                            <ListHeading displayBreakpoints={{ base: "none", lg: "initial" }}>TIME</ListHeading>
                            <ListHeading displayBreakpoints={{ base: "none", lg: "initial" }}>BPM</ListHeading>
                            <ListHeading displayBreakpoints={{ base: "none", md: "initial" }}>TAGS</ListHeading>
                            <div></div>
                        </Grid>
                        {renderListItems}
                        <Box display="flex" justifyContent="center" mt={10}>
                            <Button variantColor="blue" onClick={loadMore} isLoading={IsLoading}>LOAD MORE</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    const PlaceholderContent = () => {
        return (
            <Box m="5em 1em 5em 1em">
                <Box maxWidth={["400px", "628px", "800px", "1166px"]} margin="auto">
                    <Box width={["400px", "450px", "600px", "700px"]} margin="auto auto 15em">
                        <Skeleton height="40px" />
                    </Box>
                    <Grid templateColumns="1fr 5fr 1fr 1fr 4fr 3fr" gap={6}>
                        <div></div>
                        <ListHeading>TITLE</ListHeading>
                        <ListHeading>TIME</ListHeading>
                        <ListHeading>BPM</ListHeading>
                        <ListHeading>TAGS</ListHeading>
                        <div></div>
                    </Grid>
                    <Grid templateColumns="1fr 5fr 1fr 1fr 4fr 3fr" gap={6}>
                        <Skeleton height="44px" width="44px" />
                        <Skeleton height="20px" mt="0.55em" />
                        <Skeleton height="20px" mt="0.55em" />
                        <Skeleton height="20px" mt="0.55em" />
                        <Skeleton height="20px" mt="0.55em" />
                        <Box display="flex">
                            <Skeleton height="40px" width="40px" mr={2} />
                            <Skeleton height="40px" width="100px" />
                        </Box>
                    </Grid>
                </Box>
            </Box>
        );
    }

    const EmptyState = () => {
        return (
            <Box m="5em 1em 5em 1em" display="flex" justifyContent="center">
                <Box maxWidth={["480px", "768px", "992px", "1166px"]} margin="auto">
                    <Heading>No beats uploaded yet.</Heading>
                </Box>
            </Box>
        );
    }

    return (
        Beats.length > 0 ?
            <PageContents />
            : IsLoading ?
                <PlaceholderContent />
                :
                <EmptyState />
    );
}

export default LandingPage

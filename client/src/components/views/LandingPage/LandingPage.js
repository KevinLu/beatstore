import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../../_actions/cart_actions';
import { setIndex, setShow } from '../../../_actions/playlist_actions';
import { AudioContext } from "../../utils/AudioContext";
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

function LandingPage() {

    const [Beats, setBeats] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8); // only load first 8 beats
    const [Count, setCount] = useState(0); // used to check if we allow load more
    const { isLoading, playlist, audio } = useContext(AudioContext);
    const [IsLoading, setIsLoading] = isLoading;
    const [Playlist, setPlaylist] = playlist;
    const [CurrentAudio, setCurrentAudio] = audio;

    const show = useSelector(state => state.playlist.show);

    const dispatch = useDispatch();

    const setIndexHandler = (i) => {
        dispatch(setIndex(i));
    }

    const setShowHandler = (bool) => {
        dispatch(setShow(bool));
    }

    const playAudio = (beat) => {
        if (!show) {
            setShowHandler(true);
        }
        CurrentAudio.pause();
        CurrentAudio.src = Playlist[beat.index].audio;
        setIndexHandler(beat.index);
        CurrentAudio.play();
        Playlist[beat.index].isPlaying = true;
    }

    const addToCartHandler = (beatId) => {
        dispatch(addToCart(beatId, window.localStorage.getItem("cartId")));
    }

    // Render the beats in a list
    const renderListItems = Playlist.map((beat, index) => {
        return (
            <Box key={index} maxWidth={["480px", "768px", "992px", "1166px"]} margin="auto">
                <Grid templateColumns={{ base: "1fr 3fr 4fr", md: "1fr 4fr 6fr 4fr", lg: "1fr 5fr 1fr 1fr 5fr 3fr" }} gap={6}>

                    <Image
                        borderRadius="3px"
                        size="44px"
                        src={beat.image}
                        fallbackSrc="https://via.placeholder.com/44"
                        cursor="pointer"
                        onClick={() => playAudio(beat)} />

                    <ListText><Link to={`/beat/${beat.url}`}>{beat.title}</Link></ListText>

                    <ListText displayBreakpoints={{ base: "none", lg: "initial" }}>{secondsToTime(beat.length)}</ListText>

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
                {index !== (Playlist.length - 1) ? // adds divider between list items
                    <Divider /> :
                    <></>
                }
            </Box>
        );
    });

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
                        {/*<Box display="flex" justifyContent="center" mt={10}>
                            <Button variantColor="blue" isLoading={IsLoading}>LOAD MORE</Button>
                        </Box>*/}
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
        Playlist.length > 0 ?
            <PageContents />
            : IsLoading ?
                <PlaceholderContent />
                :
                <EmptyState />
    );
}

export default LandingPage

import React, {useEffect, useState} from 'react';
import {useDispatch, connect} from 'react-redux';
import {addToCart} from '../../../_actions/cart_actions';
import {setIndex, setShow, setPlaylist} from '../../../_actions/playlist_actions';
import {Link} from 'react-router-dom';
import LoadingView from '../../utils/LoadingView';
import Axios from 'axios';
import {
    Text,
    Heading,
    Grid,
    Box,
    Stack,
    IconButton,
    Button,
    ButtonGroup,
    useToast,
    Tag,
    TagLabel,
    TagLeftIcon,
    Image,
    Divider,
    Fade
} from "@chakra-ui/react";
import {FaHashtag, FaShoppingCart} from 'react-icons/fa';
import {IoMdDownload} from 'react-icons/io';

const ListHeading = ({children, displayBreakpoints}) => (
    <Box w="100%" h="10" display={displayBreakpoints}>
        <Text fontWeight="600" fontSize="sm" color="gray.900" letterSpacing="2px">{children}</Text>
    </Box>
);

const ListText = ({children, displayBreakpoints}) => (
    <Box w="100%" h="10" mt="0.6em" display={displayBreakpoints}>
        <Text fontWeight="600" fontSize="md" color="black">{children}</Text>
    </Box>
);

const secondsToTime = (e) => {
    var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
        s = Math.floor(e % 60).toString().padStart(2, '0');

    return m + ':' + s;
}

function BeatList(props) {
    const [List, setList] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const show = props.show;
    const playlist = props.playlist;

    useEffect(() => {
        let isMounted = true;
        if (props.query) {
            let variables = {searchTerm: props.query};
            if (props.query === "ALL") {
                variables = {};
            }
            Axios.post('/api/beat/getBeats', variables)
                .then(response => {
                    if (response.data.success) {
                        let newPlaylist = [];
                        response.data.beats.forEach((beat, index) => {
                            newPlaylist[index] = {
                                _id: beat._id,
                                title: beat.title,
                                tags: beat.tags,
                                producer: beat.producer.username,
                                price: beat.price,
                                url: beat.url,
                                image: beat.artwork[0],
                                audio: beat.previewAudio[0],
                                length: beat.length,
                                bpm: beat.bpm,
                                isPlaying: false,
                                isPaused: false,
                                index: index
                            };
                        });
                        if (isMounted) {
                            setList(newPlaylist);
                            setIsLoading(false);
                        }
                    }
                });
        }
        return () => {isMounted = false};
    }, [props.query]);

    const dispatch = useDispatch();

    const setIndexHandler = (i) => {
        dispatch(setIndex(i));
    }

    const setShowHandler = (bool) => {
        dispatch(setShow(bool));
    }

    const setPlaylistHandler = (playlist) => {
        dispatch(setPlaylist(playlist));
    }

    const playAudio = (index) => {
        if (!show) {
            setShowHandler(true);
        }
        if (playlist === undefined || playlist.length === 0) {
            setPlaylistHandler(List);
            setIndexHandler(index);
        } else {
            // Prevents calling setPlaylist if playlist
            // did not change
            if (playlist.length !== List.length) {
                setPlaylistHandler(List);
            } else {
                for (let i = 0; i < playlist.length; i++) {
                    if (List[i]) {
                        if (List[i]._id !== playlist[i]._id) {
                            setPlaylistHandler(List);
                            break;
                        }
                    }
                }
            }
            setIndexHandler(index);
        }
    }

    const addToCartHandler = (beatId) => {
        dispatch(addToCart(beatId, window.localStorage.getItem("cartId")));
        toast({
            title: "Added to cart!",
            position: "bottom-right",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    }

    // Render the beats in a list
    const renderListItems = List.map((beat, index) => {
        return (
            <Box key={index} maxWidth={["480px", "768px", "992px", "1166px"]} margin="auto">
                <Grid templateColumns={{base: "1fr 3fr 4fr", md: "1fr 4fr 6fr 4fr", lg: "1fr 5fr 1fr 1fr 5fr 3fr"}} gap={6}>
                    <Fade in={!IsLoading} unmountOnExit={true}>
                        <Image
                            borderRadius="3px"
                            boxSize="44px"
                            src={beat.image}
                            fallbackSrc="https://via.placeholder.com/44"
                            cursor="pointer"
                            onClick={() => playAudio(index)} />
                    </Fade>

                    <ListText><Link to={`/beat/${beat.url}`}>{beat.title}</Link></ListText>

                    <ListText displayBreakpoints={{base: "none", lg: "initial"}}>{secondsToTime(beat.length)}</ListText>

                    <ListText displayBreakpoints={{base: "none", lg: "initial"}}>{beat.bpm}</ListText>

                    <Stack spacing={2} isInline display={{base: "none", md: "initial"}} mt="0.45em">
                        {beat.tags.map((tag, i) => (
                            <Tag as={Link} to={`/beats?search_keyword=${tag}`} size="md" key={i} colorScheme="blue">
                                <TagLeftIcon as={FaHashtag} boxSize="13px" />
                                <TagLabel lineHeight="2em" mt="-0.1em" maxWidth={{base: "5ch", md: "6ch", lg: "8ch"}}>{tag}</TagLabel>
                            </Tag>
                        ))}
                    </Stack>

                    <ButtonGroup spacing={2} ml="auto">
                        <IconButton
                            variant="outline"
                            colorScheme="blue"
                            aria-label="Free download"
                            icon={<IoMdDownload />}
                        />

                        <Button leftIcon={<FaShoppingCart />} colorScheme="blue" variant="solid" onClick={() => addToCartHandler(beat._id)}>
                            ${beat.price}
                        </Button>
                    </ButtonGroup>

                </Grid>
                {index !== (List.length - 1) ? // adds divider between list items
                    <Divider mb={2} /> :
                    <></>
                }
            </Box>
        );
    });

    const PageContents = () => {
        return (
            <Box>
                <Grid templateColumns={{base: "1fr 3fr 4fr", md: "1fr 4fr 6fr 4fr", lg: "1fr 5fr 1fr 1fr 5fr 3fr"}} gap={6}>
                    <div></div>
                    <ListHeading displayBreakpoints={{base: "none", md: "initial"}}>TITLE</ListHeading>
                    <ListHeading displayBreakpoints={{base: "none", lg: "initial"}}>TIME</ListHeading>
                    <ListHeading displayBreakpoints={{base: "none", lg: "initial"}}>BPM</ListHeading>
                    <ListHeading displayBreakpoints={{base: "none", md: "initial"}}>TAGS</ListHeading>
                    <div></div>
                </Grid>
                {renderListItems}
            </Box>
        );
    }

    const EmptyState = () => {
        return (
            <Box m="5em 1em 5em 1em" display="flex" justifyContent="center">
                <Box maxWidth={["480px", "768px", "992px", "1166px"]} margin="auto">
                    <Heading>No beats found.</Heading>
                </Box>
            </Box>
        );
    }

    if (IsLoading) {
        return <LoadingView />;
    } else if (List.length === 0) {
        return <EmptyState />;
    } else {
        return <PageContents />;
    }
}

const mapStateToProps = (state) => {
    return {
        show: state.playlist.show,
        playlist: state.playlist.playlist
    }
}

export default connect(mapStateToProps)(BeatList);

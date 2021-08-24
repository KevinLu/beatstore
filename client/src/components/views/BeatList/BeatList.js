import React, {useEffect, useState} from 'react';
import {useDispatch, connect} from 'react-redux';
import {addToCart} from '../../../_actions/cart_actions';
import {setIndex, setShow, setPlaylist} from '../../../_actions/playlist_actions';
import {Link, useLocation, withRouter} from 'react-router-dom';
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
    <Box w="100%" h="10" mt="0.6em" display={displayBreakpoints} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
        <Text fontWeight="600" fontSize="md" color="black">{children}</Text>
    </Box>
);

const secondsToTime = (e) => {
    var m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
        s = Math.floor(e % 60).toString().padStart(2, '0');

    return m + ':' + s;
}

const SHOW_INCRMENT = 10;
let listLength = 0;
let beatsList = [];
let firstLoad = true;
let noMoreBeats = false;

function BeatList(props) {
    const {cart, show, playlist} = props;
    const [List, setList] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);
    const [IsLoadingMore, setIsLoadingMore] = useState(false);
    const location = useLocation();
    const toast = useToast();

    const getBeats = (amount, query) => {
        setIsLoadingMore(true);
        let variables = {
            skip: listLength,
            limit: amount,
            searchTerm: query === "ALL" ? "" : query
        };
        Axios.post('/api/beat/getBeats', variables)
            .then(response => {
                if (response.data.success) {
                    setIsLoadingMore(false);
                    if (response.data.count === 0) {
                        window.removeEventListener('scroll', loadMore);
                        noMoreBeats = true;
                    }
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
                    listLength = listLength + newPlaylist.length;
                    beatsList = [...beatsList, ...newPlaylist];
                    setList(beatsList);
                    setIsLoading(false);
                }
            });
    }

    const loadMore = () => {
        if (firstLoad) {
            firstLoad = false;
        } else {
            // console.log("window.innerHeight", window.innerHeight);
            // console.log("document.documentElement.scrollTop", document.documentElement.scrollTop);
            // console.log("document.scrollingElement.scrollHeight", document.scrollingElement.scrollHeight);
            if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
                getBeats(SHOW_INCRMENT, props.query);
            }
        }
    }

    useEffect(() => {
        if (props.query) {
            getBeats(props.limit, props.query);
        }
        // Enable infinite scroll if on search results page
        if (location.pathname === "/beats") {
            window.addEventListener('scroll', loadMore);
        }
        return () => {
            firstLoad = true;
            noMoreBeats = false;
            listLength = 0;
            beatsList = [];
            window.removeEventListener('scroll', loadMore);
        };
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

    const EmptyState = () => (
        <Box m="5em 1em 5em 1em" display="flex" justifyContent="center">
            <Box maxWidth={["480px", "768px", "992px", "1166px"]} margin="auto">
                <Heading>No beats found.</Heading>
            </Box>
        </Box>
    );

    const isBeatInCart = (beatId) => {
        return cart.some(beat => beat.item === beatId);
    }

    if (IsLoading) {
        return <LoadingView />;
    } else if (List.length === 0) {
        return <EmptyState />;
    } else {
        return (
            <>
                <Grid templateColumns={{base: "1fr 3fr 4fr", md: "1fr 4fr 6fr 4fr", lg: "1fr 5fr 1fr 1fr 5fr 3fr"}} gap={6}>
                    <div></div>
                    <ListHeading displayBreakpoints={{base: "none", md: "initial"}}>TITLE</ListHeading>
                    <ListHeading displayBreakpoints={{base: "none", lg: "initial"}}>TIME</ListHeading>
                    <ListHeading displayBreakpoints={{base: "none", lg: "initial"}}>BPM</ListHeading>
                    <ListHeading displayBreakpoints={{base: "none", md: "initial"}}>TAGS</ListHeading>
                    <div></div>
                </Grid>
                {List.map((beat, index) => {
                    const isInCart = isBeatInCart(beat._id);
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

                                    <Button
                                        leftIcon={isInCart ? null : <FaShoppingCart />}
                                        colorScheme="blue"
                                        style={{background: isInCart ? "#63b3ed" : null}}
                                        variant="solid"
                                        onClick={() => addToCartHandler(beat._id)}>
                                        {isInCart ? "IN CART" : `$${beat.price}`}
                                    </Button>
                                </ButtonGroup>

                            </Grid>
                            {index !== (List.length - 1) ? // adds divider between list items
                                <Divider mb={2} /> : null
                            }
                        </Box>
                    );
                })}
                {IsLoadingMore ? <LoadingView /> : null}
                {noMoreBeats ? <Text textAlign="center" fontSize="xl" mt={4}>No more beats.</Text> : null}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state.cart.items,
        show: state.playlist.show,
        playlist: state.playlist.playlist
    }
}

export default withRouter(connect(mapStateToProps)(BeatList));

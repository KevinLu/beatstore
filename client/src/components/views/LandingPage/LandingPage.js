import React, { useEffect, useState } from 'react';
import SearchBox from './Sections/SearchBox'
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
    Divider
} from "@chakra-ui/core";
import { FaHashtag, FaCartPlus } from 'react-icons/fa';

const ListHeading = ({ children }) => (
    <Box w="100%" h="10">
        <Text fontWeight="600" fontSize="sm" color="gray.900" letterSpacing="2px">{children}</Text>
    </Box>
);

const ListText = ({ children }) => (
    <Box w="100%" h="10" mt="0.5em">
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
    const [IsLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const getBeats = (variables) => {
        setIsLoading(true);
        Axios.post('/api/beat/getBeats', variables)
            .then(response => {
                setTimeout(() => {
                    if (response.data.success) {
                        setBeats(Beats.concat(response.data.beats))
                        setCount(response.data.count)
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
                }, 100);
            });
    };

    // Load the beats
    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
        getBeats(variables);
    }, []);

    // Render the beats in a list
    const renderListItems = Beats.map((beat, index) => {
        return (
            <Box key={index} maxWidth="1166px" margin="auto">
                <Grid templateColumns="1fr 5fr 1fr 1fr 4fr 3fr" gap={6}>
                    <Image borderRadius="3px" size="44px" src={`http://localhost:5000/${beat.images[0]}`}></Image>

                    <ListText><Link to={`/beat/${beat.url}`}>{beat.title}</Link></ListText>

                    <ListText>{secondsToTime(beat.bpm)}</ListText>

                    <ListText>{beat.bpm}</ListText>

                    <Stack spacing={2} isInline height={10}>
                        {beat.tags.map((tag, i) => (
                            <Tag size="md" key={i} variantColor="blue">
                                <TagIcon as={FaHashtag} size="13px" />
                                <TagLabel mt="-0.1em">{tag}</TagLabel>
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

                        <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid">
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

    return (
        <Box m="5em 0 5em 0">
            {Beats.length === 0 ?
                <Box maxWidth="1166px" margin="auto">
                    <Box maxWidth="700px" margin="auto auto 15em">
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
                </Box> :
                <Box maxWidth="1166px" margin="auto">
                    <Box maxWidth="700px" margin="auto auto 15em">
                        <SearchBox placeholder="What type of beats are you looking for?" width="700px" />
                    </Box>
                    <Box>
                        <Grid templateColumns="1fr 5fr 1fr 1fr 4fr 3fr" gap={6}>
                            <div></div>
                            <ListHeading>TITLE</ListHeading>
                            <ListHeading>TIME</ListHeading>
                            <ListHeading>BPM</ListHeading>
                            <ListHeading>TAGS</ListHeading>
                            <div></div>
                        </Grid>
                        {renderListItems}
                        <Box display="flex" justifyContent="center" mt={10}>
                            <Button variantColor="blue" onClick={loadMore} isLoading={IsLoading}>LOAD MORE</Button>
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default LandingPage

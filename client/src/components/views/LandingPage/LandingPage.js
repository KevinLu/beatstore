import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Text,
    Skeleton,
    Grid,
    Box,
    IconButton,
    Button,
    ButtonGroup,
    useToast,
    Tag,
    TagLabel,
    TagIcon,
    Image,
    Heading,
    Divider
} from "@chakra-ui/core";
import { FaHashtag, FaCartPlus } from 'react-icons/fa';

const ListHeading = ({ children, width }) => (
    <Box w="100%" h="10">
        <Text fontWeight="600" fontSize="sm" color="gray.900" letterSpacing="2px">{children}</Text>
    </Box>
);

const ListText = ({ children, width }) => (
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
    const toast = useToast();

    // Load the beats
    useEffect(() => {
        Axios.post('/api/beat/getBeats')
            .then(response => {
                if (response.data.success) {
                    setBeats(response.data.beats)
                    console.log(response.data.beats)
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
            })
    }, []);

    // Render the beats in a list
    const renderListItems = Beats.map((beat, index) => {
        return (
            <Box key={index} maxWidth="1166px" margin="auto auto 1em auto">
                <Grid templateColumns="1fr 5fr 1fr 1fr 4fr 3fr" gap={6}>
                    <Image borderRadius="3px" size="44px" src={`http://localhost:5000/${beat.images[0]}`}></Image>
                    <ListText>{beat.title}</ListText>
                    <ListText>{secondsToTime(beat.bpm)}</ListText>
                    <ListText>{beat.bpm}</ListText>
                    <Box mt="0.5em">
                        {beat.tags.map((tag, i) => (
                            <Tag size="md" key={i} variantColor="blue" mr={2}>
                                <TagIcon as={FaHashtag} size="12px" />
                                <TagLabel>{tag}</TagLabel>
                            </Tag>
                        ))}
                    </Box>
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
                {index !== (Beats.length - 1) ?
                    <Divider /> :
                    <></>
                }
            </Box>
        );
    });

    return (
        <Box p="5em 0 5em 0">
            {Beats.length === 0 ?
                <Box>
                    <Heading display="flex" justifyContent="center">No beats uploaded yet</Heading>
                </Box> :
                <Box maxWidth="1166px" margin="auto">
                    <Grid templateColumns="1fr 5fr 1fr 1fr 4fr 3fr" gap={6}>
                        <div></div>
                        <ListHeading>TITLE</ListHeading>
                        <ListHeading>TIME</ListHeading>
                        <ListHeading>BPM</ListHeading>
                        <ListHeading>TAGS</ListHeading>
                        <div></div>
                    </Grid>
                    {renderListItems}
                    <Box display="flex" justifyContent="center">
                        <Button variantColor="blue">BROWSE ALL</Button>
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default LandingPage

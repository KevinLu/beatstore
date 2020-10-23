import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { addToCart } from '../../../_actions/cart_actions';
import { Box, Flex, Skeleton, Icon, Image, Text, Heading, Button, ButtonGroup, Stack, Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { FaHashtag, FaCartPlus } from 'react-icons/fa';
import { MdDateRange, MdMusicNote } from 'react-icons/md';

function BeatPage(props) {
    const beatUrl = props.match.params.beatUrl;
    const [Beat, setBeat] = useState({
        "bpm": 0,
        "length": 0,
        "price": 0,
        "previewAudio": [],
        "artwork": [],
        "tags": [],
        "_id": "",
        "producer": {
            "role": 0,
            "_id": "",
            "email": "",
            "password": "",
            "name": "",
            "image": "",
            "__v": 0,
            "token": "",
            "tokenExp": 0
        },
        "title": "",
        "description": "",
        "date": "",
        "url": "",
        "__v": 0
    });
    const [BeatLoaded, setBeatLoaded] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        Axios.get(`/api/beat/beats_by_url?url=${beatUrl}&type=single`)
            .then(response => {
                if (response.data.length !== 0) { // no beats found
                    setBeat(response.data[0]); // only set 1 beat
                    setBeatLoaded(true);
                } else {
                    props.history.push("../404");
                }
            });
    }, []);

    const addToCartHandler = (beatId) => {
        dispatch(addToCart(beatId, window.localStorage.getItem("cartId")));
    }

    return (
        <Box m="5em 1em 5em 1em">
            <Flex maxWidth={["480px", "480px", "480px", "1166px"]} margin="auto" flexWrap="wrap" flexDirection={{base: "column", lg: "row"}}>
                <Skeleton isLoaded={BeatLoaded} margin="auto" borderRadius="3px" size="208px">
                    <Image borderRadius="3px" size="208px" src={Beat.artwork[0]}></Image>
                </Skeleton>

                <Flex flexDir="column" flexGrow="1">
                    <Stack mt={{base: 3, lg: 0}} textAlign={{ base: "center", lg: "initial" }} ml={{ base: "0", lg: "2em" }}>
                        <Heading as="h2" size="xl">{Beat.title}</Heading>
                        <div>
                            <Skeleton size="15px" isLoaded={BeatLoaded} display="inline">
                                <Icon name="star" color="orange.400" mr={1} />
                                <Text fontSize="md" fontWeight="600" color="black" display="inline" verticalAlign="middle">{Beat.producer.username}</Text>
                            </Skeleton>
                        </div>
                    </Stack>

                    <Stack mt={3} isInline display="block" textAlign={{ base: "center", lg: "initial" }} ml={{ base: "0", lg: "2em" }}>
                        <Tag size="md" variantColor="gray">
                            <TagIcon as={MdMusicNote} size="15px" />
                            <TagLabel mt="-0.1em">{Beat.bpm}</TagLabel>
                        </Tag>
                        <Tag size="md" variantColor="gray">
                            <TagIcon as={MdDateRange} size="16px" />
                            <TagLabel>{Beat.date}</TagLabel>
                        </Tag>
                    </Stack>

                    <Skeleton isLoaded={BeatLoaded} mt={3} ml={{ base: "0", lg: "2em" }}>
                        <Text
                            textAlign={{ base: "center", lg: "initial" }}
                            fontSize="md"
                            color="black"
                            overflow="hidden"
                            maxW="85ch"
                            style={{display: "-webkit-box", WebkitLineClamp: 3, textOverflow: "ellipsis", WebkitBoxOrient: "vertical"}}>
                            "{Beat.description}"
                        </Text>
                    </Skeleton>

                    <ButtonGroup spacing={2} margin={{ base: "1em auto 0 auto", lg: "1em 0 0 2em" }} display="flex" justifyContent={{ base: "center", lg: "left" }}>
                        <Skeleton isLoaded={BeatLoaded} display="inline-block">
                            <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid" onClick={() => addToCartHandler(Beat._id)}>
                                ${Beat.price}
                            </Button>
                        </Skeleton>
                        <Skeleton isLoaded={BeatLoaded} display="inline-block">
                            <Button leftIcon="download" variantColor="blue" variant="outline">
                                DOWNLOAD
                            </Button>
                        </Skeleton>
                    </ButtonGroup>
                </Flex>
                <Stack spacing={2} isInline height={10} margin={{ base: "1em auto 0 auto", lg: "auto 0 0 0" }}>
                    {Beat.tags.map((tag, i) => (
                        <Tag size="md" key={i} variantColor="blue">
                            <TagIcon as={FaHashtag} size="13px" />
                            <TagLabel mt="-0.1em" fontWeight="600" maxWidth={{ base: "10ch", md: "12ch", lg: "15ch" }}>{tag}</TagLabel>
                        </Tag>
                    ))}
                </Stack>
            </Flex>
        </Box>
    );
}

export default withRouter(BeatPage)

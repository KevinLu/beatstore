import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Box, Grid, Skeleton, Icon, Image, Text, Heading, Button, ButtonGroup, Stack, Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { FaHashtag, FaCartPlus } from 'react-icons/fa';
import { MdDateRange, MdMusicNote } from 'react-icons/md';

function BeatPage(props) {
    const beatUrl = props.match.params.beatUrl;
    const [Beat, setBeat] = useState({
        "bpm": 0,
        "length": 0,
        "price": 0,
        "audios": [],
        "images": [],
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

    useEffect(() => {
        Axios.get(`/api/beat/beats_by_url?url=${beatUrl}&type=single`)
            .then(response => {
                setBeat(response.data[0]); // only set 1 beat
                setBeatLoaded(true);
            });
    }, []);

    return (
        <Box m="5em 0 5em 0">
            <Grid templateColumns="1fr">
                <Skeleton isLoaded={BeatLoaded} margin="auto" borderRadius="3px" size="180px">
                    <Image borderRadius="3px" size="180px" src={`http://localhost:5000/${Beat.images[0]}`}></Image>
                </Skeleton>

                <Stack mt={2} textAlign="center">
                    <Heading as="h2" size="xl">{Beat.title}</Heading>
                    <div>
                        <Skeleton size="15px" isLoaded={BeatLoaded} display="inline">
                            <Icon name="star" color="orange.400" mr={1} />
                            <Text fontSize="md" fontWeight="600" color="black" display="inline" verticalAlign="middle">{Beat.producer.name}</Text>
                        </Skeleton>
                    </div>
                </Stack>

                <Stack margin="1em auto 0 auto" isInline textAlign="center">
                    <Tag size="md" variantColor="gray">
                        <TagIcon as={MdMusicNote} size="15px" />
                        <TagLabel mt="-0.1em">{Beat.bpm}</TagLabel>
                    </Tag>
                    <Tag size="md" variantColor="gray">
                        <TagIcon as={MdDateRange} size="16px" />
                        <TagLabel>{Beat.date}</TagLabel>
                    </Tag>
                </Stack>

                <Skeleton isLoaded={BeatLoaded} width="10em" height="2em" margin="1em auto 0 auto">
                    <Text textAlign="center" fontSize="md" color="black">"{Beat.description}"</Text>
                </Skeleton>

                <ButtonGroup spacing={2} margin="1em auto 0 auto">
                    <Skeleton isLoaded={BeatLoaded} display="inline-block">
                        <Button leftIcon={FaCartPlus} variantColor="blue" variant="solid">
                            ${Beat.price}
                        </Button>
                    </Skeleton>
                    <Skeleton isLoaded={BeatLoaded} display="inline-block">
                        <Button leftIcon="download" variantColor="blue" variant="outline">
                            DOWNLOAD
                    </Button>
                    </Skeleton>
                </ButtonGroup>

                <Stack spacing={2} isInline height={10} margin="1em auto 0 auto">
                    {Beat.tags.map((tag, i) => (
                        <Tag size="md" key={i} variantColor="blue">
                            <TagIcon as={FaHashtag} size="13px" />
                            <TagLabel mt="-0.1em" fontWeight="600">{tag}</TagLabel>
                        </Tag>
                    ))}
                </Stack>
            </Grid>
        </Box>
    );
}

export default withRouter(BeatPage)

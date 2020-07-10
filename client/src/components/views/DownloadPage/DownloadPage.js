import React, { useEffect, useState } from 'react';
import {
    Box,
    Image,
    Flex,
    Badge,
    Text,
    Link,
    Button,
    Stack,
    useToast
} from '@chakra-ui/core';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Axios from 'axios';
import LoadingView from '../../utils/LoadingView';

function DownloadPage() {
    const location = useLocation();
    const queries = queryString.parse(location.search);
    const toast = useToast();

    const [Items, setItems] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);

    const verifyOrderIsPaid = (session_id) => {
        Axios.get(`/api/order/getOrderStatus?session_id=${session_id}`)
            .then(response => {
                if (response.data.success) {
                    if (response.data.orderStatus === "succeeded") {
                        toast({
                            title: "Thank you for your purchase!",
                            description: "Please download your files here.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
                        setItems(response.data);
                    } else {
                        toast({
                            title: "Payment not yet received.",
                            description: "We haven't received your payment yet, please check back later.",
                            status: "error",
                            duration: 9000,
                            isClosable: true,
                        });
                    }
                }
                setIsLoading(false);
            })
            .catch(err => {
                toast({
                    title: "An error occurred.",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
    };

    useEffect(() => {
        verifyOrderIsPaid(queries.session_id);
    }, []);

    const DownloadView = () => {
        if (IsLoading) {
            return (
                <Box margin="40vh auto">
                    <LoadingView isLoading={IsLoading} />
                </Box>
            );
        } else {
            return (
                <div>
                    <Box mt={2} textAlign="center" lineHeight="short" d="flex" flexDir="column" justifyContent="center" mt="3em">
                        <Text fontSize="3xl" fontWeight="semibold">
                            Thank you for purchasing! Please download your files below.
                        </Text>
                        <Text fontSize="xl" mt="1em">
                            Please save this link if you want to download your files again.
                        </Text>
                    </Box>
                    {Items.lineItems.map((item, index) => {
                        return (
                            <Box key={index} width="300px" m="auto" mt="5em" mb="5em">
                                <Box border="1px solid #CBD5E0" rounded="md" p="1.5em">
                                    <Image rounded="md" src={item.artwork[0]} fallbackSrc="https://via.placeholder.com/300" width="300px" />
                                    <Flex align="baseline" mt={2}>
                                        <Badge variantColor="blue">PREMIUM</Badge>
                                        <Text
                                            ml={2}
                                            textTransform="uppercase"
                                            fontSize="sm"
                                            fontWeight="bold"
                                            color="blue.800"
                                        >
                                            MP3 &bull; 320kbps
                                            </Text>
                                    </Flex>
                                    <Stack spacing={2}>
                                        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
                                            {item.title}
                                        </Text>
                                        <Text>{item.description}</Text>
                                        <Button as="a" href={Items.downloadLinks[index]} mt={2} leftIcon="download" variantColor="blue" variant="solid">
                                            Download
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        )
                    })}
                    <Text fontSize="xl" mt="1em" mb="1em" d="flex" justifyContent="center">
                        Download not working? Contact me at&nbsp;
                        <Link color="blue.500" href="mailto:prodglace@gmail.com">prodglace@gmail.com</Link>
                    </Text>
                </div>
            );
        }
    }

    return (
        <DownloadView />
    )
}

export default DownloadPage

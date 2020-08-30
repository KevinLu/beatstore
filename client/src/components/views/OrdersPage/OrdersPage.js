import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Axios from 'axios';
import {
    Box,
    Grid,
    Stack,
    Heading,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useToast,
    Image,
    Divider
} from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import LoadingView from '../../utils/LoadingView';

function OrdersPage() {
    const [IsLoading, setIsLoading] = useState(true);
    const [Orders, setOrders] = useState([]);

    const location = useLocation();
    const queries = queryString.parse(location.search);
    const toast = useToast();

    useEffect(() => {
        Axios.get('/api/order/getUserOrders')
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    toast({
                        title: "An error occurred.",
                        description: "Couldn't fetch order history, please try again.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
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
    }, []);

    const verifyOrderIsPaid = () => {
        Axios.get(`/api/order/getOrderStatus?session_id=${queries.session_id}`)
            .then(response => {
                if (response.data.success) {
                    if (response.data.paymentIntent.status === "succeeded") {
                        toast({
                            title: "Thank you for your purchase!",
                            description: "You can find your orders here.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
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

    const renderOrderItems = Orders.map((order, index) => {
        var orderTotal = 0;
        var currency = "USD"; // Default currency is USD as set in Stripe

        return (
            <Box key={index} border="1px solid" borderColor="gray.200" borderRadius="4px" mb={4} p={4}>
                <Heading as="h4" size="md" fontWeight="600" mb={4}>ORDER DATE: {order.date.substring(0, 10)}</Heading>
                {order.products.map((product, index) => {
                    orderTotal += product.amount_total;
                    // This will break if items are in different currencies
                    // -> shouldn't happen (?) because currency is set in Stripe
                    currency = product.currency.toUpperCase();

                    return (
                        <div key={index}>
                            <Grid templateColumns={{base: "1fr 2fr 1fr", lg: "auto auto 1fr"}} gap={6} alignItems="center" mb={4}>
                                <Link to={"/beat/" + product.url}>
                                    <Image
                                        borderRadius="3px"
                                        size={{base: "60px", lg: "80px"}}
                                        src={product.image}
                                        fallbackSrc="https://via.placeholder.com/80"
                                        cursor="pointer"
                                    />
                                </Link>
                                <Stack>
                                    <Link to={"/beat/" + product.url}>
                                        <Heading as="h3" size="lg" fontWeight="600">{product.description}</Heading>
                                    </Link>
                                    <Text wordWrap="anywhere" fontSize="md" fontWeight="400">${product.amount_total / 100} {product.currency.toUpperCase()}</Text>
                                </Stack>
                                <Box ml="auto">
                                    <Menu>
                                        <MenuButton as={Button} rightIcon="chevron-down">
                                            Actions
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem>Download</MenuItem>
                                            <MenuItem>View License</MenuItem>
                                            <MenuItem>View Receipt</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </Grid>
                        </div>
                    );
                })}
                <Divider borderColor="gray.400" />
                <Heading as="h3" size="lg" fontWeight="600">Total: ${orderTotal / 100} {currency}</Heading>
            </Box>
        );
    });

    return (
        <div>
            <Button onClick={verifyOrderIsPaid}>Verify session id</Button>
            <Box m="3em 1em 5em 1em">
                <Box maxWidth={["480px", "500px", "600px", "1166px"]} margin="auto">
                    <Heading mb={8}>ORDERS</Heading>
                    {Orders.length > 0 ?
                        renderOrderItems
                        : IsLoading ?
                            <LoadingView isLoading={IsLoading} />
                            :
                            <Text fontSize="lg">No orders found! Check out more beats
                                <Link to="/">
                                    &nbsp;<u>here</u>
                                </Link>.
                            </Text>
                    }
                </Box>
            </Box>
        </div>
    );
}

export default OrdersPage

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Axios from 'axios';
import { Box, Heading, Button, useToast } from '@chakra-ui/core';
import LoadingView from '../../utils/LoadingView';

function OrdersPage() {
    const [IsLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const queries = queryString.parse(location.search);
    const toast = useToast();

    useEffect(() => {
        Axios.get('/api/order/getUserOrders')
            .then(response => {
                console.log(response);
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

    const OrdersView = () => {
        if (IsLoading) {
            return <LoadingView isLoading={IsLoading} />
        }
    };

    return (
        <div>
            <Button onClick={verifyOrderIsPaid}>Verify session id</Button>
            <Box m="3em 1em 5em 1em">
                <Box maxWidth={["480px", "500px", "600px", "1166px"]} margin="auto">
                    <Heading>ORDERS</Heading>
                    <OrdersView />
                </Box>
            </Box>
        </div>
    );
}

export default OrdersPage

import React from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Axios from 'axios';
import { Button, useToast } from '@chakra-ui/core';

function OrdersPage() {
    const location = useLocation();
    const queries = queryString.parse(location.search);
    const toast = useToast();

    const verifyCheckoutSessionId = () => {
        Axios.get(`/api/order/getSession?session_id=${queries.session_id}`)
            .then(response => {
                if (response.data.success) {
                    toast({
                        title: "Thank you for your purchase!",
                        description: "You can find your orders here.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
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

    return (
        <div>
            <Button onClick={verifyCheckoutSessionId}>Verify session id</Button>
        </div>
    )
}

export default OrdersPage

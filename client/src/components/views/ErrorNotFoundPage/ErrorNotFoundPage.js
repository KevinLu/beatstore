import React from 'react';
import { Heading, Text, Flex } from "@chakra-ui/core";

function ErrorNotFoundPage() {
    return (
        <Flex alignItems="center" flexDirection="column" m="10%">
            <Heading>404</Heading>
            <Text>Page not found.</Text>
        </Flex>
    )
}

export default ErrorNotFoundPage

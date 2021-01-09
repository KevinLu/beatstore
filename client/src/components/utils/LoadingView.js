import React from 'react';
import {Box, Spinner} from '@chakra-ui/react';

function LoadingView() {
    return (
        <Box display="flex" justifyContent="center" mt={10}>
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl" />
        </Box>
    );
}

export default LoadingView

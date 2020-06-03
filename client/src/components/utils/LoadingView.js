import React from 'react';
import { Box, CircularProgress } from '@chakra-ui/core';

function LoadingView(props) {
    return (
        <Box display="flex" justifyContent="center">
            <CircularProgress isIndeterminate={props.isLoading} color="blue" />
        </Box>
    );
}

export default LoadingView

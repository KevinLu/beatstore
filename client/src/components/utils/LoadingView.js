import React from 'react';
import { Box, CircularProgress } from '@chakra-ui/react';

function LoadingView(props) {
    return (
        <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress isIndeterminate={props.isLoading} color="blue" />
        </Box>
    );
}

export default LoadingView

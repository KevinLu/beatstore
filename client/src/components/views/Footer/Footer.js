import React from 'react'
import { Grid, Box, List, ListItem } from "@chakra-ui/core";

function Footer() {
    return (
        <Box bg="blue.50" p="5em 0 5em 0">
            <Grid maxWidth="800px" templateColumns="repeat(3, 1fr)" margin="0 auto">
                <Box w="100%" justifyContent="center" display="flex">
                    <List spacing={3} color="black" fontSize="lg">
                        <ListItem>Home</ListItem>
                        <ListItem>Beats</ListItem>
                    </List>
                </Box>
                <Box w="100%" justifyContent="center" display="flex">
                    <List spacing={3} color="black" fontSize="lg">
                        <ListItem>About</ListItem>
                        <ListItem>Contact</ListItem>
                    </List>
                </Box>
                <Box w="100%" justifyContent="center" display="flex">
                    <List spacing={3} color="black" fontSize="lg">
                        <ListItem>Licensing Info</ListItem>
                        <ListItem>Terms of use</ListItem>
                        <ListItem>Privacy policy</ListItem>
                    </List>
                </Box>
            </Grid>
        </Box>
    )
}

export default Footer

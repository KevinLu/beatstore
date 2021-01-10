import React from 'react';
import {Avatar, Button, MenuButton} from "@chakra-ui/react";
import {Link} from 'react-router-dom';

const UserIcon = (props) => {
    const {isLoaded, isAuth, isAdmin, image} = props;

    if (!isLoaded) {
        return null;
    } else if (isAuth || isAdmin) { // all logged in users have this (including admin)
        return (
            <MenuButton display="flex" alignItems="center">
                <Avatar size="sm" src={image} />
            </MenuButton>
        );
    } else {
        return (
            <Link to="/login">
                <Button colorScheme="blue">Login</Button>
            </Link>
        );
    }
}

export default UserIcon;

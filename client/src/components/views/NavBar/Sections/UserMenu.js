import React from 'react';
import {Box, MenuList, MenuItem, MenuGroup, MenuDivider} from "@chakra-ui/react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import {USER_SERVER} from '../../../Config';

function delete_cookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function UserMenu(props) {
    const {isAuth, isAdmin, username} = props;

    const logoutHandler = () => {
		axios.get(`${USER_SERVER}/logout`).then(response => {
			if (response.data.success) {
				delete_cookie("w_auth");
				window.location.reload();
			}
		});
	};

    if (isAdmin) {
        return (
            <Box zIndex="3">
                <MenuList>
                    <MenuGroup color="black" title={username}>
                        <MenuItem color="black">My account</MenuItem>
                        <Link to="/orders">
                            <MenuItem color="black">Orders</MenuItem>
                        </Link>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup color="black" title="Admin">
                        <Link to="/dashboard">
                            <MenuItem color="black">Dashboard</MenuItem>
                        </Link>
                        <Link to="/upload">
                            <MenuItem color="black">Upload</MenuItem>
                        </Link>
                    </MenuGroup>
                    <MenuDivider />
                    <Link onClick={logoutHandler} to="/login">
                        <MenuItem color="black">Logout</MenuItem>
                    </Link>
                </MenuList>
            </Box>
        );
    } else if (isAuth) {
        return (
            <Box zIndex="3">
                <MenuList>
                    <MenuItem color="black">My account</MenuItem>
                    <Link to="/orders">
                        <MenuItem color="black">Orders</MenuItem>
                    </Link>
                    <MenuDivider />
                    <Link onClick={logoutHandler} to="/login">
                        <MenuItem color="black">Logout</MenuItem>
                    </Link>
                </MenuList>
            </Box>
        );
    } else {
        return null;
    }
}

export default UserMenu;

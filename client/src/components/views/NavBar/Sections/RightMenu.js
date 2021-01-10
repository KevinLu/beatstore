/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
	Box,
	Badge,
	Menu,
	Flex,
	MenuList,
	MenuItem,
	MenuGroup,
	MenuDivider
} from "@chakra-ui/react";
import axios from 'axios';
import {USER_SERVER} from '../../../Config';
import {withRouter, Link} from 'react-router-dom';
import {connect} from "react-redux";
import {FaShoppingCart} from "react-icons/fa";
import UserIcon from './UserIcon';

function delete_cookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function RightMenu(props) {
	const {userDataIsLoaded, userData, cartIsLoaded, cartLength} = props;

	const logoutHandler = () => {
		axios.get(`${USER_SERVER}/logout`).then(response => {
			if (response.data.success) {
				delete_cookie("w_auth");
				window.location.reload();
			}
		});
	};

	const UserMenu = () => {
		if (userData.role === 1) {
			return (
				<Box zIndex="3">
					<MenuList>
						<MenuGroup color="black" title={userData.username}>
							<MenuItem color="black">My account</MenuItem>
							<Link to="/orders">
								<MenuItem color="black">Orders</MenuItem>
							</Link>
						</MenuGroup>
						<MenuDivider />
						<MenuGroup color="black" title="Admin">
							<MenuItem color="black">Dashboard</MenuItem>
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
		} else if (userData.isAuth) {
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
			return (<div></div>);
		}
	};

	return (
		<Flex alignItems="center">
			<Box fontWeight="600" fontSize="lg" mr={6} display="flex">
				<Link to="/cart"><Box as={FaShoppingCart} /></Link>
				{cartIsLoaded ?
					<Badge ml="1" colorScheme="green" height="1.6em">{cartLength}</Badge> : <></>}
			</Box>
			<Menu>
				<UserIcon isLoaded={userDataIsLoaded} userData={userData} />
				<UserMenu />
			</Menu>
		</Flex>
	);
}

const mapStateToProps = (state) => {
	return {
		userDataIsLoaded: state.user.isLoaded,
		userData: state.user.userData,
		cartIsLoaded: state.cart.success,
		cartLength: state.cart.cart.array.length
	}
}

export default withRouter(connect(mapStateToProps)(RightMenu));

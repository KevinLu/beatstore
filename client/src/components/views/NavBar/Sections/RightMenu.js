import React from 'react';
import {Box, Badge, Menu, Flex} from "@chakra-ui/react";
import {withRouter, Link} from 'react-router-dom';
import {connect} from "react-redux";
import {FaShoppingCart} from "react-icons/fa";
import UserIcon from './UserIcon';
import UserMenu from './UserMenu';

function RightMenu(props) {
	const {userDataIsLoaded, userData, cartIsLoaded, cartLength} = props;

	return (
		<Flex alignItems="center">
			<Box fontWeight="600" fontSize="lg" mr={6} display="flex">
				<Link to="/cart"><Box as={FaShoppingCart} /></Link>
				{cartIsLoaded ?
					<Badge ml="1" colorScheme="green" height="1.6em">{cartLength}</Badge> : null}
			</Box>
			<Menu isLazy>
				<UserIcon
					isLoaded={userDataIsLoaded}
					isAuth={userData.isAuth}
					isAdmin={userData.role === 1}
					image={userData.image} />
				<UserMenu
					isAuth={userData.isAuth}
					isAdmin={userData.role === 1}
					username={userData.username} />
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

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Box, Badge } from "@chakra-ui/core";
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";

function RightMenu(props) {
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  const user = useSelector(state => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
        console.log(response)
      } else {
        alert('Log Out Failed');
      }
    });
  };

  if (user.userData && user.userData.isAuth) {
    return (
      <Box>
        <Box display={{ sm: "block", md: "none" }} onClick={handleToggle}>
          <svg
            fill="white"
            width="12px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>
        <Box
          display={{ sm: show ? "block" : "none", md: "flex" }}
          width={{ sm: "full", md: "auto" }}
          alignItems="center"
          flexGrow={1}
        >
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="block">
            <Link to="/upload">
              UPLOAD
          </Link>
          </Box>
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="block">
            <Link to="/login" fontSize="lg" onClick={logoutHandler}>
              LOGOUT
          </Link>
          </Box>
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="flex">
            <Link to="/cart">
              <Box as={FaShoppingCart} />
            </Link>
            <Badge ml="1" variantColor="green">{user.userData.cart.length}</Badge>
          </Box>
        </Box>
      </Box>
    )
  } else {
    return (
      <div>
        <Box display={{ sm: "block", md: "none" }} onClick={handleToggle}>
          <svg
            fill="white"
            width="12px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </Box>

        <Box
          display={{ sm: show ? "block" : "none", md: "flex" }}
          width={{ sm: "full", md: "auto" }}
          alignItems="center"
          flexGrow={1}
        >
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6}>
            <Link to="/login">
              SIGN IN
          </Link>
          </Box>
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6}>
            <Link to="/register">
              REGISTER
          </Link>
          </Box>
        </Box>
      </div>
    )
  }
}

export default withRouter(RightMenu);

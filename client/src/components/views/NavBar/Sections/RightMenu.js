/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Box, Badge } from "@chakra-ui/core";
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";

function delete_cookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function RightMenu(props) {
  const [show, setShow] = useState(false);
  const [CartLength, setCartLength] = useState(0);
  const handleToggle = () => setShow(!show);

  const user = useSelector(state => state.user);
  const cart = useSelector(state => state.cart.cart.array.length);

  useEffect(() => {
    setCartLength(cart);
  }, [cart])

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.data.success) {
        delete_cookie("w_auth");
        props.history.push("/login");
      }
    });
  };

  if (user.userData && user.userData.isAuth && user.userData.role) {
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
            <Link fontSize="lg" onClick={logoutHandler}>
              LOGOUT
        </Link>
          </Box>
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="flex">
            <Link to="/cart">
              <Box as={FaShoppingCart} />
            </Link>
            <Badge ml="1" variantColor="green">{CartLength}</Badge>
          </Box>
        </Box>
      </Box>
    )
  } else if (user.userData && user.userData.isAuth) {
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
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="block">
            <Link fontSize="lg" onClick={logoutHandler}>
              LOGOUT
        </Link>
          </Box>
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="flex">
            <Link to="/cart"><Box as={FaShoppingCart} /></Link>
            <Badge ml="1" variantColor="green">{CartLength}</Badge>
          </Box>
        </Box>
      </div>
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
          <Box fontWeight="600" fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="flex">
            <Link to="/cart">
              <Box as={FaShoppingCart} />
            </Link>
            <Badge ml="1" variantColor="green">{CartLength}</Badge>
          </Box>
        </Box>
      </div>
    );
  }
}

export default withRouter(RightMenu);

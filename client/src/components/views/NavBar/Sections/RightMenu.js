/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Box, Link } from "@chakra-ui/core";
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import { useSelector } from "react-redux";

const MenuItems = ({ children, link }) => (
  <Link as={RouterLink} to={link} fontSize="lg" mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Link>
);

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
          <MenuItems link="/beat/upload">Upload</MenuItems>
          <MenuItems><a onClick={logoutHandler}>Logout</a></MenuItems>
        </Box>
      </Box>
    )
  } else {
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
          <MenuItems link="/login">Log in</MenuItems>
          <MenuItems link="/register">Sign up</MenuItems>
        </Box>
      </Box>
    )
  }
}

export default withRouter(RightMenu);

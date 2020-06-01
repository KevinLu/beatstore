/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import {
  Avatar, Box, Badge, Menu, Button, Flex,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Icon
} from "@chakra-ui/core";
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { FaShoppingCart, FaCaretDown } from "react-icons/fa";

function delete_cookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function RightMenu() {
  const [CartLength, setCartLength] = useState(0);
  const [IsAdmin, setIsAdmin] = useState(false);
  const [IsLoggedIn, setIsLoggedIn] = useState(false);

  const user = useSelector(state => state.user.userData);
  const cart = useSelector(state => state.cart.cart.array.length);

  useEffect(() => {
    if (user) {
      if (user.isAuth) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false); // required to reset state after logout
      }
      if (user.role === 1) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false); // required to reset state after logout
      }
    }
  }, [user]);

  useEffect(() => {
    setCartLength(cart);
  }, [cart]);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.data.success) {
        delete_cookie("w_auth");
      }
    });
  };

  const UserIcon = () => {
    if (IsLoggedIn || IsAdmin) { // all logged in users have this (including admin)
      return (
        <MenuButton display="flex" alignItems="center">
          <Avatar size="sm" src={user.image} />
          <Box as={FaCaretDown}></Box>
        </MenuButton>
      );
    } else {
      return (
        <Link to="/login">
          <Button rightIcon="arrow-forward" variantColor="blue">
            Login
        </Button>
        </Link>
      );
    }
  };

  const UserMenu = () => {
    if (IsAdmin) {
      return (
        <MenuList zIndex="3">
          <MenuGroup color="black" title={user.username}>
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
      );
    } else if (IsLoggedIn) {
      return (
        <MenuList zIndex="3">
          <MenuItem color="black">My account</MenuItem>
          <Link to="/orders">
            <MenuItem color="black">Orders</MenuItem>
          </Link>
          <MenuDivider />
          <Link onClick={logoutHandler} to="/login">
            <MenuItem color="black">Logout</MenuItem>
          </Link>
        </MenuList>
      );
    } else {
      return (<div></div>);
    }
  };

  return (
    <Flex alignItems="center">
      <Box fontWeight="600" fontSize="lg" mr={6} display="flex">
        <Link to="/cart"><Box as={FaShoppingCart} /></Link>
        <Badge ml="1" variantColor="green" height="1.6em">{CartLength}</Badge>
      </Box>
      <Menu>
        <UserIcon />
        <UserMenu />
      </Menu>
    </Flex>
  );
}

export default withRouter(RightMenu);

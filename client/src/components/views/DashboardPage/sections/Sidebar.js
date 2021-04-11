import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Box, Tooltip } from '@chakra-ui/react';
import { IoIosPaper } from 'react-icons/io';
import { MdSettings, MdDashboard } from 'react-icons/md';
import { FaMusic } from 'react-icons/fa';

const NavItem = ({ title, icon }) => {
    const path = 'dashboard';
    const lowercaseTitle = title.toLowerCase();
    const isActive = window.location.pathname === `/${path}/${lowercaseTitle}` || (
        (window.location.pathname === `/${path}` || window.location.pathname === `/${path}/`)
        && title === 'Dashboard'
    );
    const pathTitle = lowercaseTitle === path ? '' : lowercaseTitle;

    return (
        <Link to={`/${path}/${pathTitle}`}>
            <Box
                as="button"
                h="38px"
                w={{ base: "auto", md: "170px", lg: "220px" }}
                textAlign={{ base: "left", md: "center" }}
                backgroundColor={isActive ? 'blue.50' : ''}
                mb="16px"
                display="flex"
                justifyContent="stretch"
                alignItems="center"
                px={{ base: "8px", md: "18px", lg: "38px" }}
                borderRadius={{ base: "8px", md: "0px" }}
            >
                <Box
                    color={isActive ? 'blue.700' : 'blueGray.500'}
                    size="24px"
                    as={icon}
                />
                <Tooltip hasArrow label={title} placement="right">
                    <Box size="24px" position="absolute" />
                </Tooltip>
                <Text
                    display={{ base: 'none', md: 'initial' }}
                    ml={{ base: "0px", md: "15px" }}
                    lineHeight="38px"
                    fontWeight="600"
                    color={isActive ? 'blue.700' : 'blueGray.500'}
                    fontSize="lg"
                >
                    {title}
                </Text>
            </Box>
        </Link>
    );
};

const Sidebar = () => {
    return (
        <Box
            h={{ base: "60px", sm: "calc(100vh - 64px)" }}
            w={{ base: "100%", sm: "60px", md: "170px", lg: "220px" }}
            position={{ base: "absolute", sm: "unset" }}
            bottom={{ base: 0, sm: "unset" }}
            display="flex"
            justifyContent="space-between"
            boxShadow="0px 1px 4px rgba(0, 0, 0, .1)">
            <Box
                w="100%"
                mx={{ base: 12, sm: 0 }}
                alignItems="center"
                display="flex"
                flexDirection={{ base: "row", sm: "column" }}
                justifyContent={{ base: "space-between", sm: "unset" }}
                textAlign="center">
                <Box
                    display={{ base: "none", sm: "initial" }}
                    w="fit-content"
                    pb="20px">
                </Box>
                <NavItem title="Dashboard" icon={MdDashboard} />
                <NavItem title="Beats" icon={FaMusic} />
                <NavItem title="Licenses" icon={IoIosPaper} />
                <NavItem title="Settings" icon={MdSettings} />
            </Box>
        </Box>
    );
};

export default Sidebar

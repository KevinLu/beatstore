import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Box, Tooltip } from '@chakra-ui/core';
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
                w={{ base: "auto", xl: "220px" }}
                textAlign={{ base: "left", lg: "center" }}
                backgroundColor={isActive ? 'blue.50' : ''}
                mb="16px"
                display="flex"
                justifyContent="stretch"
                alignItems="center"
                px={{ base: "8px", xl: "38px" }}
                borderRadius={{ base: "8px", xl: "0px" }}
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
                    display={{ base: 'none', lg: 'initial' }}
                    ml={{ base: "0px", lg: "15px", xl: "23px" }}
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

const Sidebar = ({ isMobile }) => {
    return (
        <Box
            h="calc(100vh - 64px)"
            w={{ base: "70px", lg: "190px", xl: "220px" }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection="column"
            boxShadow={isMobile ? '' : '0px 1px 4px rgba(0, 0, 0, 0.1)'}>
            <Box textAlign="center">
                <Box
                    w="fit-content"
                    margin="auto"
                    pb="20px">
                </Box>
                <NavItem title="Dashboard" icon={MdDashboard} />
                <NavItem title="Beats" icon={FaMusic} />
                <NavItem title="Licenses" icon={IoIosPaper} />
                <NavItem title="Settings" icon={MdSettings} />
            </Box>
            <Box mb="2em" display={{ base: "none", lg: "initial" }}>
                Beatstore v0.0.1
            </Box>
        </Box>
    );
};

export default Sidebar

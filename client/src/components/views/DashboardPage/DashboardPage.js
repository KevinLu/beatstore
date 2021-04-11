import React from 'react';
import Sidebar from './sections/Sidebar';
import DashboardContent from './sections/DashboardContent';
import { Flex } from '@chakra-ui/react';

function DashboardPage(props) {
    return (
        <Flex h="calc(100vh - 64px)">
            <Sidebar />
            <DashboardContent />
        </Flex>
    )
}

export default DashboardPage

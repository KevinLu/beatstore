import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardMain from './DashboardMain';
import DashboardBeats from './DashboardBeats';
import DashboardLicenses from './DashboardLicenses';
import DashboardSettings from './DashboardSettings';

function DashboardContent() {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/$/, "");

    switch (pathname) {
        case '/dashboard':
            return (<DashboardMain />);
        case '/dashboard/beats':
            return (<DashboardBeats />);
        case '/dashboard/licenses':
            return (<DashboardLicenses />);
        case '/dashboard/settings':
            return (<DashboardSettings />);
        default:
            return (<div></div>);
    }
}

export default DashboardContent

import React from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../../../hoc/auth";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage.js";
import RegisterPage from "../RegisterPage/RegisterPage.js";
import UploadBeatPage from "../UploadBeatPage/UploadBeatPage";
import OrdersPage from "../OrdersPage/OrdersPage";
import DashboardPage from "../DashboardPage/DashboardPage";
import CartPage from "../CartPage/CartPage";
import BeatPage from "../BeatPage/BeatPage";
import DownloadPage from "../DownloadPage/DownloadPage";
import SearchResultsPage from "../SearchResultsPage/SearchResultsPage";
import ErrorNotFoundPage from "../ErrorNotFoundPage/ErrorNotFoundPage";

// Auth(SpecificComponent, option, adminRoute)
// option:
const PUBLIC_PAGE = 0;
const LOGGED_IN_ONLY = 1;
const PUBLIC_ONLY = 2;
// adminRoute:
// true for Admin only
// false for all users

function Main() {
    return (
        <Switch>
            <Route exact path="/" component={Auth(LandingPage, PUBLIC_PAGE, false)} />
            <Route exact path="/login" component={Auth(LoginPage, PUBLIC_ONLY, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, PUBLIC_ONLY, false)} />
            <Route exact path="/upload" component={Auth(UploadBeatPage, LOGGED_IN_ONLY, true)} />
            <Route exact path="/beat/:beatUrl" component={Auth(BeatPage, PUBLIC_PAGE, false)} />
            <Route exact path="/cart" component={Auth(CartPage, PUBLIC_PAGE, false)} />
            <Route exact path="/orders" component={Auth(OrdersPage, LOGGED_IN_ONLY, false)} />
            <Route exact path="/download" component={Auth(DownloadPage, PUBLIC_PAGE, false)} />
            <Route exact path="/beats" component={Auth(SearchResultsPage, PUBLIC_PAGE, false)} />
            <Route exact path="/dashboard" component={Auth(DashboardPage, LOGGED_IN_ONLY, true)} />
            <Route exact path='/dashboard/beats' component={Auth(DashboardPage, LOGGED_IN_ONLY, true)} />
            <Route exact path='/dashboard/licenses' component={Auth(DashboardPage, LOGGED_IN_ONLY, true)} />
            <Route exact path='/dashboard/settings' component={Auth(DashboardPage, LOGGED_IN_ONLY, true)} />
            <Route component={Auth(ErrorNotFoundPage, PUBLIC_PAGE, false)} />
        </Switch>
    );
}

export default Main

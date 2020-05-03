import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import UploadBeatPage from "./views/UploadBeatPage/UploadBeatPage";
import BeatPage from "./views/BeatPage/BeatPage";
import CartPage from "./views/CartPage/CartPage";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <Suspense fallback={(<div>Loading...</div>)}>
        <NavBar>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, false)} />
            <Route exact path="/upload" component={Auth(UploadBeatPage, true)} />
            <Route exact path="/beat/:beatUrl" component={Auth(BeatPage, null)} />
            <Route exact path="/cart" component={Auth(CartPage, null)} />
          </Switch>
        </NavBar>
        <Footer />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';

// Auth(SpecificComponent, option, adminRoute)
// option:
const PUBLIC_PAGE = 0; // includes anonymous users
const LOGGED_IN_ONLY = 1;
const PUBLIC_ONLY = 2; // includes anonymous users
// adminRoute:
// true for Admin only
// false for all users

export default function (SpecificComponent, option, adminRoute) {
    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch = useDispatch();

        useEffect(() => {
            //To know my current status, send Auth request 
            dispatch(auth()).then(response => {
                if (!response.payload.isAuth) { // if not logged in
                    if (option === PUBLIC_PAGE) { // if page doesn't need auth to view
                        console.log("no auth required")
                    } else if (option === LOGGED_IN_ONLY) { // if page needs auth to view, redirect to login pag
                        window.location.href = '/login';
                        return null;
                    } else if (option === PUBLIC_ONLY) { // if page is only for non logged in users
                        console.log("non logged in users only")
                    }
                } else { //Loggined in Status
                    if (adminRoute && response.payload.role === 0) { // page is admin only, but user is not admin
                        window.location.href = '/';
                        return null;
                    }
                    else {
                        if (option === PUBLIC_ONLY) { // Logged in Status, but Try to go into log in page 
                            window.location.href = '/';
                            return null;
                        }
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent {...props} user={user} />
        )
    }
    return AuthenticationCheck
}



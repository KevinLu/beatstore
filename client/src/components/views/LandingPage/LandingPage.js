import React from 'react'
import { FaCode } from "react-icons/fa";

function LandingPage() {
    return (
        <>
        <div className="app">
            <FaCode style={{ fontSize: '4rem' }} /><br />
            <span style={{ fontSize: '2rem' }}>Landing Page</span>
        </div>
        <div style={{ float:'right' }}>Boiler Plate by John Ahn</div>
        </>
    )
}

export default LandingPage

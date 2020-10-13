import React from 'react'
import "../../Styles/Footer.css"

function Footer() {
    return (
        <footer className="footer">
            <div className="container text-center">
                <img src="../../gamergram.ico" className="d-block mb-4 mx-auto" width="100px " />    
            
            <p className="text-secondary col md 9 mx-auto">A web application to publish your thoughts, connect with friends, share pictures, comment, like and much more!</p>
                <p className="text-secondary col md 9 mx-auto">Developed by Meghal Bisht using the MERN stack.</p>
            <hr className="my-5" />
            <div className="mb-3">
                <a rel="noopener noreferrer" target="_blank" className="ctx__icons"  href="https://www.linkedin.com/in/meghal-bisht-777451177/">
                    <i className="fab fa-linkedin"></i>
                </a>
                <a rel="noopener noreferrer" target="_blank"  className="ctx__icons" href="https://github.com/MeghalBisht">
                    <i className="fab fa-github"></i>
                </a>
                <a rel="noopener noreferrer" target="_blank" className="ctx__icons"  href="https://resume-meghal.herokuapp.com/">
                    <i className="fas fa-code"></i>
                </a>
                </div>
                <p className="text-secondary">Copyright 2020. All rights reserved!</p>
            </div>
        </footer>
    )
}

export default Footer

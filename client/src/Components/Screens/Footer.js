import React from 'react'

function Footer() {
    return (
        <footer className="page-footer footer">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5 className="gamergram">Gamergram</h5>
                        <p>A web application to publish your thoughts, connect with friends, share pictures, comment, like and much more!</p>
                        <p>Developed by Meghal Bisht using the MERN stack.</p>
                    </div>
                    <div className="col l4 offset-l2 s12">
                        <h5>Connect with me</h5>
                        <ul>
                            <li><a rel="noopener noreferrer" target="_blank" href="https://www.linkedin.com/in/meghal-bisht-777451177/">LinkedIn</a></li>
                            <li><a rel="noopener noreferrer" target="_blank" href="https://github.com/MeghalBisht">GitHub</a></li>
                            <li><a rel="noopener noreferrer" target="_blank" href="https://resume-meghal.herokuapp.com/">Website</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                    © 2020 <span>Gamergram</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer

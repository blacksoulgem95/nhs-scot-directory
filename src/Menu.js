import React from "react";

class Menu extends React.Component {
    render() {
        return (<div id="nav" className="pure-u">
            <a href="#" className="nav-menu-button">Menu</a>

            <div className="nav-inner">
                <button className="primary-button pure-button">Compose</button>

                <div className="pure-menu">
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Inbox <span
                            className="email-count">(2)</span></a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Important</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sent</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Drafts</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link">Trash</a></li>
                        <li className="pure-menu-heading">Labels</li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link"><span
                            className="email-label-personal"/>Personal</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link"><span
                            className="email-label-work"/>Work</a></li>
                        <li className="pure-menu-item"><a href="#" className="pure-menu-link"><span
                            className="email-label-travel"/>Travel</a></li>
                    </ul>
                </div>
            </div>
        </div>);
    }
}

export default Menu;
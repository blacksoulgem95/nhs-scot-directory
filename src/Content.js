import React from "react";

class Content extends React.Component {
    render() {
        return (
            <div id="main" className="pure-u-1">
                <div className="email-content">
                    <div className="email-content-header pure-g">
                        <div className="pure-u-1-2">
                            <h1 className="email-content-title">GP Finder</h1>
                            <p className="email-content-subtitle">
                                Last update: XXXX
                            </p>
                        </div>

                        <div className="email-content-controls pure-u-1-2">
                            <form className="pure-form">
                                <formset>
                                    <input type="text" name="postcode" placeholder="postcode"/>
                                    <button className="secondary-button pure-button">Search</button>
                                </formset>
                            </form>
                        </div>
                    </div>

                    <div className="email-content-body">
                        there goes the map turuturu
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
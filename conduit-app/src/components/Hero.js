import React from "react";

class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <div className="hero">
          <div className="container">
            <h1>Conduit</h1>
            <p>A place to share your knowledge</p>
          </div>
        </div>
      </>
    );
  }
}

export default Hero;
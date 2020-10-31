import React, { Component } from 'react';

class Discount extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="box" style={{ minHeight: "450px" }}>
        <div className="box-body">
          Discount
        </div>
      </div>
    );
  }
}

export default Discount;

"use strict";
import React, { PropTypes } from "react";
import { Input } from "react-bootstrap";

const GeneralInfo = React.createClass({
  displayName: "GeneralInfo",

  propTypes: {
    infos: PropTypes.shape({
      cip: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string
    }).isRequired,
  },

  render() {
    return (
      <div className="user-general-info">
        <h4>Informations générales</h4>
        <form className="form-horizontal">
          <fieldset>
            <Input type="static" label="Cip" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.cip} />
            <Input type="static" label="Courriel" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.email} />
            <Input type="static" label="Nom" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.name} />
          </fieldset>
        </form>
      </div>
    );
  }
});

export default GeneralInfo;

import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";

export default class NewAccount extends Component {
  constructor(props) {
    super(props);

    this.customStyles = {
      overlay: {
        backgroundColor: "rgba(1, 1, 1, 0.75)"
      },
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "600px"
      }
    };

    this.state = {
      login: "",
      buttonState: "READY",
      selectedState: {},
      stateList: [
        { value: "AL", label: "AL" },
        { value: "AK", label: "AK" },
        { value: "AZ", label: "AZ" },
        { value: "AR", label: "AR" },
        { value: "CA", label: "CA" },
        { value: "CO", label: "CO" },
        { value: "CT", label: "CT" },
        { value: "DE", label: "DE" },
        { value: "FL", label: "FL" },
        { value: "GA", label: "GA" },
        { value: "HI", label: "HI" },
        { value: "ID", label: "ID" },
        { value: "IL", label: "IL" },
        { value: "IN", label: "IN" },
        { value: "IA", label: "IA" },
        { value: "KS", label: "KS" },
        { value: "KY", label: "KY" },
        { value: "LA", label: "LA" },
        { value: "ME", label: "ME" },
        { value: "MD", label: "MD" },
        { value: "MA", label: "MA" },
        { value: "MI", label: "MI" },
        { value: "MN", label: "MN" },
        { value: "MS", label: "MS" },
        { value: "MO", label: "MO" },
        { value: "MT", label: "MT" },
        { value: "NE", label: "NE" },
        { value: "NV", label: "NV" },
        { value: "NH", label: "NH" },
        { value: "NJ", label: "NJ" },
        { value: "NM", label: "NM" },
        { value: "NY", label: "NY" },
        { value: "NC", label: "NC" },
        { value: "ND", label: "ND" },
        { value: "OH", label: "OH" },
        { value: "OK", label: "OK" },
        { value: "OR", label: "OR" },
        { value: "PA", label: "PA" },
        { value: "RI", label: "RI" },
        { value: "SC", label: "SC" },
        { value: "SD", label: "SD" },
        { value: "TN", label: "TN" },
        { value: "TX", label: "TX" },
        { value: "UT", label: "UT" },
        { value: "VT", label: "VT" },
        { value: "VA", label: "VA" },
        { value: "WA", label: "WA" },
        { value: "WV", label: "WV" },
        { value: "WI", label: "WI" },
        { value: "WY", label: "WY" }
      ],
      error: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStateSelection = this.handleStateSelection.bind(this);
  }

  handleStateSelection(selectedState) {
    this.setState({ selectedState });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    const { login, state } = this.state;
    this.setState({
      buttonState: "LOADING"
    });

    axios
      .post(
        "https://bottega-activity-tracker-api.herokuapp.com/accounts",
        {
          account: {
            login: login,
            state: this.state.selectedState.value
          }
        },
        { withCredentials: true }
      )
      .then(response => {
        this.setState({
          login: "",
          state: "",
          error: "",
          buttonState: "READY",
          selectedState: {}
        });

        this.props.handleSuccessfulNewAccountCreation(response.data.account);
      })
      .catch(error => {
        console.log("in handle submit error for new account", error);
        this.setState({
          error:
            "There was an error adding that account. Are you sure you haven't already added that username and that the state is using a two letter abbreviation?"
        });
      });

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-wrapper">
        {this.state.error ? (
          <div className="form-error">
            <FontAwesomeIcon icon="exclamation-circle" />
            {this.state.error}
          </div>
        ) : null}
        <div className="form-group">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon="at" />
          </div>
          <input
            className="new-account-username-field"
            type="text"
            name="login"
            placeholder="Github username"
            value={this.state.login}
            onChange={this.handleChange}
            required
          />
        </div>

        <div className="address-form-wrapper">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon="location-arrow" />
          </div>

          <div className="select-element">
            <Select
              value={this.state.selectedState}
              onChange={this.handleStateSelection}
              options={this.state.stateList}
              styles={this.customStyles}
            />
          </div>
        </div>

        <div className="login-btn-wrapper">
          {this.state.buttonState === "LOADING" ? (
            <button
              disabled
              className="primary-rounded-button button-small"
              type="submit"
            >
              Getting Account Details <FontAwesomeIcon icon="spinner" spin />
            </button>
          ) : null}

          {this.state.buttonState === "READY" ? (
            <button
              className="primary-rounded-button button-small"
              type="submit"
            >
              Start tracking
            </button>
          ) : null}
        </div>
      </form>
    );
  }
}

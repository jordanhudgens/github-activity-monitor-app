import React, { Component } from "react";
import axios from "axios";
import ReactVivus from "react-vivus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";

import githubLogo from "../../components/svgs/github-logo.svg";
import UserDataCard from "../../components/cards/UserDataCard";
import ChoroplethMap from "../../components/maps/ChoroplethMap";
import NewAccount from "./NewAccount";
import NavLogo from "../../components/svgs/NavLogo";
import AccountHeatMap from "../../components/charts/AccountHeatMap";
import HireRateGlyph from "../../components/charts/HireRateGlyph";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contentToShow: "CHART",
      windowWidth: 0,
      hireRateData: []
    };

    this.handlePillClick = this.handlePillClick.bind(this);
    this.handleSuccessfulNewAccountCreation = this.handleSuccessfulNewAccountCreation.bind(
      this
    );
    this.handleLogoutLinkClick = this.handleLogoutLinkClick.bind(this);

    this.handleAccountFollowedDeletion = this.handleAccountFollowedDeletion.bind(
      this
    );
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  handleAccountFollowedDeletion(account) {
    this.props.removeAccountFollowed(account);
  }

  handleLogoutLinkClick() {
    this.signOut();
  }

  signOut(event) {
    axios
      .delete(`https://bottega-activity-tracker-api.herokuapp.com/logout`, {
        withCredentials: true
      })
      .then(response => {
        this.props.handleLogout();
        return response;
      })
      .catch(error => {
        console.log(error);
      });

    event.preventDefault();
  }

  handleSuccessfulNewAccountCreation(account) {
    this.props.handleAccountAddition(account);
  }

  handlePillClick(contentToShow) {
    this.setState({ contentToShow });
  }

  getAccounts() {
    axios
      .get("https://bottega-activity-tracker-api.herokuapp.com/accounts", {
        withCredentials: true
      })
      .then(response => {
        this.props.populateAccounts(response.data.accounts);
      })
      .catch(error => console.log("getAccounts error", error));
  }

  getHireRateData() {
    axios
      .get("https://bottega-activity-tracker-api.herokuapp.com/hire_rates", {
        withCredentials: true
      })
      .then(response => {
        this.setState({ hireRateData: response.data.hire_rate_data });
      })
      .catch(error => console.log("getAccounts error", error));
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  componentWillMount() {
    this.getAccounts();
    this.updateWindowDimensions();
    this.getHireRateData();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  render() {
    let accountList = [];

    if (this.props.accountsFollowed && this.props.accountsFollowed.length > 0) {
      accountList = this.props.accountsFollowed.map(account => {
        return (
          <UserDataCard
            key={account.id}
            account={account}
            handleAccountFollowedDeletion={this.handleAccountFollowedDeletion}
          />
        );
      });
    }

    const contentRenderer = () => {
      if (this.state.contentToShow === "CHART") {
        return (
          <div className="dashboard-heat-map-container">
            <div className="account-heat-map-wrapper">
              <AccountHeatMap
                data={
                  this.state.windowWidth >= 1250
                    ? this.props.groupedEvents
                    : this.props.groupedEvents.slice(
                        this.props.groupedEvents.length - 14,
                        this.props.groupedEvents.length
                      )
                }
                width={
                  this.state.windowWidth <= 0 ? 0 : this.state.windowWidth - 100
                }
                height={
                  this.props.accountsFollowed.length < 10
                    ? this.props.accountsFollowed.length * 45
                    : this.props.accountsFollowed.length * 29.5
                }
              />
            </div>
          </div>
        );
      } else if (this.state.contentToShow === "MAP") {
        return <ChoroplethMap />;
      } else if (this.state.contentToShow === "FEED") {
        return <div className="user-data-cards">{accountList}</div>;
      } else if (this.state.contentToShow === "NEW") {
        return (
          <NewAccount
            handleSuccessfulNewAccountCreation={
              this.handleSuccessfulNewAccountCreation
            }
          />
        );
      } else if (this.state.contentToShow === "HIRE_RATE") {
        return (
          <HireRateGlyph
            height={500}
            width={this.state.windowWidth - 42}
            margin={{
              right: 100,
              left: 100,
              top: 100,
              bottom: 100
            }}
            data={this.state.hireRateData}
          />
        );
      } else {
        return <div>Else...</div>;
      }
    };

    return (
      <div>
        <div className="corporate-layout-wrapper">
          <div className="corporate-navigation-wrapper">
            <div className="left-column">
              <a onClick={() => this.handlePillClick("CHART")}>
                <div className="brand">
                  <NavLogo />
                </div>
              </a>

              <div className="pills">
                <a onClick={() => this.handlePillClick("CHART")}>Chart</a>
                <a onClick={() => this.handlePillClick("FEED")}>Feed</a>
                <a onClick={() => this.handlePillClick("MAP")}>Map</a>
                <a onClick={() => this.handlePillClick("HIRE_RATE")}>
                  Hire Rate
                </a>
                <a onClick={() => this.handlePillClick("NEW")}>New Account</a>
              </div>
            </div>

            <div className="right-column">
              <a onClick={this.handleLogoutLinkClick}>
                <FontAwesomeIcon icon="sign-out-alt" />
              </a>
            </div>
          </div>
        </div>

        <div className="dashboard-wrapper">
          {this.state.contentToShow !== "NEW" &&
          accountList.length === 0 &&
          !this.state.isLoading ? (
            <div className="empty-dashboard-wrapper">
              <div className="content">
                <ReactVivus
                  id="homepage-svg"
                  option={{
                    file: githubLogo,
                    type: "oneByOne",
                    animTimingFunction: "EASE",
                    duration: 250,
                    onReady: console.log
                  }}
                  style={{ width: "100%" }}
                />

                <div className="text">
                  You're not following any GitHub users, add your first account
                </div>
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="content">{contentRenderer()}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

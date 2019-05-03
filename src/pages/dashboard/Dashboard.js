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

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contentToShow: "CHART"
    };

    this.handlePillClick = this.handlePillClick.bind(this);
    this.handleSuccessfulNewAccountCreation = this.handleSuccessfulNewAccountCreation.bind(
      this
    );
    this.handleLogoutLinkClick = this.handleLogoutLinkClick.bind(this);

    this.handleAccountFollowedDeletion = this.handleAccountFollowedDeletion.bind(
      this
    );
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

  componentWillMount() {
    this.getAccounts();
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
            <div className="account-names">
              <div className="username">jordanhudgens</div>
              <div className="username">elorest</div>
              <div className="username">mjackson</div>
              <div className="username">jordanhudgens</div>
              <div className="username">jordanhudgens</div>
              <div className="username">jordanhudgens</div>
              <div className="username">jordanhudgens</div>
              <div className="username">elorest</div>
              <div className="username">mjackson</div>
              <div className="username">elorest</div>
              <div className="username">mjackson</div>
              <div className="username">elorest</div>
              <div className="username">mjackson</div>
              <div className="username">elorest</div>
              <div className="username">mjackson</div>
            </div>
            <div className="account-heat-map-wrapper">
              <AccountHeatMap
                data={this.props.groupedEvents}
                width={1200}
                height={this.props.accountsFollowed.length * 27}
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
                <a onClick={() => this.handlePillClick("NEW")}>
                  Add New Account
                </a>
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
          {this.state.contentToShow !== "NEW" && accountList.length === 0 ? (
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

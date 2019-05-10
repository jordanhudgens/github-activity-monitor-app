import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import Axios from "axios";

export default class UserDataCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleHireDateUpdate = this.handleHireDateUpdate.bind(this);
  }

  handleDelete() {
    Axios.delete(
      `https://bottega-activity-tracker-api.herokuapp.com/accounts/${
        this.props.account.id
      }`,
      { withCredentials: true }
    )
      .then(response => {
        this.props.handleAccountFollowedDeletion(this.props.account);
        return response;
      })
      .catch(error => {
        console.log("removed...", error);
      });
  }

  handleHireDateUpdate() {
    Axios.patch(
      `https://bottega-activity-tracker-api.herokuapp.com/accounts/${
        this.props.account.id
      }`,
      { account: { days_to_hire: 2 } },
      { withCredentials: true }
    )
      .then(response => {
        console.log("hire date update res", response);
      })
      .catch(error => {
        console.log("handleHireDateUpdate error", error);
      });
  }

  render() {
    const { id, login, avatar_url, events } = this.props.account;
    let latestEvent;

    if (events.length > 0) {
      latestEvent = events.sort(function compare(a, b) {
        var dateB = new Date(b.date);
        var dateA = new Date(a.date);
        return dateB - dateA;
      });
    }

    return (
      <div className="user-data-card">
        <div className="follower-avatar">
          <Link to={`/account/${login}`}>
            <img src={avatar_url} alt={login} />
          </Link>
          <div className="follower-username">
            <Link to={`/account/${login}`}>{login}</Link>
          </div>
        </div>

        {latestEvent ? (
          <div className="user-data-details">
            <div className="data-wrapper">
              <span className="label">
                <FontAwesomeIcon icon="calendar-check" />
              </span>{" "}
              <span className="title">
                Last activity {moment(latestEvent[0].date).fromNow()}
              </span>
            </div>
            <div className="data-wrapper">
              <span className="label">
                <FontAwesomeIcon icon="code-branch" />
              </span>{" "}
              <span className="title">{latestEvent[0]["message"]}</span>
            </div>
            <div className="data-wrapper">
              <span className="label">
                <FontAwesomeIcon icon="tasks" />
              </span>{" "}
              <span className="title">
                <a
                  href={"https://github.com/" + latestEvent[0]["repo_name"]}
                  target="_blank"
                >
                  {latestEvent[0]["repo_name"]}
                </a>
              </span>
            </div>

            <div className="action-links">
              <a onClick={this.handleDelete}>
                <FontAwesomeIcon icon="user-times" />
                Remove
              </a>

              <a href={`https://github.com/${login}`} target="_blank">
                <FontAwesomeIcon icon="external-link-alt" />
                GitHub Profile
              </a>

              <a onClick={this.handleHireDateUpdate}>Days until hired</a>
            </div>
          </div>
        ) : (
          <div className="user-data-details">
            <div className="data-wrapper">
              {login} currently does not have any activity
            </div>

            <div className="action-links">
              <a onClick={this.handleDelete}>
                <FontAwesomeIcon icon="user-times" />
                Remove
              </a>

              <a href={`https://github.com/${login}`} target="_blank">
                <FontAwesomeIcon icon="external-link-alt" />
                GitHub Profile
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

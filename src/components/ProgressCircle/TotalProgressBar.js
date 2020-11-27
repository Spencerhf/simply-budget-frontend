import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { Spring, config } from "react-spring/renderprops";
import { connect } from "react-redux";
import { Fade } from "react-awesome-reveal";
import { DateTime } from "luxon";

const TotalBudgetProgressBar = (props) => {
  const budgetSpent = props.totalBudget - props.budget_remaining;
  const budgetPercentage = (budgetSpent / props.totalBudget) * 100;
  const fontSizer = { fontSize: "calc(16px + 1vw)", color: "black" };

  return (
    <div>
      <div className="ml-4 mr-4 mt-1 mb-1">
        <h1
          className="text-center m-4"
          style={{ fontSize: "clamp(50px, 8vw, 100px" }}
        >
          <Fade direction="up" triggerOnce>
            <b>{DateTime.local().monthLong}</b>
          </Fade>
        </h1>
        <hr />
        <h2 className="text-center">
          Total monthly budget: ${props.totalBudget ? props.totalBudget : 0}
        </h2>
        <p>Monthly Income</p>
        <p>Monthly Spending</p>
        <Spring
          to={{ value: budgetPercentage.toFixed(0) }}
          from={{ value: 0 }}
          config={{ tension: 800, friction: 100, mass: 19, clamp: true }}
        >
          {(progress) =>
            budgetPercentage > 100 ? (
              <div>
                <ProgressBar
                  animated
                  style={{
                    height: "70px",
                    border: "2px solid black",
                    minWidth: "300px",
                  }}
                  variant="danger"
                  now={progress.value}
                  label={
                    <Row
                      className="d-flex justify-content-between position-absolute w-75 ml-3"
                      style={{ maxWidth: "1150px" }}
                    >
                      <Fade direction="up" delay="100" triggerOnce>
                        <h4 style={fontSizer}>
                          <b>{Math.round(progress.value)}%</b>
                        </h4>
                      </Fade>
                      <Fade direction="up" delay="150" triggerOnce>
                        <h4 style={fontSizer}>
                          <b> ${props.budget_remaining} remaining</b>
                        </h4>
                      </Fade>
                    </Row>
                  }
                />
              </div>
            ) : (
              <ProgressBar
                animated
                style={{
                  height: "70px",
                  border: "2px solid black",
                  minWidth: "300px",
                }}
                variant="success"
                now={progress.value}
                label={
                  <Row
                    className="d-flex justify-content-between position-absolute w-75 ml-3"
                    style={{ maxWidth: "1150px" }}
                  >
                    <Fade direction="up" delay="100" triggerOnce>
                      <h4 style={fontSizer}>
                        <b>
                          {Math.round(progress.value)
                            ? Math.round(progress.value)
                            : 0}
                          %
                        </b>
                      </h4>
                    </Fade>
                    <Fade direction="up" delay="150" triggerOnce>
                      <h4 style={fontSizer}>
                        <b>
                          {props.budget_remaining
                            ? "$" + props.budget_remaining + " remaining"
                            : ""}
                        </b>
                      </h4>
                    </Fade>
                  </Row>
                }
              />
            )
          }
        </Spring>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    category: state.category,
    categoryId: parseInt(ownProps.categoryId),
    budget_remaining: ownProps.budget_remaining,
    totalBudget: parseInt(ownProps.totalBudget),
    category_name: ownProps.category_name,
  };
};

export default connect(mapStateToProps)(TotalBudgetProgressBar);

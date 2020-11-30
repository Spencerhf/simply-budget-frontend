import React, { Component } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { fetchPurchasesWithCategory } from "../actions";
import { DateTime } from "luxon";
import { Fade } from "react-awesome-reveal";
import { Circle } from "react-spinners-css";
import Button from "@material-ui/core/Button";
// The icons
import EditIcon from "../images/edit-icon.png";
import NotesIcon from "../images/notes-icon.png";
import TrashIcon from "../images/trash-icon.svg";
// the edit form
import EditForm from "./EditForm";
import DeleteForm from "./DeleteForm";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import EditFormPurchases from "./EditFormPurchases";
import { Row, Col } from "react-bootstrap";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IndividualBudgetProgressBarTransactions from "./ProgressCircle/IndividualBudgetProgressBarTransactions";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

function createData(
  id,
  date,
  transactionName,
  transactionAmount,
  budgetCategory,
  notes,
  budgetRemaining,
  purchaseMonth,
  categoryBudget
) {
  return {
    id,
    date,
    transactionName,
    transactionAmount,
    budgetCategory,
    notes,
    budgetRemaining,
    purchaseMonth,
    categoryBudget,
  };
}

class TransactionList extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false, open1: false, purchaseId: "" };
  }

  componentDidMount() {
    const userId = localStorage.getItem("userId");
    this.props.fetchPurchasesWithCategory(userId);
  }

  render() {
    const rows = this.props.purchases.map((purchase) => {
      let purchaseMonth = new Date(purchase.createdAt).getMonth();
      let purchaseDate = new Date(purchase.createdAt).toLocaleDateString(
        "en-US"
      );
      return createData(
        purchase.id,
        purchaseDate,
        purchase.purchase_name,
        purchase.price,
        purchase.budget_category.category_name,
        purchase.purchase_notes,
        purchase.budget_category.budget_remaining,
        purchaseMonth,
        purchase.budget_category.category_budget
      );
    });
    const thisMonthTransactions = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].purchaseMonth === DateTime.local().month - 1) {
        thisMonthTransactions.push(rows[i]);
      }
    }
    const edit = (e) => {
      e.preventDefault();

      this.setState({ open: true, purchaseId: e.target.id });
    };
    const deleteCat = (e) => {
      e.preventDefault();

      this.setState({ open1: true, purchaseId: e.target.id });
    };
    const handleClose = () => {
      this.setState({ open: false, open1: false });
    };

    const headerStyle = {
      backgroundColor: "rgb(48,48,48)",
      height: "10px",
      color: "white",
    };
    console.log(this.props.purchases);
    return (
      <TableContainer>
        {this.props.purchases[0] ? (
          <div>
            <h2 className="text-center my-4">My Purchases</h2>
            <Paper
              style={{
                border: "2px solid #000",
                margin: "auto",
                maxWidth: "700px",
              }}
            >
              <Table aria-label="customized table">
                <TableHead style={headerStyle}>
                  <TableRow style={{ backgroundColor: "#264653" }}>
                    {/* <TableCell style={headerStyle}>Date</TableCell>
                    <TableCell style={headerStyle}>Transaction</TableCell>
                    <TableCell style={headerStyle}>Notes</TableCell>
                    <TableCell style={headerStyle}>Amount</TableCell>
                    <TableCell style={headerStyle}>Category</TableCell>

                    <TableCell style={headerStyle}>Remaining</TableCell>
                    <TableCell style={headerStyle} align="center">
                      Edit/Delete
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {thisMonthTransactions.map((row) => (
                    <div key="row.id" style={{ border: "1px solid black" }}>
                      <Accordion style={{ display: "block" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <div className="d-inline w-100">
                            <Row>
                              <Col>
                                Budget - <b>{row.budgetCategory}</b>
                              </Col>
                              <Col className="text-right">
                                <h5>{row.transactionName}</h5>
                              </Col>
                            </Row>

                            <Row>
                              <Col>
                                <p className="text-secondary">{row.date}</p>
                              </Col>
                              <Col className="text-right">
                                <b>${row.transactionAmount.toFixed(2)}</b>
                              </Col>
                            </Row>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails className="d-flex justify-content-center p-0 m-0">
                          <div className="d-flex justify-content-center p-0 m-0">
                            <Row>
                              <Col className="d-flex justify-content-center">
                                <Button onClick={edit} className="p-2">
                                  Edit &nbsp;
                                  <img
                                    src={EditIcon}
                                    id={row.id}
                                    style={{
                                      width: "35px",
                                      height: "35px",
                                      padding: "4px",
                                    }}
                                  />
                                </Button>
                              </Col>
                              <Col className="d-flex justify-content-center">
                                <Button onClick={deleteCat} className="p-2">
                                  Delete &nbsp;
                                  <img
                                    id={row.id}
                                    style={{
                                      width: "40px",
                                      height: "35px",
                                    }}
                                    src={TrashIcon}
                                  />
                                </Button>
                              </Col>

                              <Col className="col-12 col-md-6">
                                <IndividualBudgetProgressBarTransactions
                                  className="p-0 m-0"
                                  categoryId={row.id}
                                  budget_remaining={row.budgetRemaining}
                                  category_name={row.budgetCategory}
                                  category_budget={row.categoryBudget}
                                />
                              </Col>

                              <Col className="col-12 m-4">
                                <b>Notes: &nbsp;</b>

                                {row.notes}
                              </Col>
                            </Row>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                    // </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Modal
              className="d-flex justify-content-center align-items-center"
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              // className={classes.modal}
              open={this.state.open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <div>
                <EditFormPurchases
                  purchaseId={this.state.purchaseId}
                  categoryList={this.props.purchases}
                />
              </div>
            </Modal>
            <Modal
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              // className={classes.modal}
              open={this.state.open1}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <div>
                <DeleteForm />
              </div>
            </Modal>
          </div>
        ) : (
          <div>
            <h2 className="text-center my-4">My Purchases</h2>
            <Paper
              style={{
                border: "2px solid #000",
                margin: "auto",
                maxWidth: "900px",
              }}
            >
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#264653" }}>
                    <TableCell style={headerStyle}>Date</TableCell>
                    <TableCell style={headerStyle}>Transaction</TableCell>
                    <TableCell style={headerStyle}>Notes</TableCell>
                    <TableCell style={headerStyle}>Amount</TableCell>
                    <TableCell style={headerStyle}>Category</TableCell>

                    <TableCell style={headerStyle}>Remaining</TableCell>
                    <TableCell style={headerStyle} align="center">
                      Edit/Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <h1 className="text-center p-4">Nothing here!</h1>
            </Paper>
          </div>
        )}
      </TableContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    purchases: state.purchasesWithCategory,
  };
};

export default connect(mapStateToProps, { fetchPurchasesWithCategory })(
  TransactionList
);

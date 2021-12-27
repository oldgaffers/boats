import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import SendIcon from "@material-ui/icons/Send";
import MailIcon from "@material-ui/icons/Mail";
import gql from "graphql-tag";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useAuth0 } from "@auth0/auth0-react";

const ADD_ENQUIRY = gql`
  mutation AddEnquiry(
    $id: uuid!
    $boat_name: String!
    $oga_no: Int!
    $email: String!
    $text: String!
    $type: enquiry_type_enum!
  ) {
    insert_enquiry(
      objects: {
        boat: $id
        boat_name: $boat_name
        oga_no: $oga_no
        email: $email
        text: $text
        type: $type
      }
    ) {
      returning {
        id
      }
    }
  }
`;

/*
const DELETE_ENQUIRY = gql`
  mutation DeleteEnquiry($id: uuid!) {
    delete_enquiry(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
*/

function EnquiryDialog({
  open,
  boat,
  email,
  onEmailChange,
  onSend,
  onCancel,
  onTextChange,
}) {
  return (
    <Dialog
      top
      open={open}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Contact Us</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          Own <i>{boat.name}</i> ({boat.oga_no}) or have some information or a
          question about her?<p></p>
          We'd love to hear from you.<p></p>Please enter your email address here
          and tell us how we can help.
        </DialogContentText>
        <TextField
          value={email}
          error={email === ""}
          onChange={onEmailChange}
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
        />
        <TextField
          onChange={onTextChange}
          margin="dense"
          label="About your enquiry"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          endIcon={<SendIcon />}
          onClick={onSend}
          color="primary"
          disabled={email === ""}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const text = (user, members) => {
  if (user) {
    if (members.find((member) => member.GDPR)) {
      return `We'll contact them for you from the boat register
    and copy you so you can chat.`;
    } else {
      return `We'll contact them for you from the boat register
    and give them your email so they can respond.`;
    }
  } else {
    return `We'll contact them for you from the boat register
  and give them your email so they can respond.`;
  }
};

function ContactDialog({
  open,
  boat,
  email,
  user,
  onEmailChange,
  onSend,
  onCancel,
  onTextChange,
}) {  
  const members = [];
  const s = boat.ownerships.current.length > 1 ? "s" : "";
  return (
    <Dialog
      top
      open={open}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Contact The Owner{s}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          This boat is owned by {s === "" ? "a member" : "members"} of the OGA.
          {text(user, members)}
        </DialogContentText>
        <TextField
          value={email}
          error={email === ""}
          onChange={onEmailChange}
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
        />
        <TextField
          onChange={onTextChange}
          margin="dense"
          label="About your enquiry"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          endIcon={<SendIcon />}
          onClick={onSend}
          color="primary"
          disabled={email === ""}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Enquiry({ boat, classes }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const { user } = useAuth0();
  const [email, setEmail] = useState(user && user.email);
  const [text, setText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [addEnquiry, result] = useMutation(ADD_ENQUIRY);
  const [getOwners, { loading, error, data }] = useLazyQuery(gql(`query members {
    members(members: $members) { GDPR email }
  }`));
  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;
  if (data) {
    console.log(data);
  }
 
  const handleClickOpen = () => {
    setOpen(true);
    if (user) {
      const memberNumbers = [...new Set(boat.ownerships.current.map((owner) => owner.member))];
      getOwners({ variables: { members: memberNumbers } })
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEmailChange = (e) => {
    if (e.target.reportValidity()) {
      console.log("email", e.target);
      setEmail(e.target.value);
    } else {
      console.log("invalid email");
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  const handleSend = () => {
    const { id, name, oga_no } = boat;
    addEnquiry({
      variables: { type: "general", id, boat_name: name, oga_no, email, text },
    });
    setOpen(false);
    setSnackBarOpen(true);
  };

  const { current } = boat.ownerships;

  let enquireText = "Ask about this boat";
  let ChosenDialog = EnquiryDialog;

  if (current) {
    enquireText = "Contact the Owner";
    if (boat.ownerships.current.length > 1) {
      enquireText = enquireText + "s";
    }
    ChosenDialog = ContactDialog;
  }
  console.log("enquireText", enquireText);
  return (
    <>
      <Button
        className={classes.button}
        size="small"
        endIcon={<MailIcon />}
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        {enquireText}
      </Button>
      <ChosenDialog
        open={open}
        boat={boat}
        email={email}
        user={user}
        onCancel={handleCancel}
        onSend={handleSend}
        onEmailChange={handleEmailChange}
        onTextChange={handleTextChange}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </>
  );
}

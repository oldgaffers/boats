import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import gql from "graphql-tag";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useAuth0 } from "@auth0/auth0-react";

const ADD_ENQUIRY = gql`
  mutation AddEnquiry(
    $id: uuid!
    $boat_name: String!
    $oga_no: Int!
    $email: String!
    $name: String!
    $text: String!
    $type: enquiry_type_enum!
  ) {
    insert_enquiry(
      objects: {
        boat: $id
        boat_name: $boat_name
        oga_no: $oga_no
        email: $email
        name: $name
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

  const onClickSend = () => {
    onSend(boat.id, boat.name, boat.oga_no, 'general');
  }

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
          onClick={onClickSend}
          color="primary"
          disabled={email === ""}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const atext = (userRoles, members) => {
  const plural = members && members.length > 1;
  if (userRoles.includes('member')) {
    return plural?'fellow members':'a fellow member';
  } else {
    return plural?'members':'a member';
  }
};

const btext = (userRoles, members) => {
  if (userRoles.includes('member')) {
    if (members && members.find((member) => member.GDPR)) {
      return 'copy you so you can chat.';
    } else {
      return 'give them your email so they can respond.';
    }
  } else {
    return 'give them your email so they can respond.';
  }
};

function ContactDialog({
  open,
  boat,
  email,
  userRoles,
  members,
  onEmailChange,
  onSend,
  onCancel,
  onTextChange,
}) {

  const onClickSend = () => {
    onSend(boat.id, boat.name, boat.oga_no, 'contact');
  }

  return (
    <Dialog
      top
      open={open}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Contact The Owner{(members?.length > 1) ? "s" : ""}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          <i>{boat.name}</i> ({boat.oga_no})
          is owned by {atext(userRoles, members)} of the OGA.
          We'll contact them for you from the boat register and
          {btext(userRoles, members)}
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
          onClick={onClickSend}
          color="primary"
          disabled={email === ""}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Enquiry({ boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const { user } = useAuth0();
  const [email, setEmail] = useState(user && user.email);
  const [text, setText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [addEnquiry, result] = useMutation(ADD_ENQUIRY);
  const [getOwners, { loading, error, data }] = useLazyQuery(gql(`query members($members: [Int]) {
    members(members: $members) { GDPR }
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

  const handleSend = (id, boat_name, oga_no, type) => {
    const name = (user && user.name) || '';
    addEnquiry({
      variables: { type, id, boat_name, oga_no, email, name, text },
    });
    setOpen(false);
    setSnackBarOpen(true);
  };

  const { current } = (boat.ownerships || {});

  let enquireText = "Ask about this boat";
  let ChosenDialog = EnquiryDialog;

  if (current) {
    enquireText = "Contact the Owner";
    if (current.length > 1) {
      enquireText = enquireText + "s";
    }
    ChosenDialog = ContactDialog;
  }
  console.log('enquiry user', user);
  console.log('enquiry email', email);
  return (
    <>
      <Button
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
        userRoles={(user && user['https://oga.org.uk/roles']) || []}
        members={data && data.members}
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

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
import { gql, useMutation, useLazyQuery } from "@apollo/client";
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

function ContactDialog({
  open,
  boat,
  user,
  onSend,
  onCancel,
  title,
  subtitle,
  topic
}) {
  const [email, setEmail] = useState(user?.email || '');
  const [text, setText] = useState("");
  const [valid, setValid] = useState(!!email);

  const onClickSend = () => {
    const { id, oga_no, name } = boat;
    onSend({ type: topic, id, boat_name: name, oga_no, text, email });
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValid(e.target.reportValidity());
  };

  return (
    <Dialog
      top
      open={open}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          {subtitle}
        </DialogContentText>
        <TextField
          value={email}
          error={email === ""}
          onChange={handleEmailChange}
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
        />
        <TextField
          onChange={(e) => setText(e.target.value)}
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
          disabled={!valid}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Enquiry({ classes, boat }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const { user } = useAuth0();
  const userRoles = (user && user['https://oga.org.uk/roles']) || [];
  // eslint-disable-next-line no-unused-vars
  const [addEnquiry, result] = useMutation(ADD_ENQUIRY);
  const [getOwners, { loading, error, data }] = useLazyQuery(gql(`query members($members: [Int]) {
    members(members: $members) { GDPR }
  }`));
  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;

  const handleClickOpen = () => {
    setOpen(true);
    if (userRoles.includes('member')) {
      const memberNumbers = [...new Set(boat.ownerships?.filter((m) => m.current).map((owner) => owner.member))];
      getOwners({ variables: { members: memberNumbers } })
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  const handleSend = ({ id, boat_name, oga_no, type, email, text }) => {
    const name = (user && user.name) || '';
    addEnquiry({
      variables: { type, id, boat_name, oga_no, email, name, text },
    });
    setOpen(false);
    setSnackBarOpen(true);
  };

  const { current } = (boat.ownerships || {});

  let enquireText = "Ask about this boat";
  let title;
  let subtitle;
  if (current) {
    enquireText = "Contact the Owner";
    if (current.length > 1) {
      enquireText = enquireText + "s";
    }
    title = enquireText;

    const atext = (userRoles, data) => {
      const plural = data?.members && data.members.length > 1;
      if (userRoles.includes('member')) {
        return plural ? 'fellow members' : 'a fellow member';
      } else {
        return plural ? 'members' : 'a member';
      }
    };

    const btext = (userRoles, data) => {
      if (userRoles.includes('member')) {
        if (data?.members && data.members.find((member) => member.GDPR)) {
          return 'copy you so you can chat.';
        } else {
          return 'give them your email so they can respond.';
        }
      } else {
        return 'give them your email so they can respond.';
      }
    };

    subtitle = (<><i>{boat.name}</i> ({boat.oga_no})
    is owned by {atext(userRoles, data)} of the OGA. We'll contact them for you from the boat register and {btext(userRoles, data)}</>);
  } else {
    title = 'Contact Us';
    subtitle = (<>Own <i>{boat.name}</i> ({boat.oga_no}) or have some information or a
    question about her? We'd love to hear from you. Please enter your email address here
    and tell us how we can help.</>);
  }

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
      <ContactDialog
        open={open}
        boat={boat}
        userRoles={userRoles}
        user={user}
        members={data && data.members}
        onCancel={handleCancel}
        onSend={handleSend}
        title={title}
        subtitle={subtitle}
        topic={current ? 'contact' : 'general'}
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
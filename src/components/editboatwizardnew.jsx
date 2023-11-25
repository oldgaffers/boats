import React, { useEffect, useState } from "react";
import {
  createMemoryRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from "date-fns/locale/en-GB";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import { StateMachineProvider, createStore, useStateMachine } from "little-state-machine";
import { getPicklists } from '../util/api';
import { useForm } from "react-hook-form";

function updateAction(state, payload) {
  return {
    ...state,
    data: {
      ...state.data,
      ...payload
    }
  };
}

const Step1 = (props) => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { actions, state } = useStateMachine({ updateAction });
  const onSubmit = (data) => {
    console.log('step 1 on submit', data);
    actions.updateAction(data);
    navigate("step2");
  };
  console.log('<Step1/>', props);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Step 1</h2>
      <label>
        First Name:
        <input {...register("firstName")} defaultValue={state.data.firstName} />
      </label>
      <label>
        Last Name:
        <input {...register("lastName")} defaultValue={state.data.lastName} />
      </label>
      <input type="submit" value="next"/>
    </form>
  );
};

const Step2 = (props) => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { state, actions } = useStateMachine({ updateAction });
  const onSubmit = (data) => {
    actions.updateAction(data);
    navigate("result");
  };
  console.log('<Step2/>');
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Step 2</h2>
      <label>
        Age:
        <input {...register("age")} defaultValue={state.data.age} />
      </label>
      <label>
        Years of experience:
        <input
          {...register("yearsOfExp")}
          defaultValue={state.data.yearsOfExp}
        />
      </label>
      <input type="submit" />
    </form>
  );
};

const Result = props => {
  const { state } = useStateMachine(updateAction);

  return (
    <>
      <h2>Result:</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

const router = createMemoryRouter([
  {
    path: "/",
    element: <Step1 />,
    loader: async ({ params }) => {
      return ''; // fetch(`/api/teams/${params.teamId}.json`);
    },
    children: [
      {
        path: "/step2",
        element: <Step2 />,
        loader: async ({ params }) => {
          console.log('step 2 loader', params);
          return ''; // fetch(`/api/teams/${params.teamId}.json`);
        },
      },
      {
        path: "result",
        element: <Result />,
        loader: async ({ params }) => {
          return ''; // fetch(`/api/teams/${params.teamId}.json`);
        },
      },
    ],
  },
]);

export default function EditBoatWizard({ boat, user, open, onCancel, onSubmit, schema }) {

  const [pickers, setPickers] = useState();
  createStore({ data: {} });

  useEffect(() => {
    if (!pickers) {
      getPicklists().then((r) => {
        setPickers(r)
      }).catch((e) => console.log(e));
    }
  }, [pickers]);

  if (!pickers) return <CircularProgress />;

  if (!open) return '';

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
        <Typography variant="h5" >Update {boat.name} ({boat.oga_no})</Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <StateMachineProvider>
          <RouterProvider router={router} />
        </StateMachineProvider>
      </LocalizationProvider>

    </Dialog>
  );
}

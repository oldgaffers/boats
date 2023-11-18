import React, { useEffect, useState } from 'react';
import { CircularProgress, Button, Dialog, Paper, Snackbar, Alert } from '@mui/material';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import Select from '@data-driven-forms/mui-component-mapper/select';
import TextField from '@data-driven-forms/mui-component-mapper/text-field';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { Stack } from '@mui/system';
import { m2df } from '../util/format';
import { disposeOgaNo, getFilterable, nextOgaNo } from '../util/api';
import { createBoat } from './createboatbutton';

const FormTemplate = ({ formFields, schema }) => {
    const { handleSubmit, onCancel, getState } = useFormApi();
    const { submitting, valid } = getState();

    return (
        <Paper sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
                {schema.title}
                <Stack spacing={1}>
                    {formFields}
                    <FormSpy>
                        {() => (
                            <Stack direction='row' spacing={1} justifyContent='space-evenly'>
                                <Button variant="contained" onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button disabled={submitting || !valid} type="submit" color="primary" variant="contained">
                                    Submit
                                </Button>
                            </Stack>
                        )}
                    </FormSpy>
                </Stack>
            </form>
        </Paper>
    );
};

export default function PickOrAddBoat() {
    const [data, setData] = useState();
    const [firstFreeOgaNo, setFirstFreeOgaNo] = useState();
    const [open, setOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [submitNote, setSubmitNote] = useState();

    useEffect(() => {
        if (!data) {
            getFilterable().then((r) => setData(r)).catch((e) => console.log(e));
        }
    }, [data]);

    useEffect(() => {
        if (!firstFreeOgaNo) {
            nextOgaNo().then((r) => setFirstFreeOgaNo(r)).catch((e) => console.log(e));
        }
    }, [firstFreeOgaNo]);

    if (!data) return <CircularProgress />;
    if (!firstFreeOgaNo) return <CircularProgress />;

    const options = data.map((boat) => ({
        label: `${boat.name} (${boat.oga_no}), ${boat.construction_material || ''} ${boat.rig_type || ''} ${boat.year || ''}`,
        value: boat.oga_no,
    }));

    options.sort((a, b) => {
        const an = a.label.toUpperCase();
        const bn = b.label.toUpperCase();
        if (an > bn) return 1;
        if (an < bn) return -1;
        return 0;
    });

    const handleSubmit = (data) => {
        const { email, name, oga_no, generic_type, berthing_length } = data;
        setOpen(false);
        createBoat({ name, oga_no, generic_type, berthing_length }, email)
            .then(() => {
                setSubmitNote(`OGA No. ${oga_no} reserved for ${name}`)
                setSnackBarOpen(true);
            })
            .catch((e) => console.log(e));
    }

    const handleCancel = (data) => {
        disposeOgaNo(data.oga_no)
            .then(() => console.log(`disposed of oga no ${data.oga_no}`))
            .catch((e) => console.log(e));
        setOpen(false);
    }

    const schema = {
        title: 'Choose a boat from the register or create a new one',
        fields: [
            {
                component: 'select',
                name: 'boat',
                label: "Boat",
                isSearchable: true,
                isClearable: true,
                options,
            },
            {
                component: 'text-field',
                name: 'name',
                label: 'Name',
                isRequired: true,
                validate: [{ type: 'required', message: 'This field is required' }],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        return {
                            initialValue: data.find(b => b.oga_no === boat).name,
                        };
                        // } else {
                        //    formOptions.change('name', undefined);
                    }
                },
            },
            {
                component: 'text-field',
                name: 'oga_no',
                label: "Make a note of your boat's OGA Number",
                type: 'number',
                isReadOnly: true,
                dataType: 'integer',
                initialValue: firstFreeOgaNo,
                validate: [{ type: 'required', message: 'This field is required' }],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    formOptions.change('oga_no', boat || firstFreeOgaNo);
                },
            },
            {
                component: 'select',
                name: 'generic_type',
                label: "Type",
                initialValue: 'Yacht',
                options: [
                    { label: 'Big Boat', value: 'Yacht' },
                    { label: 'Small Boat', value: 'Dinghy' },
                ],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        const b = data.find(b => b.oga_no === boat);
                        return {
                            initialValue: ['Dayboat', 'Dinghy'].includes(b.generic_type) ? 'Dinghy' : 'Yacht',
                        };
                    }
                },
            },
            {
                component: 'text-field',
                name: 'berthing_length',
                label: 'Berthing Length in feet',
                isRequired: true,
                type: 'number',
                dataType: 'float',
                validate: [{ type: 'required', message: 'This field is required' }],
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        const b = data.find(b => b.oga_no === boat);
                        const m = b.berthing_length || b.length_on_deck || 0;
                        const f = m2df(m);
                        return {
                            initialValue: f,
                        };
                    }
                },
            },
            {
                component: 'text-field',
                name: "email",
                label: "email",
                condition: { when: 'boat', isEmpty: true, then: { visible: true } },
                resolveProps: (_props, _field, formOptions) => {
                    const { boat } = formOptions.getState().values;
                    if (boat) {
                        return { isRequired: false };
                    } else {
                        return {
                            isRequired: true,
                            validate: [
                                { type: 'required' },
                                {
                                    type: 'pattern',
                                    pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                                }
                            ],
                            helperText: 'we need an email to help complete the boat entry',
                        }
                    }
                },
            },
        ]
    };

    const handleSnackBarClose = (event, reason) => {
        // console.log('close', reason);
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    return (
        <>
            <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
            >
                Identify Your Boat
            </Button>
            <Dialog open={open}>
                <Stack sx={{ width: '400px' }}>
                    <FormRenderer
                        schema={schema}
                        subscription={{ values: true }}
                        componentMapper={{
                            'text-field': TextField, 'select': Select,
                        }}
                        FormTemplate={(props) => (
                            <FormTemplate {...props} showFormControls={true} />
                        )}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </Stack>
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackBarOpen}
                autoHideDuration={6000} onClose={handleSnackBarClose}>
                <Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
                    {submitNote}
                </Alert></Snackbar>
        </>
    );
}
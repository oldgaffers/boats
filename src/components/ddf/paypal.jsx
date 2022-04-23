
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

export const DDFPayPalButtons = (props) => {
    const { purchaseUnits, label, helperText, input, ...rest } = useFieldApi(props);
    console.log('DDFPayPalButtons', rest);

    const createOrder = (data, actions) => {
        return actions.order.create({ purchase_units: purchaseUnits });
    };

    const approve = (data, actions) => {
        return actions.order.capture().then((details) => {
            input.onChange(details);
        });
    }
    return (
        <Box display="block">
            <Typography variant="h6" sx={{ paddingTop: ".5em", paddingBottom: ".5em" }}>{label}</Typography>
            <PayPalButtons style={{
                shape: 'rect',
                color: 'blue',
                layout: 'vertical',
                label: 'paypal',
            }}
                createOrder={createOrder}
                onApprove={approve}
            />
            <Typography variant="body2" sx={{ paddingTop: ".5em", paddingBottom: ".5em" }}>{helperText}</Typography>
        </Box>
    );
};


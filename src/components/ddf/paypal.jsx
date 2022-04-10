
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

export const DDFPayPalButtons = ({ component, name, label, helperText, description, amount }) => {
    const { input } = useFieldApi({ component, name });

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [{
                description,
                amount: { currency_code: 'GBP', value: amount }
            }]
        });
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


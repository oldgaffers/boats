import { useFieldApi } from "@data-driven-forms/react-form-renderer";

export default function DataGridField(props) {
    const { input, meta, label, ...rest } = useFieldApi(props);
    // console.log('DataGridField', rest);
    return (
        <div>
            <div>
                <label htmlFor={input.name}>
                    {label}
                </label>
            </div>
            <div>
                TODO
            </div>
            {meta.error && (
                <div>
                    <span>
                        {meta.error}
                    </span>
                </div>
            )}
        </div>
    )
}

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';

export default function HtmlEditor({ component, name, title, helperText, controls, ...rest }) {
    const { input } = useFieldApi({ component, name });
    return (
        <div className="App">
            <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
            <CKEditor
                editor={ClassicEditor}
                config={{ toolbar: controls }}
                data={input.value}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ event, editor, data });
                    input.onChange(data);
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
            <p/>
        </div>
    );

}


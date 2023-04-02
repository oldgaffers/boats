import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';

export default function HtmlEditor({
    component, name, title, helperText, controls, maxLength, initialValue, ...rest }) {
    const { input } = useFieldApi({ component, name });
    return (
        <div
        onKeyDown={(e) => {
            if (e.key === 'Enter' ) {
                e.stopPropagation(); 
            }
        }}
        >
            <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
            <CKEditor
                editor={ClassicEditor}
                config={{ toolbar: controls, maxCharCount: maxLength }}
                data={input.value || initialValue}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    // console.log('editor onChange', { event, editor, data });
                    input.onChange(data);
                }}
                onBlur={(event, editor) => {
                    // console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    // console.log('Focus.', editor);
                }}
            />
            <Typography variant='caption'>{helperText||''}</Typography>
        </div>
    );

}


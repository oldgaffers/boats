import React, { useEffect, useRef, useState } from 'react';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const Editor = ({ name, value, onChange, placeholder, error }) => {
  const editorRef = useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleInput = () => {
    const content = editorRef.current.innerHTML;
    onChange(name, content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execCommand('insertHTML', '<br><br>');
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${linkText}</a>`;
      execCommand('insertHTML', linkHtml);
      setLinkUrl('');
      setLinkText('');
      setIsLinkModalOpen(false);
    }
  };

  const isCommandActive = (command) => {
    return document.queryCommandState(command);
  };

  const errorClasses = error ? "border-red-500" : "border-gray-300";

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isCommandActive('bold') ? 'bg-gray-300' : ''
          }`}
          title="Bold"
        >
          <FormatBoldIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isCommandActive('italic') ? 'bg-gray-300' : ''
          }`}
          title="Italic"
        >
          <FormatItalicIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Link"
        >
          <InsertLinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[100px] px-3 py-2 border border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errorClasses}`}
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder={placeholder}
      />

      {/* Custom styles for placeholder */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl || !linkText}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function HtmlEditor({
    component, name, title = '', helperText = '', initialValue }) {
    const { input } = useFieldApi({ component, name });
    return (
        <>
            <Stack direction='column'>
                <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
                <Editor
                    name={name}
                    value={input.value || initialValue}
                    onChange={(name, content) => {
                        console.log('editor onChange', name, content);
                        input.onChange(content);          
                    }}
                />
                <Typography variant='caption'>{helperText}</Typography>
            </Stack>
        </>
    );

}


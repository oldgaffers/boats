import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Bold, Italic, Link } from 'lucide-react';

// Example JSON schema for demonstration
const exampleSchema = {
  title: "User Registration Wizard",
  steps: [
    {
      id: "personal",
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          validation: {
            minLength: 2,
            pattern: "^[A-Za-z]+$",
            message: "First name must contain only letters and be at least 2 characters"
          }
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          validation: {
            minLength: 2,
            pattern: "^[A-Za-z]+$",
            message: "Last name must contain only letters and be at least 2 characters"
          }
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Please enter a valid email address"
          }
        },
        {
          name: "birthDate",
          label: "Date of Birth",
          type: "date",
          required: true
        }
      ]
    },
    {
      id: "preferences",
      title: "Preferences",
      description: "Customize your experience",
      fields: [
        {
          name: "theme",
          label: "Preferred Theme",
          type: "select",
          required: true,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" }
          ]
        },
        {
          name: "experience",
          label: "Experience Level",
          type: "radio",
          required: true,
          options: [
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "expert", label: "Expert" }
          ]
        }
      ]
    },
    {
      id: "notifications",
      title: "Email Notifications",
      description: "Choose which notifications you'd like to receive",
      fields: [
        {
          name: "notifications",
          label: "Email Notifications",
          type: "checkbox",
          options: [
            { value: "newsletter", label: "Newsletter" },
            { value: "updates", label: "Product Updates" },
            { value: "marketing", label: "Marketing" }
          ]
        }
      ]
    },
    {
      id: "additional",
      title: "Additional Information",
      description: "Help us serve you better",
      fields: [
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
          placeholder: "Tell us about yourself...",
          validation: {
            maxLength: 500,
            message: "Bio must be less than 500 characters"
          }
        },
        {
          name: "website",
          label: "Website",
          type: "url",
          placeholder: "https://example.com"
        },
        {
          name: "agreeTerms",
          label: "I agree to the Terms and Conditions",
          type: "checkbox",
          required: true,
          single: true
        }
      ]
    }
  ]
};

const RichTextEditor = ({ name, value, onChange, placeholder, error }) => {
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
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isCommandActive('italic') ? 'bg-gray-300' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
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
      <style jsx>{`
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

const FormField = ({ field, value, onChange, error }) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const errorClasses = error ? "border-red-500" : "border-gray-300";

  switch (field.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'date':
      return (
        <input
          type={field.type}
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          className={`${baseClasses} ${errorClasses}`}
        />
      );

    case 'textarea':
      return (
        <RichTextEditor
          name={field.name}
          value={value || ''}
          onChange={onChange}
          placeholder={field.placeholder}
          error={error}
        />
      );

    case 'select':
      return (
        <select
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={`${baseClasses} ${errorClasses}`}
        >
          <option value="">Select an option...</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map(option => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      if (field.single) {
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              checked={value || false}
              onChange={(e) => onChange(field.name, e.target.checked)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">{field.label}</span>
          </label>
        );
      }
      return (
        <div className="space-y-2">
          {field.options?.map(option => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={option.value}
                checked={value?.includes(option.value) || false}
                onChange={(e) => {
                  const currentValue = value || [];
                  if (e.target.checked) {
                    onChange(field.name, [...currentValue, option.value]);
                  } else {
                    onChange(field.name, currentValue.filter(v => v !== option.value));
                  }
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
};

const WizardForm = ({ schema }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [skippedSteps, setSkippedSteps] = useState(new Set());

  const validateField = (field, value) => {
    const validation = field.validation;
    if (!validation) return null;

    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`;
    }

    if (value) {
      // For rich text fields, check the text content length, not HTML length
      let textToValidate = value;
      if (field.type === 'textarea' && value.includes('<')) {
        // Create a temporary div to extract text content from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value;
        textToValidate = tempDiv.textContent || tempDiv.innerText || '';
      }

      if (validation.minLength && textToValidate.length < validation.minLength) {
        return validation.message || `${field.label} must be at least ${validation.minLength} characters`;
      }

      if (validation.maxLength && textToValidate.length > validation.maxLength) {
        return validation.message || `${field.label} must be less than ${validation.maxLength} characters`;
      }

      if (validation.pattern && !new RegExp(validation.pattern).test(textToValidate)) {
        return validation.message || `${field.label} format is invalid`;
      }
    }

    return null;
  };

  const validateStep = (stepIndex) => {
    const step = schema.steps[stepIndex];
    const stepErrors = {};

    step.fields.forEach(field => {
      const value = formData[field.name];
      const error = validateField(field, value);
      if (error) {
        stepErrors[field.name] = error;
      }
    });

    return stepErrors;
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field if it exists
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    if (currentStep < schema.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    // Skip the notifications step (step index 2)
    if (currentStep === 1) { // preferences step
      setSkippedSteps(prev => new Set([...prev, 2])); // mark notifications step as skipped
      setCurrentStep(3); // jump to additional information step
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // If we're on additional info (step 3) and notifications was skipped, go back to preferences (step 1)
      if (currentStep === 3 && skippedSteps.has(2)) {
        setCurrentStep(1);
        setSkippedSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(2); // unmark notifications step as skipped
          return newSet;
        });
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  const handleSubmit = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for completing the form.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h3 className="font-semibold mb-2">Submitted Data:</h3>
            <pre className="text-sm text-gray-600 overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
              setFormData({});
              setErrors({});
              setSkippedSteps(new Set());
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = schema.steps[currentStep];
  const progress = ((currentStep + 1) / schema.steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{schema.title}</h1>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-6">
          {schema.steps.map((step, index) => {
            const isSkipped = skippedSteps.has(index);
            const isCompleted = index < currentStep || (index < currentStep && !isSkipped);
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                  isSkipped 
                    ? 'bg-gray-300 text-gray-500 line-through' 
                    : isCurrent || isCompleted 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isSkipped ? '×' : index + 1}
                </div>
                <span className={`text-xs text-center ${
                  isSkipped 
                    ? 'text-gray-400 line-through'
                    : isCurrent || isCompleted 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentStepData.title}</h2>
        {currentStepData.description && (
          <p className="text-gray-600 mb-6">{currentStepData.description}</p>
        )}

        <div className="space-y-6">
          {currentStepData.fields.map(field => (
            <div key={field.name}>
              {!field.single && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              
              <FormField
                field={field}
                value={formData[field.name]}
                onChange={handleFieldChange}
                error={errors[field.name]}
              />
    
'use client';

import React, { useState } from 'react';

interface UserFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function UserForm({ onSubmit, loading }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    age: '', // Keep as string for input, convert on submit
    gender: '',
    isDisabled: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <InputField label="Your Name" name="name" value={formData.name} onChange={handleChange} required />
      <InputField label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
      <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
      <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={['Male', 'Female', 'Other', 'Prefer not to say']} />
      <CheckboxField label="Disabled" name="isDisabled" checked={formData.isDisabled} onChange={handleChange} />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Saving...' : 'Complete Profile'}
      </button>
    </form>
  );
}


// --- Reusable Form Field Components (place in components/ui or similar) ---

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, name, ...props }) => (
  <div style={styles.inputGroup}>
    <label htmlFor={name} style={styles.label}>{label}{props.required && '*'}</label>
    <input id={name} name={name} style={styles.input} {...props} />
  </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}
const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, ...props }) => (
  <div style={styles.inputGroup}>
    <label htmlFor={name} style={styles.label}>{label}{props.required && '*'}</label>
    <textarea id={name} name={name} style={styles.input} {...props} />
  </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: string[];
}
const SelectField: React.FC<SelectFieldProps> = ({ label, name, options, ...props }) => (
  <div style={styles.inputGroup}>
    <label htmlFor={name} style={styles.label}>{label}{props.required && '*'}</label>
    <select id={name} name={name} style={styles.input} {...props}>
      <option value="" disabled>{`Select ${label}`}</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}
const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, name, ...props }) => (
  <div style={{ ...styles.inputGroup, flexDirection: 'row', alignItems: 'center' }}>
    <input id={name} name={name} type="checkbox" style={{ marginRight: '10px' }} {...props} />
    <label htmlFor={name} style={{ ...styles.label, fontWeight: 'normal' }}>{label}</label>
  </div>
);


// Basic inline styles for forms
const styles = {
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '15px', marginTop: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '5px' },
  label: { fontWeight: 'bold', marginBottom: '3px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' },
  button: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
}

// components/onboarding/MerchantForm.tsx
'use client';

import React, { useState } from 'react';

interface MerchantFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function MerchantForm({ onSubmit, loading }: MerchantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    businessName: '',
    businessAddress: '',
    businessDescription: '',
    // businessLogoUrl: '', // Handle logo upload separately if needed
    businessCategory: '',
    businessWebsite: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <InputField label="Your Name" name="name" value={formData.name} onChange={handleChange} required />
      <InputField label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required />
      <InputField label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} required />
      <InputField label="Business Address" name="businessAddress" value={formData.businessAddress} onChange={handleChange} required />
      <TextAreaField label="Business Description" name="businessDescription" value={formData.businessDescription} onChange={handleChange} required />
      {/* Add File Input for Logo if needed - requires Firebase Storage setup */}
      {/* <InputField label="Business Logo URL" name="businessLogoUrl" type="url" value={formData.businessLogoUrl} onChange={handleChange} /> */}
      <InputField label="Business Category" name="businessCategory" value={formData.businessCategory} onChange={handleChange} required />
      <InputField label="Business Website (Optional)" name="businessWebsite" type="url" value={formData.businessWebsite} onChange={handleChange} />

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Saving...' : 'Complete Profile'}
      </button>
    </form>
  );
}

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

const styles = {
  form: { display: 'flex', flexDirection: 'column' as 'column', gap: '15px', marginTop: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '5px' },
  label: { fontWeight: 'bold', marginBottom: '3px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' },
  button: { padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
}

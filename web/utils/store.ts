import { create } from 'zustand';

interface FormData {
  businessName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  address?: string;
}

interface FormErrors {
  businessName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  address?: string;
}

interface Store {
  form: FormData;
  errors: FormErrors;
  setField: (field: keyof FormData, value: string) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

export const useStore = create<Store>((set, get) => ({
  form: {},
  errors: {},
  setField: (field, value) =>
    set((state) => ({
      form: { ...state.form, [field]: value },
      errors: { ...state.errors, [field]: undefined },
    })),
  validateForm: () => {
    const form = get().form;
    const errors: FormErrors = {};
    let isValid = true;

    if (!form.businessName?.trim()) {
      errors.businessName = 'Business name is required';
      isValid = false;
    }

    if (!form.ownerName?.trim()) {
      errors.ownerName = 'Owner name is required';
      isValid = false;
    }

    if (!form.email?.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    }

    if (!form.phone?.trim()) {
      errors.phone = 'Phone is required';
      isValid = false;
    }

    if (!form.businessType?.trim()) {
      errors.businessType = 'Business type is required';
      isValid = false;
    }

    if (!form.address?.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    set({ errors });
    return isValid;
  },
  resetForm: () => set({ form: {}, errors: {} }),
}));

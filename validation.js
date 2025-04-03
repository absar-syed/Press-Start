export function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  export function validatePhoneNumber(phone) {
    const phonePattern = /^\d{10,15}$/; // Accepts 10 to 15 digits
    return phonePattern.test(phone);
  }
  
  export function validateRequiredField(value) {
    return value.trim() !== '';
  }
  
  export function showError(input, message) {
    const errorElement = input.nextElementSibling;
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }
  
  export function clearError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }
  
  export function validateForm(form) {
    let isValid = true;
  
    form.querySelectorAll('input, textarea').forEach((input) => {
      if (input.hasAttribute('required') && !validateRequiredField(input.value)) {
        showError(input, 'This field is required.');
        isValid = false;
      } else if (input.type === 'email' && !validateEmail(input.value)) {
        showError(input, 'Invalid email format.');
        isValid = false;
      } else if (input.name === 'client_phone' && !validatePhoneNumber(input.value)) {
        showError(input, 'Invalid phone number.');
        isValid = false;
      } else {
        clearError(input);
      }
    });
  
    return isValid;
  }
  
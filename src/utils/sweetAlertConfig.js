import Swal from 'sweetalert2';

// Get CSS custom properties
const getCSSVariable = (variableName) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

// Configure SweetAlert to match the existing theme
export const showSweetAlert = (options) => {
  const isDarkMode = document.documentElement.classList.contains('dark-mode');
  
  // Get theme colors from CSS variables
  const accentColor = getCSSVariable('--accent');
  const accentHover = getCSSVariable('--accent-hover');
  const textColor = getCSSVariable('--text');
  const cardBg = getCSSVariable('--card-bg');
  const borderColor = getCSSVariable('--border');
  
  const defaultOptions = {
    background: cardBg,
    color: textColor,
    confirmButtonColor: accentColor,
    confirmButtonHoverColor: accentHover,
    cancelButtonColor: borderColor,
    showClass: {
      popup: 'animate__animated animate__fadeInDown',
      icon: 'animate__animated animate__zoomIn',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
      icon: 'animate__animated animate__zoomOut',
    },
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-html',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
      actions: 'custom-swal-actions',
    },
    buttonsStyling: false, // We'll use our own CSS
    reverseButtons: false,
    focusConfirm: true,
    // Add dark mode class to popup if in dark mode
    ...(isDarkMode && { customClass: { popup: 'custom-swal-popup dark-mode' } }),
  };

  // Merge with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    // Ensure confirm button color is always applied
    confirmButtonColor: options.confirmButtonColor || accentColor,
    // Merge custom classes properly
    customClass: {
      ...defaultOptions.customClass,
      ...(options.customClass || {}),
      popup: `${defaultOptions.customClass.popup} ${isDarkMode ? 'dark-mode' : ''} ${(options.customClass?.popup || '')}`.trim(),
    },
  };

  return Swal.fire(mergedOptions);
};

// Preset configurations for common alerts
export const showAlerts = {
  success: (title, text) => showSweetAlert({
    icon: 'success',
    title,
    text,
    timer: 4000,
    timerProgressBar: true,
  }),
  
  error: (title, text) => showSweetAlert({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  }),
  
  warning: (title, text) => showSweetAlert({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'OK',
  }),
  
  info: (title, text) => showSweetAlert({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK',
  }),
  
  confirm: (title, text, confirmText = 'Yes', cancelText = 'No') => showSweetAlert({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  }),
};

// Export the default showSweetAlert as the main export
export default showSweetAlert;

// src/utils/dateUtils.js
// Utility functions for consistent date handling across the application

/**
 * Gets today's date in YYYY-MM-DD format, timezone-aware
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayFormatted = () => {
  const today = new Date();
  return formatDateForInput(today);
};

/**
 * Formats a date object for HTML input fields (YYYY-MM-DD)
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';

  // Handle case when date is already a string in YYYY-MM-DD format
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date;
  }

  try {
    const d = new Date(date);
    // Use UTC methods to prevent timezone issues
    const year = d.getFullYear();
    // getMonth() is 0-based, so add 1
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Formats a date for display in the UI
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string (e.g., "Apr 26")
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';

  try {
    // Create a new Date object, parsing the string if needed
    const d = typeof date === 'string' ? new Date(date) : date;

    // Ensure proper date creation
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }

    // Use Intl.DateTimeFormat for consistent formatting
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'Invalid date';
  }
};

/**
 * Adds a specified number of days to a date
 * @param {Date|string} date - The starting date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date} New date object with days added
 */
export const addDays = (date, days) => {
  try {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  } catch (error) {
    console.error('Error adding days to date:', error);
    return new Date();
  }
};

/**
 * Calculates the number of days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} Number of days between dates
 */
export const daysBetween = (date1, date2) => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Set times to midnight to calculate whole days
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error('Error calculating days between dates:', error);
    return 0;
  }
};

/**
 * Parses a date string in YYYY-MM-DD format and returns a Date object
 * Takes care of timezone issues
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date} Date object
 */
export const parseISODate = (dateString) => {
  if (!dateString) return new Date();

  try {
    // For YYYY-MM-DD format, parse parts and create a new Date
    // This avoids timezone issues
    if (
      typeof dateString === 'string' &&
      dateString.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      const [year, month, day] = dateString.split('-').map(Number);
      // Month is 0-based in JavaScript Date
      return new Date(year, month - 1, day);
    }

    // For other formats, use standard parsing
    return new Date(dateString);
  } catch (error) {
    console.error('Error parsing ISO date:', error);
    return new Date();
  }
};

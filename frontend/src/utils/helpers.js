// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Format time
export const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+91 ${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

// Format address
export const formatAddress = (address) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.pincode}`;
};

// Calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

// Convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Generate random string
export const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

// Validate password
export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

// Validate pincode
export const validatePincode = (pincode) => {
  const re = /^[0-9]{6}$/;
  return re.test(pincode);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 1);
};

// Get file size in MB
export const getFileSize = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

// Truncate text
export const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

// Generate initials
export const generateInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Get time ago
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

// Get order status color
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: "warning",
    accepted: "info",
    preparing: "primary",
    ready: "success",
    picked_up: "secondary",
    delivered: "success",
    cancelled: "error",
  };
  return colors[status] || "default";
};

// Get order status label
export const getOrderStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    picked_up: "Picked Up",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

// Get payment method label
export const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: "Cash on Delivery",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    upi: "UPI",
    net_banking: "Net Banking",
  };
  return labels[method] || method;
};

// Get cuisine label
export const getCuisineLabel = (cuisine) => {
  return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
};

// Get feature label
export const getFeatureLabel = (feature) => {
  const labels = {
    delivery: "Delivery",
    takeaway: "Takeaway",
    dine_in: "Dine In",
    outdoor_seating: "Outdoor Seating",
    parking: "Parking",
    wifi: "WiFi",
    ac: "AC",
    bar: "Bar",
    live_music: "Live Music",
    kids_play_area: "Kids' Play Area",
  };
  return labels[feature] || feature;
};

// Get price range label
export const getPriceRangeLabel = (range) => {
  return "₹".repeat(range);
};

// Get rating label
export const getRatingLabel = (rating) => {
  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };
  return labels[rating] || rating;
};

// Get delivery time label
export const getDeliveryTimeLabel = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Get distance label
export const getDistanceLabel = (distance) => {
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${Math.round(distance)}km`;
};

// Get percentage
export const getPercentage = (value, total) => {
  return Math.round((value / total) * 100);
};

// Get average rating
export const getAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / ratings.length;
};

// Get total reviews
export const getTotalReviews = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  return ratings.reduce((acc, rating) => acc + rating, 0);
};

// Get rating distribution
export const getRatingDistribution = (ratings) => {
  if (!ratings || ratings.length === 0) return {};
  const distribution = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = ratings.filter((rating) => rating === i).length;
  }
  return distribution;
};

// Get rating percentage
export const getRatingPercentage = (ratings, value) => {
  if (!ratings || ratings.length === 0) return 0;
  const count = ratings.filter((rating) => rating === value).length;
  return (count / ratings.length) * 100;
};

// Get rating color
export const getRatingColor = (rating) => {
  const colors = {
    1: "#f44336",
    2: "#ff9800",
    3: "#ffc107",
    4: "#8bc34a",
    5: "#4caf50",
  };
  return colors[rating] || "#757575";
};

// Get rating icon
export const getRatingIcon = (rating) => {
  const icons = {
    1: "sentiment_very_dissatisfied",
    2: "sentiment_dissatisfied",
    3: "sentiment_neutral",
    4: "sentiment_satisfied",
    5: "sentiment_very_satisfied",
  };
  return icons[rating] || "star";
};

// Get rating text
export const getRatingText = (rating) => {
  const texts = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };
  return texts[rating] || rating;
};

// Get rating description
export const getRatingDescription = (rating) => {
  const descriptions = {
    1: "Not recommended",
    2: "Below average",
    3: "Average",
    4: "Above average",
    5: "Highly recommended",
  };
  return descriptions[rating] || "";
};

// Get rating summary
export const getRatingSummary = (ratings) => {
  if (!ratings || ratings.length === 0)
    return { average: 0, total: 0, distribution: {} };
  const average = getAverageRating(ratings);
  const total = getTotalReviews(ratings);
  const distribution = getRatingDistribution(ratings);
  return { average, total, distribution };
};

// Get rating display
export const getRatingDisplay = (rating) => {
  return {
    value: rating,
    color: getRatingColor(rating),
    icon: getRatingIcon(rating),
    text: getRatingText(rating),
    description: getRatingDescription(rating),
  };
};

// Get rating display with distribution
export const getRatingDisplayWithDistribution = (ratings) => {
  const summary = getRatingSummary(ratings);
  return {
    ...summary,
    display: getRatingDisplay(summary.average),
  };
};

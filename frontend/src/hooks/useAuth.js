import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout, updateProfile } from "../store/actions/authActions";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (roles) => {
    if (!user) return false;
    return roles.every((role) => user.role === role);
  };

  // Handle login
  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials));
      navigate("/");
    } catch (error) {
      throw error;
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Handle profile update
  const handleUpdateProfile = async (profileData) => {
    try {
      await dispatch(updateProfile(profileData));
    } catch (error) {
      throw error;
    }
  };

  // Check if user is verified
  const isVerified = () => {
    return user?.isVerified || false;
  };

  // Check if user is active
  const isActive = () => {
    return user?.isActive || false;
  };

  // Get user's location
  const getUserLocation = () => {
    return user?.location || null;
  };

  // Get user's address
  const getUserAddress = () => {
    return user?.address || null;
  };

  // Check if user can access a specific route
  const canAccessRoute = (allowedRoles) => {
    if (!isAuthenticated) return false;
    return hasAnyRole(allowedRoles);
  };

  // Redirect if user doesn't have required role
  const requireRole = (roles, redirectPath = "/") => {
    if (!canAccessRoute(roles)) {
      navigate(redirectPath);
      return false;
    }
    return true;
  };

  // Get user's full name
  const getFullName = () => {
    return user?.name || "";
  };

  // Get user's email
  const getEmail = () => {
    return user?.email || "";
  };

  // Get user's phone
  const getPhone = () => {
    return user?.phone || "";
  };

  // Check if user is a customer
  const isCustomer = () => {
    return hasRole("customer");
  };

  // Check if user is a restaurant admin
  const isRestaurantAdmin = () => {
    return hasRole("seller");
  };

  // Check if user is a delivery personnel
  const isDeliveryPersonnel = () => {
    return hasRole("delivery_personnel");
  };

  // Check if user is an admin
  const isAdmin = () => {
    return hasRole("admin");
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    handleLogin,
    handleLogout,
    handleUpdateProfile,
    isVerified,
    isActive,
    getUserLocation,
    getUserAddress,
    canAccessRoute,
    requireRole,
    getFullName,
    getEmail,
    getPhone,
    isCustomer,
    isRestaurantAdmin,
    isDeliveryPersonnel,
    isAdmin,
  };
};

export default useAuth;

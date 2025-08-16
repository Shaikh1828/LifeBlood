// import { useState, useEffect } from 'react';
// import { User, AuthState } from '../types';
// import { apiService } from '../services/apiService';

// export const useAuth = () => {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     isAuthenticated: false,
//     loading: true,
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setAuthState({
//         user: { id: '', email: '', role: '', name: '', bloodGroup: '' },
//         isAuthenticated: true,
//         loading: false,
//       });
//     } else {
//       setAuthState({
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//       });
//     }
//   }, []);

//   const login = async (
//     email: string,
//     password: string
//   ): Promise<{ success: boolean; error?: string }> => {
//     try {
//       console.log('useAuth: Starting login process...');
//       const response = await apiService.login({ email, password });
//       console.log('useAuth: Login response received:', response);
      
//       const userData = response;

//       setAuthState({
//         user: userData,
//         isAuthenticated: true,
//         loading: false,
//       });

//       console.log('useAuth: Login successful, state updated');
//       return { success: true };
//     } catch (error: any) {
//       console.error('useAuth: Login failed:', error);
      
//       let errorMessage = 'Login failed';
      
//       if (error.response) {
//         switch (error.response.status) {
//           case 401:
//             errorMessage = 'Invalid email or password';
//             break;
//           case 400:
//             errorMessage = 'Please provide valid email and password';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later';
//             break;
//           default:
//             errorMessage = `Login failed: ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage = 'Network error. Please check your connection';
//       } else {
//         errorMessage = error.message || 'Login failed';
//       }

//       setAuthState({
//         user: null,
//         isAuthenticated: false,
//         loading: false,
//       });
      
//       return { success: false, error: errorMessage };
//     }
//   };

//   const register = async (
//     userData: any
//   ): Promise<{ success: boolean; error?: string; message?: string; user?: any }> => {
//     try {
//       console.log('useAuth: Starting registration process...');
//       console.log('useAuth: Registration data:', userData);

//       // Validate required fields
//       const requiredFields = ['fullName', 'email', 'password', 'phone', 'division', 'district', 'upazila', 'bloodGroup'];
//       const missingFields = requiredFields.filter(field => !userData[field] || userData[field].trim() === '');
      
//       if (missingFields.length > 0) {
//         const error = `Missing required fields: ${missingFields.join(', ')}`;
//         console.error('useAuth: Validation failed:', error);
//         return { success: false, error };
//       }

//       // Call API service for registration
//       const response = await apiService.register(userData);
//       console.log('useAuth: Registration successful:', response);

//       // Auto-login after successful registration
//       console.log('useAuth: Auto-logging in after registration...');
      
//       // Wait a bit for registration to complete
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       const loginResult = await login(userData.email, userData.password);
      
//       if (loginResult.success) {
//         console.log('useAuth: Auto-login successful after registration');
//         // Wait for state to update properly
//         await new Promise(resolve => setTimeout(resolve, 100));
        
//         return { 
//           success: true, 
//           message: 'Registration and login successful!',
//           user: authState.user,
//           autoLogin: true
//         };
//       } else {
//         console.log('useAuth: Auto-login failed, but registration was successful');
//         return { 
//           success: true, 
//           message: 'Registration successful! Please login manually.',
//           error: 'Auto-login failed',
//           autoLogin: false
//         };
//       }
      
//     } catch (error: any) {
//       console.error('useAuth: Registration failed:', error);

//       let errorMessage = 'Registration failed';

//       if (error.response) {
//         console.error('useAuth: Server error response:', error.response.data);
//         switch (error.response.status) {
//           case 409:
//             errorMessage = 'User already exists with this email';
//             break;
//           case 400:
//             errorMessage = error.response.data?.message || 'Invalid data provided';
//             break;
//           case 422:
//             errorMessage = 'Invalid input data. Please check all fields';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later';
//             break;
//           default:
//             errorMessage = `Registration failed: ${error.response.status}`;
//         }
//       } else if (error.request) {
//         console.error('useAuth: Network error:', error.request);
//         errorMessage = 'Network error. Please check your connection';
//       } else {
//         console.error('useAuth: Unknown error:', error.message);
//         errorMessage = error.message || 'Registration failed';
//       }

//       return { success: false, error: errorMessage };
//     }
//   };

//   const logout = () => {
//     console.log('useAuth: Logging out...');
//     apiService.logout();
//     setAuthState({
//       user: null,
//       isAuthenticated: false,
//       loading: false,
//     });
//     console.log('useAuth: Logout complete');
//   };

//   const updateUser = async (updatedUser: User) => {
//     if (authState.user) {
//       try {
//         console.log('useAuth: Updating user:', updatedUser);
//         const response = await apiService.updateUser(
//           parseInt(authState.user.id),
//           updatedUser
//         );
//         setAuthState((prev) => ({
//           ...prev,
//           user: response,
//         }));
//         console.log('useAuth: User updated successfully');
//       } catch (error) {
//         console.error('useAuth: User update failed:', error);
//         throw error;
//       }
//     }
//   };

//   return {
//     ...authState,
//     login,
//     register,
//     logout,
//     updateUser,
//   };
// };
import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { apiService } from '../services/apiService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState({
        user: { id: '', email: '', role: '', name: '', bloodGroup: '' },
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('useAuth: Starting login process...');
      const response = await apiService.login({ email, password });
      console.log('useAuth: Login response received:', response);
      
      const userData = response;

      setAuthState({
        user: userData,
        isAuthenticated: true,
        loading: false,
      });

      console.log('useAuth: Login successful, state updated');
      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Login failed:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid email or password';
            break;
          case 400:
            errorMessage = 'Please provide valid email and password';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = `Login failed: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection';
      } else {
        errorMessage = error.message || 'Login failed';
      }

      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (
    userData: any
  ): Promise<{ success: boolean; error?: string; message?: string; user?: any }> => {
    try {
      console.log('useAuth: Starting registration process...');
      console.log('useAuth: Registration data:', userData);

      // Validate required fields
      const requiredFields = ['fullName', 'email', 'password', 'phone', 'division', 'district', 'upazila', 'bloodGroup'];
      const missingFields = requiredFields.filter(field => !userData[field] || userData[field].trim() === '');
      
      if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(', ')}`;
        console.error('useAuth: Validation failed:', error);
        return { success: false, error };
      }

      // Call API service for registration
      const response = await apiService.register(userData);
      console.log('useAuth: Registration successful:', response);

      // Auto-login after successful registration
      console.log('useAuth: Auto-logging in after registration...');
      
      // Wait a bit for registration to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loginResult = await login(userData.email, userData.password);
      
      if (loginResult.success) {
        console.log('useAuth: Auto-login successful after registration');
        // Wait for state to update properly
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { 
          success: true, 
          message: 'Registration and login successful!',
          user: authState.user,
          autoLogin: true
        };
      } else {
        console.log('useAuth: Auto-login failed, but registration was successful');
        return { 
          success: true, 
          message: 'Registration successful! Please login manually.',
          error: 'Auto-login failed',
          autoLogin: false
        };
      }
      
    } catch (error: any) {
      console.error('useAuth: Registration failed:', error);

      let errorMessage = 'Registration failed';

      if (error.response) {
        console.error('useAuth: Server error response:', error.response.data);
        switch (error.response.status) {
          case 409:
            errorMessage = 'User already exists with this email';
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Invalid data provided';
            break;
          case 422:
            errorMessage = 'Invalid input data. Please check all fields';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = `Registration failed: ${error.response.status}`;
        }
      } else if (error.request) {
        console.error('useAuth: Network error:', error.request);
        errorMessage = 'Network error. Please check your connection';
      } else {
        console.error('useAuth: Unknown error:', error.message);
        errorMessage = error.message || 'Registration failed';
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log('useAuth: Logging out...');
    apiService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    console.log('useAuth: Logout complete');
  };

  const updateUser = async (updatedUser: User) => {
    if (authState.user) {
      try {
        console.log('useAuth: Updating user:', updatedUser);
        const response = await apiService.updateUser(
          parseInt(authState.user.id),
          updatedUser
        );
        setAuthState((prev) => ({
          ...prev,
          user: response,
        }));
        console.log('useAuth: User updated successfully');
      } catch (error) {
        console.error('useAuth: User update failed:', error);
        throw error;
      }
    }
  };

  // ✅ FIXED: Donation Functions with proper validation
  const addDonation = async (donationData: {
    donationDate: string;
    location: string;
    notes?: string;
    recipientContact?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    console.log('useAuth: Starting addDonation...');
    console.log('useAuth: Current user state:', authState.user);
    console.log('useAuth: Donation data:', donationData);

    // ✅ Enhanced validation
    if (!authState.user || !authState.isAuthenticated) {
      console.error('useAuth: User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    if (!authState.user.id) {
      console.error('useAuth: User ID is missing');
      return { success: false, error: 'User ID is missing' };
    }

    // ✅ Validate donor ID is a valid number
    const donorId = parseInt(authState.user.id);
    if (isNaN(donorId) || donorId <= 0) {
      console.error('useAuth: Invalid donor ID:', authState.user.id);
      return { success: false, error: 'Invalid donor ID' };
    }

    try {
      console.log('useAuth: Adding donation record for donor ID:', donorId);
      
      // ✅ Properly structured donation record
      const donationRecord = {
        donor: { 
          id: donorId  // ✅ Ensure this is a valid number
        },
        donationDate: new Date(donationData.donationDate).toISOString(),
        location: donationData.location.trim(),
        notes: donationData.notes?.trim() || '',
        recipientContact: donationData.recipientContact?.trim() || ''
      };

      console.log('useAuth: Sending donation record:', donationRecord);

      const response = await apiService.addDonation(donationRecord);
      console.log('useAuth: Donation added successfully:', response);

      // Update user's last donation date and availability
      const updatedUser = {
        ...authState.user,
        lastDonationDate: donationData.donationDate,
        isAvailable: false
      };

      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));

      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Failed to add donation:', error);
      console.error('useAuth: Error details:', error.response?.data);
      
      let errorMessage = 'Failed to add donation';
      
      if (error.response) {
        console.error('useAuth: Server response:', error.response.status, error.response.data);
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Invalid donation data provided';
            break;
          case 401:
            errorMessage = 'Authentication required';
            break;
          case 403:
            errorMessage = 'Access denied';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = `Failed to add donation: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection';
      } else {
        errorMessage = error.message || 'Failed to add donation';
      }

      return { success: false, error: errorMessage };
    }
  };

  const getDonations = async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    console.log('useAuth: Starting getDonations...');
    console.log('useAuth: Current user state:', authState.user);

    if (!authState.user || !authState.isAuthenticated) {
      console.error('useAuth: User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    if (!authState.user.id) {
      console.error('useAuth: User ID is missing');
      return { success: false, error: 'User ID is missing' };
    }

    // ✅ Validate donor ID is a valid number
    const donorId = parseInt(authState.user.id);
    if (isNaN(donorId) || donorId <= 0) {
      console.error('useAuth: Invalid donor ID:', authState.user.id);
      return { success: false, error: 'Invalid donor ID' };
    }

    try {
      console.log('useAuth: Fetching donation records for donor ID:', donorId);
      const donations = await apiService.getDonations(donorId);
      console.log('useAuth: Donations fetched successfully:', donations);

      // Transform backend data to frontend format if needed
      const transformedDonations = donations.map((donation: any) => ({
        id: donation.id.toString(),
        donorId: donation.donor.id.toString(),
        date: donation.donationDate.split('T')[0], // Convert ISO date to YYYY-MM-DD
        location: donation.location,
        notes: donation.notes || '',
        recipientContact: donation.recipientContact || '',
        createdAt: donation.createdAt || donation.donationDate
      }));

      return { success: true, data: transformedDonations };
    } catch (error: any) {
      console.error('useAuth: Failed to fetch donations:', error);
      
      let errorMessage = 'Failed to fetch donations';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Authentication required';
            break;
          case 403:
            errorMessage = 'Access denied';
            break;
          case 404:
            console.log('useAuth: No donations found, returning empty array');
            return { success: true, data: [] }; // Return empty array instead of error
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = `Failed to fetch donations: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection';
      } else {
        errorMessage = error.message || 'Failed to fetch donations';
      }

      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    addDonation,
    getDonations,
  };
};
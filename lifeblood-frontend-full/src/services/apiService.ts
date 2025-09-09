// import axios from 'axios';
// import { API_BASE_URL } from '../config/apiConfig';
// import { jwtUtils } from '../utils/jwtUtils';

// // ------------------------
// // Interfaces
// // ------------------------
// interface User {
//   email: string;
//   password: string;
// }

// interface DonationRecord {
//   donationDate: string;
//   location: string;
//   notes?: string;
//   recipientContact?: string;
//   donor: { id: number };
// }

// interface SearchParams {
//   bloodGroup?: string;
//   division?: string;
//   district?: string;
//   upazila?: string;
// }

// // ------------------------
// // Axios Instance with CORS fix
// // ------------------------
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   withCredentials: true,
//   timeout: 10000, // 10 second timeout
// });

// // ------------------------
// // Token Interceptor
// // ------------------------
// api.interceptors.request.use((config) => {
//   console.log('API: Making request to:', config.url);
//   console.log('API: Request method:', config.method?.toUpperCase());
//   console.log('API: Request data:', config.data);
  
//   const token = localStorage.getItem("token");
//   if (token) {
//     // Check if token is expired before making request
//     if (jwtUtils.isTokenExpired()) {
//       console.warn('Token expired, removing from storage');
//       localStorage.removeItem('token');
//       return Promise.reject(new Error('Token expired'));
//     }
    
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log('API: Added Authorization header');
//   }
  
//   return config;
// });

// // ------------------------
// // Response Interceptor for Error Handling
// // ------------------------
// api.interceptors.response.use(
//   (response) => {
//     console.log('API: Response received:', response.status);
//     console.log('API: Response data:', response.data);
//     return response;
//   },
//   (error) => {
//     console.error('API Error:', error);
//     console.error('API Error Response:', error.response?.data);
//     console.error('API Error Status:', error.response?.status);
    
//     // Handle token expiration
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       console.warn('Authentication failed, token removed');
//     }
    
//     return Promise.reject(error);
//   }
// );

// // ------------------------
// // Helper: bloodGroup mapping
// // ------------------------
// const bloodGroupMap: Record<string, string> = {
//   "A+": "A_PLUS",
//   "A-": "A_NEG",
//   "B+": "B_PLUS",
//   "B-": "B_NEG",
//   "AB+": "AB_PLUS",
//   "AB-": "AB_NEG",
//   "O+": "O_PLUS",
//   "O-": "O_NEG",
// };

// // ------------------------
// // FIXED: Date formatting function for exact backend format
// // ------------------------
// const formatDateForBackend = (dateString: string): string => {
//   try {
//     console.log('API: Formatting date:', dateString);
    
//     // If dateString is already in the correct format, return as is
//     if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
//       console.log('API: Date already in correct format:', dateString);
//       return dateString;
//     }
    
//     // If it's just a date (YYYY-MM-DD), add the time part
//     if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
//       const formattedDate = dateString + 'T00:00:00';
//       console.log('API: Added time to date:', formattedDate);
//       return formattedDate;
//     }
    
//     // If it's a full ISO string, convert to our format
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       throw new Error('Invalid date');
//     }
    
//     // Format as YYYY-MM-DDTHH:mm:ss (exactly as backend expects)
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
    
//     const formattedDate = `${year}-${month}-${day}T00:00:00`;
//     console.log('API: Converted date to backend format:', formattedDate);
//     return formattedDate;
    
//   } catch (error) {
//     console.error('API: Date formatting error:', error);
//     throw new Error(`Invalid date format: ${dateString}`);
//   }
// };

// // ------------------------
// // Helper: Date parsing from backend for frontend display
// // ------------------------
// const parseDateFromBackend = (dateString: string): string => {
//   try {
//     if (!dateString) return dateString;
    
//     console.log('API: Parsing backend date:', dateString);
    
//     // If it's in our expected format (YYYY-MM-DDTHH:mm:ss), extract date part
//     if (dateString.match(/^\d{4}-\d{2}-\d{2}T/)) {
//       const datePart = dateString.split('T')[0];
//       console.log('API: Extracted date part:', datePart);
//       return datePart;
//     }
    
//     // Otherwise try to parse as Date and format
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       console.warn('API: Could not parse date, returning original:', dateString);
//       return dateString;
//     }
    
//     // Return YYYY-MM-DD format for frontend
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
    
//     const formattedDate = `${year}-${month}-${day}`;
//     console.log('API: Parsed date for frontend:', formattedDate);
//     return formattedDate;
    
//   } catch (error) {
//     console.error('API: Date parsing error:', error);
//     return dateString; // Return original if parsing fails
//   }
// };

// // ------------------------
// // API Service
// // ------------------------
// export const apiService = {
//   // Get current user info from token
//   getCurrentUser: () => {
//     return jwtUtils.getTokenInfo();
//   },

//   // Get current user ID
//   getCurrentUserId: (): number | null => {
//     const userId = jwtUtils.getUserId();
//     return userId ? parseInt(userId, 10) : null;
//   },

//   // Check authentication status
//   isAuthenticated: (): boolean => {
//     const token = localStorage.getItem('token');
//     return token !== null && !jwtUtils.isTokenExpired();
//   },

//   // Auth
//   register: async (userData: any) => {
//     try {
//       console.log('API: Sending registration data:', userData);

//       const response = await api.post('/auth/register', {
//         name: userData.fullName,
//         email: userData.email,
//         passwordHash: userData.password,
//         phone: userData.phone,
//         division: userData.division,
//         district: userData.district,
//         upazila: userData.upazila,
//         address: userData.address || '',
//         bloodGroup: bloodGroupMap[userData.bloodGroup] || userData.bloodGroup,
//       });

//       console.log('API: Registration response:', response);
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Registration error:', error);
//       throw error;
//     }
//   },

//   login: async (user: User) => {
//     try {
//       console.log('API: Sending login request:', { email: user.email });

//       const response = await api.post('/auth/login', {
//         email: user.email,
//         passwordHash: user.password,
//       });

//       console.log('API: Login response:', response);

//       const authHeader =
//         response.headers['authorization'] ||
//         response.headers['Authorization'] ||
//         response.headers['AUTHORIZATION'];

//       console.log('API: Found auth header:', authHeader);

//       const token = authHeader?.startsWith('Bearer ')
//         ? authHeader.split(' ')[1]
//         : null;

//       if (token) {
//         localStorage.setItem('token', token);
//         console.log('API: Token saved successfully');
        
//         // Log decoded token info for debugging
//         const tokenInfo = jwtUtils.getTokenInfo();
//         console.log('API: Decoded token info:', tokenInfo);
//       } else {
//         console.warn('API: Authorization token not found in headers');
//       }

//       return response.data;
//     } catch (error: any) {
//       console.error('API: Login error:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     console.log('API: User logged out, token removed');
//   },

//   // FIXED: Enhanced Donations with exact backend date format
//   addDonation: async (donationData: {
//     donationDate: string;
//     location: string;
//     notes?: string;
//     recipientContact?: string;
//   }) => {
//     try {
//       console.log('API: Adding donation record - Raw input:', donationData);
      
//       // Auto-detect donor ID from token
//       const donorId = apiService.getCurrentUserId();
//       if (!donorId) {
//         throw new Error('Unable to determine donor ID. Please login again.');
//       }
//       console.log('API: Auto-detected donor ID from token:', donorId);

//       // Enhanced validation
//       if (typeof donorId !== 'number' || donorId <= 0) {
//         const error = `Invalid donor ID: ${donorId}`;
//         console.error('API:', error);
//         throw new Error(error);
//       }

//       if (!donationData.donationDate) {
//         const error = 'Donation date is required';
//         console.error('API:', error);
//         throw new Error(error);
//       }

//       if (!donationData.location || donationData.location.trim() === '') {
//         const error = 'Location is required';
//         console.error('API:', error);
//         throw new Error(error);
//       }

//       // FIXED: Format date in exact backend format (YYYY-MM-DDTHH:mm:ss)
//       const formattedDate = formatDateForBackend(donationData.donationDate);
//       console.log('API: Date formatted for backend:', formattedDate);

//       // FIXED: Prepare exact payload format that backend expects
//       const payload = {
//         donationDate: formattedDate, // Exact format: "2025-07-28T00:00:00"
//         location: donationData.location.trim(),
//         recipientContact: donationData.recipientContact?.trim() || '',
//         notes: donationData.notes?.trim() || '',
//         donor: { 
//           id: donorId  // Backend expects { id: number }
//         }
//       };

//       console.log('API: Final payload for backend:', JSON.stringify(payload, null, 2));
//       console.log('API: Making POST request to /donations');

//       const response = await api.post('/donations', payload);

//       console.log('API: Donation added successfully:', response.data);
//       return response.data || { success: true };
      
//     } catch (error: any) {
//       console.error('API: Failed to add donation:', error);
//       console.error('API: Error response data:', error.response?.data);
//       console.error('API: Error status:', error.response?.status);
//       console.error('API: Full error response:', error.response);
      
//       // Enhanced error handling
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       } else if (error.response?.data?.error) {
//         throw new Error(error.response.data.error);
//       } else if (error.response?.data && typeof error.response.data === 'string') {
//         throw new Error(error.response.data);
//       } else if (error.message) {
//         throw new Error(error.message);
//       } else {
//         throw new Error('Failed to add donation record. Please try again.');
//       }
//     }
//   },

//   // FIXED: Get donations with proper date parsing
//   getDonations: async (donorId?: number) => {
//     try {
//       // Auto-detect donor ID from token if not provided
//       let targetDonorId = donorId;
//       if (!targetDonorId) {
//         targetDonorId = apiService.getCurrentUserId();
//         if (!targetDonorId) {
//           throw new Error('Unable to determine donor ID. Please login again.');
//         }
//         console.log('API: Auto-detected donor ID from token:', targetDonorId);
//       }

//       console.log('API: Fetching donations for donor:', targetDonorId);
      
//       // Enhanced validation
//       if (!targetDonorId || typeof targetDonorId !== 'number' || targetDonorId <= 0) {
//         const error = `Invalid donor ID: ${targetDonorId}`;
//         console.error('API:', error);
//         throw new Error(error);
//       }

//       console.log('API: Making GET request to:', `/donations/${targetDonorId}`);
//       const response = await api.get(`/donations/${targetDonorId}`);
//       console.log('API: Raw donations from backend:', response.data);
      
//       // FIXED: Parse dates properly for frontend
//       const donations = (response.data || []).map((donation: any) => {
//         const processedDonation = {
//           ...donation,
//           // Parse backend date format for frontend display
//           donationDate: donation.donationDate ? parseDateFromBackend(donation.donationDate) : donation.donationDate,
//           // Keep original timestamp for sorting and other operations
//           donationTimestamp: donation.donationDate,
//           // Ensure proper ID formatting
//           id: donation.id?.toString() || Math.random().toString(),
//           donor: {
//             ...donation.donor,
//             id: donation.donor?.id?.toString() || targetDonorId.toString()
//           }
//         };
//         console.log('API: Processed donation:', processedDonation);
//         return processedDonation;
//       });
      
//       console.log('API: Final processed donations:', donations);
//       return donations;
      
//     } catch (error: any) {
//       console.error('API: Failed to fetch donations:', error);
//       console.error('API: Error response:', error.response?.data);
//       console.error('API: Error status:', error.response?.status);
      
//       // Handle specific error cases
//       if (error.response?.status === 404) {
//         console.log('API: No donations found for donor, returning empty array');
//         return []; // Return empty array instead of throwing error
//       } else if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       } else if (error.message) {
//         throw new Error(error.message);
//       } else {
//         throw new Error('Failed to fetch donation records');
//       }
//     }
//   },

//   // Get donation statistics with auto-detection and proper date handling
//   getDonationStats: async (donorId?: number) => {
//     try {
//       const targetDonorId = donorId || apiService.getCurrentUserId();
//       if (!targetDonorId) {
//         throw new Error('Unable to determine donor ID. Please login again.');
//       }

//       console.log('API: Fetching donation stats for donor:', targetDonorId);
      
//       const donations = await apiService.getDonations(targetDonorId);
      
//       const stats = {
//         totalDonations: donations.length,
//         lastDonationDate: donations.length > 0 
//           ? donations.sort((a: any, b: any) => {
//               // Use donationTimestamp for sorting if available, otherwise donationDate
//               const dateA = new Date(a.donationTimestamp || a.donationDate);
//               const dateB = new Date(b.donationTimestamp || b.donationDate);
//               return dateB.getTime() - dateA.getTime();
//             })[0].donationDate 
//           : null,
//         donationsThisYear: donations.filter((d: any) => {
//           const donationYear = new Date(d.donationTimestamp || d.donationDate).getFullYear();
//           return donationYear === new Date().getFullYear();
//         }).length
//       };
      
//       console.log('API: Donation stats calculated:', stats);
//       return stats;
//     } catch (error: any) {
//       console.error('API: Failed to calculate donation stats:', error);
//       throw error;
//     }
//   },

//   // Users
//   updateUser: async (id: number, user: User) => {
//     try {
//       console.log('API: Updating user:', id, user);
//       const response = await api.put(`/users/${id}`, user);
//       console.log('API: User updated successfully:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Failed to update user:', error);
//       throw error;
//     }
//   },

//   getUser: async (id: number) => {
//     try {
//       console.log('API: Fetching user:', id);
//       const response = await api.get(`/users/${id}`);
//       console.log('API: User fetched successfully:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Failed to fetch user:', error);
//       throw error;
//     }
//   },

//   // Get current user profile
//   getCurrentUserProfile: async () => {
//     try {
//       const userId = apiService.getCurrentUserId();
//       if (!userId) {
//         throw new Error('User not authenticated');
//       }
      
//       return await apiService.getUser(userId);
//     } catch (error: any) {
//       console.error('API: Failed to fetch current user profile:', error);
//       throw error;
//     }
//   },

//   // Admin
//   getAllUsers: async () => {
//     try {
//       console.log('API: Fetching all users');
//       const response = await api.get('/admin/users');
//       console.log('API: All users fetched successfully');
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Failed to fetch all users:', error);
//       throw error;
//     }
//   },

//   verifyUser: async (id: number) => {
//     try {
//       console.log('API: Verifying user:', id);
//       const response = await api.put(`/admin/verify/${id}`);
//       console.log('API: User verified successfully:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Failed to verify user:', error);
//       throw error;
//     }
//   },

//   disableUser: async (id: number) => {
//     try {
//       console.log('API: Disabling user:', id);
//       const response = await api.put(`/admin/disable/${id}`);
//       console.log('API: User disabled successfully:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Failed to disable user:', error);
//       throw error;
//     }
//   },

//   // Search
//   searchDonors: async (params: SearchParams) => {
//     try {
//       console.log('API: Searching donors with params:', params);
      
//       // Transform blood group to backend format if needed
//       const searchParams = {
//         ...params,
//         bloodGroup: params.bloodGroup ? bloodGroupMap[params.bloodGroup] || params.bloodGroup : undefined
//       };
      
//       const response = await api.get('/search', { params: searchParams });
//       console.log('API: Donor search completed successfully');
//       return response.data;
//     } catch (error: any) {
//       console.error('API: Failed to search donors:', error);
//       throw error;
//     }
//   },
// };
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { jwtUtils } from '../utils/jwtUtils';

// ------------------------
// Interfaces
// ------------------------
interface User {
  id?: string;
  name?: string;
  email: string;
  password: string;
  role?: string;
  bloodGroup?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
  isVerified?: boolean;
  registrationDate?: string;
}

interface DonationRecord {
  donationDate: string;
  location: string;
  notes?: string;
  recipientContact?: string;
  donor: { id: number };
}

interface SearchParams {
  bloodGroup?: string;
  division?: string;
  district?: string;
  upazila?: string;
}

// ------------------------
// Axios Instance with CORS fix
// ------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// ------------------------
// Token Interceptor
// ------------------------
api.interceptors.request.use((config) => {
  console.log('API: Making request to:', config.url);
  console.log('API: Request method:', config.method?.toUpperCase());
  console.log('API: Request data:', config.data);
  
  const token = localStorage.getItem("token");
  if (token) {
    if (jwtUtils.isTokenExpired()) {
      console.warn('Token expired, removing from storage');
      localStorage.removeItem('token');
      return Promise.reject(new Error('Token expired'));
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API: Added Authorization header');
  }
  
  return config;
});

// ------------------------
// Response Interceptor for Error Handling
// ------------------------
api.interceptors.response.use(
  (response) => {
    console.log('API: Response received:', response.status);
    console.log('API: Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('API Error Response:', error.response?.data);
    console.error('API Error Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      console.warn('Authentication failed, token removed');
    }
    
    return Promise.reject(error);
  }
);

// ------------------------
// Helper: bloodGroup mapping
// ------------------------
const bloodGroupToEnumMap: Record<string, string> = {
  "A+": "A_PLUS",
  "A-": "A_NEG",
  "B+": "B_PLUS",
  "B-": "B_NEG",
  "AB+": "AB_PLUS",
  "AB-": "AB_NEG",
  "O+": "O_PLUS",
  "O-": "O_NEG",
};
const bloodGroupFromEnumMap: Record<string, string> = {
  "A_PLUS": "A+",
  "A_NEG": "A-",
  "B_PLUS": "B+", 
  "B_NEG": "B-",
  "AB_PLUS": "AB+",
  "AB_NEG": "AB-",
  "O_PLUS": "O+",
  "O_NEG": "O-",
};

// ------------------------
// Date formatting function for backend
// ------------------------
const formatDateForBackend = (dateString: string): string => {
  try {
    console.log('API: Formatting date:', dateString);
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      console.log('API: Date already in correct format:', dateString);
      return dateString;
    }
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const formattedDate = dateString + 'T00:00:00';
      console.log('API: Added time to date:', formattedDate);
      return formattedDate;
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}T00:00:00`;
    console.log('API: Converted date to backend format:', formattedDate);
    return formattedDate;
  } catch (error) {
    console.error('API: Date formatting error:', error);
    throw new Error(`Invalid date format: ${dateString}`);
  }
};

// ------------------------
// Date parsing from backend
// ------------------------
const parseDateFromBackend = (dateString: string): string => {
  try {
    if (!dateString) return dateString;
    
    console.log('API: Parsing backend date:', dateString);
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}T/)) {
      const datePart = dateString.split('T')[0];
      console.log('API: Extracted date part:', datePart);
      return datePart;
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('API: Could not parse date, returning original:', dateString);
      return dateString;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    console.log('API: Parsed date for frontend:', formattedDate);
    return formattedDate;
  } catch (error) {
    console.error('API: Date parsing error:', error);
    return dateString;
  }
};

// ------------------------
// API Service
// ------------------------
export const apiService = {
  getCurrentUser: () => {
    return jwtUtils.getTokenInfo();
  },

  getCurrentUserId: (): number | null => {
    const userId = jwtUtils.getUserId();
    return userId ? parseInt(userId, 10) : null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return token !== null && !jwtUtils.isTokenExpired();
  },

  register: async (userData: any) => {
    try {
      console.log('API: Sending registration data:', userData);

      const response = await api.post('/auth/register', {
        name: userData.fullName,
        email: userData.email,
        passwordHash: userData.password,
        phone: userData.phone,
        division: userData.division,
        district: userData.district,
        upazila: userData.upazila,
        address: userData.address || '',
         bloodGroup: bloodGroupToEnumMap[userData.bloodGroup] || userData.bloodGroup,
      });

      console.log('API: Registration response:', response);
      return response.data;
    } catch (error: any) {
      console.error('API: Registration error:', error);
      throw error;
    }
  },

  login: async (user: User) => {
    try {
      console.log('API: Sending login request:', { email: user.email });

      const response = await api.post('/auth/login', {
        email: user.email,
        passwordHash: user.password,
      });

      console.log('API: Login response:', response);

      const authHeader =
        response.headers['authorization'] ||
        response.headers['Authorization'] ||
        response.headers['AUTHORIZATION'];

      console.log('API: Found auth header:', authHeader);

      const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

      if (token) {
        localStorage.setItem('token', token);
        console.log('API: Token saved successfully');
        
        const tokenInfo = jwtUtils.getTokenInfo();
        console.log('API: Decoded token info:', tokenInfo);
      } else {
        console.warn('API: Authorization token not found in headers');
      }

      return response.data;
    } catch (error: any) {
      console.error('API: Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    console.log('API: User logged out, token removed');
  },

  addDonation: async (donationData: {
    donationDate: string;
    location: string;
    notes?: string;
    recipientContact?: string;
  }) => {
    try {
      console.log('API: Adding donation record - Raw input:', donationData);
      
      const donorId = apiService.getCurrentUserId();
      if (!donorId) {
        throw new Error('Unable to determine donor ID. Please login again.');
      }
      console.log('API: Auto-detected donor ID from token:', donorId);

      if (typeof donorId !== 'number' || donorId <= 0) {
        const error = `Invalid donor ID: ${donorId}`;
        console.error('API:', error);
        throw new Error(error);
      }

      if (!donationData.donationDate) {
        const error = 'Donation date is required';
        console.error('API:', error);
        throw new Error(error);
      }

      if (!donationData.location || donationData.location.trim() === '') {
        const error = 'Location is required';
        console.error('API:', error);
        throw new Error(error);
      }

      const formattedDate = formatDateForBackend(donationData.donationDate);
      console.log('API: Date formatted for backend:', formattedDate);

      const payload = {
        donationDate: formattedDate,
        location: donationData.location.trim(),
        recipientContact: donationData.recipientContact?.trim() || '',
        notes: donationData.notes?.trim() || '',
        donor: { id: donorId }
      };

      console.log('API: Final payload for backend:', JSON.stringify(payload, null, 2));
      console.log('API: Making POST request to /donations');

      const response = await api.post('/donations', payload);

      console.log('API: Donation added successfully:', response.data);
      return response.data || { success: true };
    } catch (error: any) {
      console.error('API: Failed to add donation:', error);
      console.error('API: Error response data:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      console.error('API: Full error response:', error.response);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data && typeof error.response.data === 'string') {
        throw new Error(error.response.data);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to add donation record. Please try again.');
      }
    }
  },

  getDonations: async (donorId?: number) => {
    try {
      let targetDonorId = donorId;
      if (!targetDonorId) {
        targetDonorId = apiService.getCurrentUserId();
        if (!targetDonorId) {
          throw new Error('Unable to determine donor ID. Please login again.');
        }
        console.log('API: Auto-detected donor ID from token:', targetDonorId);
      }

      console.log('API: Fetching donations for donor:', targetDonorId);
      
      if (!targetDonorId || typeof targetDonorId !== 'number' || targetDonorId <= 0) {
        const error = `Invalid donor ID: ${targetDonorId}`;
        console.error('API:', error);
        throw new Error(error);
      }

      console.log('API: Making GET request to:', `/donations/${targetDonorId}`);
      const response = await api.get(`/donations/${targetDonorId}`);
      console.log('API: Raw donations from backend:', response.data);
      
      const donations = (response.data || []).map((donation: any) => {
        const processedDonation = {
          ...donation,
          donationDate: donation.donationDate ? parseDateFromBackend(donation.donationDate) : donation.donationDate,
          donationTimestamp: donation.donationDate,
          id: donation.id?.toString() || Math.random().toString(),
          donor: {
            ...donation.donor,
            id: donation.donor?.id?.toString() || targetDonorId.toString()
          }
        };
        console.log('API: Processed donation:', processedDonation);
        return processedDonation;
      });
      
      console.log('API: Final processed donations:', donations);
      return donations;
    } catch (error: any) {
      console.error('API: Failed to fetch donations:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      
      if (error.response?.status === 404) {
        console.log('API: No donations found for donor, returning empty array');
        return [];
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch donation records');
      }
    }
  },

  getDonationStats: async (donorId?: number) => {
    try {
      const targetDonorId = donorId || apiService.getCurrentUserId();
      if (!targetDonorId) {
        throw new Error('Unable to determine donor ID. Please login again.');
      }

      console.log('API: Fetching donation stats for donor:', targetDonorId);
      
      const donations = await apiService.getDonations(targetDonorId);
      
      const stats = {
        totalDonations: donations.length,
        lastDonationDate: donations.length > 0 
          ? donations.sort((a: any, b: any) => {
              const dateA = new Date(a.donationTimestamp || a.donationDate);
              const dateB = new Date(b.donationTimestamp || b.donationDate);
              return dateB.getTime() - dateA.getTime();
            })[0].donationDate 
          : null,
        donationsThisYear: donations.filter((d: any) => {
          const donationYear = new Date(d.donationTimestamp || d.donationDate).getFullYear();
          return donationYear === new Date().getFullYear();
        }).length
      };
      
      console.log('API: Donation stats calculated:', stats);
      return stats;
    } catch (error: any) {
      console.error('API: Failed to calculate donation stats:', error);
      throw error;
    }
  },

  updateUser: async (id: number, user: User) => {
    try {
      console.log('API: Updating user:', id, user);
      const response = await api.put(`/users/${id}`, user);
      console.log('API: User updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Failed to update user:', error);
      throw error;
    }
  },

  getUser: async (id: number) => {
    try {
      console.log('API: Fetching user:', id);
      const response = await api.get(`/users/${id}`);
      console.log('API: User fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Failed to fetch user:', error);
      throw error;
    }
  },

  getCurrentUserProfile: async () => {
    try {
      const userId = apiService.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      return await apiService.getUser(userId);
    } catch (error: any) {
      console.error('API: Failed to fetch current user profile:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      console.log('API: Fetching all users');
      const response = await api.get('/admin/users');
      console.log('API: All users fetched successfully:', response.data);
      return response.data.map((user: any) => ({
        ...user,
        id: user.id.toString(),
        registrationDate: parseDateFromBackend(user.registrationDate)
      }));
    } catch (error: any) {
      console.error('API: Failed to fetch all users:', error);
      throw error;
    }
  },

  verifyUser: async (id: number) => {
    try {
      console.log('API: Verifying user:', id);
      const response = await api.put(`/admin/verify/${id}`);
      console.log('API: User verified successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Failed to verify user:', error);
      throw error;
    }
  },

  disableUser: async (id: number) => {
    try {
      console.log('API: Disabling user:', id);
      const response = await api.put(`/admin/disable/${id}`);
      console.log('API: User disabled successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Failed to disable user:', error);
      throw error;
    }
  },

  searchDonors: async (params: SearchParams) => {
    try {
      console.log('API: Searching donors with params:', params);
      
      const searchParams = {
       bloodGroup: params.bloodGroup, // Send display format directly (O-, A+)
        division: params.division,
        district: params.district,
        upazila: params.upazila
      };
      
       const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== undefined && v !== '')
      );
      
      console.log('API: Cleaned search params for backend:', cleanParams);
      console.log('API: Making GET request to /search with params:', cleanParams);
      
      const response = await api.get('/search', { params: cleanParams });
      console.log('API: Search response received:', response.data);
      
      // Transform backend response - convert blood groups from enum to display format
      const transformedResults = (response.data || []).map((donor: any) => ({
        ...donor,
        // Convert enum format (O_NEG, A_PLUS) back to display format (O-, A+) 
        bloodGroup: bloodGroupFromEnumMap[donor.bloodGroup] || donor.bloodGroup
      }));
      
      console.log('API: Donor search completed successfully, transformed results:', transformedResults);
      return transformedResults;
    } catch (error: any) {
      console.error('API: Failed to search donors:', error);
      console.error('API: Search error response:', error.response?.data);
      console.error('API: Search error status:', error.response?.status);
      
      // Enhanced error handling for search
      if (error.response?.status === 404) {
        console.log('API: No donors found, returning empty array');
        return []; // Return empty array for 404 instead of throwing
      }
      
      throw error;
    }
  },
};
// import axios from 'axios';
// import { API_BASE_URL } from '../config/apiConfig';

// // ------------------------
// // Interfaces
// // ------------------------
// interface User {
//   email: string;
//   password: string;
// }

// interface DonationRecord {
//   donorId: number;
// }

// interface SearchParams {
//   bloodGroup?: string;
//   division?: string;
//   district?: string;
//   upazila?: string;
// }

// // ------------------------
// // Axios Instance
// // ------------------------
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // ------------------------
// // Token Interceptor
// // ------------------------
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

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
// // API Service
// // ------------------------
// export const apiService = {
//   // Auth
//   register: async (userData: any) => {
//     try {
//       console.log('Sending registration data:', userData);

//       const response = await api.post('/auth/register', {
//         name: userData.fullName,
//         email: userData.email,
//         passwordHash: userData.password, // ✅ Fixed: camelCase 'H'
//         phone: userData.phone,
//         division: userData.division,
//         district: userData.district,
//         upazila: userData.upazila,
//         address: userData.address || '', // ✅ Added address field
//         bloodGroup: bloodGroupMap[userData.bloodGroup] || userData.bloodGroup,
//       });

//       console.log('Registration response:', response);
//       return response.data;
//     } catch (error: any) {
//       console.error('Registration API error:', error);
//       throw error;
//     }
//   },

//   login: async (user: User) => {
//     try {
//       console.log('Sending login request:', { email: user.email, passwordHash: user.password });

//       const response = await api.post('/auth/login', {
//         email: user.email,
//         passwordHash: user.password,
//       });

//       console.log('Login response:', response);

//       const authHeader =
//         response.headers['authorization'] ||
//         response.headers['Authorization'] ||
//         response.headers['AUTHORIZATION'];

//       console.log('Found auth header:', authHeader);

//       const token = authHeader?.startsWith('Bearer ')
//         ? authHeader.split(' ')[1]
//         : null;

//       if (token) {
//         localStorage.setItem('token', token);
//         console.log('Token saved successfully:', token);
//       } else {
//         console.warn('Authorization token not found in headers');
//       }

//       return response.data;
//     } catch (error: any) {
//       console.error('Login error details:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//   },

//   // Donations
//   addDonation: async (record: DonationRecord) => {
//     const response = await api.post('/donations', record);
//     return response.data;
//   },

//   getDonations: async (donorId: number) => {
//     const response = await api.get(`/donations/${donorId}`);
//     return response.data;
//   },

//   // Users
//   updateUser: async (id: number, user: User) => {
//     const response = await api.put(`/users/${id}`, user);
//     return response.data;
//   },

//   getUser: async (id: number) => {
//     const response = await api.get(`/users/${id}`);
//     return response.data;
//   },

//   // Admin
//   getAllUsers: async () => {
//     const response = await api.get('/admin/users');
//     return response.data;
//   },

//   verifyUser: async (id: number) => {
//     const response = await api.put(`/admin/verify/${id}`);
//     return response.data;
//   },

//   disableUser: async (id: number) => {
//     const response = await api.put(`/admin/disable/${id}`);
//     return response.data;
//   },

//   // Search
//   searchDonors: async (params: SearchParams) => {
//     const response = await api.get('/search', { params });
//     return response.data;
//   },
// };

import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// ------------------------
// Interfaces
// ------------------------
interface User {
  email: string;
  password: string;
}

interface DonationRecord {
  donor: { id: number };
  donationDate: string;
  location: string;
  notes?: string;
  recipientContact?: string;
}

interface SearchParams {
  bloodGroup?: string;
  division?: string;
  district?: string;
  upazila?: string;
}

// ------------------------
// Axios Instance
// ------------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ------------------------
// Token Interceptor
// ------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------
// Response Interceptor for Error Handling
// ------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ------------------------
// Helper: bloodGroup mapping
// ------------------------
const bloodGroupMap: Record<string, string> = {
  "A+": "A_PLUS",
  "A-": "A_NEG",
  "B+": "B_PLUS",
  "B-": "B_NEG",
  "AB+": "AB_PLUS",
  "AB-": "AB_NEG",
  "O+": "O_PLUS",
  "O-": "O_NEG",
};

// ------------------------
// API Service
// ------------------------
export const apiService = {
  // Auth
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
        bloodGroup: bloodGroupMap[userData.bloodGroup] || userData.bloodGroup,
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
  },

  // ✅ FIXED: Enhanced Donations with better validation
  addDonation: async (record: DonationRecord) => {
    try {
      console.log('API: Adding donation record:', record);
      
      // ✅ Enhanced validation
      if (!record.donor || !record.donor.id) {
        const error = 'Donor information is required';
        console.error('API:', error);
        throw new Error(error);
      }

      if (typeof record.donor.id !== 'number' || record.donor.id <= 0) {
        const error = `Invalid donor ID: ${record.donor.id}`;
        console.error('API:', error);
        throw new Error(error);
      }

      if (!record.donationDate) {
        const error = 'Donation date is required';
        console.error('API:', error);
        throw new Error(error);
      }

      if (!record.location || record.location.trim() === '') {
        const error = 'Location is required';
        console.error('API:', error);
        throw new Error(error);
      }

      // ✅ Validate date format
      const donationDate = new Date(record.donationDate);
      if (isNaN(donationDate.getTime())) {
        const error = 'Invalid donation date format';
        console.error('API:', error);
        throw new Error(error);
      }

      // ✅ Prepare request payload - match your Java backend exactly
      const payload = {
        donor: { 
          id: Number(record.donor.id) // ✅ Ensure it's a number
        },
        donationDate: record.donationDate, // Backend expects ISO string
        location: record.location.trim(),
        notes: record.notes?.trim() || '',
        recipientContact: record.recipientContact?.trim() || ''
      };

      console.log('API: Sending payload to backend:', payload);

      const response = await api.post('/donations', payload);

      console.log('API: Donation added successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Failed to add donation:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      
      // Enhanced error handling
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data) {
        throw new Error(JSON.stringify(error.response.data));
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to add donation record');
      }
    }
  },

  getDonations: async (donorId: number) => {
    try {
      console.log('API: Fetching donations for donor:', donorId);
      
      // ✅ Enhanced validation
      if (!donorId || typeof donorId !== 'number' || donorId <= 0) {
        const error = `Invalid donor ID: ${donorId}`;
        console.error('API:', error);
        throw new Error(error);
      }

      console.log('API: Making GET request to:', `/donations/${donorId}`);
      const response = await api.get(`/donations/${donorId}`);
      console.log('API: Donations fetched successfully:', response.data);
      
      return response.data || []; // Ensure we return an array
    } catch (error: any) {
      console.error('API: Failed to fetch donations:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        console.log('API: No donations found for donor, returning empty array');
        return []; // Return empty array instead of throwing error
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch donation records');
      }
    }
  },

  // ✅ NEW: Get donation statistics
  getDonationStats: async (donorId: number) => {
    try {
      console.log('API: Fetching donation stats for donor:', donorId);
      
      const donations = await apiService.getDonations(donorId);
      
      const stats = {
        totalDonations: donations.length,
        lastDonationDate: donations.length > 0 
          ? donations.sort((a: any, b: any) => 
              new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
            )[0].donationDate 
          : null,
        donationsThisYear: donations.filter((d: any) => 
          new Date(d.donationDate).getFullYear() === new Date().getFullYear()
        ).length
      };
      
      console.log('API: Donation stats calculated:', stats);
      return stats;
    } catch (error: any) {
      console.error('API: Failed to calculate donation stats:', error);
      throw error;
    }
  },

  // Users
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

  // Admin
  getAllUsers: async () => {
    try {
      console.log('API: Fetching all users');
      const response = await api.get('/admin/users');
      console.log('API: All users fetched successfully');
      return response.data;
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

  // Search
  searchDonors: async (params: SearchParams) => {
    try {
      console.log('API: Searching donors with params:', params);
      
      // Transform blood group to backend format if needed
      const searchParams = {
        ...params,
        bloodGroup: params.bloodGroup ? bloodGroupMap[params.bloodGroup] || params.bloodGroup : undefined
      };
      
      const response = await api.get('/search', { params: searchParams });
      console.log('API: Donor search completed successfully');
      return response.data;
    } catch (error: any) {
      console.error('API: Failed to search donors:', error);
      throw error;
    }
  },
};
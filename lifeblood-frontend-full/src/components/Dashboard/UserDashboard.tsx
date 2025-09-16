// import React, { useState, useEffect } from 'react';
// import { User, Heart, Clock, MapPin, Calendar, Plus, Edit, Check } from 'lucide-react';
// import { User as UserType, DonationRecord } from '../../types';
// import { dateUtils } from '../../utils/dateUtils';
// import { apiService } from '../../services/apiService';
// import { jwtUtils } from '../../utils/jwtUtils';

// interface UserDashboardProps {
//   user: UserType;
//   onUpdateUser: (user: UserType) => void;
// }

// export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateUser }) => {
//   const [donations, setDonations] = useState<DonationRecord[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [showAddDonation, setShowAddDonation] = useState(false);
//   const [newDonation, setNewDonation] = useState({
//     date: new Date().toISOString().split('T')[0],
//     location: '',
//     notes: '',
//     recipientContact: ''
//   });

//   // Check authentication status on component mount
//   useEffect(() => {
//     console.log('Dashboard: Component mounted, checking authentication...');
//     console.log('Dashboard: User prop:', user);
    
//     // Check if user is authenticated
//     if (!apiService.isAuthenticated()) {
//       setError('Session expired. Please login again.');
//       return;
//     }

//     // Load donations for donors
//     if (user.role === 'donor') {
//       loadDonations();
//     }
//   }, [user.id, user.role]);

//   // Auto-clear success messages
//   useEffect(() => {
//     if (success) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//       }, 5000); // Clear success message after 5 seconds
      
//       return () => clearTimeout(timer);
//     }
//   }, [success]);

//   const loadDonations = async () => {
//   try {
//     setLoading(true);
//     setError(null);
    
//     console.log('Dashboard: Loading donations...');
    
//     const donationsData = await apiService.getDonations();
    
//     console.log('=== BACKEND DONATIONS DATA ===');
//     console.log('Raw donations data from API:', donationsData);
    
//     // Log each donation individually
//     donationsData.forEach((donation: any, index: number) => {
//       console.log(`Donation ${index + 1}:`, {
//         id: donation.id,
//         donationDate: donation.donationDate,
//         donationDateType: typeof donation.donationDate,
//         createdAt: donation.createdAt,
//         location: donation.location,
//         donor: donation.donor
//       });
//     });
    
//     // Transform backend data to frontend format
//     const transformedDonations = donationsData.map((donation: any) => ({
//       id: donation.id?.toString() || Math.random().toString(),
//       donorId: donation.donor?.id?.toString() || user.id,
//       donationDate: donation.donationDate,
//       location: donation.location,
//       notes: donation.notes || '',
//       recipientContact: donation.recipientContact || '',
//       createdAt: donation.createdAt || donation.donationTimestamp || donation.donationDate
//     }));
    
//     console.log('Transformed donations:', transformedDonations);
    
//     setDonations(transformedDonations);
    
//     // Check if user.lastDonationDate needs updating
//     if (transformedDonations.length > 0) {
//       const mostRecent = transformedDonations.reduce((latest, current) => {
//         return new Date(current.donationDate) > new Date(latest.donationDate) ? current : latest;
//       });
      
//       console.log('Most recent donation date:', mostRecent.donationDate);
//       console.log('User lastDonationDate:', user.lastDonationDate);
      
//       if (user.lastDonationDate !== mostRecent.donationDate) {
//         console.log('⚠️ User lastDonationDate is outdated, should be updated!');
//       }
//     }
    
//     console.log('=== END BACKEND DATA ===');
    
//   } catch (err: any) {
//     // ... rest of error handling
//   } finally {
//     setLoading(false);
//   }
// };

  

//   const handleAddDonation = async () => {
//     console.log('Dashboard: handleAddDonation called with:', newDonation);
    
//     // Clear previous messages
//     setError(null);
//     setSuccess(null);
    
//     // Validate input
//     if (!newDonation.date || !newDonation.location?.trim()) {
//       setError('Please fill in date and location fields');
//       return;
//     }

//     // Validate date is not in future
//     const selectedDate = new Date(newDonation.date);
//     const today = new Date();
//     today.setHours(23, 59, 59, 999); // Set to end of today
    
//     if (selectedDate > today) {
//       setError('Donation date cannot be in the future');
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log('Dashboard: Adding donation...');
//       console.log('Dashboard: Current user:', user);
      
//       // Prepare donation data
//       const donationData = {
//         donationDate: newDonation.date, // Will be formatted by apiService
//         location: newDonation.location.trim(),
//         notes: newDonation.notes?.trim() || '',
//         recipientContact: newDonation.recipientContact?.trim() || ''
//       };
      
//       console.log('Dashboard: Sending donation data:', donationData);
      
//       // Use our JWT-based API service
//       const addedDonation = await apiService.addDonation(donationData);

//       console.log('Dashboard: Donation added successfully:', addedDonation);
      
//       // Show success message
//       setSuccess('Donation record added successfully!');
      
//       // Update user's last donation date and availability
//       const updatedUser: UserType = {
//         ...user,
//         lastDonationDate: newDonation.date,
//         isAvailable: false
//       };

//       onUpdateUser(updatedUser);

//       // Reload donations from backend
//       await loadDonations();

//       // Reset form
//       setShowAddDonation(false);
//       setNewDonation({ 
//         date: new Date().toISOString().split('T')[0], 
//         location: '', 
//         notes: '',
//         recipientContact: ''
//       });
      
//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to add donation';
//       setError(errorMessage);
//       console.error('Dashboard: Error adding donation:', err);
      
//       // Handle authentication errors
//       if (errorMessage.includes('authenticated') || errorMessage.includes('token')) {
//         setTimeout(() => {
//           window.location.href = '/login';
//         }, 3000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

// const getAvailabilityStatus = () => {
//   if (user.role !== 'donor') return null;
  
//   console.log('=== AVAILABILITY STATUS DEBUG ===');
//   console.log('User lastDonationDate:', user.lastDonationDate);
  
//   // Get the actual most recent donation from the donations array
//   let actualLastDonationDate = null;
  
//   if (donations && donations.length > 0) {
//     const sortedDonations = [...donations].sort((a, b) => 
//       new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
//     );
//     actualLastDonationDate = sortedDonations[0].donationDate;
//     console.log('Actual most recent donation date:', actualLastDonationDate);
//   }
  
//   // Use the actual last donation date from donations array, fallback to user.lastDonationDate
//   const lastDonationToUse = actualLastDonationDate || user.lastDonationDate;
  
//   if (!lastDonationToUse) {
//     console.log('No last donation date - returning available');
//     return { status: 'available', message: 'Ready to donate', color: 'green' };
//   }

//   // Clean the date string - remove [UTC] suffix if present
//   const cleanedDate = lastDonationToUse.replace(/\[UTC\]$/, '');
//   console.log('Cleaned date:', cleanedDate);
  
//   const lastDonationDate = new Date(cleanedDate);
//   console.log('Parsed date after cleaning:', lastDonationDate);
//   console.log('Is valid date:', !isNaN(lastDonationDate.getTime()));
  
//   if (isNaN(lastDonationDate.getTime())) {
//     return { status: 'available', message: 'Ready to donate', color: 'green' };
//   }
  
//   // Check using dateUtils with cleaned date
//   const isAvailable = dateUtils.isDonorAvailable(lastDonationToUse);
//   const daysLeft = dateUtils.getDaysUntilAvailable(lastDonationToUse);
  
//   console.log('dateUtils.isDonorAvailable result:', isAvailable);
//   console.log('dateUtils.getDaysUntilAvailable result:', daysLeft);
//   console.log('=== END DEBUG ===');
  
//   if (isAvailable) {
//     return { status: 'available', message: 'Ready to donate', color: 'green' };
//   } else {
//     return { 
//       status: 'unavailable', 
//       message: `Available in ${daysLeft} days`, 
//       color: 'red' 
//     };
//   }
// };
//   // Get current user info from JWT token
//   const getCurrentUserFromToken = () => {
//     const tokenInfo = jwtUtils.getTokenInfo();
//     return tokenInfo;
//   };

//   const availabilityStatus = getAvailabilityStatus();
//   const tokenInfo = getCurrentUserFromToken();

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Welcome back, {user.name}!
//         </h1>
//         <p className="mt-2 text-lg text-gray-600">
//           {user.role === 'donor' ? 'Thank you for being a life saver' : 'Find the help you need'}
//         </p>
        
//         {/* Debug info (only in development) */}
//         {process.env.NODE_ENV === 'development' && tokenInfo && (
//           <div className="mt-2 text-xs text-gray-500">
//             User ID from token: {tokenInfo.userId} | Role: {tokenInfo.role}
//           </div>
//         )}
//       </div>

//       {/* Success Message */}
//       {success && (
//         <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
//           <div className="flex">
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-green-800">Success</h3>
//               <div className="mt-2 text-sm text-green-700">
//                 {success}
//               </div>
//               <div className="mt-2">
//                 <button
//                   onClick={() => setSuccess(null)}
//                   className="text-sm text-green-600 hover:text-green-500 underline"
//                 >
//                   Dismiss
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
//           <div className="flex">
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Error</h3>
//               <div className="mt-2 text-sm text-red-700">
//                 {error}
//               </div>
//               <div className="mt-2 flex space-x-2">
//                 <button
//                   onClick={() => setError(null)}
//                   className="text-sm text-red-600 hover:text-red-500 underline"
//                 >
//                   Dismiss
//                 </button>
//                 {/* Add retry button for loading errors */}
//                 {error.includes('Failed to load') && (
//                   <button
//                     onClick={loadDonations}
//                     disabled={loading}
//                     className="text-sm text-red-600 hover:text-red-500 underline disabled:text-red-400"
//                   >
//                     {loading ? 'Retrying...' : 'Retry'}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Profile Card */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex items-center space-x-4 mb-6">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//               <User className="h-8 w-8 text-red-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
//               <p className="text-gray-600">{user.email}</p>
//               <div className="flex items-center space-x-2 mt-1">
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                   {user.bloodGroup}
//                 </span>
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   user.role === 'donor' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
//                 }`}>
//                   {user.role === 'donor' ? 'Donor' : 'Recipient'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center text-sm text-gray-600">
//             <MapPin className="h-4 w-4 mr-2" />
//             <span>
//               {user.upazila && user.district && user.division 
//                 ? `${user.upazila}, ${user.district}, ${user.division}` 
//                 : 'Location not provided'
//               }
//             </span>
//           </div>

//           {availabilityStatus && (
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-700">Donation Status</span>
//                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   availabilityStatus.color === 'green' 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {availabilityStatus.message}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-8">
//           {user.role === 'donor' && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Donation History
//                   {donations.length > 0 && (
//                     <span className="ml-2 text-sm text-gray-500">
//                       ({donations.length} donation{donations.length !== 1 ? 's' : ''})
//                     </span>
//                   )}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     console.log('Dashboard: Add donation button clicked');
//                     setShowAddDonation(true);
//                     setError(null);
//                     setSuccess(null);
//                   }}
//                   disabled={loading}
//                   className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Donation
//                 </button>
//               </div>

//               {showAddDonation && (
//                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                   <h4 className="font-medium text-gray-900 mb-4">Record New Donation</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Donation Date *
//                       </label>
//                       <input
//                         type="date"
//                         value={newDonation.date}
//                         onChange={(e) => {
//                           console.log('Dashboard: Date changed to:', e.target.value);
//                           setNewDonation(prev => ({ ...prev, date: e.target.value }));
//                           setError(null); // Clear error when user makes changes
//                         }}
//                         className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         required
//                         max={new Date().toISOString().split('T')[0]} // Can't select future dates
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Location *
//                       </label>
//                       <input
//                         type="text"
//                         value={newDonation.location}
//                         onChange={(e) => {
//                           console.log('Dashboard: Location changed to:', e.target.value);
//                           setNewDonation(prev => ({ ...prev, location: e.target.value }));
//                           setError(null); // Clear error when user makes changes
//                         }}
//                         placeholder="Hospital/Blood Bank name"
//                         className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Recipient Contact
//                     </label>
//                     <input
//                       type="text"
//                       value={newDonation.recipientContact}
//                       onChange={(e) => setNewDonation(prev => ({ ...prev, recipientContact: e.target.value }))}
//                       placeholder="Phone number or email"
//                       className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                     />
//                   </div>
//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Notes (Optional)
//                     </label>
//                     <textarea
//                       value={newDonation.notes}
//                       onChange={(e) => setNewDonation(prev => ({ ...prev, notes: e.target.value }))}
//                       rows={2}
//                       className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                       placeholder="Any additional notes..."
//                     />
//                   </div>
//                   <div className="flex space-x-3 mt-4">
//                     <button
//                       onClick={() => {
//                         console.log('Dashboard: Save donation button clicked');
//                         handleAddDonation();
//                       }}
//                       disabled={loading || !newDonation.date || !newDonation.location?.trim()}
//                       className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Check className="h-4 w-4 mr-2" />
//                           Save Donation
//                         </>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => {
//                         console.log('Dashboard: Cancel button clicked');
//                         setShowAddDonation(false);
//                         setError(null);
//                         setSuccess(null);
//                         setNewDonation({ 
//                           date: new Date().toISOString().split('T')[0], 
//                           location: '', 
//                           notes: '',
//                           recipientContact: ''
//                         });
//                       }}
//                       disabled={loading}
//                       className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {loading && !showAddDonation && (
//                 <div className="text-center py-8">
//                   <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
//                   <p className="text-gray-500">Loading donations...</p>
//                 </div>
//               )}

//               {!loading && donations.length === 0 ? (
//                 <div className="text-center py-8">
//                   <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h4 className="text-lg font-medium text-gray-900 mb-2">
//                     No donations recorded yet
//                   </h4>
//                   <p className="text-gray-500">
//                     Start saving lives by recording your first donation!
//                   </p>
//                 </div>
//               ) : !loading && (
//                 <div className="space-y-4">
//                   {donations
//                     .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
//                     .map((donation) => (
//                     <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-4">
//                             <span className="font-medium text-gray-900">
//                               {dateUtils.formatDate(donation.donationDate)}
//                             </span>
//                             <span className="text-gray-600">{donation.location}</span>
//                           </div>
//                           {donation.recipientContact && (
//                             <p className="text-sm text-gray-500 mt-1">
//                               <span className="font-medium">Contact:</span> {donation.recipientContact}
//                             </p>
//                           )}
//                           {donation.notes && (
//                             <p className="text-sm text-gray-500 mt-1">
//                               <span className="font-medium">Notes:</span> {donation.notes}
//                             </p>
//                           )}
//                           <p className="text-xs text-gray-400 mt-1">
//                             Recorded on {dateUtils.formatDate(donation.createdAt || donation.donationDate)}
//                           </p>
//                         </div>
//                         <div className="flex items-center text-red-600">
//                           <Heart className="h-5 w-5 fill-current" />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Donation Statistics */}
//           {user.role === 'donor' && donations.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Donation Statistics
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-red-50 rounded-lg">
//                   <div className="text-2xl font-bold text-red-600">{donations.length}</div>
//                   <div className="text-sm text-gray-600">Total Donations</div>
//                 </div>
//                 <div className="text-center p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">
//                     {donations.filter(d => 
//                       new Date(d.donationDate).getFullYear() === new Date().getFullYear()
//                     ).length}
//                   </div>
//                   <div className="text-sm text-gray-600">This Year</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded-lg">
//                   <div className="text-2xl font-bold text-green-600">
//                     {user.lastDonationDate ? 
//                       dateUtils.getDaysUntilAvailable(user.lastDonationDate) > 0 ? 
//                         `${dateUtils.getDaysUntilAvailable(user.lastDonationDate)} days` : 
//                         'Available' : 
//                       'Available'
//                     }
//                   </div>
//                   <div className="text-sm text-gray-600">Next Eligible</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Search History */}
//           {user.searchHistory && user.searchHistory.length > 0 && (
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">
//                 Recent Searches
//               </h3>
//               <div className="space-y-4">
//                 {user.searchHistory.slice(-5).reverse().map((search) => (
//                   <div key={search.id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="flex items-center space-x-4">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                             {search.bloodGroup}
//                           </span>
//                           <span className="text-gray-600">{search.location}</span>
//                         </div>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {search.resultsCount} donors found
//                         </p>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {dateUtils.formatDate(search.timestamp)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { User, Heart, Clock, MapPin, Calendar, Plus, Edit, Check, AlertTriangle } from 'lucide-react';
import { User as UserType, DonationRecord } from '../../types';
import { dateUtils } from '../../utils/dateUtils';
import { apiService } from '../../services/apiService';
import { jwtUtils } from '../../utils/jwtUtils';

interface UserDashboardProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateUser }) => {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [newDonation, setNewDonation] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    notes: '',
    recipientContact: ''
  });

  // Get current user info from JWT token
  const getCurrentUserFromToken = () => {
    const tokenInfo = jwtUtils.getTokenInfo();
    return tokenInfo;
  };

  // Check for role mismatch between JWT and user prop
  const tokenInfo = getCurrentUserFromToken();
  const hasRoleMismatch = tokenInfo && user && tokenInfo.role !== user.role;

  // Use JWT role if there's a mismatch (JWT is more authoritative)
  const effectiveRole = hasRoleMismatch ? tokenInfo.role : user.role;
  const effectiveUser = hasRoleMismatch ? { ...user, role: tokenInfo.role } : user;

  // Check authentication status on component mount
  useEffect(() => {
    console.log('Dashboard: Component mounted, checking authentication...');
    console.log('Dashboard: User prop:', user);
    console.log('Dashboard: Token info:', tokenInfo);
    
    if (hasRoleMismatch) {
      console.log('⚠️ Role mismatch detected!');
      console.log('User prop role:', user.role);
      console.log('JWT token role:', tokenInfo.role);
      
      // Update the user object with correct role from JWT
      const correctedUser = { ...user, role: tokenInfo.role };
      onUpdateUser(correctedUser);
    }
    
    // Check if user is authenticated
    if (!apiService.isAuthenticated()) {
      setError('Session expired. Please login again.');
      return;
    }

    // Load donations for donors (use effective role)
    if (effectiveRole === 'donor') {
      loadDonations();
    }
  }, [user.id, effectiveRole, hasRoleMismatch]);

  // Auto-clear success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Dashboard: Loading donations...');
      
      const donationsData = await apiService.getDonations();
      
      console.log('=== BACKEND DONATIONS DATA ===');
      console.log('Raw donations data from API:', donationsData);
      
      // Transform backend data to frontend format
      const transformedDonations = donationsData.map((donation: any) => ({
        id: donation.id?.toString() || Math.random().toString(),
        donorId: donation.donor?.id?.toString() || user.id,
        donationDate: donation.donationDate,
        location: donation.location,
        notes: donation.notes || '',
        recipientContact: donation.recipientContact || '',
        createdAt: donation.createdAt || donation.donationTimestamp || donation.donationDate
      }));
      
      console.log('Transformed donations:', transformedDonations);
      setDonations(transformedDonations);
      
    } catch (err: any) {
      console.error('Dashboard: Failed to load donations:', err);
      setError('Failed to load donations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async () => {
    console.log('Dashboard: handleAddDonation called with:', newDonation);
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    
    // Validate input
    if (!newDonation.date || !newDonation.location?.trim()) {
      setError('Please fill in date and location fields');
      return;
    }

    // Validate date is not in future
    const selectedDate = new Date(newDonation.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
      setError('Donation date cannot be in the future');
      return;
    }

    try {
      setLoading(true);
      console.log('Dashboard: Adding donation...');
      
      const donationData = {
        donationDate: newDonation.date,
        location: newDonation.location.trim(),
        notes: newDonation.notes?.trim() || '',
        recipientContact: newDonation.recipientContact?.trim() || ''
      };
      
      console.log('Dashboard: Sending donation data:', donationData);
      
      const addedDonation = await apiService.addDonation(donationData);
      console.log('Dashboard: Donation added successfully:', addedDonation);
      
      setSuccess('Donation record added successfully!');
      
      // Update user's last donation date and availability
      const updatedUser: UserType = {
        ...effectiveUser,
        lastDonationDate: newDonation.date,
        isAvailable: false
      };

      onUpdateUser(updatedUser);
      await loadDonations();

      // Reset form
      setShowAddDonation(false);
      setNewDonation({ 
        date: new Date().toISOString().split('T')[0], 
        location: '', 
        notes: '',
        recipientContact: ''
      });
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add donation';
      setError(errorMessage);
      console.error('Dashboard: Error adding donation:', err);
      
      if (errorMessage.includes('authenticated') || errorMessage.includes('token')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityStatus = () => {
    if (effectiveRole !== 'donor') return null;
    
    console.log('=== AVAILABILITY STATUS DEBUG ===');
    console.log('User lastDonationDate:', user.lastDonationDate);
    
    let actualLastDonationDate = null;
    
    if (donations && donations.length > 0) {
      const sortedDonations = [...donations].sort((a, b) => 
        new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
      );
      actualLastDonationDate = sortedDonations[0].donationDate;
      console.log('Actual most recent donation date:', actualLastDonationDate);
    }
    
    const lastDonationToUse = actualLastDonationDate || user.lastDonationDate;
    
    if (!lastDonationToUse) {
      console.log('No last donation date - returning available');
      return { status: 'available', message: 'Ready to donate', color: 'green' };
    }

    const cleanedDate = lastDonationToUse.replace(/\[UTC\]$/, '');
    console.log('Cleaned date:', cleanedDate);
    
    const lastDonationDate = new Date(cleanedDate);
    console.log('Parsed date after cleaning:', lastDonationDate);
    console.log('Is valid date:', !isNaN(lastDonationDate.getTime()));
    
    if (isNaN(lastDonationDate.getTime())) {
      return { status: 'available', message: 'Ready to donate', color: 'green' };
    }
    
    const isAvailable = dateUtils.isDonorAvailable(lastDonationToUse);
    const daysLeft = dateUtils.getDaysUntilAvailable(lastDonationToUse);
    
    console.log('dateUtils.isDonorAvailable result:', isAvailable);
    console.log('dateUtils.getDaysUntilAvailable result:', daysLeft);
    console.log('=== END DEBUG ===');
    
    if (isAvailable) {
      return { status: 'available', message: 'Ready to donate', color: 'green' };
    } else {
      return { 
        status: 'unavailable', 
        message: `Available in ${daysLeft} days`, 
        color: 'red' 
      };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {effectiveUser.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {effectiveRole === 'donor' ? 'Thank you for being a life saver' : 
           effectiveRole === 'admin' ? 'Manage the LifeBlood platform' : 
           'Find the help you need'}
        </p>
        
        {/* Role Mismatch Warning */}
        {hasRoleMismatch && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Role Updated</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  Your role has been updated from "{user.role}" to "{tokenInfo.role}" based on your current permissions.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && tokenInfo && (
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div>User ID from token: {tokenInfo.userId} | Role from token: {tokenInfo.role}</div>
            <div>User prop role: {user.role} | Effective role: {effectiveRole}</div>
            {hasRoleMismatch && <div className="text-yellow-600">⚠️ Role mismatch detected and corrected</div>}
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                {success}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setSuccess(null)}
                  className="text-sm text-green-600 hover:text-green-500 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-500 underline"
                >
                  Dismiss
                </button>
                {error.includes('Failed to load') && (
                  <button
                    onClick={loadDonations}
                    disabled={loading}
                    className="text-sm text-red-600 hover:text-red-500 underline disabled:text-red-400"
                  >
                    {loading ? 'Retrying...' : 'Retry'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notice - Show admin-specific content */}
      {effectiveRole === 'admin' && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Administrator Dashboard</h3>
              <div className="mt-2 text-sm text-blue-700">
                As an administrator, you have access to the Admin Panel to manage users and oversee the platform.
                Use the "Admin" link in the navigation to access administrative features.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{effectiveUser.name}</h2>
              <p className="text-gray-600">{effectiveUser.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {effectiveUser.bloodGroup}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  effectiveRole === 'donor' ? 'bg-blue-100 text-blue-800' : 
                  effectiveRole === 'admin' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {effectiveRole === 'donor' ? 'Donor' : 
                   effectiveRole === 'admin' ? 'Administrator' : 'Recipient'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>
              {effectiveUser.upazila && effectiveUser.district && effectiveUser.division 
                ? `${effectiveUser.upazila}, ${effectiveUser.district}, ${effectiveUser.division}` 
                : 'Location not provided'
              }
            </span>
          </div>

          {availabilityStatus && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Donation Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  availabilityStatus.color === 'green' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {availabilityStatus.message}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {effectiveRole === 'donor' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Donation History
                  {donations.length > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({donations.length} donation{donations.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    console.log('Dashboard: Add donation button clicked');
                    setShowAddDonation(true);
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Donation
                </button>
              </div>

              {showAddDonation && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Record New Donation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Donation Date *
                      </label>
                      <input
                        type="date"
                        value={newDonation.date}
                        onChange={(e) => {
                          console.log('Dashboard: Date changed to:', e.target.value);
                          setNewDonation(prev => ({ ...prev, date: e.target.value }));
                          setError(null);
                        }}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={newDonation.location}
                        onChange={(e) => {
                          console.log('Dashboard: Location changed to:', e.target.value);
                          setNewDonation(prev => ({ ...prev, location: e.target.value }));
                          setError(null);
                        }}
                        placeholder="Hospital/Blood Bank name"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Contact
                    </label>
                    <input
                      type="text"
                      value={newDonation.recipientContact}
                      onChange={(e) => setNewDonation(prev => ({ ...prev, recipientContact: e.target.value }))}
                      placeholder="Phone number or email"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={newDonation.notes}
                      onChange={(e) => setNewDonation(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                      placeholder="Any additional notes..."
                    />
                  </div>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        console.log('Dashboard: Save donation button clicked');
                        handleAddDonation();
                      }}
                      disabled={loading || !newDonation.date || !newDonation.location?.trim()}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Save Donation
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        console.log('Dashboard: Cancel button clicked');
                        setShowAddDonation(false);
                        setError(null);
                        setSuccess(null);
                        setNewDonation({ 
                          date: new Date().toISOString().split('T')[0], 
                          location: '', 
                          notes: '',
                          recipientContact: ''
                        });
                      }}
                      disabled={loading}
                      className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {loading && !showAddDonation && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading donations...</p>
                </div>
              )}

              {!loading && donations.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No donations recorded yet
                  </h4>
                  <p className="text-gray-500">
                    Start saving lives by recording your first donation!
                  </p>
                </div>
              ) : !loading && (
                <div className="space-y-4">
                  {donations
                    .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime())
                    .map((donation) => (
                    <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-900">
                              {dateUtils.formatDate(donation.donationDate)}
                            </span>
                            <span className="text-gray-600">{donation.location}</span>
                          </div>
                          {donation.recipientContact && (
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Contact:</span> {donation.recipientContact}
                            </p>
                          )}
                          {donation.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              <span className="font-medium">Notes:</span> {donation.notes}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Recorded on {dateUtils.formatDate(donation.createdAt || donation.donationDate)}
                          </p>
                        </div>
                        <div className="flex items-center text-red-600">
                          <Heart className="h-5 w-5 fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin-specific content */}
          {effectiveRole === 'admin' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Administrator Actions
              </h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">User Management</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Manage users, verify accounts, and oversee platform operations.
                  </p>
                  <button
                    onClick={() => window.location.href = '/admin'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Go to Admin Panel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Donation Statistics */}
          {effectiveRole === 'donor' && donations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Donation Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{donations.length}</div>
                  <div className="text-sm text-gray-600">Total Donations</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {donations.filter(d => 
                      new Date(d.donationDate).getFullYear() === new Date().getFullYear()
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">This Year</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.lastDonationDate ? 
                      dateUtils.getDaysUntilAvailable(user.lastDonationDate) > 0 ? 
                        `${dateUtils.getDaysUntilAvailable(user.lastDonationDate)} days` : 
                        'Available' : 
                      'Available'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Next Eligible</div>
                </div>
              </div>
            </div>
          )}

          {/* Search History */}
          {user.searchHistory && user.searchHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Searches
              </h3>
              <div className="space-y-4">
                {user.searchHistory.slice(-5).reverse().map((search) => (
                  <div key={search.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {search.bloodGroup}
                          </span>
                          <span className="text-gray-600">{search.location}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {search.resultsCount} donors found
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {dateUtils.formatDate(search.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, Droplet, Filter } from 'lucide-react';
import { BloodGroup, User } from '../../types';
import { apiService } from '../../services/apiService';

interface DonorSearchProps {
  currentUser: User | null;
}

interface SearchFilters {
  bloodGroup: BloodGroup;
  division: string;
  district: string;
  upazila: string;
}

interface DonorResult {
  id: number;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  lastDonationDate?: string;
  isActive: boolean;
  isVerified: boolean;
}

// Bangladesh Divisions, Districts and Upazilas Data
const divisionsDistrictsUpazilas = {
  "Dhaka": {
    "Dhaka": ["Dhanmondi", "Wari", "Tejgaon", "Ramna", "Motijheel", "Kotwali", "Lalbagh", "Sutrapur", "Hazaribagh", "New Market", "Shahbagh", "Paltan", "Gulshan", "Cantonment", "Uttara", "Pallabi", "Mirpur", "Mohammadpur", "Adabor", "Kafrul", "Tejgaon I.A.", "Badda", "Vatara", "Khilkhet", "Shah Ali"],
    "Faridpur": ["Faridpur Sadar", "Alfadanga", "Boalmari", "Charbhadrasan", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha", "Bhanga"],
    "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj", "Tongi"],
    "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
    "Kishoreganj": ["Kishoreganj Sadar", "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
    "Madaripur": ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"],
    "Manikganj": ["Manikganj Sadar", "Daulatpur", "Ghior", "Harirampur", "Saturia", "Shivalaya", "Singair"],
    "Munshiganj": ["Munshiganj Sadar", "Gazaria", "Lohajang", "Sirajdikhan", "Sreenagar", "Tongibari"],
    "Narayanganj": ["Narayanganj Sadar", "Araihazar", "Bandar", "Rupganj", "Sonargaon"],
    "Narsingdi": ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"],
    "Rajbari": ["Rajbari Sadar", "Baliakandi", "Goalandaghat", "Pangsha", "Kalukhali"],
    "Shariatpur": ["Shariatpur Sadar", "Bhedarganj", "Damudya", "Gosairhat", "Naria", "Zajira"],
    "Tangail": ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari"]
  },
  "Chittagong": {
    "Bandarban": ["Bandarban Sadar", "Alikadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
    "Brahmanbaria": ["Brahmanbaria Sadar", "Akhaura", "Ashuganj", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Bancharampur"],
    "Chandpur": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
    "Chittagong": ["Chittagong Sadar", "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda", "Kotwali", "Panchlaish", "Double Mooring", "Chandgaon", "Pahartali", "Bakalia", "Bayazid", "EPZ", "Halishahar", "Khulshi", "Patenga", "Karnaphuli"],
    "Comilla": ["Comilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Comilla Sadar Dakshin", "Meghna", "Monohorgonj", "Sadarsouth", "Titas"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Ramu", "Teknaf", "Ukhia", "Pekua"],
    "Feni": ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Fulgazi", "Parshuram", "Sonagazi"],
    "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
    "Lakshmipur": ["Lakshmipur Sadar", "Kamalnagar", "Raipur", "Ramganj", "Ramgati"],
    "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Senbagh", "Sonaimuri", "Subarna Char"],
    "Rangamati": ["Rangamati Sadar", "Baghaichhari", "Barkal", "Belaichhari", "Kaptai", "Juraichhari", "Langadu", "Naniarchar", "Rajasthali", "Kaukhali"]
  },
  "Rajshahi": {
    "Bogura": ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"],
    "Joypurhat": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
    "Naogaon": ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
    "Natore": ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Singra"],
    "Nawabganj": ["Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
    "Pabna": ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
    "Rajshahi": ["Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
    "Sirajganj": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhand", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"]
  },
  "Rangpur": {
    "Dinajpur": ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
    "Gaibandha": ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
    "Kurigram": ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"],
    "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
    "Nilphamari": ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Sayedpur"],
    "Panchagarh": ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
    "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
    "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"]
  },
  "Khulna": {
    "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
    "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
    "Jessore": ["Jessore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
    "Jhenaidah": ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
    "Khulna": ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsa", "Terokhada", "Daulatpur", "Khalishpur", "Khan Jahan Ali", "Kotwali", "Sonadanga"],
    "Kushtia": ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"],
    "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
    "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"],
    "Narail": ["Narail Sadar", "Kalia", "Lohagara"],
    "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
  },
  "Barishal": {
    "Barguna": ["Barguna Sadar", "Amtali", "Betagi", "Bamna", "Pathorghata", "Taltali"],
    "Barishal": ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur", "Barisal Sadar", "Kotwali", "Bandar"],
    "Bhola": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
    "Jhalokati": ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
    "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali"],
    "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"]
  },
  "Sylhet": {
    "Habiganj": ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"],
    "Moulvibazar": ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamolganj", "Kulaura", "Rajnagar", "Sreemangal"],
    "Sunamganj": ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "South Sunamganj"],
    "Sylhet": ["Sylhet Sadar", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Zakiganj", "Dakshin Surma"]
  },
  "Mymensingh": {
    "Jamalpur": ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
    "Mymensingh": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal"],
    "Netrokona": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"],
    "Sherpur": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
  }
};

export const DonorSearch: React.FC<DonorSearchProps> = ({ currentUser }) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    bloodGroup: 'O+' as BloodGroup,
    division: '',
    district: '',
    upazila: ''
  });
  const [donors, setDonors] = useState<DonorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableUpazilas, setAvailableUpazilas] = useState<string[]>([]);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Update districts when division changes
  useEffect(() => {
    if (searchFilters.division) {
      const districts = Object.keys(divisionsDistrictsUpazilas[searchFilters.division as keyof typeof divisionsDistrictsUpazilas] || {});
      setAvailableDistricts(districts);
      
      // Reset district and upazila if division changes
      if (searchFilters.district && !districts.includes(searchFilters.district)) {
        setSearchFilters(prev => ({ ...prev, district: "", upazila: "" }));
        setAvailableUpazilas([]);
      }
    } else {
      setAvailableDistricts([]);
      setAvailableUpazilas([]);
    }
  }, [searchFilters.division]);

  // Update upazilas when district changes
  useEffect(() => {
    if (searchFilters.division && searchFilters.district) {
      const divisionData = divisionsDistrictsUpazilas[searchFilters.division as keyof typeof divisionsDistrictsUpazilas];
      const upazilas = divisionData?.[searchFilters.district as keyof typeof divisionData] || [];
      setAvailableUpazilas(upazilas);
      
      // Reset upazila if district changes
      if (searchFilters.upazila && !upazilas.includes(searchFilters.upazila)) {
        setSearchFilters(prev => ({ ...prev, upazila: "" }));
      }
    } else {
      setAvailableUpazilas([]);
    }
  }, [searchFilters.division, searchFilters.district]);

  // Backend accepts frontend format (A+, O-) for input
  // But returns enum format (A_PLUS, O_NEG) in response
  // Convert enum format back to display format
  const convertEnumToDisplay = (enumBloodGroup: string): string => {
    const enumToDisplayMap: Record<string, string> = {
      'A_PLUS': 'A+',
      'A_NEG': 'A-',
      'B_PLUS': 'B+', 
      'B_NEG': 'B-',
      'AB_PLUS': 'AB+',
      'AB_NEG': 'AB-',
      'O_PLUS': 'O+',
      'O_NEG': 'O-'
    };
    return enumToDisplayMap[enumBloodGroup] || enumBloodGroup;
  };

  const searchDonors = async () => {
      // Validate required fields
    if (!searchFilters.division || !searchFilters.district || !searchFilters.upazila) {
      setError('Please fill in all location fields (Division, District, Upazila)');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      // Get all users who are donors
      console.log('DonorSearch: Starting search with filters:', searchFilters);

      // Your backend accepts frontend format directly (O-, A+, etc.)
      // Prepare search parameters for backend (matching your URL structure)
      const searchParams = {
        bloodGroup: searchFilters.bloodGroup, // Send as-is (O-, A+, etc.)
        division: searchFilters.division.trim(),
        district: searchFilters.district.trim(),
        upazila: searchFilters.upazila.trim()
      };

      console.log('DonorSearch: Sending search params to backend:', searchParams);
      console.log('DonorSearch: Backend URL will be:', 
        `${apiService.baseURL}/search?bloodGroup=${searchParams.bloodGroup}&division=${searchParams.division}&district=${searchParams.district}&upazila=${searchParams.upazila}`
      );

      const searchResults = await apiService.searchDonors(searchParams);
      console.log('DonorSearch: Search results received:', searchResults);

      if (!searchResults || !Array.isArray(searchResults)) {
        console.warn('DonorSearch: Invalid response format:', searchResults);
        setDonors([]);
        return;
      }
       const transformedDonors: DonorResult[] = searchResults.map((donor: any) => ({
        id: donor.id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        bloodGroup: donor.bloodGroup, // Keep enum format (O_NEG, A_PLUS) for internal use
        division: donor.division,
        district: donor.district, 
        upazila: donor.upazila,
        address: donor.address || '',
        lastDonationDate: donor.lastDonationDate,
        isActive: donor.isActive !== false, // Default to true if undefined
        isVerified: donor.isVerified !== false // Default to true if undefined
      }));
      console.log('DonorSearch: Transformed donors:', transformedDonors);
      setDonors(transformedDonors);
      // Save search to history if user is logged in
      if (currentUser) {
        console.log('DonorSearch: Saving search to user history');
      }

    } catch (error: any) {
      console.error('DonorSearch: Search failed:', error);
      
      let errorMessage = 'Failed to search for donors';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid search parameters. Please check your input.';
            break;
          case 401:
            errorMessage = 'Authentication required. Please login to search.';
            break;
          case 404:
            errorMessage = 'No donors found matching your criteria.';
            setDonors([]); // Set empty array for 404
            return;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Search failed: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message || 'Search failed';
      }
      
      setError(errorMessage);
    }

    setLoading(false);
  };
  useEffect(() => {
    if (hasSearched) {
      setHasSearched(false);
      setDonors([]);
      setError(null);
    }
  }, [searchFilters]);

  // Calculate eligibility status based on last donation (4 months as per backend)
  const getDonorStatus = (lastDonationDate?: string) => {
    if (!lastDonationDate) {
      return { status: 'Available', color: 'green' };
    }

    const lastDonation = new Date(lastDonationDate);
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    if (lastDonation <= fourMonthsAgo) {
      return { status: 'Available', color: 'green' };
    } else {
      const nextEligible = new Date(lastDonation);
      nextEligible.setMonth(nextEligible.getMonth() + 4);
      return { 
        status: `Eligible ${nextEligible.toLocaleDateString()}`, 
        color: 'yellow' 
      };
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Blood Donors</h1>
        <p className="mt-2 text-lg text-gray-600">
          Connect with verified blood donors in your area
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group *
            </label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={searchFilters.bloodGroup}
                onChange={(e) => setSearchFilters(prev => ({ 
                  ...prev, 
                  bloodGroup: e.target.value as BloodGroup 
                }))}
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              >
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Division *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <select
                value={searchFilters.division}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, division: e.target.value }))}
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
              >
                <option value="">Select Division</option>
                {Object.keys(divisionsDistrictsUpazilas).map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District *
            </label>
            <select
              value={searchFilters.district}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, district: e.target.value }))}
              disabled={!searchFilters.division}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
            >
              <option value="">
                {searchFilters.division ? "Select District" : "Select Division First"}
              </option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upazila *
            </label>
            <select
              value={searchFilters.upazila}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, upazila: e.target.value }))}
              disabled={!searchFilters.district}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
            >
              <option value="">
                {searchFilters.district ? "Select Upazila" : "Select District First"}
              </option>
              {availableUpazilas.map((upazila) => (
                <option key={upazila} value={upazila}>{upazila}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={searchDonors}
             disabled={loading || !searchFilters.division || !searchFilters.district || !searchFilters.upazila}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Search Info */}
        {hasSearched && !loading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800 text-sm">
              <strong>Search Query:</strong> {searchFilters.bloodGroup} blood type in {searchFilters.division}, {searchFilters.district}, {searchFilters.upazila}
            </p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results ({donors.length} donors found)
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Filter className="h-4 w-4 mr-1" />
             Blood Type: {searchFilters.bloodGroup} | Location: {searchFilters.division}, {searchFilters.district}, {searchFilters.upazila}
            </div>
          </div>

          {donors.length === 0 ? (
            <div className="text-center py-12">
              <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No donors found
              </h3>
              <p className="text-gray-500">
                No available donors found for {searchFilters.bloodGroup} blood type in {searchFilters.division}, {searchFilters.district}, {searchFilters.upazila}.
                <br />
                Try searching in nearby areas or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {donors.map((donor) => {
                const donorStatus = getDonorStatus(donor.lastDonationDate);
                // Convert backend enum format (O_NEG) to display format (O-)
                const displayBloodGroup = convertEnumToDisplay(donor.bloodGroup);
                
                return (
                  <div key={donor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {displayBloodGroup}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donorStatus.color === 'green' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donorStatus.status}
                          </span>
                          {donor.isVerified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                  <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{donor.upazila}, {donor.district}, {donor.division}</span>
                      </div>

                    {donor.address && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                          <span className="break-words">{donor.address}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <a 
                          href={`tel:${donor.phone}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {donor.phone}
                        </a>
                      </div>
                       {donor.lastDonationDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            Last donated: {formatDate(donor.lastDonationDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <a
                          href={`tel:${donor.phone}`}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Call Now
                        </a>
                        <a
                          href={`sms:${donor.phone}?body=Hi ${donor.name}, I need ${displayBloodGroup} blood. Can you help?`}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          SMS
                        </a>
                      </div>
                    </div>
                  </div>
                  
                   );
              })} 
              
            </div>
          )}
        </div>
      )}
    </div>
  );
};
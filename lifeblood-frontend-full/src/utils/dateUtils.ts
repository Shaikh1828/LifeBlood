export const dateUtils = {
  formatDate(date: string | Date): string {
    let d: Date;
    if (typeof date === 'string') {
      // Clean the date string - remove [UTC] suffix if present
      const cleanedDate = date.replace(/\[UTC\]$/, '');
      d = new Date(cleanedDate);
    } else {
      d = new Date(date);
    }
    return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  isDateAfter(date1: string | Date, date2: string | Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return !isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d1.getTime() > d2.getTime();
  },

  addMonths(date: string | Date, months: number): Date {
    const d = new Date(date);
    if (isNaN(d.getTime())) return new Date();
    
    // Create a new date and properly add months
    const result = new Date(d);
    result.setMonth(result.getMonth() + months);
    
    // Handle edge cases where the day doesn't exist in the target month
    // For example, January 31 + 1 month should be February 28/29, not March 2/3
    if (result.getDate() !== d.getDate()) {
      result.setDate(0); // Set to last day of previous month
    }
    
    return result;
  },

  isDonorAvailable(lastDonationDate?: string): boolean {
    if (!lastDonationDate) return true;
    
    // Clean the date string - remove [UTC] suffix if present
    const cleanedDate = lastDonationDate.replace(/\[UTC\]$/, '');
    
    const lastDonation = new Date(cleanedDate);
    if (isNaN(lastDonation.getTime())) return true;
    
    const fourMonthsLater = this.addMonths(lastDonation, 4);
    const today = new Date();
    
    // Reset time to start of day for both dates to avoid time-of-day issues
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eligibleStart = new Date(fourMonthsLater.getFullYear(), fourMonthsLater.getMonth(), fourMonthsLater.getDate());
    
    console.log('Donation availability check:', {
      lastDonationDate,
      fourMonthsLater: fourMonthsLater.toDateString(),
      today: today.toDateString(),
      isAvailable: todayStart >= eligibleStart
    });
    
    return todayStart >= eligibleStart;
  },

  getDaysUntilAvailable(lastDonationDate: string): number {
    if (!lastDonationDate) return 0;
    
    // Clean the date string - remove [UTC] suffix if present
    const cleanedDate = lastDonationDate.replace(/\[UTC\]$/, '');
    
    const lastDonation = new Date(cleanedDate);
    if (isNaN(lastDonation.getTime())) return 0;
    
    const fourMonthsLater = this.addMonths(lastDonation, 4);
    const today = new Date();
    
    // Reset time to start of day for accurate day calculation
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eligibleStart = new Date(fourMonthsLater.getFullYear(), fourMonthsLater.getMonth(), fourMonthsLater.getDate());
    
    const diffTime = eligibleStart.getTime() - todayStart.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('Days until available calculation:', {
      lastDonationDate,
      fourMonthsLater: fourMonthsLater.toDateString(),
      today: today.toDateString(),
      daysUntilAvailable: days > 0 ? days : 0
    });
    
    return days > 0 ? days : 0;
  }
};
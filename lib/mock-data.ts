import { Professional, Booking, ComplaintTicket, TrustScoreBreakdownItem } from "./types";

// NOTE: All data in this file is placeholder/sample content for design and
// development purposes only. Replace with real API data before launch.

export const CITIES = ["Nagpur", "Pune", "Mumbai", "Nashik"] as const;
export const LAUNCH_CITY = "Nagpur";

export const SERVICE_PRICING = [
  { category: "Plumbing", startingFrom: 199 },
  { category: "Electrician", startingFrom: 149 },
  { category: "AC Repair", startingFrom: 349 },
  { category: "Carpenter", startingFrom: 249 },
  { category: "Cleaning", startingFrom: 399 },
  { category: "Appliance Repair", startingFrom: 299 },
] as const;

export const FEATURED_PROFESSIONALS: Professional[] = [
  { id: "p1", name: "Ramesh Kulkarni", category: "AC Repair", rating: 4.9, jobsCompleted: 312, trustScore: 96, badge: "Platinum", city: "Nagpur", startingPrice: 349, verified: true, avatarInitials: "RK" },
  { id: "p2", name: "Priya Sharma", category: "Cleaning", rating: 4.8, jobsCompleted: 208, trustScore: 91, badge: "Gold", city: "Nagpur", startingPrice: 399, verified: true, avatarInitials: "PS" },
  { id: "p3", name: "Anil Verma", category: "Electrician", rating: 4.9, jobsCompleted: 275, trustScore: 94, badge: "Gold", city: "Nagpur", startingPrice: 149, verified: true, avatarInitials: "AV" },
  { id: "p4", name: "Suresh Patil", category: "Plumbing", rating: 4.7, jobsCompleted: 190, trustScore: 88, badge: "Silver", city: "Nagpur", startingPrice: 199, verified: true, avatarInitials: "SP" },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { id: "bk1", service: "AC Repair", professional: "Ramesh Kulkarni", date: "6 Jul 2026", time: "4:00 PM", status: "Confirmed", price: 549, address: "Flat 302, Dharampeth" },
  { id: "bk2", service: "Cleaning", professional: "Priya Sharma", date: "9 Jul 2026", time: "10:00 AM", status: "Pending", price: 899, address: "Flat 302, Dharampeth" },
  { id: "bk3", service: "Electrician", professional: "Anil Verma", date: "2 Jul 2026", time: "2:00 PM", status: "Completed", price: 249, address: "Office, Civil Lines" },
];

export const SAMPLE_COMPLAINTS: ComplaintTicket[] = [
  { id: "cmp1", subject: "Professional arrived 40 minutes late", raisedBy: "Aditi Rao", bookingId: "bk1", status: "Under Investigation", date: "3 Jul 2026" },
  { id: "cmp2", subject: "Requesting partial refund for incomplete job", raisedBy: "Karan Mehta", bookingId: "bk4", status: "Refund Approved", date: "1 Jul 2026" },
];

export const TRUST_BREAKDOWN: TrustScoreBreakdownItem[] = [
  { label: "Identity Verification", weight: 20, score: 20 },
  { label: "Experience", weight: 15, score: 13 },
  { label: "Customer Ratings", weight: 20, score: 18 },
  { label: "Jobs Completed", weight: 15, score: 14 },
  { label: "On-time Arrival", weight: 15, score: 13 },
  { label: "Repeat Customers", weight: 10, score: 9 },
  { label: "Complaint Rate", weight: 5, score: 5 },
];

export const SUCCESS_STORIES = [
  { name: "Aarav Mehta", role: "Homeowner, Dharampeth", quote: "The electrician arrived on time, showed his verification badge, and the price matched the quote exactly." },
  { name: "Sneha Kulkarni", role: "Verified Cleaning Partner", quote: "Weekly payments land on time, and support actually picks up when I call." },
  { name: "Rohit Deshmukh", role: "Homeowner, Civil Lines", quote: "I could see the plumber's rating and past jobs before booking. Felt vetted." },
] as const;

// Placeholder-only figures, clearly not marketed as verified company statistics.
export const TRUST_STATS_PLACEHOLDER = [
  { label: "Verification checkpoints", value: "7" },
  { label: "Service categories at launch", value: "6" },
  { label: "Avg. professional rating", value: "4.8*" },
  { label: "Cities in rollout plan", value: "4" },
];

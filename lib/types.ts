export type ServiceCategory =
  | "Plumbing" | "Electrician" | "AC Repair" | "Carpenter" | "Cleaning" | "Appliance Repair";

export type BadgeTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface Professional {
  id: string;
  name: string;
  category: ServiceCategory;
  rating: number;
  jobsCompleted: number;
  trustScore: number;
  badge: BadgeTier;
  city: string;
  startingPrice: number;
  verified: boolean;
  avatarInitials: string;
}

export interface Booking {
  id: string;
  service: ServiceCategory;
  professional: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  price: number;
  address: string;
}

export interface ComplaintTicket {
  id: string;
  subject: string;
  raisedBy: string;
  bookingId: string;
  status: "Open" | "Under Investigation" | "Refund Approved" | "Resolved" | "Rejected";
  date: string;
}

export type UserRole = "customer" | "professional" | "admin";

export interface TrustScoreBreakdownItem {
  label: string;
  weight: number;
  score: number;
}

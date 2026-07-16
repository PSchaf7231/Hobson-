export type LeadStage =
  | "Inquired on"
  | "Interested in"
  | "Not interested"
  | "Shown"
  | "Made offer"
  | "Offer rejected"
  | "Sent to client";

export type LeadStatus = "hot" | "warm" | "new";

export type SignalTrigger = "repeat-viewing" | "shared" | "late-night" | "manual";

export type ContactType = "call" | "text";

export interface ViewEvent {
  propertyId: string;
  propertyLabel: string;
  at: number;
}

export interface ShareEvent {
  propertyId: string;
  propertyLabel: string;
  sharedWith?: string;
  at: number;
}

export interface TextOption {
  label: string;
  message: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  location: string;
  priceRange: string;
  intentTag: string;
  thumbnailInitials: string;
  stage: LeadStage;
  status: LeadStatus;
  activitySummary: string;
  hobsonNote: string;
  textOptions: TextOption[];
  triggeredBy: SignalTrigger | null;
  viewEvents: ViewEvent[];
  shareEvents: ShareEvent[];
  lastActiveAt: number;
  createdAt: number;
  becameHotAt: number | null;
  lastContactType: ContactType | null;
  lastContactedAt: number | null;
}

export interface LeadEventInput {
  leadId: string;
  type: "view" | "share";
  propertyId: string;
  propertyLabel: string;
  sharedWith?: string;
}

export interface LeadCreateInput {
  name: string;
  phone: string;
  location: string;
  priceRange?: string;
}

export interface HobsonAlert {
  leadId: string;
  name: string;
  phone: string;
  trigger: SignalTrigger;
  spokenLine: string;
  at: number;
}

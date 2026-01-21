
import { ResidentialQuoteData, CommercialQuoteData, AirbnbQuoteData } from '../types';

/**
 * PRICING RULES DEFINITIONS
 * Derived from Clean Up Bros Knowledge Base
 */

// Residential Base Prices - 2026 Sydney Market WITH 30% PROFIT MARGIN (Updated Jan 22, 2026)
// Sources: Exit Cleaners, MultiCleaning, The Local Guys, Airtasker, SMK Carpet Cleaning
// Market research: Studio $200-400, 2BR $350-550, 3BR $400-600, 4BR $500-800, 5BR+ $650-850
// Formula: Market Average × 1.30 (30% profit margin)
const RESIDENTIAL_BASE: Record<string, Record<string, number>> = {
  // General cleaning: ~40% less than EOL (standard maintenance clean)
  'General': { '1': 165, '2': 215, '3': 275, '4': 350, '5': 430 },
  // Deep cleaning: ~65% of EOL (thorough but not bond-ready)
  'Deep': { '1': 260, '2': 340, '3': 425, '4': 550, '5': 680 },
  // End-of-Lease: Market avg × 1.30 (30% margin)
  // 1BR: $300 avg × 1.30 = $390, 2BR: $400 × 1.30 = $520, etc.
  'End-of-Lease': { '1': 390, '2': 520, '3': 650, '4': 845, '5': 975 },
  // Post-Construction: EOL + 40% (heavy debris, hazard premium)
  'Post-Construction': { '1': 545, '2': 730, '3': 910, '4': 1185, '5': 1365 },
};

// Airbnb Turnover Prices - 2026 Sydney Market WITH 25% PROFIT MARGIN (Updated Jan 22, 2026)
// Sources: Airtasker, HouseKept, Hospitable, Property Providers
// Market: 1BR $80-180, 2BR $150-220, 3BR $220-320, 4BR+ $300-400
// Formula: Market Average × 1.25 (25% margin - competitive short-term rental market)
const AIRBNB_BASE: Record<string, number> = {
  '1': 165,  // $130 avg × 1.25 = $163 → $165
  '2': 235,  // $185 avg × 1.25 = $231 → $235
  '3': 340,  // $270 avg × 1.25 = $338 → $340
  '4': 440,  // $350 avg × 1.25 = $438 → $440
  '5': 550,  // $440 avg × 1.25 = $550
};

// Commercial Per-Square-Metre Rates - 2026 Sydney Market WITH 30% PROFIT MARGIN (Updated Jan 22, 2026)
// Sources: SMK Carpet Cleaning, WDC Facility Services, Versatile Cleaning, Hope Clean, JBN Cleaning
// Base rate: $4/m² (market avg) × 1.30 = $5.20/m² for standard office
// Medical/Gym premium: +30%, Retail discount: -10%
const COMMERCIAL_RATES_PER_SQM = {
  'Medical': 6.75,   // $5.20 × 1.30 (premium for sanitization/compliance)
  'Office': 5.20,    // Base rate with 30% margin
  'Gym': 6.50,       // $5.20 × 1.25 (equipment cleaning, hygiene focus)
  'Retail': 4.70,    // $5.20 × 0.90 (simpler open layouts)
  'Warehouse': 3.90, // $5.20 × 0.75 (large open spaces, less detail)
  'Other': 4.95      // Slightly below office rate
};

// Minimum charges per visit (covers fixed costs: travel, setup, equipment)
const COMMERCIAL_MINIMUM_CHARGE = 220;

// Add-ons Pricing - 2026 Sydney Market Competitive (Updated Jan 21, 2026)
// Sources: Airtasker, JBN Cleaning, Exit Cleaners, Industry Averages
const EXTRAS_PRICING: Record<string, number> = {
  'Oven Cleaning': 80,        // Market avg $195, Sydney $215 - we undercut
  'Window Cleaning': 12,      // Per window, market $8-15
  'Carpet Steam Cleaning': 55, // Per room, Sydney $28-48 avg
  'Fridge Cleaning': 45,      // Market avg $55
  'Wall Washing': 40,         // Per room, market $30-60
  'Balcony/Patio Clean': 75,  // Market avg $85
  'Garage Cleaning': 120,     // Market avg $140
  'Laundry': 60,              // Per load
  'Blinds Cleaning': 12,      // Per blind
  'Restock Amenities': 20,    // Airbnb specific
  'Linen Change': 0,          // Included in Airbnb base
  'BBQ Cleaning': 85,         // Market avg $110
  'Rangehood': 45,            // Market avg $55
  'Dishwasher': 35,           // Interior clean
  'Microwave': 20,            // Interior + exterior
  'Skirting Boards': 60,      // Whole house
  'Light Fittings': 8,        // Per fitting
  'Ceiling Fan': 15,          // Per fan
};

const BATHROOM_SURCHARGE = 25; // Per extra bathroom (updated 2026)
const TRAVEL_CHARGE_FLAT = 0;  // Removed - included in base price

export class PricingCalculator {

  // --- RESIDENTIAL ---
  calculateResidential(data: ResidentialQuoteData): { total: number; breakdown: any } | null {
    const { serviceType, bedrooms, bathrooms, addOns, frequency, subscribedToOneYearPlan, condition } = data;
    
    if (!serviceType || !bedrooms || !bathrooms) return null;
    
    // If condition is Extreme, we cannot calculate a standard price.
    if (condition === 'Extreme') return null;

    // Cap bedrooms at 5 for base lookup, add surcharge for more
    const bedKey = Math.min(bedrooms, 5).toString();
    let basePrice = RESIDENTIAL_BASE[serviceType]?.[bedKey] || 0;

    // Extra bedrooms surcharge (>5)
    if (bedrooms > 5) {
      basePrice += (bedrooms - 5) * 50;
    }

    // Bathroom surcharge (Base price covers 1 bath usually, add for others)
    let bathroomCost = 0;
    if (bathrooms > 1) {
      bathroomCost = (bathrooms - 1) * BATHROOM_SURCHARGE;
    }

    let laborCost = basePrice + bathroomCost;

    // Condition Surcharges
    // Moderate: +15%
    // Heavy: +30% (Updated from KB)
    if (condition === 'Moderate') {
        laborCost *= 1.15;
    } else if (condition === 'Heavy') {
        laborCost *= 1.30;
    }

    // Add-ons
    let extrasCost = 0;
    addOns.forEach(addon => {
      // Simple matching logic
      if (addon.includes('Oven')) extrasCost += EXTRAS_PRICING['Oven Cleaning'];
      else if (addon.includes('Window')) extrasCost += (EXTRAS_PRICING['Window Cleaning'] * 5); // Estimate 5 windows
      else if (addon.includes('Carpet')) extrasCost += (EXTRAS_PRICING['Carpet Steam Cleaning'] * bedrooms); // Per bedroom
      else if (addon.includes('Fridge')) extrasCost += EXTRAS_PRICING['Fridge Cleaning'];
      else if (addon.includes('Wall')) extrasCost += (EXTRAS_PRICING['Wall Washing'] * bedrooms); // Per room
      else if (addon.includes('Balcony')) extrasCost += EXTRAS_PRICING['Balcony/Patio Clean'];
      else if (addon.includes('Garage')) extrasCost += EXTRAS_PRICING['Garage Cleaning'];
      else extrasCost += 40; // Generic fallback
    });

    let subtotal = laborCost + extrasCost + TRAVEL_CHARGE_FLAT;

    // Discounts
    let discount = 0;
    if (subscribedToOneYearPlan && frequency !== 'One-time') {
      discount = subtotal * 0.15; // 15% Subscription discount
    } else if (frequency === 'Weekly') {
        discount = subtotal * 0.10; // Standard weekly discount
    } else if (frequency === 'Bi-weekly') {
        discount = subtotal * 0.05;
    }

    const total = Math.ceil(subtotal - discount);

    return {
      total,
      breakdown: { basePrice, bathroomCost, extrasCost, travel: TRAVEL_CHARGE_FLAT, discount, conditionMultiplier: condition === 'Moderate' ? 1.15 : (condition === 'Heavy' ? 1.30 : 1) }
    };
  }

  // --- COMMERCIAL ---
  // Updated Jan 22, 2026 with market-competitive per-sqm pricing
  calculateCommercial(data: CommercialQuoteData): { total: number; per: string } | null {
    const { facilityType, squareMeters, cleaningFrequency } = data;

    if (!facilityType || !squareMeters || !cleaningFrequency) return null;

    const sqm = parseFloat(squareMeters);
    if (isNaN(sqm) || sqm <= 0) return null;

    // Identify Category based on facility type
    let category: keyof typeof COMMERCIAL_RATES_PER_SQM = 'Other';
    const typeLower = facilityType.toLowerCase();
    if (typeLower.includes('medical') || typeLower.includes('clinic') || typeLower.includes('doctor') || typeLower.includes('dental')) {
      category = 'Medical';
    } else if (typeLower.includes('office') || typeLower.includes('corporate') || typeLower.includes('building')) {
      category = 'Office';
    } else if (typeLower.includes('gym') || typeLower.includes('fitness') || typeLower.includes('sport')) {
      category = 'Gym';
    } else if (typeLower.includes('retail') || typeLower.includes('shop') || typeLower.includes('store')) {
      category = 'Retail';
    } else if (typeLower.includes('warehouse') || typeLower.includes('factory') || typeLower.includes('industrial')) {
      category = 'Warehouse';
    }

    // Get per-sqm rate for this category
    const ratePerSqm = COMMERCIAL_RATES_PER_SQM[category];

    // Calculate per-visit cost (with minimum charge)
    let perVisitCost = Math.max(sqm * ratePerSqm, COMMERCIAL_MINIMUM_CHARGE);

    // Volume discount for larger spaces (economy of scale)
    if (sqm > 500) perVisitCost *= 0.92;      // 8% discount for 500+ sqm
    else if (sqm > 300) perVisitCost *= 0.95; // 5% discount for 300-500 sqm

    // Visits per month based on frequency
    const visitsPerMonth: Record<string, number> = {
      'Daily': 22,       // ~5 days/week × 4.3 weeks
      'Weekly': 4.3,     // Once per week
      'Fortnightly': 2,  // Every 2 weeks
      'Monthly': 1       // Once per month
    };

    const visits = visitsPerMonth[cleaningFrequency] || 4.3;
    let monthlyPrice = perVisitCost * visits;

    // Contract term discounts
    if (data.contractTerm === '1 Year') monthlyPrice *= 0.90;       // 10% off for annual
    else if (data.contractTerm === '6 Months') monthlyPrice *= 0.95; // 5% off for 6 months

    return {
      total: Math.ceil(monthlyPrice),
      per: 'month'
    };
  }

  // --- AIRBNB ---
  calculateAirbnb(data: AirbnbQuoteData): { total: number } | null {
    const { bedrooms, bathrooms, turnoverRequirements } = data;
    const beds = parseInt(bedrooms) || 1;
    const baths = parseInt(bathrooms) || 1;

    let basePrice = 0;
    if (beds <= 1) basePrice = AIRBNB_BASE['1'];
    else if (beds === 2) basePrice = AIRBNB_BASE['2'];
    else basePrice = AIRBNB_BASE['3'] + ((beds - 3) * 40); // Add 40 for each bed over 3

    // Bathrooms
    if (baths > 1) {
        basePrice += (baths - 1) * 25;
    }

    // Extras
    let extras = 0;
    turnoverRequirements.forEach(req => {
        if (req === 'Restock Amenities') extras += EXTRAS_PRICING['Restock Amenities'];
        // Linen is included in base price per KB
    });

    return { total: basePrice + extras };
  }
}

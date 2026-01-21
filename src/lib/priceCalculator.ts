
import { ResidentialQuoteData, CommercialQuoteData, AirbnbQuoteData } from '../types';

/**
 * PRICING RULES DEFINITIONS
 * Derived from Clean Up Bros Knowledge Base
 */

// Residential Base Prices - 2026 Sydney Market Competitive (Updated Jan 21, 2026)
// Sources: Exit Cleaners, Miracle Maid, Jim's Cleaning, Calibre, Clean Effortlessly
const RESIDENTIAL_BASE: Record<string, Record<string, number>> = {
  'General': { '1': 120, '2': 160, '3': 210, '4': 260, '5': 320 },
  'Deep': { '1': 180, '2': 240, '3': 320, '4': 400, '5': 500 },
  'End-of-Lease': { '1': 280, '2': 360, '3': 450, '4': 550, '5': 680 },
  'Post-Construction': { '1': 350, '2': 450, '3': 580, '4': 720, '5': 900 },
};

// Airbnb Turnover Prices - 2026 Sydney Market (Airtasker avg $80-180)
const AIRBNB_BASE: Record<string, number> = {
  '1': 90,
  '2': 130,
  '3': 170,
  '4': 210,
  '5': 260,
};

// Commercial Monthly Averages (Base for estimates)
// We use m2 to bucket them.
const COMMERCIAL_RATES = {
  'Medical': { small: 1000, medium: 2000, large: 3250 },
  'Office': { small: 800, medium: 1700, large: 3750 },
  'Gym': { small: 1500, medium: 2750, large: 4750 },
  'Retail': { small: 700, medium: 1550, large: 3350 },
  'Other': { small: 600, medium: 1200, large: 2500 }
};

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
  calculateCommercial(data: CommercialQuoteData): { total: number; per: string } | null {
    const { facilityType, squareMeters, cleaningFrequency } = data;
    
    if (!facilityType || !squareMeters || !cleaningFrequency) return null;
    
    const sqm = parseFloat(squareMeters);
    if (isNaN(sqm)) return null;

    // Identify Category
    let category: keyof typeof COMMERCIAL_RATES = 'Other';
    const typeLower = facilityType.toLowerCase();
    if (typeLower.includes('medical') || typeLower.includes('clinic') || typeLower.includes('doctor')) category = 'Medical';
    else if (typeLower.includes('office') || typeLower.includes('corporate')) category = 'Office';
    else if (typeLower.includes('gym') || typeLower.includes('fitness')) category = 'Gym';
    else if (typeLower.includes('retail') || typeLower.includes('shop') || typeLower.includes('store')) category = 'Retail';

    // Identify Size Bucket
    let sizeBucket: 'small' | 'medium' | 'large' = 'small';
    if (sqm < 200) sizeBucket = 'small'; // Note: Office cutoff is 100 in KB, using 200 generic to simplify
    else if (sqm < 500) sizeBucket = 'medium';
    else sizeBucket = 'large';

    // Adjust specific cutoffs for Office/Retail if needed based on KB
    if (category === 'Office' || category === 'Retail') {
        if (sqm < 100) sizeBucket = 'small';
        else if (sqm < 300) sizeBucket = 'medium';
        else sizeBucket = 'large';
    }

    let monthlyPrice = COMMERCIAL_RATES[category][sizeBucket];
    
    // Adjust by exact sqm scaling (simple linear interpolation for better accuracy)
    // This prevents a 99sqm office being same price as 10sqm
    // Use the base rate as the midpoint of the category
    
    // Frequency Multipliers for CONTRACT value
    // The KB gives Monthly prices. Usually assumes Standard Frequency (e.g. 2x/week or Weekly for small)
    // Let's adjust based on selected frequency relative to "Standard"
    
    const freqMultiplier: Record<string, number> = {
        'Daily': 2.5, // Daily is much more expensive per month than weekly
        'Weekly': 1.0, // Base
        'Fortnightly': 0.6, 
        'Monthly': 0.4
    };
    
    // Adjust monthly price by frequency
    const multiplier = freqMultiplier[cleaningFrequency] || 1.0;
    let finalPrice = monthlyPrice * multiplier;
    
    // Contract Term Discounts (KB: Frequency discounts apply, Term discounts implied in prompt text)
    if (data.contractTerm === '1 Year') finalPrice *= 0.9;
    if (data.contractTerm === '6 Months') finalPrice *= 0.95;

    return { 
        total: Math.ceil(finalPrice), 
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

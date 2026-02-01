import { describe, it, expect } from 'vitest';
import { PricingCalculator } from './priceCalculator';
import { ResidentialQuoteData } from '../types';

describe('PricingCalculator', () => {
  const calculator = new PricingCalculator();

  describe('calculateResidential', () => {
    const baseData: Partial<ResidentialQuoteData> = {
      suburb: 'Liverpool',
      propertyType: 'House',
      preferredDate: '2026-02-15',
      preferredTime: 'Morning',
      notes: '',
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '0400000000',
      agreedToTerms: true,
      subscribedToOneYearPlan: false,
      frequency: 'One-time',
    };

    it('should return a valid price for 2 bedroom standard general clean', () => {
      const result = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);
      
      expect(result).not.toBeNull();
      expect(result!.total).toBeGreaterThan(0);
      expect(result!.total).toBeLessThan(1000);
    });

    it('should charge more for Heavy condition', () => {
      const standardResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      const heavyResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Heavy',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      expect(standardResult).not.toBeNull();
      expect(heavyResult).not.toBeNull();
      expect(heavyResult!.total).toBeGreaterThan(standardResult!.total);
    });

    it('should increase price with more bedrooms', () => {
      const twoBedResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      const fourBedResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 4,
        bathrooms: 2,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      expect(twoBedResult).not.toBeNull();
      expect(fourBedResult).not.toBeNull();
      expect(fourBedResult!.total).toBeGreaterThan(twoBedResult!.total);
    });

    it('should charge more for End-of-Lease than General', () => {
      const generalResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      const bondResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'End-of-Lease',
        addOns: [],
      } as ResidentialQuoteData);

      expect(generalResult).not.toBeNull();
      expect(bondResult).not.toBeNull();
      expect(bondResult!.total).toBeGreaterThan(generalResult!.total);
    });

    it('should add price for add-ons', () => {
      const baseResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      const withAddOnsResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: ['Oven Cleaning', 'Carpet Steam Cleaning'],
      } as ResidentialQuoteData);

      expect(baseResult).not.toBeNull();
      expect(withAddOnsResult).not.toBeNull();
      expect(withAddOnsResult!.total).toBeGreaterThan(baseResult!.total);
    });

    it('should return null for Extreme condition', () => {
      const result = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Extreme',
        serviceType: 'General',
        addOns: [],
      } as ResidentialQuoteData);

      expect(result).toBeNull();
    });

    it('should apply weekly discount', () => {
      const oneTimeResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
        frequency: 'One-time',
      } as ResidentialQuoteData);

      const weeklyResult = calculator.calculateResidential({
        ...baseData,
        bedrooms: 2,
        bathrooms: 1,
        condition: 'Standard',
        serviceType: 'General',
        addOns: [],
        frequency: 'Weekly',
      } as ResidentialQuoteData);

      expect(oneTimeResult).not.toBeNull();
      expect(weeklyResult).not.toBeNull();
      expect(weeklyResult!.total).toBeLessThan(oneTimeResult!.total);
    });
  });

  describe('calculateAirbnb', () => {
    it('should return a valid price for 1 bedroom Airbnb', () => {
      const result = calculator.calculateAirbnb({
        listingUrl: 'https://airbnb.com/test',
        propertyType: 'Apartment',
        bedrooms: '1',
        bathrooms: '1',
        turnoverRequirements: [],
        accessMethod: 'Lockbox',
        preferredTurnoverTime: 'Morning',
        preferredStartDate: '2026-02-15',
        cleaningFrequency: 'On Checkout',
        contactName: 'Test',
        email: 'test@example.com',
        phone: '0400000000',
      });

      expect(result).not.toBeNull();
      expect(result!.total).toBeGreaterThan(100);
      expect(result!.total).toBeLessThan(300);
    });

    it('should charge more for more bedrooms', () => {
      const oneBedResult = calculator.calculateAirbnb({
        listingUrl: '', propertyType: 'Apartment', bedrooms: '1', bathrooms: '1',
        turnoverRequirements: [], accessMethod: 'Lockbox', preferredTurnoverTime: 'Morning',
        preferredStartDate: '', cleaningFrequency: 'On Checkout', contactName: '', email: '', phone: '',
      });

      const threeBedResult = calculator.calculateAirbnb({
        listingUrl: '', propertyType: 'House', bedrooms: '3', bathrooms: '2',
        turnoverRequirements: [], accessMethod: 'Lockbox', preferredTurnoverTime: 'Morning',
        preferredStartDate: '', cleaningFrequency: 'On Checkout', contactName: '', email: '', phone: '',
      });

      expect(oneBedResult).not.toBeNull();
      expect(threeBedResult).not.toBeNull();
      expect(threeBedResult!.total).toBeGreaterThan(oneBedResult!.total);
    });
  });
});

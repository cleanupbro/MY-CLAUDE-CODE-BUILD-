/**
 * Gift Card Service
 * Handles all gift card operations
 */

import { supabase } from '../lib/supabaseClient';
import { logGiftCardRedemption } from './googleSheetsService';

export interface GiftCard {
  id: string;
  created_at: string;
  code: string;
  type: 'digital' | 'physical' | 'prepaid';
  original_amount: number;
  bonus_amount: number;
  current_balance: number;
  purchaser_name: string;
  purchaser_email: string;
  purchaser_phone?: string;
  recipient_name?: string;
  recipient_email?: string;
  gift_message?: string;
  status: 'pending' | 'active' | 'redeemed' | 'expired' | 'cancelled';
  activated_at?: string;
  expires_at?: string;
  redeemed_by_email?: string;
  redeemed_at?: string;
  fully_redeemed_at?: string;
  square_gift_card_id?: string;
  square_gan?: string;
  square_payment_id?: string;
  notes?: string;
  metadata?: any;
}

export interface GiftCardTransaction {
  id: string;
  created_at: string;
  gift_card_id: string;
  submission_id?: string;
  type: 'purchase' | 'redemption' | 'refund' | 'adjustment' | 'activation';
  amount: number;
  balance_before: number;
  balance_after: number;
  description?: string;
  performed_by?: string;
  metadata?: any;
}

export interface CustomerCredit {
  id: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  total_purchased: number;
  total_bonus: number;
  total_redeemed: number;
  current_balance: number;
}

export interface PurchaseGiftCardData {
  amount: number;
  isGift: boolean;
  purchaserName: string;
  purchaserEmail: string;
  purchaserPhone?: string;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
}

export interface RedeemGiftCardData {
  code: string;
  submissionId: string;
  amountToRedeem: number;
  customerEmail: string;
}

/**
 * Generate a unique gift card code
 */
export const generateGiftCardCode = (): string => {
  const randomString = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CLEAN-${randomString()}-${randomString()}`;
};

/**
 * Calculate bonus amount (15%)
 */
export const calculateBonus = (amount: number): number => {
  return Math.round(amount * 0.15 * 100) / 100;
};

/**
 * Purchase a gift card
 */
export const purchaseGiftCard = async (
  data: PurchaseGiftCardData
): Promise<{ success: boolean; giftCard?: GiftCard; error?: string }> => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Supabase not configured - gift card purchase unavailable');
      return {
        success: false,
        error: 'Gift card system is temporarily unavailable. Please contact us directly.',
      };
    }

    const code = generateGiftCardCode();
    const bonusAmount = calculateBonus(data.amount);
    const totalValue = data.amount + bonusAmount;

    // Create gift card in pending status
    const { data: giftCard, error } = await supabase
      .from('gift_cards')
      .insert({
        code,
        type: data.isGift ? 'digital' : 'prepaid',
        original_amount: data.amount,
        bonus_amount: bonusAmount,
        current_balance: totalValue,
        purchaser_name: data.purchaserName,
        purchaser_email: data.purchaserEmail,
        purchaser_phone: data.purchaserPhone,
        recipient_name: data.isGift ? data.recipientName : data.purchaserName,
        recipient_email: data.isGift ? data.recipientEmail : data.purchaserEmail,
        gift_message: data.isGift ? data.giftMessage : null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, giftCard: giftCard as GiftCard };
  } catch (error) {
    console.error('Error purchasing gift card:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to purchase gift card',
    };
  }
};

/**
 * Activate a gift card (after payment confirmed)
 */
export const activateGiftCard = async (
  giftCardId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    // Update gift card status to active
    const { data: giftCard, error: updateError } = await supabase
      .from('gift_cards')
      .update({
        status: 'active',
        activated_at: new Date().toISOString(),
      })
      .eq('id', giftCardId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Create activation transaction
    const { error: transError } = await supabase
      .from('gift_card_transactions')
      .insert({
        gift_card_id: giftCardId,
        type: 'activation',
        amount: (giftCard as GiftCard).current_balance,
        balance_before: 0,
        balance_after: (giftCard as GiftCard).current_balance,
        description: 'Gift card activated',
      });

    if (transError) throw transError;

    return { success: true };
  } catch (error) {
    console.error('Error activating gift card:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to activate gift card',
    };
  }
};

/**
 * Verify a gift card by code
 */
export const verifyGiftCard = async (
  code: string
): Promise<{ success: boolean; giftCard?: GiftCard; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) throw error;

    if (!data) {
      return { success: false, error: 'Gift card not found' };
    }

    const giftCard = data as GiftCard;

    if (giftCard.status !== 'active') {
      return { success: false, error: 'Gift card is not active' };
    }

    if (giftCard.current_balance <= 0) {
      return { success: false, error: 'Gift card has zero balance' };
    }

    return { success: true, giftCard };
  } catch (error) {
    console.error('Error verifying gift card:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify gift card',
    };
  }
};

/**
 * Redeem a gift card
 */
export const redeemGiftCard = async (
  data: RedeemGiftCardData
): Promise<{ success: boolean; amountApplied?: number; newBalance?: number; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    // First verify the gift card
    const verification = await verifyGiftCard(data.code);
    if (!verification.success || !verification.giftCard) {
      return { success: false, error: verification.error };
    }

    const giftCard = verification.giftCard;
    const amountToApply = Math.min(data.amountToRedeem, giftCard.current_balance);
    const newBalance = giftCard.current_balance - amountToApply;

    // Update gift card balance
    const { error: updateError } = await supabase
      .from('gift_cards')
      .update({
        current_balance: newBalance,
        status: newBalance <= 0 ? 'redeemed' : 'active',
        redeemed_by_email: data.customerEmail,
        redeemed_at: new Date().toISOString(),
        fully_redeemed_at: newBalance <= 0 ? new Date().toISOString() : null,
      })
      .eq('id', giftCard.id);

    if (updateError) throw updateError;

    // Create redemption transaction
    const { error: transError } = await supabase
      .from('gift_card_transactions')
      .insert({
        gift_card_id: giftCard.id,
        submission_id: data.submissionId,
        type: 'redemption',
        amount: amountToApply,
        balance_before: giftCard.current_balance,
        balance_after: newBalance,
        description: `Redeemed for booking ${data.submissionId}`,
        performed_by: data.customerEmail,
      });

    if (transError) throw transError;

    // Update customer credit
    const { error: creditError } = await supabase.rpc('update_customer_credit_balance', {
      p_email: data.customerEmail,
      p_redeemed: amountToApply,
    });

    // Ignore credit error if function doesn't exist yet
    if (creditError) console.warn('Customer credit update failed:', creditError);

    // Log to Google Sheets for backup
    logGiftCardRedemption({
      code: giftCard.code,
      originalBalance: giftCard.current_balance,
      amountRedeemed: amountToApply,
      remainingBalance: newBalance,
      bookingTotal: data.amountToRedeem,
      customerEmail: data.customerEmail,
    }, data.submissionId).catch(err => console.warn('Google Sheets logging failed:', err));

    return {
      success: true,
      amountApplied: amountToApply,
      newBalance,
    };
  } catch (error) {
    console.error('Error redeeming gift card:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to redeem gift card',
    };
  }
};

/**
 * Get gift card by code
 */
export const getGiftCardByCode = async (
  code: string
): Promise<GiftCard | null> => {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) throw error;
    return data as GiftCard;
  } catch (error) {
    console.error('Error fetching gift card:', error);
    return null;
  }
};

/**
 * Get all gift cards for admin
 */
export const getAllGiftCards = async (
  filter?: 'all' | 'active' | 'redeemed' | 'pending'
): Promise<GiftCard[]> => {
  try {
    if (!supabase) return [];

    let query = supabase
      .from('gift_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter && filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as GiftCard[]) || [];
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return [];
  }
};

/**
 * Get gift card transactions
 */
export const getGiftCardTransactions = async (
  giftCardId: string
): Promise<GiftCardTransaction[]> => {
  try {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('gift_card_transactions')
      .select('*')
      .eq('gift_card_id', giftCardId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as GiftCardTransaction[]) || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

/**
 * Get customer credit by email
 */
export const getCustomerCredit = async (
  email: string
): Promise<CustomerCredit | null> => {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('customer_credit')
      .select('*')
      .eq('customer_email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
    return data as CustomerCredit;
  } catch (error) {
    console.error('Error fetching customer credit:', error);
    return null;
  }
};

/**
 * Get gift card statistics for admin dashboard
 */
export const getGiftCardStats = async (): Promise<{
  totalSold: number;
  totalActiveBalance: number;
  activeCards: number;
  redeemedCards: number;
  pendingCards: number;
}> => {
  try {
    if (!supabase) {
      return {
        totalSold: 0,
        totalActiveBalance: 0,
        activeCards: 0,
        redeemedCards: 0,
        pendingCards: 0,
      };
    }

    const { data, error } = await supabase
      .from('gift_card_summary')
      .select('*')
      .single();

    if (error) throw error;

    return {
      totalSold: parseFloat(data.total_sold || '0'),
      totalActiveBalance: parseFloat(data.total_active_balance || '0'),
      activeCards: parseInt(data.active_cards || '0'),
      redeemedCards: parseInt(data.redeemed_cards || '0'),
      pendingCards: parseInt(data.pending_cards || '0'),
    };
  } catch (error) {
    console.error('Error fetching gift card stats:', error);
    return {
      totalSold: 0,
      totalActiveBalance: 0,
      activeCards: 0,
      redeemedCards: 0,
      pendingCards: 0,
    };
  }
};

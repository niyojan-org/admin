import { useState, useEffect, useCallback } from 'react';
import api from '../../../../../lib/api';
import { toast } from 'sonner';

export default function useShareManagement(eventId) {
    const [shareUrl, setShareUrl] = useState('');

    const [copied, setCopied] = useState(false);

    const [event, setEvent] = useState(null);
    const [organization, setOrganization] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [referrals, setReferrals] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [referral, setReferral] = useState(null);
    const [coupon, setCoupon] = useState(null);


    // Fetch event data
    const fetchEvent = useCallback(async () => {
        if (!eventId) return;
        try {
            setLoading(true);
            const response = await api.get(`/events/admin/${eventId}`);
            setEvent(response.data.data.event);
            setOrganization(response.data.data.organization);
            // Generate share URL based on event data
            const baseUrl = 'https://orgatick.in';
            setShareUrl(`${baseUrl}/events/${eventId}/registration`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load event data. Please try again later.');
            setError(err.response?.data?.message || 'Failed to fetch event');
        } finally {
            setLoading(false);
        }
    }, [eventId]);


    // Fetch referrals for the event
    const fetchReferrals = useCallback(async () => {
        if (!eventId) return;
        try {
            const response = await api.get(`/events/admin/referral/${eventId}`);
            const referralsData = response.data?.referrals || [];
            setReferrals(Array.isArray(referralsData) ? referralsData : []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load referrals.');
            setReferrals([]);
        }
    }, [eventId]);


    // Fetch coupons for the event
    const fetchCoupons = useCallback(async () => {
        if (!eventId) return;
        try {
            const response = await api.get(`/events/admin/coupon/${eventId}`);
            const couponsData = response.data?.coupons || response.data || [];
            setCoupons(Array.isArray(couponsData) ? couponsData : []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load coupons.');
            setCoupons([]);
        }
    }, [eventId]);

    const copyToClipboard = (url = shareUrl) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const selectCoupon = (couponId) => {
        const selected = coupons.find(coupon => coupon._id === couponId);
        setCoupon(selected);

        // Update URL with coupon code
        if (selected && selected.code) {
            const baseUrl = 'https://orgatick.in';
            const currentUrl = new URL(`${baseUrl}/events/${eventId}/registration`);

            // Remove existing referral if any
            currentUrl.searchParams.delete('ref');

            // Add or update coupon parameter
            currentUrl.searchParams.set('coupon', selected.code);
            setShareUrl(currentUrl.toString());
        }
    }

    const selectReferral = (referralId) => {
        const selected = referrals.find(referral => referral._id === referralId);
        setReferral(selected);

        // Update URL with referral code
        if (selected && selected.code) {
            const baseUrl = 'https://orgatick.in';
            const currentUrl = new URL(`${baseUrl}/events/${eventId}/registration`);

            // Remove existing coupon if any
            currentUrl.searchParams.delete('coupon');

            // Add or update referral parameter
            currentUrl.searchParams.set('ref', selected.code);
            setShareUrl(currentUrl.toString());
        }
    };

    const clearSelections = () => {
        setCoupon(null);
        setReferral(null);

        // Reset URL to base URL without parameters
        const baseUrl = 'https://orgatick.in';
        setShareUrl(`${baseUrl}/events/${eventId}/registration`);
    };

    useEffect(() => {
        if (eventId) {
            fetchEvent();
            fetchReferrals();
            fetchCoupons();
        }
    }, [eventId, fetchEvent, fetchReferrals, fetchCoupons]);

    return {
        event,
        organization,
        shareUrl,
        copied,
        copyToClipboard,
        loading,
        error,
        referrals,
        coupons,
        referral,
        coupon,
        clearSelections,
        // Selection handlers
        selectCoupon,
        selectReferral,
    };
}

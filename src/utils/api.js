/**
 * VantiQuity Pulse — API Client
 * 
 * Handles all communication with the FastAPI backend.
 * Supports dual payment gateways: Razorpay (India) + Stripe (International)
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Anonymous device ID (persisted in localStorage)
function getDeviceId() {
    let id = localStorage.getItem('vp_device_id')
    if (!id) {
        id = 'vp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('vp_device_id', id)
    }
    return id
}

/**
 * POST /api/scan/process
 * Send RGB signal arrays to backend for rPPG processing.
 */
export async function processScan(red, green, blue, fps = 30) {
    const res = await fetch(`${API_BASE}/api/scan/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            red,
            green,
            blue,
            fps,
            device_id: getDeviceId(),
        }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Processing failed' }))
        throw new Error(err.detail || 'Scan processing failed')
    }

    return res.json()
}

/**
 * GET /api/scan/history
 * Fetch user's past scans.
 */
export async function getScanHistory() {
    const res = await fetch(`${API_BASE}/api/scan/history?device_id=${getDeviceId()}`)
    if (!res.ok) throw new Error('Failed to load history')
    return res.json()
}

/**
 * GET /api/scan/{id}
 * Fetch a single scan's details.
 */
export async function getScanById(scanId) {
    const res = await fetch(`${API_BASE}/api/scan/${scanId}`)
    if (!res.ok) throw new Error('Scan not found')
    return res.json()
}

/**
 * GET /api/scan/{id}/report
 * Download PDF report for a scan.
 */
export async function downloadReport(scanId) {
    const res = await fetch(`${API_BASE}/api/scan/${scanId}/report`)
    if (!res.ok) throw new Error('Failed to generate report')

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `VantiQuity_Pulse_Report_${scanId}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}


// ========== RAZORPAY GATEWAY ==========

/**
 * POST /api/payment/create-order
 * Create a Razorpay payment order.
 */
export async function createPaymentOrder(scanId, paymentType = 'scan') {
    const res = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            scan_id: scanId,
            payment_type: paymentType,
            device_id: getDeviceId(),
        }),
    })

    if (!res.ok) throw new Error('Failed to create payment order')
    return res.json()
}

/**
 * POST /api/payment/verify
 * Verify Razorpay payment.
 */
export async function verifyPayment(orderId, paymentId, signature, scanId) {
    const res = await fetch(`${API_BASE}/api/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
            scan_id: scanId,
        }),
    })

    if (!res.ok) throw new Error('Payment verification failed')
    return res.json()
}

/**
 * Open Razorpay checkout modal.
 */
export function openRazorpayCheckout(orderData, scanId, onSuccess) {
    const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: orderData.description,
        order_id: orderData.order_id,
        handler: async function (response) {
            try {
                await verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature,
                    scanId
                )
                if (onSuccess) onSuccess()
            } catch (e) {
                console.error('Payment verification failed:', e)
            }
        },
        prefill: {},
        theme: {
            color: '#8B5CF6',
        },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
}


// ========== STRIPE GATEWAY ==========

/**
 * POST /api/payment/stripe/create-session
 * Create a Stripe Checkout session and redirect.
 */
export async function createStripeSession(scanId, paymentType = 'scan') {
    const res = await fetch(`${API_BASE}/api/payment/stripe/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            scan_id: scanId,
            payment_type: paymentType,
            device_id: getDeviceId(),
        }),
    })

    if (!res.ok) throw new Error('Failed to create Stripe session')
    const data = await res.json()

    // Redirect to Stripe Checkout page
    if (data.url) {
        window.location.href = data.url
    }

    return data
}


export { getDeviceId }

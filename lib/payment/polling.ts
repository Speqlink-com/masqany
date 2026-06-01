/**
 * Payment Status Polling
 * Polls payment status for M-Pesa STK push with timeout handling
 */

import { apiClient } from "@/lib/api/client"

export type PaymentStatus = "pending" | "completed" | "failed" | "timeout"

export interface PaymentStatusResponse {
  status: PaymentStatus
  transactionId?: string
  message?: string
}

const POLL_INTERVAL = 2000 // 2 seconds
const MAX_POLL_DURATION = 60000 // 60 seconds

/**
 * Polls payment status until completion, failure, or timeout
 * @param paymentId - Payment ID to poll
 * @param timeoutMs - Maximum polling duration in milliseconds (default: 60s)
 * @returns Final payment status
 */
export async function pollPaymentStatus(
  paymentId: string,
  timeoutMs: number = MAX_POLL_DURATION
): Promise<PaymentStatusResponse> {
  const startTime = Date.now()
  let attempts = 0

  while (Date.now() - startTime < timeoutMs) {
    attempts++

    try {
      // Call payment status endpoint
      const response = await apiClient.get<PaymentStatusResponse>(
        `/payments/${paymentId}/status`
      )

      const { status, transactionId, message } = response.data

      // Return if payment is completed or failed
      if (status === "completed" || status === "failed") {
        console.log(`Payment ${paymentId} ${status} after ${attempts} attempts`)
        return { status, transactionId, message }
      }

      // Continue polling if still pending
      if (status === "pending") {
        await sleep(POLL_INTERVAL)
        continue
      }

      // Unknown status - treat as failed
      console.warn(`Unknown payment status: ${status}`)
      return {
        status: "failed",
        message: "Unknown payment status",
      }
    } catch (error: any) {
      console.error(`Payment polling error (attempt ${attempts}):`, error)

      // If error is 404, payment might not exist yet - continue polling
      if (error?.response?.status === 404 && Date.now() - startTime < timeoutMs) {
        await sleep(POLL_INTERVAL)
        continue
      }

      // Other errors - return failed status
      return {
        status: "failed",
        message: error?.message || "Failed to check payment status",
      }
    }
  }

  // Timeout reached
  console.log(`Payment ${paymentId} polling timed out after ${attempts} attempts`)
  return {
    status: "timeout",
    message: "Payment verification timed out. Please check your M-Pesa messages.",
  }
}

/**
 * Initiates M-Pesa STK push payment
 * @param bookingId - Booking ID
 * @param phoneNumber - Phone number in +254XXXXXXXXX format
 * @param amount - Amount to charge
 * @returns Payment ID for polling
 */
export async function initiateMpesaPayment(
  bookingId: string,
  phoneNumber: string,
  amount: number
): Promise<{ paymentId: string }> {
  try {
    const response = await apiClient.post<{ paymentId: string }>("/payments/mpesa/initiate", {
      bookingId,
      phoneNumber,
      amount,
    })

    return response.data
  } catch (error: any) {
    console.error("Failed to initiate M-Pesa payment:", error)
    throw new Error(error?.response?.data?.message || "Failed to initiate payment")
  }
}

/**
 * Initiates card payment
 * @param bookingId - Booking ID
 * @param cardToken - Card token from payment gateway
 * @param amount - Amount to charge
 * @returns Payment ID for polling
 */
export async function initiateCardPayment(
  bookingId: string,
  cardToken: string,
  amount: number
): Promise<{ paymentId: string }> {
  try {
    const response = await apiClient.post<{ paymentId: string }>("/payments/card/initiate", {
      bookingId,
      cardToken,
      amount,
    })

    return response.data
  } catch (error: any) {
    console.error("Failed to initiate card payment:", error)
    throw new Error(error?.response?.data?.message || "Failed to initiate payment")
  }
}

/**
 * Cancels a pending payment
 * @param paymentId - Payment ID to cancel
 */
export async function cancelPayment(paymentId: string): Promise<void> {
  try {
    await apiClient.post(`/payments/${paymentId}/cancel`)
  } catch (error: any) {
    console.error("Failed to cancel payment:", error)
    throw new Error(error?.response?.data?.message || "Failed to cancel payment")
  }
}

/**
 * Sleep utility for polling
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Formats payment status for display
 */
export function formatPaymentStatus(status: PaymentStatus): string {
  switch (status) {
    case "pending":
      return "Payment pending..."
    case "completed":
      return "Payment successful"
    case "failed":
      return "Payment failed"
    case "timeout":
      return "Payment verification timed out"
    default:
      return "Unknown status"
  }
}

/**
 * Gets user-friendly message for payment status
 */
export function getPaymentStatusMessage(status: PaymentStatus, message?: string): string {
  if (message) return message

  switch (status) {
    case "pending":
      return "Please complete the payment on your phone"
    case "completed":
      return "Your payment has been processed successfully"
    case "failed":
      return "Payment failed. Please try again"
    case "timeout":
      return "Payment verification timed out. Check your M-Pesa messages and contact support if payment was deducted"
    default:
      return "Unknown payment status"
  }
}

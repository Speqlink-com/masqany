/**
 * WebSocket client — PLACEHOLDER.
 *
 * This module will provide real-time communication for:
 *   - Chat messages (peer-to-peer property inquiries)
 *   - Live property availability updates
 *   - Booking status changes
 *   - AI agent streaming responses
 *
 * Implementation plan:
 *   1. Connect on user authentication using the access token
 *   2. Reconnect automatically with exponential backoff
 *   3. Dispatch incoming messages to the appropriate Zustand store or
 *      invalidate the relevant TanStack Query cache key
 *   4. Disconnect cleanly on logout
 *
 * Candidate libraries: @stomp/stompjs (if backend uses STOMP/RabbitMQ),
 * socket.io-client (if backend uses Socket.IO), or native WebSocket API.
 *
 * TODO: implement when backend WebSocket service is ready.
 */

export const wsClient = {
  connect: (_token: string) => {
    // TODO: establish WebSocket connection
    console.warn("[wsClient] WebSocket not yet implemented");
  },
  disconnect: () => {
    // TODO: close connection
  },
  send: (_event: string, _payload: unknown) => {
    // TODO: send message
  },
};

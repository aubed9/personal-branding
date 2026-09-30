Type: grilling
Status: resolved
Blocked by: none

# Issue 01: Live AI Key Governance & Client Proxy Architecture

## Question

How should Gemini API keys and AI endpoints be governed and secured in public web deployments to prevent API key leakage while enabling seamless live dynamic questioning for end users?

## Answer

### Locked Strategic Decision: 3-Tier Security Governance Architecture

We lock the following 3-tier security policy across the DIGITAL MARKET platform:

1. **Tier 1: Zero-Key Local Deterministic Engine (Default)**
   - The platform must function with 100% fidelity without requiring any API key or external network connection.
   - All 15 axes, dynamic chaining, conflict detection, 49 wiki node grounding, and financial calculations execute deterministically client-side.
   - Zero onboarding barrier for privacy-sensitive Iranian businesses.

2. **Tier 2: Ephemeral BYOK (Bring Your Own Key) in Session Memory**
   - End users and branding consultants who desire real-time Gemini AI question rewrites can provide their own Gemini API key via the Settings Modal.
   - Security constraints:
     - The key is saved exclusively in `sessionStorage` (cleared on tab close).
     - Export functions (`exportProjectJSON`) rigorously sanitize and strip all credential fields.
     - Never written to `.env` or bundled in Vite production build.

3. **Tier 3: Enterprise Backend Proxy Specification (`/api/v1/ai/rewrite`)**
   - For managed client deployments, the frontend connects to a secure reverse proxy endpoint using `CustomEndpointProvider`.
   - The proxy holds the server-side API key, enforces IP rate-limiting (maximum 12 requests/minute/IP), validates CORS headers, and blocks untrusted endpoints.

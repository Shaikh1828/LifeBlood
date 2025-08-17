// jwtUtils.ts
interface DecodedToken {
  sub: string; // userId (subject)
  role: string;
  iat: number; // issued at
  exp: number; // expiration
}

export const jwtUtils = {
  // Decode JWT token without verification (client-side)
  decodeToken: (token: string): DecodedToken | null => {
    try {
      // JWT has 3 parts: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      // Decode the payload (base64url)
      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      const parsedPayload = JSON.parse(decodedPayload);

      return parsedPayload as DecodedToken;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  },

  // Get user ID from token
  getUserId: (): string | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found in localStorage');
        return null;
      }

      const decoded = jwtUtils.decodeToken(token);
      if (!decoded) {
        console.error('Failed to decode token');
        return null;
      }

      return decoded.sub; // subject contains userId
    } catch (error) {
      console.error('Error getting user ID from token:', error);
      return null;
    }
  },

  // Get user role from token
  getUserRole: (): string | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found in localStorage');
        return null;
      }

      const decoded = jwtUtils.decodeToken(token);
      if (!decoded) {
        console.error('Failed to decode token');
        return null;
      }

      return decoded.role;
    } catch (error) {
      console.error('Error getting user role from token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return true;

      const decoded = jwtUtils.decodeToken(token);
      if (!decoded) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Get complete token info
  getTokenInfo: () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const decoded = jwtUtils.decodeToken(token);
      if (!decoded) return null;

      return {
        userId: decoded.sub,
        role: decoded.role,
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000),
        isExpired: jwtUtils.isTokenExpired()
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }
};
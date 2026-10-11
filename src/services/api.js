const API_BASE = "/api";
function getAuthHeaders() {
  const token = localStorage.getItem("movebandhu_token") || localStorage.getItem("movemate_token");
  return {
    "Content-Type": "application/json",
    ...token ? { Authorization: `Bearer ${token}` } : {}
  };
}
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}
export const api = {
  // Auth
  auth: {
    async login(email, password) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },
    async register(payload) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    async me() {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async updateProfile(payload) {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    }
  },
  // Inquiries
  inquiries: {
    async create(data) {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    async list() {
      const res = await fetch(`${API_BASE}/inquiries`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async getById(id) {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async updateStatus(id, status) {
      const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    }
  },
  // Bookings
  bookings: {
    async create(data) {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    async list() {
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async getById(id) {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async updateStatus(id, status, note, finalCost) {
      const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note, finalCost })
      });
      return handleResponse(res);
    },
    async assignPartner(bookingId, partnerId) {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/assign-partner`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ partnerId })
      });
      return handleResponse(res);
    },
    async cancel(id) {
      const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },
  // Pricing
  pricing: {
    async getRules() {
      const res = await fetch(`${API_BASE}/pricing`);
      return handleResponse(res);
    },
    async calculate(data) {
      const res = await fetch(`${API_BASE}/pricing/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    async updateRules(rules) {
      const res = await fetch(`${API_BASE}/pricing`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(rules)
      });
      return handleResponse(res);
    }
  },
  // Services
  services: {
    async list() {
      const res = await fetch(`${API_BASE}/services`);
      return handleResponse(res);
    },
    async update(id, data) {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },
  // Partners
  partners: {
    async list() {
      const res = await fetch(`${API_BASE}/partners`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async getMyProfile() {
      const res = await fetch(`${API_BASE}/partners/my-profile`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async updateAvailability(isAvailable) {
      const res = await fetch(`${API_BASE}/partners/availability`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable })
      });
      return handleResponse(res);
    },
    async updateStatus(id, status) {
      const res = await fetch(`${API_BASE}/partners/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    }
  },
  // Reviews
  reviews: {
    async list() {
      const res = await fetch(`${API_BASE}/reviews`);
      return handleResponse(res);
    },
    async submit(data) {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },
  // Admin
  admin: {
    async getStats() {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async getUsers() {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async getRevenueAnalytics() {
      const res = await fetch(`${API_BASE}/admin/revenue-analytics`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    async getAuditLogs() {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getExportCsvUrl() {
      const token = localStorage.getItem("movebandhu_token") || localStorage.getItem("movemate_token");
      return `${API_BASE}/admin/export/bookings-csv?token=${token}`;
    },
    getExportAuditLogsCsvUrl() {
      const token = localStorage.getItem("movebandhu_token") || localStorage.getItem("movemate_token");
      return `${API_BASE}/admin/export/audit-logs-csv?token=${token}`;
    }
  }
};

// Canonical reference of all 36 Indian States and Union Territories
// Compatible with @svg-maps/india territory IDs and national reporting standards

export const INDIAN_STATES = [
  { id: 'an', code: 'AN', name: 'Andaman & Nicobar Islands', zone: 'South' },
  { id: 'ap', code: 'AP', name: 'Andhra Pradesh', zone: 'South' },
  { id: 'ar', code: 'AR', name: 'Arunachal Pradesh', zone: 'North-East' },
  { id: 'as', code: 'AS', name: 'Assam', zone: 'North-East' },
  { id: 'br', code: 'BR', name: 'Bihar', zone: 'East' },
  { id: 'ch', code: 'CH', name: 'Chandigarh', zone: 'North' },
  { id: 'ct', code: 'CG', name: 'Chhattisgarh', zone: 'Central' },
  { id: 'dd', code: 'DD', name: 'Daman & Diu', zone: 'West' },
  { id: 'dl', code: 'DL', name: 'Delhi NCR', zone: 'North' },
  { id: 'dn', code: 'DN', name: 'Dadra & Nagar Haveli', zone: 'West' },
  { id: 'ga', code: 'GA', name: 'Goa', zone: 'West' },
  { id: 'gj', code: 'GJ', name: 'Gujarat', zone: 'West' },
  { id: 'hp', code: 'HP', name: 'Himachal Pradesh', zone: 'North' },
  { id: 'hr', code: 'HR', name: 'Haryana', zone: 'North' },
  { id: 'jh', code: 'JH', name: 'Jharkhand', zone: 'East' },
  { id: 'jk', code: 'JK', name: 'Jammu & Kashmir / Ladakh', zone: 'North' },
  { id: 'ka', code: 'KA', name: 'Karnataka', zone: 'South' },
  { id: 'kl', code: 'KL', name: 'Kerala', zone: 'South' },
  { id: 'ld', code: 'LD', name: 'Lakshadweep', zone: 'South' },
  { id: 'mh', code: 'MH', name: 'Maharashtra', zone: 'West' },
  { id: 'ml', code: 'ML', name: 'Meghalaya', zone: 'North-East' },
  { id: 'mn', code: 'MN', name: 'Manipur', zone: 'North-East' },
  { id: 'mp', code: 'MP', name: 'Madhya Pradesh', zone: 'Central' },
  { id: 'mz', code: 'MZ', name: 'Mizoram', zone: 'North-East' },
  { id: 'nl', code: 'NL', name: 'Nagaland', zone: 'North-East' },
  { id: 'or', code: 'OD', name: 'Odisha', zone: 'East' },
  { id: 'pb', code: 'PB', name: 'Punjab', zone: 'North' },
  { id: 'py', code: 'PY', name: 'Puducherry', zone: 'South' },
  { id: 'rj', code: 'RJ', name: 'Rajasthan', zone: 'North' },
  { id: 'sk', code: 'SK', name: 'Sikkim', zone: 'North-East' },
  { id: 'tg', code: 'TG', name: 'Telangana', zone: 'South' },
  { id: 'tn', code: 'TN', name: 'Tamil Nadu', zone: 'South' },
  { id: 'tr', code: 'TR', name: 'Tripura', zone: 'North-East' },
  { id: 'up', code: 'UP', name: 'Uttar Pradesh', zone: 'North' },
  { id: 'ut', code: 'UK', name: 'Uttarakhand', zone: 'North' },
  { id: 'wb', code: 'WB', name: 'West Bengal', zone: 'East' }
].sort((a, b) => a.name.localeCompare(b.name))

export const INDIAN_STATES_LOOKUP = INDIAN_STATES.reduce((acc, st) => {
  acc[st.id.toLowerCase()] = st
  acc[st.code.toUpperCase()] = st
  acc[st.name.toLowerCase()] = st
  return acc
}, {})

export function findStateInfo(key) {
  if (!key) return null
  const cleaned = String(key).trim().toLowerCase()
  return INDIAN_STATES_LOOKUP[cleaned] || null
}

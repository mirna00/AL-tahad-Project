export const permission = {
  Admin: {
    managment: ["read", "create", "update", "delete"],
    travel: ["read", "create", "update", "delete"],
    envelope: ["read", "create", "update", "delete"],
    university: ["read", "create", "update", "delete"],
    shipment: ["read", "create", "update", "delete"],
  },
  "Travel Trips Employee": {
    travel: ["read", "create", "update", "delete"],
    envelope: ["read", "create", "update", "delete"],
  },
  "University trips Employee": {
    university: ["read", "create", "update", "delete"],
  },
  "Shipment Employee": {
    shipment: ["read", "create", "update", "delete"],
  },
};

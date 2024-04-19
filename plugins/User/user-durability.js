const DURABILITY_THRESHOLD = 1;
const REPAIR_AMOUNT = 30;

export function before(m) {
  const user = global.db.data.users[m.sender];

  const durabilityProperties = {
    sword: { durabilityKey: 'sworddurability', baseItemKey: 'sword' },
    pickaxe: { durabilityKey: 'pickaxedurability', baseItemKey: 'pickaxe' },
    armor: { durabilityKey: 'armordurability', baseItemKey: 'armor' },
  };

  for (const [property, { durabilityKey, baseItemKey }] of Object.entries(durabilityProperties)) {
    if (user[property] > 0) {
      if (user[durabilityKey] < DURABILITY_THRESHOLD) {
        user[durabilityKey] = REPAIR_AMOUNT;
        user[baseItemKey] -= 1;
      }
    }
    if (user[baseItemKey] === 0) {
      user[durabilityKey] = 0;
    }
  }

  // Health constraints
  user.health = Math.max(0, Math.min(user.health, 100));
}

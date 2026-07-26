/**
 * Generate a bcrypt hash for the admin password.
 *
 *   npm run hash -- "your-strong-password"
 *
 * Copy the printed hash into ADMIN_PASSWORD_HASH in your .env (and Vercel).
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash -- "your-strong-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nADMIN_PASSWORD_HASH=" + JSON.stringify(hash) + "\n");

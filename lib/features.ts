/**
 * Public feature flags (no heavy imports — safe for client, server, middleware).
 *
 * COURSES_ENABLED: show the public Online Courses section (the /courses pages,
 * the header/nav links, the home "Udemy Courses" rail, sitemap entries and the
 * bot's course flows). Hidden by default while the Udemy/Impact partnership is
 * pending — set NEXT_PUBLIC_COURSES_ENABLED="true" to bring it back. Admin course
 * management stays available regardless.
 */
export const COURSES_ENABLED = process.env.NEXT_PUBLIC_COURSES_ENABLED === "true";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes anyone can hit without signing in: the marketing site, the auth
 * pages themselves, the style guide, and public API routes (e.g. webhooks).
 * Everything else — /dashboard, /library, /crates, /set-planner, /profile,
 * /settings, and their sub-routes — requires a session.
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/style-guide(.*)",
  "/search(.*)",
  "/track(.*)",
  "/api/tracks(.*)",
  "/api/webhooks(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except static assets and Next internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

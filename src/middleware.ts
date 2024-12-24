import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
    matcher: [
      // 1) Exclude any request that starts with /_next or /2048-game
      //    or has a . in the path (e.g. .js, .png, .html).
      // 2) This means those won't run through Clerk.
      '/((?!_next|public/2048|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  
      // 3) Always run for API routes
      '/(api|trpc)(.*)',
    ],
  };
  
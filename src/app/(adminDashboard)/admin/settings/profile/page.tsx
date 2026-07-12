/* The user dashboard's profile screen is route-agnostic — its BackLink just
   calls router.back() — so the admin reuses it rather than forking a copy. */
export { default } from "@/app/(userDashboard)/user-dashboard/settings/profile/page";

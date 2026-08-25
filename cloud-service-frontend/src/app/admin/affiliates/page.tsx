import PartnerRequestsPage from '@/app/admin/partner-requests/page';

export default function AdminAffiliatesPage() {
    return <PartnerRequestsPage />;
}

// The canonical affiliate workflow is implemented by PartnerRequestsPage,
// which reads PartnerRequests from the API and persists status changes server-side.

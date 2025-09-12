import TicketTable from "../pages/ticketTable";

const Ticket = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Service Tickets
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and track customer service complaints and warranty claims
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">Admin Dashboard</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TicketTable isAdmin={true} />
      </div>
    </div>
  );
};

export default Ticket;

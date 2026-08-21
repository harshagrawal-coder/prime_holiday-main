import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import {
  getAdminContacts,
  deleteContact,
  updateContactStatus,
} from "../../services/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const itemsPerPage = 10;
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search,
        status: statusFilter !== "all" ? statusFilter : "",
      };
      const response = await getAdminContacts(params);
      console.log(response.data.data);
      setContacts(response.data.data || response.data || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalContacts(response.data.totalContacts || response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContacts();
  }, [currentPage, search, statusFilter]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      await deleteContact(id);
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus);
      fetchContacts();
    } catch (error) {
      console.error("Failed to update contact status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const filteredContacts = contacts;
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Contact Inquiries
          </h1>
          <p className="text-sm text-slate-500">
            Manage customer inquiries from the contact page
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 rounded-lg border border-slate-200 py-2 pl-4 pr-10 text-sm focus:border-orange-500 focus:outline-none appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <FaEnvelope className="mx-auto text-3xl text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">
              No contact inquiries found.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">
                          {contact.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-600">
                          {contact.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-600">
                          {contact.phone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-600">
                          {contact.destination ? (
                            <>
                              <FaMapMarkerAlt
                                className="inline mr-1 text-slate-400"
                                size={12}
                              />
                              {contact.destination}
                            </>
                          ) : (
                            <span className="text-slate-400">
                              Not specified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-600">
                          {contact.travelDate ? (
                            <>
                              <FaCalendarAlt
                                className="inline mr-1 text-slate-400"
                                size={12}
                              />
                              {new Date(contact.travelDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400">Flexible</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={contact.status || "new"}
                          onChange={(e) =>
                            handleStatusChange(contact._id, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-orange-500 transition"
                            title="View details"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalContacts)} of{" "}
                  {totalContacts} contacts
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-slate-800">
                Contact Details
              </h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Name
                  </label>
                  <p className="text-slate-800">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Email
                  </label>
                  <p className="text-slate-800">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Phone
                  </label>
                  <p className="text-slate-800">{selectedContact.phone}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedContact.status === "new"
                        ? "bg-orange-100 text-orange-800"
                        : selectedContact.status === "read"
                          ? "bg-blue-100 text-blue-800"
                          : selectedContact.status === "replied"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {selectedContact.status || "new"}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Destination
                  </label>
                  <p className="text-slate-800 flex items-center gap-1">
                    {selectedContact.destination ? (
                      <>
                        <FaMapMarkerAlt className="text-slate-400" size={14} />
                        {selectedContact.destination}
                      </>
                    ) : (
                      <span className="text-slate-400">Not specified</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500">
                    Travel Date
                  </label>
                  <p className="text-slate-800 flex items-center gap-1">
                    {selectedContact.travelDate ? (
                      <>
                        <FaCalendarAlt className="text-slate-400" size={14} />
                        {new Date(
                          selectedContact.travelDate,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </>
                    ) : (
                      <span className="text-slate-400">Flexible</span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500">
                  Message
                </label>
                <div className="mt-1 p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-500">
                  Submitted
                </label>
                <p className="text-slate-800">
                  {formatDate(
                    selectedContact.createdAt || selectedContact.submittedAt,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;

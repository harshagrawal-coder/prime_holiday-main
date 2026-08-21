import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { API_URI } from "../../config/config";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URI}/auth/get-userCount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.fullname} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>

          <p className="text-sm text-slate-500">Manage registered users</p>
        </div>

        <div className="rounded-lg bg-slate-100 px-4 py-2">
          <span className="text-sm text-slate-500">Total Users</span>

          <span className="ml-2 font-semibold text-slate-800">
            {users.length}
          </span>
        </div>
      </div>

      {/* Users container */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Search */}
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Users */}
        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
              >
                {/* User information */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
                    {user.fullname?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </h3>

                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">
              {users.length === 0 ? "No users yet." : "No users found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;

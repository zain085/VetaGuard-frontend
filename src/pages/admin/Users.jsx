import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ROLES = ["", "owner", "vet", "shelter", "admin"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (role) params.role = role;
    adminService
      .listUsers(params)
      .then(({ data }) => setUsers(data.users))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleStatus = async (user) => {
    try {
      await adminService.setUserStatus(user._id, !user.isActive);
      toast.success(`User ${!user.isActive ? "activated" : "deactivated"}`);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update user");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Users</h1>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-40">
          {ROLES.map((r) => <option key={r || "all"} value={r}>{r || "All roles"}</option>)}
        </select>
        <button onClick={load} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Search</button>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface theme-transition">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-text">{u.name}</td>
                  <td className="px-4 py-3 text-text-muted">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-text-muted">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => toggleStatus(u)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:border-primary"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

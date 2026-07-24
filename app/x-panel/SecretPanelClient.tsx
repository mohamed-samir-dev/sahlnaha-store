"use client";
import { useState, useEffect, useCallback } from "react";

type DeviceLog = {
  _id: string;
  fingerprint: string | null;
  ip: string | null;
  userAgent: string | null;
  path: string | null;
  country: string | null;
  label: string | null;
  buyerName: string | null;
  firstSeen: string;
  lastSeen: string;
  requestsCount: number;
};

type BlockedDevice = {
  _id: string;
  fingerprint: string | null;
  ip: string | null;
  userAgent: string | null;
  reason: string;
  isActive: boolean;
  createdAt: string;
};

export default function SecretPanelClient() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"logs" | "blocked">("logs");

  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [blocked, setBlocked] = useState<BlockedDevice[]>([]);
  const [loading, setLoading] = useState(false);

  // Block form
  const [blockForm, setBlockForm] = useState({ fingerprint: "", ip: "", userAgent: "", reason: "" });

  // Edit label
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editBuyer, setEditBuyer] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/secret/device-logs");
    if (r.ok) setLogs(await r.json());
    setLoading(false);
  }, []);

  const fetchBlocked = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/secret/blocked-devices");
    if (r.ok) setBlocked(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    if (tab === "logs") fetchLogs();
    else fetchBlocked();
  }, [authed, tab, fetchLogs, fetchBlocked]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/secret/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) { setAuthed(true); setLoginError(""); }
    else setLoginError("كلمة المرور خاطئة");
  }

  async function blockDevice(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/secret/blocked-devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blockForm),
    });
    setBlockForm({ fingerprint: "", ip: "", userAgent: "", reason: "" });
    fetchBlocked();
  }

  async function toggleBlock(id: string) {
    await fetch(`/api/secret/blocked-devices/${id}/toggle`, { method: "PATCH" });
    fetchBlocked();
  }

  async function deleteBlock(id: string) {
    if (!confirm("حذف هذا الجهاز من القائمة؟")) return;
    await fetch(`/api/secret/blocked-devices/${id}`, { method: "DELETE" });
    fetchBlocked();
  }

  async function deleteLog(id: string) {
    if (!confirm("حذف هذا السجل؟")) return;
    await fetch(`/api/secret/device-logs/${id}`, { method: "DELETE" });
    fetchLogs();
  }

  async function saveEdit(id: string) {
    await fetch(`/api/secret/device-logs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editLabel, buyerName: editBuyer }),
    });
    setEditId(null);
    fetchLogs();
  }

  function blockFromLog(log: DeviceLog) {
    setBlockForm({
      fingerprint: log.fingerprint || "",
      ip: log.ip || "",
      userAgent: log.userAgent || "",
      reason: "",
    });
    setTab("blocked");
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl w-80 space-y-4">
          <h1 className="text-white text-xl font-bold text-center">🔒 Secret Panel</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none"
            dir="rtl"
          />
          {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4 text-center">🔒 Secret Panel</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        {(["logs", "blocked"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${tab === t ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}
          >
            {t === "logs" ? "سجل الزوار" : "الأجهزة المحظورة"}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400">جاري التحميل...</p>}

      {/* ── Device Logs ── */}
      {tab === "logs" && !loading && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                {["IP", "Fingerprint", "Path", "الزيارات", "آخر زيارة", "التسمية", "المشتري", ""].map((h) => (
                  <th key={h} className="px-3 py-2 text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="px-3 py-2 font-mono text-xs">{log.ip || "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs max-w-[120px] truncate">{log.fingerprint || "—"}</td>
                  <td className="px-3 py-2 text-xs max-w-[150px] truncate">{log.path || "—"}</td>
                  <td className="px-3 py-2 text-center">{log.requestsCount}</td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(log.lastSeen).toLocaleString("ar-SA")}</td>
                  <td className="px-3 py-2">
                    {editId === log._id ? (
                      <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded text-xs w-24" />
                    ) : (
                      <span className="text-yellow-400">{log.label || "—"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editId === log._id ? (
                      <input value={editBuyer} onChange={(e) => setEditBuyer(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded text-xs w-24" />
                    ) : (
                      <span className="text-green-400">{log.buyerName || "—"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {editId === log._id ? (
                        <>
                          <button onClick={() => saveEdit(log._id)} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs">حفظ</button>
                          <button onClick={() => setEditId(null)} className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs">إلغاء</button>
                        </>
                      ) : (
                        <button onClick={() => { setEditId(log._id); setEditLabel(log.label || ""); setEditBuyer(log.buyerName || ""); }}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs">تعديل</button>
                      )}
                      <button onClick={() => blockFromLog(log)} className="bg-orange-600 hover:bg-orange-700 px-2 py-1 rounded text-xs">حظر</button>
                      <button onClick={() => deleteLog(log._id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && <p className="text-center text-gray-500 mt-8">لا توجد سجلات</p>}
        </div>
      )}

      {/* ── Blocked Devices ── */}
      {tab === "blocked" && !loading && (
        <div className="space-y-6">
          {/* Add form */}
          <form onSubmit={blockDevice} className="bg-gray-900 p-4 rounded-xl grid grid-cols-2 gap-3 max-w-2xl mx-auto">
            <h2 className="col-span-2 font-semibold text-gray-300">حظر جهاز جديد</h2>
            {[
              { key: "fingerprint", label: "Fingerprint" },
              { key: "ip", label: "IP" },
              { key: "userAgent", label: "User Agent" },
              { key: "reason", label: "السبب" },
            ].map(({ key, label }) => (
              <input
                key={key}
                placeholder={label}
                value={blockForm[key as keyof typeof blockForm]}
                onChange={(e) => setBlockForm((p) => ({ ...p, [key]: e.target.value }))}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm outline-none"
              />
            ))}
            <button className="col-span-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold">
              حظر
            </button>
          </form>

          {/* List */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  {["IP", "Fingerprint", "السبب", "الحالة", "التاريخ", ""].map((h) => (
                    <th key={h} className="px-3 py-2 text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blocked.map((b) => (
                  <tr key={b._id} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="px-3 py-2 font-mono text-xs">{b.ip || "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs max-w-[120px] truncate">{b.fingerprint || "—"}</td>
                    <td className="px-3 py-2 text-xs">{b.reason || "—"}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.isActive ? "bg-red-900 text-red-300" : "bg-gray-700 text-gray-400"}`}>
                        {b.isActive ? "محظور" : "معطّل"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs whitespace-nowrap">{new Date(b.createdAt).toLocaleDateString("ar-SA")}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => toggleBlock(b._id)}
                          className={`px-2 py-1 rounded text-xs ${b.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}>
                          {b.isActive ? "تعطيل" : "تفعيل"}
                        </button>
                        <button onClick={() => deleteBlock(b._id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blocked.length === 0 && <p className="text-center text-gray-500 mt-8">لا توجد أجهزة محظورة</p>}
          </div>
        </div>
      )}
    </div>
  );
}

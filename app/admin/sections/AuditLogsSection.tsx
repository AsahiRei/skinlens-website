"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileText, History, Search } from "lucide-react";
import { getAuditLogsAction } from "../data-actions";

export function AuditLogsSection() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        setIsLoading(true);
        const data = await getAuditLogsAction();
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load logs");
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-4 border-[#E5EDE8] border-t-[#15803D] rounded-full animate-spin" />
        <p className="text-[14px] text-[#3F4A44]">Loading audit logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[20px] font-semibold text-[#10241A]">Audit Logs</h2>
          <p className="text-[14px] text-[#3F4A44] mt-1">Record of all administrative changes.</p>
        </div>
        <div className="p-2 bg-white border border-[#E5EDE8] rounded-full text-[#15803D]">
          <History size={20} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E5EDE8] bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FBFA] border-b border-[#E5EDE8]">
              <th className="px-4 py-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Entity</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Changes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EDE8]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[14px] text-[#6B7280]">
                  No logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FBFA] transition-colors">
                  <td className="px-4 py-3 text-[13px] text-[#3F4A44] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#EAF6EE] text-[#15803D] text-[11px] font-bold border border-[#DCFCE7]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#3F4A44]">
                    <span className="font-medium">{log.entity_type}</span>
                    <span className="text-[#9CA3AF] ml-1 text-[11px]">
                      {log.entity_id?.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {log.old_value && (
                        <div className="text-[11px] text-[#6B7280] italic">
                          From: {JSON.stringify(log.old_value)}
                        </div>
                      )}
                      {log.new_value && (
                        <div className="text-[11px] text-[#15803D] font-medium">
                          To: {JSON.stringify(log.new_value)}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

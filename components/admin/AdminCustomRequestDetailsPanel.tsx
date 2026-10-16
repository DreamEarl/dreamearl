"use client";

import { useState } from "react";
import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import CustomRequestStatusBadge from "@/components/account/CustomRequestStatusBadge";
import {
  formatCustomRequestDate,
  getCustomRequestImages,
} from "@/lib/customRequests/status";
import { CUSTOM_REQUEST_STATUSES } from "@/lib/customRequests/types";
import type {
  CustomRequest,
  CustomRequestStatus,
} from "@/lib/customRequests/types";

interface AdminCustomRequestDetailsPanelProps {
  customRequest: CustomRequest;
}

export default function AdminCustomRequestDetailsPanel({
  customRequest: initialRequest,
}: Readonly<AdminCustomRequestDetailsPanelProps>) {
  const [customRequest, setCustomRequest] = useState(initialRequest);
  const [selectedStatus, setSelectedStatus] = useState<CustomRequestStatus>(
    initialRequest.status,
  );
  const [declineReason, setDeclineReason] = useState(
    initialRequest.decline_reason ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestCode = customRequest.id.slice(0, 8).toUpperCase();
  const isDeclining = selectedStatus === "DECLINED";
  const noReasonForDecline = isDeclining && !declineReason.trim();
  const noChange =
    selectedStatus === customRequest.status &&
    (!isDeclining ||
      declineReason.trim() === (customRequest.decline_reason ?? ""));

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(
        `/api/admin/custom-requests/${customRequest.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: selectedStatus,
            declineReason: isDeclining ? declineReason.trim() : undefined,
          }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setCustomRequest(data.customRequest);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="admin-custom-request-details-panel">
      <Heading
        id="admin-custom-request-details-title"
        variant="cart"
        className="border-b border-black inline-block pb-2 mb-6 uppercase"
      >
        Custom Request Details
      </Heading>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <Text
            id="admin-custom-request-details-number"
            variant="body"
            className="font-medium"
          >
            Request #{requestCode}
          </Text>
          <Text id="admin-custom-request-details-placed-on" variant="caption">
            Requested on {formatCustomRequestDate(customRequest.created_at)}
          </Text>
        </div>
        <CustomRequestStatusBadge
          id="admin-custom-request-details-status"
          status={customRequest.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          id="admin-custom-request-details-info"
          className="md:col-span-2 space-y-6"
        >
          <div className="border border-gray-200 p-6">
            <Text variant="label" className="font-medium text-black mb-4">
              Customer
            </Text>
            <Text variant="body">{customRequest.full_name ?? "Unknown"}</Text>
            <Text variant="caption">
              {customRequest.email ?? "No email on file"}
            </Text>
            <Text variant="caption">
              {customRequest.phone ?? "No phone on file"}
            </Text>
          </div>

          <div className="border border-gray-200 p-6">
            <Text variant="label" className="font-medium text-black mb-4">
              Requested Product
            </Text>
            <Text variant="body" className="font-medium">
              {customRequest.product_type}
            </Text>
            <Text variant="muted" className="italic mt-2">
              &ldquo;{customRequest.message}&rdquo;
            </Text>

            {getCustomRequestImages(customRequest).length > 0 && (
              <div
                id="admin-custom-request-details-images"
                className="flex flex-wrap gap-2 mt-4"
              >
                {getCustomRequestImages(customRequest).map((url, index) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative w-20 h-20 bg-gray-50 overflow-hidden shrink-0"
                  >
                    <Image
                      src={url}
                      alt={`Reference ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {customRequest.status === "DECLINED" &&
            customRequest.decline_reason && (
              <div
                id="admin-custom-request-details-current-decline-reason"
                className="border border-red-200 bg-red-50 p-6"
              >
                <Text variant="label" className="font-medium text-red-700 mb-2">
                  Current decline reason
                </Text>
                <Text variant="caption" className="text-red-700">
                  {customRequest.decline_reason}
                </Text>
              </div>
            )}
        </div>

        <div
          id="admin-custom-request-details-update-status"
          className="border border-gray-200 p-6 h-fit"
        >
          <Text variant="label" className="font-medium text-black mb-4">
            Update Status
          </Text>
          <select
            id="admin-custom-request-details-status-select"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as CustomRequestStatus)
            }
            className="w-full border border-gray-300 px-3 py-2 text-sm mb-4"
          >
            {CUSTOM_REQUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {isDeclining && (
            <div className="mb-4">
              <label
                htmlFor="admin-custom-request-details-decline-reason"
                className="block text-xs uppercase tracking-wide text-gray-500 mb-1"
              >
                Reason (shown to the customer)
              </label>
              <textarea
                id="admin-custom-request-details-decline-reason"
                value={declineReason}
                onChange={(event) => setDeclineReason(event.target.value)}
                rows={4}
                placeholder="e.g. We're unable to source this material right now, but we'd love to help with an alternative design."
                className="w-full border border-gray-300 px-3 py-2 text-sm resize-none"
              />
              {noReasonForDecline && (
                <Text
                  id="admin-custom-request-details-decline-reason-error"
                  variant="caption"
                  className="text-red-600 mt-1"
                >
                  A reason is required so we can let the customer know politely.
                </Text>
              )}
            </div>
          )}

          <Button
            id="admin-custom-request-details-status-save"
            variant="primary"
            size="sm"
            fullWidth
            disabled={isSaving || noChange || noReasonForDecline}
            onClick={handleUpdateStatus}
          >
            {isSaving ? "Updating..." : "Update Status"}
          </Button>
          {error && (
            <Text
              id="admin-custom-request-details-status-error"
              variant="caption"
              className="text-red-600 mt-2"
            >
              {error}
            </Text>
          )}
          {success && (
            <Text
              id="admin-custom-request-details-status-success"
              variant="caption"
              className="text-green-700 mt-2"
            >
              Status updated.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}

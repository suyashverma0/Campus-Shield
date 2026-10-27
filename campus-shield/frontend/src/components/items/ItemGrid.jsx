import React from "react";
import ItemCard from "./ItemCard";
import EmptyState from "../common/EmptyState";
import LoadingState from "../common/LoadingState";

export default function ItemGrid({
  items = [],
  loading = false,
  emptyTitle = "No Items Reported",
  emptyDescription = "There are no matching lost or found items in this category right now.",
  emptyActionText,
  onEmptyAction
}) {
  if (loading) {
    return <LoadingState message="Fetching campus records..." />;
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

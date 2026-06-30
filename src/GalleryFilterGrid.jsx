"use client";

import { useMemo, useState } from "react";

export default function GalleryFilterGrid({ items = [] }) {
  const filters = useMemo(() => {
    const uniqueTypes = [];

    for (const item of items) {
      const type = item.type?.trim();

      if (type && !uniqueTypes.includes(type)) {
        uniqueTypes.push(type);
      }
    }

    return ["All", ...uniqueTypes];
  }, [items]);
  const [activeFilter, setActiveFilter] = useState("All");
  const visibleItems =
    activeFilter === "All"
      ? items
      : items.filter((item) => item.type?.trim() === activeFilter);

  return (
    <section className="gallery-grid-section" aria-label="Gallery images">
      {filters.length > 1 && (
        <div className="gallery-filter-list" role="list" aria-label="Gallery filters">
          {filters.map((filter) => (
            <button
              className={
                filter === activeFilter
                  ? "gallery-filter-button is-active"
                  : "gallery-filter-button"
              }
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      <div className="gallery-filter-grid">
        {visibleItems.map((item, index) => (
          <figure
            className="gallery-filter-card"
            key={`${item.imageSrc}-${item.type}-${index}`}
          >
            <img src={item.imageSrc} alt="" />
          </figure>
        ))}
      </div>
    </section>
  );
}

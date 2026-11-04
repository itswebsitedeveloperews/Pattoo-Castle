"use client";

import { useEffect, useRef, useState } from "react";

// Native iframe lazy loading can start several screens ahead of the viewport.
// Keep the same frame and dimensions, but start Maps only as it approaches view.
export default function DeferredMap({ src, ...props }) {
  const frame = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <iframe {...props} className={`${props.className || ""} deferred-map-frame`} ref={frame} src={ready ? src : undefined} />
      <noscript>
        <style>{".deferred-map-frame { display: none !important; }"}</style>
        <iframe {...props} src={src} />
      </noscript>
    </>
  );
}

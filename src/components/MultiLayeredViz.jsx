import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ROOT = {
  id: "water-cycle",
  label: "Water Cycle",
  color: "#0284C7",
  children: [
    {
      id: "evaporation",
      label: "Evaporation",
      color: "#22C55E",
      children: [
        { id: "ocean", label: "Ocean", color: "#3B82F6" },
        { id: "river", label: "River", color: "#38BDF8" },
        { id: "lake", label: "Lake", color: "#0EA5E9" },
        { id: "pond", label: "Pond", color: "#14B8A6" },
      ],
    },
    {
      id: "condensation",
      label: "Condensation",
      color: "#8B5CF6",
      children: [
        { id: "clouds", label: "Clouds", color: "#6366F1" },
        { id: "fog", label: "Fog", color: "#A78BFA" },
        { id: "dew", label: "Dew", color: "#C084FC" },
        { id: "mist", label: "Mist", color: "#60A5FA" },
      ],
    },
  ],
};

const circleLayoutPositions = (count, cx, cy, radius) => {
  if (count === 1) return [{ x: cx, y: cy }];
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  });
};

export default function MultiLayeredViz() {
  const svgRef = useRef(null);
  const [stack, setStack] = useState([ROOT]); 

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth;
    const height = svgEl.clientHeight;
    const cx = width / 2;
    const cy = height / 2;

    const depth = stack.length;
    const current = stack[stack.length - 1];

    let nodes = [];
    if (depth === 1) {
      nodes = [{ ...ROOT, _level: 0 }];
    } else if (depth === 2) {
      nodes = (ROOT.children || []).map((d) => ({ ...d, _level: 1 }));
    } else {
      nodes = (current.children || []).map((d) => ({ ...d, _level: 2 }));
    }

    const radiusLayout = depth === 1 ? 0 : 150;
    const centers = circleLayoutPositions(nodes.length, cx, cy, radiusLayout);

    const centersById = nodes.map((n, i) => ({ id: n.id, x: centers[i].x, y: centers[i].y }));

    const g = svg.append("g").attr("class", "nodes");

    const groups = g
      .selectAll("g.node")
      .data(nodes, (d) => d.id)
      .join(
        (enter) => {
          const gEnter = enter.append("g").attr("class", "node").style("cursor", "pointer");
          gEnter
            .append("circle")
            .attr("r", 0)
            .attr("fill", (d) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("opacity", 0.0);
          gEnter
            .append("text")
            .text((d) => d.label)
            .attr("fill", "#fff")
            .attr("text-anchor", "middle")
            .attr("dy", 5)
            .style("font-family", "Inter, Arial")
            .style("opacity", 0.0)
            .style("font-size", "14px");
          return gEnter;
        },
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(350)
            .style("opacity", 0)
            .remove()
      );

    groups.each(function (d, i) {
      const pos = centers[i] || { x: cx, y: cy };
      const group = d3.select(this);
      group
        .transition()
        .duration(550)
        .attrTween("transform", function () {
          const currentTransform = d3.select(this).attr("transform") || `translate(${cx},${cy})`;
          const interp = d3.interpolateString(currentTransform, `translate(${pos.x},${pos.y})`);
          return (t) => interp(t);
        })
        .on("end", () => {});
    });

    groups
      .select("circle")
      .transition()
      .duration(600)
      .attr("opacity", 1)
      .attr("r", (d) => (d._level === 0 ? 90 : d._level === 1 ? 60 : 40));

    groups
      .select("text")
      .transition()
      .duration(600)
      .style("opacity", 1)
      .style("font-size", (d) => (d._level === 0 ? "20px" : d._level === 1 ? "16px" : "13px"));

    groups.on("click", (event, d) => {
      event.stopPropagation();
      if (d.children && d.children.length > 0) {
        setStack((s) => {
          const next = [...s, d];
          return next;
        });
      }
    });

    svg.on("wheel", (event) => {
      event.preventDefault();
      const [mx, my] = d3.pointer(event);
      const deltaY = event.deltaY;

      if (deltaY < 0) {
        if (nodes.length === 0) return;
        let nearestIdx = 0;
        let best = Infinity;
        centersById.forEach((c, idx) => {
          const dist = Math.hypot(mx - c.x, my - c.y);
          if (dist < best) {
            best = dist;
            nearestIdx = idx;
          }
        });
        const candidate = nodes[nearestIdx];
        if (candidate && candidate.children && candidate.children.length > 0) {
          setStack((s) => {
            if (s.length > 0 && s[s.length - 1].id === candidate.id) return s;
            return [...s, candidate];
          });
        }
      } else {
        setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
      }
    });

    svg.on("contextmenu", (event) => {
      event.preventDefault();
      setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    });

    svg.on("click", () => {});

    return () => {
      svg.on("wheel", null);
      svg.on("contextmenu", null);
      svg.on("click", null);
      g.remove();
    };
  }, [stack]);

  const goHome = () => setStack([ROOT]);

  const jumpToStackIndex = (i) => {
    setStack((s) => s.slice(0, i + 1));
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial" }}>
      <div
        style={{
          width: 88,
          background: "#0369A1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 22,
          gap: 18,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={goHome}
          title="Home"
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            border: "3px solid rgba(255,255,255,0.9)",
            background: "#ffffff22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            fontSize: 20,
          }}
        >
          🏠
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {stack.map((layer, idx) => {
            const active = idx === stack.length - 1;
            return (
              <div
                key={layer.id + "-" + idx}
                onClick={() => jumpToStackIndex(idx)}
                title={layer.label}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: active ? "#FACC15" : "rgba(255,255,255,0.5)",
                  border: "2px solid white",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, background: stack[stack.length - 1].color || "#0369A1", padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>🌊 Multi-Layer Zoom</h2>
            <div style={{ opacity: 0.9 }}>Current: <strong>{stack[stack.length - 1].label}</strong></div>
          </div>

          <div>
            <button
              onClick={() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))}
              style={{
                background: "#10B981",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", padding: 12 }}>
          <svg ref={svgRef} width="100%" height="76vh" style={{ display: "block", background: "rgba(0,0,0,0.06)" }} />
        </div>

        <div style={{ marginTop: 12, color: "rgba(255,255,255,0.9)" }}>
          <small>Left-click a node or scroll-up on a node to zoom in → Right-click or scroll-down to zoom out.</small>
        </div>
      </div>
    </div>
  );
}

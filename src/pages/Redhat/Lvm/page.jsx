
import { useMemo, useRef, useState, useEffect } from "react";
import "./page.css";

export const metadata = {
  title: "LVM — Interactive Storage Tree",
  category: "RHCSA",
  description:
    "Explore LVM relationships visually and operate a simulated RHEL terminal.",
  keywords: [
    "RHCSA",
    "RHEL",
    "LVM",
    "pvs",
    "vgs",
    "lvs",
    "pvcreate",
    "vgextend",
    "lvcreate",
    "lvextend",
  ],
  created: "2026-10-13",
};

/* =========================================================
   INITIAL LVM STATE
   ========================================================= */

const freshState = () => ({
  pvs: [
    {
      name: "/dev/sda2",
      size: 40,
      vg: "rhel",
      ready: true,
    },
    {
      name: "/dev/sdb1",
      size: 20,
      vg: "data_vg",
      ready: true,
    },
    {
      name: "/dev/sdc1",
      size: 10,
      vg: null,
      ready: false,
    },
  ],

  vgs: [
    { name: "rhel" },
    { name: "data_vg" },
  ],

  lvs: [
    { name: "root", vg: "rhel", size: 22 },
    { name: "swap", vg: "rhel", size: 4 },
    { name: "data", vg: "data_vg", size: 12 },
  ],
});

const OPERATIONS = [
  {
    label: "Initialize /dev/sdc1",
    command: "pvcreate /dev/sdc1",
  },
  {
    label: "Add /dev/sdc1 to data_vg",
    command: "vgextend data_vg /dev/sdc1",
  },
  {
    label: "Create backup_vg with /dev/sdc1",
    command: "vgcreate backup_vg /dev/sdc1",
  },
  {
    label: "Create 2G backup LV in data_vg",
    command: "lvcreate -L 2G -n backup data_vg",
  },
  {
    label: "Extend data LV by 2G",
    command: "lvextend -L +2G /dev/data_vg/data",
  },
];

const GUIDE_COMMANDS = [
  {
    command: "pvs",
    name: "Physical Volumes",
    color: "mint",
    use:
      "Identify disks or partitions initialized for LVM, their Volume Group membership, and available PV capacity.",
    avoid:
      "Don't use it to inspect Logical Volume sizes, filesystem usage, or partitions without LVM initialization.",
    example:
      "pvs -o pv_name,vg_name,pv_size,pv_free",
    exampleLabel:
      "Inspect PV capacity and VG membership",
  },
  {
    command: "vgs",
    name: "Volume Groups",
    color: "blue",
    use:
      "Check the total capacity and free space of a Volume Group before creating or extending Logical Volumes.",
    avoid:
      "Don't use it to check free space inside filesystems or determine how much space an individual LV occupies.",
    example: "vgs",
    exampleLabel:
      "Check whether a VG has enough space",
  },
  {
    command: "lvs",
    name: "Logical Volumes",
    color: "purple",
    use:
      "Inspect existing Logical Volumes, their sizes, attributes, and the Volume Groups they belong to.",
    avoid:
      "Don't use it to check filesystem free space, find mount points, or determine total available VG capacity.",
    example:
      "lvs -o lv_name,vg_name,lv_size,lv_attr",
    exampleLabel:
      "Inspect Logical Volume sizes and attributes",
  },
];

/* =========================================================
   LVM HELPERS
   ========================================================= */

const gb = (value) => `${value.toFixed(2)}g`;

const sum = (items, selector) =>
  items.reduce(
    (total, item) => total + selector(item),
    0,
  );

const clone = (state) => ({
  pvs: state.pvs.map((pv) => ({ ...pv })),
  vgs: state.vgs.map((vg) => ({ ...vg })),
  lvs: state.lvs.map((lv) => ({ ...lv })),
});

const members = (state, vgName) =>
  state.pvs.filter(
    (pv) => pv.ready && pv.vg === vgName,
  );

const volumes = (state, vgName) =>
  state.lvs.filter(
    (lv) => lv.vg === vgName,
  );

const capacity = (state, vgName) =>
  sum(
    members(state, vgName),
    (pv) => pv.size,
  );

const allocated = (state, vgName) =>
  sum(
    volumes(state, vgName),
    (lv) => lv.size,
  );

const available = (state, vgName) =>
  Math.max(
    0,
    capacity(state, vgName) -
      allocated(state, vgName),
  );

/*
 * Illustrative PV allocation.
 *
 * Allocated LV space is distributed across PVs
 * in their listed order.
 *
 * This is a teaching approximation. Real LVM
 * allocation depends on physical extents and
 * allocation policies.
 */

function pvAllocated(state, pv) {
  if (!pv.vg) return 0;

  const group = members(state, pv.vg);

  const index = group.findIndex(
    (member) => member.name === pv.name,
  );

  if (index < 0) return 0;

  const before = sum(
    group.slice(0, index),
    (member) => member.size,
  );

  return Math.min(
    pv.size,
    Math.max(
      0,
      allocated(state, pv.vg) - before,
    ),
  );
}

const pad = (value, width) =>
  String(value).padEnd(width);

/* =========================================================
   TERMINAL TABLE OUTPUT
   ========================================================= */

function table(state, type) {
  if (type === "pvs") {
    return [
      `${pad("PV", 14)}${pad("VG", 12)}${pad(
        "PSize",
        10,
      )}PFree`,

      ...state.pvs
        .filter((pv) => pv.ready)
        .map(
          (pv) =>
            `${pad(pv.name, 14)}` +
            `${pad(pv.vg || "", 12)}` +
            `${pad(gb(pv.size), 10)}` +
            `${gb(
              pv.size - pvAllocated(state, pv),
            )}`,
        ),
    ].join("\n");
  }

  if (type === "vgs") {
    return [
      `${pad("VG", 13)}${pad("#PV", 6)}` +
        `${pad("#LV", 6)}` +
        `${pad("VSize", 10)}VFree`,

      ...state.vgs.map(
        (vg) =>
          `${pad(vg.name, 13)}` +
          `${pad(
            members(state, vg.name).length,
            6,
          )}` +
          `${pad(
            volumes(state, vg.name).length,
            6,
          )}` +
          `${pad(
            gb(capacity(state, vg.name)),
            10,
          )}` +
          `${gb(available(state, vg.name))}`,
      ),
    ].join("\n");
  }

  return [
    `${pad("LV", 13)}${pad("VG", 13)}LSize`,

    ...state.lvs.map(
      (lv) =>
        `${pad(lv.name, 13)}` +
        `${pad(lv.vg, 13)}` +
        `${gb(lv.size)}`,
    ),
  ].join("\n");
}

/* =========================================================
   SIMULATED COMMAND ENGINE
   ========================================================= */

function processCommand(input, currentState) {
  const state = clone(currentState);

  const command = input
    .trim()
    .replace(/\s+/g, " ");

  const result = (output, focus = null) => ({
    state,
    output,
    focus,
  });

  if (["pvs", "vgs", "lvs"].includes(command)) {
    return result(table(state, command));
  }

  if (
    command === "help" ||
    command === "lvm help"
  ) {
    return result(
      [
        "Available commands:",
        "",
        "pvs",
        "vgs",
        "lvs",
        "lsblk",
        "pvdisplay [device]",
        "vgdisplay [VG]",
        "lvdisplay [LV]",
        "",
        "pvcreate /dev/sdc1",
        "vgextend data_vg /dev/sdc1",
        "vgcreate backup_vg /dev/sdc1",
        "lvcreate -L 2G -n backup data_vg",
        "lvextend -L +2G /dev/data_vg/data",
        "",
        "clear",
        "reset",
      ].join("\n"),
    );
  }

  if (command === "lvm version") {
    return result(
      "LVM educational simulation — no real LVM operations",
    );
  }

  if (command === "lsblk") {
    return result(
      [
        `${pad("NAME", 12)}${pad(
          "SIZE",
          7,
        )}TYPE`,

        ...state.pvs.map(
          (pv) =>
            `${pad(
              pv.name.slice(5),
              12,
            )}` +
            `${pad(
              `${pv.size}G`,
              7,
            )}` +
            `part${
              pv.ready ? " [LVM PV]" : ""
            }`,
        ),
      ].join("\n"),
    );
  }

  /* -------------------------
     PVDISPLAY
     ------------------------- */

  if (
    command === "pvdisplay" ||
    command.startsWith("pvdisplay ")
  ) {
    const name = command.split(" ")[1];

    const list = state.pvs.filter(
      (pv) =>
        pv.ready &&
        (!name || pv.name === name),
    );

    if (!list.length) {
      return result(
        "Physical volume not found.",
      );
    }

    return result(
      list
        .map(
          (pv) =>
            "--- Physical volume ---\n" +
            `PV Name    ${pv.name}\n` +
            `VG Name    ${
              pv.vg || "(not assigned)"
            }\n` +
            `PV Size    ${gb(pv.size)}\n` +
            `PV Free    ${gb(
              pv.size - pvAllocated(state, pv),
            )}`,
        )
        .join("\n\n"),
    );
  }

  /* -------------------------
     VGDISPLAY
     ------------------------- */

  if (
    command === "vgdisplay" ||
    command.startsWith("vgdisplay ")
  ) {
    const name = command.split(" ")[1];

    const list = state.vgs.filter(
      (vg) => !name || vg.name === name,
    );

    if (!list.length) {
      return result(
        "Volume group not found.",
      );
    }

    return result(
      list
        .map(
          (vg) =>
            "--- Volume group ---\n" +
            `VG Name    ${vg.name}\n` +
            `VG Size    ${gb(
              capacity(state, vg.name),
            )}\n` +
            `VG Free    ${gb(
              available(state, vg.name),
            )}`,
        )
        .join("\n\n"),
    );
  }

  /* -------------------------
     LVDISPLAY
     ------------------------- */

  if (
    command === "lvdisplay" ||
    command.startsWith("lvdisplay ")
  ) {
    const name = command.split(" ")[1];

    const list = state.lvs.filter(
      (lv) =>
        !name ||
        lv.name === name ||
        `/dev/${lv.vg}/${lv.name}` === name,
    );

    if (!list.length) {
      return result(
        "Logical volume not found.",
      );
    }

    return result(
      list
        .map(
          (lv) =>
            "--- Logical volume ---\n" +
            `LV Path    /dev/${lv.vg}/${lv.name}\n` +
            `LV Size    ${gb(lv.size)}`,
        )
        .join("\n\n"),
    );
  }

  /* -------------------------
     PVCREATE
     ------------------------- */

  const createPV = command.match(
    /^pvcreate (\/dev\/sd[a-z]\d+)$/,
  );

  if (createPV) {
    const pv = state.pvs.find(
      (item) => item.name === createPV[1],
    );

    if (!pv) {
      return result(
        "Device not found in this simulation.",
      );
    }

    if (pv.ready) {
      return result(
        `Physical volume ${pv.name} already exists.`,
      );
    }

    pv.ready = true;

    return result(
      `Physical volume "${pv.name}" successfully created.`,
      {
        type: "pv",
        id: pv.name,
      },
    );
  }

  /* -------------------------
     VGCREATE
     ------------------------- */

  const createVG = command.match(
    /^vgcreate ([\w-]+) (\/dev\/sd[a-z]\d+)$/,
  );

  if (createVG) {
    const [, name, device] = createVG;

    const pv = state.pvs.find(
      (item) => item.name === device,
    );

    if (
      state.vgs.some(
        (vg) => vg.name === name,
      )
    ) {
      return result(
        "Volume group already exists.",
      );
    }

    if (!pv?.ready || pv.vg) {
      return result(
        "Use an initialized PV that is not already assigned to a VG.",
      );
    }

    state.vgs.push({ name });
    pv.vg = name;

    return result(
      `Volume group "${name}" successfully created.`,
      {
        type: "vg",
        id: name,
      },
    );
  }

  /* -------------------------
     VGEXTEND
     ------------------------- */

  const extendVG = command.match(
    /^vgextend ([\w-]+) (\/dev\/sd[a-z]\d+)$/,
  );

  if (extendVG) {
    const [, name, device] = extendVG;

    const pv = state.pvs.find(
      (item) => item.name === device,
    );

    if (
      !state.vgs.some(
        (vg) => vg.name === name,
      )
    ) {
      return result(
        `Volume group "${name}" not found.`,
      );
    }

    if (!pv?.ready || pv.vg) {
      return result(
        "Use an initialized PV that is not already assigned to a VG.",
      );
    }

    pv.vg = name;

    return result(
      `Volume group "${name}" successfully extended.`,
      {
        type: "vg",
        id: name,
      },
    );
  }

  /* -------------------------
     LVCREATE
     ------------------------- */

  const createLV = command.match(
    /^lvcreate -L (\d+(?:\.\d+)?)G -n ([\w-]+) ([\w-]+)$/i,
  );

  if (createLV) {
    const [, rawSize, name, vg] =
      createLV;

    const size = Number(rawSize);

    if (
      !state.vgs.some(
        (item) => item.name === vg,
      )
    ) {
      return result(
        "Volume group not found.",
      );
    }

    if (
      state.lvs.some(
        (lv) =>
          lv.vg === vg &&
          lv.name === name,
      )
    ) {
      return result(
        "Logical volume already exists.",
      );
    }

    if (
      !Number.isFinite(size) ||
      size <= 0 ||
      size > available(state, vg)
    ) {
      return result(
        "Insufficient free VG capacity.",
      );
    }

    state.lvs.push({
      name,
      vg,
      size,
    });

    return result(
      `Logical volume "${name}" created in ${vg} (${gb(size)}).`,
      {
        type: "lv",
        id: `${vg}/${name}`,
      },
    );
  }

  /* -------------------------
     LVEXTEND
     ------------------------- */

  const extendLV = command.match(
    /^lvextend -L \+(\d+(?:\.\d+)?)G \/dev\/([\w-]+)\/([\w-]+)$/i,
  );

  if (extendLV) {
    const [, rawSize, vg, name] =
      extendLV;

    const size = Number(rawSize);

    const lv = state.lvs.find(
      (item) =>
        item.vg === vg &&
        item.name === name,
    );

    if (!lv) {
      return result(
        "Logical volume not found.",
      );
    }

    if (
      !Number.isFinite(size) ||
      size <= 0 ||
      size > available(state, vg)
    ) {
      return result(
        "Insufficient free VG capacity.",
      );
    }

    lv.size += size;

    return result(
      `Logical volume /dev/${vg}/${name} extended to ${gb(lv.size)}.\n` +
        "Filesystem size is unchanged.",
      {
        type: "lv",
        id: `${vg}/${name}`,
      },
    );
  }

  return result(
    "Unsupported command in this simulation. Type help.",
  );
}

/* =========================================================
   STORAGE TREE LAYOUT
   ========================================================= */

function buildTree(state) {
  const groups = [];

  let cursor = 40;

  for (const vg of state.vgs) {
    const pvList = members(
      state,
      vg.name,
    );

    const lvList = volumes(
      state,
      vg.name,
    );

    const count = Math.max(
      pvList.length,
      lvList.length,
      1,
    );

    const height = Math.max(
      100,
      count * 57 + 10,
    );

    const cy =
      cursor + height / 2;

    const arrange = (list) =>
      list.map((item, index) => ({
        ...item,
        y:
          cy +
          (index -
            (list.length - 1) / 2) *
            57,
      }));

    groups.push({
      name: vg.name,
      cy,
      top: cursor,
      height,
      pvs: arrange(pvList),
      lvs: arrange(lvList),
    });

    cursor += height + 22;
  }

  const loose = state.pvs
    .filter((pv) => !pv.vg)
    .map((pv, index) => ({
      ...pv,
      y:
        cursor +
        22 +
        index * 63,
    }));

  return {
    groups,
    loose,
    height: Math.max(
      320,
      cursor +
        loose.length * 63 +
        48,
    ),
  };
}

/* =========================================================
   NODE RELATIONSHIPS
   ========================================================= */

function relationship(state, selected) {
  if (!selected) return null;

  if (selected.type === "vg") {
    return selected.id;
  }

  if (selected.type === "pv") {
    return (
      state.pvs.find(
        (pv) =>
          pv.name === selected.id,
      )?.vg || null
    );
  }

  if (selected.type === "lv") {
    return selected.id.split("/")[0];
  }

  return null;
}

function nodeDescription(state, selected) {
  if (!selected) {
    return {
      title: "Select any node",
      description:
        "Click a PV, VG, or LV to highlight its relationships in the tree.",
    };
  }

  if (selected.type === "pv") {
    const pv = state.pvs.find(
      (item) =>
        item.name === selected.id,
    );

    if (!pv) return null;

    if (!pv.ready) {
      return {
        title: pv.name,
        description:
          "Partition is not initialized for LVM. Run pvcreate before adding it to a Volume Group.",
      };
    }

    return {
      title: pv.name,
      description:
        `Physical Volume · ${gb(pv.size)} total · ` +
        `${gb(
          pv.size -
            pvAllocated(state, pv),
        )} free (illustrative) · ` +
        `VG: ${pv.vg || "none"}`,
    };
  }

  if (selected.type === "vg") {
    const vg = state.vgs.find(
      (item) =>
        item.name === selected.id,
    );

    if (!vg) return null;

    return {
      title: vg.name,
      description:
        `Volume Group · ` +
        `${members(
          state,
          vg.name,
        ).length} PV(s) · ` +
        `${volumes(
          state,
          vg.name,
        ).length} LV(s) · ` +
        `${gb(
          available(
            state,
            vg.name,
          ),
        )} free`,
    };
  }

  const lv = state.lvs.find(
    (item) =>
      `${item.vg}/${item.name}` ===
      selected.id,
  );

  if (!lv) return null;

  return {
    title: `/dev/${lv.vg}/${lv.name}`,
    description:
      `Logical Volume · ${gb(lv.size)} allocated from VG ${lv.vg}. ` +
      "Filesystem capacity is separate.",
  };
}

/* =========================================================
   ANIMATED LVM STORAGE TREE
   ========================================================= */

function StorageTree({
  state,
  selected,
  onSelect,
  tracing,
  onToggleTrace,
}) {
  const tree = useMemo(
    () => buildTree(state),
    [state],
  );

  const selectedGroup = relationship(
    state,
    selected,
  );

  const info = nodeDescription(
    state,
    selected,
  );

  const isBright = (vg, type, id) =>
    !selected ||
    (selectedGroup
      ? vg === selectedGroup
      : selected.type === type &&
        selected.id === id);

  const choose = (type, id) => {
    onSelect({ type, id });
  };

  const keySelect = (
    event,
    type,
    id,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      choose(type, id);
    }
  };

  const edges = [];

  tree.groups.forEach((group) => {
    group.pvs.forEach((pv) => {
      edges.push({
        key: `${pv.name}-in`,
        vg: group.name,
        path:
          `M 280 ${pv.y} ` +
          `C 355 ${pv.y}, 390 ${group.cy}, 475 ${group.cy}`,
        tint: "pv",
      });
    });

    group.lvs.forEach((lv) => {
      edges.push({
        key:
          `${group.name}-${lv.name}`,
        vg: group.name,
        path:
          `M 636 ${group.cy} ` +
          `C 710 ${group.cy}, 746 ${lv.y}, 808 ${lv.y}`,
        tint: "lv",
      });
    });
  });

  return (
    <section className="lvt-panel lvt-tree-panel">
      <div className="lvt-panel-title">
        <div>
          <span className="lvt-eyebrow">
            STORAGE RELATIONSHIP MAP
          </span>

          <h2>One pool, two sides</h2>
        </div>

        <div className="lvt-map-actions">
          <span className="lvt-live">
            ● SIMULATED
          </span>

          <button
            type="button"
            onClick={onToggleTrace}
          >
            {tracing
              ? "Ⅱ Pause packets"
              : "▶ Trace paths"}
          </button>
        </div>
      </div>

      <div className="lvt-map-scroll">
        <div className="lvt-map-headers">
          <span>
            01{" "}
            <strong>
              Physical volumes
            </strong>{" "}
            <code>pvs</code>
          </span>

          <span>
            02{" "}
            <strong>
              Volume groups
            </strong>{" "}
            <code>vgs</code>
          </span>

          <span>
            03{" "}
            <strong>
              Logical volumes
            </strong>{" "}
            <code>lvs</code>
          </span>
        </div>

        <svg
          viewBox={`0 0 1040 ${tree.height}`}
          className={`lvt-tree-svg ${
            tracing ? "is-tracing" : ""
          }`}
          role="group"
          aria-label="Interactive LVM storage tree"
        >
          {/* GROUP DIVIDERS */}

          {tree.groups.map(
            (group) => (
              <line
                key={`guide-${group.name}`}
                x1="32"
                x2="1005"
                y1={
                  group.top +
                  group.height +
                  9
                }
                y2={
                  group.top +
                  group.height +
                  9
                }
                stroke="#23384d"
                strokeDasharray="2 9"
                opacity="0.6"
              />
            ),
          )}

          {/* CONNECTIONS */}

          {edges.map(
            (edge, index) => (
              <g
                key={edge.key}
                className={`lvt-wire ${
                  selectedGroup &&
                  edge.vg !==
                    selectedGroup
                    ? "muted"
                    : ""
                }`}
              >
                <path
                  d={edge.path}
                  className="lvt-wire-base"
                  stroke={
                    edge.tint ===
                    "pv"
                      ? "#42bda9"
                      : "#779eea"
                  }
                />

                {tracing && (
                  <circle
                    r="3.8"
                    className="lvt-packet"
                    fill={
                      edge.tint ===
                      "pv"
                        ? "#5eead4"
                        : "#a5b4fc"
                    }
                  >
                    <animateMotion
                      dur={`${
                        2.2 +
                        index * 0.12
                      }s`}
                      begin={`${
                        (index % 3) *
                        0.36
                      }s`}
                      path={
                        edge.path
                      }
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            ),
          )}

          {/* PHYSICAL VOLUMES */}

          {tree.groups.flatMap(
            (group) =>
              group.pvs.map(
                (pv) => (
                  <g
                    key={pv.name}
                    className={`lvt-node ${
                      selected?.type ===
                        "pv" &&
                      selected.id ===
                        pv.name
                        ? "selected"
                        : ""
                    } ${
                      !isBright(
                        group.name,
                        "pv",
                        pv.name,
                      )
                        ? "dimmed"
                        : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Physical Volume ${pv.name}`}
                    onClick={() =>
                      choose(
                        "pv",
                        pv.name,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) =>
                      keySelect(
                        event,
                        "pv",
                        pv.name,
                      )
                    }
                  >
                    <circle
                      cx="65"
                      cy={pv.y}
                      r="19"
                      className="lvt-pv-ring"
                    />

                    <rect
                      x="57"
                      y={pv.y - 8}
                      width="16"
                      height="16"
                      rx="3"
                      fill="none"
                      stroke="#65d8c6"
                      strokeWidth="1.5"
                    />

                    <path
                      d={
                        `M 60 ${
                          pv.y - 2
                        } H 70 ` +
                        `M 60 ${
                          pv.y + 3
                        } H 70`
                      }
                      stroke="#65d8c6"
                      strokeWidth="1"
                    />

                    <text
                      x="97"
                      y={pv.y - 5}
                      className="lvt-label"
                    >
                      {pv.name}
                    </text>

                    <text
                      x="97"
                      y={pv.y + 14}
                      className="lvt-sub"
                    >
                      {gb(
                        pv.size,
                      )}{" "}
                      ·{" "}
                      {gb(
                        pv.size -
                          pvAllocated(
                            state,
                            pv,
                          ),
                      )}{" "}
                      free
                    </text>
                  </g>
                ),
              ),
          )}

          {/* VOLUME GROUPS */}

          {tree.groups.map(
            (group) => (
              <g
                key={group.name}
                className={`lvt-node ${
                  selected?.type ===
                    "vg" &&
                  selected.id ===
                    group.name
                    ? "selected"
                    : ""
                } ${
                  !isBright(
                    group.name,
                    "vg",
                    group.name,
                  )
                    ? "dimmed"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Volume Group ${group.name}`}
                onClick={() =>
                  choose(
                    "vg",
                    group.name,
                  )
                }
                onKeyDown={(
                  event,
                ) =>
                  keySelect(
                    event,
                    "vg",
                    group.name,
                  )
                }
              >
                <path
                  d={
                    `M 504 ${
                      group.cy - 22
                    } ` +
                    `L 526 ${
                      group.cy
                    } ` +
                    `L 504 ${
                      group.cy + 22
                    } ` +
                    `L 482 ${
                      group.cy
                    } Z`
                  }
                  className="lvt-vg-diamond"
                />

                <text
                  x="504"
                  y={group.cy + 4}
                  className="lvt-vg-mark"
                  textAnchor="middle"
                >
                  VG
                </text>

                <text
                  x="539"
                  y={group.cy - 4}
                  className="lvt-label"
                >
                  {group.name}
                </text>

                <text
                  x="539"
                  y={group.cy + 15}
                  className="lvt-sub"
                >
                  {gb(
                    available(
                      state,
                      group.name,
                    ),
                  )}{" "}
                  free
                </text>
              </g>
            ),
          )}

          {/* LOGICAL VOLUMES */}

          {tree.groups.flatMap(
            (group) =>
              group.lvs.map(
                (lv) => (
                  <g
                    key={`${group.name}/${lv.name}`}
                    className={`lvt-node ${
                      selected?.type ===
                        "lv" &&
                      selected.id ===
                        `${group.name}/${lv.name}`
                        ? "selected"
                        : ""
                    } ${
                      !isBright(
                        group.name,
                        "lv",
                        `${group.name}/${lv.name}`,
                      )
                        ? "dimmed"
                        : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Logical Volume ${lv.name} in ${group.name}`}
                    onClick={() =>
                      choose(
                        "lv",
                        `${group.name}/${lv.name}`,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) =>
                      keySelect(
                        event,
                        "lv",
                        `${group.name}/${lv.name}`,
                      )
                    }
                  >
                    <circle
                      cx="831"
                      cy={lv.y}
                      r="18"
                      className="lvt-lv-ring"
                    />

                    <path
                      d={
                        `M 825 ${
                          lv.y - 8
                        } ` +
                        `H 834 L 838 ${
                          lv.y - 4
                        } ` +
                        `V ${
                          lv.y + 8
                        } H 825 Z ` +
                        `M 834 ${
                          lv.y - 8
                        } ` +
                        `V ${
                          lv.y - 4
                        } H 838`
                      }
                      fill="none"
                      stroke="#b1befe"
                      strokeWidth="1.5"
                    />

                    <text
                      x="863"
                      y={lv.y - 5}
                      className="lvt-label"
                    >
                      {lv.name}
                    </text>

                    <text
                      x="863"
                      y={lv.y + 14}
                      className="lvt-sub"
                    >
                      {gb(
                        lv.size,
                      )}{" "}
                      ·{" "}
                      {group.name}
                    </text>
                  </g>
                ),
              ),
          )}

          {/* UNASSIGNED OR RAW PARTITIONS */}

          {tree.loose.map(
            (pv) => (
              <g
                key={pv.name}
                className={`lvt-node ${
                  selected?.type ===
                    "pv" &&
                  selected.id ===
                    pv.name
                    ? "selected"
                    : ""
                } ${
                  selected &&
                  !(
                    selected.type ===
                      "pv" &&
                    selected.id ===
                      pv.name
                  )
                    ? "dimmed"
                    : ""
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Device ${pv.name}`}
                onClick={() =>
                  choose(
                    "pv",
                    pv.name,
                  )
                }
                onKeyDown={(
                  event,
                ) =>
                  keySelect(
                    event,
                    "pv",
                    pv.name,
                  )
                }
              >
                <circle
                  cx="65"
                  cy={pv.y}
                  r="19"
                  className={
                    pv.ready
                      ? "lvt-pv-ring"
                      : "lvt-uninitialized-ring"
                  }
                />

                <text
                  x="65"
                  y={pv.y + 5}
                  textAnchor="middle"
                  fill={
                    pv.ready
                      ? "#65d8c6"
                      : "#8796ab"
                  }
                  fontSize="17"
                >
                  {pv.ready
                    ? "✓"
                    : "+"}
                </text>

                <text
                  x="97"
                  y={pv.y - 5}
                  className="lvt-label"
                >
                  {pv.name}
                </text>

                <text
                  x="97"
                  y={pv.y + 14}
                  className="lvt-sub"
                >
                  {pv.ready
                    ? "PV · no VG"
                    : "Not initialized"}
                </text>

                <path
                  d={
                    `M 280 ${pv.y} ` +
                    `L 422 ${pv.y}`
                  }
                  stroke="#475569"
                  strokeDasharray="4 7"
                  strokeWidth="1.5"
                />

                <text
                  x="432"
                  y={pv.y + 4}
                  fill="#7f92aa"
                  fontSize="12"
                >
                  {pv.ready
                    ? "Not assigned to a VG"
                    : "Run pvcreate first"}
                </text>
              </g>
            ),
          )}
        </svg>
      </div>

      <div className="lvt-tree-inspector">
        <div className="lvt-inspector-indicator" />

        <div>
          <strong>
            {info?.title}
          </strong>

          <span>
            {info?.description}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            onSelect(null)
          }
          disabled={!selected}
        >
          Clear selection
        </button>
      </div>

      <div className="lvt-tree-footnote">
        Lines show VG membership and which LVs
        draw from each VG. They do not represent
        exact physical extent placement.
      </div>
    </section>
  );
}

/* =========================================================
   NEW: LVM COMMAND DECISION GUIDE
   ========================================================= */

function LvmCommandGuide() {
  return (
    <section className="lvt-panel lvt-guide-panel">
      <div className="lvt-panel-title">
        <div>
          <span className="lvt-eyebrow">
            RHCSA · COMMAND SELECTION
          </span>

          <h2>
            Which LVM command should I use?
          </h2>
        </div>

        <span className="lvt-guide-label">
          QUICK DECISION GUIDE
        </span>
      </div>

      <div className="lvt-guide-table">
        <div className="lvt-guide-header">
          <span>COMMAND</span>
          <span>WHEN TO USE</span>
          <span>WHEN NOT TO USE</span>
        </div>

        {GUIDE_COMMANDS.map((item) => (
          <div
            className="lvt-guide-row"
            key={item.command}
          >
            <div className="lvt-guide-command">
              <code
                className={`lvt-guide-${item.color}`}
              >
                {item.command}
              </code>

              <span>
                {item.name}
              </span>
            </div>

            <div className="lvt-guide-when">
              <span className="lvt-guide-icon good">
                ✓
              </span>

              <p>
                {item.use}
              </p>
            </div>

            <div className="lvt-guide-when">
              <span className="lvt-guide-icon avoid">
                ×
              </span>

              <p>
                {item.avoid}
              </p>
            </div>

            <div className="lvt-guide-example">
              <code>
                $ {item.example}
              </code>

              <span>
                {item.exampleLabel}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="lvt-guide-bottom">
        <span className="lvt-guide-tip-icon">
          !
        </span>

        <p>
          <strong>
            Important:
          </strong>{" "}
          LVM free space is not the same as
          filesystem free space. Use{" "}
          <code>vgs</code> to check available
          Volume Group capacity,{" "}
          <code>lvs</code> to inspect Logical
          Volume sizes, and{" "}
          <code>df -h</code> to check free
          space inside mounted filesystems.
          Use <code>lsblk</code> to inspect
          the block-device hierarchy.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   INTERACTIVE TERMINAL
   ========================================================= */

function Terminal({
  state,
  onState,
  onFocus,
  onReset,
}) {
  const [log, setLog] = useState(() => [
    {
      command: "pvs",
      output: table(
        freshState(),
        "pvs",
      ),
    },
  ]);

  const [input, setInput] =
    useState("");

  const [
    operation,
    setOperation,
  ] = useState(
    OPERATIONS[0].command,
  );

  const end = useRef(null);

  useEffect(() => {
    end.current?.scrollIntoView({
      block: "nearest",
    });
  }, [log]);

  function run(raw) {
    const value = raw.trim();

    if (!value) return;

    if (value === "clear") {
      setLog([]);
      return;
    }

    if (value === "reset") {
      onReset();
      setLog([]);
      setInput("");
      return;
    }

    const result = processCommand(
      value,
      state,
    );

    onState(result.state);

    if (result.focus) {
      onFocus(result.focus);
    }

    setLog((previous) => [
      ...previous,
      {
        command: value,
        output: result.output,
      },
    ]);
  }

  return (
    <section className="lvt-panel lvt-terminal-panel">
      <div className="lvt-panel-title">
        <div>
          <span className="lvt-eyebrow">
            INTERACTIVE RHEL SIMULATION
          </span>

          <h2>Terminal</h2>
        </div>

        <span className="lvt-live">
          ● CONNECTED TO MAP
        </span>
      </div>

      <div className="lvt-command-bar">
        <div className="lvt-shortcuts">
          {[
            "pvs",
            "vgs",
            "lvs",
            "lsblk",
          ].map((command) => (
            <button
              type="button"
              key={command}
              onClick={() =>
                run(command)
              }
            >
              {command} ↵
            </button>
          ))}
        </div>

        <div className="lvt-operator">
          <select
            aria-label="Choose LVM operation"
            value={operation}
            onChange={(event) =>
              setOperation(
                event.target.value,
              )
            }
          >
            {OPERATIONS.map(
              (item) => (
                <option
                  key={
                    item.command
                  }
                  value={
                    item.command
                  }
                >
                  {item.label}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            onClick={() =>
              run(operation)
            }
          >
            Run operation ↵
          </button>
        </div>
      </div>

      <div className="lvt-terminal-screen">
        <div className="lvt-terminal-top">
          <span>
            <i /> root@rhel:~
          </span>

          <div>
            <button
              type="button"
              onClick={() =>
                setLog([])
              }
            >
              Clear output
            </button>

            <button
              type="button"
              onClick={() => {
                onReset();
                setLog([]);
                setInput("");
              }}
            >
              Reset lab
            </button>
          </div>
        </div>

        <div className="lvt-terminal-log">
          {log.map(
            (entry, index) => (
              <div
                className="lvt-log-entry"
                key={index}
              >
                <div>
                  <span className="lvt-prompt">
                    root@rhel:~#{" "}
                  </span>

                  {entry.command}
                </div>

                <pre>
                  {entry.output}
                </pre>
              </div>
            ),
          )}

          <div ref={end} />
        </div>

        <form
          className="lvt-terminal-entry"
          onSubmit={(event) => {
            event.preventDefault();

            run(input);
            setInput("");
          }}
        >
          <span className="lvt-prompt">
            root@rhel:~#
          </span>

          <input
            spellCheck={false}
            aria-label="Enter Linux command"
            placeholder="Type help for supported commands"
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value,
              )
            }
          />

          <button type="submit">
            Run
          </button>
        </form>
      </div>

      <p className="lvt-terminal-hint">
        Try{" "}
        <code>
          pvcreate /dev/sdc1
        </code>
        {" → "}
        <code>
          vgextend data_vg /dev/sdc1
        </code>
        {" → "}
        <code>
          lvcreate -L 2G -n backup data_vg
        </code>
        . Watch the tree grow.
      </p>
    </section>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function LvmTreeLab() {
  const [state, setState] =
    useState(freshState);

  const [
    selected,
    setSelected,
  ] = useState(null);

  const [
    tracing,
    setTracing,
  ] = useState(true);

  const reset = () => {
    setState(freshState());
    setSelected(null);
  };

  return (
    <main className="lvt-page">
      <div className="lvt-shell">
        <header className="lvt-hero">
          <span>
            RHCSA / RHEL · LVM VISUAL LAB
          </span>

          <h1>
            Follow the storage
          </h1>

          <p>
            A Physical Volume joins a Volume
            Group. A Logical Volume takes
            space from that group. Select a
            node to see the relationship,
            or change it in the terminal.
          </p>
        </header>

        {/* ANIMATED STORAGE TREE */}

        <StorageTree
          state={state}
          selected={selected}
          onSelect={setSelected}
          tracing={tracing}
          onToggleTrace={() =>
            setTracing(
              (value) => !value,
            )
          }
        />

        {/* COMMAND DECISION GUIDE */}

        <LvmCommandGuide />

        {/* INTERACTIVE TERMINAL */}

        <Terminal
          state={state}
          onState={setState}
          onFocus={setSelected}
          onReset={reset}
        />

        {/* COMPACT COMMAND REFERENCE */}

        <div className="lvt-reference">
          <div>
            <code>pvs</code>

            <span>
              Physical devices and free
              extents
            </span>
          </div>

          <div>
            <code>vgs</code>

            <span>
              Storage pools and available
              capacity
            </span>
          </div>

          <div>
            <code>lvs</code>

            <span>
              Logical volumes allocated
              from pools
            </span>
          </div>
        </div>

        <footer className="lvt-footer">
          Educational simulation · Sizes and
          PV extent placement are simplified ·
          No real storage operations
        </footer>
      </div>
    </main>
  );
}

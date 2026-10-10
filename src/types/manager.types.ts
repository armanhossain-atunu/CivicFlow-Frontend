export type ManagerComplaint = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt?: string;
  department?: string;
  category?: string;
  location?: string;
  paymentStatus?: string;
  citizenName?: string;
  citizenEmail?: string;
  technicianId?: string;
  technicianName?: string;
};

export type ManagerComplaintPage = {
  complaints: ManagerComplaint[];
  page: number;
  totalPages: number;
  total: number;
};

export type Technician = {
  id: string;
  name: string;
  email: string;
  role: string | undefined;
};
export type createAssignment = {
  complaintId: string;
  assignedToId: string;
  note?: string | undefined;
};
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getText(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (isRecord(value)) {
    return getText(value.name) ?? getText(value.title);
  }

  return undefined;
}

function getNestedRecord(
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> | undefined {
  for (const key of keys) {
    const value = record[key];
    if (isRecord(value)) {
      return value;
    }
  }

  return undefined;
}

function getArrayPayload(value: unknown): unknown[] | null {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) {
      return current;
    }

    if (!isRecord(current)) {
      return null;
    }

    const record = current;
    const namedList = ["complaints", "technicians", "users"]
      .map((key) => record[key])
      .find(Array.isArray);
    if (namedList) {
      return namedList;
    }

    if (!("data" in current)) {
      return null;
    }
    current = current.data;
  }

  return Array.isArray(current) ? current : null;
}

export function getObjectPayload(value: unknown): unknown {
  let current = value;

  for (let depth = 0; depth < 4; depth += 1) {
    if (!isRecord(current)) {
      return current;
    }

    if (isRecord(current.complaint)) {
      current = current.complaint;
      continue;
    }

    if (!("data" in current)) {
      return current;
    }
    current = current.data;
  }

  return current;
}

export function normalizeComplaint(value: unknown): ManagerComplaint | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = getText(value.id) ?? getText(value._id);
  if (!id) {
    return null;
  }

  const citizen = getNestedRecord(value, [
    "citizen",
    "createdBy",
    "user",
    "complainant",
  ]);
  const technician = getNestedRecord(value, [
    "assignee",
    "assignedTo",
    "assignedTechnician",
  ]);
  const payment = getNestedRecord(value, ["payment"]);
  const paymentStatus =
    getText(value.paymentStatus) ??
    getText(value.payment_status) ??
    getText(payment?.status) ??
    getText(payment?.paymentStatus) ??
    getText(payment?.payment_status);
  const technicianValue =
    value.assigneeId ??
    value.assignedToId ??
    value.technicianId ??
    value.assignedTechnician;
  const technicianId =
    getText(technicianValue) ??
    (technician
      ? (getText(technician.id) ?? getText(technician._id))
      : undefined);

  return {
    id,
    title: getText(value.title) ?? getText(value.complaintTitle) ?? "Complaint",
    description: getText(value.description),
    status: getText(value.status) ?? "Unknown",
    createdAt: getText(value.createdAt),
    department: getText(value.department),
    category: getText(value.category),
    location: getText(value.location),
    paymentStatus,
    citizenName: citizen ? getText(citizen.name) : getText(value.citizenName),
    citizenEmail: citizen ? getText(citizen.email) : undefined,
    technicianId,
    technicianName: technician ? getText(technician.name) : undefined,
  };
}

export function normalizeTechnician(value: unknown): Technician | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = getText(value.id) ?? getText(value._id);
  const email = getText(value.email);
  const name = getText(value.name) ?? email;

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    role: getText(value.role),
    email: email ?? "",
  };
}

export function normalizeComplaints(value: unknown): ManagerComplaint[] {
  const records = getArrayPayload(value);
  if (!records) {
    throw new Error("The complaints response has an unexpected format.");
  }

  const complaints = records.map(normalizeComplaint);
  if (complaints.some((complaint) => complaint === null)) {
    throw new Error("The complaints response contains an invalid record.");
  }

  return complaints.filter(
    (complaint): complaint is ManagerComplaint => complaint !== null,
  );
}

function getPositiveInteger(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function getNonNegativeInteger(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return undefined;
}

export function normalizeComplaintPage(
  value: unknown,
  requestedPage: number,
  requestedLimit: number,
): ManagerComplaintPage {
  let current = value;
  let pagination: Record<string, unknown> | undefined;

  for (let depth = 0; depth < 4 && isRecord(current); depth += 1) {
    if (isRecord(current.meta)) {
      pagination = current.meta;
    } else if (isRecord(current.pagination)) {
      pagination = current.pagination;
    } else if ("total" in current || "totalCount" in current) {
      pagination = current;
    }

    if (!("data" in current)) {
      break;
    }
    current = current.data;
  }

  const complaints = normalizeComplaints(value);
  const total =
    getNonNegativeInteger(pagination?.total) ??
    getNonNegativeInteger(pagination?.totalCount) ??
    complaints.length;
  const totalPages =
    getPositiveInteger(pagination?.totalPage) ??
    getPositiveInteger(pagination?.totalPages) ??
    Math.max(1, Math.ceil(total / requestedLimit));
  const page = getPositiveInteger(pagination?.page) ?? requestedPage;

  return { complaints, page, totalPages, total };
}

export function normalizeTechnicians(value: unknown): Technician[] {
  const records = getArrayPayload(value);
  if (!records) {
    throw new Error("The technicians response has an unexpected format.");
  }

  const technicians = records.map(normalizeTechnician);
  if (technicians.some((technician) => technician === null)) {
    throw new Error("The technicians response contains an invalid record.");
  }

  return technicians.filter(
    (technician): technician is Technician => technician !== null,
  );
}
//
export function normalizeComplaintPayload(value: unknown): ManagerComplaint {
  const complaint = normalizeComplaint(getObjectPayload(value));
  if (!complaint) {
    throw new Error("The complaint details response has an unexpected format.");
  }

  return complaint;
}

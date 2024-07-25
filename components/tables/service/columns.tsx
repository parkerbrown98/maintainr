"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { ServiceRecord } from "@/drizzle/schema";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import moment from "moment";
import { SERVICE_TYPES } from "@/lib/constants";

export const columns: ColumnDef<ServiceRecord>[] = [
  {
    accessorKey: "serviceType",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Service" />;
    },
    cell: ({ getValue }) => {
      const serviceType = getValue() as keyof typeof SERVICE_TYPES;
      return <span className="font-medium">{SERVICE_TYPES[serviceType]}</span>;
    }
  },
  {
    accessorKey: "odometer",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Odometer" />;
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Cost" />;
    },
  },
  {
    accessorKey: "serviceDate",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Date" />;
    },
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return moment(date).format("MM/DD/YYYY");
    },
  },
];

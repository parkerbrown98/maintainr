"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { ServiceRecord } from "@/drizzle/schema";
import { DataTableHeader } from "@/components/ui/data-table/data-table-header";
import moment from "moment";
import { SERVICE_TYPES } from "@/lib/constants";
import { useSheet } from "@/lib/hooks/sheet";
import { useService } from "@/lib/hooks/service";
import { UnitFormat } from "@/components/unit-format";
import { ServiceDataTableRowActions } from "./row-actions";

export const columns: ColumnDef<ServiceRecord>[] = [
  {
    accessorKey: "serviceType",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Service" />;
    },
    cell: ({ getValue, row }) => {
      const sheet = useSheet();
      const { setService } = useService();
      const serviceType = getValue() as keyof typeof SERVICE_TYPES;

      const openSheet = () => {
        setService(row.original);
        sheet.setOpen(true);
      };

      return (
        <div
          onClick={openSheet}
          className="font-medium hover:underline cursor-pointer"
        >
          {SERVICE_TYPES[serviceType]}
        </div>
      );
    },
  },
  {
    accessorKey: "odometer",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Odometer" />;
    },
    cell: ({ row }) => {
      return row.getValue("odometer") ? (
        <UnitFormat value={row.getValue("odometer")} unit="length" />
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return <DataTableHeader column={column} title="Cost" />;
    },
    cell: ({ getValue }) => {
      const cost = getValue() as number;
      return cost ? (
        "$" +
        cost.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      ) : "N/A";
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
  {
    id: "actions",
    cell: ({ row }) => {
      return <ServiceDataTableRowActions service={row.original} />;
    },
  },
];

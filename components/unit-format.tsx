"use client";

import { useUser } from "@/lib/hooks/auth";
import convert, { Unit } from "convert";

function getFromToUnit(
  unitType: "imperial" | "metric",
  unit: "length" | "volume" | "weight"
): [Unit, Unit] {
  const lengthUnit = unitType === "imperial" ? "mi" : "km";
  const volumeUnit = unitType === "imperial" ? "gal" : "liter";
  const weightUnit = unitType === "imperial" ? "pounds" : "kg";

  switch (unit) {
    case "length":
      return ["mi", lengthUnit];
    case "volume":
      return ["gal", volumeUnit];
    case "weight":
      return ["pounds", weightUnit];
    default:
      throw new Error("Invalid unit type");
  }
}

interface UnitFormatProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  unit: "length" | "volume" | "weight";
}

export function UnitFormat({ value, unit, ...props }: UnitFormatProps) {
  const { preferences } = useUser();

  if (!preferences) {
    return <span {...props}>{value}</span>;
  }

  let unitType;
  switch (unit) {
    case "length":
      unitType = preferences.lengthUnits;
      break;
    case "volume":
      unitType = preferences.volumeUnits;
      break;
    case "weight":
      unitType = preferences.weightUnits;
      break;
    default:
      throw new Error("Invalid unit type");
  }

  const [fromUnit, toUnit] = getFromToUnit(unitType, unit);
  const convertedValue = convert(value, fromUnit).to("best", unitType);
  const roundedValue = Math.round(convertedValue.quantity * 100) / 100;
  const formattedValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(roundedValue);
  
  return <span {...props}>{formattedValue + " " + convertedValue.unit}</span>;
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/validations/organization";
import { useOnboardingStore } from "@/store/onboarding-store";
import { INDUSTRIES, EMPLOYEE_COUNTS, COUNTRIES, MONTHS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function CompanyForm() {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCompanyData, setStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      fiscalYearStart: 1,
    },
  });

  async function onSubmit(data: CreateOrganizationInput) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to create organization");
        return;
      }

      const org = await res.json();

      // Update session with new organizationId
      await updateSession({ organizationId: org.id });

      // Store data for subsequent steps
      setCompanyData({
        companyName: data.name,
        employeeCount: data.employeeCount,
        country: data.country,
        city: data.city || "",
        industry: data.industry,
        fiscalYearStart: data.fiscalYearStart,
      });
      setStep(2);

      router.push("/onboarding/industry");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Company name *</Label>
        <Input
          id="name"
          placeholder="Acme Corp"
          {...register("name")}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Number of employees *</Label>
          <Select
            onValueChange={(value) => setValue("employeeCount", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_COUNTS.map((ec) => (
                <SelectItem key={ec.value} value={ec.value}>
                  {ec.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employeeCount && (
            <p className="text-sm text-red-500">
              {errors.employeeCount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Industry *</Label>
          <Select
            onValueChange={(value) => setValue("industry", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Country *</Label>
          <Select
            onValueChange={(value) => setValue("country", value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="San Francisco"
            {...register("city")}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fiscal year start month</Label>
        <Select
          defaultValue="1"
          onValueChange={(value) => setValue("fiscalYearStart", parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value.toString()}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Continue
      </Button>
    </form>
  );
}

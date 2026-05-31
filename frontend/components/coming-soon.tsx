import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
}

export function ComingSoon({ title, description, features }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Command Center
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center p-12">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-6">
            <Construction className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Coming Soon</h2>
          <p className="mt-4 text-lg text-slate-600">
            This feature is currently under development and will be available in the next release.
          </p>

          {features && features.length > 0 && (
            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-left">
              <h3 className="text-sm font-semibold text-slate-900">Planned Features:</h3>
              <ul className="mt-4 space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Go to Command Center
            </Link>
            <Link
              href="/inventory"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

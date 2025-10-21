import TestRunner from "@/components/TestRunner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UnixType Test Suite - Comprehensive Testing Platform",
  description: "Run comprehensive tests on UnixType application including functionality, accessibility, performance, security, and more.",
};

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-unix-bg via-unix-bg/95 to-unix-bg/90">
      <div className="container mx-auto px-4 py-8">
        <TestRunner />
      </div>
    </div>
  );
}
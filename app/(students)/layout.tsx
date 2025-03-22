"use client"; // Mark this as a Client Component to use hooks and interactivity

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/utils/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isStudent, setIsStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch the current user's role
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // No user found, wait 1 second and then redirect to sign-in page
          setTimeout(() => {
            router.push("/sign-in");
          }, 1000); // 1000 milliseconds = 1 second
          return;
        }

        // Fetch the user's profile or role from the `users` table
        const { data: userData, error: userError } = await supabase
          .from("user") // Use the correct table name
          .select("userType")
          .eq("userid", user.id)
          .single();

        if (userError) throw userError;

        // Check if the user is a student
        if (userData?.userType === "STUDENT") {
          setIsStudent(true);
        } else if (userData?.userType === "ADMIN") {
          // Redirect admin to the admin dashboard
          router.push("/admin/dashboard");
        } else {
          // User is not a student, wait 1 second and then redirect to sign-in page
          setTimeout(() => {
            router.push("/sign-in");
          }, 1000); // 1000 milliseconds = 1 second
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        // Redirect to sign-in page on error after 1 second
        setTimeout(() => {
          router.push("/sign-in");
        }, 1000); // 1000 milliseconds = 1 second
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [router]);

  // Show a loading state while checking the user's role
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className="mx-12">
        <Header />
        <div className="pb-10">{children}</div>
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
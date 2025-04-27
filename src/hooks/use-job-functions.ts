import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { JobFunction } from "@/types/database";
import { useOrganization } from "./use-organization";

export function useJobFunctions() {
  const [jobFunctions, setJobFunctions] = useState<JobFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { organization } = useOrganization();

  useEffect(() => {
    async function fetchJobFunctions() {
      if (!organization) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, "jobFunctions"),
          where("organizationId", "==", organization.id),
          orderBy("name")
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JobFunction[];
        
        setJobFunctions(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching job functions:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch job functions"));
      } finally {
        setLoading(false);
      }
    }

    fetchJobFunctions();
  }, [organization]);

  return { jobFunctions, loading, error };
} 
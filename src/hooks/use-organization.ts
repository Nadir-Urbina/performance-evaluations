import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Organization } from "@/types/database";
import { useAuth } from "@/providers/auth-provider";

export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrganization() {
      if (!user || !user.organizationId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const docRef = doc(db, "organizations", user.organizationId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrganization({
            id: docSnap.id,
            ...docSnap.data()
          } as Organization);
          setError(null);
        } else {
          setError(new Error("Organization not found"));
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch organization"));
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, [user]);

  return { organization, loading, error };
} 
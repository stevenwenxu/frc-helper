import { useEffect, useState } from "react";
import { Family } from "../../common/models/family";
import { FamilyRepository } from "../../common/family_repository";

export function useFamily(familyId: string) {
  const [family, setFamily] = useState<Family | null>(null);

  useEffect(() => {
    let ignore = false;
    FamilyRepository.getFamilyWithUniqueId(familyId).then((family) => {
      if (!ignore) {
        setFamily(family);
      }
    });
    return () => {
      ignore = true;
    }
  }, [familyId]);

  return family;
}

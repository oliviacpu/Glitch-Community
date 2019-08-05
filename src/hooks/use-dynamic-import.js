import { useEffect, useState } from 'react';

function useDynamicImport(importArgs) {
  const [importedPackage, setImportedPackage] = useState(null);
  useEffect(() => {
    if (importedPackage) return importedPackage;
    const importPackage = async () => {
      setImportedPackage(await import(importArgs));
      console.log(importedPackage);
    };
    importPackage();
  });
  return importedPackage;
}

export default useDynamicImport;

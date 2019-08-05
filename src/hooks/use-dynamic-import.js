import { useEffect, useState } from 'react';

function useDynamicImport(importArgs) {
  const [importedPackage, setImportedPackage] = useState(null);
  useEffect(() => {
    console.log('ineffect');
    if (importedPackage) return importedPackage;
    const importPackage = async () => {
      setImportedPackage(await import(importArgs));
      console.log(importedPackage);
    };
    importPackage();
  });
}

export default useDynamicImport;
